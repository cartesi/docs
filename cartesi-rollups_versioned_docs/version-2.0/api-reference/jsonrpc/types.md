---
id: types
title: Types
---

## Basic Types

### ApplicationName

A string that matches the pattern `^[a-z0-9_-]+$`.

Example: `"my-application"`

### EthereumAddress

A hex-encoded Ethereum address that matches the pattern `^0x[a-fA-F0-9]{40}$`.

Example: `"0x1234567890123456789012345678901234567890"`

### Hash

A hex-encoded hash that matches the pattern `^0x[a-fA-F0-9]{64}$`.

Example: `"0x1234567890123456789012345678901234567890123456789012345678901234"`

### ByteArray

A hex-encoded byte array that matches the pattern `^0x[a-fA-F0-9]*$`.

Example: `"0x1234567890"`

### UnsignedInteger

A hex-encoded unsigned 64-bit integer that matches the pattern `^0x[a-fA-F0-9]{1,16}$`.

Example: `"0x123"`

### FunctionSelector

A hex-encoded function selector that matches the pattern `^0x[a-fA-F0-9]{8}$`.

Example: `"0x12345678"`

### NameOrAddress

A union type that can be either an `ApplicationName` or an `EthereumAddress`.

Example: `"my-application"` or `"0x1234567890123456789012345678901234567890"`

## Enums

### ApplicationState

```typescript
enum ApplicationState {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
  INOPERABLE = "INOPERABLE"
}
```

### EpochStatus

```typescript
enum EpochStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  INPUTS_PROCESSED = "INPUTS_PROCESSED",
  CLAIM_COMPUTED = "CLAIM_COMPUTED",
  CLAIM_SUBMITTED = "CLAIM_SUBMITTED",
  CLAIM_ACCEPTED = "CLAIM_ACCEPTED",
  CLAIM_REJECTED = "CLAIM_REJECTED"
}
```

### InputCompletionStatus

```typescript
enum InputCompletionStatus {
  NONE = "NONE",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXCEPTION = "EXCEPTION",
  MACHINE_HALTED = "MACHINE_HALTED",
  OUTPUTS_LIMIT_EXCEEDED = "OUTPUTS_LIMIT_EXCEEDED",
  CYCLE_LIMIT_EXCEEDED = "CYCLE_LIMIT_EXCEEDED",
  TIME_LIMIT_EXCEEDED = "TIME_LIMIT_EXCEEDED",
  PAYLOAD_LENGTH_LIMIT_EXCEEDED = "PAYLOAD_LENGTH_LIMIT_EXCEEDED"
}
```

### SnapshotPolicy

```typescript
enum SnapshotPolicy {
  NONE = "NONE",
  EACH_INPUT = "EACH_INPUT",
  EACH_EPOCH = "EACH_EPOCH"
}
```

## Objects

### Pagination

```typescript
interface Pagination {
  total_count: number;
  limit: number;
  offset: number;
}
```

### Application

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
  created_at: string;
  updated_at: string;
  execution_parameters: ExecutionParameters;
}
```

### ExecutionParameters

```typescript
interface ExecutionParameters {
  snapshot_policy: SnapshotPolicy;
  advance_inc_cycles: UnsignedInteger;
  advance_max_cycles: UnsignedInteger;
  inspect_inc_cycles: UnsignedInteger;
  inspect_max_cycles: UnsignedInteger;
  advance_inc_deadline: UnsignedInteger;
  advance_max_deadline: UnsignedInteger;
  inspect_inc_deadline: UnsignedInteger;
  inspect_max_deadline: UnsignedInteger;
  load_deadline: UnsignedInteger;
  store_deadline: UnsignedInteger;
  fast_deadline: UnsignedInteger;
  max_concurrent_inspects: number;
  created_at: string;
  updated_at: string;
}
```

### Epoch

```typescript
interface Epoch {
  index: UnsignedInteger;
  first_block: UnsignedInteger;
  last_block: UnsignedInteger;
  claim_hash: Hash | null;
  claim_transaction_hash: Hash | null;
  status: EpochStatus;
  virtual_index: UnsignedInteger;
  created_at: string;
  updated_at: string;
}
```

### Input

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
  created_at: string;
  updated_at: string;
}
```

### EvmAdvance

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

```typescript
interface Output {
  epoch_index: UnsignedInteger;
  input_index: UnsignedInteger;
  index: UnsignedInteger;
  raw_data: ByteArray;
  decoded_data: DecodedOutput | null;
  hash: Hash | null;
  output_hashes_siblings: Hash[];
  execution_transaction_hash: Hash | null;
  created_at: string;
  updated_at: string;
}
```

### Notice

```typescript
interface Notice {
  type: FunctionSelector;
  payload: ByteArray;
}
```

### Voucher

```typescript
interface Voucher {
  type: FunctionSelector;
  destination: EthereumAddress;
  value: string;
  payload: ByteArray;
}
```

### DelegateCallVoucher

```typescript
interface DelegateCallVoucher {
  type: FunctionSelector;
  destination: EthereumAddress;
  payload: ByteArray;
}
```

### DecodedOutput

A union type that can be either a `Notice`, a `Voucher`, or a `DelegateCallVoucher`.

### Report

```typescript
interface Report {
  epoch_index: UnsignedInteger;
  input_index: UnsignedInteger;
  index: UnsignedInteger;
  raw_data: ByteArray;
  created_at: string;
  updated_at: string;
}
``` 