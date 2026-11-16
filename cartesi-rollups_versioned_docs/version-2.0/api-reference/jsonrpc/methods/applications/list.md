---
id: applications-list
title: List Applications
---

# List Applications

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listApplications",
  "params": {
    "limit": 10,
    "offset": 0
  },
  "id": 1
}
```

The `cartesi_listApplications` method returns a paginated list of applications registered in the Cartesi Rollups instance.

## Parameters

| Name   | Type   | Required | Description                                      |
|--------|--------|----------|--------------------------------------------------|
| limit  | number | No       | Maximum number of applications to return (default: 50; 0 selects the default; values above 10000 are capped at 10000) |
| offset | number | No       | Starting point for the list (default: 0, minimum: 0)         |
| descending | boolean | No   | If `true`, sort by application name in descending order (default: `false`) |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "name": "calculator",
        "iapplication_address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        "iconsensus_address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        "iinputbox_address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        "template_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "epoch_length": "0x100",
        "claim_staging_period": "0x40",
        "withdrawal_config": {
          "guardian": "0x0000000000000000000000000000000000000000",
          "log2_leaves_per_account": "0x0",
          "log2_max_num_of_accounts": "0x0",
          "accounts_drive_start_index": "0x0",
          "withdrawal_output_builder": "0x0000000000000000000000000000000000000000"
        },
        "consensus_type": "AUTHORITY",
        "enabled": true,
        "status": "OK",
        "reason": null,
        "iinputbox_block": "0x1",
        "last_epoch_check_block": "0x1",
        "last_input_check_block": "0x1",
        "last_output_check_block": "0x1",
        "last_tournament_check_block": "0x0",
        "last_foreclose_check_block": "0x1",
        "last_accounts_drive_proved_check_block": "0x0",
        "last_withdrawal_check_block": "0x0",
        "processed_inputs": "0x1",
        "foreclose_block": "0x0",
        "foreclose_transaction": null,
        "accounts_drive_proved_block": "0x0",
        "accounts_drive_proved_transaction": null,
        "accounts_drive_merkle_root": null,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "execution_parameters": {
          "snapshot_policy": "NONE",
          "advance_inc_cycles": "0x1000",
          "advance_max_cycles": "0x10000",
          "inspect_inc_cycles": "0x1000",
          "inspect_max_cycles": "0x10000",
          "advance_inc_deadline": "0x1000000",
          "advance_max_deadline": "0x10000000",
          "inspect_inc_deadline": "0x1000000",
          "inspect_max_deadline": "0x10000000",
          "load_deadline": "0x1000000",
          "store_deadline": "0x1000000",
          "fast_deadline": "0x1000000",
          "max_concurrent_inspects": 10,
          "created_at": "2024-01-01T00:00:00Z",
          "updated_at": "2024-01-01T00:00:00Z"
        }
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
| name                    | string | The name of the application                      |
| iapplication_address    | string | The Ethereum address of the application contract |
| iconsensus_address      | string | The Ethereum address of the consensus contract   |
| iinputbox_address       | string | The Ethereum address of the input box contract the application uses |
| template_hash           | string | The hash of the application template             |
| epoch_length            | string | The length of each epoch in blocks (hex encoded) |
| claim_staging_period    | string | The claim staging period in blocks (hex encoded) |
| withdrawal_config       | object | The emergency withdrawal configuration (all zero when not configured). See [WithdrawalConfig](../../types.md#withdrawalconfig) |
| consensus_type          | string | `AUTHORITY`, `QUORUM` or `PRT`                   |
| enabled                 | boolean | Operator intent: `true` if the node should keep observing and processing the application |
| status                  | string | Whether the node can still execute the application: `OK`, `FAILED`, `DIVERGED`, `CORRUPTED`, `GUEST_EXCEPTION`, `MACHINE_HALTED`, `MCYCLE_OVERFLOW`, `UNEXPECTED_YIELD` or `INVALID_OUTPUTS_ROOT`. Only `OK` and `FAILED` are not terminal. See [ApplicationStatus](../../types.md#applicationstatus) |
| reason                  | string \| null | Description of the failure. Always set when `status` is not `OK`; can be `null` when `status` is `OK` |
| iinputbox_block         | string | The deployment block of the input box contract; the node reads inputs from this block on |
| last_epoch_check_block  | string | The last block checked for epochs                |
| last_input_check_block  | string | The last block checked for inputs                |
| last_output_check_block | string | The last block checked for output executions     |
| last_tournament_check_block | string | The last block checked for PRT tournaments   |
| last_foreclose_check_block | string | The last block checked for a foreclosure      |
| last_accounts_drive_proved_check_block | string | The last block checked for the accounts drive proof (foreclosed applications only) |
| last_withdrawal_check_block | string | The last block checked for withdrawals (after the accounts drive is proved) |
| processed_inputs        | string | The number of processed inputs                   |
| foreclose_block         | string | The block of the on-chain foreclosure, or `0x0` if the node has not observed one |
| foreclose_transaction   | string \| null | The foreclosure transaction hash, or `null`      |
| accounts_drive_proved_block | string | The block in which the accounts drive was proved, or `0x0` |
| accounts_drive_proved_transaction | string \| null | The transaction that proved the accounts drive, or `null` |
| accounts_drive_merkle_root | string \| null | The proved accounts drive Merkle root, or `null` |
| created_at              | string | Timestamp when the application was created       |
| updated_at              | string | Timestamp when the application was last updated  |
| execution_parameters    | object | Configuration parameters for application execution |

A running application has `enabled: true` and `status: "OK"`. To tell a recoverable failure from a permanent one, check `status`: `FAILED` can be cleared by the operator, while the other non-`OK` statuses are terminal.

#### Execution Parameters

| Name                    | Type   | Description                                      |
|-------------------------|--------|--------------------------------------------------|
| snapshot_policy         | string | The snapshot policy (NONE/EVERY_INPUT/EVERY_EPOCH) |
| advance_inc_cycles      | string | Incremental cycles for advance state             |
| advance_max_cycles      | string | Maximum cycles for advance state                 |
| inspect_inc_cycles      | string | Incremental cycles for inspect state             |
| inspect_max_cycles      | string | Maximum cycles for inspect state                 |
| advance_inc_deadline    | string | Incremental deadline for advance state (ns)      |
| advance_max_deadline    | string | Maximum deadline for advance state (ns)          |
| inspect_inc_deadline    | string | Incremental deadline for inspect state (ns)      |
| inspect_max_deadline    | string | Maximum deadline for inspect state (ns)          |
| load_deadline          | string | Deadline for loading state (ns)                  |
| store_deadline         | string | Deadline for storing state (ns)                  |
| fast_deadline          | string | Deadline for fast operations (ns)                |
| max_concurrent_inspects| number | Maximum number of concurrent inspect operations  |
| created_at             | string | Timestamp when parameters were created           |
| updated_at             | string | Timestamp when parameters were last updated      |

#### Pagination

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| total_count | number | Total number of applications that match the filters |
| limit       | number | The page size applied to this request (after the default and the 10000 cap) |
| offset      | number | Starting point of the returned applications      |

## Error Codes

| Code    | Message                      | Description                                      |
|---------|------------------------------|--------------------------------------------------|
| -32602  | Invalid parameters           | Invalid parameter values                         |
| -32603  | Internal server error        | A node-side error occurred                       |
| -32070  | Request timed out            | The request could not be processed in time       |
| -31003  | Response size limit exceeded | The response exceeds the response size budget. Request fewer items |
