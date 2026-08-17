> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Application integration requirements"
sidebar_label: "Application requirements"
description: "The execution, progress, persistence, and determinism contracts an application must satisfy to work safely with the app-specific sequencer."
---

An application integrates with the sequencer by implementing `sequencer_core::application::Application`. The off-chain sequencer uses this implementation to predict application state, and the canonical scheduler uses it inside the Cartesi machine to compute the authoritative result.

Both execution paths must produce the same state and outputs for the same ordered inputs. The interface therefore defines more than application methods. It also defines progress tracking, recovery dumps, canonical state bytes, and failure behavior.

This page describes the application code shared by the two execution paths. The application-specific sequencer binary is covered in [Integrating the sequencer with a Cartesi application](./integration.md).

## Complete interface overview

The required and optional parts of `Application` are grouped below.

| Area                     | Item                       | Required    | Purpose                                                                                                                |
| ------------------------ | -------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| Payload bound            | `MAX_METHOD_PAYLOAD_BYTES` | Yes         | Limits the encoded application payload accepted in `UserOp.data` and supplies the sequencer's batch-sizing calculation |
| Validation               | `validate_user_op`         | Yes         | Checks application-level acceptance rules without changing state                                                       |
| User operation execution | `execute_valid_user_op`    | Yes         | Applies an operation that passed the protocol and application checks                                                   |
| Direct input execution   | `execute_direct_input`     | Yes         | Applies an input recorded directly on the base layer                                                                   |
| Progress                 | `last_executed_safe_block` | Yes         | Reports the highest base-layer block covered by executed inputs                                                        |
| Progress                 | `executed_input_count`     | Yes         | Reports how many user operations and direct inputs have executed                                                       |
| Persistence              | `create_dump`              | Yes         | Writes a complete and durable recovery dump                                                                            |
| Persistence              | `from_dump`                | Yes         | Reconstructs equivalent application state from a dump                                                                  |
| Persistence              | `delete_dump`              | Yes         | Removes a dump that the sequencer no longer needs                                                                      |
| Persistence              | `state_file_in_dump`       | Yes         | Locates the canonical state file inside a dump                                                                         |
| State comparison         | `canonical_snapshot_bytes` | Conditional | Returns deterministic state bytes for machine inspection and watchdog comparison                                       |
| Diagnostics              | `export_state`             | No          | Returns human-readable JSON for debugging                                                                              |

`canonical_snapshot_bytes` and `export_state` have default implementations that return an error. Implement canonical bytes when the deployment serves machine state through inspect requests or uses the watchdog comparison.

## User operation validation and execution

Every user operation must pass through `validate_and_execute_user_op`. This shared function is used by the off-chain inclusion path and the canonical scheduler, giving both paths the same execution sequence:

```text
1. Check user_op.max_fee against the current frame fee
2. Call app.validate_user_op(...)
3. Build a ValidUserOp with the committed frame fee
4. Call app.execute_valid_user_op(...)
```

Application code should call the shared function in tests and custom execution paths. Calling `execute_valid_user_op` directly bypasses the protocol fee guard and can create behavior that the canonical scheduler will not reproduce.

### Keep validation read-only

`validate_user_op` receives:

- the recovered sender address;
- the original `UserOp`, including its nonce, offered `max_fee`, and application payload;
- the fee exponent of the current frame.

It must inspect state without changing it. Validation can run in contexts where a mutation would be applied twice or at a different point during replay. Side effects in validation can therefore make live execution, restart replay, and canonical execution disagree.

The protocol checks `max_fee >= current_fee` before application validation. The application still uses `current_fee` when it needs to verify that the sender can pay the resulting fee from application state.

The current rejection vocabulary contains:

| Reason                   | Meaning                                                              |
| ------------------------ | -------------------------------------------------------------------- |
| `InvalidNonce`           | The operation nonce does not match the application's expected nonce  |
| `InvalidMaxFee`          | The sender's offered fee is below the current frame fee              |
| `InsufficientFeeBalance` | Application state shows that the sender cannot pay the committed fee |

A validation rejection changes no state, produces no output, and is not placed in the ordered transaction stream.

### Execute an accepted operation deterministically

`execute_valid_user_op` receives a `ValidUserOp` containing the sender, the committed frame fee, and the application payload. It also receives the frame's `safe_block`.

The method must:

- apply the application transition exactly once;
- charge or account for the committed fee according to the application design;
- update application replay protection, such as the sender nonce;
- increment `executed_input_count`;
- set the safe-block clock to `max(previous_clock, safe_block)`;
- return deterministic notices and vouchers as `AppOutput` values.

The valid operation no longer contains the submitted nonce or offered `max_fee`. Any checks that depend on those fields belong in `validate_user_op`. Execution uses the frame fee selected by the protocol.

An operation may be included while producing no outputs. The CMA wallet uses this behavior when a decoded action cannot be completed after its protocol-level acceptance: it charges the data-availability fee, consumes the nonce, and returns an empty output list. Applications must define this behavior carefully because an included no-op differs from a validation rejection.

Notices and vouchers computed off-chain are predictions. The corresponding outputs become authoritative when the canonical machine executes the recorded batch.

## Direct input handling

`execute_direct_input` has no default implementation. Every application must define how inputs that did not enter through `POST /tx` affect its state.

The method receives:

- the base-layer sender;
- the base-layer inclusion block;
- the raw payload.

The canonical scheduler treats every recorded input from an address other than the configured batch submitter as a direct input. The application must then authenticate and decode the input according to its own rules. For example, the CMA wallet credits a deposit only when the sender is its configured ERC-20 portal and the payload names its supported token.

For every executed direct input, the application must increment `executed_input_count` and update its safe-block clock with `input.block_number`. An ignored or unsupported direct input still counts as executed once the application has processed it.

The actions supported through this method determine what users can do while the sequencer is unavailable. See [Direct inputs vs sequenced transactions](../concepts/direct-vs-sequenced.md).

## Progress tracking

### Safe-block clock

`last_executed_safe_block` returns the greatest block covered by any input executed by the current application state:

```text
user operation: max(clock, frame.safe_block)
direct input:   max(clock, input.block_number)
```

It returns `0` before any input executes. The value is part of logical application state and must survive cloning and dump restoration.

Recovery uses this clock to determine which base-layer inputs are already reflected in a checkpoint. Reporting a value that is too high can skip required inputs. Reporting one that is too low can execute an input again.

### Executed input count

`executed_input_count` counts user operations and direct inputs that the application executed. It is primarily a diagnostic agreement check used to compare live and replayed application instances.

Persist the count in every dump and restore it exactly. Do not derive it from balances, nonces, or database row numbers because those values can represent different histories.

## Recovery dump contract

The sequencer creates application dumps at batch boundaries, restores them during startup and recovery, and deletes superseded dumps. A dump may contain several application-specific files.

### Creating a dump

`create_dump(prefix)` receives a path that does not yet exist. The implementation creates that directory and writes every value that can influence future execution, including:

- application databases or state bytes;
- sender nonces and other replay protection;
- application configuration that changes execution;
- `last_executed_safe_block`;
- `executed_input_count`;
- metadata required to decode or reconstruct the main state.

When the method returns `Ok`, the dump must survive an immediate kernel crash. On POSIX systems, this requires synchronizing each file, the dump directory, and its parent directory before returning. The sequencer writes the SQLite row that references the dump only after `create_dump` succeeds.

### Restoring and deleting dumps

`from_dump(prefix)` must reconstruct state equivalent to the state that created the dump. Equivalence includes future behavior, progress values, and canonical state bytes, not only visible balances.

`delete_dump(prefix)` removes a previously created dump when the sequencer's garbage collection marks it as superseded. The implementation should limit deletion to the supplied dump path.

### Identifying canonical state

`state_file_in_dump(prefix)` is a pure path function. It must return one file inside the dump without loading application state. The bytes in that file must match the canonical machine's inspected state for the same logical history.

`canonical_snapshot_bytes()` returns the in-memory form of that same canonical representation. Keeping both paths byte-identical allows the watchdog to compare predicted and canonical state without application-specific conversion. The CMA wallet uses its ledger records image for both values and stores other recovery data, such as nonces and progress, in a separate metadata file.

`export_state()` can expose convenient JSON for debugging, but the sequencer does not use that JSON to restore state.

## Determinism across execution environments

Application behavior must depend only on the ordered input and current application state. Avoid consensus-path behavior based on:

- wall-clock time;
- random values;
- floating-point calculations;
- unordered collection iteration;
- thread scheduling;
- host-specific file layout or environment state;
- platform-specific numeric or serialization behavior.

Use the `safe_block`, direct-input block number, and EIP-712 domain supplied by the protocol when execution needs chain context.

Applications with target-specific storage must preserve the same logical and canonical byte representation on the host and in the Cartesi machine. The CMA integration uses a host buffer for sequencer prediction and a machine drive for canonical execution, then verifies that both produce byte-identical records.

## Error and replay behavior

User-caused refusal belongs in deterministic validation or in a clearly defined included outcome. `AppError::Internal` and I/O errors represent failures from which the sequencer cannot safely continue.

An internal execution error stops the off-chain inclusion lane. Reserve it for invariant violations and infrastructure failures. Do not use it as a general response to malformed application data or insufficient business-level balance.

Any input that succeeds during live execution must succeed with the same result during replay. A transaction that reads unpersisted configuration, current time, or external mutable state can pass live and fail after restart, preventing the sequencer from recovering.

## Runtime type requirements

The `Application` trait requires `Send`. The `sequencer::run_main` entry point adds these bounds:

```rust
Application + Clone + Sync + 'static
```

`Clone` must produce an independent instance with equivalent logical state. A shallow clone of a mutable database handle or foreign pointer may violate that requirement. Applications that wrap non-Rust state must provide safe synchronization and ownership across clones.

The genesis constructor is intentionally outside the trait. The application-specific binary passes it to `run_main`, and the closure is invoked only by `setup`. Normal `run` startup restores state through `from_dump`.

## Verification checklist

Before deploying an application integration, test that:

- validation produces no state changes;
- rejected operations leave nonces, balances, progress, and outputs unchanged;
- valid operations and direct inputs update both progress values correctly;
- application payloads at the declared size limit are accepted and larger payloads are rejected at ingress;
- dumps restore all logical state and canonical bytes exactly;
- a cloned application has equivalent state without unsafe shared mutation;
- replaying persisted inputs reproduces live state and outputs;
- the canonical scheduler and off-chain prediction produce byte-identical state;
- the host build and machine build use compatible encodings and arithmetic.

The CMA integration demonstrates these checks in `cma-app-core/tests/application.rs` and `cma-canonical-app/tests/duality.rs`.

## Next steps

- Follow the full build sequence in [Integrating the sequencer with a Cartesi application](./integration.md).
- Review recovery state in [Snapshots and checkpoints](../recovery/snapshots.md).
- Study ordering agreement in [Deterministic execution order](../concepts/execution-order.md).
