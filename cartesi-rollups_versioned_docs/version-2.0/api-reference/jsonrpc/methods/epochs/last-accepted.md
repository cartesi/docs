---
id: jsonrpc-epochs-last-accepted
title: Get Last Accepted Epoch
---

# Get Last Accepted Epoch

The `cartesi_getLastAcceptedEpoch` method retrieves information about the most recently accepted epoch for a specific application.

## Method

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getLastAcceptedEpoch",
  "params": {
    "application": "calculator"
  },
  "id": 1
}
```

## Parameters

| Name        | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| application | string | Yes      | The name or address of the application           |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "index": 1,
    "status": "ACCEPTED",
    "inputs_count": 10,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "id": 1
}
```

### Response Fields

| Name         | Type   | Description                                      |
|--------------|--------|--------------------------------------------------|
| index        | number | The epoch index                                  |
| status       | string | Current status of the epoch (ACCEPTED/REJECTED)  |
| inputs_count | number | Number of inputs in this epoch                   |
| created_at   | string | Timestamp when the epoch was created             |
| updated_at   | string | Timestamp when the epoch was last updated        |

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
  "method": "cartesi_getLastAcceptedEpoch",
  "params": {
    "application": "calculator"
  },
  "id": 1
}
```

### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "index": 1,
    "status": "ACCEPTED",
    "inputs_count": 10,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "id": 1
}
``` 