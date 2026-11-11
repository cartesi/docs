---
title: "Staleness and the danger zone"
sidebar_label: "Staleness and the danger zone"
description: "Why a batch that arrives too late is skipped, how that spreads to later batches, and why the sequencer steps back before it happens."
---

A batch is **stale** when it reaches the base layer too long after the point in time it claims to describe. The machine skips a stale batch entirely. This page explains why that rule exists and how it affects later batches.

## When a batch becomes stale

Every batch names a base-layer block in its first frame. This is the point through which it has accounted for direct inputs. The batch's age is the distance from that block to its recorded inclusion block.

If that age reaches **1200 blocks**, roughly 4 hours where blocks are twelve seconds apart, the batch is stale and is skipped.

## Why stale batches are skipped

It seems harsh to discard work that is otherwise valid, but the alternative is worse.

A batch says "run every direct input up to block N, then run these transactions." If that batch is accepted long after block N, then direct inputs that arrived in the meantime are pushed behind transactions that were decided without any knowledge of them. A sequencer that had fallen far behind, or one that wanted to hold direct inputs back, could keep doing this indefinitely.

The deadline closes that off. A sequencer cannot keep write priority while ignoring what is arriving directly, because its work stops being accepted once it falls far enough behind. The same block limit makes an overdue direct input eligible for forced execution when the scheduler processes a later application input. See [Direct and sequenced inputs](./direct-vs-sequenced.md).

## How staleness affects later batches

Batches carry consecutive numbers so the machine can identify the next batch it should execute. Suppose the machine has accepted batch `41`. It now expects batch `42`.

If batch `42` arrives on time and passes every check, the machine executes it and moves on to batch `43`. If batch `42` arrives stale, the machine skips all of its transactions and continues to expect batch `42`. Skipping the batch does not consume its number.

Any batches already created after it now have numbers that are too high:

![The staleness timeline moves from the normal operating range through the default danger threshold at 900 blocks to the deadline at 1200 blocks. If batch 42 arrives stale, batches 43 and 44 are rejected because the machine still expects 42. A replacement batch 42 restores progress.](../images/staleness-cascade.png)

This is why one stale batch affects every later batch in the same sequence. The later batches may be recent and otherwise valid, but the machine cannot execute them while it is still waiting for batch `42`.

No application state needs to be reversed because none of these batches take effect. Recovery can then build a replacement batch numbered `42`. Once the machine accepts that replacement, it advances to `43` and the sequence can continue. See [Batches, frames, and the safe block](./batches-frames-safe-block.md).

## How the danger zone prevents stale batches

Waiting for a batch to become stale would detect the problem only after that batch and all later batches were already lost.

The sequencer tracks how close each unsettled batch is to the deadline. When a batch enters the configured safety margin, the sequencer treats it as a danger signal and stops issuing confirmations that may not survive.

That margin is configurable, and defaults to 300 blocks, roughly an hour. The point of the margin is runway: an operator gets time to notice and act before the deadline arrives, instead of discovering the problem after it is too late.

There is a second signal for the case where the sequencer's view of the base layer has frozen. A stalled connection can make everything look fine, because nothing appears to be aging when no new blocks are being seen. So the sequencer also checks its view against the clock, and distrusts a view that has stopped advancing. Without that, it could keep issuing doomed confirmations throughout an outage.

## What happens when danger is detected

The sequencer exits when it detects this condition. [Preemptive recovery](../recovery/preemptive.md) explains the next steps, and [Soft confirmations](./soft-confirmations.md) explains how users are affected.

## Related concepts

- For what a stale batch means to a user, read [Soft confirmations](./soft-confirmations.md).
- For the recovery that follows, read [Preemptive recovery](../recovery/preemptive.md).
