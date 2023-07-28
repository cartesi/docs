---
id: overview
title: Current challenges
tags: [build, quickstart, developer, dapps]
---

Cartesi Rollups are a constantly evolving solution, shaped by the collaborative efforts of the contributors and community. As the community continuously works together to build something amazing, there are ongoing challenges that need attention. On this page, you’ll discover a compilation of these challenges, along with the strategies and solutions that can be developed to address them.

- [Transaction scalability](#transaction-scalability)
- [Disputes](#disputes)
- [Large data as input](#large-data-as-input)
- [Composability](#composability)
- [Convenience layer: Front-end](#convenience-layer-front-end)
- [Design for upgradability](#design-for-upgradability)

## Transaction scalability

### Challenge

In contrast to the majority of proposed Layer 2 rollup solutions, which primarily focus on enhancing transaction throughput and minimizing fees (essentially facilitating more transactions at a lower cost), the current **v0.9** release is dedicated to expanding the *computational capacity* (as opposed to *transaction scalability* alone) to allow the creation of decentralized applications that were simply not possible to build before.

### Solution strategy

Achieving transaction scalability is directly related to the implementation of an *Aggregator*, which is often associated with a Sequencer. This key component will streamline the process, enhancing the overall efficiency and capacity of the rollup solution. It is worth noting that users can already easily benefit from transaction scalability by deploying Cartesi as a Layer-3 solution, on top of another Layer-2 solution that provides that. Cartesi officially supports deployment on top of Optimism and Arbitrum, further expanding the options for users seeking enhanced transaction scalability.

## Disputes

### Challenge

The **0.9** release lacks support for dispute resolution.

### Solution strategy

Cartesi framework has been strategically planned for the development of dispute resolution features from the beginning. Cartesi successfully uses dispute resolution for [Compute](/compute/overview), and it was deliberately left out of the initial releases to streamline the complexity. Furthermore, the community wanted to incorporate it after making other improvements and research, such as the Microarchitecture enhancement (completed) and the more recent [research on NxN dispute resolution](https://arxiv.org/abs/2212.12439).

## Large data as input

### Challenge

The current Rollups framework does not support very large data inputs (e.g., from IPFS), limiting DApps based on Cartesi Rollups to rely solely on on-chain data.

### Solution strategy

There is an ongoing research into expanding the Cartesi Rollups' capabilities, taking into account recent improvements and potential new features. First of all, users can already expect benefits from advancements in the Ethereum ecosystem, such as [EIP-4844](https://www.eip4844.com/) (proto-danksharding), which makes on-chain data more affordable. Additionally, users can deploy Cartesi as a Layer-3 solution on top of other Layer-2 rollup solutions to enjoy the benefits of cheaper data.

Another useful feature being considered is a convenience layer to help front-end clients divide large pieces of data into smaller chunks and reassemble them within the back-end. This approach would be similar to the [Logger](/compute/logger_drive/) feature used in Cartesi Compute.

Lastly, other possible solutions are being explored for the future, including integrating Rollups with external Data Availability solutions such as zkPorter and implementing a Data Availability Committee solution for quorum-based validator sets.

## Composability

### Challenge

The current **v0.9** release lacks composability, which is the ability of multiple DApps to directly interact with each other, for example by having one application directly send inputs to another one without going through the base layer. This would enable seamless communication and data exchange between DApps. The most important use case for this feature would be to allow users to easily and cheaply transfer assets from one DApp to another. 

### Solution strategy

After the initial **v1.0** mainnet release, it is advised to direct attention towards a variety of development aspects, one of which includes planning research to address the composability issue. It is very important to consider composability for expanding the functionality and interoperability of DApps within the Cartesi Rollups ecosystem. In the meantime, solutions for specific use cases should be considered as well, such as utilizing liquidity providers for rapidly transferring fungible assets between applications. This approach allows Cartsi to improve the user experience and promote the growth of the DApps network while continuing to work on all the development priorities.

## Convenience layers

### Challenge

The current **0.9** release features an HTTP API, which, while providing a solid and universal foundation for Cartesi rollups solution, may be a bit inconvenient to use both in the front-end and back-end. This was a deliberate strategy, as the Cartesi community wanted to start releasing a product with a robust foundation. More convenient solutions would inevitably be more opinionated and geared towards specific languages or frameworks. As a result, early adopters may face a steeper learning curve to get started. However, the community recognises the importance of convenience in SDK usage, which often involves multiple layers, each designed to simplify and streamline the process further.

### Solution strategy

After developing a few example applications, it is clear that "higher-level development frameworks" are essential for improving usability and developer experience. These frameworks will be opinionated convenience layers, both in the front-end and in the back-end, that will allow developers to abstract away several concepts, benefit from code completion, reuse standard code such as wallet implementations, and much more. Several of these frameworks are expected to be implemented in the near future, in collaboration with the community.

## Design for upgradability

### Challenge

The current **v0.9** release incorporates mechanisms that account for the evolution of Cartesi Rollups and the DApps built on it, including the ability to modify smart contract behaviors related to validator operations, dispute strategies, and other aspects.
The previous use of the diamonds design pattern has been replaced, allowing for a simpler approach to upgrade and modify smart contracts. This simplification enables developers to "point" specific functions of the Rollups framework to a new smart contract, which can implement the desired behavior differently. For example, to upgrade the consensus mechanism from "Authority" to "Quorum", developers can call the [migrateToConsensus](../api/json-rpc/sol-output.md/#migratetoconsensus) function and pass the address of the smart contract that implements the Quorum behavior. While this new approach is intended to make the process more convenient for developers, it is clear that there might still be room for improvement to further streamline the experience for day-to-day developers and the general audience.
In particular, upgrading the back-end code of a DApp is an important concern that may arise due to the discovery of a bug in the application itself or the software stack that it utilizes. This requires the DApp's Cartesi Machine to be safely updated, for which there is currently no standard mechanism or guideline. As a reminder, individual DApps can of course always choose to simply not be upgradable at all.

### Solution strategy

After the initial **v1.0** mainnet release, research is planned to start on the topic of supporting an upgrade procedure for DApps that wish to allow it (which of course should involve an acceptable governance model to trigger it). One of the main concerns here is to provide a streamlined or standardized procedure to safely handle asset ownership integrity (e.g., safely transfer assets from the previous version of the application to the new one). Since a new DApp version necessarily implies a different Cartesi Machine, there needs to be a safe and sound procedure to load the previous machine's state (including user assets) into the new one.
In order to tackle this challenge, the community has already begun experimenting with keeping the application's back-end state separate from the remainder of the machine. With this approach, the Cartesi Machine can act as a "lambda" function, whereas a stateless template always takes as parameters the current application state and a new input to process, producing as results the new application state and any relevant outputs such as vouchers. Any disputes, should they arise, would now focus on reaching consensus around the isolated application state, as opposed to the entire machine state.
With an approach like this, the isolated state, kept separated from the original machine, could easily be reused with a new upgraded machine.
