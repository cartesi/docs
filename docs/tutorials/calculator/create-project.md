---
title: Calculator project
tags: [sdk, tutorials, low-level developer]
---

:::note Section Goal
- create and initialize project for the Calculator Cartesi Compute dApp
:::

## Introduction

In creating our [basic Hello World dApp](../helloworld/create-project.md), we were able to understand the basic structure of a Cartesi Compute dApp, including how to build an appropriate Cartesi Machine, instantiate its computation from a smart contract via the Cartesi Compute API, and actually deploying and running the dApp on a test network.

As interesting as it is, this first application serves more as an introduction to the basic concepts of the Cartesi Compute SDK, since the computation performed is actually not very useful, always yielding a constant string "Hello World!" as its result. In order to build really useful dApps, we will now introduce the usage of *input drives*, which allows us to parameterize the computation performed by the machine and thus open up a wide range of interesting possibilities.

In this section, we will start building a *Calculator dApp* capable of evaluating an arbitrary mathematical expression. As such, this application actually enables smart contracts to perform calculations that would otherwise be very hard to perform on-chain.

As before, the complete implementation of this example can be found in the [Cartesi Compute Tutorials GitHub repo](https://github.com/cartesi/compute-tutorials/tree/master/calculator).


## Initializing the dApp project

Following the same procedure that was laid out for the [Hello World dApp](../helloworld/create-project.md), we will start by creating a directory called `calculator`. Inside that directory, we will already create three subdirectories called `contracts`, `deploy` and `cartesi-machine`:

```bash
mkdir calculator
cd calculator
mkdir contracts
mkdir deploy
mkdir cartesi-machine
```

After that, we can add project dependencies to the Cartesi Compute SDK, Hardhat, Ethers and TypeScript:

```bash
yarn add @cartesi/compute-sdk@1.3.0
yarn add ethers@5.4.7 hardhat hardhat-deploy hardhat-deploy-ethers --dev
yarn add typescript ts-node --dev
```

Finally, we must once again create a `hardhat.config.ts` file to reflect our development environment with a local Ethereum node running on port `8545`. In this file we also define the project's dependencies on Cartesi Compute's artifacts and deployments scripts, along with other minor configurations such as the Solidity version to use:

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
