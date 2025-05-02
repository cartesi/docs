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
| limit       | number | No       | Maximum number of epochs to return (default: 50) |
| offset      | number | No       | Starting point for the list (default: 0)         |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "index": 1,
        "status": "ACCEPTED",
        "inputs_count": 10,
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
| index        | number | The epoch index                                  |
| status       | string | Current status of the epoch (ACCEPTED/REJECTED)  |
| inputs_count | number | Number of inputs in this epoch                   |
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
| -32000  | Application not found  | The specified application does not exist         |
| -32603  | Internal error         | An internal error occurred                       |

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
        "index": 1,
        "status": "ACCEPTED",
        "inputs_count": 10,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      },
      {
        "index": 2,
        "status": "ACCEPTED",
        "inputs_count": 15,
        "created_at": "2024-01-02T00:00:00Z",
        "updated_at": "2024-01-02T00:00:00Z"
      }
    ],
    "pagination": {
      "total_count": 2,
      "limit": 10,
      "offset": 0
    }
  },
  "id": 1
}
``` 