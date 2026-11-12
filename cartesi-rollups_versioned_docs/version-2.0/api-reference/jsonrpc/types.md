---
id: types
title: Types
---

# JSON-RPC API Types

This page documents the data types used in the Cartesi Rollups Node API. These types are used in both request parameters and response data.

## Basic Types

### EthereumAddress
A string representing an Ethereum address in hexadecimal format, prefixed with "0x".

Pattern: `^0x[a-fA-F0-9]{40}$`

Example:
```json
"0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
```

### Hash
A string representing a hash value in hexadecimal format, prefixed with "0x".

Pattern: `^0x[a-fA-F0-9]{64}$`

Example:
```json
"0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
```

### ByteArray
A string representing binary data in hexadecimal format, prefixed with "0x".

Pattern: `^0x[a-fA-F0-9]*$`

Example:
```json
"0x1234567890abcdef"
```

### UnsignedInteger
A string representing an unsigned 64-bit integer in hexadecimal format, prefixed with "0x".

Pattern: `^0x[a-fA-F0-9]{1,16}$`

Example:
```json
"0x1"
```

### UnsignedInteger256
A string representing an unsigned 256-bit integer in hexadecimal format, prefixed with "0x". The node emits it without leading zeros.

Pattern: `^0x[a-fA-F0-9]{1,64}$`

Example:
```json
"0xde0b6b3a7640000"
```

### FunctionSelector
A string representing a function selector in hexadecimal format, prefixed with "0x".

Pattern: `^0x[a-fA-F0-9]{8}$`

Example:
```json
"0xa9059cbb"
```

### ApplicationName
A string representing an application name.

Pattern: `^[a-z0-9_-]+$`

Example:
```json
"my-application"
```

### NameOrAddress
Either an ApplicationName or an EthereumAddress.

Example:
```json
"my-application"
```
or
```json
"0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
```

### Timestamp
A string representing a timestamp in ISO 8601 format.

Example:
```json
"2024-01-01T00:00:00Z"
```

## Enums

### ApplicationStatus
Whether the node can still execute the application and produce claims for it. The status is independent of the operator's intent (the `enabled` field of [Application](#application)) and of foreclosure (the `foreclose_block` field): a foreclosed application can have any status.

Values:
- `OK`: The application is healthy. It is processed when it is enabled and not foreclosed.
- `FAILED`: A recoverable local failure stopped execution (for example a process crash, lack of memory, or a local execution limit such as a deadline or a configured cycle limit). After the operator repairs the cause, enabling the application again clears `FAILED` (for example with `cartesi-rollups-cli app status <app> enabled`).
- `DIVERGED`: The claim computed by the node disagrees with the claim accepted on chain. Terminal.
- `CORRUPTED`: Local state, or its relation with the chain history, is missing or inconsistent. Terminal.
- `GUEST_EXCEPTION`: The application raised an exception while processing an input. Terminal.
- `MACHINE_HALTED`: The machine halted while processing an input. Terminal.
- `MCYCLE_OVERFLOW`: The machine reached its cycle ceiling while processing an input. Terminal.
- `UNEXPECTED_YIELD`: The machine yielded unexpectedly while processing an input. Terminal.
- `INVALID_OUTPUTS_ROOT`: The outputs root of an input or epoch is invalid. Terminal.

Terminal statuses stop execution for good and are not cleared by enabling the application. A terminal status can still be replaced by `DIVERGED` or `CORRUPTED` when later chain data shows an integrity failure. The `reason` field of the application describes the failure.

Example:
```json
"OK"
```

### Consensus
The consensus type of an application.

Values:
- `AUTHORITY`
- `QUORUM`
- `PRT`

Example:
```json
"AUTHORITY"
```

### EpochStatus
The current status of an epoch.

Values:
- `OPEN`: The epoch is open and accepting inputs
- `CLOSED`: The epoch is closed and not accepting inputs
- `INPUTS_PROCESSED`: The epoch inputs have been processed
- `CLAIM_COMPUTED`: The node computed the epoch claim and the output proofs
- `CLAIM_SUBMITTED`: The node submitted the epoch claim on chain
- `CLAIM_STAGED`: The claim (or, for PRT, the tournament result) is staged on chain and waits for the claim staging period to end before it can be accepted. For PRT, acceptance can also happen earlier, when all sentries agree with the staged result
- `CLAIM_ACCEPTED`: The claim was accepted on chain. Outputs of the epoch can now be validated and executed on chain. Terminal
- `CLAIM_REJECTED`: Another claim for this epoch was staged or accepted on chain (Quorum consensus). Terminal
- `CLAIM_FORECLOSED`: The application was foreclosed before the epoch claim was accepted, so the claim will never be accepted. Terminal

Terminal statuses never change again. The non-terminal statuses are `OPEN`, `CLOSED`, `INPUTS_PROCESSED`, `CLAIM_COMPUTED`, `CLAIM_SUBMITTED` and `CLAIM_STAGED`.

Example:
```json
"OPEN"
```

### InputCompletionStatus
The current status of an input.

Values:
- `NONE`: The input has not been processed yet
- `ACCEPTED`: The application accepted the input
- `REJECTED`: The application rejected the input. The machine keeps the state it had before the input and the input's outputs are discarded (its reports are kept). Later inputs are processed normally
- `EXCEPTION`: The application raised an exception. The `exception_data` field of the input holds the exception payload
- `MACHINE_HALTED`: The machine halted while processing the input
- `OVERFLOW`: The machine reached its cycle ceiling while processing the input
- `UNEXPECTED_YIELD`: The machine yielded unexpectedly while processing the input
- `INVALID_OUTPUTS_ROOT`: The application accepted the input but declared an outputs root with an invalid length

`EXCEPTION`, `MACHINE_HALTED`, `OVERFLOW`, `UNEXPECTED_YIELD` and `INVALID_OUTPUTS_ROOT` are terminal for the application: the node processes no further inputs, and the application gets the matching terminal [ApplicationStatus](#applicationstatus).

Local execution limits (deadlines, a configured cycle limit) and other node-side failures are not recorded as input statuses. In that case the input stays `NONE` and the application status becomes `FAILED`.

Example:
```json
"ACCEPTED"
```

### SnapshotPolicy
The snapshot policy for an application.

Values:
- `NONE`: No snapshots are taken
- `EVERY_INPUT`: A snapshot is taken after each input
- `EVERY_EPOCH`: A snapshot is taken at the end of each epoch

Example:
```json
"NONE"
```

## Interfaces

### Application
Represents a Cartesi Rollups application.

```typescript
interface Application {
  name: ApplicationName;
  iapplication_address: EthereumAddress;
  iconsensus_address: EthereumAddress;
  iinputbox_address: EthereumAddress;
  template_hash: Hash;
  epoch_length: UnsignedInteger;
  claim_staging_period: UnsignedInteger; // In blocks
  withdrawal_config: WithdrawalConfig;
  consensus_type: Consensus;
  enabled: boolean; // Operator intent
  status: ApplicationStatus;
  reason: string | null; // Set whenever status is not OK
  iinputbox_block: UnsignedInteger;
  last_epoch_check_block: UnsignedInteger;
  last_input_check_block: UnsignedInteger;
  last_output_check_block: UnsignedInteger;
  last_tournament_check_block: UnsignedInteger;
  last_foreclose_check_block: UnsignedInteger;
  last_accounts_drive_proved_check_block: UnsignedInteger;
  last_withdrawal_check_block: UnsignedInteger;
  processed_inputs: UnsignedInteger;
  foreclose_block: UnsignedInteger; // "0x0" until a foreclosure is observed
  foreclose_transaction: Hash | null;
  accounts_drive_proved_block: UnsignedInteger; // "0x0" until the accounts drive is proved
  accounts_drive_proved_transaction: Hash | null;
  accounts_drive_merkle_root: Hash | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  execution_parameters: ExecutionParameters;
}
```

- `enabled` is the operator's intent: `true` means the node keeps observing the application on chain and runs the work it is eligible for. It is set with `cartesi-rollups-cli app status <app> enabled|disabled`.
- `status` tells whether the node can still execute the application. See [ApplicationStatus](#applicationstatus) for the values and which ones are terminal. A healthy, running application has `enabled: true` and `status: "OK"`.
- `reason` describes the failure or terminal status. It is always set when `status` is not `OK`, and can be `null` when `status` is `OK`.
- Foreclosure is not a status. A non-zero `foreclose_block` means the node observed the on-chain foreclosure of the application, and `foreclose_transaction` holds the transaction hash. After the accounts drive is proved on chain, `accounts_drive_proved_block`, `accounts_drive_proved_transaction` and `accounts_drive_merkle_root` are set. The transaction hash fields are `null` while the matching block field is `"0x0"`.
- The `last_*_check_block` fields are the last blocks the node scanned for each kind of on-chain event.

### WithdrawalConfig
The emergency withdrawal configuration of an application, as set on chain when the application was deployed. An all-zero configuration means that no withdrawal handling is configured; an application without a guardian cannot be foreclosed.

```typescript
interface WithdrawalConfig {
  guardian: EthereumAddress;
  log2_leaves_per_account: UnsignedInteger;
  log2_max_num_of_accounts: UnsignedInteger;
  accounts_drive_start_index: UnsignedInteger;
  withdrawal_output_builder: EthereumAddress;
}
```

### ExecutionParameters
Configuration parameters for application execution.

```typescript
interface ExecutionParameters {
  snapshot_policy: SnapshotPolicy;
  advance_inc_cycles: UnsignedInteger;
  advance_max_cycles: UnsignedInteger;
  inspect_inc_cycles: UnsignedInteger;
  inspect_max_cycles: UnsignedInteger;
  advance_inc_deadline: UnsignedInteger; // Duration in nanoseconds
  advance_max_deadline: UnsignedInteger; // Duration in nanoseconds
  inspect_inc_deadline: UnsignedInteger; // Duration in nanoseconds
  inspect_max_deadline: UnsignedInteger; // Duration in nanoseconds
  load_deadline: UnsignedInteger; // Duration in nanoseconds
  store_deadline: UnsignedInteger; // Duration in nanoseconds
  fast_deadline: UnsignedInteger; // Duration in nanoseconds
  max_concurrent_inspects: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### Epoch
Represents a Cartesi Rollups epoch.

```typescript
interface Epoch {
  index: UnsignedInteger;
  first_block: UnsignedInteger;
  last_block: UnsignedInteger;
  input_index_lower_bound: UnsignedInteger;
  input_index_upper_bound: UnsignedInteger;
  machine_hash: Hash | null;
  tx_buffer_data_block: Hash | null;
  tx_buffer_proof?: Hash[];
  iflags_y_data_block: Hash | null;
  iflags_y_proof?: Hash[];
  htif_tohost_data_block: Hash | null;
  htif_tohost_proof?: Hash[];
  claim_transaction_hash: Hash | null;
  commitment: Hash | null; // PRT only
  commitment_proof?: Hash[]; // PRT only
  tournament_address: EthereumAddress | null; // PRT only
  status: EpochStatus;
  staged_at_block: UnsignedInteger | null;
  virtual_index: UnsignedInteger;
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

- `machine_hash` is the machine state hash at the end of the epoch. The `*_data_block` fields and the matching `*_proof` sibling lists prove parts of that machine state (the CMIO TX buffer, the `iflags.Y` register and the HTIF `tohost` register) against `machine_hash`.
- The `*_proof` lists are returned by [`cartesi_getEpoch`](./methods/epochs/get.md) and [`cartesi_getEpochByVirtualIndex`](./methods/epochs/get-by-virtual-index.md). [`cartesi_listEpochs`](./methods/epochs/list.md) omits them.
- `staged_at_block` is the block in which the claim was staged on chain, or `null` before that.
- `virtual_index` is the epoch's dense insertion rank (0, 1, 2, … without gaps).

### Input
Represents a Cartesi Rollups input.

```typescript
interface Input {
  epoch_index: UnsignedInteger;
  index: UnsignedInteger;
  block_number: UnsignedInteger;
  raw_data: ByteArray;
  decoded_data?: EvmAdvance; // Omitted when raw_data cannot be decoded
  status: InputCompletionStatus;
  exception_data: ByteArray | null; // Set only when status is EXCEPTION
  machine_hash: Hash | null;
  tx_buffer_data_block: Hash | null;
  transaction_hash: Hash; // L1 transaction that added the input
  log_index: UnsignedInteger; // Log index of the InputAdded event
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

`exception_data` holds the exception payload provided by the application. It is `null` unless `status` is `EXCEPTION`; an empty payload is `"0x"`.

### EvmAdvance
The decoded data of an EVM advance input.

```typescript
interface EvmAdvance {
  chain_id: UnsignedInteger;
  application_contract: EthereumAddress;
  sender: EthereumAddress;
  block_number: UnsignedInteger;
  block_timestamp: UnsignedInteger;
  prev_randao: UnsignedInteger256;
  index: UnsignedInteger;
  payload: ByteArray;
}
```

### Output
Represents a Cartesi Rollups output (notice, voucher, or DELEGATECALL voucher).

```typescript
interface Output {
  epoch_index: UnsignedInteger;
  input_index: UnsignedInteger;
  index: UnsignedInteger;
  raw_data: ByteArray;
  decoded_data?: DecodedOutput; // Omitted when raw_data cannot be decoded
  hash: Hash | null;
  output_hashes_siblings: Hash[] | null;
  execution_transaction_hash: Hash | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

- `hash` and `output_hashes_siblings` (the proof of the output in the epoch's outputs Merkle tree) are `null` until the node computes the epoch claim (epoch status `CLAIM_COMPUTED`).
- `execution_transaction_hash` is the transaction that executed the output on chain, or `null` if the node has not observed an execution.

:::caution Proofs are returned before outputs are executable
The node returns `hash` and `output_hashes_siblings` from `CLAIM_COMPUTED` on, but the application contract accepts the proof (in `executeOutput` and `validateOutput`) only after the epoch claim is accepted on chain. Until the epoch status is `CLAIM_ACCEPTED`, an execution attempt reverts (`InvalidOutputsMerkleRoot`). For an epoch that ends as `CLAIM_FORECLOSED`, it never succeeds. Enable "execute" or "withdraw" actions only for outputs whose epoch is `CLAIM_ACCEPTED`.
:::

### Notice
Represents a notice output.

```typescript
interface Notice {
  type: "Notice";
  payload: ByteArray;
}
```

### Voucher
Represents a voucher output.

```typescript
interface Voucher {
  type: "Voucher";
  destination: EthereumAddress;
  value: UnsignedInteger256; // Amount of Wei sent with the call
  payload: ByteArray;
}
```

### DelegateCallVoucher
Represents a DELEGATECALL voucher output.

```typescript
interface DelegateCallVoucher {
  type: "DelegateCallVoucher";
  destination: EthereumAddress;
  payload: ByteArray;
}
```

### DecodedOutput
The decoded data of an output. The `type` field holds the name of the output type. To filter outputs by type, use the output type selector (the first 4 bytes of `raw_data`): `0xc258d6e5` for notices, `0x237a816f` for vouchers and `0x10321e8b` for DELEGATECALL vouchers.

```typescript
type DecodedOutput = Notice | Voucher | DelegateCallVoucher;
```

### Report
Represents a Cartesi Rollups report.

```typescript
interface Report {
  epoch_index: UnsignedInteger;
  input_index: UnsignedInteger;
  index: UnsignedInteger;
  raw_data: ByteArray;
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### Withdrawal
Represents an emergency withdrawal observed on-chain (a `Withdrawal` event emitted by the application after foreclosure). See [`Application.withdraw()`](../contracts/application.md#withdraw).

```typescript
interface Withdrawal {
  account_index: UnsignedInteger;
  account: ByteArray;
  output: ByteArray;
  block_number: UnsignedInteger;
  transaction_hash: Hash;
  log_index: UnsignedInteger;
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

`account` is the raw account record read from the accounts drive, and `output` is the output that the application's withdrawal output builder produced from it. The node stores both as raw bytes and does not interpret them: the account encoding is defined by the withdrawal output builder. With the USD withdrawal output builder, an account is exactly 32 bytes: the balance as a 12-byte little-endian `uint96` (bytes 0 to 11), followed by the 20-byte owner address (bytes 12 to 31). For example, a balance of 1,000,000 owned by `0x71C7656EC7ab88b098defB751B7401B5f6d8976F` is:

```json
"0x40420f00000000000000000071c7656ec7ab88b098defb751b7401b5f6d8976f"
```

### Pagination
Represents pagination information for list responses.

```typescript
interface Pagination {
  total_count: number;
  limit: number;
  offset: number;
}
```

## Result Types

### ApplicationListResult
Result for listing applications.

```typescript
interface ApplicationListResult {
  data: Application[];
  pagination: Pagination;
}
```

### ApplicationGetResult
Result for getting a single application.

```typescript
interface ApplicationGetResult {
  data: Application;
}
```

### EpochListResult
Result for listing epochs.

```typescript
interface EpochListResult {
  data: Epoch[];
  pagination: Pagination;
}
```

### EpochGetResult
Result for getting a single epoch.

```typescript
interface EpochGetResult {
  data: Epoch;
}
```

### InputListResult
Result for listing inputs.

```typescript
interface InputListResult {
  data: Input[];
  pagination: Pagination;
}
```

### InputGetResult
Result for getting a single input.

```typescript
interface InputGetResult {
  data: Input;
}
```

### LastAcceptedEpochIndexResult
Result for getting the last accepted epoch index.

```typescript
interface LastAcceptedEpochIndexResult {
  data: UnsignedInteger;
}
```

### ProcessedInputCountResult
Result for getting the processed input count.

```typescript
interface ProcessedInputCountResult {
  data: UnsignedInteger;
}
```

### OutputListResult
Result for listing outputs.

```typescript
interface OutputListResult {
  data: Output[];
  pagination: Pagination;
}
```

### OutputGetResult
Result for getting a single output.

```typescript
interface OutputGetResult {
  data: Output;
}
```

### ReportListResult
Result for listing reports.

```typescript
interface ReportListResult {
  data: Report[];
  pagination: Pagination;
}
```

### ReportGetResult
Result for getting a single report.

```typescript
interface ReportGetResult {
  data: Report;
}
```

### WithdrawalListResult
Result for listing withdrawals.

```typescript
interface WithdrawalListResult {
  data: Withdrawal[];
  pagination: Pagination;
}
```

### WithdrawalGetResult
Result for getting a single withdrawal.

```typescript
interface WithdrawalGetResult {
  data: Withdrawal;
}
```

### ExecutedOutputCountResult
Result for getting the number of executed outputs.

```typescript
interface ExecutedOutputCountResult {
  data: UnsignedInteger;
}
```

### PendingExecutableOutputCountResult
Result for getting the number of vouchers and DELEGATECALL vouchers not yet executed.

```typescript
interface PendingExecutableOutputCountResult {
  data: UnsignedInteger;
}
```

### NodeInfoResult
Result for getting the node information.

```typescript
interface NodeInfoResult {
  data: NodeInfo;
}

interface NodeInfo {
  chain_id: UnsignedInteger;
  version: string; // Semantic version, e.g. "2.0.0-alpha.14"
  default_block: "FINALIZED" | "SAFE" | "LATEST" | "PENDING";
}
```

### ChainIdResult
Result for getting the chain ID (deprecated method `cartesi_getChainId`).

```typescript
interface ChainIdResult {
  data: UnsignedInteger;
}
```

### NodeVersionResult
Result for getting the node version (deprecated method `cartesi_getNodeVersion`).

```typescript
interface NodeVersionResult {
  data: string; // Semantic version format
}
```

### PRT result types
The PRT methods return `Tournament`, `Commitment`, `Match`, `MatchAdvanced`, `BondEvent` and `StandingChanged` objects, in the same `data` / `pagination` envelopes. Their complete schemas are part of the OpenRPC document that the node returns from `rpc.discover`.