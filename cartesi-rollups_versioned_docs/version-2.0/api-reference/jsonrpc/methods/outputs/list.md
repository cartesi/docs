---
id: outputs-list
title: List Outputs
---

# List Outputs

The `cartesi_listOutputs` method returns a paginated list of outputs for a specific application, with options to filter by epoch index, input index, output type, and voucher address.

## Method

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listOutputs",
  "params": {
    "application": "calculator",
    "epoch_index": "0x1",
    "input_index": "0x1",
    "output_type": "0xc258d6e5",
    "voucher_address": "0x1234...5678",
    "limit": 50,
    "offset": 0
  },
  "id": 1
}
```

## Parameters

| Name            | Type   | Required | Description                                      |
|-----------------|--------|----------|--------------------------------------------------|
| application     | string | Yes      | The application's name or hex encoded address    |
| epoch_index     | string | No       | Filter outputs by a specific epoch index (hex encoded) |
| input_index     | string | No       | Filter outputs by a specific input index (hex encoded) |
| output_type     | string | No       | Filter outputs by output type. Must be one of: `0xc258d6e5` (Notice), `0x237a816f` (Voucher), `0x10321e8b` (DelegateCallVoucher). |
| voucher_address | string | No       | Filter outputs by the voucher address (hex encoded) |
| limit           | number | No       | Maximum number of outputs to return (default: 50) |
| offset          | number | No       | Starting point for the list (default: 0)         |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "epoch_index": 1,
        "input_index": 0,
        "index": 0,
        "type": "0xc258d6e5",
        "raw_data": "0x1234...",
        "decoded_data": {
          "type": "0xc258d6e5",
          "payload": "0x5678..."
        },
        "hash": "0xabc...",
        "output_hashes_siblings": [],
        "execution_transaction_hash": null,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total_count": 1,
      "limit": 1,
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
| epoch_index             | string | The epoch index (hex encoded)                    |
| input_index             | string | The input index (hex encoded)                    |
| index                   | string | The output index (hex encoded)                   |
| raw_data                | string | The raw output data in hexadecimal format        |
| decoded_data            | object | The decoded output data                          |
| decoded_data.type       | string | The output_type (must be one of: `0xc258d6e5` for Notice, `0x237a816f` for Voucher, `0x10321e8b` for DelegateCallVoucher) |
| decoded_data.destination | string | The destination address (hex encoded) - for vouchers only |
| decoded_data.value      | string | The value to be transferred - for vouchers only  |
| decoded_data.payload    | string | The output payload in hexadecimal format         |
| hash                    | string | The output hash (hex encoded)                    |
| output_hashes_siblings  | array  | Sibling hashes for the output hash               |
| execution_transaction_hash | string | The transaction hash (hex encoded)               |
| created_at              | string | Timestamp when the output was created            |
| updated_at              | string | Timestamp when the output was last updated       |

#### Pagination

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| total_count | number | Total number of outputs available                |
| limit       | number | Number of outputs returned in this response      |
| offset      | number | Starting point of the returned outputs           |

## Output Types

The API supports three types of outputs, which can be filtered using the `output_type` parameter:

- `0xc258d6e5`: **Notice** – Informational messages emitted by the application.
- `0x237a816f`: **Voucher** – Single-use permission to execute a call.
- `0x10321e8b`: **DelegateCallVoucher** – Single-use permission to execute a delegate call.

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32602  | Invalid params         | Invalid parameter values                         |
| -32000  | Application not found  | The specified application does not exist         |
| -32603  | Internal error         | An internal error occurred                       |

## Example

### Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listOutputs",
  "params": {
    "application": "calculator",
    "output_type": "0xc258d6e5",
    "limit": 1,
    "offset": 0
  },
  "id": 1
}
```

### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "epoch_index": 1,
        "input_index": 0,
        "index": 0,
        "type": "0xc258d6e5",
        "raw_data": "0x1234...",
        "decoded_data": {
          "type": "0xc258d6e5",
          "payload": "0x5678..."
        },
        "hash": "0xabc...",
        "output_hashes_siblings": [],
        "execution_transaction_hash": null,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total_count": 1,
      "limit": 1,
      "offset": 0
    }
  },
  "id": 1
}
``` 