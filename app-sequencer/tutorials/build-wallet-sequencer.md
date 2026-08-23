---
title: "Build an ERC-20 wallet with the App Sequencer"
sidebar_label: "Build a sequenced wallet"
description: "Build a Cartesi ERC-20 wallet from source, connect it to the App Sequencer, run it locally, and submit signed operations."
---

import WorkspaceCargo from './snippets/_wallet-workspace-cargo.md';
import CoreCargo from './snippets/_wallet-core-cargo.md';
import CoreLib from './snippets/_wallet-core-lib.md';
import WalletMethod from './snippets/_wallet-method.md';
import WalletApplication from './snippets/_wallet-application.md';
import WalletSequencer from './snippets/_wallet-sequencer.md';
import WalletCanonical from './snippets/_wallet-canonical.md';
import WalletMachine from './snippets/_wallet-machine.md';
import WalletClient from './snippets/_wallet-client.md';

In this tutorial, you will build a Cartesi wallet and its application-specific sequencer from an empty directory. You will write the shared application logic, create the host sequencer and canonical Cartesi Machine programs, package the machine, and submit a deposit, transfer, and withdrawal on a local network.

The tutorial uses the sequencer [`v0.1.0-alpha.9` release](https://github.com/cartesi/sequencer/releases/tag/v0.1.0-alpha.9).

By the end, the project will support two input paths:

- ERC-20 deposits enter through the base layer and reach the wallet as direct inputs.
- Transfers and withdrawals are signed by users and sent to the sequencer for fast ordering.


## Understand the project you will build

The application is divided into three Rust crates and one client:

| Component | Runs in | Responsibility |
| --- | --- | --- |
| `app-core` | Both execution paths | Implements wallet state, deposits, transfers, withdrawals, fees, nonces, and snapshots |
| `app-sequencer` | Host system | Accepts signed user operations, predicts execution, forms batches, and submits them to the base layer |
| `canonical-app` | Cartesi Machine | Applies direct inputs and sequencer batches in the canonical order |
| `client` | User system | Encodes and signs wallet operations and reads the ordered feed |

Keeping the application logic in `app-core` ensures that the host sequencer and Cartesi Machine execute the same rules. This follows the structure recommended in [Application integration](../usage/integration.md#recommended-project-structure).

## Prerequisites

Install these tools before continuing:

- Cartesi CLI `2.0.0-alpha.35`;
- Docker with the Buildx plugin;
- Rust `1.95.0` or later, and Cargo;
- [`cross`](https://github.com/cross-rs/cross) for the RISC-V build, installed with `cargo install cross --git https://github.com/cross-rs/cross`;
- Foundry, for the `cast` command used to mint test tokens;
- Node.js 20 or later and npm;
- `jq` and `curl`.

Check the main commands:

```bash
cartesi --version
docker buildx version
rustc --version
cargo --version
cross --version
cast --version
node --version
npm --version
jq --version
```

Outside a Cargo project, `cross --version` prints two warning lines about missing package metadata and falling back to the host cargo. That is expected and does not mean the install failed.

Docker must be running before you build the canonical application or start the local Cartesi environment.

## Step 1: create the project structure

Create an empty project and the directories for each component:

```bash
mkdir wallet-sequencer-tutorial
cd wallet-sequencer-tutorial
export PROJECT_ROOT=$PWD

mkdir -p app-core/src
mkdir -p app-sequencer/src
mkdir -p canonical-app/src
mkdir -p client
mkdir -p machine/out
```

The final repository structure would look like the below directory structure so ensure to follow the subsequent steps correctly:

```text
wallet-sequencer-tutorial/
├── app-core/
│   ├── src/
│   │   ├── lib.rs
│   │   ├── method.rs
│   │   └── wallet.rs
│   └── Cargo.toml
├── app-sequencer/
│   ├── src/main.rs
│   └── Cargo.toml
├── canonical-app/
│   ├── src/main.rs
│   └── Cargo.toml
├── client/
│   ├── feed.mjs
│   ├── package.json
│   └── wallet-client.mjs
├── machine/
│   ├── out/
│   └── Dockerfile
├── Cargo.toml
├── Cross.toml
└── cartesi.toml
```

Later steps use `$PROJECT_ROOT` to return here from other terminals. Export it again in each new terminal you open.

The `machine/out` directory will receive the compiled RISC-V binary. The `sequencer-data` directory will be created later when you initialize the sequencer.

## Step 2: configure the Rust workspace

Create the root `Cargo.toml` and copy this configuration into it:

<WorkspaceCargo />

The three `sequencer` dependencies point to the same Git tag. Keeping them on one release prevents the runtime, shared protocol types, and canonical scheduler from drifting apart.

The `types` and `trolley` revisions match the versions selected by that sequencer release. They provide the portal payload types and Cartesi Machine I/O used by this application.

## Step 3: define the wallet operations

Create `app-core/Cargo.toml`:

<CoreCargo />

Create `app-core/src/lib.rs` to expose the types needed by the two executables:

<CoreLib />

Create `app-core/src/method.rs`:

<WalletMethod />

The `Method` enum uses Simple Serialize, or SSZ. The union selector is `0` for `Withdrawal` and `1` for `Transfer`. Both operations carry a 256-bit amount, and a transfer also carries a 20-byte recipient address.

The maximum method size is therefore one selector byte, 32 amount bytes, and 20 address bytes.

## Step 4: implement the shared wallet state

Create `app-core/src/wallet.rs`:

<WalletApplication />

This file implements the complete `Application` contract required by the sequencer:

- `validate_user_op` checks the sender's next nonce and ability to pay the frame fee.
- `execute_valid_user_op` charges the fee, advances the nonce, and applies a transfer or withdrawal.
- `execute_direct_input` recognizes ERC-20 portal deposits and credits the depositor.
- the progress methods track the last safe block and number of executed inputs.
- the dump methods save and restore crash-recovery state.
- `canonical_snapshot_bytes` sorts addresses before serialization so the same logical state always produces the same bytes.

The fixed addresses come from the local environment created by the Cartesi CLI. The batch submitter is Anvil account 9. Its address is used both to classify canonical batches and to receive this tutorial wallet's fees.

:::caution Method execution in this example
The application validates the nonce and fee balance before inclusion. It still charges the fee and advances the nonce if a method is malformed or if the remaining balance cannot cover the requested transfer or withdrawal. Such an operation produces no method output. Production applications should define and test their failure policy explicitly.
:::

## Step 5: create the host sequencer

Create `app-sequencer/Cargo.toml` and `app-sequencer/src/main.rs`:

<WalletSequencer />

The executable is small because the released `sequencer` crate supplies command parsing, setup, storage, the HTTP and WebSocket API, batching, submission, and recovery. The closure passed to `run_main` creates the application's genesis state during `setup`.

When compiled, this program provides three commands:

```text
app-sequencer setup
app-sequencer run
app-sequencer flush-mempool
```

This tutorial uses `setup` and `run`.

## Step 6: create the canonical application

Create `canonical-app/Cargo.toml` and `canonical-app/src/main.rs`:

<WalletCanonical />

`run_scheduler_forever` reads inputs inside the Cartesi Machine. Inputs sent by `BATCH_SUBMITTER_ADDRESS` are decoded as sequencer batches. Other inputs, including portal deposits, enter the direct-input queue.

The same `WalletApp` type runs here and in the host sequencer. The shared type is the main protection against different execution rules on the two paths.

## Step 7: configure the Cartesi Machine build

Create `Cross.toml`, `cartesi.toml`, and `machine/Dockerfile`:

<WalletMachine />

The `cross` image and runtime image are pinned to the same versions used by the sequencer release. `cross` compiles `wallet-canonical` for RISC-V. The Dockerfile then places that binary and `cartesi-init` in the root file system that the Cartesi CLI turns into a Cartesi Machine.

## Step 8: create the client and feed subscriber

Create `client/package.json`, `client/wallet-client.mjs`, and `client/feed.mjs`:

<WalletClient />

Install the JavaScript dependencies:

```bash
cd client
npm install
cd ..
```

The wallet client performs four tasks:

1. encodes the selected wallet method with SSZ;
2. builds a `UserOp` containing the sender's nonce, maximum fee, and method bytes;
3. signs the operation with the sequencer's EIP-712 domain;
4. sends the signed request to `POST /tx`.

The feed subscriber connects to `/ws/subscribe` with offset `0`. It first receives stored events whose offsets are greater than zero, then continues with new events.

## Step 9: build every component

Check the host crates first:

```bash
cargo check -p app-core -p app-sequencer
cargo build --release -p app-sequencer
```

Compile the canonical program for the Cartesi Machine:

```bash
SOURCE_DATE_EPOCH=0 \
CARGO_PROFILE_RELEASE_STRIP=symbols \
cross build \
  --package wallet-canonical \
  --target riscv64gc-unknown-linux-musl \
  --release

cp \
  target/riscv64gc-unknown-linux-musl/release/wallet-canonical \
  machine/out/dapp
```

Package the binary as a Cartesi Machine:

```bash
cartesi build
```

The first build downloads the Rust dependencies, cross-compilation image, Cartesi SDK, guest tools, and RISC-V runtime image. Later builds reuse Docker and Cargo caches.

## Step 10: start the local Cartesi environment

Run the Cartesi application from the project root:

```bash
cartesi run --block-time 1 --default-block safe
```

Keep this terminal open. When startup finishes, the CLI prints the local application URL, Anvil RPC URL, machine hash, and deployed application address.

The commands below assume the default port and project name. Open a second terminal and return to the project root:

```bash
export PROJECT_ROOT=/path/to/wallet-sequencer-tutorial
cd "$PROJECT_ROOT"

export L1_RPC=http://127.0.0.1:6751/anvil
export APP_ADDRESS=$(cartesi address-book --json | jq -r .Application)
export SEQUENCER_URL=http://127.0.0.1:3000
export CHAIN_ID=31337
export MAX_FEE=2000

echo "$APP_ADDRESS"
```

Every later terminal reuses `SEQUENCER_URL`, so if you change the sequencer's port in Step 12, change it here and export the same value everywhere.

If you passed a custom port or project name to `cartesi run`, pass the matching values to `cartesi address-book` and update `L1_RPC`.

## Step 11: initialize the sequencer

The sequencer stores deployment identity, application snapshots, batches, and feed offsets in its data directory. Initialize that directory once:

```bash
CARTESI_SEQUENCER_BLOCKCHAIN_HTTP_ENDPOINT="$L1_RPC" \
CARTESI_SEQUENCER_BLOCKCHAIN_ID="$CHAIN_ID" \
CARTESI_SEQUENCER_APP_ADDRESS="$APP_ADDRESS" \
CARTESI_SEQUENCER_BATCH_SUBMITTER_ADDRESS=0xa0Ee7A142d267C1f36714E4a8F75612F20a79720 \
CARTESI_SEQUENCER_DATA_DIR=./sequencer-data \
CARTESI_SEQUENCER_FEE_ORACLE_FIXED_LOG_GAS_PRICE=0 \
CARTESI_SEQUENCER_SECONDS_PER_BLOCK=1 \
  ./target/release/app-sequencer setup
```

The fixed fee oracle is required because chain ID `31337` has no public-network fee oracle preset. Setup fails on an unknown chain without it.

A fee is an exponent, not a token amount, so `0` here does not mean transactions are free. The sequencer adds fixed per-operation terms to the configured gas price, which gives every frame in this tutorial a price of `1356`. Decoded, that is `38276` of the wallet's smallest units, and it is what each operation is charged. [Fees and data availability](../concepts/fees.md) explains the encoding.

Plain `setup` uses the submitter address but does not require its private key or send a transaction.

## Step 12: start the sequencer

Run the sequencer with the private key for Anvil account 9:

```bash
CARTESI_SEQUENCER_BLOCKCHAIN_HTTP_ENDPOINT="$L1_RPC" \
CARTESI_SEQUENCER_AUTH_PRIVATE_KEY=0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6 \
CARTESI_SEQUENCER_DATA_DIR=./sequencer-data \
CARTESI_SEQUENCER_SECONDS_PER_BLOCK=1 \
CARTESI_SEQUENCER_MAX_BATCH_OPEN_SECONDS=5 \
CARTESI_SEQUENCER_BATCH_SUBMITTER_IDLE_POLL_INTERVAL_MS=500 \
CARTESI_SEQUENCER_BATCH_SUBMITTER_CONFIRMATION_DEPTH=0 \
  ./target/release/app-sequencer run
```

:::warning Development key
This is a public Anvil test key. Never fund it or use it on a public network. Use a protected key file for an operated deployment.
:::

The shorter batch interval keeps the local exercise moving. Wait until the sequencer reports that it is ready, then verify it from another terminal:

```bash
curl --fail "$SEQUENCER_URL/readyz"
```

The sequencer listens on `127.0.0.1:3000` by default. If that port is already in use, the process exits with `Address already in use`. Add `CARTESI_SEQUENCER_HTTP_ADDR=127.0.0.1:<port>` to the command above and export a matching `SEQUENCER_URL` in every terminal.

## Step 13: watch the ordered feed

Open another terminal, enter the client directory, and start the subscriber:

```bash
cd "$PROJECT_ROOT/client"
export SEQUENCER_URL=http://127.0.0.1:3000
npm run feed
```

Leave this process running. It will print the direct input and the two signed operations used in the following steps.

## Step 14: deposit test tokens

Return to a terminal at the project root. The local test token is deployed with no supply, so mint some for Anvil account 0 first:

```bash
cd "$PROJECT_ROOT"
export TEST_TOKEN=$(cartesi address-book --json | jq -r .TestToken)

cast send "$TEST_TOKEN" "mint(uint256)" 1000000000000000000000 \
  --rpc-url "$L1_RPC" \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

The token's symbol is `FUN`, and `mint` credits the account that sends the transaction. Now deposit one token into the wallet for that account:

```bash
cartesi deposit erc20 1 --token "$TEST_TOKEN"
```

The Cartesi CLI approves the local ERC-20 portal and submits the deposit for the current application. Without `--token`, the command prompts for the token address with the correct value already filled in.

The environment runs with `--default-block safe`, so the sequencer sees the deposit only once the safe head passes the block that recorded it. Expect to wait up to a minute or two.

The feed subscriber then prints a `direct_input` event. Its `sender` is the ERC-20 portal, and its payload contains the token address, account 0 address, amount, and execution-layer data.

One token has 18 decimal places in this environment, so the wallet credits account 0 with `1000000000000000000` units.

## Step 15: transfer tokens through the sequencer

Use Anvil account 0 as Alice and account 1 as Bob:

```bash
cd "$PROJECT_ROOT/client"

export SEQUENCER_URL=http://127.0.0.1:3000
export CHAIN_ID=31337
export MAX_FEE=2000
export APP_ADDRESS=$(cd .. && cartesi address-book --json | jq -r .Application)

export ALICE_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
export BOB_ADDRESS=0x70997970C51812dc3A010C7d01b50e0d17dc79C8
export WALLET_PRIVATE_KEY="$ALICE_PRIVATE_KEY"

npm run wallet -- \
  transfer \
  "$BOB_ADDRESS" \
  400000000000000000 \
  0
```

Alice's first nonce is `0`. The client transfers `0.4` token and prints a response similar to:

```text
Application payload: 0x01...
Soft confirmation: { ok: true, sender: '0xf39F...', nonce: 0 }
```

The feed prints the operation as a `user_op`. Its `data` starts with `0x01`, the SSZ selector for a transfer.

The successful response is a soft confirmation. It means the sequencer validated, executed, and stored the operation in its provisional order. It does not mean that the operation has settled on the base layer.

`MAX_FEE` is the highest fee exponent the operation will accept. The sequencer rejects a submission with HTTP `422` and code `EXECUTION_REJECTED` when it falls below the frame's price, which is `1356` here, so `2000` leaves room. An accepted operation is charged the frame price, not its own maximum.

## Step 16: request a withdrawal

Bob received `0.4` token and has not sent an operation, so his next nonce is also `0`. Select Bob's key and request a withdrawal of `0.1` token:

```bash
export BOB_PRIVATE_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
export WALLET_PRIVATE_KEY="$BOB_PRIVATE_KEY"

npm run wallet -- \
  withdraw \
  100000000000000000 \
  0
```

The sequencer returns another soft confirmation. The feed shows a `user_op` whose data starts with `0x00`, the withdrawal selector.

During application execution, the wallet deducts the frame fee and withdrawal amount from Bob's wallet balance. The canonical application emits an ERC-20 transfer voucher for the requested amount. Executing that voucher on the base layer is a separate settlement step and is outside this tutorial.

## Step 17: inspect the sequencer state

The five-second batch interval closes the open batch shortly after the operations are submitted. Fetch the most recent wallet snapshot:

```bash
sleep 6
curl --fail --silent "$SEQUENCER_URL/latest_snapshot" | jq
```

The snapshot contains the sorted balances, per-sender nonces, executed input count, and last executed safe block. Alice and Bob each have nonce `1`. Their balances also reflect the transfer, withdrawal, and fees charged by the wallet.

`/latest_snapshot` is an operator endpoint. It is useful for this local inspection, but it has no authentication and must not be exposed publicly.

## What you built

The running system now demonstrates the complete integration path:

1. The portal deposit entered through the base layer as a direct input.
2. Alice signed a transfer and received a soft confirmation from the sequencer.
3. Bob signed a withdrawal and received a soft confirmation.
4. The WebSocket feed delivered all three inputs in execution order.
5. The host sequencer formed and submitted batches while the Cartesi Machine applied the canonical scheduling rules.

The shared `app-core` crate made both execution paths use the same wallet rules and snapshot format. The batch submitter address was also kept consistent in the canonical scheduler, sequencer setup, and runtime key.

## Next steps

- Read [Application requirements](../usage/application-requirements.md) before replacing the tutorial wallet with production application logic.
- Use [Application integration](../usage/integration.md) to adapt the three-crate structure to an existing project.
- Follow [Submitting operations](../usage/submitting-operations.md) for client retry, nonce, and fee handling.
- Follow [Reading the sequenced feed](../usage/reading-the-feed.md) to add durable cursor storage and reconnection.
- Review [Soft confirmations](../concepts/soft-confirmations.md) before presenting sequencer responses as application outcomes.
