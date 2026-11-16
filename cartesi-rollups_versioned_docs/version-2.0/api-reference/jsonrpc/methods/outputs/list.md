---
id: outputs-list
title: List Outputs
---

# List Outputs

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listOutputs",
  "params": {
    "application": "<name-or-address>",
    "limit": 10,
    "offset": 0
  },
  "id": 1
}
```

The `cartesi_listOutputs` method returns a paginated list of outputs for a specific application.

## Parameters

| Name        | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| application | string | Yes      | The application's name or hex encoded address    |
| epoch_index | string | No       | Filter outputs by a specific epoch index (hex encoded) |
| input_index | string | No       | Filter outputs by a specific input index (hex encoded) |
| output_type | string or array | No | Filter outputs by one output type selector (first 4 bytes of raw data, hex encoded), or by a non-empty list of selectors (matches any of them). See [Output Types](./get.md#output-types) |
| voucher_address | string | No       | Filter outputs by the voucher destination address (hex encoded) |
| executed    | boolean | No      | `true` selects outputs with an execution transaction hash; `false` selects outputs without one |
| from        | string | No       | Inclusive lower bound on the output index (hex encoded) |
| to          | string | No       | Inclusive upper bound on the output index (hex encoded) |
| limit       | number | No       | Maximum number of outputs to return (default: 50; 0 selects the default; values above 10000 are capped at 10000) |
| offset      | number | No       | Starting point for the list (default: 0, minimum: 0)         |
| descending  | boolean | No      | If `true`, sort by output index in descending order (default: `false`) |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "epoch_index": "0x1",
        "input_index": "0x1",
        "index": "0x0",
        "raw_data": "0xc258d6e50000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000",
        "hash": null,
        "output_hashes_siblings": null,
        "execution_transaction_hash": null,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "decoded_data": {
          "type": "Notice",
          "payload": "0x48656c6c6f"
        }
      }
    ],
    "pagination": {
      "total_count": 1,
      "limit": 50,
      "offset": 0
    }
  },
  "id": 1
}
```

### Response Fields

#### Data

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
| decoded_data            | object | The decoded output data (see [Output Types](./get.md#output-types)). Omitted when `raw_data` cannot be decoded |

Outputs carry proofs before they can be executed on chain. See [Proofs and executability](./get.md#proofs-and-executability).

#### Pagination

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| total_count | number | Total number of outputs that match the filters |
| limit       | number | The page size applied to this request (after the default and the 10000 cap) |
| offset      | number | Starting point of the returned outputs           |

## Error Codes

| Code    | Message                      | Description                                      |
|---------|------------------------------|--------------------------------------------------|
| -32602  | Invalid parameters           | Invalid parameter values (including an empty `output_type` list or `from` greater than `to`) |
| -31002  | Application not found        | The node does not know the application. Retrying does not help |
| -32603  | Internal server error        | A node-side error occurred                       |
| -32070  | Request timed out            | The request could not be processed in time       |
| -31003  | Response size limit exceeded | The response exceeds the response size budget. Request fewer items |

## Tracking output execution

Outputs are executed on chain out of index order: an old voucher can be executed after newer outputs. Do not use an output index, a pagination offset or the executed-output count as a resume cursor over the `executed` filter, because a late execution behind the cursor would be missed. Instead:

1. Poll [`cartesi_getExecutedOutputCount`](./executed-count.md).
2. When the count changes, list the pending executable outputs again with `"executed": false` and `"output_type": ["0x237a816f", "0x10321e8b"]` (vouchers and DELEGATECALL vouchers).
3. Compare the new pending set with the previous one to find the outputs that were executed.
