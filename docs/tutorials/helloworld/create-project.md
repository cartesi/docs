---
title: Creating basic DApp
---

:::note Section Goal
- create and initialize a basic project for a Descartes DApp
:::

## Introduction

In this section we are going to start building our first Descartes DApp. This *Hello World DApp* will consist of a trivial application, which simply instantiates an off-chain computation that always returns "Hello World!".

In order to do that, we will start by creating a basic project with a smart contract capable of using the Descartes contract already deployed to the [Descartes SDK Environment](../../descartes-env/).


## Initializing the DApp project

First of all, create a directory called `helloworld` and `cd` into it

```
mkdir helloworld
cd helloworld
```

Then,  run the following command to initialize a new project using Truffle:

```bash
truffle init
```

This will create a basic project structure, with three subdirectories `contracts`, `migrations` and `test`, along with a `truffle-config.js` file.

At this point, we should have the following directory structure:

```
│
└───descartes-env
│   │   ...
│   └───blockchain
│   └───deployer
│   └───ganache_data
│   └───machines
│   
└───helloworld
    │   truffle-config.js
    └───contracts
    └───migrations
    └───test
```

The `Ganache CLI` network instance spawned by the Descartes SDK Environment runs on port `8545` and has network ID `7777`. To ensure our project will connect to it, we need to edit the "networks" session in `truffle-config.js` and specify that we want to connect to that port:

```javascript
networks: {
  development: {
   host: "127.0.0.1",     // Localhost (default: none)
   port: 8545,            // Ganache CLI port (default: none)
   network_id: "7777",    // Environment network (default: none)
  },
},
```

Finally, let's add two dependencies to our project using Yarn. First, add a dependency to the Descartes SDK itself through the `@cartesi/descartes-sdk` package. This will allow our DApp code to refer to the Descartes smart contract and instantiate computations.

```bash
yarn add @cartesi/descartes-sdk
```

Aside from that, let's also add a dependency to `@truffle/contract`, which will be used later on in a script for [deploying our DApp](../deploy-run/). This will allow us to properly link our DApp to the Descartes contract already deployed to the local development network.

```bash
yarn add @truffle/contract
```

##  Creating the smart contract

At this point, we can start effectively writing our DApp's smart contract in Solidity.

In order to do that, first create a file inside the `helloworld/contracts` directory, and call it `HelloWorld.sol`. Then place the following contents into it:

```javascript
pragma solidity >=0.4.25 <0.7.0;
pragma experimental ABIEncoderV2;

import "@cartesi/descartes-sdk/contracts/DescartesInterface.sol";

contract HelloWorld {
    DescartesInterface descartes;

    constructor(address descartesAddress) public {
        descartes = DescartesInterface(descartesAddress);
    }
}
```

The Solidity code above defines a smart contract called "HelloWorld", which imports the `DescartesInterface`. Moreover, its constructor receives as an argument the effective address of the deployed Descartes smart contract, which will enable our code to issue transactions and query results from it. We will explore that in more detail in subsequent sections.

For now, it suffices to check if our initial project is correctly set up. To do that, execute the following command and verify that it is successful.

```
truffle compile
```
