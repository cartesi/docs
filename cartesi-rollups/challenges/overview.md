---
id: overview
title: Current challenges
tags: [build, quickstart, developer, dapps]
---

Cartesi Rollups are an innovative and dynamic product that constantly evolves to meet the needs of our users. As we strive for excellence, we recognize that there may be ongoing challenges that need to be addressed. On this page, you'll find a comprehensive list of these challenges, along with the strategies and solutions we're working on to overcome them.

- [Transaction scalability](#transaction-scalability)
- [Disputes](#disputes)
- [Large data as input](#large-data-as-input)
- [Composability](#composability)
- [Convenience layer: Front-end](#convenience-layer-front-end)
- [Design for upgradability](#design-for-upgradability)

## Transaction scalability

### Challenge

In contrast to the majority of proposed Layer 2 rollup solutions, which primarily focus on enhancing transaction throughput and minimizing fees (essentially facilitating more transactions at a lower cost), our current **0.9** release is dedicated to expanding the computational capacity to allow the creation of decentralized applications that were simply not possible to build before.

### Solution strategy

Achieving transaction scalability is directly related to the implementation of an *Aggregator*, which is often associated with a Sequencer. This key component will streamline the process, enhancing the overall efficiency and capacity of our rollup solution. It is worth noting that users can already easily benefit from transaction scalability by deploying Cartesi as a Layer-3 solution, on top of another Layer-2 solution that provides scalability. Cartesi officially supports deployment on top of Optimism and Arbitrum, further expanding the options for users seeking enhanced transaction scalability.

## Disputes

### Challenge

The initial **0.9** release lacks support for dispute resolution.

### Solution strategy

Our team has strategically planned for the development of dispute resolution features from the beginning. We have successfully built dispute resolution for Compute, and it was deliberately left out of the initial releases to streamline the complexity. Furthermore, we wanted to incorporate it after making other improvements and research, such as the Microarchitecture enhancement (completed) and the more recent research on NxN dispute resolution.

## Large data as input

### Challenge

The current Cartesi Machine does not support very large data inputs (e.g., from IPFS), limiting DApps based on Cartesi Rollups to rely solely on on-chain data.

### Solution strategy

We are currently researching methods to expand the Cartesi Machine's capabilities, taking into account recent improvements and potential new features. First of all, users can already benefit from advancements in the Ethereum ecosystem, such as EIP-4844 (dunksharding), which makes on-chain data more affordable. Additionally, users can deploy Cartesi as a Layer-3 solution on top of other Layer-2 rollup solutions to enjoy the benefits of cheaper data.

Another useful feature we're considering is a convenience layer to help front-end clients divide large pieces of data into smaller chunks and reassemble them within the back-end. This approach would be similar to the *Logger* feature used in Cartesi Compute.

Lastly, we're exploring other possible solutions for the future, including integrating Rollups with external Data Availability solutions such as zkPorter and implementing a Data Availability Committee solution for quorum-based validator sets.

## Composability

### Challenge

The current **0.9** release lacks composability, which is the ability of multiple DApps to directly interact with each other, for example by having one application directly send inputs to another one without going through the base layer. This would enable seamless communication and data exchange between DApps. The most important use case for this feature would be to allow users to easily and cheaply transfer assets from one DApp to another. 

### Solution strategy

After the initial **0.9** release, our attention will be directed towards a variety of development aspects, one of which includes planning research to address the composability issue. We understand the importance of composability for expanding the functionality and interoperability of DApps within the Cartesi Rollups ecosystem. In the meantime, we may consider solutions for specific use cases, such as utilizing liquidity providers for rapidly transferring fungible assets between applications. This approach allows us to improve the user experience and promote the growth of the DApps network while continuing to work on all our development priorities.

## Convenience layer: Front-end

### Challenge

The current **0.9** release features an HTTP API, which, while providing a solid and universal foundation for our rollups solution, may be a bit inconvenient to use both in the front-end and back-end. This was a deliberate strategy, as we wanted to start releasing a product with a robust foundation. More convenient solutions would inevitably be more opinionated and geared towards specific languages or frameworks. As a result, early adopters may face a steeper learning curve to get started. However, we recognize the importance of convenience in SDK usage, which often involves multiple layers, each designed to simplify and streamline the process further. In the future, we plan to address this aspect and enhance the convenience of our API for developers working with our platform.

### Solution strategy

To improve the user experience for developers, we are examining the potential integration of various convenience layers, including a frontend layer that would make it simpler and easier to use the SDK. Our present focus lies in conducting research and exploring potential approaches, without committing to a specific implementation plan at this stage.

## Design for upgradability

### Challenge

The current **0.9** release does not currently account for the evolution of our solution or the DApps built on it. This includes the ability to modify smart contract behaviors related to validator operations, dispute strategies, and other aspects. Additionally, the The current **0.9** release does not consider the possibility of updating the code running inside the Cartesi Machine or establishing a clear governance model to manage upgradability decisions.

### Solution strategy

We are researching methods to address these challenges, which involve incorporating the Diamonds design pattern for smart contract upgradability and exploring options for updating the code inside the Cartesi Machine. Furthermore, we recognize the importance of a robust governance model to guide decisions related to validators, dispute approaches, and other aspects of the platform. At this stage, we are primarily focused on researching these potential solutions.
