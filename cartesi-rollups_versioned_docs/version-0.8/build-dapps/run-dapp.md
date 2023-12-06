---
id: run-dapp
title: Quick Start
tags: [build, quickstart, dapps, developer]
---

This article explains how to build and interact with a minimalistic [Cartesi Rollups](../overview.md) application.

By the end of this tutorial, you will learn how to run a simple existing dApp written in _Python_, called **Echo-Python**.

:::note
You can inspect the [full code of the Echo Python dApp](https://github.com/cartesi/rollups-examples/blob/main/echo-python/echo.py) in Cartesi's public Github repository.
:::

## Overview

The Echo-Python dApp simply copies (or "echoes") each input received as a corresponding output [notice](../components.md#notices). The dApp's back-end is written in _Python_, and its front-end is a [simple console application](https://github.com/cartesi/rollups-examples/tree/main/frontend-console) written in _Typescript_ that can be executed from a terminal.

The **Quick Start** guide consists of 5 main steps:

1. [Installing](#installing)
2. [Building](#building)
3. [Running](#running)
4. [Interacting](#interacting-with-the-dapp)
5. [Deploying](./deploying-dapps.md)

## Installing

:::note
You can use online development environments such as [Gitpod](https://gitpod.io/) and [CodeSandbox](https://codesandbox.io) to open the [rollups-exmaples](https://github.com/cartesi/rollups-examples) directly in your browser with all [required dependencies](./requirements.md) already installed. These services allow you to start experimenting immediately, but keep in mind that they are provided by third-parties and are subject to unavailability and policy changes. They may also require access to your GitHub account in order to work properly.
:::

There are two different options to setup the prerequisites, you can choose one of the following:

1. [Using Gitpod](#using-gitpod) as a fast option
2. [Using manual setup](#using-manual-setup) to install all the necessary requirements locally

### Using Gitpod

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#/https://github.com/cartesi/rollups-examples/)

This is an easy and fast setup, you need to follow the steps:

1. [Navigate to Gitpod rollups-examples](https://gitpod.io/#/https://github.com/cartesi/rollups-examples/) to automate your development setup
2. When you click on the link above, it will forward you to login options.
3. Login with your preferable option via GitLab, GitHub, or Bitbucket.
4. Provide authorization to GitLab, GitHub, or Bitbucket.
5. Congratulations, you have successfully setup your development environment
6. [Start Building our Echo dApp](#building)

### Using manual setup

Follow the [manual setup](./requirements.md) to make sure you have installed all the necessary requirements locally.

## Building

To build the `echo-python` example:
:::tip
If you are running your environment using the [Gitpod option explained above](#using-gitpod), then please start from **step number 2** as you will not need to clone the Github repository.
:::

1. Clone the [cartesi/rollups-examples](https://github.com/cartesi/rollups-examples) Github repository by running the following command:

```shell
git clone https://github.com/cartesi/rollups-examples.git
```

2. Navigate to the dApp example directory by running the following command:

```shell
cd rollups-examples/echo-python
```

3. Build the Echo dApp by running the following command:

```shell
docker buildx bake --load
```

## Running

To run the application, you can start an environment that includes a local blockchain with the Cartesi smart contracts deployed, as well as a Cartesi L2 node executing the dApp's back-end logic.

This can be done by running the following command:

```shell
docker compose -f ../docker-compose.yml -f ./docker-compose.override.yml up
```

After you see the expected logs below, you can go to the [Interacting Step](#interacting-locally-with-the-dapp).

### Expected logs

Allow some time for the infrastructure to be ready.
How much will depend on your system, but after some time showing the error `"concurrent call in session"`, eventually the container logs will repeatedly show the following:

```shell
server_manager_1      | Received GetVersion
server_manager_1      | Received GetStatus
server_manager_1      |   default_rollups_id
server_manager_1      | Received GetSessionStatus for session default_rollups_id
server_manager_1      |   0
server_manager_1      | Received GetEpochStatus for session default_rollups_id epoch 0
```

### Advancing time

When executing an example, it is possible to advance time to simulate the passing of epochs. To do that, run:

```shell
curl --data '{"id":1337,"jsonrpc":"2.0","method":"evm_increaseTime","params":[864010]}' http://localhost:8545
```

### How to shutdown the environment

You can shutdown the environment by running the following command:

```shell
docker compose -f ../docker-compose.yml -f ./docker-compose.override.yml down -v
```

## Interacting with the dApp

There are two ways to interact with the dApp:

- [Locally](#interacting-locally-with-the-dapp)
- [Remotely](#interacting-with-remotely-deployed-dapps)

### Interacting locally with the dApp

With the infrastructure in place, you can use our [frontend-console application](https://github.com/cartesi/rollups-examples/tree/main/frontend-console) to interact with the Echo dApp by following the steps:

1. Open a separate terminal window
2. From the rollups-examples base directory, navigate to the `frontend-console` one:

```shell
cd frontend-console
```

3. Build the frontend console application:

```shell
yarn
yarn build
```

4. Send an input to the current locally deployed dApp:

```shell
yarn start input send --payload "Hello, Cartesi."
```

5. Verify the outputs (notices) generated by your input, to display your dApp notices run the following command:

```shell
yarn start notice list
```

After completing all the steps above, you should get a response similar to the following:

```
[ { epoch: '0', input: '1', notice: '0', payload: 'Hello, Cartesi.' } ]
```

:::tip
You can run the Cartesi Rollups environment locally in [host mode](./overview.md#host-mode). Please follow the guide on [how to run dApp back-ends in Host Mode](./dapp-host-mode.md), but before that make sure to [shutdown the current running environment](#how-to-shutdown-the-environment).
:::

:::note
For more information about the `frontend-console` application and its options, please check the [frontend-console documentation](https://github.com/cartesi/rollups-examples/tree/main/frontend-console/README.md).
:::

### Interacting with remotely deployed dApps

The **Echo dApp** example is already deployed on a public blockchain test network called [Goerli](https://goerli.net/), which is an Ethereum testnet.

You can use the same [frontend-console application](https://github.com/cartesi/rollups-examples/tree/main/frontend-console) to interact with it, as described below.
:::note
Please refer to the [frontend-console documentation](https://github.com/cartesi/rollups-examples/blob/main/frontend-console/README.md) for details on how to use it to [send inputs](https://github.com/cartesi/rollups-examples/blob/main/frontend-console/README.md#sending-inputs), [list notices](https://github.com/cartesi/rollups-examples/blob/main/frontend-console/README.md#listing-notices-vouchers-and-reports) and [deposit ERC-20 tokens](https://github.com/cartesi/rollups-examples/blob/main/frontend-console/README.md#depositing-erc-20-tokens).
:::

The following steps describe how to send an input to the Echo dApp instance that is already deployed on Goerli:

1. Open a separate terminal window
2. Navigate to the `frontend-console` directory:

```shell
cd frontend-console
```

3. Build the project:

```shell
yarn
yarn build
```

4. You can [follow this tutorial to create an Ethereum account using Metamask](https://myterablock.medium.com/how-to-create-or-import-a-metamask-wallet-a551fc2f5a6b). Make sure to save the Secret Backup Phrase (MNEMONIC user sequence of twelve words)
5. Get testnet funds/tokens on Goerli to be able to submit transactions on that network. There are several faucets available, you may try [https://goerlifaucet.com/](https://goerlifaucet.com/) or [https://goerli-faucet.slock.it/](https://goerli-faucet.slock.it/)
6. Create an [Alchemy account](https://docs.alchemy.com/docs/alchemy-quickstart-guide) to obtain an API key for reliable access to the Goerli network. Alternatively, you can use other options such as [Infura](https://infura.io/) or [Moralis](https://moralis.io/)
7. Configure your account on Goerli by running the commands below, which specify the network and MNEMONIC (Secret Backup Phrase) to use. The MNEMONIC is always specified as a string sequence of twelve words. In this example, use the MNEMONIC that you received when creating the Ethereum account using Metamask as described in step 4.

```shell
export NETWORK=goerli
export MNEMONIC="word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12"
```

8. Configure your [Alchemy](https://www.alchemy.com/) RPC gateway URL for Goerli by running the following command:

```shell
export RPC_URL=https://eth-goerli.alchemyapi.io/v2/<Replace_This_With_Your_Alchemy_API_key>
```

9. Send an input by running the command:

```shell
yarn start input send --payload "my new message" --dapp echo-python
```

10. Query the L2 Cartesi Node for notices produced by the dApp:

```shell
yarn start notice list --url https://echo-python.goerli.rollups.staging.cartesi.io/graphql
```

:::tip
As shown in the last step (number 10), to query the L2 Cartesi Node for dApp outputs, you will need to specify the URL of its GraphQL endpoint. You can find other existing examples endpoints in the [dApp table below](#explore-our-dapps).
:::

### Explore our dApps

You can find several Cartesi dApp [examples on GitHub](https://github.com/cartesi/rollups-examples#examples), such as the following:

| dApp Name                                                                              | dApp Deployment Status on Goerli Testnet | GraphQL endpoint URL                                                                                                                 |
| -------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [Echo Python](https://github.com/cartesi/rollups-examples/blob/main/echo-python)       | Yes                                      | [https://echo-python.goerli.rollups.staging.cartesi.io/graphql](https://echo-python.goerli.rollups.staging.cartesi.io/graphql)       |
| [Echo C++](https://github.com/cartesi/rollups-examples/blob/main/echo-cpp)             | Yes                                      | [https://echo-cpp.goerli.rollups.staging.cartesi.io/graphql](https://echo-cpp.goerli.rollups.staging.cartesi.io/graphql)             |
| [Echo Rust](https://github.com/cartesi/rollups-examples/blob/main/echo-rust)           | No                                       | -                                                                                                                                    |
| [Echo Lua](https://github.com/cartesi/rollups-examples/blob/main/echo-lua)             | Yes                                      | [https://echo-lua.goerli.rollups.staging.cartesi.io/graphql](https://echo-lua.goerli.rollups.staging.cartesi.io/graphql)             |
| [Echo JS dApp](https://github.com/cartesi/rollups-examples/blob/main/echo-js)          | Yes                                      | [https://echo-js.goerli.rollups.staging.cartesi.io/graphql](https://echo-js.goerli.rollups.staging.cartesi.io/graphql)               |
| [Echo Low-Level](https://github.com/cartesi/rollups-examples/blob/main/echo-low-level) | Yes                                      | [https://echo-low-level.goerli.rollups.staging.cartesi.io/graphql](https://echo-low-level.goerli.rollups.staging.cartesi.io/graphql) |
| [Converter](https://github.com/cartesi/rollups-examples/blob/main/converter)           | No                                       | -                                                                                                                                    |
| [Calculator](https://github.com/cartesi/rollups-examples/blob/main/calculator)         | No                                       | \_                                                                                                                                   |
| [SQLite](https://github.com/cartesi/rollups-examples/blob/main/sqlite)                 | Yes                                      | [https://sqlite.goerli.rollups.staging.cartesi.io/graphql](https://sqlite.goerli.rollups.staging.cartesi.io/graphql)                 |
| [k-NN](https://github.com/cartesi/rollups-examples/blob/main/knn)                      | Yes                                      | [https://knn.goerli.rollups.staging.cartesi.io/graphql](https://knn.goerli.rollups.staging.cartesi.io/graphql)                       |
| [m2cgen](https://github.com/cartesi/rollups-examples/blob/main/m2cgen)                 | No                                       | -                                                                                                                                    |
| [ERC-20](https://github.com/cartesi/rollups-examples/blob/main/erc20)                  | No                                       | -                                                                                                                                    |
| [Auction](https://github.com/cartesi/rollups-examples/blob/main/auction)               | No                                       | -                                                                                                                                    |
