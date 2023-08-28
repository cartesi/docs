---
id: overview
title: Overview
tags: [build, quickstart, developer, dapps]
---

:::tip
Navigate to our [Quick Start](./run-dapp.md) tutorial if you want to build DApps now!
:::

Cartesi's vision is that creating a DApp should not be too different from the general development of desktop, web, and mobile applications. To that end, Cartesi provides a framework for building decentralized logic, giving developers full flexibility to use the tools and libraries of their preference.

From a developer's point of view, a Cartesi DApp is composed of two main parts:
- **[Front-end](../dapp-architecture.md#back-end)**: the user facing interface, which will often provide a UI (e.g., a web application) but may also be a command line interface (e.g., a hardhat task using ethers, or a command line using python).
- **[Back-end](../dapp-architecture.md#back-end)**: the verifiable logic that will run inside the Cartesi Rollups infrastructure; this will store and update the application state given user input, and will produce outputs in the form of [vouchers](../components.md#vouchers) (transactions that can be carried out on layer-1) and [notices](../components.md#notices) (information that can be validated on layer-1).

The suggested development process for Cartesi DApps involves a [series of stages](../dapp-life-cycle.md), from the design of the application up to its final deployment. Although some of those stages involve blockchain or Cartesi-specific procedures, the intention is that developers should be able to code normally using their usual mainstream development environment for 90+% of the work, and to make that possible Cartesi provides some tools and infrastructure.

In particular, during development the Cartesi Rollups infrastructure can be executed locally in two modes, as described below.

## Production Mode

In **Production Mode**, the DApp's back-end logic is packaged to run inside a [Cartesi Machine emulator](/machine/intro), as will be the case when the application is deployed. This means that any code written in compiled languages such as C++ or Rust must be _cross-compiled_ to the Cartesi Machine's RISC-V architecture. In this mode, the computation performed by the back-end is reproducible and hence verifiable, enabling a truly trustless and decentralized execution.

## Host Mode

In [Host Mode](./dapp-host-mode.md), the back-end logic is executed natively on localhost, just as any regular application. This is made possible because the Cartesi Rollups Host Environment provides the very same APIs as the regular mode, mimicking the behavior of the actual layer-1 and layer-2 components. This allows the developer to test and debug the back-end logic using familiar tools, such as an IDE or a debugger.

## Learn more

* [Cartesi Rollups overview](../overview.md)
* [DApp life cycle explained](../dapp-life-cycle.md)
* [DApp architecture](../dapp-architecture.md)
* [Rollups HTTP APIs](../http-api.md)
