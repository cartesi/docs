---
id: node-version
title: Get Node Version
---

# Get Node Version

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
    "data": "2.0.0"
  },
  "id": 1
}
```

### Response Fields

| Name | Type   | Description                                      |
|------|--------|--------------------------------------------------|
| data | string | The semantic version of the Cartesi rollups node |

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32603  | Internal error         | An internal error occurred                       | 