---
id: overview
title: Overview
tags: [rollups, dapps, linux]
resources:
  - url: https://cartesi.io/blog/understanding-cartesi-rollups/
    title: Grokking Cartesi Rollups
  - ur;: https://medium.com/cartesi/application-specific-rollups-e12ed5d9de01
    title: Application-Specific Rollups
---

Welcome to the framework that helps you build decentralized blockchain applications using well-known and beloved stacks!

Cartesi Rollups is a modular execution layer where Linux and blockchain meet. As an app-chain, your dApp will control computation resources, ensuring efficiency and preventing network competition.

At the heart of your dApp, you will find the Cartesi Virtual Machine (based on RISC-V). This allows you to focus more on building and less on the need for programmability. It has been made possible by deterministically running a full-fledged Linux OS, virtually giving you a blockchain server to run your dApp.

Now, you can leverage industry-grade software tooling and libraries as you do in traditional software development, making it easier to bring your decentralized applications to life.

![img](../static/img/v1.3/image.png)


## Scalability

Cartesi is pioneering the implementation of application-specific rollups, offering solutions to the scalability issues plaguing existing blockchain networks.

Our application-specific rollups act as off-chain execution layers that inherit security and censorship guarantees from the base layer. But now, instead of sharing space inside a single rollup, each dApp has its dedicated rollup to process off-chain computation.

There are significantly lower costs for dApp development and operation. By providing dedicated computational resources for each dApp, Cartesi eliminates the competitive pressure for block space, resulting in more predictable and manageable costs for developers and users alike.

## Security and Decentralization

Cartesi's approach to rollups preserves the strong security guarantees of the underlying blockchain while offering a scalable and efficient execution environment.

Application-specific rollups are designed with a 1-of-N security model, which means that the integrity of dApps is preserved even if only one honest validator is present. This ensures correct results on-chain without depending on the honesty of the majority.

## Programmability

Cartesi bridges the gap between blockchain and traditional software development by incorporating a full-fledged Linux operating system (OS) within an optimistic rollup solution.

You can build decentralized applications by porting compilers, libraries, database systems, frameworks, and traditional software stacks.
