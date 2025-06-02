---
id: inputs-list
title: List Inputs
---

# List Inputs

The `cartesi_listInputs` method returns a paginated list of inputs for a specific application.

## Method

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listInputs",
  "params": {
    "application": "calculator",
    "limit": 50,
    "offset": 0,
    "epoch_index": "0x1",
    "sender": "0x1234...5678"
  },
  "id": 1
}
```

## Parameters

| Name        | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| application | string | Yes      | The name or address of the application           |
| limit       | number | No       | Maximum number of inputs to return (default: 50, minimum: 1) |
| offset      | number | No       | Starting point for the list (default: 0, minimum: 0)         |
| epoch_index | string | No       | Filter inputs by epoch index                     |
| sender      | string | No       | Filter inputs by sender address                  |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "index": "0x1",
        "epoch_index": "0x1",
        "sender": "0x1234...5678",
        "payload": "0x1234...5678",
        "status": "ACCEPTED",
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

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| index       | string | The input index                                  |
| epoch_index | string | The epoch index this input belongs to            |
| sender      | string | The address of the input sender                  |
| payload     | string | The input payload                                |
| status      | string | Current status of the input (ACCEPTED/REJECTED)  |
| created_at  | string | Timestamp when the input was created             |
| updated_at  | string | Timestamp when the input was last updated        |

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

## Example

### Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listInputs",
  "params": {
    "application": "calculator",
    "limit": 10,
    "offset": 0,
    "epoch_index": "0x1",
    "sender": "0x1234...5678"
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
        "index": "0x1",
        "epoch_index": "0x1",
        "sender": "0x1234...5678",
        "payload": "0x1234...5678",
        "status": "ACCEPTED",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total_count": 1,
      "limit": 10,
      "offset": 0
    }
  },
  "id": 1
}
``` 