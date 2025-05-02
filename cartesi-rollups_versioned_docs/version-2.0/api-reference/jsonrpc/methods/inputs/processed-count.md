---
id: jsonrpc-inputs-processed-count
title: Get Processed Input Count
---

# Get Processed Input Count

The `cartesi_getProcessedInputCount` method returns the total number of inputs that have been processed by a specific application.

## Method

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getProcessedInputCount",
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
    "count": 100
  },
  "id": 1
}
```

### Response Fields

| Name  | Type   | Description                                      |
|-------|--------|--------------------------------------------------|
| count | number | Total number of processed inputs                 |

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
  "method": "cartesi_getProcessedInputCount",
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
    "count": 100
  },
  "id": 1
}
``` 