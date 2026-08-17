> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Failure modes"
sidebar_label: "Failure modes"
description: "How the sequencer responds to base-layer outages, crashes, stale batches, divergence, and loss of local state."
---

The sequencer distinguishes failures that delay progress from failures that make its local state unsafe to use.

- A **liveness failure**, such as a temporary RPC outage, is retried or handled through a controlled restart.
- A **recoverable batch failure** causes the sequencer to abandon provisional work and continue from the last accepted batch.
- A **correctness failure** stops the deployment until an operator rebuilds or repairs it.

This distinction determines whether the supervisor should restart the process, wait for an external dependency, or stop and alert an operator.

## Failure response summary

| Condition                                      | Sequencer response                                                                                                            | Operator response                                        |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Temporary base-layer RPC failure               | The input reader and batch submitter retry                                                                                    | Monitor the outage and allow retries                     |
| Base-layer view becomes too old to trust       | The process exits with code `20` and refuses startup until a usable view is available                                         | Restart with backoff and investigate if it persists      |
| Open batch enters the danger zone              | The process exits with code `10`; startup replaces the open batch without flushing                                            | Restart and allow startup recovery to finish             |
| Closed batch enters the danger zone            | The process exits with code `10`; startup flushes unresolved wallet nonces, synchronizes, and invalidates the affected suffix | Restart and allow additional recovery time               |
| Local and base-layer batch content diverge     | The process exits with code `30`                                                                                              | Stop automatic restarts and rebuild from a checkpoint    |
| Fresh setup detects earlier submitter activity | Setup exits with code `40`                                                                                                    | Run `setup --recovery` with a trusted checkpoint         |
| Unclassified process, storage, or worker error | The process exits with code `1`                                                                                               | Restart with backoff, then investigate repeated failures |
| Local data is lost or cannot be trusted        | Normal startup is not possible                                                                                                | Rebuild from a checkpoint                                |

See [Exit codes and supervisor policy](../operations/orchestration.md#exit-codes-and-required-actions) for the complete process-control contract.

## Base-layer outages

The input reader and batch submitter retry temporary RPC failures, and the API may continue while the saved base-layer view remains usable. If that view becomes too old to trust, the process stops. Startup refuses with code `20` until it can obtain enough direct evidence to choose a safe path.

See [Staleness and the danger zone](../concepts/staleness.md) for the timing rule and [Preemptive recovery](./preemptive.md#startup-recovery-decision) for the startup decision.

## Process crashes and abrupt shutdowns

An ordinary crash does not require checkpoint recovery. Committed database state and referenced snapshots are recovered during startup, while interrupted housekeeping is repaired before workers begin. Restart with backoff and investigate repeated worker or storage failures. See [Durability and crash guarantees](../operations/data-and-state.md#durability-and-crash-guarantees).

## Extended downtime

During a long shutdown, provisional batches continue aging. Startup synchronizes before accepting work, then selects ordinary startup, open-batch replacement, flush-and-cascade recovery, or refusal. See [Startup recovery decision](./preemptive.md#startup-recovery-decision).

## Dropped, delayed, and resurfacing transactions

A transaction that disappears from one provider can survive elsewhere and appear later. Recovery therefore resolves uncertain submitter nonce slots before abandoning submitted batches. See [Flush unresolved wallet nonces](../operations/orchestration.md#flush-unresolved-wallet-nonces).

## Batches that arrive too late

A stale batch and the provisional suffix after it do not take effect. Preemptive recovery resumes from the accepted frontier, while affected clients must reconcile their provisional results. See [Staleness and the danger zone](../concepts/staleness.md) and [Preemptive recovery](./preemptive.md).

## Canonical divergence

Canonical divergence is terminal because accepted base-layer content differs from the local batch stored for the same position. Stop automatic restarts, preserve evidence, and follow [Divergence detection and response](../advanced/divergence.md).

## Loss or corruption of local state

If local state is lost or untrusted, normal startup and preemptive recovery cannot establish a safe frontier. Use the restore boundaries in [Data, snapshots, and backups](../operations/data-and-state.md#restore-boundaries), then follow [Cockroach recovery](./cockroach.md) when reconstruction is required.

## Direct inputs during an outage

Users can still submit deposits and other direct inputs while the sequencer is offline because those inputs bypass the sequencer.

The scheduler checks the direct-input delay rule when another input is processed. If no new input arrives, a queued direct input can remain pending beyond its normal delay. Any later application input advances processing and can release the earlier one. A user who needs progress can submit another direct input without waiting for the sequencer to return.

See [Direct inputs vs sequenced transactions](../concepts/direct-vs-sequenced.md).

## Failures outside automatic recovery

Automatic recovery does not correct every source of failure:

- **Application or sequencer defects.** Detected invariant violations stop the process because signing more batches could expand the incident.
- **Nondeterministic application behavior.** A state mismatch requires investigation and checkpoint recovery after the cause is fixed.
- **Compromised submitter keys.** Rotate or replace the deployment according to the incident plan. Recovery cannot make a stolen key trustworthy.
- **Traffic floods and API abuse.** Rate limits, request filtering, and denial-of-service protection belong at the external gateway.
- **Storage hardware failures.** Database transactions cannot compensate for a device that acknowledges writes and later loses them.

## Next steps

- Learn how automatic batch repair works in [Preemptive recovery](./preemptive.md).
- Prepare checkpoint-based reconstruction with [Snapshots and checkpoints](./snapshots.md).
- Configure restart behavior in [Process supervision and recovery operations](../operations/orchestration.md).
