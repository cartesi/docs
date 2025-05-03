---
id: outputs-get
title: Get Output
---

# Get Output

The `cartesi_getOutput` method retrieves detailed information about a specific output by its application and output index.

## Method

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getOutput",
  "params": {
    "application": "calculator",
    "output_index": "0x0"
  },
  "id": 1
}
```

## Parameters

| Name         | Type   | Required | Description                                      |
|--------------|--------|----------|--------------------------------------------------|
| application  | string | Yes      | The application's name or hex encoded address    |
| output_index | string | Yes      | The output index to be retrieved (hex encoded)   |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "epoch_index": 1,
    "input_index": 0,
    "index": 0,
    "type": "0x237a816f",
    "raw_data": "0x1234...",
    "decoded_data": {
      "type": "0x237a816f",
      "destination": "0x1234...5678",
      "value": "0x0",
      "payload": "0x5678..."
    },
    "hash": "0xabc...",
    "output_hashes_siblings": [],
    "execution_transaction_hash": null,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "id": 1
}
```

### Response Fields

| Name                     | Type   | Description                                      |
|--------------------------|--------|--------------------------------------------------|
| epoch_index             | number | The epoch index this output belongs to           |
| input_index             | number | The input index this output belongs to           |
| index                   | number | The output index                                 |
| type                    | string | Output type. Must be one of: `0xc258d6e5` (Notice), `0x237a816f` (Voucher), `0x10321e8b` (DelegateCallVoucher) |
| raw_data                | string | The raw output data in hexadecimal format        |
| decoded_data            | object | The decoded output data                          |
| hash                    | string | The output hash                                  |
| output_hashes_siblings  | array  | Sibling hashes for the output hash               |
| execution_transaction_hash | string | The transaction hash if executed                |
| created_at              | string | Timestamp when the output was created            |
| updated_at              | string | Timestamp when the output was last updated       |

## Output Types

The API supports three types of outputs, which can be identified by the `type` field in the response or filtered using the `output_type` parameter in list queries:

- `0xc258d6e5`: **Notice** – Informational messages emitted by the application.
- `0x237a816f`: **Voucher** – Single-use permission to execute a call.
- `0x10321e8b`: **DelegateCallVoucher** – Single-use permission to execute a delegate call.

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32602  | Invalid params         | Invalid parameter values                         |
| -32000  | Application not found  | The specified application does not exist         |
| -32003  | Output not found       | The specified output does not exist              |
| -32603  | Internal error         | An internal error occurred                       |

## Example

### Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getOutput",
  "params": {
    "application": "calculator",
    "output_index": "0x0"
  },
  "id": 1
}
```

### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "epoch_index": 1,
    "input_index": 0,
    "index": 0,
    "type": "0x237a816f",
    "raw_data": "0x1234...",
    "decoded_data": {
      "type": "0x237a816f",
      "destination": "0x1234...5678",
      "value": "0x0",
      "payload": "0x5678..."
    },
    "hash": "0xabc...",
    "output_hashes_siblings": [],
    "execution_transaction_hash": null,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "id": 1
}
``` 