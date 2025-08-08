---
id: applications-get
title: Get Application
---

# Get Application

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getApplication",
  "params": {
    "application": "<name-or-address>"
  },
  "id": 1
}
```

The `cartesi_getApplication` method retrieves detailed information about a specific application by its name or address.

## Parameters

| Name          | Type   | Required | Description                                      |
|---------------|--------|----------|--------------------------------------------------|
| application   | string | Yes      | The application's name or hex encoded address    |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": {
    "name": "calculator",
      "iapplication_address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      "iconsensus_address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      "iinputbox_address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      "template_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "epoch_length": "0x100",
      "data_availability": "0x",
      "state": "ENABLED",
      "reason": "",
      "iinputbox_block": "0x1",
      "last_input_check_block": "0x1",
      "last_output_check_block": "0x1",
      "processed_inputs": "0x1",
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
        "max_concurrent_inspects": 1,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    }
  },
  "id": 1
}
```

### Response Fields

| Name                    | Type   | Description                                      |
|-------------------------|--------|--------------------------------------------------|
| name                    | string | The name of the application                      |
| iapplication_address    | string | The Ethereum address of the application contract |
| iconsensus_address      | string | The Ethereum address of the consensus contract   |
| iinputbox_address       | string | The Ethereum address of the input box contract   |
| template_hash           | string | The hash of the application template             |
| epoch_length            | string | The length of each epoch in blocks               |
| data_availability       | string | The data availability configuration              |
| state                   | string | Current state of the application (ENABLED/DISABLED/INOPERABLE) |
| reason                  | string | Reason for the current state                     |
| iinputbox_block         | string | The block number of the input box contract       |
| last_input_check_block  | string | The last block checked for inputs                |
| last_output_check_block | string | The last block checked for outputs               |
| processed_inputs        | string | The number of processed inputs                   |
| created_at              | string | Timestamp when the application was created       |
| updated_at              | string | Timestamp when the application was last updated  |
| execution_parameters    | object | Configuration parameters for application execution |

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

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32602  | Invalid params         | Invalid parameter values                         |
| -32000  | Application not found  | The specified application does not exist         |
| -32603  | Internal error         | An internal error occurred                       |