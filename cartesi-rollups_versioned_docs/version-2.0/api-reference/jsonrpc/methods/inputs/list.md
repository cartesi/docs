---
id: inputs-list
title: List Inputs
---

# List Inputs

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listInputs",
  "params": {
    "application": "<name-or-address>",
    "limit": 10,
    "offset": 0
  },
  "id": 1
}
```

The `cartesi_listInputs` method returns a paginated list of inputs for a specific application.

## Parameters

| Name        | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| application | string | Yes      | The application's name or hex encoded address    |
| epoch_index | string | No       | Filter inputs by a specific epoch index (hex encoded) |
| sender      | string | No       | Filter inputs by the sender's address (hex encoded) |
| limit       | number | No       | Maximum number of inputs to return (default: 50, minimum: 1) |
| offset      | number | No       | Starting point for the list (default: 0, minimum: 0)         |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "epoch_index": "0x1",
        "index": "0x1",
        "block_number": "0x1",
        "raw_data": "0x48656c6c6f",
        "decoded_data": {
          "chain_id": "0x1",
          "application_contract": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
          "sender": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
          "block_number": "0x1",
          "block_timestamp": "0x1234567890",
          "prev_randao": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          "index": "0x1",
          "payload": "0x48656c6c6f"
        },
        "status": "ACCEPTED",
        "machine_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "outputs_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "transaction_reference": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
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

| Name                    | Type   | Description                                      |
|-------------------------|--------|--------------------------------------------------|
| epoch_index             | string | The epoch index this input belongs to (hex encoded) |
| index                   | string | The input index (hex encoded)                    |
| block_number            | string | The block number when the input was created (hex encoded) |
| raw_data                | string | The raw input data in hexadecimal format         |
| decoded_data            | object | The decoded input data (null if not decodable)   |
| status                  | string | Current status of the input                      |
| machine_hash            | string | The machine hash after processing this input     |
| outputs_hash            | string | The outputs hash after processing this input     |
| transaction_reference   | string | The transaction reference                         |
| created_at              | string | Timestamp when the input was created             |
| updated_at              | string | Timestamp when the input was last updated        |

#### Pagination

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| total_count | number | Total number of inputs available                 |
| limit       | number | Number of inputs returned in this response       |
| offset      | number | Starting point of the returned inputs            |

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32602  | Invalid params         | Invalid parameter values                         |
| -32603  | Internal error         | An internal error occurred                       |
| -32000  | Application not found  | The specified application does not exist         | 