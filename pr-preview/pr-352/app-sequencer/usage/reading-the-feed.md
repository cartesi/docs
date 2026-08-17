> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Reading the sequenced transaction feed"
sidebar_label: "Reading the sequenced feed"
description: "How to consume the ordered WebSocket feed, store a reliable resume cursor, recover after disconnection, and account for optimistic delivery."
---

The sequenced transaction feed is a database-backed WebSocket stream of the inputs in the sequencer's current execution order. It includes accepted user operations and direct inputs when they enter that order.

Use the feed to maintain an index, update a provisional application view, or observe activity without repeatedly scanning the base layer. Do not use it as proof that a transaction has settled.

## Connect to the feed

Open a WebSocket connection to:

```text
GET /ws/subscribe?from_offset=<u64>
```

For a local sequencer, the full URL is:

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
  "fee": 1060,
  "data": "0x..."
}
```

| Field    | Meaning                                                           |
| -------- | ----------------------------------------------------------------- |
| `kind`   | Always `user_op` for an operation submitted through the sequencer |
| `offset` | Resume cursor assigned by the sequencer's database                |
| `sender` | Address recovered from the operation's EIP-712 signature          |
| `fee`    | Fee exponent committed for the frame that contains the operation  |
| `data`   | Application-specific method payload                               |

`fee` is the price assigned to the operation when it was ordered. The sender's offered `max_fee` is a separate value and is absent from the feed.

The message does not contain the operation's nonce, signature, offered `max_fee`, batch number, frame number, safe block, outputs, or execution result. If a client needs to match a feed message to a submission unambiguously, include an application-level identifier in `data`. Matching only by `sender` and `data` can be ambiguous when a sender submits the same payload more than once.

### Direct input

An input that reached the application through the base layer appears as:

```json
{
  "kind": "direct_input",
  "offset": 11,
  "sender": "0x...",
  "block_number": 123,
  "payload": "0x..."
}
```

| Field          | Meaning                                            |
| -------------- | -------------------------------------------------- |
| `kind`         | Always `direct_input` for a base-layer input       |
| `offset`       | Resume cursor assigned by the sequencer's database |
| `sender`       | Base-layer sender recorded for the input           |
| `block_number` | Base-layer block that included the input           |
| `payload`      | Raw input payload passed to the application        |

A direct input appears when the sequencer places it into the application execution order. Its `block_number` records where it arrived on the base layer.

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
| Reason     | `catch-up window exceeded` |

An operator-managed indexer recovers by using a snapshot as its new starting point:

1. request `GET /latest_snapshot` on the operator's internal network;
2. read the snapshot bytes and the `X-L2-Tx-Index` response header;
3. replace the provisional local state and cursor together;
4. subscribe with `from_offset` set to the header value.

The snapshot contains application state through that offset. The exclusive subscription then supplies every later feed message.

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

The CMA wallet demo polls `/latest_snapshot` because its interface needs current ledger balances. It does not reconstruct the wallet ledger from WebSocket messages. A production indexer can load the same kind of state snapshot once, then use the feed to keep its materialized view current.

## Capacity and connection behavior

The server limits subscriber count, catch-up events, and inbound frame size. The endpoint responds to WebSocket pings, while other inbound data is ignored because delivery is server to client. See [`GET /ws/subscribe`](../api-reference/api.md#get-wssubscribe) for the exact limits and close behavior.

Run a small number of durable indexers against the sequencer and let user-facing applications read from those indexers. Connecting every browser directly can exhaust the subscriber limit and gives each browser the burden of replay, persistence, and rollback reconciliation.

## Next steps

- To create the user operations that appear in the feed, see [Submitting transactions](./submitting-operations.md).
- For the exact endpoint contract and close behavior, see [HTTP and WebSocket API](../api-reference/api.md).
- To initialize an indexer from application state, see [Snapshots and checkpoints](../recovery/snapshots.md).
