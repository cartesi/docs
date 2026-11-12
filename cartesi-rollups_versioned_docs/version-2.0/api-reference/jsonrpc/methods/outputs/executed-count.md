---
id: outputs-executed-count
title: Get Executed Output Count
---

# Get Executed Output Count

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getExecutedOutputCount",
  "params": {
    "application": "<name-or-address>"
  },
  "id": 1
}
```

The `cartesi_getExecutedOutputCount` method returns the number of outputs of an application whose on-chain execution the node has observed (outputs with an `execution_transaction_hash`).

The count only grows. Use it as a change signal: if it did not change, the node has observed no new executions. When it changes, list the pending executable outputs again with [`cartesi_listOutputs`](./list.md) using `"executed": false` and `"output_type": ["0x237a816f", "0x10321e8b"]`, and compare the result with the previous pending set to find the executed outputs.

Do not use this count, an output index or a pagination offset as a resume cursor: outputs are executed out of index order, so a late execution can happen behind such a cursor.

## Parameters

| Name        | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| application | string | Yes      | The application's name or hex encoded address    |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": "0x3"
  },
  "id": 1
}
```

### Response Fields

| Name | Type   | Description                                      |
|------|--------|--------------------------------------------------|
| data | string | Number of executed outputs (hex encoded)         |

## Error Codes

| Code    | Message                      | Description                                      |
|---------|------------------------------|--------------------------------------------------|
| -32602  | Invalid parameters           | Invalid parameter values                         |
| -31002  | Application not found        | The node does not know the application. Retrying does not help |
| -32603  | Internal server error        | A node-side error occurred                       |
| -32070  | Request timed out            | The request could not be processed in time       |
| -31003  | Response size limit exceeded | The response exceeds the response size budget    |
