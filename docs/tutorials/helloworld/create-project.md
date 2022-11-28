---
title: Creating basic DApp
tags: [sdk, tutorials, low-level developer]
---

:::note Section Goal
- create and initialize a basic project for a Cartesi Compute DApp
:::

## Introduction

In this section we are going to start building our first Cartesi Compute DApp. This *Hello World DApp* will consist of a trivial application, which simply instantiates an off-chain computation that always returns "Hello World!". A complete implementation of this example can be found in the [Cartesi Compute Tutorials GitHub repo](https://github.com/cartesi/compute-tutorials/tree/master/helloworld).

In order to build this DApp, we will start by creating a basic project with a smart contract capable of using the Cartesi Compute contract already deployed to the [Cartesi Compute SDK Environment](../compute-env.md).


## Initializing the DApp project

First of all, create a directory called `helloworld` and `cd` into it

```
mkdir helloworld
cd helloworld
```

At this point, we should have the following directory structure:

```
│
└───compute-env
│   │   ...
│   └───deployments
│   └───machines
│   
└───helloworld
```

Now, let's add dependencies to our project using Yarn. First, add a dependency to the Cartesi Compute SDK itself through the ` @cartesi/compute-sdk` package. This will allow our DApp code to refer to the Cartesi Compute smart contract and instantiate computations:

```bash
yarn add @cartesi/compute-sdk@1.3.0
```

Aside from that, let's also add development dependencies to Hardhat and Ethers, which we will use for deploying the smart contracts, as well as Typescript, for configuration files and scripts:

```bash
yarn add ethers@5.4.7 hardhat hardhat-deploy hardhat-deploy-ethers --dev
yarn add typescript ts-node --dev
```

Finally, create a file called `hardhat.config.ts` and place the following contents in it:

```javascript
import { HardhatUserConfig } from "hardhat/config";

import "hardhat-deploy";
import "hardhat-deploy-ethers";

const config: HardhatUserConfig = {
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
  },
  solidity: {
    version: "0.7.4",
  },
  external: {
    contracts: [
      {
        artifacts: "node_modules/@cartesi/compute-sdk/export/artifacts",
        deploy: "node_modules/@cartesi/compute-sdk/dist/deploy",
      },
    ],
    deployments: {
      localhost: ["../compute-env/deployments/localhost"],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    alice: {
      default: 0,
    },
    bob: {
      default: 1,
    },
  },
};

export default config;
```

This configuration specifies the DApp's dependency on `@cartesi/compute-sdk` artifacts and deployment scripts, as well as the usage of the Cartesi Compute Environment's Ethereum node running on `localhost:8545`. We also specify the Solidity version that our DApp will use (`0.7.4`) and a few named accounts that will be useful later on for deploying the contracts and testing the application.

##  Creating the smart contract

At this point, we can start effectively writing our DApp's smart contract in Solidity.

In order to do that, first create a directory called `contracts`:

```bash
mkdir contracts
```

Then, create a file called `HelloWorld.sol` inside that directory and place the following contents into it:

```javascript
// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@cartesi/compute-sdk/contracts/CartesiComputeInterface.sol";

contract HelloWorld {
    CartesiComputeInterface cartesiCompute;

    constructor(address cartesiComputeAddress) {
        cartesiCompute = CartesiComputeInterface(cartesiComputeAddress);
    }
}
```

The Solidity code above defines a smart contract called "HelloWorld", which imports the `CartesiComputeInterface`. Moreover, its constructor receives as an argument the effective address of the deployed Cartesi Compute smart contract, which will enable our code to issue transactions and query results from it. We will explore that in more detail in subsequent sections.

For now, it suffices to check if our initial project is correctly set up. To do that, execute the following command and verify that it is successful.

```
npx hardhat compile
```
