---
id: outputs-get
title: Get Output
---

# Get Output

The `cartesi_getOutput` method retrieves detailed information about a specific output by its application and index.

## Method

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getOutput",
  "params": {
    "application": "calculator",
    "output_index": "0x1"
  },
  "id": 1
}
```

## Parameters

| Name         | Type   | Required | Description                                      |
|--------------|--------|----------|--------------------------------------------------|
| application  | string | Yes      | The application's name or hex encoded address    |
| output_index | string | Yes      | The index of the output to be retrieved (hex encoded) |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": {
      "epoch_index": "0x1",
      "input_index": "0x1",
      "index": "0x1",
      "raw_data": "0x1234...",
      "decoded_data": {
        "type": "0x00000000",
        "destination": "0x1234...5678",
        "value": "0x0",
        "payload": "0x5678..."
      },
      "hash": "0x9abc...",
      "output_hashes_siblings": ["0xdef0...", "0x1234..."],
      "execution_transaction_hash": "0x5678...",
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
| epoch_index             | string | The epoch index (hex encoded)                    |
| input_index             | string | The input index (hex encoded)                    |
| index                   | string | The output index (hex encoded)                   |
| raw_data                | string | The raw output data in hexadecimal format        |
| decoded_data            | object | The decoded output data                          |
| decoded_data.type       | string | The function selector (hex encoded)              |
| decoded_data.destination | string | The destination address (hex encoded) - for vouchers only |
| decoded_data.value      | string | The value to be transferred - for vouchers only  |
| decoded_data.payload    | string | The output payload in hexadecimal format         |
| hash                    | string | The output hash (hex encoded)                    |
| output_hashes_siblings  | array  | Sibling hashes for the output hash               |
| execution_transaction_hash | string | The transaction hash (hex encoded)               |
| created_at              | string | Timestamp when the output was created            |
| updated_at              | string | Timestamp when the output was last updated       |

## Output Types

The API supports three types of outputs:

1. **Notices**: Used to provide information about the application state. They don't have a destination address or value.
2. **Vouchers**: Used to request a transfer of value to a specific address. They include a destination address and value.
3. **Delegate Call Vouchers**: Similar to vouchers but used for delegate calls. They include a destination address but no value.

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
    "output_index": "0x1"
  },
  "id": 1
}
```

### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": {
      "epoch_index": "0x1",
      "input_index": "0x1",
      "index": "0x1",
      "raw_data": "0x1234...",
      "decoded_data": {
        "type": "0x00000000",
        "destination": "0x1234...5678",
        "value": "0x0",
        "payload": "0x5678..."
      },
      "hash": "0x9abc...",
      "output_hashes_siblings": ["0xdef0...", "0x1234..."],
      "execution_transaction_hash": "0x5678...",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  },
  "id": 1
}
``` 