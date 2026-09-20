---
title: "Preemptive recovery"
sidebar_label: "Preemptive recovery"
description: "How the sequencer detects batches approaching the staleness limit, selects a safe startup action, and resumes from the accepted frontier."
---

Preemptive recovery protects the sequencer from batches that may reach the base layer too late. It starts before the scheduler's staleness limit, while the sequencer can still determine which work remains usable.

This is the routine recovery path for an intact local database. It does not rebuild a lost or untrusted deployment.

## Why recovery begins before the deadline

The sequencer acts before an unsettled batch reaches the protocol's staleness deadline. This preserves time to stop cleanly, resolve uncertain submissions, and construct a replacement from the accepted frontier.

The configured threshold is:

```text
danger threshold = maximum wait blocks - preemptive margin
```

[Staleness and the danger zone](../concepts/staleness.md) defines the deadline and batch-number cascade. [Configure protocol timing](../operations/setup-and-running.md#configure-protocol-timing) lists the defaults and validation rules.

## Runtime detection and controlled restart

A dedicated danger detector checks the local database every two seconds. It reads the most recent safe-head observation and the valid batch path. It does not modify the database or contact the base layer.

The detector checks for:

- accepted base-layer content that differs from the matching local batch;
- a base-layer view that has become too old to trust;
- a closed batch that has crossed the danger threshold;
- an open batch that has crossed the danger threshold;
- a batch whose estimated age has crossed the threshold while the observed safe head is stalled.

When any condition is detected, the runtime stops all workers and exits. The exit code tells the supervisor whether to restart for recovery, retry after a transient refusal, or stop for operator action.

Recovery does not mutate the batch tree inside the running process. A fresh process performs the decision before the API, input lane, and batch submitter start, which ensures that no other writer is active during recovery.

## Startup recovery decision

Startup first tries to synchronize the base-layer safe head. It then runs the same danger check against the updated or previously persisted view.

| Startup result             | Condition                                                                                                  | Action                                                                                                       |
| -------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Proceed**                | No danger is present                                                                                       | Start normally without recovery writes                                                                       |
| **Recover the open batch** | Only the open batch is in danger                                                                           | Invalidate it and open a fresh batch without flushing                                                        |
| **Flush and cascade**      | A closed batch beyond the accepted frontier is in danger                                                   | Flush unresolved wallet nonces, synchronize again, invalidate the provisional suffix, and open a fresh batch |
| **Refuse**                 | The base-layer view is stale, danger exists only in the wall-clock estimate, or canonical content diverged | Exit without modifying the batch tree                                                                        |

![At startup, the sequencer synchronizes the safe head and checks for danger before workers start. It can proceed normally, replace an aging open batch, flush unresolved nonces and cascade a closed suffix, or refuse recovery when the view is unsafe or divergent.](../images/preemptive-recovery.jpg)

The refusal cases have different operational outcomes:

- a stale view or estimated-only danger exits with code `20`; retry after the provider can supply a fresh safe view;
- canonical divergence exits with code `30`; stop automatic restarts and rebuild from a checkpoint.

## Recovering an aging open batch

An open batch has not been submitted and has no submitter wallet nonce. There is no hidden base-layer transaction whose outcome must be resolved.

Startup therefore performs one database transaction that:

1. confirms that the open batch still crosses the danger threshold;
2. invalidates that batch;
3. clears any pending snapshot references in the invalidated range, although an open batch normally has none;
4. opens a new batch from the last valid parent.

The replacement reuses the batch nonce expected by the scheduler. No mempool flush is required.

## Recovering closed batches

A closed batch may already exist in one or more transaction pools, even when the local provider no longer reports it. Recovery must resolve those transactions before deciding which branch to keep.

### 1. Flush unresolved wallet nonces

Recovery invokes the shared wallet-flush mechanism and waits for every covered submitter nonce slot to have an outcome at the base-layer safe level. [Flush unresolved wallet nonces](../operations/orchestration.md#flush-unresolved-wallet-nonces) defines the watermark, replacement transactions, and completion conditions.

### 2. Synchronize the accepted frontier

The flush returns the safe block where nonce resolution was observed. The input reader synchronizes again, and recovery refuses to continue if the resulting view is behind that block.

This second synchronization determines which batches the scheduler accepted after all relevant transaction outcomes were settled.

### 3. Invalidate the provisional suffix

Everything after the last accepted batch is invalidated in one database transaction. This includes batches that became stale, batches rejected after a stale predecessor, and batches displaced by flush transactions.

Pending snapshots associated with the invalidated branch are cleared so startup cannot load application state from abandoned work.

### 4. Open the replacement batch

The sequencer opens a new batch from the accepted frontier. It uses the next batch nonce expected by the scheduler and includes any safe direct inputs that have not yet been drained.

The machine sees an ordinary next batch. The abandoned local branch remains recorded as invalid history but cannot affect the valid path.

## User-visible effects

Transactions contained only in invalidated batches do not take effect. Any soft confirmations issued for them must be treated as revoked.

Direct inputs are not lost. They remain part of the base-layer input stream and are drained into the replacement path if they were not already included in accepted state.

Clients should reconcile their local state with the sequenced feed after reconnecting. See [Limits of a soft confirmation](../concepts/soft-confirmations.md#limits-of-a-soft-confirmation) and [Reading the sequenced feed](../usage/reading-the-feed.md).

## Distinguishing recovery from failure

Recoverable danger, a temporarily unusable base-layer view, and canonical divergence produce different exit codes and restart policies. [Process supervision and recovery operations](../operations/orchestration.md#exit-codes-and-required-actions) defines the required supervisor behavior.

## Recovery boundaries

Preemptive recovery depends on a trustworthy local database. It repairs the provisional end of the batch tree, but it cannot recover from:

- a lost or irreparably corrupted data directory;
- canonical divergence;
- a compromised checkpoint or application implementation;
- an incorrect deployment identity.

Use [Cockroach recovery](./cockroach.md) when the local record cannot be used.

## Verification coverage

The recovery model is checked with TLA+ for batch acceptance, staleness, nonce resolution, suffix invalidation, and replacement branching. The implementation also includes unit and end-to-end tests for open-batch recovery, closed-batch recovery, provider outages, delayed transactions, nonce-zero recovery, snapshot cleanup, and repeated recovery rounds.

See [Formal verification](../advanced/formal-verification.md) for the scope and limitations of those guarantees.

## Next steps

- Review operator responses in [Failure modes](./failure-modes.md).
- Prepare the rebuild path in [Cockroach recovery](./cockroach.md).
- Configure timing values in [Configure, set up, and run the sequencer](../operations/setup-and-running.md#configure-protocol-timing).
