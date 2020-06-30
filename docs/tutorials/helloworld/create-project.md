---
title: Creating basic DApp
---

:::note Section Goal
- create and initialize a basic project for a Descartes DApp
:::

 ## Introduction

 Now that we have [built our Hello World Cartesi Machine](./cartesi-machine.md), we can shift our focus towards the on-chain part of the DApp. In this section, we will create a basic project for a Descartes DApp, which will include a smart contract capable of using the Descartes contract already deployed by the [Descartes SDK Environment](../descartes-env.md).


## Initializing the DApp project

First of all, within the project's `helloworld` directory created last section, run the following command to initialize a new project using `truffle`:

```bash
truffle init
```

This will create a basic project structure, with three subdirectories `contracts`, `migrations` and `test`, along with a `truffle-config.js` file.

The `Ganache CLI` network instance spawned by the Descartes SDK Environment runs on port 8545. To ensure our project will connect to it, we need to edit the "networks" session in `truffle-config.js` and specify that we should connect to that port:

```javascript
networks: {
  development: {
   host: "127.0.0.1",     // Localhost (default: none)
   port: 8545,            // Ganache CLI port (default: none)
   network_id: "*",       // Any network (default: none)
  },
},
```

Finally, let's add two dependencies to our project using Yarn. First, add a dependency to the Descartes SDK itself through the `@cartesi/descartes-sdk` package. This will allow our DApp code to refer to the Descartes smart contract and instantiate computations.

```bash
yarn add @cartesi/descartes-sdk
```

Aside from that, let's also add a dependency to `@truffle/contract`, which will be used in the *migration* script later on to allow us to properly link our DApp to the Descartes contract already deployed to the local network.

```bash
yarn add @truffle/contract
```

##  Creating the smart contract

At this point, we can start effectively writing our DApp's smart contract in Solidity.

In order to do that, first create a file inside the `./contracts` directory, and call it `HelloWorld.sol`. Then place the following contents in it:

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

The Solidity code above thus defines a smart contract called "HelloWorld", which imports the `DescartesInterface`. Moreover, its constructor receives as an argument the effective address of the deployed Descartes smart contract, which will enable our code to issue transactions and query results from it. We will explore that in more detail in the following sections.
