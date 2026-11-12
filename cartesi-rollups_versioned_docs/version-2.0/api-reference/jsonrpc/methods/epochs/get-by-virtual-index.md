---
id: epochs-get-by-virtual-index
title: Get Epoch by Virtual Index
---

# Get Epoch by Virtual Index

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getEpochByVirtualIndex",
  "params": {
    "application": "<name-or-address>",
    "virtual_index": "<hex-encoded-index>"
  },
  "id": 1
}
```

The `cartesi_getEpochByVirtualIndex` method retrieves an epoch by its virtual index. The virtual index is the epoch's dense insertion rank in the node: 0, 1, 2, … without gaps by construction. Use it to walk all epochs of an application one by one, independently of the epoch index values.

## Parameters

| Name          | Type   | Required | Description                                      |
|---------------|--------|----------|--------------------------------------------------|
| application   | string | Yes      | The application's name or hex encoded address    |
| virtual_index | string | Yes      | The virtual index of the epoch to be retrieved (hex encoded) |

## Response

The response has the same format as [`cartesi_getEpoch`](./get.md#response), including the proof lists.

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": {
      "index": "0x1",
      "first_block": "0x101",
      "last_block": "0x200",
      "input_index_lower_bound": "0x1",
      "input_index_upper_bound": "0x3",
      "machine_hash": null,
      "tx_buffer_data_block": null,
      "iflags_y_data_block": null,
      "htif_tohost_data_block": null,
      "claim_transaction_hash": null,
      "commitment": null,
      "tournament_address": null,
      "status": "CLOSED",
      "staged_at_block": null,
      "virtual_index": "0x1",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  },
  "id": 1
}
```

For the description of each field and of the epoch statuses, see [Get Epoch](./get.md#response-fields).

## Error Codes

| Code    | Message                      | Description                                      |
|---------|------------------------------|--------------------------------------------------|
| -32602  | Invalid parameters           | Invalid parameter values                         |
| -31002  | Application not found        | The node does not know the application. Retrying does not help |
| -31001  | Epoch not found              | The application exists but no epoch has this virtual index yet. Safe to poll for the next virtual index |
| -32603  | Internal server error        | A node-side error occurred                       |
| -32070  | Request timed out            | The request could not be processed in time       |
| -31003  | Response size limit exceeded | The response exceeds the response size budget    |
