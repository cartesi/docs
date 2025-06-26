---
id: jsonrpc-inputs-processed-count
title: Get Processed Input Count
---

# Get Processed Input Count

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getProcessedInputCount",
  "params": {
    "application": "<name-or-address>"
  },
  "id": 1
}
```

The `cartesi_getProcessedInputCount` method returns the total number of inputs that have been processed by a specific application.

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
| data | string | Total number of processed inputs (hex encoded)   |

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32602  | Invalid params         | Invalid parameter values                         |
| -32000  | Application not found  | The specified application does not exist         |
| -32603  | Internal error         | An internal error occurred                       | 