---
title: "HTTP and WebSocket API"
sidebar_label: "HTTP and WebSocket API"
description: "Every endpoint the sequencer exposes, with request and response shapes, error codes, and which endpoints are public."
---

The sequencer exposes a small public surface for applications, plus a set of internal endpoints for operators.

By default it listens on `127.0.0.1:3000`, which is local only. See [Configure, set up, and run the sequencer](../operations/setup-and-running.md).

## Public endpoints

### POST /tx

Submit a signed transaction. Explained in [Submitting operations](../usage/submitting-operations.md).

Request:

```json
{
  "message": {
    "nonce": 0,
    "max_fee": 1,
    "data": "0x..."
  },
  "signature": "0x...",
  "sender": "0x..."
}
```

| Field             | Type       | Notes                                               |
| ----------------- | ---------- | --------------------------------------------------- |
| `message.nonce`   | `uint32`   | Per sender, starting at 0                           |
| `message.max_fee` | `uint16`   | Fee exponent, base 129/128                          |
| `message.data`    | hex string | Application payload                                 |
| `signature`       | hex string | EIP-712 signature, exactly 65 bytes                 |
| `sender`          | hex string | Must match the address recovered from the signature |

Success, HTTP `200`:

```json
{ "ok": true, "sender": "0x...", "nonce": 0 }
```

Errors carry a `code` field. Branch on the code, not the message.

| Status | Code                 | Cause                                                                                                                       |
| ------ | -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `400`  | `BAD_REQUEST`        | Malformed request, or an application payload larger than the application's declared maximum. Note this is `400`, not `413`. |
| `400`  | `INVALID_SIGNATURE`  | Signature invalid, or `sender` does not match the recovered signer                                                          |
| `413`  | `PAYLOAD_TOO_LARGE`  | The raw JSON body exceeds 4 KiB                                                                                             |
| `422`  | `EXECUTION_REJECTED` | The application refused the transaction                                                                                     |
| `429`  | `OVERLOADED`         | Ordering queue full, message `queue full`. Retry.                                                                           |
| `503`  | `UNAVAILABLE`        | Shutting down or not ready                                                                                                  |
| `500`  | `INTERNAL_ERROR`     | Unexpected failure                                                                                                          |

### GET /ws/subscribe

```
GET /ws/subscribe?from_offset=<u64>
```

WebSocket stream of sequenced transactions in execution order. Explained in [Reading the sequenced feed](../usage/reading-the-feed.md).

`from_offset` is optional, default `0`, and is **exclusive**: delivery starts at the first transaction after it.

Offsets are database row ids. They start at `1`, ascend, and are not guaranteed contiguous. A client resumes by storing the last offset it received, never by incrementing a counter.

Messages are JSON text frames. Binary fields are hex encoded with a `0x` prefix.

```json
{
  "kind": "user_op",
  "offset": 10,
  "sender": "0x...",
  "fee": 1,
  "data": "0x..."
}
```

```json
{
  "kind": "direct_input",
  "offset": 11,
  "sender": "0x...",
  "block_number": 123,
  "payload": "0x..."
}
```

There are no other message kinds. In particular there is no message signalling that an earlier transaction was invalidated.

Limits:

| Limit                  | Value         | Behaviour when exceeded                                                                    |
| ---------------------- | ------------- | ------------------------------------------------------------------------------------------ |
| Concurrent subscribers | 64            | Further connections get HTTP `429` with `OVERLOADED`, before the WebSocket upgrade         |
| Catch-up window        | 50,000 events | Socket is upgraded then immediately closed, code `1008`, reason `catch-up window exceeded` |

## Batch wire format

An integrator or auditor reading the base layer directly needs to understand the batch structure posted by the sequencer and decoded by the machine.

A batch is **SSZ encoded**, and posted as the raw encoding with no wrapper or tag. There is nothing in the payload saying what it is: classification is by sender address alone, so an input from the sequencer's address is decoded as a batch and anything else is a direct input. See [Scheduler semantics](../advanced/scheduler-semantics.md).

```
Batch
  nonce   uint64
  frames  list of Frame

Frame
  user_ops   list of WireUserOp
  safe_block uint64
  fee_price  uint16      fee exponent, base 129/128

WireUserOp
  nonce  uint32
  fee    uint16          the sender's max fee, same encoding
  ...    signature, sender and payload
```

Keep these wire-format details distinct from the sequencer's local representation:

- **A batch carries no parent reference.** Its `nonce` identifies its position, and the machine expects the next number. The parent links in [The batch tree](../concepts/batch-tree.md) exist only in the sequencer's local record and are absent from the posted data.
- **`safe_block` and `fee_price` are per frame, not per batch.** A batch can carry several frames with advancing safe blocks, which is the mechanism described in [Batches, frames, and the safe block](../concepts/batches-frames-safe-block.md).

Use the field names and ordering in `sequencer-core` for the deployed release. The encoding is consensus-critical, and this page provides only a summary.

## Health endpoints

| Endpoint       | Checks performed                                               |
| -------------- | -------------------------------------------------------------- |
| `GET /livez`   | The process is alive                                           |
| `GET /readyz`  | That it is not shutting down and the inclusion lane is running |
| `GET /healthz` | The same readiness signal, returning a small status body       |

## Operator endpoints

:::warning Internal only
These serve application state to an operator's own watchdog and indexers. They have **no authentication** and must not be exposed publicly. Keep them behind network controls.
:::

| Endpoint                               | Returns                                                                                                                                                                           |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /finalized_state/inclusion_block` | Cheap JSON for detecting progress: `{ "inclusion_block": <u64>, "l2_tx_index": <u64> }`. `404` if no finalized snapshot exists yet.                                               |
| `GET /finalized_state`                 | The settled state file, as `application/octet-stream`. Headers `X-Inclusion-Block`, `X-L2-Tx-Index`, and `ETag: "block-<n>"`. Send `If-None-Match` to get a `304` when unchanged. |
| `GET /latest_snapshot`                 | The most recent snapshot, pending if there is one, otherwise finalized. Intended for an indexer that fetches state and then subscribes from `X-L2-Tx-Index`.                      |

Both streaming endpoints hold the snapshot open for the life of the response, including when a client disconnects early.

## Next steps

- For the signing domain, see [EIP-712 domain](./eip712.md).
- For settings and exit codes, see [Reference](/app-sequencer/reference).
