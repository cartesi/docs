---
id: epochs-get
title: Get Epoch
---

# Get Epoch

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getEpoch",
  "params": {
    "application": "<name-or-address>",
    "epoch_index": "<hex-encoded-index>"
  },
  "id": 1
}
```

The `cartesi_getEpoch` method retrieves detailed information about a specific epoch by its application and index.

## Parameters

| Name        | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| application | string | Yes      | The application's name or hex encoded address    |
| epoch_index | string | Yes      | The index of the epoch to be retrieved (hex encoded) |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": {
      "index": "0x1",
      "first_block": "0x1",
      "last_block": "0x100",
      "claim_hash": null,
      "claim_transaction_hash": null,
      "status": "OPEN",
      "virtual_index": "0x1",
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
| index                   | string | The epoch index (hex encoded)                    |
| first_block             | string | The first block number of the epoch (hex encoded) |
| last_block              | string | The last block number of the epoch (hex encoded)  |
| claim_hash              | string | The claim hash (null if not claimed)             |
| claim_transaction_hash  | string | The claim transaction hash (null if not claimed) |
| status                  | string | Current status of the epoch                      |
| virtual_index           | string | The virtual index of the epoch (hex encoded)     |
| created_at              | string | Timestamp when the epoch was created             |
| updated_at              | string | Timestamp when the epoch was last updated        |

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32602  | Invalid params         | Invalid parameter values                         |
| -32000  | Application not found  | The specified application does not exist         |
| -32001  | Epoch not found        | The specified epoch does not exist               |
| -32603  | Internal error         | An internal error occurred                       | 