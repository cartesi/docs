> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Soft confirmations"
sidebar_label: "Soft confirmations"
description: "What a soft confirmation promises, when it can be undone, how long the exposure lasts, and how a frontend should treat it."
---

A **soft confirmation** is the sequencer's immediate response after it validates a transaction, executes it against current application state, and durably stores it in the current provisional order. It tells the client that the sequencer accepted the transaction. It does not prove that the transaction has reached the base layer or that the resulting application state has settled.

## Why the sequencer can make this prediction

The sequencer applies the application's validation and execution logic while following the same ordering rules that the scheduler inside the Cartesi machine will apply later. Under normal operation, this allows it to predict the transaction order and application result before the corresponding batch reaches the base layer.

The confirmation response identifies the accepted sender and nonce. It does not contain a feed offset, batch number, frame number, or settlement status. A transaction receives an ordering position when it appears in the [sequenced feed](../usage/reading-the-feed.md).

Using matching logic makes the prediction reliable, but it does not make the prediction final. The transaction still depends on its batch being accepted through the canonical path. See [Architecture at a glance](../overview/architecture.md) for how the sequencer and Cartesi machine stay aligned.

## Transaction lifecycle and settlement timing

The soft confirmation is fast, but it is only the beginning of the transaction's path through the system:

![A transaction moves from submission to a soft confirmation, waits in an open batch, is sealed and posted to the base layer, is recorded in a block, is observed at the base-layer safe head, and later reaches application settlement. Stages before safe-head observation remain provisional.](../images/soft-confirmation-lifecycle.png)

| Stage                              | What it means                                                                                 | Timing                                                      |
| ---------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Submitted**                      | The request has reached the sequencer                                                         | Immediate                                                   |
| **Soft confirmed**                 | The sequencer has validated, executed, and stored the transaction in its provisional order    | Immediate after successful processing                       |
| **Waiting in an open batch**       | The transaction is stored while the batch continues accepting transactions                    | Up to the configured batch duration, which defaults to 2 hours |
| **Sealed into a batch**            | The batch has closed and no longer accepts transactions                                       | When its size or time limit is reached                       |
| **Posted to the base layer**       | The batch submission transaction has been broadcast                                           | Depends on the submitter and network conditions              |
| **Recorded in a block**            | The base layer has included the batch submission                                              | Depends on base-layer inclusion                              |
| **Observed at the L1 safe head**   | The sequencer has processed the batch from the safe chain view reported by its RPC provider   | Depends on the base layer, RPC provider, and polling cadence |
| **Application state settled**      | The resulting Rollups claim has reached the settlement level required by the application      | Depends on the deployment's consensus and claim settings     |

A batch closes when it reaches its size target or its maximum open duration. The duration is a wall clock limit and defaults to **2 hours**.

The waiting time therefore depends on application traffic:

- **A busy application** may reach the size target quickly and seal batches frequently.
- **A quiet application** may keep a soft-confirmed transaction in an open batch for up to 2 hours before posting it.

Recording the batch in a recent block does not complete reconciliation. The sequencer first waits until its RPC provider reports that block through the safe view, then reads and processes it. This is the point where the normal risk of recovery removing the soft-confirmed transaction ends within the sequencer's trust model.

Safe-head observation is not application settlement. Settlement happens through the Rollups claim and consensus process, so its timing depends on the application's deployment configuration. A soft confirmation can therefore be immediate even when safe-head observation and application settlement are much later.

## Limits of a soft confirmation

A soft confirmation is **not** settlement. It does not mean the transaction has reached the base layer, and it does not mean the predicted result can no longer change. This distinction matters whenever a user may act on the result before canonical acceptance.

### Invalidation and its scope

A soft confirmation is invalidated when its transaction does not become part of canonical execution. The main liveness case is a batch that reaches the base layer after the protocol deadline and is skipped by the scheduler.

Because batches use consecutive numbers, one invalid batch can affect a suffix of provisional history. Recovery removes the affected suffix and resumes from the accepted canonical frontier. [Staleness and the danger zone](./staleness.md) explains the deadline and its effect on later batches.

### How long the risk remains

The sequencing-specific invalidation risk begins when the sequencer issues a soft confirmation. Under the sequencer's base-layer trust model, it ends when the transaction's batch is observed and accepted through the safe view. There is no fixed duration.

The transaction may first remain in an open batch for up to the configured duration, which defaults to 2 hours. Batch submission, base-layer inclusion, safe-head advancement, provider availability, and the sequencer's polling cadence add further time. Application settlement can take longer because it follows the deployment's Rollups consensus and claim process.

The sequencer monitors its safe view and stops issuing new confirmations when that view becomes too old or an unresolved batch approaches the staleness deadline. Detection still takes time, so confirmations issued before the problem becomes visible may be affected.

### Detecting an invalidated transaction

The ordered feed does not send rollback messages. A transaction removed during recovery is absent from a later replay, but a client that already received it receives no live retraction. [Reading the sequenced feed](../usage/reading-the-feed.md) explains cursor storage, replay, and reconciliation.

## How clients should handle soft confirmations

- **Show a soft confirmation as provisional.** A user should be able to distinguish sequencer acceptance from safe-head observation and application settlement.
- **Treat feed delivery as provisional.** Appearance in the feed means the transaction belongs to the current valid local ordering. It does not prove base-layer acceptance or settlement.
- **Use an appropriate source for later status.** The feed does not report safe-head acceptance or Rollups settlement. An application or trusted indexer must expose those states if clients need to display them.
- **Reconcile outstanding transactions.** Track submitted transactions and compare them with later feed replays and canonical application state to detect invalidation.
- **Size the caution to the stakes.** Adding ceremony everywhere throws away the point of the sequencer, so scale it instead:
  - *Low value or easily repeated*, such as a move in a game or a post: act on the fast answer.
  - *Meaningful but recoverable*, such as a transfer inside the application: act on it, but mark it as not yet settled.
  - *Expensive or irreversible*, such as anything paying out or crossing a boundary: wait for settlement.

## Next steps

- To see how the two sides stay aligned, read [Architecture at a glance](../overview/architecture.md).
- To see what the sequencer is and is not trusted for, read [Trust model and guarantees](../overview/trust-model.md).
