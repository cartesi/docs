---
id: overview
title: Overview
---

The Cartesi Rollups Node provides a JSON-RPC API for reading rollups data. This API is designed to be simple and efficient, providing information about applications, epochs, inputs, and various types of outputs including notices, reports, vouchers, and delegate call vouchers.

The JSON-RPC API is particularly useful for applications that need to:
- Query the state of applications and epochs
- Retrieve inputs and their processing status
- Read different types of outputs:
  - **Notices**: Informational messages emitted by the application
  - **Reports**: Debugging and logging information
  - **Vouchers**: Transactions that can be executed on the base layer
  - **Delegate Call Vouchers**: Advanced smart contract interactions

## Base URL

The JSON-RPC API is available at the following endpoint:

```
http://localhost:8080/rpc
```

## Request Format

All requests must be made using HTTP POST with a JSON-RPC 2.0 payload. The request body should be a JSON object with the following structure:

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listApplications",
  "params": {
    "limit": 50,
    "offset": 0
  },
  "id": 1
}
```

### Request Fields

- `jsonrpc`: Must be "2.0" (string)
- `method`: The name of the method to call (string)
- `params`: The parameters for the method (object, optional)
- `id`: A unique identifier for the request (number or string)

## Response Format

All responses follow the JSON-RPC 2.0 specification. A successful response will have the following structure:

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [...],
    "pagination": {
      "total_count": 100,
      "limit": 50,
      "offset": 0
    }
  },
  "id": 1
}
```

### Response Fields

- `jsonrpc`: Always "2.0" (string)
- `result`: The result of the method call (object)
- `id`: The same id as in the request (number or string)

## Error Handling

If an error occurs, the response will have the following structure:

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32602,
    "message": "Invalid params",
    "data": "Parameter 'limit' must be greater than 0"
  },
  "id": 1
}
```

### Error Fields

- `code`: The error code (number)
- `message`: A short description of the error (string)
- `data`: Additional information about the error (any, optional)

## Common Error Codes

- `-32600`: Invalid Request
- `-32601`: Method not found
- `-32602`: Invalid params
- `-32603`: Internal error
- `-32000`: Application not found
- `-32001`: Epoch not found
- `-32002`: Input not found
- `-32003`: Output not found
- `-32004`: Report not found

## Pagination

Many methods support pagination through the `limit` and `offset` parameters:

- `limit`: The maximum number of items to return (default: 50)
- `offset`: The starting point for the list of items to return (default: 0)

The response will include a `pagination` object with:
- `total_count`: The total number of items available
- `limit`: The number of items returned in this response
- `offset`: The starting point of the returned items 