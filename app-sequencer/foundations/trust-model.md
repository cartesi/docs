---
title: "Trust model and guarantees"
sidebar_label: "Trust model and guarantees"
description: "Which App Sequencer properties are enforced by the protocol, which depend on the operator, and how failures affect users."
---

The App Sequencer gives one operator control over the application's fast transaction path. The protocol limits that control, but it does not remove the need to trust the operator for availability, transaction selection, and fair provisional ordering.

This page separates protocol-enforced properties from operational assumptions. It also explains what clients must expect when the provisional order and canonical application state do not agree.

## Protocol-enforced limitations

These limits hold regardless of the sequencer operator's conduct:

- **The sequencer cannot forge a valid user transaction.** Each sequenced transaction carries an EIP-712 signature that is checked against its sender and deployment-specific domain.
- **The sequencer does not determine canonical state.** The scheduler derives execution order inside the Cartesi machine, and the application computes state from that order.
- **The sequencer cannot rewrite settled canonical history.** Recovery changes the sequencer's unsettled local history. It does not change application state that has already settled through the canonical path.
- **The sequencing service does not custody user assets.** Assets remain governed by the application's contracts, portals, and application logic.
- **The sequencer cannot permanently remove the base-layer input route.** Users and contracts can submit directly to the `InputBox`, although the application determines which actions that path supports.

These protections do not make the sequencer economically neutral. Transaction selection and ordering can affect prices, trades, liquidations, games, and other order-sensitive behavior.

## Sequencer powers and trust assumptions

The operator controls the provisional fast path and can:

- **refuse or delay transactions;**
- **choose the order among accepted transactions,** including placing its own transaction first;
- **observe submitted transactions before they appear on the base layer;**
- **change configurable fee and batching policy;**
- **make the fast path unavailable by stopping or misoperating the service;**
- **issue a soft confirmation that is later invalidated** if its batch does not become part of canonical execution.

The protocol does not enforce first come, first served ordering. Applications in which ordering carries economic value must therefore treat the operator as trusted for fairness or add application-level protections against harmful ordering.

## Protocol protections and recovery paths

### Signed user transactions

Deployment-bound signatures prevent the sequencer from inventing a user's authorization. They do not prevent it from excluding or reordering authorized transactions. [EIP-712 domain](../api-reference/eip712.md) defines the exact signed fields and deployment binding.

### Canonical recomputation

The scheduler reads the base-layer `InputBox` history and derives the execution order inside the Cartesi machine. The application then computes its own state from that order.

A provisional order announced by the sequencer cannot, by itself, force the machine to accept that order. The batch must pass the scheduler's identity, numbering, structure, timing, and transaction checks.

### Direct-input availability

Users and contracts can reach the application through the base-layer `InputBox` without the sequencer. This protects access, but not speed, cost, or feature equivalence. The application defines which actions the direct route supports. [Direct and sequenced inputs](../concepts/direct-vs-sequenced.md) explains the behavior and scheduler backstop.

### Fraud-proof settlement

Adding the sequencer does not replace the rollup's dispute mechanism. Commitments to application execution remain subject to the same [fraud-proof system](/fraud-proofs) and its underlying assumptions.

## How the system responds to divergence

If accepted base-layer batch content differs from the matching local sealed batch, the sequencer records a terminal divergence and stops. Detection follows the configured safe view, so provisional results issued before detection may already depend on the wrong history. [Divergence detection and response](../advanced/divergence.md) defines the comparison, timing, and operator procedure.

## Trust assumptions by participant

| Participant or component                            | Relied on for                                                                                                             | Not relied on for                                                     |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Application operator                                | Service availability, funding batch submission, transaction selection, and fair provisional ordering                      | Creating valid user signatures or directly defining canonical state   |
| Application implementation                          | Deterministic validation and execution, correct fee and nonce handling, direct-input behavior, and reproducible snapshots | Base-layer consensus or transaction inclusion                         |
| Sequencer implementation                            | Predicting scheduler behavior correctly, preserving durable ordering, and stopping safely on detected faults              | Canonical authority over settled application state                    |
| Base layer                                          | Consensus, ordered transaction recording, and the settlement properties assumed by the rollup                             | Fair inclusion or timely inclusion of the sequencer's submissions     |
| Cartesi Rollups contracts, including the `InputBox` | Correct contract behavior, sender authentication, and recording application inputs                                        | Deriving the application's complete execution order                   |
| Base-layer node used by the sequencer               | A consistent and truthful view of the chain, with failures treated as unavailable data                                    | Byzantine fault tolerance at the sequencer's RPC boundary             |
| Block builders                                      | No cooperative behavior is assumed                                                                                        | They may delay, reorder, or omit batch submissions and direct inputs  |
| Users submitting transactions                       | No trusted behavior is assumed                                                                                            | Requests are decoded, bounded, signed, and validated before execution |

## Guarantee summary

| Property                                | Classification                                                     |
| --------------------------------------- | ------------------------------------------------------------------ |
| User authorization                      | Enforced through signature verification and application validation |
| Canonical execution order               | Derived by the scheduler from base-layer inputs                    |
| Canonical application state             | Computed deterministically inside the Cartesi machine              |
| Fair ordering on the fast path          | Depends on the operator or application-level controls              |
| Fast API availability                   | Depends on sequencer infrastructure and its dependencies           |
| Survival of a soft confirmation         | Conditional on its batch becoming part of canonical execution      |
| Available actions through direct inputs | Defined by the application                                         |
| Base-layer inclusion time               | Depends on the chain, fee market, and block builders               |

## Next steps

- To see where each trusted component sits, read [Architecture at a glance](./architecture.md).
- To design client behavior around provisional results, read [Soft confirmations](../concepts/soft-confirmations.md).
- To understand failure recovery, read [Staleness and the danger zone](../concepts/staleness.md) and [Preemptive recovery](../recovery/preemptive.md).
