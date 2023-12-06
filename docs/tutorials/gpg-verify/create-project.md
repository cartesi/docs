---
title: GPG Verify project
tags: [sdk, tutorials, low-level developer]
---

:::note Section Goal

- understand use case of using GPG for document signature verification
- create and initialize project for the GPG Verify Cartesi Compute dApp
  :::

## Introduction

In this tutorial, we will explore how Cartesi Compute can be used to implement a solution for a more realistic use case: verifying document signatures using GPG.

Oftentimes, a smart contract needs to validate that a given set of data is indeed authentic, in the sense that it can be trusted to have been provided by a specified agent, and that it has not been tampered. _Digital signatures_ are a great way of achieving that goal. The general idea is that a given user or organization employs a _private key_ to generate a signature for a specific document. Any party that receives a copy of that document and the associated signature can then use the organization's corresponding _public key_, which is openly distributed, to check the integrity and authenticity of the data.

The [GNU Privacy Guard (GnuPG)](https://www.gnupg.org/) is a widely used tool for encrypting and signing data, and is commonly available in Linux distributions. As such, in this project we will use it inside a Cartesi Machine to check whether a given document's signature is indeed valid. We will detail how to build this solution in the following sections, and a complete implementation can be directly accessed within the [Cartesi Compute Tutorials GitHub repo](https://github.com/cartesi/compute-tutorials/tree/master/gpg-verify).

## Initializing the dApp project

To begin with, let's create a directory for our project and set up some subdirectories inside it, as [discussed before](../helloworld/create-project.md):

```bash
mkdir gpg-verify
cd gpg-verify
mkdir contracts
mkdir deploy
mkdir cartesi-machine
```

As always, we need to add the required project dependencies to Hardhat/Ethers and the Cartesi Compute SDK, as well as TypeScript:

```bash
yarn add @cartesi/compute-sdk@1.3.0
yarn add ethers@5.4.7 hardhat hardhat-deploy hardhat-deploy-ethers --dev
yarn add typescript ts-node --dev
```

Finally, we need to create the `hardhat.config.ts` file to indicate the location of the Ethereum instance running inside our [development environment](../compute-env.md), in addition to the dependency on Cartesi Compute's artifacts and deployments scripts and other configurations:

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

## Public key file

As explained above, the idea of signing documents is that any party can use an openly distributed _public key_ to check the validity of a signature. As such, to implement this project we will need to acquire such a key and make it available to our dApp.

In fact, a specific _keypair_ for a fictional user `compute.tutorials@cartesi.io` was created just for the purposes of this tutorial, and both its public and private keys are available in the [Cartesi Compute Tutorials GitHub repo](https://github.com/cartesi/compute-tutorials/tree/master/gpg-verify/cartesi-machine).

To download the public key to an appropriate location, first `cd` into the `cartesi-machine` subdirectory:

```bash
cd cartesi-machine
```

Then, download the public key by typing:

```bash
wget https://github.com/cartesi/compute-tutorials/raw/master/gpg-verify/cartesi-machine/compute-pub.key
```

With that set, in the next section we will learn how to supply this key to a Cartesi Machine using an `ext2` file-system, so that we can experiment with GPG signature verification inside a Cartesi Machine.
