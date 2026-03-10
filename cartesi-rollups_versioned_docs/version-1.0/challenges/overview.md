---
id: overview
title: Current challenges
tags: [build, quickstart, developer, dapps]
---

Cartesi Rollups are shaped by the contributions and collaborative efforts of its decentralized community. As the community continuously works together to build something amazing, there are ongoing challenges that need attention. On this page, you’ll explore these challenges and potential strategies and solutions that the community might consider.

- [Transaction scalability](#transaction-scalability)
- [Disputes](#disputes)
- [Large data as input](#large-data-as-input)
- [Composability](#composability)
- [Convenience layer: Front-end](#convenience-layers)
- [Design for upgradability](#design-for-upgradability)

## Transaction scalability

### Challenge

In contrast to the majority of proposed Layer 2 rollup solutions, which primarily focus on enhancing transaction throughput and minimizing fees (essentially facilitating more transactions at a lower cost), the current **v1.0** release is dedicated to expanding the _computational capacity_ (as opposed to _transaction scalability_ alone) to allow the creation of decentralized applications that were simply not possible to build before.

### Solution strategy

A potential path that can be considered to achieve transaction scalability is the introduction of an _Aggregator_, often associated with a Sequencer. This component might enhance the overall efficiency and capacity of the rollup solution. Moreover, an exciting area for exploration is deploying Cartesi on top of other L2 solutions like Optimism and Arbitrum, potentially expanding the options for enhanced transaction scalability.

## Disputes

### Challenge

The **1.0** release lacks support for dispute resolution.

### Solution strategy

From its inception, the Cartesi framework has the potential to integrate dispute resolution features. Cartesi's community-driven iterations have leveraged dispute resolution for [Compute](/compute/overview), which may be interesting to investigate further after other features and improvements, like the Microarchitecture enhancement and recent research on NxN dispute resolution, have been fully addressed.

## Large data as input

### Challenge

The current Rollups framework does not support very large data inputs (e.g., from IPFS), limiting dApps based on Cartesi Rollups to rely solely on on-chain data.

### Solution strategy

A promising research area is enhancing Cartesi Rollups' data capabilities. Potential advancements in the Ethereum ecosystem, like [EIP-4844](https://www.eip4844.com/) (proto-danksharding), might make on-chain data more affordable. Moreover, layering Cartesi on top of other rollup solutions can offer data advantages.

Another feature for community consideration could be a mechanism assisting front-end clients in dividing large pieces of data into smaller chunks and reassembling them within the back-end. This approach would be similar to the [Logger](/compute/logger_drive/) feature used in Cartesi Compute.

Additionally, potential future exploration might focus on integrating Rollups with Data Availability solutions like zkPorter or using a Data Availability Committee solution for quorum-based validator sets.

## Composability

### Challenge

The current **v1.0** release still faces a lot of hurdles with composability, which is the ability of multiple dApps to directly interact with each other, for example by having one application directly send inputs to another one without going through the base layer. This would enable seamless communication and data exchange between dApps. The most important use case for this feature would be to allow users to easily and cheaply transfer assets from one dApp to another.

### Solution strategy

Post the **v1.0** mainnet release, a potential path to consider could be research into addressing composability, vital for enhancing dApp functionality. Meanwhile, interim solutions like leveraging liquidity providers for asset transfers might be considered, enhancing the user experience while juggling development priorities.

## Convenience layers

### Challenge

The current **0.9** release features an HTTP API, which, while providing a solid and universal foundation for Cartesi Rollups solution, may be a bit inconvenient to use both in the front-end and back-end. This was a deliberate strategy, as the Cartesi community wanted to start releasing a product with a robust foundation. More convenient solutions would inevitably be more opinionated and geared towards specific languages or frameworks. As a result, early adopters may face a steeper learning curve to get started. However, the community recognises the importance of convenience in SDK usage, which often involves multiple layers, each designed to simplify and streamline the process further.

### Solution strategy

Following community-built applications, it's clear that "higher-level development frameworks" might greatly benefit usability. The community could explore the development of these frameworks, allowing developers to abstract away several concepts, benefit from code completion, reuse standard code such as wallet implementations, and much more. Engaging the community in these areas could lead to some innovative solutions.

## Design for upgradability

### Challenge

The current **v0.9** release incorporates mechanisms that account for the evolution of Cartesi Rollups and the dApps built on it, including the ability to modify smart contract behaviors related to validator operations, dispute strategies, and other aspects.
The previous use of the diamonds design pattern has been replaced, allowing for a simpler approach to upgrade and modify smart contracts. This simplification enables developers to "point" specific functions of the Rollups framework to a new smart contract, which can implement the desired behavior differently. For example, to upgrade the consensus mechanism from "Authority" to "Quorum", developers can call the [migrateToConsensus](../api/json-rpc/sol-output.md/#migratetoconsensus) function and pass the address of the smart contract that implements the Quorum behavior. While this new approach is intended to make the process more convenient for developers, it is clear that there might still be room for improvement to further streamline the experience for day-to-day developers and the general audience.
In particular, upgrading the back-end code of a dApp is an important concern that may arise due to the discovery of a bug in the application itself or the software stack that it utilizes. This requires the dApp's Cartesi Machine to be safely updated, for which there is currently no standard mechanism or guideline. As a reminder, individual dApps can of course always choose to simply not be upgradable at all.

### Solution strategy

Following the **v1.0** mainnet release, an interesting area for research could be to explore methods for supporting an upgrade procedure for dApps that are inclined to allow it. A key concern in this research domain is finding a way, or a set of best practices, to securely handle asset ownership continuity – for instance, how to transfer assets safely from an older version of an application to its newer incarnation. Given that an updated dApp would entail utilizing a different Cartesi Machine, a possible challenge is to devise a robust method to migrate the previous machine's state, inclusive of user assets, into this new framework. For example, ensuring that the dApp's asset ownership remains the same after an update.

To address such challenges, some in the community are already testing the waters by trying to segregate the application's backend state from the rest of the machine. This proposed methodology would enable the Cartesi Machine to function akin to a "lambda" function. A stateless template in this scenario would always accept the present application state and a fresh input to process. The result of this would be a new application state and potentially relevant outputs like vouchers. If disputes arise, the focus would shift towards reaching a consensus on this isolated application state, rather than the machine's full state.

By adopting such a strategy, the isolated state, maintained separately from the original machine, could potentially be incorporated into an upgraded machine more effortlessly.
