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
| output_type | string | No       | Filter outputs by output type (first 4 bytes of raw data hex encoded) |
| voucher_address | string | No       | Filter outputs by the voucher address (hex encoded) |
| limit       | number | No       | Maximum number of outputs to return (default: 50, minimum: 1) |
| offset      | number | No       | Starting point for the list (default: 0, minimum: 0)         |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "epoch_index": "0x1",
        "input_index": "0x1",
        "index": "0x1",
        "raw_data": "0x48656c6c6f",
        "decoded_data": {
          "type": "0xc258d6e5",
          "payload": "0x48656c6c6f"
        },
        "hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "output_hashes_siblings": [
          "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        ],
        "execution_transaction_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
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
| raw_data                | string | The raw output data in hexadecimal format        |
| decoded_data            | object | The decoded output data (null if not decodable)  |
| hash                    | string | The output hash                                  |
| output_hashes_siblings  | array  | Sibling hashes for the output hash               |
| execution_transaction_hash | string | The transaction hash if executed                |
| created_at              | string | Timestamp when the output was created            |
| updated_at              | string | Timestamp when the output was last updated       |

#### Pagination

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| total_count | number | Total number of outputs available                |
| limit       | number | Number of outputs returned in this response      |
| offset      | number | Starting point of the returned outputs           |

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32602  | Invalid params         | Invalid parameter values                         |
| -32603  | Internal error         | An internal error occurred                       |
| -32000  | Application not found  | The specified application does not exist         | 