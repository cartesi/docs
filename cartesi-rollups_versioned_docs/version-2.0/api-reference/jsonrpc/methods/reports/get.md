---
id: reports-get
title: Get Report
---

# Get Report

The `cartesi_getReport` method retrieves detailed information about a specific report by its application and index.

## Method

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getReport",
  "params": {
    "application": "calculator",
    "index": 1
  },
  "id": 1
}
```

## Parameters

| Name        | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| application | string | Yes      | The name or address of the application           |
| index       | number | Yes      | The report index                                 |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "index": 1,
    "input_index": 1,
    "payload": "0x1234..."
  },
  "id": 1
}
```

### Response Fields

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| index       | number | The report index                                 |
| input_index | number | The input index this report belongs to           |
| payload     | string | The report payload in hexadecimal format         |

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32602  | Invalid params         | Invalid parameter values                         |
| -32000  | Application not found  | The specified application does not exist         |
| -32004  | Report not found       | The specified report does not exist              |
| -32603  | Internal error         | An internal error occurred                       |

## Example

### Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getReport",
  "params": {
    "application": "calculator",
    "index": 1
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
    "input_index": 1,
    "payload": "0x1234..."
  },
  "id": 1
}
``` 