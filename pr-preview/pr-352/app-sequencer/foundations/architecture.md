> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Architecture at a glance"
sidebar_label: "Architecture at a glance"
description: "How sequencer prediction, base-layer recording, and canonical execution work together from transaction submission to settlement."
---

The App Sequencer adds a fast prediction layer to a Cartesi application without replacing its canonical execution path.

- The **sequencer** runs as an ordinary service on the application operator's infrastructure. It validates, orders, and executes transactions against a provisional view of application state.
- The **scheduler and application** run inside the deterministic Cartesi machine. The scheduler derives the authoritative order from base-layer inputs, and the application computes state from that order.
- The **base layer** records application inputs and settles commitments to the machine's result.

The sequencer can respond before base-layer processing because it predicts what the scheduler will compute. The prediction remains a soft confirmation until the corresponding transaction is accepted through the canonical path.

## Sequencer prediction and canonical execution

![The App Sequencer runs off-chain with its HTTP API, inclusion lane, batch submitter, input reader, and local database. It exchanges transactions and soft confirmations with users, posts batches to the InputBox, and reads recorded inputs. The Cartesi machine reads the InputBox and runs the scheduler before the application logic. Direct transactions reach the InputBox without passing through the sequencer.](../images/architecture.png)

The diagram has three system boundaries:

1. **Sequencer infrastructure.** The application operator runs the API, transaction-ordering loop, database, base-layer reader, and batch submitter.
2. **Base-layer contracts.** The `InputBox` records application inputs. The application contract, portals, and other Cartesi Rollups contracts retain their existing roles.
3. **Cartesi machine.** The scheduler interprets the recorded inputs, and the application executes the resulting order deterministically.

The sequencer cannot change the order that the scheduler derives after inputs are recorded. Its responsibility is to maintain a provisional order that the scheduler is expected to reproduce later.

## System components and responsibilities

### Sequencer service

| Component       | Responsibility                                                                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTTP API        | Accepts signed user transactions and returns success or a structured rejection                                                                              |
| Inclusion lane  | Applies protocol and application validation, drains relevant direct inputs, executes accepted transactions, and stores them in a single deterministic order |
| Ordered feed    | Publishes the sequencer's current valid transaction history to clients and indexers                                                                         |
| Batch submitter | Posts completed batches to the base-layer `InputBox` using the configured submitter account                                                                 |
| Input reader    | Reads safe base-layer inputs so the sequencer can account for direct inputs and observe submitted batches                                                   |
| Local database  | Stores deployment identity, ordered transactions, batches, snapshots, submission state, and recovery metadata                                               |

### Base-layer contracts

| Component            | Responsibility                                                                        |
| -------------------- | ------------------------------------------------------------------------------------- |
| `InputBox`           | Records inputs sent to the application, their senders, and their base-layer positions |
| Application contract | Identifies the application and its data-availability configuration                    |
| Portals              | Transfer assets and submit the corresponding deposit inputs to the `InputBox`         |

The `InputBox` records arrival order. It does not determine the complete application execution order because batches contain their own ordered transactions and frames govern when direct inputs run.

### Cartesi machine

| Component   | Responsibility                                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scheduler   | Classifies recorded inputs, validates batches, combines direct inputs with sequenced transactions, and produces the authoritative execution order |
| Application | Validates application-specific behavior and computes state and outputs from that order                                                            |

The Cartesi machine is deterministic and reproducible. Its result can be committed to the base layer and challenged through the fraud-proof system. [Trust model and guarantees](./trust-model.md) explains the assumptions around each boundary.

## Transaction lifecycle from submission to settlement

1. **Submission.** A user signs an EIP-712 transaction and sends it to the sequencer's HTTP API.
2. **Validation.** The sequencer verifies the request and signature, checks the current fee, and applies the application's validation rules.
3. **Predicted execution.** The inclusion lane applies any direct inputs that should execute first, then executes and durably stores the accepted transaction.
4. **Soft confirmation.** The API returns success. This confirms the sequencer's current prediction, not base-layer settlement.
5. **Batch construction.** The transaction is stored in the open frame and batch. The batch closes according to the configured size or time policy.
6. **Base-layer submission.** The batch submitter sends the completed batch to the `InputBox`.
7. **Canonical ordering.** The scheduler reads the base-layer input, validates the batch, drains the direct inputs covered by each frame, and executes the listed transactions.
8. **Application settlement.** The application computes its result, and the rollup settles a commitment to that state through the base layer.

The first four stages normally complete without waiting for base-layer settlement. The remaining stages depend on batch policy, base-layer inclusion, and the settlement level required by the client.

| Observation                 | Source of the result      | Meaning                                                                     |
| --------------------------- | ------------------------- | --------------------------------------------------------------------------- |
| HTTP success                | Sequencer                 | The transaction was accepted, executed, and stored in the provisional order |
| Feed entry                  | Sequencer                 | The transaction has a provisional ordering position                         |
| Canonical application state | Scheduler and application | The transaction affected the result derived from base-layer inputs          |
| Sufficiently settled state  | Rollup and base layer     | The client has reached its required settlement threshold                    |

## How frames align sequenced and direct inputs

A batch can remain open while new direct inputs arrive. Frames let the sequencer record how far it has accounted for those inputs at different points in the batch. The sequencer and scheduler use each frame's safe block to combine direct inputs and sequenced transactions consistently.

[Batches, frames, and the safe block](../concepts/batches-frames-safe-block.md) explains the structure. [Deterministic execution order](../concepts/execution-order.md) explains the complete ordering rules.

## The direct-input path

A user or contract can submit an input to the `InputBox` without using the sequencer. Deposits normally follow this route through portal contracts. The available actions depend on the application.

[Direct and sequenced inputs](../concepts/direct-vs-sequenced.md) explains how the scheduler classifies both paths and compares their behavior.

## Application and client integration responsibilities

An application team integrates and operates three pieces:

- **Application logic.** The application must implement deterministic validation, user-transaction execution, direct-input execution, and snapshot behavior required by the sequencer library.
- **Application-specific sequencer binary.** A small executable combines the application implementation with the sequencer runtime and selects the deployment-specific configuration.
- **Client or frontend.** The client signs and submits transactions, consumes the ordered feed, stores its cursor, distinguishes soft confirmations from settlement, and reconciles unsettled activity against canonical application state.

The App Sequencer provides the runtime and Rust client components, but application logic, deployment configuration, operational ownership, and user-facing confirmation behavior remain application responsibilities.

See [Application integration](../usage/integration.md), [Application requirements](../usage/application-requirements.md), and [Consuming the sequenced transaction feed](../usage/reading-the-feed.md).

## Next steps

- To examine the security and operational assumptions, read [Trust model and guarantees](./trust-model.md).
- To try the complete client flow, follow the [Quickstart](../usage/quickstart.md).
