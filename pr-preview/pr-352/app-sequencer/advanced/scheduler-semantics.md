> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Scheduler semantics"
sidebar_label: "Scheduler semantics"
description: "The scheduler's deterministic input-ordering algorithm, batch acceptance gates, direct-input backstop, and nonce effects."
---

The scheduler defines the canonical order in which direct inputs and sequenced transactions affect application state. The Cartesi machine runs this algorithm, while the sequencer predicts the same outcome before base-layer settlement.

Agreement between those paths is essential. A difference can make a soft-confirmed result disagree with canonical execution. See [Divergence and the content-identity check](./divergence.md).

## Input stream and sender classification

The scheduler processes `InputBox` inputs in base-layer order. Each input provides:

- an authenticated sender;
- an inclusion block;
- an opaque payload.

Classification uses only the sender address:

| Sender                             | Classification | Initial action                                  |
| ---------------------------------- | -------------- | ----------------------------------------------- |
| Configured batch-submitter address | Batch          | Decode and evaluate the batch acceptance gates  |
| Any other address                  | Direct input   | Add the input to the waiting direct-input queue |

The payload does not contain a trusted tag that can override this classification. Application-specific decoding occurs after the scheduler has selected the path.

## Processing algorithm

For each `InputBox` input, in order, the scheduler performs:

```text
1. Execute every overdue direct input using this input's inclusion block.
2. Classify the new input by sender.
3. If it is direct, enqueue it.
4. If it is a batch, evaluate the batch acceptance gates.
```

The overdue-input check runs before classification. A malformed, stale, or wrong-nonce batch still advances the block reference used by the censorship backstop.

## Direct-input censorship backstop

A waiting direct input becomes overdue when:

```text
current input block - direct input block >= 1200
```

The scheduler executes all overdue direct inputs in queue order before processing the new input. Each executed input is removed from the queue, preventing a second execution.

The value `1200` is the shared protocol constant `MAX_WAIT_BLOCKS`. It is also used by batch staleness, linking the maximum delay for direct inputs to the maximum age of a sequenced batch.

The backstop is event-driven. Time passing or blocks being produced does not invoke the scheduler by itself. If an application receives no new inputs, an overdue direct input remains queued until another input arrives. Any sender can trigger evaluation by adding an application input, so progress does not depend on the sequencer returning.

See [Direct inputs vs sequenced transactions](../concepts/direct-vs-sequenced.md).

## Batch acceptance gates

A payload from the batch-submitter address passes through these gates in order. The first failed gate determines the result.

| Order | Gate                                  | Result when the gate fails | Batch nonce consumed? |
| ----- | ------------------------------------- | -------------------------- | --------------------- |
| 1     | Decode the payload as a batch         | Reject as undecodable      | No                    |
| 2     | Match the next expected batch nonce   | Reject with wrong nonce    | No                    |
| 3     | Check whether the batch has no frames | Accept as an empty no-op   | **Yes**               |
| 4     | Validate frame structure              | Reject as malformed        | No                    |
| 5     | Check batch staleness                 | Skip as stale              | No                    |
| 6     | Execute every frame                   | Accept and execute         | **Yes**               |

Only an accepted batch advances the next expected batch nonce. An empty batch is accepted because it has no frame state to validate or age to measure.

## Frame structure requirements

A non-empty batch is structurally valid only when:

1. every frame's safe block is no greater than the batch's inclusion block;
2. frame safe blocks are non-decreasing within the batch.

The first rule prevents a frame from claiming knowledge of base-layer activity that had not occurred when the batch was included. The second ensures that the sequencer's claimed base-layer view moves only forward.

These requirements also justify testing staleness against the first frame. Because safe blocks are non-decreasing, the first frame has the oldest safe block and therefore the greatest age.

## Batch staleness

For a non-empty batch, the scheduler evaluates:

```text
batch inclusion block - first frame safe block >= 1200
```

When the expression is true, the batch is skipped as stale. No application state changes, and the expected batch nonce does not advance.

The unchanged nonce makes later numbered batches ineligible until a valid replacement uses the expected value. [Staleness and the danger zone](../concepts/staleness.md) gives the complete numbering example, and [Preemptive recovery](../recovery/preemptive.md) explains repair.

## Frame execution order

For every frame in an accepted batch, the scheduler performs two steps:

1. **Drain covered direct inputs.** Execute queued direct inputs whose inclusion blocks are at or before the frame's safe block.
2. **Execute sequenced transactions.** Evaluate the frame's transactions on the resulting application state.

This order gives the safe block its meaning. A frame claiming safe block 500 promises that every direct input through block 500 is reflected before that frame's transactions run.

The sequencer follows the same drain-first order locally when accepting a transaction. This allows it to evaluate the transaction against the state the canonical scheduler is expected to reproduce.

## Transaction-level outcomes

Each transaction in an accepted frame enters one validation and execution path. The transaction is skipped without changing application state when:

- its signature cannot identify a sender;
- its maximum fee is below the frame's fee price;
- the application rejects it.

A skipped transaction does not reject the frame or batch. Execution continues with the next transaction, and the accepted batch still consumes its nonce.

These are defined responses to caller-controlled input, not invariant violations. The scheduler and sequencer must produce the same result for each case.

## Where the semantics are implemented

The acceptance behavior appears in three forms:

| Component                      | Responsibility                                                                      |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| Canonical `Scheduler<A>` fold  | Executes the complete algorithm in the Cartesi machine and during checkpoint replay |
| Off-chain acceptance predicate | Determines which safe base-layer batches advance the accepted frontier              |
| Inclusion lane prediction      | Applies direct inputs and transactions locally before settlement                    |

The checkpoint recovery fold drives the canonical scheduler implementation directly, avoiding a parallel implementation of the algorithm.

The off-chain acceptance predicate has a narrower role. It checks sender, decoding, nonce, and staleness, but omits the two structural frame checks. The predicate processes the sequencer's own sealed submissions, which are assumed well formed under the codebase's self-trust model. A malformed self-submission is treated as a sequencer defect, not as normal hostile input.

Agreement across these components is maintained by shared code where possible, tests, and review. There is no complete mechanical proof that the live prediction and canonical fold are equivalent for every application.

## Worked ordering example

The following example combines two queued deposits with a two-frame batch. Frame 1 covers direct inputs through block 103, while frame 2 advances the safe block to 108.

![The base-layer stream contains deposit A at block 100, deposit B at block 106, and an accepted two-frame batch. The scheduler drains deposit A before frame 1, executes transactions X and Y, drains deposit B before frame 2, and then executes transaction Z.](../images/scheduler-ordering-example.jpg)

Deposit B remains queued during frame 1 because block 106 is above safe block 103. Frame 2 advances the claimed view to 108 and drains it before transaction Z.

## Next steps

- Learn how batches encode these rules in [Batches, frames, and the safe block](../concepts/batches-frames-safe-block.md).
- Review cross-module dependencies in [Invariants](./invariants.md).
- Understand disagreement handling in [Divergence and the content-identity check](./divergence.md).
