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
Returns a paginated list of all applications registered in the Cartesi Rollups instance. Useful for discovering available dApps and their metadata. For more details, see the [detailed reference](applications/applications-list).

### cartesi_getApplication
Fetches detailed information about a specific application by its name or address, including its state, addresses, and execution parameters. For more details, see the [detailed reference](applications/applications-get).

## Epochs

### cartesi_listEpochs
Returns a paginated list of epochs for a given application. You can filter by status to find open, closed, or processed epochs. For more details, see the [detailed reference](epochs/epochs-list).

### cartesi_getEpoch
Fetches detailed information about a specific epoch, including its status, block range, and creation/update timestamps. For more details, see the [detailed reference](epochs/epochs-get).

### cartesi_getLastAcceptedEpochIndex
Fetches the latest accepted epoch index for a given application, which is useful for tracking rollup progress. For more details, see the [detailed reference](epochs/last-accepted).

## Inputs

### cartesi_listInputs
Returns a paginated list of inputs sent to an application. You can filter by epoch or sender. Each input includes payload, sender, and status. For more details, see the [detailed reference](inputs/inputs-list).

### cartesi_getInput
Retrieves detailed information about a specific input, including its payload, sender, and any outputs it produced. For more details, see the [detailed reference](inputs/inputs-get).

### cartesi_getProcessedInputCount
Returns the number of inputs already processed by the application. Useful for monitoring input queue progress. For more details, see the [detailed reference](inputs/processed-count).

## Outputs

### cartesi_listOutputs
Returns a paginated list of outputs (notices, vouchers, delegate call vouchers) for a given application. You can filter by epoch, input, output type, or voucher address. For more details, see the [detailed reference](outputs/outputs-list).

### cartesi_getOutput
Retrieves detailed information about a specific output, including its type, payload, and proof data. For more details, see the [detailed reference](outputs/outputs-get).

## Reports

### cartesi_listReports
Returns a paginated list of reports for a given application, optionally filtered by epoch or input. Reports are useful for debugging and auditing. For more details, see the [detailed reference](reports/reports-list).

### cartesi_getReport
Fetches detailed information about a specific report by application and report index. For more details, see the [detailed reference](reports/reports-get). 