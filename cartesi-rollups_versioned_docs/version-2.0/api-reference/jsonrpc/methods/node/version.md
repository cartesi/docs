---
id: node-version
title: Get Node Version
---

# Get Node Version

:::caution Deprecated
`cartesi_getNodeVersion` is deprecated. Use [`cartesi_getNodeInfo`](./node-info.md), which returns the chain ID, the node version and the default block tag in one call.
:::

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getNodeVersion",
  "params": {},
  "id": 1
}
```

The `cartesi_getNodeVersion` method fetches the semantic version of the Cartesi rollups node.

## Parameters

No parameters required.

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": "2.0.0-alpha.14"
  },
  "id": 1
}
```

### Response Fields

| Name | Type   | Description                                      |
|------|--------|--------------------------------------------------|
| data | string | The semantic version of the Cartesi rollups node |

## Error Codes

| Code    | Message                      | Description                                      |
|---------|------------------------------|--------------------------------------------------|
| -32603  | Internal server error        | A node-side error occurred                       |
| -32070  | Request timed out            | The request could not be processed in time       |
| -31003  | Response size limit exceeded | The response exceeds the response size budget    |
