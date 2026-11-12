---
id: overview
title: Overview
---

# JSON-RPC API Overview

The Cartesi Rollups Node API provides a JSON-RPC interface for interacting with Cartesi Rollups applications. This API allows you to:

- Query application information and status
- Monitor epochs and their states
- Track inputs and their processing status
- Retrieve outputs (notices, vouchers, DELEGATECALL vouchers) and their execution status
- Access reports for debugging and auditing
- Follow emergency withdrawals and PRT (Dave) tournament data

The API is read-only. This reference describes rollups-node [v2.0.0-alpha.14](https://github.com/cartesi/rollups-node/tree/v2.0.0-alpha.14). The node serves the API at the `/rpc` path on the address set by `CARTESI_JSONRPC_API_ADDRESS` (default `:10011`, so `http://localhost:10011/rpc` on a local node). Send each request as the body of an HTTP `POST`.

The node also publishes a machine-readable description of the API (an OpenRPC document) through the `rpc.discover` method. Its source is [`internal/jsonrpc/jsonrpc-discover.json`](https://github.com/cartesi/rollups-node/tree/v2.0.0-alpha.14/internal/jsonrpc/jsonrpc-discover.json).

:::note Browser access
CORS is disabled by default. To call the API from a browser application, the node operator must list the allowed origins in `CARTESI_JSONRPC_CORS_ALLOWED_ORIGINS` (comma-separated).
:::

## API Structure

The API is organized into the following categories:

### Applications
- `cartesi_listApplications`: List all registered applications
- `cartesi_getApplication`: Get details about a specific application

### Epochs
- `cartesi_listEpochs`: List epochs for an application
- `cartesi_getEpoch`: Get details about a specific epoch
- `cartesi_getEpochByVirtualIndex`: Get an epoch by its virtual (dense, gap-free) index
- `cartesi_getLastAcceptedEpochIndex`: Get the latest accepted epoch index

### Inputs
- `cartesi_listInputs`: List inputs for an application
- `cartesi_getInput`: Get details about a specific input
- `cartesi_getProcessedInputCount`: Get the number of processed inputs

### Outputs
- `cartesi_listOutputs`: List outputs (notices, vouchers, DELEGATECALL vouchers)
- `cartesi_getOutput`: Get details about a specific output
- `cartesi_getExecutedOutputCount`: Get the number of executed outputs (a change signal for output execution)
- `cartesi_getPendingExecutableOutputCount`: Get the number of vouchers and DELEGATECALL vouchers not yet executed

### Reports
- `cartesi_listReports`: List reports for an application
- `cartesi_getReport`: Get details about a specific report

### Emergency Withdrawals
- `cartesi_listWithdrawals`: List withdrawals of a foreclosed application
- `cartesi_getWithdrawal`: Get a withdrawal by account index

### PRT (Dave) Tournaments
- `cartesi_listTournaments`, `cartesi_getTournament`
- `cartesi_listCommitments`, `cartesi_getCommitment`
- `cartesi_listMatches`, `cartesi_getMatch`
- `cartesi_listMatchAdvances`, `cartesi_getMatchAdvance`
- `cartesi_listBondEvents`, `cartesi_getBondEvent`
- `cartesi_listStandingChanges`, `cartesi_getStandingChange`

These methods return data only for applications that use PRT consensus. See [Methods](./methods.md#prt-dave-tournaments).

### Node
- `cartesi_getNodeInfo`: Get the chain ID, node version and default block tag
- `cartesi_getChainId`: Get the chain ID (deprecated, use `cartesi_getNodeInfo`)
- `cartesi_getNodeVersion`: Get the node version (deprecated, use `cartesi_getNodeInfo`)
- `rpc.discover`: Get the OpenRPC description of the API

## Common Features

### Pagination
List endpoints support pagination with the following parameters:
- `limit`: Maximum number of items per page (default: 50). An omitted `limit` or a `limit` of 0 selects the default. Values above 10000 are capped at 10000 without an error; the `pagination.limit` field of the response shows the limit that was applied.
- `offset`: Starting point for the list (default: 0, minimum: 0)
- `descending`: If `true`, the list is sorted in descending order (default: `false`)

`pagination.total_count` is the number of items that match the filters, not the number of items in the page.

### Filtering
Many list endpoints support filtering by:
- `epoch_index`: Filter by epoch
- `input_index`: Filter by input
- `from` / `to`: Inclusive lower and upper bounds on the item index (epochs, inputs, outputs and reports)
- `status`: Filter epochs by one status or a list of statuses
- `sender`: Filter inputs by sender
- `transaction_hash`: Filter inputs by the L1 transaction that added them
- `output_type`: Filter outputs by one output type selector or a list of selectors
- `voucher_address`: Filter outputs by voucher destination address
- `executed`: Filter outputs by execution status

Integer parameters such as indexes, `from` and `to` are hex encoded strings, for example `"0x1a"`. List filters must not be empty arrays.

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
    "code": -31002,
    "message": "Application not found"
  }
}
```

Clients can dispatch on the error code. The node uses the following codes:

| Code    | Message                          | Meaning | What the client should do |
|---------|----------------------------------|---------|---------------------------|
| -32700  | Parse error                      | The request body is not valid JSON. | Fix the request. |
| -32600  | Invalid Request                  | The request is not a valid JSON-RPC 2.0 request (for example a wrong `jsonrpc` version or an invalid `id`). | Fix the request. |
| -32601  | Method not found                 | The method does not exist. | Fix the request. |
| -32602  | Invalid parameters               | A parameter is missing or malformed. The message may name the parameter. | Fix the request. |
| -32603  | Internal server error            | Node-side failure. Never used for missing resources. | Treat it as a node failure: alert or back off. Do not poll. |
| -32040  | invalid request batch size       | A batch is empty or has more than 100 entries. | Send between 1 and 100 entries. |
| -32070  | Request timed out                | The request could not be processed within the server's time limit. | Retry later, or with a smaller request. |
| -31001  | `<Resource>` not found (for example `Epoch not found`) | The application is known, but the requested epoch, input, output, report or other resource does not exist. For node methods, it reports missing node configuration. | For forward-looking resources (the next epoch, input or output index, or the last accepted epoch before any epoch is accepted), this is the "not created yet" signal and is **safe to poll**. |
| -31002  | Application not found            | The node does not know the application name or address. | Configuration error: retrying does not help. |
| -31003  | Response size limit exceeded     | The response does not fit in the 10 MiB response budget of the HTTP request. | Request fewer items (lower `limit`), or send the entry on its own or in a smaller batch. |
| -31004  | Batch list item limit exceeded   | The sum of the `limit` values of the list requests in a batch exceeds 10000. | Lower the limits or split the batch. |

Each method page lists the codes that the method can return.

### Limits

The node bounds the work of each HTTP request:

| Limit | Value | What happens when it is exceeded |
|-------|-------|----------------------------------|
| Items per list request (`limit`) | 10000 | The limit is capped at 10000 without an error. |
| Response size per HTTP request | 10 MiB, shared by all entries of a batch | Error `-31003`. In a batch, the entry that does not fit and every entry after it receive `-31003`. |
| Request body size | 1 MiB, for the whole batch | HTTP `413 Payload too large`, without a JSON-RPC response. |
| Batch size | 1 to 100 entries | A single error response with code `-32040`. |
| List items per batch | The sum of the effective `limit` of all list entries (an omitted or 0 limit counts as 50) must not exceed 10000 | A single error response with code `-31004`; no entry is executed. |
| Concurrent requests | `CARTESI_JSONRPC_MAX_INFLIGHT` (default 64; 0 disables the limit) | HTTP `503 Service Unavailable` with a `Retry-After` header, without a JSON-RPC response. |
| Processing time | About 25 seconds per HTTP request | Error `-32070`. |

### Batch Requests

The API accepts JSON-RPC batches (a JSON array of requests) with 1 to 100 entries. Entries run sequentially and the responses come back in the same order. Every entry receives a response, including entries without an `id`, which are answered with `"id": null`. This deviates from JSON-RPC 2.0, under which notifications receive no response. A batch response has HTTP status 200 even when some or all entries failed. Keep heavy list calls out of large batches: all entries share the response budget and the time limit.

## Data Types

The API uses several data types:
- `HexString`: Hexadecimal values prefixed with "0x"
- `Timestamp`: ISO 8601 formatted timestamps
- Various enums for states and statuses
- Complex objects for applications, epochs, inputs, outputs, and reports

For detailed information about data types, see the [Types](./types.md) page.

## Best Practices

1. **Error Handling**: Always check for errors in responses, and branch on the error code, not on the message
2. **Pagination**: Use pagination to handle large result sets, with `limit` at or below 10000
3. **Filtering**: Use filters to narrow down results
4. **Limits**: Respect the [limits](#limits) above. Back off when the node answers HTTP 503 (honor `Retry-After`) or `-32070`
5. **Caching**: Cache frequently accessed data when appropriate. An epoch in a terminal status (`CLAIM_ACCEPTED`, `CLAIM_REJECTED`, `CLAIM_FORECLOSED`) does not change status again
6. **Output execution**: Treat an output as executable on chain only after its epoch reaches `CLAIM_ACCEPTED`. See [Get Output](./methods/outputs/get.md#proofs-and-executability)

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

For more examples and detailed information about each method, see the [Methods](./methods.md) page.
