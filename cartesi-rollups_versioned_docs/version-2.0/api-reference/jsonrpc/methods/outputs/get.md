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
  },
  "id": 1
}
```

### Response Fields

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

## Output Types

The API supports three types of outputs, which can be identified by the `type` field in the decoded data or filtered using the `output_type` parameter in list queries:

- `0xc258d6e5`: **Notice** – Informational messages emitted by the application.
- `0x237a816f`: **Voucher** – Single-use permission to execute a call.
- `0x10321e8b`: **DelegateCallVoucher** – Single-use permission to execute a DELEGATECALL.

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32602  | Invalid params         | Invalid parameter values                         |
| -32000  | Application not found  | The specified application does not exist         |
| -32003  | Output not found       | The specified output does not exist              |
| -32603  | Internal error         | An internal error occurred                       | 