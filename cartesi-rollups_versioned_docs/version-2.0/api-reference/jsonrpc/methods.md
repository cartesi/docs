---
id: methods
title: Methods
---

## Applications

### cartesi_listApplications

Returns a paginated list of all applications.

#### Parameters

```json
{
  "limit": 50,
  "offset": 0
}
```

- `limit` (optional): The maximum number of applications to return per page (default: 50)
- `offset` (optional): The starting point for the list of applications to return (default: 0)

#### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "name": "string",
        "iapplication_address": "0x...",
        "iconsensus_address": "0x...",
        "iinputbox_address": "0x...",
        "template_hash": "0x...",
        "epoch_length": "0x...",
        "data_availability": "0x...",
        "state": "ENABLED",
        "reason": "string",
        "iinputbox_block": "0x...",
        "last_input_check_block": "0x...",
        "last_output_check_block": "0x...",
        "processed_inputs": "0x...",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "execution_parameters": {
          "snapshot_policy": "NONE",
          "advance_inc_cycles": "0x...",
          "advance_max_cycles": "0x...",
          "inspect_inc_cycles": "0x...",
          "inspect_max_cycles": "0x...",
          "advance_inc_deadline": "0x...",
          "advance_max_deadline": "0x...",
          "inspect_inc_deadline": "0x...",
          "inspect_max_deadline": "0x...",
          "load_deadline": "0x...",
          "store_deadline": "0x...",
          "fast_deadline": "0x...",
          "max_concurrent_inspects": 0,
          "created_at": "2024-01-01T00:00:00Z",
          "updated_at": "2024-01-01T00:00:00Z"
        }
      }
    ],
    "pagination": {
      "total_count": 100,
      "limit": 50,
      "offset": 0
    }
  },
  "id": 1
}
```

### cartesi_getApplication

Fetches a single application by its name or address.

#### Parameters

```json
{
  "application": "string"
}
```

- `application`: The application's name or hex encoded address

#### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": {
      "name": "string",
      "iapplication_address": "0x...",
      "iconsensus_address": "0x...",
      "iinputbox_address": "0x...",
      "template_hash": "0x...",
      "epoch_length": "0x...",
      "data_availability": "0x...",
      "state": "ENABLED",
      "reason": "string",
      "iinputbox_block": "0x...",
      "last_input_check_block": "0x...",
      "last_output_check_block": "0x...",
      "processed_inputs": "0x...",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "execution_parameters": {
        "snapshot_policy": "NONE",
        "advance_inc_cycles": "0x...",
        "advance_max_cycles": "0x...",
        "inspect_inc_cycles": "0x...",
        "inspect_max_cycles": "0x...",
        "advance_inc_deadline": "0x...",
        "advance_max_deadline": "0x...",
        "inspect_inc_deadline": "0x...",
        "inspect_max_deadline": "0x...",
        "load_deadline": "0x...",
        "store_deadline": "0x...",
        "fast_deadline": "0x...",
        "max_concurrent_inspects": 0,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    }
  },
  "id": 1
}
```

## Epochs

### cartesi_listEpochs

Returns a paginated list of epochs for the specified application. Can filter by epoch status.

#### Parameters

```json
{
  "application": "string",
  "status": "OPEN",
  "limit": 50,
  "offset": 0
}
```

- `application`: The application's name or hex encoded address
- `status` (optional): Filter epochs by status
- `limit` (optional): The maximum number of epochs to return per page (default: 50)
- `offset` (optional): The starting point for the list of epochs to return (default: 0)

#### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "index": "0x...",
        "first_block": "0x...",
        "last_block": "0x...",
        "claim_hash": "0x...",
        "claim_transaction_hash": "0x...",
        "status": "OPEN",
        "virtual_index": "0x...",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total_count": 100,
      "limit": 50,
      "offset": 0
    }
  },
  "id": 1
}
```

### cartesi_getEpoch

Fetches a single epoch by application and index.

#### Parameters

```json
{
  "application": "string",
  "epoch_index": "0x..."
}
```

- `application`: The application's name or hex encoded address
- `epoch_index`: The index of the epoch to be retrieved (hex encoded)

#### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": {
      "index": "0x...",
      "first_block": "0x...",
      "last_block": "0x...",
      "claim_hash": "0x...",
      "claim_transaction_hash": "0x...",
      "status": "OPEN",
      "virtual_index": "0x...",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  },
  "id": 1
}
```

### cartesi_getLastAcceptedEpochIndex

Fetches the latest accepted epoch index by application.

#### Parameters

```json
{
  "application": "string"
}
```

- `application`: The application's name or hex encoded address

#### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": "0x..."
  },
  "id": 1
}
```

## Inputs

### cartesi_listInputs

Returns a paginated list of inputs, with options to filter by epoch index or input sender.

#### Parameters

```json
{
  "application": "string",
  "epoch_index": "0x...",
  "sender": "0x...",
  "limit": 50,
  "offset": 0
}
```

- `application`: The application's name or hex encoded address
- `epoch_index` (optional): Filter inputs by a specific epoch index (hex encoded)
- `sender` (optional): Filter inputs by the sender's address (hex encoded)
- `limit` (optional): The maximum number of inputs to return per page (default: 50)
- `offset` (optional): The starting point for the list of inputs to return (default: 0)

#### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "epoch_index": "0x...",
        "index": "0x...",
        "block_number": "0x...",
        "raw_data": "0x...",
        "decoded_data": {
          "chain_id": "0x...",
          "application_contract": "0x...",
          "sender": "0x...",
          "block_number": "0x...",
          "block_timestamp": "0x...",
          "prev_randao": "0x...",
          "index": "0x...",
          "payload": "0x..."
        },
        "status": "ACCEPTED",
        "machine_hash": "0x...",
        "outputs_hash": "0x...",
        "transaction_reference": "0x...",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total_count": 100,
      "limit": 50,
      "offset": 0
    }
  },
  "id": 1
}
```

### cartesi_getInput

Retrieves a single input from the application using the specified input_index.

#### Parameters

```json
{
  "application": "string",
  "input_index": "0x..."
}
```

- `application`: The application's name or hex encoded address
- `input_index`: The index of the input to be retrieved (hex encoded)

#### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": {
      "epoch_index": "0x...",
      "index": "0x...",
      "block_number": "0x...",
      "raw_data": "0x...",
      "decoded_data": {
        "chain_id": "0x...",
        "application_contract": "0x...",
        "sender": "0x...",
        "block_number": "0x...",
        "block_timestamp": "0x...",
        "prev_randao": "0x...",
        "index": "0x...",
        "payload": "0x..."
      },
      "status": "ACCEPTED",
      "machine_hash": "0x...",
      "outputs_hash": "0x...",
      "transaction_reference": "0x...",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  },
  "id": 1
}
```

### cartesi_getProcessedInputCount

Returns an integer with the amount of inputs already processed by the application.

#### Parameters

```json
{
  "application": "string"
}
```

- `application`: The application's name or hex encoded address

#### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": "0x..."
  },
  "id": 1
}
```

## Outputs

### cartesi_listOutputs

Returns a paginated list of outputs, with options to filter by epoch index, input index, output type and voucher address.

#### Parameters

```json
{
  "application": "string",
  "epoch_index": "0x...",
  "input_index": "0x...",
  "output_type": "0x...",
  "voucher_address": "0x...",
  "limit": 50,
  "offset": 0
}
```

- `application`: The application's name or hex encoded address
- `epoch_index` (optional): Filter outputs by a specific epoch index (hex encoded)
- `input_index` (optional): Filter outputs by a specific input index (hex encoded)
- `output_type` (optional): Filter outputs by output type (first 4 bytes of raw data hex encoded)
- `voucher_address` (optional): Filter outputs by the voucher address (hex encoded)
- `limit` (optional): The maximum number of outputs to return per page (default: 50)
- `offset` (optional): The starting point for the list of outputs to return (default: 0)

#### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "epoch_index": "0x...",
        "input_index": "0x...",
        "index": "0x...",
        "raw_data": "0x...",
        "decoded_data": {
          "type": "0x...",
          "payload": "0x..."
        },
        "hash": "0x...",
        "output_hashes_siblings": ["0x..."],
        "execution_transaction_hash": "0x...",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total_count": 100,
      "limit": 50,
      "offset": 0
    }
  },
  "id": 1
}
```

### cartesi_getOutput

Retrieves a single output from the application using the specified output_index.

#### Parameters

```json
{
  "application": "string",
  "output_index": "0x..."
}
```

- `application`: The application's name or hex encoded address
- `output_index`: The index of the output to be retrieved (hex encoded)

#### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": {
      "epoch_index": "0x...",
      "input_index": "0x...",
      "index": "0x...",
      "raw_data": "0x...",
      "decoded_data": {
        "type": "0x...",
        "payload": "0x..."
      },
      "hash": "0x...",
      "output_hashes_siblings": ["0x..."],
      "execution_transaction_hash": "0x...",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  },
  "id": 1
}
```

## Reports

### cartesi_listReports

Returns a paginated list of reports for a given application. Optionally filters by epoch_index and input_index.

#### Parameters

```json
{
  "application": "string",
  "epoch_index": "0x...",
  "input_index": "0x...",
  "limit": 50,
  "offset": 0
}
```

- `application`: The application's name or hex encoded address
- `epoch_index` (optional): Filter by epoch index (hex encoded)
- `input_index` (optional): Filter by input index (hex encoded)
- `limit` (optional): The maximum number of reports to return per page (default: 50)
- `offset` (optional): The starting point for the list of reports to return (default: 0)

#### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "epoch_index": "0x...",
        "input_index": "0x...",
        "index": "0x...",
        "raw_data": "0x...",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total_count": 100,
      "limit": 50,
      "offset": 0
    }
  },
  "id": 1
}
```

### cartesi_getReport

Fetches a single report by application and report_index.

#### Parameters

```json
{
  "application": "string",
  "report_index": "0x..."
}
```

- `application`: The application's name or hex encoded address
- `report_index`: The index of the report to be retrieved (hex encoded)

#### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": {
      "epoch_index": "0x...",
      "input_index": "0x...",
      "index": "0x...",
      "raw_data": "0x...",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  },
  "id": 1
}
``` 