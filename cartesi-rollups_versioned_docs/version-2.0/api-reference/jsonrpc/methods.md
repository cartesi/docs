---
id: methods
title: Methods
---

# JSON-RPC API Methods

This page provides a quick reference to all available JSON-RPC methods in the Cartesi Rollups Node API. For each method, you will find:
- A summary of what it does
- The parameters it accepts (with types and descriptions)
- Example requests and responses
- **Links to detailed documentation for each method**

Use this as a starting point to explore the API. For more details on each method, see the dedicated documentation pages in the sidebar or follow the links below.

## Applications

### cartesi_listApplications
Returns a paginated list of all applications registered in the Cartesi Rollups instance.

Parameters:
- `limit` (optional): The maximum number of applications to return per page. Default: 50, Minimum: 1
- `offset` (optional): The starting point for the list of applications to return. Default: 0, Minimum: 0

Example request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "cartesi_listApplications",
  "params": {
    "limit": 10,
    "offset": 0
  }
}
```

Example response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "data": [
      {
        "name": "my-dapp",
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
    ],
    "pagination": {
      "total_count": 1,
      "limit": 10,
      "offset": 0
    }
  }
}
```

### cartesi_getApplication
Fetches detailed information about a specific application by its name or address.

Parameters:
- `application` (required): The application's name or hex encoded address.

Example request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "cartesi_getApplication",
  "params": {
    "application": "my-dapp"
  }
}
```

Example response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "data": {
      "name": "my-dapp",
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
  }
}
```

## Epochs

### cartesi_listEpochs
Returns a paginated list of epochs for a given application.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `status` (optional): Filter epochs by status.
- `limit` (optional): The maximum number of epochs to return per page. Default: 50, Minimum: 1
- `offset` (optional): The starting point for the list of epochs to return. Default: 0, Minimum: 0

Example request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "cartesi_listEpochs",
  "params": {
    "application": "my-dapp",
    "status": "OPEN",
    "limit": 10,
    "offset": 0
  }
}
```

Example response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "data": [
      {
        "index": "0x1",
        "first_block": "0x1",
        "last_block": "0x100",
        "claim_hash": null,
        "claim_transaction_hash": null,
        "status": "OPEN",
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
  }
}
```

### cartesi_getEpoch
Fetches detailed information about a specific epoch.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `epoch_index` (required): The index of the epoch to be retrieved (hex encoded).

Example request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "cartesi_getEpoch",
  "params": {
    "application": "my-dapp",
    "epoch_index": "0x1"
  }
}
```

Example response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "data": {
      "index": "0x1",
      "first_block": "0x1",
      "last_block": "0x100",
      "claim_hash": null,
      "claim_transaction_hash": null,
      "status": "OPEN",
      "virtual_index": "0x1",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### cartesi_getLastAcceptedEpochIndex
Fetches the latest accepted epoch index for a given application.

Parameters:
- `application` (required): The application's name or hex encoded address.

Example request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "cartesi_getLastAcceptedEpochIndex",
  "params": {
    "application": "my-dapp"
  }
}
```

Example response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "data": "0x1"
  }
}
```

## Inputs

### cartesi_listInputs
Returns a paginated list of inputs sent to an application.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `epoch_index` (optional): Filter inputs by a specific epoch index (hex encoded).
- `sender` (optional): Filter inputs by the sender's address (hex encoded).
- `limit` (optional): The maximum number of inputs to return per page. Default: 50, Minimum: 1
- `offset` (optional): The starting point for the list of inputs to return. Default: 0, Minimum: 0

Example request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "cartesi_listInputs",
  "params": {
    "application": "my-dapp",
    "epoch_index": "0x1",
    "sender": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    "limit": 10,
    "offset": 0
  }
}
```

Example response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "data": [
      {
        "epoch_index": "0x1",
        "index": "0x1",
        "block_number": "0x1",
        "raw_data": "0x48656c6c6f",
        "decoded_data": {
          "chain_id": "0x1",
          "application_contract": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
          "sender": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
          "block_number": "0x1",
          "block_timestamp": "0x1234567890",
          "prev_randao": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          "index": "0x1",
          "payload": "0x48656c6c6f"
        },
        "status": "ACCEPTED",
        "machine_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "outputs_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "transaction_reference": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total_count": 1,
      "limit": 10,
      "offset": 0
    }
  }
}
```

### cartesi_getInput
Retrieves detailed information about a specific input.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `input_index` (required): The index of the input to be retrieved (hex encoded).

Example request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "cartesi_getInput",
  "params": {
    "application": "my-dapp",
    "input_index": "0x1"
  }
}
```

Example response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "data": {
      "epoch_index": "0x1",
      "index": "0x1",
      "block_number": "0x1",
      "raw_data": "0x48656c6c6f",
      "decoded_data": {
        "chain_id": "0x1",
        "application_contract": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        "sender": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        "block_number": "0x1",
        "block_timestamp": "0x1234567890",
        "prev_randao": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "index": "0x1",
        "payload": "0x48656c6c6f"
      },
      "status": "ACCEPTED",
      "machine_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "outputs_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "transaction_reference": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### cartesi_getProcessedInputCount
Returns the number of inputs already processed by the application.

Parameters:
- `application` (required): The application's name or hex encoded address.

Example request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "cartesi_getProcessedInputCount",
  "params": {
    "application": "my-dapp"
  }
}
```

Example response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "data": "0x1"
  }
}
```

## Outputs

### cartesi_listOutputs
Returns a paginated list of outputs (notices, vouchers, delegate call vouchers) for a given application.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `epoch_index` (optional): Filter outputs by a specific epoch index (hex encoded).
- `input_index` (optional): Filter outputs by a specific input index (hex encoded).
- `output_type` (optional): Filter outputs by output type (first 4 bytes of raw data hex encoded).
- `voucher_address` (optional): Filter outputs by the voucher address (hex encoded).
- `limit` (optional): The maximum number of outputs to return per page. Default: 50, Minimum: 1
- `offset` (optional): The starting point for the list of outputs to return. Default: 0, Minimum: 0

Example request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "cartesi_listOutputs",
  "params": {
    "application": "my-dapp",
    "epoch_index": "0x1",
    "input_index": "0x1",
    "output_type": "0xc258d6e5",
    "voucher_address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    "limit": 10,
    "offset": 0
  }
}
```

Example response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "data": [
      {
        "epoch_index": "0x1",
        "input_index": "0x1",
        "index": "0x1",
        "raw_data": "0x48656c6c6f",
        "decoded_data": {
          "type": "0xc258d6e5",
          "payload": "0x48656c6c6f"
        },
        "hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "output_hashes_siblings": [
          "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        ],
        "execution_transaction_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total_count": 1,
      "limit": 10,
      "offset": 0
    }
  }
}
```

### cartesi_getOutput
Retrieves detailed information about a specific output.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `output_index` (required): The index of the output to be retrieved (hex encoded).

Example request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "cartesi_getOutput",
  "params": {
    "application": "my-dapp",
    "output_index": "0x1"
  }
}
```

Example response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "data": {
      "epoch_index": "0x1",
      "input_index": "0x1",
      "index": "0x1",
      "raw_data": "0x48656c6c6f",
      "decoded_data": {
        "type": "0xc258d6e5",
        "payload": "0x48656c6c6f"
      },
      "hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "output_hashes_siblings": [
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
      ],
      "execution_transaction_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

## Reports

### cartesi_listReports
Returns a paginated list of reports for a given application.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `epoch_index` (optional): Filter by epoch index (hex encoded).
- `input_index` (optional): Filter by input index (hex encoded).
- `limit` (optional): The maximum number of reports to return per page. Default: 50, Minimum: 1
- `offset` (optional): The starting point for the list of reports to return. Default: 0, Minimum: 0

Example request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "cartesi_listReports",
  "params": {
    "application": "my-dapp",
    "epoch_index": "0x1",
    "input_index": "0x1",
    "limit": 10,
    "offset": 0
  }
}
```

Example response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "data": [
      {
        "epoch_index": "0x1",
        "input_index": "0x1",
        "index": "0x1",
        "raw_data": "0x48656c6c6f",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total_count": 1,
      "limit": 10,
      "offset": 0
    }
  }
}
```

### cartesi_getReport
Fetches detailed information about a specific report.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `report_index` (required): The index of the report to be retrieved (hex encoded).

Example request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "cartesi_getReport",
  "params": {
    "application": "my-dapp",
    "report_index": "0x1"
  }
}
```

Example response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "data": {
      "epoch_index": "0x1",
      "input_index": "0x1",
      "index": "0x1",
      "raw_data": "0x48656c6c6f",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

## Query Methods

### getVersion

Returns the version of the Cartesi Rollups API.

Example request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getVersion"
}
```

Example response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "2.0.0"
}
```

### getEpochStatus

Returns the status of an epoch.

Example request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getEpochStatus",
  "params": {
    "epoch_index": "0x1"
  }
}
```

Example response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "epoch_index": "0x1",
    "status": "finished",
    "inputs": [
      {
        "index": "0x1",
        "sender": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        "timestamp": "0x1234567890",
        "payload": "0x48656c6c6f",
        "status": "accepted"
      }
    ]
  }
}
```

### getInput

Returns an input by its index.

Example request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getInput",
  "params": {
    "index": "0x1"
  }
}
```

Example response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "index": "0x1",
    "sender": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    "timestamp": "0x1234567890",
    "payload": "0x48656c6c6f",
    "status": "accepted"
  }
}
```

### getNotice

Returns a notice by its index.

Example request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getNotice",
  "params": {
    "index": "0x1"
  }
}
```

Example response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "index": "0x1",
    "input_index": "0x1",
    "payload": "0x48656c6c6f",
    "status": "accepted"
  }
}
```

### getVoucher

Returns a voucher by its index.

Example request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getVoucher",
  "params": {
    "index": "0x1"
  }
}
```

Example response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "index": "0x1",
    "input_index": "0x1",
    "destination": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    "payload": "0x48656c6c6f",
    "status": "accepted"
  }
}
```

### getProof

Returns a proof for a given output.

Example request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getProof",
  "params": {
    "input_index": "0x1",
    "output_index": "0x1",
    "output_enum": "notice"
  }
}
```

Example response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "input_index": "0x1",
    "output_index": "0x1",
    "output_enum": "notice",
    "validity": {
      "input_hashes": ["0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"],
      "vouchers_hashes": ["0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"],
      "notices_hashes": ["0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"],
      "machine_state_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "output_hash_in_output_hashes_siblings": ["0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"],
      "output_hashes_in_epoch_siblings": ["0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"]
    }
  }
} 