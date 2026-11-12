---
id: node-chain-id
title: Get Chain ID
---

# Get Chain ID

:::caution Deprecated
`cartesi_getChainId` is deprecated. Use [`cartesi_getNodeInfo`](./node-info.md), which returns the chain ID, the node version and the default block tag in one call.
:::

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getChainId",
  "params": {},
  "id": 1
}
```

The `cartesi_getChainId` method fetches the chain ID that the node is operating on.

## Parameters

No parameters required.

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
| data | string | The chain ID that the node is operating on (hex encoded) |

## Error Codes

| Code    | Message                      | Description                                      |
|---------|------------------------------|--------------------------------------------------|
| -31001  | EVM Reader config not found  | The node has not stored its chain configuration (EVM reader configuration) yet |
| -32603  | Internal server error        | A node-side error occurred                       |
| -32070  | Request timed out            | The request could not be processed in time       |
| -31003  | Response size limit exceeded | The response exceeds the response size budget    |
