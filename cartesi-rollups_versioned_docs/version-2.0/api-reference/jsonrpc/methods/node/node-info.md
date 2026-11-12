---
id: node-info
title: Get Node Info
---

# Get Node Info

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getNodeInfo",
  "params": {},
  "id": 1
}
```

The `cartesi_getNodeInfo` method fetches the chain ID, the semantic version of the node and the default block tag that the node uses for chain data. It replaces the deprecated `cartesi_getChainId` and `cartesi_getNodeVersion` methods.

`default_block` is the finality level of the data that the node exposes: the node reads and acts on chain state up to the block identified by this tag (`FINALIZED`, `SAFE`, `LATEST` or `PENDING`). Interpret the data returned by the node with the stability guarantees of that tag.

## Parameters

No parameters required.

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": {
      "chain_id": "0xaa36a7",
      "version": "2.0.0-alpha.14",
      "default_block": "FINALIZED"
    }
  },
  "id": 1
}
```

### Response Fields

| Name          | Type   | Description                                      |
|---------------|--------|--------------------------------------------------|
| chain_id      | string | The chain ID that the node is operating on (hex encoded) |
| version       | string | The semantic version of the Cartesi rollups node |
| default_block | string | The block tag that defines the finality of the chain data the node reads and acts on: `FINALIZED`, `SAFE`, `LATEST` or `PENDING` |

## Error Codes

| Code    | Message                      | Description                                      |
|---------|------------------------------|--------------------------------------------------|
| -31001  | EVM Reader config not found  | The node has not stored its chain configuration (EVM reader configuration) yet |
| -32603  | Internal server error        | A node-side error occurred                       |
| -32070  | Request timed out            | The request could not be processed in time       |
| -31003  | Response size limit exceeded | The response exceeds the response size budget    |
