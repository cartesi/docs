---
id: overview
title: Overview
---

# JSON-RPC API Overview

The Cartesi Rollups Node API provides a JSON-RPC interface for interacting with Cartesi Rollups applications. This API allows you to:

- Query application information and status
- Monitor epochs and their states
- Track inputs and their processing status
- Retrieve outputs (notices, vouchers, DELEGATECALL vouchers)
- Access reports for debugging and auditing

## API Structure

The API is organized into the following categories:

### Applications
- `cartesi_listApplications`: List all registered applications
- `cartesi_getApplication`: Get details about a specific application

### Epochs
- `cartesi_listEpochs`: List epochs for an application
- `cartesi_getEpoch`: Get details about a specific epoch
- `cartesi_getLastAcceptedEpochIndex`: Get the latest accepted epoch index

### Inputs
- `cartesi_listInputs`: List inputs for an application
- `cartesi_getInput`: Get details about a specific input
- `cartesi_getProcessedInputCount`: Get the number of processed inputs

### Outputs
- `cartesi_listOutputs`: List outputs (notices, vouchers, DELEGATECALL vouchers)
- `cartesi_getOutput`: Get details about a specific output

### Reports
- `cartesi_listReports`: List reports for an application
- `cartesi_getReport`: Get details about a specific report

## Common Features

### Pagination
List endpoints support pagination with the following parameters:
- `limit`: Maximum number of items per page (default: 50, minimum: 1)
- `offset`: Starting point for the list (default: 0, minimum: 0)

### Filtering
Many list endpoints support filtering by:
- `epoch_index`: Filter by epoch
- `input_index`: Filter by input
- `status`: Filter by status
- `output_type`: Filter by output type
- `voucher_address`: Filter by voucher address

### Response Format
All responses follow the JSON-RPC 2.0 specification:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "data": [...],
    "pagination": {
      "total_count": 1,
      "limit": 10,
      "offset": 0
    }
  }
}
```

### Error Handling
Errors follow the JSON-RPC 2.0 error format:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32000,
    "message": "Server error"
  }
}
```

## Data Types

The API uses several data types:
- `HexString`: Hexadecimal values prefixed with "0x"
- `Timestamp`: ISO 8601 formatted timestamps
- Various enums for states and statuses
- Complex objects for applications, epochs, inputs, outputs, and reports

For detailed information about data types, see the [Types](types) page.

## Best Practices

1. **Error Handling**: Always check for errors in responses
2. **Pagination**: Use pagination to handle large result sets
3. **Filtering**: Use filters to narrow down results
4. **Rate Limiting**: Be mindful of API rate limits
5. **Caching**: Cache frequently accessed data when appropriate

## Examples

### Listing Applications
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

### Getting Application Details
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

### Listing Inputs with Filters
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

For more examples and detailed information about each method, see the [Methods](../methods) page. 