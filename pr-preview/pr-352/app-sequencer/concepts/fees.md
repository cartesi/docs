> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Fees and data availability"
sidebar_label: "Fees and data availability"
description: "Why transactions carry a fee, how the exponent encoding works, and what the sequencer is paying for."
---

Posting batches to the base layer costs the operator real money, and the cost grows with the amount of data posted. Application fees can recover this expense from users.

## What the fee is for

The sequencer pays base-layer gas every time it records a batch. The larger the batch, the more it pays. Without a fee, a user submitting large or frequent transactions costs the operator more than a user who barely uses the application, and nothing balances that.

The fee is charged in the application's own terms. The sequencer does not define what the token is or how balances work, because that is the application's business. What the protocol provides is a way to express a price and a limit, and a rule for comparing them.

## The exponent encoding

The protocol represents every fee as a 16 bit**exponent**. This includes the maximum fee signed by a user and the price assigned to a frame. The corresponding amount is calculated as:

```text
fee amount = floor((129 / 128)ⁿ)
```

In this formula:

- `n` is the exponent stored in the transaction or frame;
- `129 / 128`, or `1.0078125`, is the fixed base; and
- the result is expressed in the smallest unit of the application's token.

Each increase of `1` in the exponent raises the unrounded amount by approximately 0.78 percent. The protocol rounds the final result down to a whole token unit, so nearby exponents can produce the same amount when the values are small.

| Exponent | Decoded amount |
| -------: | -------------: |
|      `0` |       `1` unit |
|     `90` |      `2` units |
|    `256` |      `7` units |
|   `1060` |   `3824` units |

Exponent `0` represents the minimum fee of one unit. The encoding has no special value for a zero fee.

This representation provides three protocol benefits:

- **Compact values.** Each fee occupies two bytes on the wire while supporting a wide range of token denominations and prices.
- **Log-space policy calculations.** Fee adjustments can use exponent addition, reducing the need for multiplication in policy and storage calculations.
- **Deterministic conversion.** The implementation uses exact integer arithmetic and a precomputed table. It uses no floating-point operations, so the sequencer and machine can produce identical results.

## Maximum fee and frame price

**`max_fee`** travels with a transaction. It is the most the sender is willing to pay, set by whoever signs.

**The frame price** is set by the sequencer for each frame, and is fixed once that frame is closed. The next frame samples a fresh recommended price, so the price can move as conditions change, but never underneath transactions already placed.

**The comparison happens at submission, not later.** When a transaction arrives, the sequencer checks it against the price of the frame currently open, and a transaction that does not meet it is rejected there and then with HTTP `422`. Only transactions that pass are stored and acknowledged.

An accepted transaction **cannot** later become underpriced. A frame's price remains fixed for that frame's lifetime, and the transaction has already passed the fee check. A higher price in a later frame does not affect it.

So `max_fee` fails fast, not late. If it is too low you find out in the response.

## How clients choose a fee

Clients currently have no public endpoint from which to discover the recommended fee.

The sequencer sets a frame's price from its own policy, but **it does not expose that price**.
A bid below the current price returns HTTP `422` immediately. The client learns about the rejection on its first attempt, and the transaction is never stored in a batch.

The practical approaches are:

- **Start from the deployment's baseline.** The default policy derives a recommended fee exponent of **1060**, so a bid of `1` is rejected. Obtain the deployment's current baseline from its operator.
- **Bid comfortably above it.** The encoding is exponential, so a modest bump in the exponent is a large bump in the amount.
- **Retry on `422`.** The typed rejection allows a client to raise its bid and resubmit after a failed attempt.
- **Publish a default.** For an application whose sequencer you run, the policy is yours, and a sensible client default can ship alongside the application.

## How batch size affects fees

Batch size is the other half of the same problem. Larger batches spread the fixed cost of a base-layer transaction across more work, but cost more to post and take longer to fill.

The same policy determines the target batch size and recommended fee, so the two values move together.

## Related concepts

- To set a fee on a transaction, see [Submitting operations](../usage/submitting-operations.md).
- For how frames are formed, see [Batches, frames, and the safe block](./batches-frames-safe-block.md).
