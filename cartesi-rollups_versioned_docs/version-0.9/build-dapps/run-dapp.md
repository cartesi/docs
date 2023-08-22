---
id: run-dapp
title: Quick Start
tags: [build, quickstart, dapps, developer]
---

This article explains how to build and interact with a minimalistic [Cartesi Rollups](../overview.md) application.

By the end of this tutorial, you will learn how to run a simple existing DApp written in *Python*, called **Echo-Python**.

:::note
You can inspect the [full code of the Echo Python DApp](https://github.com/cartesi/rollups-examples/blob/main/echo-python/echo.py) in Cartesi's public Github repository.
:::

## Overview

The Echo-Python DApp simply copies (or "echoes") each input received as a corresponding output [notice](../components.md#notices). The DApp's back-end is written in *Python*, and its front-end is a [simple console application](https://github.com/cartesi/rollups-examples/tree/main/frontend-console) written in *Typescript* that can be executed from a terminal.

The **Quick Start** guide consists of 5 main steps:
1. [Installing](#installing)
2. [Building](#building)
3. [Running](#running)
4. [Interacting](#interacting-with-the-dapp)
5. [Deploying](./deploying-dapps.md)

## Installing

:::note
You can use online development environments such as [Gitpod](https://gitpod.io/) and [CodeSandbox](https://codesandbox.io) to open the [rollups-examples](https://github.com/cartesi/rollups-examples) directly in your browser with all [required dependencies](./requirements.md) already installed. These services allow you to start experimenting immediately, but keep in mind that they are provided by third-parties and are subject to unavailability and policy changes. They may also require access to your GitHub account in order to work properly.
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
6. [Start Building our Echo DApp](#building)

### Using manual setup

Follow the [manual setup](./requirements.md) to  make sure you have installed all the necessary requirements locally.

## Building

To build the `echo-python` example:
:::tip
If you are running your environment using the [Gitpod option explained above](#using-gitpod), then please start from **step number 2** as you will not need to clone the Github repository.
:::

1. Clone the [cartesi/rollups-examples](https://github.com/cartesi/rollups-examples) Github repository, and `cd` into it:
```shell
git clone https://github.com/cartesi/rollups-examples.git
cd rollups-examples
```
2. Navigate to the DApp example directory by running the following command:
```shell
cd echo-python
```
3. Build the Echo DApp:
```shell
docker buildx bake --load
```

## Running

To run the application, you can start an environment that includes a local blockchain with the Cartesi smart contracts deployed, as well as a Cartesi layer-2 node executing the DApp's back-end logic:

```shell
docker compose -f ../docker-compose.yml -f ./docker-compose.override.yml up
```

After you see the expected logs below, you can go to the [Interacting Step](#interacting-locally-with-the-dapp).

### Expected logs

Allow some time for the infrastructure to be ready. How much will depend on your system, but eventually the container logs will only show the continuous production of empty blocks in the local blockchain, as displayed below:

```shell
rollups-examples-hardhat-1                      | Mined empty block range #32 to #33
rollups-examples-hardhat-1                      | Mined empty block range #32 to #34
rollups-examples-hardhat-1                      | Mined empty block range #32 to #35
rollups-examples-hardhat-1                      | Mined empty block range #32 to #36
```

### How to shutdown the environment

You can shutdown the environment by running:

```shell
docker-compose -f ../docker-compose.yml -f ./docker-compose.override.yml down -v
```

## Interacting with the DApp


### Interacting locally with the DApp

With the infrastructure in place, you can use our [frontend-console application](https://github.com/cartesi/rollups-examples/tree/main/frontend-console) to interact with the Echo DApp by following the steps:

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
4. Send an input to the current locally deployed DApp:

```shell
yarn start input send --payload "Hello, Cartesi."
```

5. Verify the outputs (notices) generated by your input:

```shell
yarn start notice list
```

After completing all the steps above, you should get a response with the payload of the notice:

`"Hello, Cartesi."`

:::tip
You can run the Cartesi Rollups environment locally in [host mode](./overview.md#host-mode). Please follow the guide on [how to run DApp back-ends in Host Mode](./dapp-host-mode.md), but before that make sure to [shutdown the current running environment](#how-to-shutdown-the-environment).
:::

:::note
For more information about the `frontend-console` application and its options, please check the [frontend-console documentation](https://github.com/cartesi/rollups-examples/tree/main/frontend-console/README.md).
:::


### Explore our DApps

You can find several Cartesi DApp [examples on GitHub](https://github.com/cartesi/rollups-examples#examples).