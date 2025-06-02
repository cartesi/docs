---
id: epochs-list
title: List Epochs
---

# List Epochs

The `cartesi_listEpochs` method returns a paginated list of epochs for a specific application.

## Method

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listEpochs",
  "params": {
    "application": "calculator",
    "limit": 50,
    "offset": 0
  },
  "id": 1
}
```

## Parameters

| Name        | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| application | string | Yes      | The name or address of the application           |
| limit       | number | No       | Maximum number of epochs to return (default: 50, minimum: 1) |
| offset      | number | No       | Starting point for the list (default: 0, minimum: 0)         |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "index": "0x1",
        "status": "ACCEPTED",
        "inputs_count": "0x1",
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

| Name         | Type   | Description                                      |
|--------------|--------|--------------------------------------------------|
| index        | string | The epoch index                                  |
| status       | string | Current status of the epoch (ACCEPTED/REJECTED)  |
| inputs_count | string | Number of inputs in this epoch                   |
| created_at   | string | Timestamp when the epoch was created             |
| updated_at   | string | Timestamp when the epoch was last updated        |

#### Pagination

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| total_count | number | Total number of epochs available                 |
| limit       | number | Number of epochs returned in this response       |
| offset      | number | Starting point of the returned epochs            |

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
  "method": "cartesi_listEpochs",
  "params": {
    "application": "calculator",
    "limit": 10,
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
        "index": "0x1",
        "status": "ACCEPTED",
        "inputs_count": "0x1",
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