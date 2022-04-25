---
title: Calculator project
---

:::note Section Goal
- create and initialize project for the Calculator Descartes DApp
:::

## Introduction

In creating our [basic Hello World DApp](../../helloworld/create-project/), we were able to understand the basic structure of a Descartes DApp, including how to build an appropriate Cartesi Machine, instantiate its computation from a smart contract via the Descartes API, and actually deploying and running the DApp on a test network.

As interesting as it is, this first application serves more as an introduction to the basic concepts of the Descartes SDK, since the computation performed is actually not very useful, always yielding a constant string "Hello World!" as its result. In order to build really useful DApps, we will now introduce the usage of *input drives*, which allows us to parameterize the computation performed by the machine and thus open up a wide range of interesting possibilities.

In this section, we will start building a *Calculator DApp* capable of evaluating an arbitrary mathematical expression. As such, this application actually enables smart contracts to perform calculations that would otherwise be very hard to perform on-chain.

As before, the complete implementation of this example can be found in the [Descartes Tutorials GitHub repo](https://github.com/cartesi/descartes-tutorials/tree/master/calculator).


## Initializing the DApp project

Following the same procedure that was laid out for the [Hello World DApp](../../helloworld/create-project/), we will start by creating a directory called `calculator`. Inside that directory, we will already create three subdirectories called `contracts`, `deploy` and `cartesi-machine`:

```bash
mkdir calculator
cd calculator
mkdir contracts
mkdir deploy
mkdir cartesi-machine
```

After that, we can add project dependencies to the Descartes SDK, Hardhat, Ethers and TypeScript:

```bash
yarn add @cartesi/descartes-sdk@1.1.1
yarn add ethers hardhat hardhat-deploy hardhat-deploy-ethers --dev
yarn add typescript ts-node --dev
```

Finally, we must once again create a `hardhat.config.ts` file to reflect our development environment with a local Ethereum node running on port `8545`. In this file we also define the project's dependencies on Descartes' artifacts and deployments scripts, along with other minor configurations such as the Solidity version to use:

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
        artifacts: "node_modules/@cartesi/descartes-sdk/export/artifacts",
        deploy: "node_modules/@cartesi/descartes-sdk/dist/deploy",
      },
    ],
    deployments: {
      localhost: ["../descartes-env/deployments/localhost"],
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
