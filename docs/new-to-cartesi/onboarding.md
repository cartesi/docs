---
id: onboarding
title: Choose your Onboarding Path
tags: [blockchain os, quickstart, beginner, low-level developer, developer, researcher, learn, build]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Our onboarding paths answer the following questions:

1. What can the Blockchain OS do for you as a new blockchain user?
2. What can the Blockchain OS do for you as a developer?
3. What can the Blockchain OS do for you as a researcher/low-level developer?


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
This section of documentation targets new blockchain users who want to learn more about blockchain technology, DApps, and Rollups.
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
This section targets developers who want to start building DApps.
:::

As a developer, you can use all the programming languages, tools, libraries, software, and services you are already familiar with. By moving most of the complex logic of their DApps to portable off-chain components, developers are freed from the limitations and idiosyncrasies imposed by blockchains. In this way, Cartesi empowers developers to select the best run-time environment in which to host each part of their DApps.

### Quick start to run your first DApp

The fastest way of getting started is by [Running a Simple DApp](../build-dapps/run-dapp.md) that we already built using Python.

:::tip
Check the section [**Cartesi Rollups**](../cartesi-rollups/overview.md) to learn theoretical concepts such as DApp architecture, available APIs, and how Cartesi's off-chain and on-chain components work under the hood.
:::

* Navigate to [Build DApps](../build-dapps/overview.md) section for more guides:
  * [Technical Prerequisites](../build-dapps/requirements.md)
  * [Steps to create a DApp](../build-dapps/create-dapp.md)

* Check [more examples on GitHub](https://github.com/cartesi/rollups-examples#examples) such as:
  * [Echo Python DApp](https://github.com/cartesi/rollups-examples/blob/main/echo-python)
  * [Echo C++ DApp](https://github.com/cartesi/rollups-examples/blob/main/echo-cpp)
  * [Echo Rust DApp](https://github.com/cartesi/rollups-examples/blob/main/echo-rust)
  * [Echo Lua DApp](https://github.com/cartesi/rollups-examples/blob/main/echo-lua)
  * [Echo JS DApp](https://github.com/cartesi/rollups-examples/blob/main/echo-js)
  * [Echo Low-Level](https://github.com/cartesi/rollups-examples/blob/main/echo-low-level)
  * [Converter DApp](https://github.com/cartesi/rollups-examples/blob/main/converter)
  * [Calculator DApp](https://github.com/cartesi/rollups-examples/blob/main/calculator)
  * [SQLite DApp](https://github.com/cartesi/rollups-examples/blob/main/sqlite)
  * [k-NN DApp](https://github.com/cartesi/rollups-examples/blob/main/knn)
  * [m2cgen DApp](https://github.com/cartesi/rollups-examples/blob/main/m2cgen)
  * [ERC-20 DApp](https://github.com/cartesi/rollups-examples/blob/main/erc20)
  * [Auction DApp](https://github.com/cartesi/rollups-examples/blob/main/auction)

### Run your DApp off-chain using Cartesi Compute SDK

You can use the [Cartesi Compute SDK](../compute.md) to leverage Cartesi to run one-off complex computations that could never be executed inside a normal smart contract. Instead, those computations are executed off-chain with automatic dispute resolution guarantees, and its results can later be used on-chain.

Navigate to [Cartesi Compute Tutorials](../compute.md#cartesi-compute-tutorials) section for more examples:
* [HelloWorld](../compute.md#hello-world-dapp)
* [Calculator](../compute.md#calculator-dapp)
* [Dogecoin Hash](../compute.md#dogecoin-hash-dapp)
* [Generic Script](../compute.md#generic-script-dapp)
* [GPG Verify](../compute.md#gpg-verify-dapp)

</TabItem>
<TabItem value="researcher">

:::note
This section targets researchers and low-level programmers who want to dive into our core technology.
:::

You can dive deeper into the Blockchain OS core technology by reading the section about [The Cartesi Machine](../machine/intro.md), which is a virtual machine that allows for verifiable computing using a Linux operating system.
</TabItem>
</Tabs>
<br/>
