---
title: "Quickstart"
sidebar_label: "Quickstart"
description: "Initialize and run an application-specific sequencer, submit a signed transaction, and find it in the ordered feed."
---

This guide covers the shortest complete client loop: initialize a sequencer for a deployed application, start it, submit one application transaction, and read that transaction from the ordered feed.

## Prerequisites

You need:

- a local base-layer node, usually Anvil, available at `http://127.0.0.1:8545`;
- a deployed Cartesi application contract whose data-availability configuration points to an `InputBox`;
- an application-specific sequencer binary built with that application's `Application` implementation;
- a funded base-layer account dedicated to submitting batches;
- a user account that can pass the application's nonce, fee-balance, and method validation;
- Node.js with `ethers` installed, plus `curl` and `websocat`.

The sequencer is a library that each application builds into its own executable. If your application does not have one yet, follow [Application integration](./integration.md). The sequencer repository's `examples/wallet-sequencer` crate is a reference binary, but its wallet state and method encoding must still match the application deployment you use.

:::note Application-specific values are required
This guide uses placeholders for the application address, keys, and `METHOD_DATA`. A successful submission requires a payload your application can decode and state that satisfies its validation rules. For a wallet, that usually means the sender has deposited enough application funds to cover the action and its fee.
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

./app-sequencer setup
```

Replace `./app-sequencer` with your executable. If you are working inside the sequencer repository, keep the exported configuration and run the reference binary with:

```bash
cargo run -p wallet-sequencer --bin wallet-sequencer-devnet -- setup
```

The `wallet-sequencer-devnet` binary selects the reference wallet's local development configuration. The standard `wallet-sequencer` binary uses its non-local configuration.

The application contract must be deployed before this step. During setup, the sequencer verifies the chain identifier and discovers the application's `InputBox` through the contract's data-availability configuration.

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

The user signs this EIP-712 type:

```solidity
struct UserOp {
    uint32 nonce;
    uint16 max_fee;
    bytes  data;
}
```

Create `sign.mjs`:

```js
import { readFileSync } from "node:fs";
import { Wallet } from "ethers";

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

const wallet = new Wallet(
  readFileSync(required("USER_PRIVATE_KEY_FILE"), "utf8").trim(),
);

const domain = {
  name: "CartesiAppSequencer",
  version: "1",
  chainId: Number(required("CHAIN_ID")),
  verifyingContract: required("APP_ADDRESS"),
};

const types = {
  UserOp: [
    { name: "nonce", type: "uint32" },
    { name: "max_fee", type: "uint16" },
    { name: "data", type: "bytes" },
  ],
};

const message = {
  nonce: Number(required("USER_NONCE")),
  max_fee: Number(required("MAX_FEE")),
  data: required("METHOD_DATA"),
};

const signature = await wallet.signTypedData(domain, types, message);
console.log(JSON.stringify({ message, signature, sender: wallet.address }));
```

Store the user's key in another protected file:

```bash
install -m 600 /dev/null /tmp/user.key
```

Add the user's private key to the first line of `/tmp/user.key`. Then supply the deployment and application-specific values and post the signed request:

```bash
CHAIN_ID=31337 \
APP_ADDRESS=$APP_ADDRESS \
USER_PRIVATE_KEY_FILE=/tmp/user.key \
USER_NONCE=0 \
MAX_FEE=1100 \
METHOD_DATA=0xYourApplicationPayload \
  node sign.mjs | \
  curl --fail-with-body \
    --request POST http://127.0.0.1:3000/tx \
    --header 'content-type: application/json' \
    --data @-
```

The nonce starts at `0` for a sender with no accepted user operations. `METHOD_DATA` must be the hexadecimal encoding expected by your application.

`max_fee` is a fee exponent. The unmodified policy starts at exponent `1060`, so `1100` clears that baseline. A deployment can use a different current price, and there is no public fee-discovery endpoint. Obtain the expected baseline from the operator or handle an `EXECUTION_REJECTED` response by correcting the fee and signing again.

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

Subscribe from offset `0`:

```bash
websocat 'ws://127.0.0.1:3000/ws/subscribe?from_offset=0'
```

The feed replays its current valid ordering and then waits for new messages. Find the `user_op` with the sender and application payload used above:

```json
{
  "kind": "user_op",
  "offset": 1,
  "sender": "0x...",
  "fee": 1060,
  "data": "0x..."
}
```

The displayed `fee` is the committed frame price, so it can be lower than the submitted `max_fee`. The offset may also be greater than `1` if other user operations or direct inputs were ordered first.

The feed message does not include the nonce or signature. Applications that need reliable transaction matching should include their own request identifier in the application payload. See [Consuming the sequenced transaction feed](./reading-the-feed.md) for cursor and reconnection handling.

## Understand the confirmation status

The `POST /tx` success response and the feed entry describe the sequencer's current prediction. They do not show that the operation's batch has reached the base layer.

Treat the response as a soft confirmation. The operation can still be invalidated if its batch fails to reach the base layer within the protocol deadline. Feed delivery adds an ordering cursor but no additional settlement guarantee.

For valuable or irreversible actions, verify the outcome from sufficiently settled canonical state. See [Soft confirmations](../concepts/soft-confirmations.md).

## Next steps

- Learn the complete request and retry behavior in [Submitting transactions](./submitting-operations.md).
- Build a reliable feed consumer with [Consuming the sequenced transaction feed](./reading-the-feed.md).
- Prepare a production process using [Configure, set up, and run the sequencer](../operations/setup-and-running.md).
