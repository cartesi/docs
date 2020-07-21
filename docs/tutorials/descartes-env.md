---
title: Descartes SDK Environment
---

:::note Section Goal
- describe easy-to-use environment available for developing Descartes DApp
- download and run the environment
:::

## Overview

As described in detail in the [Descartes SDK section](../../descartes/introduction/), a Descartes DApp requires that a certain set of components and resources be available in order to effectively run. Moreover, there are numerous alternative [topologies](../../descartes/topologies/) in which this architecture can be deployed depending on the users' interests and resources.

However, for the purposes of these tutorials (and general rapid Descartes DApp prototyping), the Cartesi team has provided a ready-to-use *Descartes SDK Environment* with all the on-chain and off-chain components necessary to build a Descartes DApp out-of-the-box. This environment is configured for a scenario with two actors, denominated `alice` and `bob`, who will respectively perform the roles of *claimer* and *challenger* for all Descartes computations.

## Components

The Descartes SDK Environment basically consists of a *Docker Compose* specification that spins up services corresponding to the components described below.

### Local Descartes-enabled blockchain

The environment starts up a local blockchain network using [Ganache CLI](https://github.com/trufflesuite/ganache-cli), which is accessible on port `8545`. This network instance comes pre-installed with exactly two accounts, one for `alice` and one for `bob`, with addresses respectively at `0xe9bE0C14D35c5fA61B8c0B34f4c4e2891eC12e7E` and `0x91472CCE70B1080FdD969D41151F2763a4A22717`.

Moreover, the network is instantiated with all the Descartes smart contracts already deployed. As such, these smart contracts are readily available for our tutorial DApps to use.

### Descartes nodes

For each of the two actors, `alice` and `bob`, the environment provides a corresponding off-chain *Descartes node*, which is responsible for carrying out computations on their behalf. In practice, each node is composed of a number of internal services, but DApp developers can safely abstract away these details completely.


## Download and run

The Descartes SDK Environment is available on [Cartesi's Github repo](https://github.com/cartesi/descartes-tutorials/).

You can download and extract a ready-to-use artifact by executing:

```bash
wget https://github.com/cartesi/descartes-tutorials/releases/download/v0.1.1/descartes-env-0.1.1.tar.gz
tar -xzvf descartes-env-0.1.1.tar.gz
```

Then, start it up by running:

```bash
cd descartes-env
docker-compose up
```
