---
id: applications-list
title: List Applications
---

# List Applications

The `cartesi_listApplications` method returns a paginated list of applications registered in the Cartesi Rollups instance.

## Method

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listApplications",
  "params": {
    "limit": 50,
    "offset": 0
  },
  "id": 1
}
```

## Parameters

| Name   | Type   | Required | Description                                      |
|--------|--------|----------|--------------------------------------------------|
| limit  | number | No       | Maximum number of applications to return (default: 50) |
| offset | number | No       | Starting point for the list (default: 0)         |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "name": "calculator",
        "address": "0x1234...5678",
        "state": "ACTIVE",
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

| Name       | Type   | Description                                      |
|------------|--------|--------------------------------------------------|
| name       | string | The name of the application                      |
| address    | string | The Ethereum address of the application contract |
| state      | string | Current state of the application (ACTIVE/INACTIVE) |
| created_at | string | Timestamp when the application was created       |
| updated_at | string | Timestamp when the application was last updated  |

#### Pagination

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| total_count | number | Total number of applications available           |
| limit       | number | Number of applications returned in this response |
| offset      | number | Starting point of the returned applications      |

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32602  | Invalid params         | Invalid parameter values                         |
| -32603  | Internal error         | An internal error occurred                       |

## Example

### Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listApplications",
  "params": {
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
        "name": "calculator",
        "address": "0x1234...5678",
        "state": "ACTIVE",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      },
      {
        "name": "ether-wallet",
        "address": "0x8765...4321",
        "state": "ACTIVE",
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