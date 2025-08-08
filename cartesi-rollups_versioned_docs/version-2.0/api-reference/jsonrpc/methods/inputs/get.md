---
id: inputs-get
title: Get Input
---

# Get Input

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getInput",
  "params": {
    "application": "<name-or-address>",
    "input_index": "<hex-encoded-index>"
  },
  "id": 1
}
```

The `cartesi_getInput` method retrieves detailed information about a specific input by its application and index.

## Parameters

| Name        | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| application | string | Yes      | The application's name or hex encoded address    |
| input_index | string | Yes      | The index of the input to be retrieved (hex encoded) |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": {
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
  },
  "id": 1
}
```

### Response Fields

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

#### Decoded Data Fields

| Name                    | Type   | Description                                      |
|-------------------------|--------|--------------------------------------------------|
| chain_id                | string | The chain ID (hex encoded)                       |
| application_contract    | string | The application contract address                 |
| sender                  | string | The sender address                               |
| block_number            | string | The block number (hex encoded)                   |
| block_timestamp         | string | The block timestamp (hex encoded)                |
| prev_randao             | string | The previous RANDAO value                        |
| index                   | string | The input index (hex encoded)                    |
| payload                 | string | The input payload in hexadecimal format          |

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32602  | Invalid params         | Invalid parameter values                         |
| -32000  | Application not found  | The specified application does not exist         |
| -32002  | Input not found        | The specified input does not exist               |
| -32603  | Internal error         | An internal error occurred                       |