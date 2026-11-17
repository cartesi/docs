---
id: outputs-get
title: Get Output
---

# Get Output

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getOutput",
  "params": {
    "application": "<name-or-address>",
    "output_index": "<hex-encoded-index>"
  },
  "id": 1
}
```

The `cartesi_getOutput` method retrieves detailed information about a specific output by its application and output index.

## Parameters

| Name         | Type   | Required | Description                                      |
|--------------|--------|----------|--------------------------------------------------|
| application  | string | Yes      | The application's name or hex encoded address    |
| output_index | string | Yes      | The index of the output to be retrieved (hex encoded)   |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": {
      "epoch_index": "0x1",
      "input_index": "0x1",
      "index": "0x1",
      "raw_data": "0x237a816f00000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c80000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000",
      "hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "output_hashes_siblings": [
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
      ],
      "execution_transaction_hash": null,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "decoded_data": {
        "type": "Voucher",
        "destination": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "value": "0xde0b6b3a7640000",
        "payload": "0x"
      }
    }
  },
  "id": 1
}
```

The sibling list is shortened in this example.

### Response Fields

| Name                     | Type   | Description                                      |
|--------------------------|--------|--------------------------------------------------|
| epoch_index             | string | The epoch index this output belongs to (hex encoded) |
| input_index             | string | The input index this output belongs to (hex encoded) |
| index                   | string | The output index (hex encoded)                   |
| raw_data                | string | The raw output data (the ABI-encoded `Notice`, `Voucher` or `DelegateCallVoucher` call) in hexadecimal format |
| hash                    | string \| null | The output hash. `null` until the node computes the epoch claim |
| output_hashes_siblings  | array \| null | Sibling hashes that prove the output hash against the epoch's outputs Merkle root. `null` until the node computes the epoch claim |
| execution_transaction_hash | string \| null | The transaction that executed the output on chain, or `null` if the node has not observed an execution |
| created_at              | string | Timestamp when the output was created            |
| updated_at              | string | Timestamp when the output was last updated       |
| decoded_data            | object | The decoded output data (see [Output Types](#output-types)). Omitted when `raw_data` cannot be decoded |

## Output Types

The API supports three types of outputs. The `type` field of `decoded_data` holds the type name, and the `output_type` parameter of [`cartesi_listOutputs`](./list.md) filters by the type selector (the first 4 bytes of `raw_data`):

| Selector     | `decoded_data.type`   | Fields of `decoded_data` | Description |
|--------------|-----------------------|--------------------------|-------------|
| `0xc258d6e5` | `Notice`              | `payload` | Informational messages emitted by the application |
| `0x237a816f` | `Voucher`             | `destination`, `value` (Wei, hex encoded), `payload` | Single-use permission to execute a call |
| `0x10321e8b` | `DelegateCallVoucher` | `destination`, `payload` | Single-use permission to execute a DELEGATECALL |

## Proofs and executability

The node fills `hash` and `output_hashes_siblings` when it computes the epoch claim (epoch status `CLAIM_COMPUTED`). Having a proof does not make an output executable yet: the application contract checks the proof against outputs Merkle roots that the consensus has accepted, so `executeOutput` and `validateOutput` revert (`InvalidOutputsMerkleRoot`) until the epoch claim is accepted on chain.

Before you enable an "execute" or "withdraw" action for a voucher or DELEGATECALL voucher:

1. Get the epoch of the output with [`cartesi_getEpoch`](../epochs/get.md), using the output's `epoch_index`.
2. Check that the epoch `status` is `CLAIM_ACCEPTED`. During `CLAIM_COMPUTED`, `CLAIM_SUBMITTED` and `CLAIM_STAGED`, execution attempts revert. An epoch in `CLAIM_FORECLOSED` never becomes executable.
3. Check that `execution_transaction_hash` is `null`, or call `wasOutputExecuted(index)` on the application contract: each output can be executed only once.

## Error Codes

| Code    | Message                      | Description                                      |
|---------|------------------------------|--------------------------------------------------|
| -32602  | Invalid parameters           | Invalid parameter values                         |
| -31002  | Application not found        | The node does not know the application. Retrying does not help |
| -31001  | Output not found             | The application exists but the output does not. For the next output index, this is safe to poll |
| -32603  | Internal server error        | A node-side error occurred                       |
| -32070  | Request timed out            | The request could not be processed in time       |
| -31003  | Response size limit exceeded | The response exceeds the response size budget    |
