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

| Code    | Message                      | Description                                      |
|---------|------------------------------|--------------------------------------------------|
| -32602  | Invalid parameters           | Invalid parameter values                         |
| -31002  | Application not found        | The node does not know the application. Retrying does not help |
| -32603  | Internal server error        | A node-side error occurred                       |
| -32070  | Request timed out            | The request could not be processed in time       |
| -31003  | Response size limit exceeded | The response exceeds the response size budget    |
