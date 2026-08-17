> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "The batch tree"
sidebar_label: "The batch tree"
description: "How the sequencer records alternative batch histories and uses an anchor to identify where local history begins."
---

The sequencer keeps its own record of every batch it has built and how they relate. In normal running that record is a straight line, one batch after another. It is a tree because failure sometimes makes it branch.

## Where the batch tree exists

A batch **as posted to the base layer** carries only its number and its frames. It contains no parent field. The machine needs only the numbered order because that order defines the relationship between batches. See [HTTP and WebSocket API](../api-reference/api.md) for the exact structure.

The parent links described on this page exist only in the **sequencer's own record**. They are how it tracks what it built and what it has abandoned. Nothing about this tree is visible to the application or to anyone reading the base layer.

## How recovery creates branches

A batch can reach the base layer too late and be skipped, taking every batch behind it out of contention. See [Staleness and the danger zone](./staleness.md).

When that happens, the work built on the doomed batches is no longer viable, but the sequencer cannot just delete it, because until the base layer has settled it does not yet know for certain what happened. What it does instead is mark the doomed line as invalid and start a fresh line from the last batch that is still good.

This creates a branch with one parent, an abandoned path, and a live path. The tree preserves both histories, allowing recovery to invalidate old work without deleting its record.

![A batch-tree anchor leads to the last accepted parent, where history branches. The abandoned provisional branch remains in local history as invalid, while a replacement branch begins from the accepted parent and becomes the current valid tip.](../images/batch-tree-recovery.png)

## Where batch history begins

Every deployment's record starts somewhere, and that starting number is the **anchor**.

For a fresh deployment, the anchor is zero because no prior history exists. After a checkpoint rebuild, the anchor is the number at which the rebuilt local history begins. The database contains no earlier batches. See [Cockroach recovery](../recovery/cockroach.md).

The anchor is what stops a rebuilt deployment from believing it should begin at zero, which would collide with everything already on the base layer. Its record has exactly one starting point, and everything else descends from it.

## How the tree supports soft confirmations

Mostly it does not. The tree is the sequencer's internal bookkeeping, and an application never sees it.

It matters indirectly, in one way. The tree is how the sequencer can tell the difference between work that is settled, work that is still a prediction, and work that has been abandoned. That distinction is what a soft confirmation ultimately rests on. See [Soft confirmations](./soft-confirmations.md).

## Related concepts

- For what invalidates a line, read [Staleness and the danger zone](./staleness.md).
- For how a doomed line is cleared, read [Preemptive recovery](../recovery/preemptive.md).
