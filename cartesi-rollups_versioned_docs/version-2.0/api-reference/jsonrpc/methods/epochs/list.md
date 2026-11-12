---
id: epochs-list
title: List Epochs
---

# List Epochs

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listEpochs",
  "params": {
    "application": "<name-or-address>",
    "limit": 10,
    "offset": 0
  },
  "id": 1
}
```

The `cartesi_listEpochs` method returns a paginated list of epochs for a specific application. The listed epochs do not include the proof lists (`tx_buffer_proof`, `iflags_y_proof`, `htif_tohost_proof`, `commitment_proof`); use [`cartesi_getEpoch`](./get.md) to get them.

## Parameters

| Name        | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| application | string | Yes      | The application's name or hex encoded address    |
| status      | string or array | No | Filter epochs by one status, or by a non-empty list of statuses (see [Epoch statuses](./get.md#epoch-statuses)) |
| from        | string | No       | Inclusive lower bound on the epoch index (hex encoded) |
| to          | string | No       | Inclusive upper bound on the epoch index (hex encoded) |
| limit       | number | No       | Maximum number of epochs to return (default: 50; 0 selects the default; values above 10000 are capped at 10000) |
| offset      | number | No       | Starting point for the list (default: 0, minimum: 0)         |
| descending  | boolean | No      | If `true`, sort by epoch index in descending order (default: `false`) |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "index": "0x1",
        "first_block": "0x101",
        "last_block": "0x200",
        "input_index_lower_bound": "0x1",
        "input_index_upper_bound": "0x3",
        "machine_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "tx_buffer_data_block": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "iflags_y_data_block": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "htif_tohost_data_block": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "claim_transaction_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "commitment": null,
        "tournament_address": null,
        "status": "CLAIM_STAGED",
        "staged_at_block": "0x205",
        "virtual_index": "0x1",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total_count": 1,
      "limit": 50,
      "offset": 0
    }
  },
  "id": 1
}
```

### Response Fields

#### Data

| Name                    | Type   | Description                                      |
|-------------------------|--------|--------------------------------------------------|
| index                   | string | The epoch index (hex encoded)                    |
| first_block             | string | The first block number of the epoch (hex encoded) |
| last_block              | string | The last block number of the epoch (hex encoded)  |
| input_index_lower_bound | string | Index of the first input of the epoch (inclusive, hex encoded) |
| input_index_upper_bound | string | Index after the last input of the epoch (exclusive, hex encoded) |
| machine_hash            | string \| null | The machine state hash at the end of the epoch (null until the inputs are processed) |
| tx_buffer_data_block    | string \| null | The CMIO TX buffer data block of the machine state |
| iflags_y_data_block     | string \| null | The memory block that holds the machine `iflags.Y` register |
| htif_tohost_data_block  | string \| null | The memory block that holds the machine HTIF `tohost` register |
| claim_transaction_hash  | string \| null | The transaction hash associated with the epoch claim (null if none yet) |
| commitment              | string \| null | PRT only: the node's commitment for the epoch tournament |
| tournament_address      | string \| null | PRT only: the address of the epoch tournament |
| status                  | string | Current status of the epoch. See [Epoch statuses](./get.md#epoch-statuses) |
| staged_at_block         | string \| null | The block in which the claim was staged on chain (null before staging) |
| virtual_index           | string | The virtual index of the epoch: its dense insertion rank (hex encoded) |
| created_at              | string | Timestamp when the epoch was created             |
| updated_at              | string | Timestamp when the epoch was last updated        |

#### Pagination

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| total_count | number | Total number of epochs that match the filters |
| limit       | number | The page size applied to this request (after the default and the 10000 cap) |
| offset      | number | Starting point of the returned epochs            |

## Error Codes

| Code    | Message                      | Description                                      |
|---------|------------------------------|--------------------------------------------------|
| -32602  | Invalid parameters           | Invalid parameter values (including an empty `status` list or `from` greater than `to`) |
| -31002  | Application not found        | The node does not know the application. Retrying does not help |
| -32603  | Internal server error        | A node-side error occurred                       |
| -32070  | Request timed out            | The request could not be processed in time       |
| -31003  | Response size limit exceeded | The response exceeds the response size budget. Request fewer items |

## Synchronizing epochs

To follow the epochs of an application:

1. Discover new epochs with `from` set to the next epoch index you have not seen, and advance it as new epochs appear.
2. Separately, refresh the epochs you have already seen that are still in a non-terminal status, for example with `"status": ["OPEN", "CLOSED", "INPUTS_PROCESSED", "CLAIM_COMPUTED", "CLAIM_SUBMITTED", "CLAIM_STAGED"]`.

Terminal statuses (`CLAIM_ACCEPTED`, `CLAIM_REJECTED` and `CLAIM_FORECLOSED`) never change, so you can stop refreshing an epoch once it reaches one of them.

## Example

### Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listEpochs",
  "params": {
    "application": "calculator",
    "status": ["CLAIM_STAGED", "CLAIM_ACCEPTED"],
    "limit": 10,
    "offset": 0
  },
  "id": 1
}
```

### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "index": "0x1",
        "first_block": "0x101",
        "last_block": "0x200",
        "input_index_lower_bound": "0x1",
        "input_index_upper_bound": "0x3",
        "machine_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "tx_buffer_data_block": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "iflags_y_data_block": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "htif_tohost_data_block": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "claim_transaction_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "commitment": null,
        "tournament_address": null,
        "status": "CLAIM_ACCEPTED",
        "staged_at_block": "0x205",
        "virtual_index": "0x1",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total_count": 1,
      "limit": 10,
      "offset": 0
    }
  },
  "id": 1
}
```
