---
title: Generic Script project
---

:::note Section Goal
- create and initialize project for the Generic Script Descartes DApp
:::

## Introduction

In the [previous tutorial](../../calculator/create-project/), we learned how to build a Descartes DApp that is capable of receiving input data as a string and performing a mathematical calculation using the Linux `bc` tool. In this project, we will generalize this idea to show how Descartes can be leveraged to allow a smart contract to perform a *generic* computation by receiving an arbitrary script as input and using *any* interpreter of choice, such as Python or Lua, including any required libraries, to execute it. And without compromising on decentralization.

:::warning DISCLAIMER
Despite being included as a tutorial, it should be noted that this is **NOT** the recommended way of implementing a DApp using Descartes. It usually makes little sense to waste resources building a full script on-chain - all possible logic should rather be moved over to the off-chain Cartesi Machine. However, this strategy is used here for the purposes of illustrating Descartes' potential for running any generic computation in a verifiable way. Furthermore, this approach allows us to play with the possibilities without the need of building a different machine for every script we want to try out.
:::

As always, a full implementation of this tutorial is available in the [Descartes Tutorials GitHub repo](https://github.com/cartesi/descartes-tutorials/tree/master/generic-script).


## Initializing the DApp project

As we did for the [other DApps](../../helloworld/create-project/), we will first initialize our project by creating an appropriate directory along with its basic internal structure:

```bash
mkdir generic-script
cd generic-script
mkdir contracts
mkdir deploy
mkdir cartesi-machine
```

We should not forget to add the necessary dependencies to the Descartes SDK, Hardhat, Ethers and TypeScript:

```bash
yarn add @cartesi/descartes-sdk@1.1.1
yarn add ethers hardhat hardhat-deploy hardhat-deploy-ethers --dev
yarn add typescript ts-node --dev
```

Last but not least, let's create a `hardhat.config.ts` file, so that we can properly interact with our [development environment's](../../descartes-env) Ethereum instance and leverage Descartes' deployment resources:

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
