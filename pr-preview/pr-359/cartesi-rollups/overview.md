> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: overview
title: Overview
description: "Any code. Ethereum's security. Build appchain rollups with languages, libraries, and tools you know and love."
resources:
  - url: https://blog.cartesi.io/understanding-cartesi-rollups/
    title: Grokking Cartesi Rollups
  - url: https://medium.com/cartesi/application-specific-rollups-e12ed5d9de01
    title: Application-Specific Rollups
---

Cartesi enables developers to build blockchain applications that go beyond the computational limits of conventional smart contracts. It provides a full Linux environment with dedicated computing resources for each application, allowing developers to use established programming languages and software libraries. Applications run on Cartesi with results verified and disputes resolved on Ethereum. The technology is open source and general-purpose.

Cartesi Rollups is the framework for building these applications as appchain rollups, with the Cartesi Machine processing every input.

![img](../../static/img/v1.3/image.png)

## Introduction

Let's delve into the workings of a Cartesi Rollup at a high level.

![img](../../static/img/v1.3/overview.jpg)

At its core, the Cartesi Rollup executes the Cartesi Machine - a robust deterministic RISC-V emulator running Linux - fueled by ordered inputs and custom application code. Inputs sourced from the data availability layer are read by the Cartesi Node, inside of which the Cartesi Machine processes them and generates outputs. Once the claim for an epoch is accepted on the settlement layer, after the claim staging period, its outputs can be validated there, and vouchers can be executed.

The Cartesi Rollup framework is application-specific, assigning each dApp its rollup app chain and CPU while linking its optimistic rollups' consensus directly to the base layer. This structure ensures that validators—whether permissioned or not—can leverage the security features of the base layer, allowing any honest validator to enforce correct outcomes independently.

In its simplest form, the Cartesi framework integrates tightly with the base layer, which serves as the sole platform for data availability, consensus, and settlement. Transactions are sent as inputs to the InputBox contract on the base layer; the application code runs off-chain in the Cartesi Machine, and its outputs become verifiable on the base layer once the epoch's claim is accepted.

## Example

Below is a simple JavaScript example, written with the `@cartesi/rollup` package of the JavaScript template, demonstrating how to read an input and reply with a [notice](./api-reference/backend/notices.md) (a type of output).

```javascript
import { Rollup } from "@cartesi/rollup";

const rollup = new Rollup();

await rollup.run({
  advance(request) {
    const message = request.payload.toString("utf8");
    rollup.emitNotice(Buffer.from(`Got your message: ${message}`, "utf8"));
    return true; // accept the input
  },
});
```

Cartesi dApps are implemented as infinite loops: `rollup.run()` repeatedly asks the Cartesi Machine for the next request and calls `advance` for each input. Backends in other languages run the same loop through HTTP POST requests to the `/finish` endpoint of the Rollup HTTP Server, which keeps the model the same across programming languages and stacks. You can learn more about this abstraction [here](./api-reference/backend/introduction.md).

In the Cartesi Rollup framework, all inputs sent to the base layer trigger an "advance_state" [request](/development/send-inputs-and-assets.md#initiate-an-advance-request), which alters the state of the Cartesi Machine and consequently the Rollup. Since inputs originate on-chain, they are hex-encoded following the EVM message standard.

Notices can be understood as "provable" events; as such, they can be sent to an EVM chain to be verified, so they are also hex-encoded.

Finally, in this example, no errors are treated; thus, we end the cycle accepting the input (`return true`, which finishes the request with `status: accept`). However, suppose any input causes the application to enter a faulty state or violates business logic. In that case, the application can reject the input (`return false` in JavaScript, `/finish` with `status: reject` in other languages) to revert the machine’s (and rollup’s) state before the arrival of the current input.
