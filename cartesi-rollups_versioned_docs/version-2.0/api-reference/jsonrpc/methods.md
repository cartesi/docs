---
id: methods
title: Methods
---

# JSON-RPC API Methods

This page provides a quick reference to all available JSON-RPC methods in the Cartesi Rollups Node API (rollups-node v2.0.0-alpha.14). For each method, you will find:
- A summary of what it does
- The parameters it accepts (with types and descriptions)
- **Links to detailed documentation for each method**

Use this as a starting point to explore the API. For more details on each method, see the dedicated documentation pages in the sidebar or follow the links below. For error codes and limits that apply to every method, see the [Overview](./overview.md#error-handling).

Common rules for list methods:
- `limit` (optional): Maximum number of items to return per page. Default: 50. An omitted `limit` or 0 selects the default; values above 10000 are capped at 10000.
- `offset` (optional): Starting point of the page. Default: 0, Minimum: 0.
- `descending` (optional): If `true`, sort in descending order. Default: `false`.

Integer parameters (indexes, `from`, `to`) are hex encoded strings, for example `"0x1a"`.

## Applications

### [cartesi_listApplications](./methods/applications/list.md)
Returns a paginated list of all applications registered in the node.

Parameters:
- `limit`, `offset` (optional): Pagination.
- `descending` (optional): Sort by application name in descending order.

### [cartesi_getApplication](./methods/applications/get.md)
Fetches detailed information about a specific application by its name or address.

Parameters:
- `application` (required): The application's name or hex encoded address.

## Epochs

### [cartesi_listEpochs](./methods/epochs/list.md)
Returns a paginated list of epochs for a given application. Proofs are omitted from the listed epochs.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `status` (optional): Filter by one epoch status, or by a non-empty list of statuses.
- `from`, `to` (optional): Inclusive lower and upper bounds on the epoch index (hex encoded).
- `limit`, `offset` (optional): Pagination.
- `descending` (optional): Sort by epoch index in descending order.

### [cartesi_getEpoch](./methods/epochs/get.md)
Fetches detailed information about a specific epoch.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `epoch_index` (required): The index of the epoch to be retrieved (hex encoded).

### [cartesi_getEpochByVirtualIndex](./methods/epochs/get-by-virtual-index.md)
Fetches an epoch by its virtual index, the epoch's dense insertion rank (0, 1, 2, … without gaps).

Parameters:
- `application` (required): The application's name or hex encoded address.
- `virtual_index` (required): The virtual index of the epoch (hex encoded).

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
- `transaction_hash` (optional): Filter inputs by the L1 transaction hash that emitted the `InputAdded` event.
- `from`, `to` (optional): Inclusive lower and upper bounds on the input index (hex encoded).
- `limit`, `offset` (optional): Pagination.
- `descending` (optional): Sort by input index in descending order.

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
- `output_type` (optional): Filter outputs by one output type selector (first 4 bytes of raw data, hex encoded) or by a non-empty list of selectors.
- `voucher_address` (optional): Filter outputs by the voucher address (hex encoded).
- `executed` (optional): `true` selects outputs with an execution transaction hash, `false` selects outputs without one.
- `from`, `to` (optional): Inclusive lower and upper bounds on the output index (hex encoded).
- `limit`, `offset` (optional): Pagination.
- `descending` (optional): Sort by output index in descending order.

### [cartesi_getOutput](./methods/outputs/get.md)
Retrieves detailed information about a specific output.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `output_index` (required): The index of the output to be retrieved (hex encoded).

### [cartesi_getExecutedOutputCount](./methods/outputs/executed-count.md)
Returns the number of outputs whose on-chain execution the node has observed. Use it as a change signal for output execution.

Parameters:
- `application` (required): The application's name or hex encoded address.

### [cartesi_getPendingExecutableOutputCount](./methods/outputs/pending-executable-count.md)
Returns the number of vouchers and DELEGATECALL vouchers that have not been executed.

Parameters:
- `application` (required): The application's name or hex encoded address.

## Reports

### [cartesi_listReports](./methods/reports/list.md)
Returns a paginated list of reports for a given application.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `epoch_index` (optional): Filter by epoch index (hex encoded).
- `input_index` (optional): Filter by input index (hex encoded).
- `from`, `to` (optional): Inclusive lower and upper bounds on the report index (hex encoded).
- `limit`, `offset` (optional): Pagination.
- `descending` (optional): Sort by report index in descending order.

### [cartesi_getReport](./methods/reports/get.md)
Fetches detailed information about a specific report.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `report_index` (required): The index of the report to be retrieved (hex encoded).

## Emergency Withdrawals

### [cartesi_listWithdrawals](./methods/withdrawals/list.md)
Returns a paginated list of the `Withdrawal` events observed for a foreclosed application.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `account_index` (optional): Filter by account index (hex encoded).
- `limit`, `offset` (optional): Pagination.
- `descending` (optional): Sort by account index in descending order.

### [cartesi_getWithdrawal](./methods/withdrawals/get.md)
Fetches a single `Withdrawal` event by application and account index.

Parameters:
- `application` (required): The application's name or hex encoded address.
- `account_index` (required): The account index of the withdrawal (hex encoded).

## PRT (Dave) Tournaments

These methods expose the dispute data that the node indexes for applications that use PRT consensus: tournaments, the commitments that joined them, matches between commitments, match advances, bond events and tournament standing changes. Tournaments, commitments and matches also carry a `snapshot` of the current contract state, read at the block given in its `as_of_block` field. The complete result schemas are part of the OpenRPC document returned by `rpc.discover`. All methods take `application` (required, name or hex encoded address), and all list methods take `limit`, `offset` and `descending`.

| Method | Additional parameters | Returns |
|--------|-----------------------|---------|
| `cartesi_listTournaments` | `epoch_index`, `level`, `parent_tournament_address`, `parent_match_id_hash` (all optional) | Paginated list of tournaments |
| `cartesi_getTournament` | `address` (required) | One tournament |
| `cartesi_listCommitments` | `epoch_index`, `tournament_address` (optional) | Paginated list of commitments |
| `cartesi_getCommitment` | `epoch_index`, `tournament_address`, `commitment` (required) | One commitment |
| `cartesi_listMatches` | `epoch_index`, `tournament_address` (optional) | Paginated list of matches |
| `cartesi_getMatch` | `epoch_index`, `tournament_address`, `id_hash` (required) | One match |
| `cartesi_listMatchAdvances` | `epoch_index`, `tournament_address`, `id_hash` (required) | Paginated list of advances of one match, ordered by block number and log index |
| `cartesi_getMatchAdvance` | `epoch_index`, `tournament_address`, `id_hash`, `tx_hash`, `log_index` (required) | One match advance |
| `cartesi_listBondEvents` | `epoch_index`, `tournament_address` (optional) | Paginated list of partial bond refunds and bond recoveries, ordered by block number and log index |
| `cartesi_getBondEvent` | `tx_hash`, `log_index` (required) | One bond event |
| `cartesi_listStandingChanges` | `epoch_index`, `tournament_address` (required) | Paginated list of the `StandingChanged` events of one tournament, ordered by block number and log index. Use `descending: true` and `limit: 1` to get the latest one |
| `cartesi_getStandingChange` | `epoch_index`, `tournament_address`, `tx_hash`, `log_index` (required) | One standing change |

The `get` methods return error `-31001` when the requested object does not exist.

## Node Information

### [cartesi_getNodeInfo](./methods/node/node-info.md)
Fetches the chain ID, the node version and the default block tag (finality level) that the node uses for chain data.

No parameters required.

### [cartesi_getChainId](./methods/node/chain-id.md) (deprecated)
Fetches the chain ID that node is operating on. Use `cartesi_getNodeInfo` instead.

No parameters required.

### [cartesi_getNodeVersion](./methods/node/version.md) (deprecated)
Fetches the semantic version of the Cartesi rollups node. Use `cartesi_getNodeInfo` instead.

No parameters required.

### rpc.discover
Returns the OpenRPC document that describes every method, parameter, result and error of the API.

No parameters required.
