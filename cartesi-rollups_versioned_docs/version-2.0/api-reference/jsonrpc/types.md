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
A string representing an unsigned integer in hexadecimal format, prefixed with "0x".

Pattern: `^0x[a-fA-F0-9]{1,16}$`

Example:
```json
"0x1"
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

### ApplicationState
The current state of an application.

Values:
- `ENABLED`: The application is enabled and processing inputs
- `DISABLED`: The application is disabled and not processing inputs
- `INOPERABLE`: The application is inoperable

Example:
```json
"ENABLED"
```

### EpochStatus
The current status of an epoch.

Values:
- `OPEN`: The epoch is open and accepting inputs
- `CLOSED`: The epoch is closed and not accepting inputs
- `INPUTS_PROCESSED`: The epoch inputs have been processed
- `CLAIM_COMPUTED`: The epoch claim has been computed
- `CLAIM_SUBMITTED`: The epoch claim has been submitted
- `CLAIM_ACCEPTED`: The epoch claim has been accepted
- `CLAIM_REJECTED`: The epoch claim has been rejected

Example:
```json
"OPEN"
```

### InputCompletionStatus
The current status of an input.

Values:
- `NONE`: No status assigned
- `ACCEPTED`: The input has been accepted and processed
- `REJECTED`: The input has been rejected
- `EXCEPTION`: The input processing resulted in an exception
- `MACHINE_HALTED`: The machine halted during input processing
- `OUTPUTS_LIMIT_EXCEEDED`: The outputs limit was exceeded
- `CYCLE_LIMIT_EXCEEDED`: The cycle limit was exceeded
- `TIME_LIMIT_EXCEEDED`: The time limit was exceeded
- `PAYLOAD_LENGTH_LIMIT_EXCEEDED`: The payload length limit was exceeded

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
  data_availability: ByteArray;
  state: ApplicationState;
  reason: string;
  iinputbox_block: UnsignedInteger;
  last_input_check_block: UnsignedInteger;
  last_output_check_block: UnsignedInteger;
  processed_inputs: UnsignedInteger;
  created_at: Timestamp;
  updated_at: Timestamp;
  execution_parameters: ExecutionParameters;
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
  claim_hash: Hash | null;
  claim_transaction_hash: Hash | null;
  status: EpochStatus;
  virtual_index: UnsignedInteger;
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### Input
Represents a Cartesi Rollups input.

```typescript
interface Input {
  epoch_index: UnsignedInteger;
  index: UnsignedInteger;
  block_number: UnsignedInteger;
  raw_data: ByteArray;
  decoded_data: EvmAdvance | null;
  status: InputCompletionStatus;
  machine_hash: Hash | null;
  outputs_hash: Hash | null;
  transaction_reference: ByteArray;
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### EvmAdvance
The decoded data of an EVM advance input.

```typescript
interface EvmAdvance {
  chain_id: UnsignedInteger;
  application_contract: EthereumAddress;
  sender: EthereumAddress;
  block_number: UnsignedInteger;
  block_timestamp: UnsignedInteger;
  prev_randao: ByteArray;
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
  decoded_data: DecodedOutput | null;
  hash: Hash | null;
  output_hashes_siblings: Hash[] | null;
  execution_transaction_hash: Hash | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### Notice
Represents a notice output.

```typescript
interface Notice {
  type: FunctionSelector;
  payload: ByteArray;
}
```

### Voucher
Represents a voucher output.

```typescript
interface Voucher {
  type: FunctionSelector;
  destination: EthereumAddress;
  value: string;
  payload: ByteArray;
}
```

### DelegateCallVoucher
Represents a DELEGATECALL voucher output.

```typescript
interface DelegateCallVoucher {
  type: FunctionSelector;
  destination: EthereumAddress;
  payload: ByteArray;
}
```

### DecodedOutput
The decoded data of an output.

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

### ChainIdResult
Result for getting the chain ID.

```typescript
interface ChainIdResult {
  data: UnsignedInteger;
}
```

### NodeVersionResult
Result for getting the node version.

```typescript
interface NodeVersionResult {
  data: string; // Semantic version format
} 