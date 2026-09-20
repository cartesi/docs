---
title: "Reading the sequenced feed"
sidebar_label: "Reading the sequenced feed"
description: "Consume the WebSocket feed, store cursors, reconnect, and reconcile provisional transactions."
---

import FeedClient from '../snippets/_feed-client.md';

The sequenced transaction feed is a database-backed WebSocket stream of the inputs in the sequencer's current execution order. It includes accepted user operations and direct inputs when they enter that order.

Use the feed to maintain an index, update a provisional application view, or observe activity without repeatedly scanning the base layer. Do not use it as proof that a transaction has settled.

## Connect to the feed

Open a WebSocket connection to:

```text
GET /ws/subscribe?from_offset=<u64>
```

For a local sequencer, create a small Node.js subscriber. Install its WebSocket dependency:

```bash
npm install ws
```

Create `feed.mjs`:

<FeedClient />

Then connect from the beginning of the available feed:

```bash
SEQUENCER_URL=http://127.0.0.1:3000 FROM_OFFSET=0 node feed.mjs
```

For a quick manual inspection, you can use `websocat`:

```bash
websocat 'ws://127.0.0.1:3000/ws/subscribe?from_offset=0'
```

`from_offset` is optional and defaults to `0`. It is an exclusive cursor, so the server sends messages whose offset is greater than the supplied value. Use `0` for the earliest available history, or the last committed offset when resuming.

Replay and live delivery use the same connection. The server first reads existing rows in ascending offset order, then waits for additional rows. It does not send a separate message when replay has caught up with live activity.

Messages are JSON text frames. Byte fields are hexadecimal strings with a `0x` prefix.

## Understand the two message types

### User operation

A transaction accepted through `POST /tx` appears as:

```json
{
  "kind": "user_op",
  "offset": 10,
  "sender": "0x...",
  "nonce": 7,
  "fee": 1356,
  "data": "0x...",
  "safe_block": 123,
  "batch_nonce": 4
}
```

| Field         | Meaning                                                           |
| ------------- | ----------------------------------------------------------------- |
| `kind`        | Always `user_op` for an operation submitted through the sequencer |
| `offset`      | Resume cursor assigned by the sequencer's database                |
| `sender`      | Address recovered from the operation's EIP-712 signature          |
| `nonce`       | Signed application nonce supplied with the operation              |
| `fee`         | Fee exponent committed for the frame that contains the operation  |
| `data`        | Application-specific method payload                               |
| `safe_block`  | Safe base-layer block committed by the covering frame              |
| `batch_nonce` | Nonce of the batch containing the covering frame                   |

`fee` is the price assigned to the operation when it was ordered. The sender's offered `max_fee` is a separate value and is absent from the feed.

Use `sender` and `nonce` together to match the message within the current ordering. The message does not contain the operation's signature, offered `max_fee`, frame number, outputs, or execution result. Recovery can invalidate an operation and make its nonce usable again, so include a stable application-level identifier in `data` when a product must track a business action across reconciliation.

### Direct input

An input that reached the application through the base layer appears as:

```json
{
  "kind": "direct_input",
  "offset": 11,
  "sender": "0x...",
  "block_number": 123,
  "payload": "0x...",
  "input_index": 42,
  "batch_nonce": 4,
  "block_timestamp": 1700000000,
  "transaction_hash": "0x..."
}
```

| Field              | Meaning                                                               |
| ------------------ | --------------------------------------------------------------------- |
| `kind`             | Always `direct_input` for a base-layer input                           |
| `offset`           | Resume cursor assigned by the sequencer's database                    |
| `sender`           | Base-layer sender recorded for the input                               |
| `block_number`     | Base-layer block that included the input                               |
| `payload`          | Raw input payload passed to the application                            |
| `input_index`      | InputBox index assigned to this application input                      |
| `batch_nonce`      | Nonce of the batch whose frame drained and executed the direct input   |
| `block_timestamp`  | Unix timestamp of the block containing the input, measured in seconds  |
| `transaction_hash` | Hash of the base-layer transaction that submitted the application input |

A direct input appears when the sequencer places it into the application execution order. Its base-layer fields identify where and when it entered the InputBox. `batch_nonce` identifies the batch that caused the canonical scheduler to drain it before executing that batch's user operations.

Inputs sent by the configured batch submitter are filtered from `direct_input` delivery. Those inputs carry encoded sequencer batches, whose user operations already appear individually as `user_op` messages.

## Treat the offset as an opaque cursor

Offsets begin at `1` and increase with the underlying database rows. They are not guaranteed to be consecutive.

Gaps can occur because invalidated rows are excluded from later reads and batch-submitter inputs are filtered before WebSocket delivery. A sequence such as `40`, `41`, `45` does not mean the client lost messages.

For every successfully applied message:

1. read its `offset`;
2. apply the message to the local view;
3. store that exact offset as the new cursor.

Never calculate a cursor with `lastOffset + 1`. On reconnection, pass the exact last offset that was fully processed:

```text
GET /ws/subscribe?from_offset=45
```

The next message may have any offset greater than `45`.

## Process messages without losing progress

An indexer should update its materialized view and resume cursor in one local database transaction:

```text
cursor = load_stored_cursor()

loop:
    connect to /ws/subscribe?from_offset=cursor

    for each message:
        begin local database transaction

        if message.offset <= cursor:
            skip it
        else:
            apply message to provisional view
            store message.offset as cursor

        commit local database transaction

    if disconnected:
        reconnect using the stored cursor
```

This ordering avoids two common failures:

- Storing the cursor before applying the message can lose that message if the process stops between the two writes.
- Applying the message before storing the cursor can apply it twice after a crash unless both changes are atomic or the handler is idempotent.

Process messages serially. Starting asynchronous work for several messages at once can commit a later offset before an earlier message finishes, which breaks the execution order the feed provides.

## Recover from disconnections

For an ordinary network interruption, reconnect with the last committed offset. The database-backed replay covers messages written while the client was offline, then the connection continues with live delivery.

Use retry delay and backoff when the server is unavailable. A graceful sequencer shutdown closes active subscriptions, and reaching the subscriber limit rejects a new WebSocket handshake with HTTP `429` and error code `OVERLOADED`.

### Recover after a long absence

One connection can replay at most 50,000 deliverable events by default. If the requested cursor is further behind, the server completes the WebSocket upgrade and immediately closes the socket with:

| Property   | Value                      |
| ---------- | -------------------------- |
| Close code | `1008`                     |
| Reason     | `catch-up window exceeded: live_start_offset=<u64>` |

The reason includes the current live-start offset. Reconnecting at that offset resumes from the live head but skips the older events that exceeded the catch-up limit. Do this only when the consumer can intentionally discard that history.

An operator-managed indexer recovers by using a snapshot as its new starting point:

1. request `GET /latest_snapshot` on the operator's internal network;
2. read the snapshot bytes and the `X-L2-Tx-Index` response header;
3. replace the provisional local state and cursor together;
4. subscribe with `from_offset` set to the header value.

The snapshot contains application state through that offset. The exclusive subscription then supplies every later feed message.

Snapshots advance when batches close. On a low-traffic deployment, `/latest_snapshot` can therefore continue returning the genesis state until the first batch reaches its size target or its maximum open duration. The default time limit is two hours.

The genesis snapshot is a valid starting point only when replaying from offset `0` remains within the catch-up window. If more than 50,000 deliverable events follow it, wait for or trigger a batch close before using `/latest_snapshot` for recovery. For local testing, start the sequencer with a shorter duration, for example:

```bash
CARTESI_SEQUENCER_MAX_BATCH_OPEN_SECONDS=5 ./app-sequencer run
```

Use a production value that balances snapshot and posting latency against base-layer transaction cost.

The snapshot routes are internal operator endpoints. Apply the access controls described in [Sequencer security](../operations/security.md#separate-public-and-internal-routes).

## Know what the feed confirms

The feed reports the sequencer's current provisional ordering. It supplies input identity, payload, and a resume cursor, but it does not report batch position, application outputs, base-layer acceptance, settlement, or a later invalidation.

A fresh replay excludes invalidated batches. A client that already received an affected message gets no rollback notification and will not detect the change by resuming from its latest cursor.

Use one of these reconciliation strategies when invalidation matters to the product:

- rebuild the provisional view from a newer `/latest_snapshot` and resume from its offset;
- compare important outcomes with the canonical application state;
- wait for sufficiently settled base-layer state before allowing an irreversible action.

Feed delivery and the `POST /tx` response are both optimistic results from the same sequencer. Seeing a submitted operation on the feed does not turn its soft confirmation into a final confirmation. See [Soft confirmations](../concepts/soft-confirmations.md).

## Choose between the feed and a snapshot

The two interfaces solve different problems:

| Need                                | Recommended source                                      |
| ----------------------------------- | ------------------------------------------------------- |
| Maintain an ordered activity index  | WebSocket feed                                          |
| Continue after a short interruption | Feed replay from the stored offset                      |
| Initialize a stateful indexer       | Latest snapshot, followed by the feed                   |
| Display a current predicted balance | Application state derived from a snapshot or an indexer |
| Establish a settled result          | Canonical settled state and the base layer              |

An application interface that needs current balances can read them from an operator-managed indexer initialized from `/latest_snapshot`. The indexer can load the state snapshot once, then use the feed to keep its materialized view current.

## Capacity and connection behavior

The server limits subscriber count, catch-up events, and inbound frame size. The endpoint responds to WebSocket pings, while other inbound data is ignored because delivery is server to client. See [`GET /ws/subscribe`](../api-reference/api.md#get-wssubscribe) for the exact limits and close behavior.

Run a small number of durable indexers against the sequencer and let user-facing applications read from those indexers. Connecting every browser directly can exhaust the subscriber limit and gives each browser the burden of replay, persistence, and rollback reconciliation.

## Next steps

- To create the user operations that appear in the feed, see [Submitting transactions](./submitting-operations.md).
- For the exact endpoint contract and close behavior, see [HTTP and WebSocket API](../api-reference/api.md).
- To initialize an indexer from application state, see [Snapshots and checkpoints](../recovery/snapshots.md).
