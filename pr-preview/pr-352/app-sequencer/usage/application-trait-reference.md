> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Application trait reference"
sidebar_label: "Application trait reference"
description: "Reference for implementing the sequencer's application interface, deterministic state, progress, and recovery methods."
---

An application integrates with the sequencer by implementing [`sequencer_core::application::Application`](https://github.com/cartesi/sequencer/blob/5e3d621e8f04fe93840944421e9625b4a4cc7f34/sequencer-core/src/application/mod.rs#L154). The trait is defined in the `sequencer-core` crate and imported with:

```rust
use sequencer_core::application::Application;
```

Add the crate to the shared application library using the same sequencer release or revision as the rest of the workspace:

```toml
[dependencies]
sequencer-core = { git = "https://github.com/cartesi/sequencer", rev = "5e3d621e8f04fe93840944421e9625b4a4cc7f34" }
```

The off-chain sequencer uses this implementation to predict application state, and the canonical scheduler uses it inside the Cartesi machine to compute the authoritative result.

Both execution paths must produce the same state and outputs for the same ordered inputs. The interface therefore defines more than application methods. It also defines progress tracking, recovery dumps, canonical state bytes, and failure behavior.

This page is an implementation reference for the application code shared by both execution paths. Use it while implementing or reviewing the trait methods. For the complete setup and build sequence, follow [Application integration](./integration.md).

## Complete interface overview

The required and optional parts of `Application` are grouped below.

| Area                     | Item                       | Required    | Purpose                                                                                                                |
| ------------------------ | -------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| Payload bound            | `MAX_METHOD_PAYLOAD_BYTES` | Yes         | Limits the encoded application payload accepted in `UserOp.data` and supplies the sequencer's batch-sizing calculation |
| Validation               | `validate_user_op`         | Yes         | Checks application-level acceptance rules without changing state                                                       |
| User operation execution | `apply_valid_user_op`      | Yes         | Applies an operation that passed the protocol and application checks                                                   |
| Direct input execution   | `apply_direct_input`       | Yes         | Applies an input recorded directly on the base layer                                                                   |
| Progress                 | `progress`                 | Yes         | Returns the safe-block clock and executed-input count embedded in application state                                    |
| Persistence              | `create_dump`              | Yes         | Writes a complete and durable recovery dump                                                                            |
| Persistence              | `from_dump`                | Yes         | Reconstructs equivalent application state from a dump                                                                  |
| Persistence              | `delete_dump`              | Yes         | Removes a dump that the sequencer no longer needs                                                                      |
| Persistence              | `state_file_in_dump`       | Yes         | Locates the canonical state file inside a dump                                                                         |
| State comparison         | `CanonicalState::canonical_snapshot_bytes` | Conditional | Returns deterministic state bytes for machine inspection and watchdog comparison                         |

`canonical_snapshot_bytes` belongs to the separate `CanonicalState` trait. Implement it when the application uses the shared Rust canonical scheduler and serves state for inspection or watchdog comparison.

## User operation validation and execution

Every user operation must pass through `validate_and_execute_user_op`. This shared function is used by the off-chain inclusion path and the canonical scheduler, giving both paths the same execution sequence:

```text
1. Check user_op.max_fee against the current frame fee
2. Call app.validate_user_op(...)
3. Build a ValidUserOp with the committed frame fee
4. Call execute_valid_user_op(...), which invokes app.apply_valid_user_op(...)
```

Application code should call the shared function in tests and custom live-execution paths. Calling `apply_valid_user_op` directly bypasses the protocol fee guard and progress verification, which can create behavior that the canonical scheduler will not reproduce. Trusted replay uses the shared `execute_valid_user_op` helper because the operation has already passed validation.

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

### Apply an accepted operation deterministically

`apply_valid_user_op` receives a `ValidUserOp` containing the sender, the committed frame fee, and the application payload. It also receives the frame's `safe_block`.

The method must:

- apply the application transition exactly once;
- charge or account for the committed fee according to the application design;
- update application replay protection, such as the sender nonce;
- increment `executed_input_count`;
- set the safe-block clock to `max(previous_clock, safe_block)`;
- return deterministic notices and vouchers as `AppOutput` values.

The valid operation no longer contains the submitted nonce or offered `max_fee`. Any checks that depend on those fields belong in `validate_user_op`. Execution uses the frame fee selected by the protocol.

An operation may be included while producing no outputs. The public reference wallet uses this behavior when a decoded action cannot be completed after its protocol-level acceptance: it charges the data-availability fee, consumes the nonce, and returns an empty output list. Applications must define this behavior carefully because an included no-op differs from a validation rejection.

Notices and vouchers computed off-chain are predictions. The corresponding outputs become authoritative when the canonical machine executes the recorded batch.

## Direct input handling

`apply_direct_input` has no default implementation. Every application must define how inputs that did not enter through `POST /tx` affect its state.

The method receives:

- the base-layer sender;
- the base-layer inclusion block;
- the raw payload.

The canonical scheduler treats every recorded input from an address other than the configured batch submitter as a direct input. The application must then authenticate and decode the input according to its own rules. For example, the public reference wallet credits a deposit only when the sender is its configured ERC-20 portal and the payload names its supported token.

For every executed direct input, the application must increment its executed-input count and update its safe-block clock with `input.block_number`. An ignored or unsupported direct input still counts as executed once the application has processed it.

The actions supported through this method determine what users can do while the sequencer is unavailable. See [Direct inputs vs sequenced transactions](../concepts/direct-vs-sequenced.md).

## Progress tracking

### Safe-block clock

`progress().last_executed_safe_block()` returns the greatest block covered by any input executed by the current application state:

```text
user operation: max(clock, frame.safe_block)
direct input:   max(clock, input.block_number)
```

It returns `0` before any input executes. The value is part of logical application state and must survive cloning and dump restoration.

Recovery uses this clock to determine which base-layer inputs are already reflected in a checkpoint. Reporting a value that is too high can skip required inputs. Reporting one that is too low can execute an input again.

### Executed input count

`progress().executed_input_count()` is the canonical history boundary. It counts user operations and direct inputs that the application executed and identifies the next history entry the application is ready to consume.

Persist the count in every dump and restore it exactly. Do not derive it from balances, nonces, or database row numbers because those values can represent different histories.

## Recovery dump contract

The sequencer creates application dumps at batch boundaries, restores them during startup and recovery, and deletes superseded dumps. An application can represent its dump as one file or as a directory containing several files.

### Creating a dump

`create_dump(prefix)` receives a path that does not yet exist. The implementation creates a file or directory at that path and writes every value that can influence future execution, including:

- application databases or state bytes;
- sender nonces and other replay protection;
- application configuration that changes execution;
- `last_executed_safe_block`;
- `executed_input_count`;
- metadata required to decode or reconstruct the main state.

When the method returns `Ok`, the dump must survive an immediate kernel crash. On POSIX systems, this requires synchronizing every dump file and the directory entries that reference the dump, including the parent of `prefix`, before returning. The sequencer writes the SQLite row that references the dump only after `create_dump` succeeds.

### Restoring and deleting dumps

`from_dump(prefix)` must reconstruct state equivalent to the state that created the dump. Equivalence includes future behavior, progress values, and canonical state bytes, not only visible balances.

`delete_dump(prefix)` removes a previously created dump when the sequencer's garbage collection marks it as superseded. The implementation should limit deletion to the supplied dump path.

### Identifying canonical state

`state_file_in_dump(prefix)` is a pure path function. It must return one file inside the dump, or `prefix` itself when the dump is a single file, without loading application state. The bytes in that file must match the canonical machine's inspected state for the same logical history.

`CanonicalState::canonical_snapshot_bytes()` returns the in-memory form of that same canonical representation. Keeping both paths byte-identical allows the watchdog to compare predicted and canonical state without application-specific conversion. The public wallet example stores its complete recovery state in the dump while exposing deterministic wallet state bytes for canonical comparison.

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

Applications with target-specific storage must preserve the same logical and canonical byte representation on the host and in the Cartesi machine. Test the adapters with the same input history and compare their canonical bytes.

## Error and replay behavior

User-caused refusal belongs in deterministic validation or in a clearly defined included outcome. `AppError::Internal` and I/O errors represent failures from which the sequencer cannot safely continue.

An internal execution error stops the off-chain inclusion lane. Reserve it for invariant violations and infrastructure failures. Do not use it as a general response to malformed application data or insufficient business-level balance.

Any input that succeeds during live execution must succeed with the same result during replay. A transaction that reads unpersisted configuration, current time, or external mutable state can pass live and fail after restart, preventing the sequencer from recovering.

## Runtime type requirements

The `Application` trait requires `Send` and `Sized`. The `sequencer::run_main` entry point adds the `'static` lifetime bound:

```rust
Application + 'static
```

The genesis constructor passed to `run_main` must implement `FnOnce() -> A`, `Send`, and `'static`. Application instances are exclusively owned and reconstructed from dumps when another independent instance is needed.

The genesis constructor is intentionally outside the trait. The application-specific binary passes it to `run_main`, and the closure is invoked only by `setup`. Normal `run` startup restores state through `from_dump`.

## Verification checklist

Before deploying an application integration, test that:

- validation produces no state changes;
- rejected operations leave nonces, balances, progress, and outputs unchanged;
- valid operations and direct inputs update both progress values correctly;
- application payloads at the declared size limit are accepted and larger payloads are rejected at ingress;
- dumps restore all logical state and canonical bytes exactly;
- independently loading the same dump creates equivalent state without shared mutation;
- replaying persisted inputs reproduces live state and outputs;
- the canonical scheduler and off-chain prediction produce byte-identical state;
- the host build and machine build use compatible encodings and arithmetic.

The public [`app-core` tests](https://github.com/cartesi/sequencer/blob/5e3d621e8f04fe93840944421e9625b4a4cc7f34/examples/app-core/src/application/wallet.rs) cover application validation, execution, progress, and dump behavior. The [`scheduler tests`](https://github.com/cartesi/sequencer/blob/5e3d621e8f04fe93840944421e9625b4a4cc7f34/sequencer-core/src/scheduler/mod.rs) exercise agreement between the canonical scheduler and protocol acceptance rules.

## Next steps

- Follow the full build sequence in [Application integration](./integration.md).
- Review recovery state in [Snapshots and checkpoints](../recovery/snapshots.md).
- Study ordering agreement in [Deterministic execution order](../concepts/execution-order.md).
