---
title: "Cross-module invariants"
sidebar_label: "Invariants"
description: "The properties that connect scheduler agreement, ordering, recovery, snapshots, wallet nonces, and checkpoint anchoring across the sequencer."
---

An invariant is a property that must hold in every legitimate execution, including restart, catch-up, and recovery.

This page focuses on cross-module invariants. These are the properties whose definition, enforcement, and consumers live in different parts of the system. They deserve explicit documentation because a change can look correct within one component while breaking an assumption elsewhere.

## Failure policy

The sequencer uses a fail-loud policy for impossible internal states:

1. **Reject the operation or stop the process.** Do not continue from a state that violates an internal contract.
2. **Do not invent a fallback result.** A neighboring component's output is not recomputed with a second algorithm to create an alternate path.
3. **Do not hide missing or contradictory state.** Required rows, snapshot references, nonces, and identities fail explicitly when absent or inconsistent.

Availability can be restored after a visible stop. A silently externalized inconsistency can become a signed batch, incorrect confirmation, or misleading feed event and may require a full checkpoint rebuild.

## Invalid input is not an invariant violation

Untrusted callers can legitimately produce malformed signatures, application rejections, low-fee transactions, and arbitrary direct-input payloads. These cases are reachable by design and therefore have deterministic handling rules.

A transaction-level rejection does not stop an accepted batch. The scheduler skips the affected transaction and continues. Treating caller-controlled invalid input as an impossible state would allow a public client to crash the sequencer.

The distinction is:

- **invalid external input** follows a defined rejection or skip path;
- **an impossible internal state** returns an error, violates a database constraint, or stops the process.

## Enforcement mechanisms

The invariants are maintained through several layers:

| Mechanism                       | Examples                                                                                       |
| ------------------------------- | ---------------------------------------------------------------------------------------------- |
| Shared implementation           | Checkpoint replay drives the canonical scheduler fold directly                                 |
| SQLite transactions             | Batch sealing and pending-snapshot insertion commit together                                   |
| SQLite constraints and triggers | Batch nonce continuity, write-once hashes, and anchor immutability                             |
| Write ordering                  | Snapshot data is synchronized before its database reference is committed                       |
| Runtime checks                  | Chain identity, safe-head monotonicity, and content identity                                   |
| Persisted failure markers       | Canonical divergence freezes frontier progress across restart                                  |
| Tests and model checking        | Multi-round recovery, nonce-zero recovery, snapshot crash cases, and bounded slot-level safety |

No single mechanism covers the whole system. Some of the most important agreement properties still rely on code review and tests.

## Scheduler and ordering invariants

### I1. Scheduler acceptance agrees across implementations

The canonical scheduler, accepted-frontier predicate, and inclusion lane must make compatible decisions about ordering and batch acceptance.

The checkpoint fold uses the canonical scheduler implementation directly. The accepted-frontier predicate is narrower and omits structural frame checks because it processes the sequencer's own sealed batches. The inclusion lane remains a live prediction whose agreement is maintained through shared types, tests, and review, not through a complete equivalence proof.

If this property fails, the sequencer can confirm state the canonical machine will not reproduce.

### I2. Drained direct inputs belong to the new frame

When the safe frontier advances, newly covered direct inputs are sequenced into the frame carrying the new safe block. Canonical execution therefore observes:

```text
direct inputs through safe block S
then transactions validated for frame S
```

Assigning those direct inputs to the earlier frame would make the live application evaluate transactions against a different state from the scheduler.

### I3. Frame safe blocks never decrease along the valid path

New frames begin at the current safe frontier, and safe-head persistence rejects backward movement. This supports the scheduler's structural checks and ensures that the first frame is the oldest frame for staleness testing.

### I4. Tip-only recovery has no dangerous closed batch ahead of it

The danger check evaluates closed batches before the open tip. Combined with non-decreasing safe blocks, an open-tip recovery decision means no non-accepted closed batch crossed the observed danger threshold first.

This allows startup to replace the open tip without a wallet-nonce flush. The tip has no base-layer transaction to resolve.

## Recovery and snapshot invariants

### I5. Pending-snapshot cleanup is scoped to the invalidated suffix

Recovery deletes pending snapshot references only at or after the cascade pivot, in the same transaction that invalidates the suffix and opens the replacement tip.

Deleting a wider range could remove a pending snapshot for a batch that remains valid, causing promotion to fail later. Deleting a narrower range could let catch-up load state from an invalidated branch.

### I6. A committed promotion includes the matching drain advance

Snapshot promotion and safe-input drain advancement commit in one transaction. A restart cannot observe a promoted snapshot while still attempting to process the input that caused that promotion.

### I7. A committed batch close has a pending snapshot

The batch close, next-tip creation, and pending-snapshot row commit together. Snapshot files are created and synchronized before that transaction.

Promotion can therefore require the pending row instead of handling a missing row as an ordinary condition.

### I8. Runtime startup has loadable state and one valid open tip

Plain setup registers the genesis finalized snapshot before writing its completion marker. Checkpoint recovery registers the reconstructed finalized snapshot and batch-tree anchor before completing. `run` refuses an incomplete setup, requires the finalized snapshot, and ensures that a valid open tip exists before starting the inclusion lane.

The lane can follow one unconditional load-and-replay path instead of supporting an empty-state fallback.

## Identity, nonce, and cursor invariants

### I9. An accepted nonce identifies the matching local batch content

For each fully accepted landing at or above the batch-tree anchor, the landed payload hash must match the seal-time hash of the valid closed local batch at the same nonce.

A missing local batch or different hash records canonical divergence and freezes the frontier. See [Divergence and the content-identity check](./divergence.md).

### I10. Feed offset zero means replay from genesis

Valid sequenced-feed rows begin at offset 1 and are append-only. Offset 0 is reserved as the sentinel meaning no row has been consumed.

Catch-up and subscription code can use one comparison, `offset > cursor`, without confusing a real transaction with the genesis position.

### I11. The sequencer's batch inputs are recorded but never executed as direct inputs

Safe inputs from the batch-submitter address participate in ordering and cursor advancement. They must not be passed to the application as direct inputs or emitted to feed consumers as application transactions.

Sender checks enforce this at catch-up replay, live execution, and feed delivery. Those consumers must remain synchronized.

### I12. Safe-head timestamps represent genuine progress

The input reader advances the persisted safe head only after observing a higher safe block, apart from recording the initial observation, and records synchronization time with that committed progress. Repeated reads of the same head do not refresh the progress timestamp.

The stale-view and wall-clock danger checks rely on this timestamp. Refreshing it without progress would hide an outage.

### I13. A referenced snapshot dump exists and is complete

Snapshot creation writes and synchronizes the dump before inserting its database row. Cleanup removes the row before deleting the filesystem directory. Startup sweeps unreferenced directories and resets stale leases.

This ordering prevents the normal creation and cleanup paths from leaving a committed snapshot reference to an incomplete dump, subject to the storage durability assumptions described in [Data, snapshots, and backups](../operations/data-and-state.md#durability-and-crash-guarantees).

### I14. The wallet-nonce watermark covers every broadcast nonce

Before the sequencer broadcasts a batch or flush transaction at wallet nonce `W`, it durably raises the stored watermark to at least W. Recovery completes only after the safe nonce has passed that watermark and the pending nonce is no greater than the safe nonce.

This prevents a locally forgotten transaction from surviving outside the flushed range while an intact database is available. A fresh checkpoint-recovery database lacks the original watermark, which is documented as a separate residual risk in [Cockroach recovery](../recovery/cockroach.md#resolve-the-submitter-wallet).

### I15. A divergence marker freezes the accepted frontier

The marker is written atomically with the synchronization that detects a foreign or mismatched accepted batch. Frontier population returns immediately whenever the marker exists, and the danger check gives divergence higher priority than every recovery condition.

This prevents normal recovery, batch promotion, or restart from advancing through known-divergent history.

### I16. The valid batch tree has one parentless root at the deployment anchor

A genesis deployment uses anchor nonce 0. A checkpoint-recovered deployment uses the replay result N'. The parentless valid root must carry exactly that anchor, and every child carries its parent's nonce plus one.

Database triggers limit the tree to one valid parentless root and enforce nonce continuity. The anchor becomes immutable after setup completes. This lets a recovered deployment resume at N' without creating fake historical batch rows.

## Invariants, assumptions, and guarantees

An invariant enforced by the implementation is not automatically an end-to-end guarantee. Some properties depend on environmental assumptions:

- the RPC endpoint provides an honest and internally consistent safe view;
- the base layer and `InputBox` follow their contracts;
- the host clock and configured block time are suitable for outage estimation;
- the application is deterministic across the live and canonical environments;
- storage honors synchronized writes;
- operator-supplied checkpoint state and metadata are genuine.

If an environmental assumption is encoded as an unconditional invariant, normal behavior can trigger a false failure. For example, wall-clock time can move backward, so elapsed-time code uses a guarded calculation instead of asserting monotonic system time.

## Review checklist for invariant changes

When changing an enforcement point:

1. identify every reader that depends on the property;
2. verify crash behavior before and after each commit boundary;
3. test restart, replay, and recovery paths, not only steady state;
4. preserve the distinction between invalid input and impossible state;
5. confirm that errors remain visible and do not create a second source of truth;
6. update the repository's detailed invariant register with new enforcement and dependency locations.

Names and module boundaries can change. Treat this page as a map of relationships, not as a stable internal API.

## Next steps

- Read the canonical rules in [Scheduler semantics](./scheduler-semantics.md).
- Review terminal disagreement handling in [Divergence and the content-identity check](./divergence.md).
- Understand the model-checked subset in [Formal verification](./formal-verification.md).
