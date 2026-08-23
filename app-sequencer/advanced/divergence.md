---
title: "Divergence and the content-identity check"
sidebar_label: "Divergence detection"
description: "How accepted base-layer batch content is compared with local sealed content, what the check cannot prove, and why divergence stops the sequencer."
---

Canonical divergence occurs when a batch accepted at a given nonce does not match the valid batch the sequencer sealed for that nonce, or when no matching valid local batch exists.

This condition invalidates the assumption that the local batch tree mirrors canonical history. The sequencer records the mismatch and stops before the accepted frontier, snapshot lifecycle, or recovery logic can advance from an incorrect identity.

## What the check compares

When the sequencer seals a batch, it encodes the exact payload the submitter will broadcast and stores its Keccak-256 hash with the batch record. The payload hash is written in the same database operation that seals the batch and is protected from later modification.

When base-layer synchronization encounters a batch that the scheduler acceptance predicate considers fully accepted, the sequencer:

1. reads the accepted batch nonce and payload from the safe input stream;
2. finds the valid closed local batch carrying that nonce;
3. hashes the landed payload bytes;
4. compares the landed hash with the seal-time local hash.

![The sequencer hashes a batch when it is sealed and hashes the accepted payload observed in the safe base-layer view. A matching local batch with equal hashes advances the accepted frontier. A missing local batch is foreign, while different hashes are a mismatch; either failure records persistent divergence and freezes the frontier.](../images/divergence-check.jpg)

Content-equal copies are accepted. The identity of the physical base-layer transaction does not matter because identical batch bytes have the same scheduler effect.

## Divergence classifications

The implementation records two kinds of content-identity violation:

| Kind       | Meaning                                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| `foreign`  | The scheduler accepted a nonce for which no valid closed local batch exists                                      |
| `mismatch` | A valid closed local batch exists at the nonce, but its sealed payload hash differs from the landed payload hash |

Possible causes include a delayed transaction from an abandoned branch, use of the submitter key outside the sequencer, database corruption, or a defect that changed sealed or submitted content.

## When the comparison runs

The comparison runs only after the off-chain scheduler predicate accepts a batch from the base-layer safe input stream. It does not compare payloads that are:

- undecodable as batches;
- stale;
- carrying the wrong batch nonce;
- below the batch-tree anchor after checkpoint recovery.

The first three cases have no scheduler effect, so their content cannot change canonical application state. Inputs below a recovery anchor belong to trusted history already folded into the checkpoint. The rebuilt local tree begins at the anchor and intentionally contains no earlier batch rows.

## Detection timing

Detection begins when the landing appears in the configured RPC endpoint's safe view and the input reader synchronizes that range. It therefore follows the base layer's safe-head delay and the input reader's polling cadence.

There is no fixed detection duration that applies to every supported chain or provider. The batch submitter's configurable confirmation depth also does not control this check. The authoritative trigger is inclusion in the safe input view used to construct the accepted frontier.

Soft confirmations issued before detection may already depend on a local state that canonical execution will not reproduce. This residual window is part of the optimistic design.

## Atomic marker and frozen frontier

The divergence marker is inserted in the same database transaction as the safe-head synchronization that detects the violation. The accepted landing is not added to `safe_accepted_batches`.

Once the marker exists:

- accepted-frontier population returns without scanning further;
- snapshot promotion cannot advance through the mismatched landing;
- the danger check reports canonical divergence before every staleness condition;
- startup refuses automatic recovery;
- the process exits with terminal code `30`.

The marker persists across restarts. A supervisor that ignores code `30` will repeatedly start a process that immediately refuses the same state.

## Why automatic recovery is unsafe

Preemptive recovery assumes that every accepted nonce identifies the matching local batch. It uses that accepted frontier to select a cascade point and preserve the valid prefix.

A content-identity violation disproves that assumption. Cascading from the local tree could preserve state that was never canonical or discard the wrong branch. The sequencer therefore refuses to derive a repair from the record whose identity is in question.

The supported remedy is to preserve evidence, stop the old deployment, and rebuild a fresh data directory using [Cockroach recovery](../recovery/cockroach.md).

## What the check does not prove

The content-identity check proves that accepted batch bytes match the bytes sealed locally for the same nonce. It does not compare resulting application state.

Matching bytes can still produce different state if:

- the application is nondeterministic;
- the Cartesi machine and live prediction run different application versions;
- the scheduler implementations disagree about execution;
- direct inputs are applied differently outside the compared batch payload.

The independent watchdog addresses this broader class by replaying canonical base-layer inputs and comparing resulting state bytes with the sequencer's finalized snapshot. See [Monitoring and watchdog operation](../operations/monitoring.md).

## Prevention and residual risk

Wallet-nonce resolution reduces the chance that an abandoned submission later claims a relevant slot, but it does not remove the need for content comparison. A checkpoint rebuild has the additional limitation that its fresh database lacks the original wallet-nonce watermark. See [Flush unresolved wallet nonces](../operations/orchestration.md#flush-unresolved-wallet-nonces) and [Cockroach recovery](../recovery/cockroach.md#resolve-the-submitter-wallet).

## Operator response

When canonical divergence is reported:

1. stop automatic restarts and prevent use of the submitter key;
2. preserve the database, logs, RPC observations, and base-layer transaction evidence;
3. identify whether the marker is `foreign` or `mismatch`;
4. investigate key use, delayed transactions, software versions, and storage integrity;
5. fix the underlying cause before rebuilding;
6. rebuild from a verified checkpoint and validate the result with the watchdog.

Removing the marker from the database is not a repair. It would allow frontier processing to continue without restoring the rejected identity assumption.

## Next steps

- Review the acceptance algorithm in [Scheduler semantics](./scheduler-semantics.md).
- Review the freeze and wallet-nonce properties in [Invariants](./invariants.md).
- Prepare terminal-failure handling with [Failure modes](../recovery/failure-modes.md).
