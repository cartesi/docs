> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "App Sequencer glossary"
sidebar_label: "App Sequencer glossary"
description: "Key terms used throughout the App Sequencer documentation."
---

This glossary provides concise definitions for App Sequencer terminology. Follow the links for the complete behavior, guarantees, and implementation guidance behind each term.

**Anchor.** The batch number at which a deployment's local record begins. It is zero for a new deployment or the resume number for a deployment rebuilt from a checkpoint. See [Understanding the batch tree](../concepts/batch-tree.md).

**App-specific sequencer.** A sequencer dedicated to one application deployment. It uses that application's validation and execution logic to provide a provisional transaction order and soft confirmations. See [App-specific sequencing](../overview/app-specific-sequencing.md).

**Base layer.** The blockchain that records application inputs and supports settlement of the rollup's state commitments, usually Ethereum.

**Batch.** A numbered package of frames that the sequencer submits to the base-layer `InputBox`. See [Batches, frames, and the safe block](../concepts/batches-frames-safe-block.md).

**Batch submitter.** Either the sequencer worker that posts completed batches or the dedicated base-layer account used for those submissions. The surrounding context should identify which meaning applies.

**Batch tree.** The sequencer's record of batches it has built. It forms a straight line during normal operation and branches when recovery abandons an unsettled suffix and creates a replacement sequence. See [Understanding the batch tree](../concepts/batch-tree.md).

**Canonical state.** The application state computed from the execution order derived inside the Cartesi machine from base-layer inputs.

**Checkpoint.** An archived finalized snapshot and its recovery metadata. It provides a trusted starting point for rebuilding a deployment after local state is lost or no longer trusted. See [Snapshots and checkpoints](../recovery/snapshots.md).

**Cockroach recovery.** The procedure for rebuilding a deployment from a checkpoint and base-layer history. See [Cockroach recovery](../recovery/cockroach.md).

**Danger zone.** The configurable safety margin before the staleness deadline. The sequencer stops when an unsettled batch enters this range so recovery can begin before the batch becomes stale. See [Staleness and the danger zone](../concepts/staleness.md).

**Direct input.** An application input recorded through the base-layer `InputBox` without being included in a sequencer batch. The scheduler classifies an input as direct when its sender is not the configured batch-submitter address. See [Direct inputs vs sequenced transactions](../concepts/direct-vs-sequenced.md).

**Divergence.** A fault in which a batch observed in canonical execution differs from the batch the sequencer sealed for the same position. The sequencer records the fault and stops. See [Divergence handling](../advanced/divergence.md).

**Feed.** The ordered stream of the sequencer's current valid transactions. It is provisional, can publish before base-layer acceptance, and does not send rollback messages after recovery. See [Consuming the sequenced transaction feed](../usage/reading-the-feed.md).

**Frame.** An ordered section inside a batch. It carries a safe block, a frame fee, and zero or more sequenced transactions.

**Inclusion lane.** The sequencer's single ordering loop. It drains relevant direct inputs, validates and executes user transactions, stores accepted transactions, and manages open frames and batches.

**InputBox.** The base-layer contract that records inputs for a Cartesi application, including each input's sender and position. The scheduler interprets this record to derive the complete execution order.

**Offset.** An ascending identifier attached to each message in the sequenced feed. Offsets begin at 1 and may contain gaps, so a client resumes from its last processed offset instead of counting messages.

**Preemptive recovery.** The routine recovery path triggered before an unsettled batch reaches the staleness deadline. It stops unsafe confirmation, identifies the canonical frontier, invalidates the affected provisional suffix, and resumes from the expected batch number. See [Preemptive recovery](../recovery/preemptive.md).

**Safe block.** A base-layer block number carried by a frame. Before executing the frame's sequenced transactions, the scheduler executes pending direct inputs recorded at or before this block.

**Scheduler.** The component inside the application's Cartesi machine that derives the authoritative execution order from base-layer inputs. The sequencer predicts its result by following matching protocol rules.

**Sequenced transaction.** A signed user transaction accepted by the sequencer and placed in a batch, as distinct from a direct input.

**Sequencing.** Deciding the order in which application transactions execute.

**Settled.** Accepted through the canonical rollup path and observed at the settlement threshold required by the client. The exact threshold depends on the chain and the risk of the action.

**Snapshot.** A durable copy of application state at a known transaction offset. A pending snapshot depends on unsettled batches; a finalized snapshot has been promoted after the corresponding canonical progress is observed.

**Soft confirmation.** The sequencer's immediate response after it accepts, executes, and durably stores a transaction in its provisional ordering. It is not proof of base-layer acceptance or settlement. See [Soft confirmations](../concepts/soft-confirmations.md).

**Stale batch.** A non-empty batch whose base-layer inclusion block is at least `MAX_WAIT_BLOCKS` after the safe block in its first frame. The scheduler skips it without consuming its batch number. See [Staleness and the danger zone](../concepts/staleness.md).

**Watchdog.** A process that compares sequencer snapshots with independently reproduced canonical application state and reports mismatches. See [Monitoring the sequencer](../operations/monitoring.md).
