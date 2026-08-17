---
title: "Formal verification"
sidebar_label: "Formal verification"
description: "What the bounded TLA+ model proves about preemptive recovery, its configured state space, and the behavior outside its scope."
---

The sequencer repository contains a TLA+ specification of the slot-level preemptive recovery design. TLC explores every reachable state within the configured bounds and checks that declared safety invariants remain true.

This provides stronger evidence than a set of hand-selected examples for the behavior represented by the model. It does not prove the complete sequencer implementation correct.

## Why model the recovery protocol

Recovery depends on interleavings between:

- local batch creation and submission;
- wallet-nonce assignment;
- base-layer inclusion or replacement by a flush transaction;
- movement from included to safe;
- scheduler acceptance or rejection;
- suffix invalidation and replacement branching.

Many failures require an unusual order, such as an abandoned transaction winning a nonce slot after recovery has started. A model checker systematically explores those orders within a finite configuration and returns a concrete trace if one reaches an invalid state.

## Model state

The specification represents:

- a valid batch spine with `Gold`, `Silver`, `Bronze`, `Pending`, and open `Tip` states;
- invalidated branches;
- the current safe block;
- the submitter's next wallet nonce;
- the next wallet-nonce slot processed by the base layer;
- included base-layer entries;
- the scheduler cursor and next expected batch nonce;
- submitted batches detached from the valid spine by recovery.

A genesis sentinel provides an initial accepted ancestor in the model. The implementation handles the first-batch edge structurally and does not submit a sentinel batch.

## Modeled transitions

TLC explores combinations of these actions:

| Action             | Meaning                                                    |
| ------------------ | ---------------------------------------------------------- |
| `AdvanceTip`       | Close the open batch and append a new tip                  |
| `SubmitBatch`      | Assign wallet nonces to every unsubmitted pending batch    |
| `L1IncludeSpine`   | Let a valid submitted batch win its wallet-nonce slot      |
| `L1SkipSpine`      | Let a flush no-op win and displace a valid submitted batch |
| `L1IncludeDead`    | Let a previously invalidated batch win its unresolved slot |
| `L1SkipDead`       | Let a flush no-op displace an invalidated batch            |
| `AdvanceSafeBlock` | Move included batches into the safe view                   |
| `SchedulerStep`    | Process a safe entry and accept it or reject it            |
| `SchedulerSkip`    | Advance over a wallet-nonce slot consumed by a no-op       |
| `Resolve`          | Invalidate a stale suffix and create a replacement tip     |

At a contested wallet-nonce slot, the model allows either the batch or the flush transaction to win. This captures the adversarial outcome recovery must tolerate.

![The bounded recovery model moves from an open batch to a closed and submitted batch, lets either the batch or a flush transaction win the base-layer nonce slot, advances an included batch to the safe scheduler view, and either accepts it or resolves an invalid suffix by creating a replacement branch.](../images/recovery-model-transitions.jpg)

## Checked safety invariants

The configured invariant `Inv` combines the following properties:

| Invariant               | Property checked                                                               |
| ----------------------- | ------------------------------------------------------------------------------ |
| `TypeOK`                | The spine remains non-empty and the model's counters remain natural numbers    |
| `BatchNoncesContiguous` | Non-tip batches on the valid spine carry contiguous nonces                     |
| `InvalidOnlyOnGold`     | Invalid branches attach only to accepted `Gold` ancestors                      |
| `ZombieSafety`          | The scheduler's expected nonce equals the length of the accepted `Gold` prefix |
| `L1WNonceUnique`        | No two included base-layer entries occupy the same wallet nonce                |
| `L1BeforeCursor`        | Every included entry is below the next unprocessed base-layer wallet slot      |
| `SchedulerBehindL1`     | The scheduler cursor never advances beyond base-layer slot processing          |
| `DeadNotYetIncluded`    | Detached submitted batches retain only unresolved wallet-nonce slots           |

`ZombieSafety` is the central recovery property. It states that late, displaced, or invalidated submissions never make the scheduler accept more or fewer batches than the valid `Gold` prefix represents.

## Safety is not liveness

The model checks invariants in every reachable state. These are safety claims: specified bad states are not reached.

It does not establish that:

- the base layer eventually includes a transaction;
- the safe head eventually advances;
- a flush eventually completes;
- recovery always terminates;
- the sequencer resumes serving users within a time bound.

Those are liveness and operational claims. They depend on the base layer, provider availability, supervisor behavior, configuration, and implementation tests.

## Configured bounds

The committed TLC configuration uses:

| Constant          | Value |
| ----------------- | ----: |
| `MaxBatchIndex`   |     5 |
| `MaxSafeBlock`    |     5 |
| `MAX_WAIT_BLOCKS` |     2 |
| `MaxWalletNonce`  |     8 |

The implementation's staleness constant is `1200`, while the model uses `2`. This reduction preserves the transition from fresh to stale but does not reproduce production timing or scale.

Wallet nonces need a separate bound because repeated displacement and resubmission can keep generating new values. Increasing any bound can expand the state space sharply.

The recovery design notes record a completed exploration of approximately 157 million states with no invariant violations for the committed model and configuration. That result applies only to the specification version and bounds that produced it.

## What the model does not cover

The TLA+ model intentionally excludes major parts of the deployed system:

- the danger threshold and preemptive margin;
- wall-clock estimation during an RPC outage;
- the complete runtime sequence of stop, restart, flush, wait, synchronize, and resume;
- process crashes and SQLite or filesystem transaction boundaries;
- the implementation's danger-threshold invalidation of an open tip;
- the implementation's direct cascade of a pending batch displaced by a flush;
- direct-input queuing, censorship backstop, frames, transaction fees, and application execution;
- content-identity divergence detection;
- snapshots, checkpoint recovery, feeds, and HTTP behavior;
- signatures, chain identity, RPC completeness checks, and cryptographic assumptions.

Two differences deserve particular attention:

1. The model resolves an aging open tip at `MAX_WAIT_BLOCKS`; the implementation can replace it earlier at the configured danger threshold.
2. The model does not directly represent the implementation path that cascades a pending frontier batch after a flush no-op displaced it.

The safety of those implementation paths is supported by separate reasoning and tests. TLC has not explored them as equivalent actions.

## Relationship between model and code

The specification is maintained manually. There is no refinement proof, trace conformance check, verified compiler, or generated implementation connecting it to the Rust code.

A successful TLC run means:

- the model satisfies its declared invariants within the selected bounds;
- TLC found no represented execution that violates those properties.

It does not mean:

- the Rust implementation exactly matches every modeled transition;
- the model contains every relevant failure;
- larger bounds cannot reveal a counterexample;
- the surrounding application and infrastructure are correct.

Treat model checking as one layer of evidence alongside implementation review, unit tests, end-to-end recovery scenarios, and production monitoring.

## Run the model checker

The specification, configuration, and task file are located at:

```text
sequencer/docs/recovery/
  preemptive.tla
  preemptive.cfg
  justfile
```

With TLC installed and available as `tlc`, run:

```bash
cd sequencer/docs/recovery
just check-preemptive
```

The task executes:

```bash
tlc -workers auto -deadlock preemptive.tla
```

You can point the task at another TLC executable with the `TLC` environment variable. Start with the committed bounds. Record the specification revision, configuration, TLC version, worker count, state count, runtime, and result for every verification run.

## Interpreting a counterexample

When TLC reports an invariant violation:

1. identify the first transition after which the property becomes false;
2. determine whether the trace represents permitted production behavior;
3. check whether the specification, implementation, or invariant is wrong;
4. convert the trace into a focused implementation test when applicable;
5. rerun the original and corrected models with the same bounds;
6. increase relevant bounds to look for a larger related counterexample.

A counterexample can reveal an incorrect design or an inaccurate model. It should not be dismissed solely because production code is structured differently.

## Next steps

- Review the modeled recovery path in [Preemptive recovery](../recovery/preemptive.md).
- Compare the checked properties with [Cross-module invariants](./invariants.md).
- Review unmodeled ordering behavior in [Scheduler semantics](./scheduler-semantics.md).
