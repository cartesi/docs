---
title: "App-specific sequencing"
sidebar_label: "App-specific sequencing"
description: "What an app-specific sequencer does, why an application might use one, and how its early ordering relates to canonical execution."
---

An **app-specific sequencer** is a service dedicated to one Cartesi application. It receives signed transactions, decides their provisional order, executes them against its current view of application state, and returns a fast response before those transactions settle through the base layer.

A Cartesi application runs its logic inside a [Cartesi machine](/cartesi-machine). Its inputs are recorded through contracts on the base layer, while commitments to the resulting state are settled there. If these concepts are new to you, begin with [Cartesi Rollups](/cartesi-rollups/1.5/).

The App Sequencer adds a fast transaction path to this design. It does not replace the base layer, the application's Cartesi machine, or the mechanisms that determine canonical state.

## Why use an app-specific sequencer

A rollup application needs a deterministic transaction order because changing the order can change the result. It also needs to decide how quickly users learn whether their transactions were accepted.

An application can rely on one of three broad approaches:

| Approach                                   | Response time                                | Capacity and control                                           | Base-layer cost                                                                        |
| ------------------------------------------ | -------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Send each input directly to the base layer | Tied to base-layer processing and settlement | No sequencer to operate                                        | Each sender pays for an individual input                                               |
| Use shared sequencing infrastructure       | Fast, depending on the service               | Capacity and policy are shared with other applications         | Costs may be shared across applications                                                |
| Run an app-specific sequencer              | Fast soft confirmations                      | Capacity and operating policy are dedicated to one application | The operator funds batch submissions and may recover the cost through application fees |

An app-specific sequencer offers four main benefits:

- **Dedicated capacity.** Other applications do not compete for space inside the sequencer, although every submitted batch still competes for space on the base layer.
- **Fast feedback.** The sequencer returns a soft confirmation after it accepts, executes, and durably stores a transaction in its current ordering.
- **Application-level policy.** The operator controls settings such as batch sizing and fee policy. Protocol ordering rules remain fixed so that configuration cannot silently change canonical execution.
- **Base-layer verifiability.** The application still derives its canonical result from inputs recorded on the base layer.

## How transaction ordering affects application state

Sequencing answers a basic question: **which transaction executes first?**

Every participant must eventually use the same answer. For example, a withdrawal can succeed or fail depending on whether a deposit or another withdrawal executes before it. If different components use different orders, they calculate different application states.

Without a sequencer, the base layer records individual inputs and determines their recorded positions. Users must wait for base-layer progress before treating the result as sufficiently settled.

The App Sequencer provides an earlier answer. It orders and executes a signed transaction off-chain as soon as it can safely accept it. This improves responsiveness, but the result remains provisional until the corresponding batch is accepted through the canonical path.

## One sequencer for each application

An app-specific sequencer serves exactly one application deployment. Its signing domain, application contract, batch-submitter identity, local state, and transaction validation are tied to that deployment.

This matches the structure of Cartesi applications. Each application has its own logic, contracts, and state. The application team integrates the sequencer library with that logic and operates the resulting application-specific binary.

Dedicated sequencing provides isolation and control, but it also makes the application team responsible for operating the service and funding batch submissions.

## Where the sequencer fits in the transaction path

![A user can send a signed transaction through the App Sequencer and receive a soft confirmation before the sequencer posts a batch to Ethereum. The user can also submit a direct input to Ethereum without using the sequencer. Both paths reach the scheduler and application logic inside the Cartesi machine.](../images/transaction-paths.png)

An input can reach the application through either path:

- A **sequenced transaction** goes through the sequencer and is later posted in a batch.
- A **direct input** goes straight to the base-layer `InputBox`. Deposits normally use this path because portal contracts submit them directly.

Both sources become part of the application's canonical input history. [Direct and sequenced inputs](../concepts/direct-vs-sequenced.md) compares their behavior, costs, and availability.

## How the sequencer predicts the final order

The sequencer maintains a fast, provisional view of order and application state. The scheduler inside the Cartesi machine later derives the authoritative order from base-layer inputs. Both apply matching protocol rules, which allows the sequencer to predict the scheduler's result during normal operation.

[Architecture at a glance](../foundations/architecture.md) follows this path from submission to settlement. [Batches, frames, and the safe block](../concepts/batches-frames-safe-block.md) explains the data structure, and [Deterministic execution order](../concepts/execution-order.md) explains how both input paths are combined.

### When the predicted order can change

An HTTP success response and a feed entry both describe the sequencer's provisional view. That view can change if a batch fails to join canonical execution. [Soft confirmations](../concepts/soft-confirmations.md) explains the client contract, while [Staleness and the danger zone](../concepts/staleness.md) explains the main liveness condition that can invalidate a sequence of batches.

## Guarantees and limitations

The App Sequencer provides fast transaction acceptance and a prediction of execution order. It does not provide base-layer settlement.

The protocol limits the sequencer in several important ways:

- It cannot create a valid user transaction without the user's signature.
- It cannot directly determine canonical application state. The application computes that state from the order derived inside the Cartesi machine.
- It cannot rewrite history that has already settled through the canonical path.
- It does not hold user assets as part of sequencing.

The operator still has meaningful power over the fast path. It can refuse, delay, or reorder transactions that users submit to it, and it sees those transactions before they reach the base layer. These choices can have financial consequences in an order-sensitive application.

Users can submit direct inputs without the sequencer, but the actions available through that route depend on the application. Direct inputs are also slower and require the sender to pay the base-layer transaction cost.

[Trust model and guarantees](../foundations/trust-model.md) describes these boundaries in detail.

## Next steps

- To decide whether the operational and trust tradeoffs suit your application, read [When to use the App Sequencer](./when-to-use.md).
- To see how the system components fit together, read [Architecture at a glance](../foundations/architecture.md).
