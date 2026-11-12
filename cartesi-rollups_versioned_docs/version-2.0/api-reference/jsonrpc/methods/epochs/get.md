---
id: epochs-get
title: Get Epoch
---

# Get Epoch

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getEpoch",
  "params": {
    "application": "<name-or-address>",
    "epoch_index": "<hex-encoded-index>"
  },
  "id": 1
}
```

The `cartesi_getEpoch` method retrieves detailed information about a specific epoch by its application and index.

## Parameters

| Name        | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| application | string | Yes      | The application's name or hex encoded address    |
| epoch_index | string | Yes      | The index of the epoch to be retrieved (hex encoded) |

## Response

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
      "machine_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "tx_buffer_data_block": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "tx_buffer_proof": [
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
      ],
      "iflags_y_data_block": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "iflags_y_proof": [
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
      ],
      "htif_tohost_data_block": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "htif_tohost_proof": [
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
      ],
      "claim_transaction_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "commitment": null,
      "tournament_address": null,
      "status": "CLAIM_ACCEPTED",
      "staged_at_block": "0x205",
      "virtual_index": "0x1",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  },
  "id": 1
}
```

The proof lists are shortened in this example.

### Response Fields

| Name                    | Type   | Description                                      |
|-------------------------|--------|--------------------------------------------------|
| index                   | string | The epoch index (hex encoded)                    |
| first_block             | string | The first block number of the epoch (hex encoded) |
| last_block              | string | The last block number of the epoch (hex encoded)  |
| input_index_lower_bound | string | Index of the first input of the epoch (inclusive, hex encoded) |
| input_index_upper_bound | string | Index after the last input of the epoch (exclusive, hex encoded) |
| machine_hash            | string \| null | The machine state hash at the end of the epoch (null until the inputs are processed) |
| tx_buffer_data_block    | string \| null | The CMIO TX buffer data block of the machine state |
| tx_buffer_proof         | array  | Sibling hashes proving `tx_buffer_data_block` against `machine_hash` (omitted when absent) |
| iflags_y_data_block     | string \| null | The memory block that holds the machine `iflags.Y` register |
| iflags_y_proof          | array  | Sibling hashes proving `iflags_y_data_block` against `machine_hash` (omitted when absent) |
| htif_tohost_data_block  | string \| null | The memory block that holds the machine HTIF `tohost` register |
| htif_tohost_proof       | array  | Sibling hashes proving `htif_tohost_data_block` against `machine_hash` (omitted when absent) |
| claim_transaction_hash  | string \| null | The transaction hash associated with the epoch claim (null if none yet) |
| commitment              | string \| null | PRT only: the node's commitment for the epoch tournament |
| commitment_proof        | array  | PRT only: proof of the commitment (omitted when absent) |
| tournament_address      | string \| null | PRT only: the address of the epoch tournament |
| status                  | string | Current status of the epoch. See [Epoch statuses](#epoch-statuses) |
| staged_at_block         | string \| null | The block in which the claim was staged on chain (null before staging) |
| virtual_index           | string | The virtual index of the epoch: its dense insertion rank (hex encoded) |
| created_at              | string | Timestamp when the epoch was created             |
| updated_at              | string | Timestamp when the epoch was last updated        |

### Epoch statuses

| Status             | Meaning | Terminal |
|--------------------|---------|----------|
| `OPEN`             | The epoch is open and accepting inputs | No |
| `CLOSED`           | The epoch is closed and not accepting inputs | No |
| `INPUTS_PROCESSED` | The epoch inputs have been processed | No |
| `CLAIM_COMPUTED`   | The node computed the claim and the output proofs | No |
| `CLAIM_SUBMITTED`  | The node submitted the claim on chain | No |
| `CLAIM_STAGED`     | The claim is staged on chain and waits for the claim staging period (for PRT, or for all sentries to agree) | No |
| `CLAIM_ACCEPTED`   | The claim was accepted on chain. The epoch's outputs can now be executed | Yes |
| `CLAIM_REJECTED`   | Another claim for this epoch was staged or accepted on chain (Quorum) | Yes |
| `CLAIM_FORECLOSED` | The application was foreclosed before the claim was accepted. The claim will never be accepted | Yes |

Only `CLAIM_ACCEPTED` makes the epoch's outputs executable on chain. The node returns output proofs from `CLAIM_COMPUTED` on, but an `executeOutput` call made before the claim is accepted reverts. See [Get Output](../outputs/get.md#proofs-and-executability).

## Error Codes

| Code    | Message                      | Description                                      |
|---------|------------------------------|--------------------------------------------------|
| -32602  | Invalid parameters           | Invalid parameter values                         |
| -31002  | Application not found        | The node does not know the application. Retrying does not help |
| -31001  | Epoch not found              | The application exists but the epoch does not. For an epoch index that may still be created, this is safe to poll |
| -32603  | Internal server error        | A node-side error occurred                       |
| -32070  | Request timed out            | The request could not be processed in time       |
| -31003  | Response size limit exceeded | The response exceeds the response size budget    |
