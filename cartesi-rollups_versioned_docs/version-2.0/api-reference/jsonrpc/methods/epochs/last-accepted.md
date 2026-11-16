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

The `cartesi_getLastAcceptedEpochIndex` method retrieves the index of the latest epoch whose claim was accepted on chain (status `CLAIM_ACCEPTED`) for a specific application. If no epoch has been accepted yet, it returns error `-31001`.

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

| Code    | Message                      | Description                                      |
|---------|------------------------------|--------------------------------------------------|
| -32602  | Invalid parameters           | Invalid parameter values                         |
| -31002  | Application not found        | The node does not know the application. Retrying does not help |
| -31001  | Epoch not found              | No epoch of the application has been accepted yet. Safe to poll |
| -32603  | Internal server error        | A node-side error occurred                       |
| -32070  | Request timed out            | The request could not be processed in time       |
| -31003  | Response size limit exceeded | The response exceeds the response size budget    |
