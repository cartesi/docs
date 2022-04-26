---
id: overview
title: The Blockchain OS
---

**Cartesi**, The Blockchain OS, is a layer-2 platform for the development and deployment of scalable decentralized applications. The **Blockchain OS** offers a Linux operating system coupled with a blockchain infrastructure, which allows DApps to be developed in familiar programming languages like Python without the need to write Solidity code.

As a developer, you can use all the programming languages, tools, libraries, software, and services you are already familiar with. By moving most of the complex logic of their DApps to portable off-chain components, developers are freed from the limitations and idiosyncrasies imposed by blockchains. In this way, Cartesi empowers developers to select the best run-time environment in which to host each part of their DApps.

## Run a DApp using The Blockchain OS

The Blockchain OS consists of:
* [**The Cartesi Machine**](../machine/overview): the core technology, a virtual machine that allows for verifiable computing using a Linux operating system
* [**Cartesi Rollups**](../cartesi-rollups/overview): a full solution for scaling blockchains that uses the Cartesi Machine within an Optimistic Rollups framework

You can [**run a simple DApp**](../build-dapps/run-dapp) that we already built using Python.

Cartesi also offers [**Descartes**](../descartes/overview), our computational oracle solution.

## Limitations, develop with The Blockchain OS!

Other blockchain platforms do not allow you to develop a DApp that uses a file-system, an SQL database or a machine learning model. Generally there are also harsh limitations related to gas limits and high fees when performing computations such as looping over arrays and manipulating strings, which are commonplace in regular mainstream applications.

Today there is a large number of developers and companies who want to enter the blockchain world but face a steep learning curve and a confusing landscape. Cartesi solves this with The Blockchain OS, so that you can develop a DApp using any traditional software stack.

Here comes the mission of Cartesi:

* To offer a full operating system for blockchain applications.
* To solve the [scalability problem](../new-to-cartesi/scalability) using Optimistic Rollups along with the Cartesi Machine to support complex computations.
* To develop DApps of arbitrary complexity using mainstream development tools and software stacks, and have all of it sit on top of established blockchain networks such as Ethereum, Polygon, Avalanche and BNB Smart Chain.

Cartesi, The Blockchain OS provides lower gas and crypto costs. Additionally, if you are a web developer and you want to build a simple application as your first step in blockchain development, with Cartesi you will not be forced to use a specific language, such as Solidity for Ethereum, nor be forced to reinvent the wheel because a given functionality or math library is not available.

## How are Cartesi Rollups different?

Most current general-purpose rollups layer 2 solutions, such as [those based on Optimistic Rollups](https://ethereum.org/en/developers/docs/scaling/optimistic-rollups/#use-optimistic-rollups), strive to be EVM-compatible because they are focusing on providing lower transaction costs and higher throughputs for the smart contracts that already run on Ethereum. However, Cartesi focuses on providing a true operating system for blockchain developers, allowing them for the first time to leverage decades of software development from the mainstream industry. With that goal in mind, [Cartesi Rollups](../cartesi-rollups/overview) not only solves the scalability problem by using an Optimistic Rollups framework, but also takes advantage of the [Cartesi Machine Emulator](../machine/overview) to boost productivity and application complexity by allowing developers to code their smart contracts using any software stack that is already available for Linux.

You can think of Cartesi Rollups as a special operating system that makes your life easier, allowing you to create computationally heavy DApps while providing you with the freedom to choose the programming languages, libraries and tools of your preference. At Cartesi, we believe that this freedom will help start a new era for blockchain application development.

## See Also

* [Why Cartesi Rollups is Unique](https://medium.com/cartesi/scalable-smart-contracts-on-ethereum-built-with-mainstream-software-stacks-8ad6f8f17997)
* [Rollups On-Chain](https://medium.com/cartesi/rollups-on-chain-d749744a9cb3)
* [Cartesi Node](https://medium.com/cartesi/rollups-cartesi-node-3000b3ffec74)
* [Testnet](https://medium.com/cartesi/cartesi-rollups-rollout-testnet-40c90d10c2f1)
* [Transaction Manager](https://medium.com/cartesi/cartesi-rollups-rollout-transaction-manager-4a49af15d6b9)
* [State Fold](https://medium.com/cartesi/state-fold-cfe5f4d79639)
