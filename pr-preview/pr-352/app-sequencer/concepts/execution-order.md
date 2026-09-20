> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Deterministic execution order"
sidebar_label: "Deterministic execution order"
description: "How the sequencer and the machine reach the same order, and what happens when they do not."
---

The sequencer's value rests on one claim: the canonical application will reproduce the transaction order predicted by the sequencer. This page explains how the two execution paths maintain that agreement and what can cause them to diverge.

## How the ordering logic stays consistent

The scheduler inside the Cartesi machine produces the canonical execution order. To provide fast confirmations, the live sequencer predicts that order before a batch reaches the base layer.

Three parts of the implementation contribute to this process:

| Component                  | Purpose                                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Scheduler**              | Runs inside the Cartesi machine and determines the canonical execution order. Native recovery uses the same scheduler implementation. |
| **Batch acceptance check** | Predicts whether the scheduler will accept an observed batch into the canonical batch frontier.                                       |
| **Inclusion lane**         | Processes direct inputs and user transactions locally in the order the scheduler is expected to reproduce.                            |

![Inside the Cartesi machine, the scheduler classifies InputBox inputs, accepts valid batches, drains direct inputs, and executes frame transactions before the application computes canonical state. Before settlement, the host inclusion lane predicts execution order and transaction outcomes, while the batch acceptance check predicts the accepted frontier.](../images/execution-agreement.jpg)

The `InputBox` is a base-layer contract outside the Cartesi machine. The scheduler reads the ordered inputs recorded by that contract and executes them inside the machine. The scheduler is the authority. The other two components predict its decisions so the sequencer can respond without waiting for base-layer settlement.

The components share protocol types and execution helpers, but not every part is one shared implementation. The canonical machine and native recovery drive the same `Scheduler<A>` source. The inclusion lane and batch acceptance check mirror the parts they need for live prediction and reconciliation.

The batch acceptance check performs a narrower task than the scheduler and deliberately omits structural checks that the scheduler applies to complete batch contents. Tests and code review keep these paths aligned, but the implementation cannot guarantee agreement merely because the code belongs to one repository.

## What identical results mean

The native host and RISC-V machine do not execute identical machine instructions or maintain identical process memory. Agreement means that, for the same ordered inputs and starting state, both paths produce:

- the same accepted and rejected application operations;
- the same application state transitions;
- the same notices and vouchers;
- the same progress counters and safe-block clock; and
- byte-identical canonical state when that state is serialized for comparison.

Several shared boundaries reduce the amount of behavior that has to be reproduced independently:

- The same application logic implements `Application` for the host and machine builds.
- Both paths use `validate_and_execute_user_op` for the protocol fee check, application validation, and accepted-operation execution.
- `Batch`, `Frame`, `UserOp`, fee conversion, and scheduler types come from `sequencer-core`.
- The canonical machine and native recovery use the same scheduler implementation.
- Agreement tests replay the same inputs through the relevant paths and compare outcomes and canonical state bytes.
- The watchdog can reproduce application state through the Cartesi machine and compare it with the sequencer's promoted state.

## Rules that determine execution order

The order is decided by three things, applied in the same way on both sides.

**The base layer decides arrival.** Everything reaches the application through the InputBox contract, and the order it records is not up for debate. Neither side chooses it.

**The sender decides the kind.** Anything sent by the sequencer's address is a batch. Everything else is a direct input. Classification is by who sent it, never by anything in the payload, so it cannot be spoofed.

**Each frame combines the two input streams.** Before running a frame's sequenced transactions, the scheduler runs every pending direct input recorded at or before the frame's safe block. It then runs the frame's transactions in their listed order. The sequencer applies the same sequence locally.

The result is that neither path has to accept an ordering conclusion produced by the other. Both compute an order from the same recorded inputs and protocol rules.

## Why native and RISC-V execution are both used

The host sequencer runs as a native service so it can validate requests, update its local state, and return soft confirmations without waiting for the Cartesi machine or base-layer settlement. Recovery also runs the shared scheduler natively when it must rebuild state from a checkpoint and base-layer history.

The Cartesi machine runs the canonical application as RISC-V code so its execution is reproducible within the Rollups system. This is the authoritative path from recorded inputs to application state and outputs.

The two builds may use different I/O and storage adapters. Those adapters must preserve the same application rules, progress values, and canonical state encoding. Host-specific behavior must not influence an application transition.

## Why the sequencer can answer early

The sequencer applies these rules to its own view before it answers. When it accepts a transaction, it has already drained the direct inputs that will run ahead of it, so the state it judges the transaction against is the state the application will have.

The immediate answer predicts the machine's decision using the sequencer's current view of the inputs. Agreement depends on the shared execution boundaries and the mirrored ordering rules remaining aligned.

## When a transaction is skipped

Being in an accepted batch does not guarantee that an individual transaction takes effect. A transaction that fails canonical validation is skipped without changing state or preventing later transactions in the batch from being considered. [Scheduler semantics](../advanced/scheduler-semantics.md#transaction-level-outcomes) defines the exact outcomes.

## What can cause the paths to diverge

Divergence can result from:

- an ordering or acceptance rule changed in the scheduler but not in a prediction path;
- nondeterministic application behavior based on time, randomness, floating point, thread scheduling, or unordered iteration;
- host and RISC-V adapters decoding, storing, or serializing the same state differently;
- different application constants or deployment configuration in the two builds;
- incomplete dump restoration or replay that starts from the wrong state; or
- base-layer batch content that differs from the sealed batch stored by the sequencer.

These failures do not all appear at the same boundary. A matching batch proves that the recorded batch bytes agree with local history. It does not, by itself, prove that the host and machine computed identical application state.

## How disagreement is detected

Sameness by construction is a strong argument, but the system does not rely on the argument alone.

The sequencer compares accepted base-layer batch content with the local sealed batch stored for the same position. If the batch is missing or the bytes differ, it records canonical divergence, freezes the accepted frontier, and stops because later provisional results may depend on the wrong history.

This content check occurs only after the relevant base-layer observation reaches the configured safe view. Separately, the watchdog compares promoted sequencer state with state independently reproduced by the Cartesi machine. [Divergence detection and response](../advanced/divergence.md) explains the content comparison and operator response. [Monitoring and watchdog](../operations/monitoring.md) explains the state comparison.

## Related concepts

- For how the packaging works, read [Batches, frames, and the safe block](./batches-frames-safe-block.md).
- For the guarantees and limitations of the early answer, read [Soft confirmations](./soft-confirmations.md).
