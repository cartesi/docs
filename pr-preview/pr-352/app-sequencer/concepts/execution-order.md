> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Deterministic execution order"
sidebar_label: "Deterministic execution order"
description: "How the sequencer and the machine reach the same order, and what happens when they do not."
---

The sequencer's value rests on one claim: the application runs transactions in the order reported by the sequencer. This page explains how the system maintains that agreement and what happens if it fails.

## How the ordering logic stays consistent

The Cartesi machine produces the final execution order. To provide fast confirmations, the live sequencer must predict that order before a batch reaches the base layer.

Three parts of the implementation contribute to this process:

| Component                  | Purpose                                                                                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scheduler**              | Runs inside the Cartesi machine and determines the final execution order. Recovery uses the same scheduler code to rebuild application state. |
| **Batch acceptance check** | Predicts whether the scheduler will accept a batch based on its sender, number, and timing.                                                   |
| **Inclusion lane**         | Builds the live local order by processing direct inputs and user transactions in the sequence the scheduler is expected to reproduce.         |

![Inside the Cartesi machine, the scheduler classifies InputBox inputs, accepts valid batches, drains direct inputs, and executes frame transactions before the application computes canonical state. Before settlement, the host inclusion lane predicts execution order and transaction outcomes, while the batch acceptance check predicts the accepted frontier.](../images/execution-agreement.jpg)

The scheduler is the authority. The other two components predict its decisions so the sequencer can respond without waiting for base-layer settlement.

These components share the same protocol definitions, but they are separate implementation paths. The batch acceptance check also performs a narrower task than the scheduler and therefore omits two structural checks that the scheduler applies.

Tests and code review are used to keep all three paths consistent. The implementation does not automatically guarantee that they will always agree.

## Rules that determine execution order

The order is decided by three things, applied in the same way on both sides.

**The base layer decides arrival.** Everything reaches the application through the InputBox contract, and the order it records is not up for debate. Neither side chooses it.

**The sender decides the kind.** Anything sent by the sequencer's address is a batch. Everything else is a direct input. Classification is by who sent it, never by anything in the payload, so it cannot be spoofed.

**Each frame decides the interleaving.** A frame's safe block means: run every direct input recorded up to this block, then run this frame's transactions in the order they appear. Both sides apply that literally.

The result is that neither side is trusting the other's conclusion. Both are computing the same function over the same input.

## Why the sequencer can answer early

The sequencer applies these rules to its own view before it answers. When it accepts a transaction, it has already drained the direct inputs that will run ahead of it, so the state it judges the transaction against is the state the application will have.

The immediate answer predicts the machine's decision using the sequencer's current view of the inputs. Agreement depends on the three implementations described above remaining aligned.

## When a transaction is skipped

Being in an accepted batch does not guarantee that an individual transaction takes effect. A transaction that fails canonical validation is skipped without changing state or preventing later transactions in the batch from being considered. [Scheduler semantics](../advanced/scheduler-semantics.md#transaction-level-outcomes) defines the exact outcomes.

## How the sequencer detects disagreement

Sameness by construction is a strong argument, but the system does not rely on the argument alone.

The sequencer compares accepted base-layer batch content with the local batch stored for the same position. If they differ, it freezes the accepted frontier and stops because later provisional results may depend on the wrong history.

Detection occurs only after the relevant base-layer observation is safe enough to trust. [Divergence detection and response](../advanced/divergence.md) explains the comparison, timing boundary, and operator response.

## Related concepts

- For how the packaging works, read [Batches, frames, and the safe block](./batches-frames-safe-block.md).
- For the guarantees and limitations of the early answer, read [Soft confirmations](./soft-confirmations.md).
