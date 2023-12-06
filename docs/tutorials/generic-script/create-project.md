---
title: Generic Script project
tags: [sdk, tutorials, low-level developer]
---

:::note Section Goal

- create and initialize project for the Generic Script Cartesi Compute dApp
  :::

## Introduction

In the [previous tutorial](../calculator/create-project.md), we learned how to build a Cartesi Compute dApp that is capable of receiving input data as a string and performing a mathematical calculation using the Linux `bc` tool. In this project, we will generalize this idea to show how Cartesi Compute can be leveraged to allow a smart contract to perform a _generic_ computation by receiving an arbitrary script as input and using _any_ interpreter of choice, such as Python or Lua, including any required libraries, to execute it. And without compromising on decentralization.

:::warning DISCLAIMER
Despite being included as a tutorial, it should be noted that this is **NOT** the recommended way of implementing a dApp using Cartesi Compute. It usually makes little sense to waste resources building a full script on-chain - all possible logic should rather be moved over to the off-chain Cartesi Machine. However, this strategy is used here for the purposes of illustrating Cartesi Compute's potential for running any generic computation in a verifiable way. Furthermore, this approach allows us to play with the possibilities without the need of building a different machine for every script we want to try out.
:::

As always, a full implementation of this tutorial is available in the [Cartesi Compute Tutorials GitHub repo](https://github.com/cartesi/compute-tutorials/tree/master/generic-script).

## Initializing the dApp project

As we did for the [other dApps](../helloworld/create-project.md), we will first initialize our project by creating an appropriate directory along with its basic internal structure:

```bash
mkdir generic-script
cd generic-script
mkdir contracts
mkdir deploy
mkdir cartesi-machine
```

We should not forget to add the necessary dependencies to the Cartesi Compute SDK, Hardhat, Ethers and TypeScript:

```bash
yarn add @cartesi/compute-sdk@1.3.0
yarn add ethers@5.4.7 hardhat hardhat-deploy hardhat-deploy-ethers --dev
yarn add typescript ts-node --dev
```

Last but not least, let's create a `hardhat.config.ts` file, so that we can properly interact with our [development environment's](../compute-env.md) Ethereum instance and leverage Cartesi Compute's deployment resources:

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
