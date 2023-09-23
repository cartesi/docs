---
id: run-dapp
title: Quick Start
tags: [build, quickstart, dapps, developer]
---

This article explains how to build and interact with a minimalistic [Cartesi Rollups](../overview.md) application.

By the end of this tutorial, you will learn how to run a simple existing DApp written in *Python*, called **Echo-Python**.

:::warning
This guide is tailored for Ubuntu or similar Linux distributions. Adjustments might be required for other operating systems.
:::


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

Follow the [manual setup](./requirements.md) to  make sure you have installed all the necessary requirements locally.

## Building

1. Clone the [cartesi/rollups-examples](https://github.com/cartesi/rollups-examples) Github repository, and `cd` into it:
```shell
git clone https://github.com/cartesi/rollups-examples.git
cd rollups-examples
```
2. Navigate to the DApp example directory by running the following command:
```shell
cd echo-python
```

3. Check if your Docker supports the RISCV platform by running:

```shell
docker buildx ls
```

If you do not see `linux/riscv64` in the platforms list, install QEMU by running:

```shell
apt install qemu-user-static
```

QEMU is a generic and open source machine emulator and virtualizer that will be used by Docker to emulate RISCV instructions to build a Cartesi Machine for your DApp. 

After installing QEMU, the platform `linux/riscv64` should appear in the platforms list.

4. Build the Echo DApp:
```shell
docker buildx bake --load
```

:::note
If you have PostgreSQL and Redis already installed on your system, you may encounter port conflicts when the Docker containers attempt to start services on ports that are already in use. To resolve these conflicts, edit the ports for Redis and PostgreSQL in the docker-compose.yml file located in the root directory of your DApp.
:::

## Running


To run the application, you can start an environment that includes a local blockchain with the Cartesi smart contracts deployed, as well as a Cartesi layer-2 node executing the DApp's back-end logic. 

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

You can shutdown the environment with `ctrl+c` and then running:

```shell
docker compose -f ../docker-compose.yml -f ./docker-compose.override.yml down -v
```

:::note
Every time you stop the `docker compose ... up` command with `ctrl+c`, you need to run the `docker compose ... down -v`  command to remove the volumes and containers. Ignoring this will preserve outdated information in those volumes, causing unexpected behaviors, such as failure to reset the hardhat localchain.
:::

:::note
Every time you stop the `docker compose ... up` command with `ctrl+c`, you need to run the `docker compose ... down -v`  command to remove the volumes and containers. Ignoring this will preserve outdated information in those volumes, causing unexpected behaviors, such as failure to reset the hardhat localchain.
:::

## Interacting with the DApp

### Frontend-console application

With the infrastructure in place, you can use our [frontend-console application](https://github.com/cartesi/rollups-examples/tree/main/frontend-console) to interact with the Echo DApp.

Every Rollups DApp gets an address on the base layer when it's deployed. The following is needed to send inputs to a DApp:

* Gateway URL to the intended chain
* Cartesi Rollups InputBox contract address
* Appropriate account with sufficient funds for submitting transactions to the network

### Interacting locally with the DApp

The following steps describe how to send an input to the Echo DApp instance that is running locally:

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
