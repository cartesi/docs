---
id: types
title: Types
---

# JSON-RPC API Types

This page documents the data types used in the Cartesi Rollups Node API. These types are used in both request parameters and response data.

## Basic Types

### HexString
A string representing a hexadecimal value, prefixed with "0x". Used for addresses, hashes, and other binary data.

Example:
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
- `ERROR`: The application encountered an error and is not processing inputs

Example:
```json
"ENABLED"
```

### EpochStatus
The current status of an epoch.

Values:
- `OPEN`: The epoch is open and accepting inputs
- `CLOSED`: The epoch is closed and not accepting inputs
- `PROCESSED`: The epoch has been processed

Example:
```json
"OPEN"
```

### InputStatus
The current status of an input.

Values:
- `ACCEPTED`: The input has been accepted and processed
- `REJECTED`: The input has been rejected
- `PENDING`: The input is pending processing

Example:
```json
"ACCEPTED"
```

### SnapshotPolicy
The snapshot policy for an application.

Values:
- `NONE`: No snapshots are taken
- `EVERY_EPOCH`: A snapshot is taken at the end of each epoch
- `EVERY_INPUT`: A snapshot is taken after each input

Example:
```json
"NONE"
```

## Interfaces

### Application
Represents a Cartesi Rollups application.

```typescript
interface Application {
  name: string;
  iapplication_address: HexString;
  iconsensus_address: HexString;
  iinputbox_address: HexString;
  template_hash: HexString;
  epoch_length: HexString;
  data_availability: HexString;
  state: ApplicationState;
  reason: string;
  iinputbox_block: HexString;
  last_input_check_block: HexString;
  last_output_check_block: HexString;
  processed_inputs: HexString;
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
  advance_inc_cycles: HexString;
  advance_max_cycles: HexString;
  inspect_inc_cycles: HexString;
  inspect_max_cycles: HexString;
  advance_inc_deadline: HexString;
  advance_max_deadline: HexString;
  inspect_inc_deadline: HexString;
  inspect_max_deadline: HexString;
  load_deadline: HexString;
  store_deadline: HexString;
  fast_deadline: HexString;
  max_concurrent_inspects: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### Epoch
Represents a Cartesi Rollups epoch.

```typescript
interface Epoch {
  index: HexString;
  first_block: HexString;
  last_block: HexString;
  claim_hash: HexString | null;
  claim_transaction_hash: HexString | null;
  status: EpochStatus;
  virtual_index: HexString;
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### Input
Represents a Cartesi Rollups input.

```typescript
interface Input {
  epoch_index: HexString;
  index: HexString;
  block_number: HexString;
  raw_data: HexString;
  decoded_data: DecodedInput;
  status: InputStatus;
  machine_hash: HexString;
  outputs_hash: HexString;
  transaction_reference: HexString;
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### DecodedInput
The decoded data of an input.

```typescript
interface DecodedInput {
  chain_id: HexString;
  application_contract: HexString;
  sender: HexString;
  block_number: HexString;
  block_timestamp: HexString;
  prev_randao: HexString;
  index: HexString;
  payload: HexString;
}
```

### Output
Represents a Cartesi Rollups output (notice, voucher, or DELEGATECALL voucher).

```typescript
interface Output {
  epoch_index: HexString;
  input_index: HexString;
  index: HexString;
  raw_data: HexString;
  decoded_data: DecodedOutput;
  hash: HexString;
  output_hashes_siblings: HexString[];
  execution_transaction_hash: HexString;
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### DecodedOutput
The decoded data of an output.

```typescript
interface DecodedOutput {
  type: HexString;
  payload: HexString;
}
```

### Report
Represents a Cartesi Rollups report.

```typescript
interface Report {
  epoch_index: HexString;
  input_index: HexString;
  index: HexString;
  raw_data: HexString;
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

### PaginatedResponse
A generic interface for paginated responses.

```typescript
interface PaginatedResponse {
  data: T[];
  pagination: Pagination;
}
``` 