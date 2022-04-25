---
title: Descartes SDK Environment
---

:::note Section Goal
- describe easy-to-use environment available for developing Descartes DApps
- download and run the environment
:::

## Overview

As described in detail in the [Descartes SDK section](../../descartes/overview/), a Descartes DApp requires that a certain set of components and resources be available in order to effectively run. There are numerous alternative [topologies](../../descartes/topologies/) in which this architecture can be deployed depending on the users' interests and resources. Moreover, the DApp can also choose from a range of [supported blockchain networks](../../descartes/supported-networks/) on which the Descartes smart contracts are deployed and available.

However, for the purposes of these tutorials (and general rapid Descartes DApp prototyping), the Cartesi team has provided a ready-to-use *Descartes SDK Environment* with all the on-chain and off-chain components necessary to build a Descartes DApp out-of-the-box. This environment is configured for a scenario with two actors, denominated `alice` and `bob`, who will respectively perform the roles of *claimer* and *challenger* for all Descartes computations.

## Components

The Descartes SDK Environment basically consists of a *Docker Compose* specification that spins up services corresponding to the components described below.

### Local Descartes-enabled blockchain

The environment starts up a local blockchain network using [Hardhat](https://hardhat.org/), which is accessible on port `8545`. This network instance comes pre-installed with a number of user accounts, the first two of which we will use for `alice` and `bob`, with addresses respectively at `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` and `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`.

Moreover, the network is instantiated with all the Descartes smart contracts already deployed. As such, these smart contracts are readily available for our tutorial DApps to use.

### Descartes nodes

For each of the two actors, `alice` and `bob`, the environment provides a corresponding off-chain *Descartes node*, which is responsible for carrying out computations on their behalf. In practice, each node is composed of a number of internal services, but DApp developers can safely abstract away these details completely.


## Download and run

The Descartes SDK Environment is available on the [Descartes Tutorials GitHub repo](https://github.com/cartesi/descartes-tutorials/).

You can download and extract a ready-to-use artifact by executing:

```bash
wget https://github.com/cartesi/descartes-tutorials/releases/download/v1.1.0/descartes-env-1.1.0.tar.gz
tar -xzvf descartes-env-1.1.0.tar.gz
```

Then, start it up by running:

```bash
cd descartes-env
docker-compose up
```

This will print the logs of all services in your current terminal. As such, you will normally need to open up a separate terminal in order to follow the next sections of this tutorial.

Alternatively, you may run the above `docker-compose` command in detached mode by adding the `-d` switch. In this case, it can be useful to list the currently instantiated services by executing the `docker ps` command, and then check the output printed by each service by running `docker logs <service>`. Please refer to the [Docker documentation](https://docs.docker.com/) for a complete overview on how to use Docker and Docker Compose.
