---
title: "Quickstart"
sidebar_label: "Quickstart"
description: "Run a prepared sequencer, submit a signed transaction, and find it in the ordered feed."
---

import FeedClient from '../snippets/_feed-client.md';
import SubmitClient from '../snippets/_submit-client.md';

This guide covers the client loop for an application that is already deployed and prepared: initialize its sequencer, start the service, submit one application transaction, and read that transaction from the ordered feed.

If you do not yet have a deployed application and a valid application payload, start with [Build an ERC-20 wallet with the App Sequencer](../tutorials/build-wallet-sequencer.md). That tutorial builds every component, funds the wallet, and submits its first transaction.

## Prerequisites

You need:

- a local base-layer node, usually Anvil, available at `http://127.0.0.1:8545`;
- a deployed Cartesi application contract whose data-availability configuration points to an `InputBox`;
- an application-specific sequencer binary built with that application's `Application` implementation;
- a funded base-layer account dedicated to submitting batches;
- a user account with the application state required to pass nonce, fee-balance, and method validation;
- Node.js and npm, plus `curl`.

If you are building the application-specific sequencer or running the reference binary from source, you also need the Rust toolchain and Cargo. The reference-wallet preparation later in this guide additionally uses the Cartesi CLI, Foundry, and `jq`.

The sequencer is a library that each application builds into its own executable. If your application does not have one yet, follow [Application integration](./integration.md). The sequencer repository's `examples/wallet-sequencer` crate is a reference binary, but its wallet state and method encoding must still match the application deployment you use.

:::note Application-specific preparation is required
The sequencer can sign and transport application payloads, but it cannot create them or fund application accounts. Before submitting, provide bytes your application can decode and prepare any state its validation requires. The reference wallet example below shows both steps for a local deployment.
:::

## Step 1: initialize the sequencer data directory

`setup` creates the initial application snapshot and records the deployment identity in the data directory. It reads from the base layer but sends no transaction, so it needs the batch submitter's address and never its private key.

```bash
export APP_ADDRESS=0xYourApplicationAddress
export SUBMITTER_ADDRESS=0xYourBatchSubmitterAddress
export SEQUENCER_DATA_DIR=./sequencer-data

export CARTESI_SEQUENCER_BLOCKCHAIN_HTTP_ENDPOINT=http://127.0.0.1:8545
export CARTESI_SEQUENCER_BLOCKCHAIN_ID=31337
export CARTESI_SEQUENCER_APP_ADDRESS=$APP_ADDRESS
export CARTESI_SEQUENCER_BATCH_SUBMITTER_ADDRESS=$SUBMITTER_ADDRESS
export CARTESI_SEQUENCER_DATA_DIR=$SEQUENCER_DATA_DIR
export CARTESI_SEQUENCER_FEE_ORACLE_FIXED_LOG_GAS_PRICE=0

./app-sequencer setup
```

Replace `./app-sequencer` with your executable. If you are working inside the sequencer repository, keep the exported configuration and run the reference binary with:

```bash
cargo run -p wallet-sequencer --bin wallet-sequencer-devnet -- setup
```

The `wallet-sequencer-devnet` binary selects the reference wallet's local development configuration. The standard `wallet-sequencer` binary uses its non-local configuration.

The application contract must be deployed before this step. During setup, the sequencer verifies the chain identifier and discovers the application's `InputBox` through the contract's data-availability configuration.

The fixed fee-oracle value makes the example work on local chain ID `31337`, which has no public-network fee-source preset. Configure the supported fee source for an operated deployment instead of copying this development value.

`setup` is idempotent for an already prepared data directory. Keep the directory because `run` reads the pinned identity and genesis state from it.

## Step 2: start the sequencer

Put the batch-submitter private key in a file readable only by the current user. The key must derive the address supplied during setup.

```bash
install -m 600 /dev/null /tmp/batch-submitter.key
```

Open `/tmp/batch-submitter.key` in an editor, place the hexadecimal private key on its first line, and start the sequencer:

```bash
CARTESI_SEQUENCER_BLOCKCHAIN_HTTP_ENDPOINT=http://127.0.0.1:8545 \
CARTESI_SEQUENCER_AUTH_PRIVATE_KEY_FILE=/tmp/batch-submitter.key \
CARTESI_SEQUENCER_DATA_DIR=$SEQUENCER_DATA_DIR \
  ./app-sequencer run
```

Leave this process running. `run` obtains the chain identifier, application address, and batch-submitter address from the data directory. A key for a different address causes startup to fail.

The API listens on `127.0.0.1:3000` by default. In another terminal, verify readiness:

```bash
curl --fail http://127.0.0.1:3000/readyz
```

A loopback RPC endpoint may use plaintext HTTP. Remote RPC endpoints require HTTPS unless the operator explicitly allows HTTP on a trusted private network. See [Configure, set up, and run the sequencer](../operations/setup-and-running.md).

## Step 3: sign and submit a transaction

Create a small client directory and install its dependencies:

```bash
mkdir -p sequencer-client
cd sequencer-client
npm init --yes
npm install viem ws
```

The application defines the bytes placed in `UserOp.data`. For your own application, use its encoder and assign the resulting hexadecimal value to `METHOD_DATA`.

### Prepare a reference wallet transaction

If the deployment uses the reference wallet, its sender must first have a wallet balance. This local path also requires the Cartesi CLI, Foundry, and `jq`. The following commands mint the CLI test token to Anvil account 0 and deposit one token through the ERC-20 portal. Run them from the Cartesi application project directory in another terminal, with the local environment and sequencer running:

```bash
export L1_RPC=$CARTESI_SEQUENCER_BLOCKCHAIN_HTTP_ENDPOINT
export TEST_TOKEN=$(cartesi address-book --json | jq -r .TestToken)
export DEV_USER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

cast send "$TEST_TOKEN" "mint(uint256)" 1000000000000000000000 \
  --rpc-url "$L1_RPC" \
  --private-key "$DEV_USER_PRIVATE_KEY"

cartesi deposit erc20 1 --token "$TEST_TOKEN"
```

The private key above is a public Anvil development key. Never use it or fund it on a public network. Wait until the safe base-layer head passes the deposit block before submitting the wallet operation.

Return to the `sequencer-client` directory. The reference wallet encodes a transfer as a one-byte selector, a 32-byte little-endian amount, and a 20-byte recipient address. Create `encode-wallet-transfer.mjs` there:

```js
import { concatHex, getAddress } from "viem";

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function uint256LittleEndian(value) {
  if (value < 0n || value >= 1n << 256n) {
    throw new Error("value does not fit in uint256");
  }
  const bigEndian = value.toString(16).padStart(64, "0");
  return `0x${Buffer.from(bigEndian, "hex").reverse().toString("hex")}`;
}

const payload = concatHex([
  "0x01",
  uint256LittleEndian(BigInt(required("TRANSFER_AMOUNT"))),
  getAddress(required("TRANSFER_RECIPIENT")),
]);

console.log(payload);
```

Encode a transfer of `0.4` token to Anvil account 1:

```bash
export TRANSFER_RECIPIENT=0x70997970C51812dc3A010C7d01b50e0d17dc79C8
export TRANSFER_AMOUNT=400000000000000000
export METHOD_DATA=$(node encode-wallet-transfer.mjs)
```

For another application, replace this encoder and funding procedure with the rules defined by that application.

### Sign and submit the payload

The user signs this EIP-712 type:

```solidity
struct UserOp {
    uint32 nonce;
    uint16 max_fee;
    bytes  data;
}
```

Create `submit.mjs`:

<SubmitClient />

Store the user's key in another protected file:

```bash
install -m 600 /dev/null /tmp/user.key
```

Add the user's private key to the first line of `/tmp/user.key`. Then supply the deployment and application-specific values and submit the signed request:

```bash
CHAIN_ID=31337 \
APP_ADDRESS=$APP_ADDRESS \
SEQUENCER_URL=http://127.0.0.1:3000 \
USER_PRIVATE_KEY_FILE=/tmp/user.key \
USER_NONCE=0 \
MAX_FEE=2000 \
METHOD_DATA=$METHOD_DATA \
  node submit.mjs
```

The nonce starts at `0` for a sender with no accepted user operations. Use the same account that received the reference wallet deposit, or provide a funded sender for your own application.

`max_fee` is a fee exponent. With a fixed local gas-price exponent of `0`, the current policy derives a frame price of `1356`, so `2000` clears that reference configuration. A deployment can use a different current price, and there is no public fee-discovery endpoint. Obtain the expected value from the operator or handle an `EXECUTION_REJECTED` response by correcting the fee and signing again.

A successful request returns:

```json
{
  "ok": true,
  "sender": "0x...",
  "nonce": 0
}
```

The server sends this response only after it validates, executes, and durably stores the operation in its current order. A rejected request returns a non-`200` status with a stable error `code`. See [Submitting transactions](./submitting-operations.md) for the complete error model.

## Step 4: read the transaction from the feed

Create `feed.mjs` in the same client directory:

<FeedClient />

Subscribe from offset `0`:

```bash
SEQUENCER_URL=http://127.0.0.1:3000 FROM_OFFSET=0 node feed.mjs
```

For a quick manual inspection, you can use `websocat` instead:

```bash
websocat 'ws://127.0.0.1:3000/ws/subscribe?from_offset=0'
```

The feed replays its current valid ordering and then waits for new messages. Find the `user_op` with the sender and application payload used above:

```json
{
  "kind": "user_op",
  "offset": 1,
  "sender": "0x...",
  "nonce": 0,
  "fee": 1356,
  "data": "0x...",
  "safe_block": 123,
  "batch_nonce": 0
}
```

The displayed `fee` is the committed frame price, so it can be lower than the submitted `max_fee`. The offset may also be greater than `1` if other user operations or direct inputs were ordered first.

Within the current ordering, match a submission by its `sender` and `nonce`. The feed does not include the signature or submitted `max_fee`. Because recovery can invalidate an operation and make its nonce usable again, place a stable request identifier in `data` when the client must track a business action across reconciliation. See [Reading the sequenced feed](./reading-the-feed.md) for the complete schema, cursor handling, and reconnection behavior.

## Understand the confirmation status

The `POST /tx` success response and the feed entry describe the sequencer's current prediction. They do not show that the operation's batch has reached the base layer.

Treat the response as a soft confirmation. The operation can still be invalidated if its batch fails to reach the base layer within the protocol deadline. Feed delivery adds an ordering cursor but no additional settlement guarantee.

For valuable or irreversible actions, verify the outcome from sufficiently settled canonical state. See [Soft confirmations](../concepts/soft-confirmations.md).

## Next steps

- Learn the complete request and retry behavior in [Submitting transactions](./submitting-operations.md).
- Build a reliable feed consumer with [Reading the sequenced feed](./reading-the-feed.md).
- Prepare a production process using [Configure, set up, and run the sequencer](../operations/setup-and-running.md).
