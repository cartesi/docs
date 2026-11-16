---
id: reports-get
title: Get Report
---

# Get Report

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getReport",
  "params": {
    "application": "<name-or-address>",
    "report_index": "<hex-encoded-index>"
  },
  "id": 1
}
```

The `cartesi_getReport` method retrieves detailed information about a specific report by its application and index. Only reports produced while processing inputs are available; reports from inspect requests are not stored.

## Parameters

| Name        | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| application | string | Yes      | The application's name or hex encoded address    |
| report_index | string | Yes      | The index of the report to be retrieved (hex encoded) |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": {
      "epoch_index": "0x1",
      "input_index": "0x1",
      "index": "0x1",
      "raw_data": "0x48656c6c6f",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  },
  "id": 1
}
```

### Response Fields

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| epoch_index | string | The epoch index this report belongs to (hex encoded) |
| input_index | string | The input index this report belongs to (hex encoded) |
| index       | string | The report index (hex encoded)                   |
| raw_data    | string | The report payload in hexadecimal format         |
| created_at  | string | Timestamp when the report was created            |
| updated_at  | string | Timestamp when the report was last updated       |

## Error Codes

| Code    | Message                      | Description                                      |
|---------|------------------------------|--------------------------------------------------|
| -32602  | Invalid parameters           | Invalid parameter values                         |
| -31002  | Application not found        | The node does not know the application. Retrying does not help |
| -31001  | Report not found             | The application exists but the report does not. For the next report index, this is safe to poll |
| -32603  | Internal server error        | A node-side error occurred                       |
| -32070  | Request timed out            | The request could not be processed in time       |
| -31003  | Response size limit exceeded | The response exceeds the response size budget    |
