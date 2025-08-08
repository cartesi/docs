---
id: jsonrpc-epochs-last-accepted
title: Get Last Accepted Epoch Index
---

# Get Last Accepted Epoch Index

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getLastAcceptedEpochIndex",
  "params": {
    "application": "<name-or-address>"
  },
  "id": 1
}
```

The `cartesi_getLastAcceptedEpochIndex` method retrieves the latest accepted epoch index for a specific application.

## Parameters

| Name        | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| application | string | Yes      | The application's name or hex encoded address    |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": "0x1"
  },
  "id": 1
}
```

### Response Fields

| Name | Type   | Description                                      |
|------|--------|--------------------------------------------------|
| data | string | The latest accepted epoch index (hex encoded)    |

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32602  | Invalid params         | Invalid parameter values                         |
| -32000  | Application not found  | The specified application does not exist         |
| -32603  | Internal error         | An internal error occurred                       |