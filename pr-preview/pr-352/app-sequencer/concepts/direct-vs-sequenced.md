> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Direct inputs vs sequenced transactions"
sidebar_label: "Direct inputs vs sequenced transactions"
description: "The two ways a transaction reaches a Cartesi application, how the machine tells them apart, and why one of them cannot be censored."
---

There are two ways into an application that runs a sequencer:

- A **sequenced transaction** goes to the sequencer, which orders it and posts it inside a batch.
- A **direct input** goes straight to the InputBox contract on the base layer, skipping the sequencer completely.

Both end up in the same application, in one agreed order. They differ in who carries them, how fast they run, who pays, and whether anyone can stop them.

## How inputs are classified

Both direct inputs and sequenced transactions arrive at the same InputBox contract with no flag or label in the payload. The application distinguishes them by the **sender's address**. Anything sent by the sequencer's address is treated as a batch, while every other sender produces a direct input. Payload contents cannot alter this classification.

## Direct and sequenced inputs compared

|                           | Sequenced transaction               | Direct input                                                       |
| ------------------------- | ----------------------------------- | ------------------------------------------------------------------ |
| Sent to                   | The sequencer                       | The InputBox contract                                              |
| Answer arrives            | Immediately, as a soft confirmation | When the base layer records it                                     |
| Who pays base-layer costs | The sequencer, which posts batches  | The user, who pays their own gas                                   |
| Can delivery be refused   | Yes, the sequencer may decline it   | No, delivery is guaranteed                                         |
| Can it be delayed         | Yes, by the sequencer               | Only up to a fixed limit                                           |
| Typical use               | Ordinary application activity       | Deposits, and reaching the application when the sequencer will not |

## When direct inputs run

A direct input does not run the moment it is recorded. It still waits, for the sequencer to decide when it is safe to be picked up, by way of the safe block it puts in each frame.

The frame's safe block instructs the application to run everything recorded up to the given safe block number. See [Batches, frames, and the safe block](./batches-frames-safe-block.md).

Direct inputs still get executed in the order they were recorded on the base layer with the oldest first, however they are executed in short bursts decided by the safe block.

## Why deposits arrive as direct inputs

Deposits come from a portal contract on the base layer, which posts to the InputBox itself. They are direct inputs by construction, not by choice, which is a useful property: it means funds can always reach an application.

## Designing the direct-input path

An application has to be designed to handle both direct inputs and sequenced transactions. The application receives both inputs and decides what each is allowed to do.

That decision sets how much of the application still works without its sequencer. If the direct route only accepts deposits, users can move funds in while the sequencer is unavailable, but everything else waits for it to come back.

## Related concepts

- To see the whole path, read [Architecture at a glance](../foundations/architecture.md).
- For the guarantees and limitations of a soft confirmation, read [Soft confirmations](./soft-confirmations.md).
