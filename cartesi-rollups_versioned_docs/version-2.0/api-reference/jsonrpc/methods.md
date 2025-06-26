---
id: methods
title: Methods
---

# JSON-RPC API Methods

This page provides a quick reference to all available JSON-RPC methods in the Cartesi Rollups Node API. For each method, you will find:
- A summary of what it does
- The parameters it accepts (with types and descriptions)
- **Links to detailed documentation for each method**

Use this as a starting point to explore the API. For more details on each method, see the dedicated documentation pages in the sidebar or follow the links below.

## Applications

### [cartesi_listApplications](./methods/applications/list.md)
Returns a paginated list of all applications registered in the Cartesi Rollups instance.

Parameters:
- `limit` (optional): The maximum number of applications to return per page. Default: 50, Minimum: 1
- `offset` (optional): The starting point for the list of applications to return. Default: 0, Minimum: 0

### [cartesi_getApplication](./methods/applications/get.md)
Fetches detailed information about a specific application by its name or address.

Parameters:
- `application` (required): The application's name or hex encoded address.

## Epochs

### [cartesi_listEpochs](./methods/epochs/list.md)
Returns a paginated list of epochs for a given application.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `status` (optional): Filter epochs by status.
- `limit` (optional): The maximum number of epochs to return per page. Default: 50, Minimum: 1
- `offset` (optional): The starting point for the list of epochs to return. Default: 0, Minimum: 0

### [cartesi_getEpoch](./methods/epochs/get.md)
Fetches detailed information about a specific epoch.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `epoch_index` (required): The index of the epoch to be retrieved (hex encoded).

### [cartesi_getLastAcceptedEpochIndex](./methods/epochs/last-accepted.md)
Fetches the latest accepted epoch index for a given application.

Parameters:
- `application` (required): The application's name or hex encoded address.

## Inputs

### [cartesi_listInputs](./methods/inputs/list.md)
Returns a paginated list of inputs sent to an application.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `epoch_index` (optional): Filter inputs by a specific epoch index (hex encoded).
- `sender` (optional): Filter inputs by the sender's address (hex encoded).
- `limit` (optional): The maximum number of inputs to return per page. Default: 50, Minimum: 1
- `offset` (optional): The starting point for the list of inputs to return. Default: 0, Minimum: 0

### [cartesi_getInput](./methods/inputs/get.md)
Retrieves detailed information about a specific input.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `input_index` (required): The index of the input to be retrieved (hex encoded).

### [cartesi_getProcessedInputCount](./methods/inputs/processed-count.md)
Returns the number of inputs already processed by the application.

Parameters:
- `application` (required): The application's name or hex encoded address.

## Outputs

### [cartesi_listOutputs](./methods/outputs/list.md)
Returns a paginated list of outputs (notices, vouchers, DELEGATECALL vouchers) for a given application.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `epoch_index` (optional): Filter outputs by a specific epoch index (hex encoded).
- `input_index` (optional): Filter outputs by a specific input index (hex encoded).
- `output_type` (optional): Filter outputs by output type (first 4 bytes of raw data hex encoded).
- `voucher_address` (optional): Filter outputs by the voucher address (hex encoded).
- `limit` (optional): The maximum number of outputs to return per page. Default: 50, Minimum: 1
- `offset` (optional): The starting point for the list of outputs to return. Default: 0, Minimum: 0

### [cartesi_getOutput](./methods/outputs/get.md)
Retrieves detailed information about a specific output.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `output_index` (required): The index of the output to be retrieved (hex encoded).

## Reports

### [cartesi_listReports](./methods/reports/list.md)
Returns a paginated list of reports for a given application.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `epoch_index` (optional): Filter by epoch index (hex encoded).
- `input_index` (optional): Filter by input index (hex encoded).
- `limit` (optional): The maximum number of reports to return per page. Default: 50, Minimum: 1
- `offset` (optional): The starting point for the list of reports to return. Default: 0, Minimum: 0

### [cartesi_getReport](./methods/reports/get.md)
Fetches detailed information about a specific report.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `report_index` (required): The index of the report to be retrieved (hex encoded).

## Node Information

### [cartesi_getChainId](./methods/node/chain-id.md)
Fetches the chain ID that node is operating on.

No parameters required.

### [cartesi_getNodeVersion](./methods/node/version.md)
Fetches the semantic version of the Cartesi rollups node.

No parameters required. 