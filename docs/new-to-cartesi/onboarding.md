---
id: onboarding
title: Choose your Onboarding Path
tags:
  [
    quickstart,
    beginner,
    low-level developer,
    developer,
    researcher,
    learn,
    build,
  ]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Our onboarding paths answer the following questions:

1. What can Cartesi do for you as a new blockchain user?
2. What can Cartesi do for you as a developer?
3. What can Cartesi do for you as a researcher/low-level developer?

<Tabs
defaultValue="developer"
values={[
{ label: 'Beginner', value: 'beginner', },
{ label: 'Developer', value: 'developer', },
{ label: 'Researcher & Low-level developer', value: 'researcher', },
]
}>
<TabItem value="beginner">

:::note
This section of documentation targets new blockchain users who want to learn more about blockchain technology, dApps, and Rollups.
:::

You can start by watching our Blockchain Course (available on Youtube):

1. [Smart Contracts With Ethereum & Solidity](https://www.youtube.com/watch?v=8kEBwJt2YLM)
2. [How Does Ethereum Work?](https://www.youtube.com/watch?v=EsjfV_9qY6g)
3. [Introduction To Solidity](https://www.youtube.com/watch?v=zwC2FQcSpK4)
4. [Solidity NFT Auction](https://www.youtube.com/watch?v=t_vTQEQVCkQ)
5. [Blockchain Limitations](https://www.youtube.com/watch?v=yZO5Mnr7hl8)
6. [Ethereum Scaling Solutions ](https://www.youtube.com/watch?v=REj6fj7AxbI)

:::tip
Read the article about [Scalability](../new-to-cartesi/scalability.md) to learn more about solving the scalability issue in a blockchain system.
:::

</TabItem>
<TabItem value="developer">

:::note
This section targets developers who want to start building dApps.
:::

As a developer, you can use all the programming languages, tools, libraries, software, and services you are already familiar with. By moving most of the complex logic of their dApps to portable off-chain components, developers are freed from the limitations and idiosyncrasies imposed by blockchains. In this way, Cartesi empowers developers to select the best run-time environment in which to host each part of their dApps.

<h3> Quick start to run your first dApp </h3>

The fastest way of getting started is by [Running a Simple dApp](/cartesi-rollups/build-dapps/run-dapp) that we already built using Python.

:::tip
Check the section [**Cartesi Rollups**](/cartesi-rollups/overview) to learn theoretical concepts such as dApp architecture, available APIs, and how Cartesi's off-chain and on-chain components work under the hood.
:::

- Navigate to [Build dApps](/cartesi-rollups/build-dapps/overview) section for more guides:

  - [Technical Prerequisites](/cartesi-rollups/build-dapps/requirements)
  - [Steps to create a dApp](/cartesi-rollups/build-dapps/create-dapp)

- Check [more examples on GitHub](https://github.com/cartesi/rollups-examples#examples) such as:
  - [Echo Python dApp](https://github.com/cartesi/rollups-examples/blob/main/echo-python)
  - [Echo C++ dApp](https://github.com/cartesi/rollups-examples/blob/main/echo-cpp)
  - [Echo Rust dApp](https://github.com/cartesi/rollups-examples/blob/main/echo-rust)
  - [Echo Lua dApp](https://github.com/cartesi/rollups-examples/blob/main/echo-lua)
  - [Echo JS dApp](https://github.com/cartesi/rollups-examples/blob/main/echo-js)
  - [Echo Low-Level](https://github.com/cartesi/rollups-examples/blob/main/echo-low-level)
  - [Converter dApp](https://github.com/cartesi/rollups-examples/blob/main/converter)
  - [Calculator dApp](https://github.com/cartesi/rollups-examples/blob/main/calculator)
  - [SQLite dApp](https://github.com/cartesi/rollups-examples/blob/main/sqlite)
  - [k-NN dApp](https://github.com/cartesi/rollups-examples/blob/main/knn)
  - [m2cgen dApp](https://github.com/cartesi/rollups-examples/blob/main/m2cgen)
  - [ERC-20 dApp](https://github.com/cartesi/rollups-examples/blob/main/erc20)
  - [Auction dApp](https://github.com/cartesi/rollups-examples/blob/main/auction)

</TabItem>
<TabItem value="researcher">

:::note
This section targets researchers and low-level programmers who want to dive into our core technology.
:::

<h3> Cartesi Machine </h3>

You can dive deeper into Cartesi's core technology by reading the section about [the Cartesi Machine](/machine/intro.md), which is a **virtual machine** that allows for verifiable computing using a Linux operating system.

<h3> Cartesi Compute SDK to run a dApp off-chain </h3>

You can use the [Cartesi Compute SDK](/compute/overview) to leverage Cartesi to run one-off complex computations that could never be executed inside a normal smart contract. Instead, those computations are executed off-chain with automatic dispute resolution guarantees, and its results can later be used on-chain.

Navigate to [Cartesi Compute Tutorials](/compute/tutorials/) section for more examples:

- [HelloWorld](/compute/tutorials/helloworld)
- [Calculator](/compute/tutorials/calculator)
- [Generic Script](/compute/tutorials/generic-script)
- [GPG Verify](/compute/tutorials/gpg-verify)
- [Dogecoin Hash](/compute/tutorials/dogecoin-hash)

</TabItem>
</Tabs>
<br/>
