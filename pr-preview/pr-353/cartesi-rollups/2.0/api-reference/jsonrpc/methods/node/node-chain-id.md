> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: node-chain-id
title: Get Chain ID
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

# Get Chain ID

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

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32603  | Internal error         | An internal error occurred                       | 