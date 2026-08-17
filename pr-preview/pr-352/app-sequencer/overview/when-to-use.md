> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "When to use the App Sequencer"
sidebar_label: "When to use it"
description: "How to decide whether fast soft confirmations, dedicated sequencing, and their operational tradeoffs suit an application."
---

The App Sequencer is most useful when fast feedback materially improves an application and the team is prepared to operate a dedicated service. It adds responsiveness, but it also introduces provisional results and centralized control over the fast transaction path.

## Applications that benefit from a sequencer

Consider the App Sequencer when several of these conditions apply:

| Application characteristic                                | Likely benefit | Reason                                                                  |
| --------------------------------------------------------- | -------------- | ----------------------------------------------------------------------- |
| Users expect an immediate response                        | High           | A soft confirmation arrives before base-layer settlement                |
| Many actions happen within application state              | High           | Transactions can be grouped into batches instead of posted individually |
| The application has steady or bursty traffic              | High           | Batches can spread submission costs across multiple transactions        |
| The team needs control over capacity and fees             | High           | The sequencer is dedicated to one application                           |
| Transaction order affects user experience                 | Mixed          | Fast ordering helps, but the operator becomes trusted for fairness      |
| Most activity consists of deposits or other direct inputs | Low            | Those inputs bypass the sequencer                                       |
| Users already tolerate base-layer settlement time         | Low            | A faster provisional state may add little value                         |

Games, trading interfaces, collaborative applications, and social applications can benefit when users need to continue interacting without waiting for every action to settle.

The strongest fit is an application that can safely distinguish between an action that is **accepted** and one that is **settled**.

## When a sequencer may add little value

The App Sequencer may not be a good fit when:

- users are comfortable waiting for the base layer;
- most inputs must already be submitted directly through base-layer contracts;
- the application cannot represent provisional results or recover from their invalidation;
- the team cannot maintain a stateful, availability-sensitive service;
- centralized transaction ordering creates an unacceptable fairness or regulatory risk.

An application should also consider what remains possible without the sequencer. The direct-input route is always available at the protocol level, but the application decides which actions direct inputs can perform. If direct inputs only support deposits, an unavailable sequencer can leave other application actions waiting until service returns.

## Operational requirements

Running an app-specific sequencer requires:

- an application-specific binary that integrates the sequencer library with the application's execution logic;
- persistent local storage for ordering, batches, snapshots, and recovery state;
- a dedicated, funded base-layer account for submitting batches;
- reliable access to one consistent base-layer node;
- monitoring for API availability, base-layer progress, batch submission, staleness risk, and divergence;
- backup and recovery procedures for application snapshots and sequencer state.

The sequencer pays the base-layer cost of each batch. The application can charge sequencer fees to recover that cost, but it must choose a fee and batch policy suited to its traffic. Quiet applications may leave transactions in an open batch longer, while busy applications tend to close batches by size.

[Configure, set up, and run the sequencer](../operations/setup-and-running.md) and [Fees and data availability](../concepts/fees.md) cover these responsibilities in detail.

## Trust and user experience tradeoffs

Adopting the App Sequencer means accepting two important tradeoffs.

### The operator controls the fast-path order

The sequencer can refuse or delay a submitted transaction. It can also choose the order among transactions it accepts because the protocol does not enforce first come, first served behavior.

This is especially important for trading and other order-sensitive applications. The sequencer cannot forge a user's signature or dictate canonical application state, but its ordering decisions can still create or redistribute economic value.

Users can bypass the sequencer by submitting a direct input, subject to the actions supported by the application. This route is slower and requires the user to pay the base-layer cost.

### Soft confirmations can be invalidated

A soft confirmation reports the sequencer's current prediction before settlement. If its batch is not accepted through the canonical path, recovery can remove the transaction from the valid provisional history.

The interface must communicate the difference between accepted and settled. It also needs a way to reconcile outstanding transactions because the live feed does not publish rollback messages. See [Soft confirmations](../concepts/soft-confirmations.md).

## A practical decision rule

Use the App Sequencer when fast feedback materially improves the product and the team can:

1. operate and monitor the service reliably;
2. fund and manage batch submission;
3. accept centralized control over provisional ordering;
4. show users which results remain unsettled;
5. reconcile or recover provisional state when a batch is invalidated.

If one of these conditions is unacceptable, direct base-layer inputs or another sequencing model may be a better fit.

## Next steps

- To understand the system boundaries, read [Architecture at a glance](../foundations/architecture.md).
- To evaluate its guarantees, read [Trust model and guarantees](../foundations/trust-model.md).
- To begin integrating it, follow the [Quickstart](../usage/quickstart.md).
