---
title: Dogecoin Hash project
---

:::note Section Goal
- create and initialize project for the Dogecoin Hash Descartes DApp
- understand technical details and motivations for computing proof-of-work hashes of Dogecoin and Litecoin block headers
:::

## Introduction

When considering Descartes DApps, some of the most interesting use cases consist of finding solutions to computational challenges that hinder potentially useful smart contracts.

In this context, this tutorial will show how an Ethereum smart contract can run the [scrypt](https://www.tarsnap.com/scrypt.html) algorithm to compute the proof-of-work hash for a given Dogecoin (or Litecoin) block header. The resulting hash can then be compared to the block's target difficulty so as to verify whether that block is indeed valid.

As always, the complete implementation of this project is also available on the [Descartes Tutorials GitHub repo](https://github.com/cartesi/descartes-tutorials/tree/master/dogecoin-hash).


## Technical background

To better illustrate the project's implementation, this tutorial will first go into some technical details of the Dogecoin and Litecoin specification.

First of all, it should be noted that Dogecoin is actually based on Litecoin, and that both use the same algorithm for hashing blocks. For that reason, this DApp can be used to validate block header data from both of those chains.

The specification for Litecoin's block hashing algorithm can be found [here](https://litecoin.info/index.php/Block_hashing_algorithm), and it defines that the data to be hashed should be composed of the concatenation of 6 fields available in the block header:

1. Version (4 bytes)
1. Previous hash (32 bytes)
1. Merkle root (32 bytes)
1. Timestamp (4 bytes)
1. Bits (target value in compact form) (4 bytes)
1. Nonce (4 bytes)

As such, concatenating all of the above fields leads to an input data that is 80 bytes in size.

The specification also defines that the resulting hash must be computed by the `scrypt` algorithm, using an output length of 32 bytes (256 bits), and that it should be inferior to the block's *target value* encoded in the `Bits` field. In other words, for a block to be considered valid, the miner must have provided an adequate `Nonce` value such that the resulting hash computed by the `scrypt` algorithm is small enough.

To compare the computed hash with the target value, it is necessary to interpret the 4 bytes of the `Bits` field in a special way defined by the specification. In a nutshell, the leading byte of that field represents a base-256 exponent, while the other 3 bytes are the mantissa. As an example, the target for a `Bits` value of `1a01cd2d` will be given by:

```
target = 01cd2d << 8*(1a - 3) = 1cd2d0000000000000000000000000000000000000000000000
```

This way, for that specific `Bits` field value, the corresponding block will only be considered valid if the computed proof-of-work hash represents a value that is smaller than the above target of `1cd2d00..00`.

In this tutorial, we will implement a DApp that allows a smart contract to produce this hash, even though the `scrypt` algorithm is way too expensive to be executed on-chain. For that reason, the contract will use Descartes  to run this computation off-chain, taking advantage of the well-established  [libscrypt](https://github.com/technion/libscrypt) library written in C.


## Initializing the DApp project

Now that we have a better understanding of the project's goal, let's start our implementation by initializing the project's structure, as we have done for the [other tutorials](../../helloworld/create-project/): 

```bash
mkdir dogecoin-hash
cd dogecoin-hash
mkdir contracts
mkdir deploy
mkdir cartesi-machine
```

Once the project is initialized, ensure that it has the adequate dependencies to the Descartes SDK, Hardhat, Ethers and TypeScript:

```bash
yarn add @cartesi/descartes-sdk@1.1.1
yarn add ethers hardhat hardhat-deploy hardhat-deploy-ethers --dev
yarn add typescript ts-node --dev
```

After that, create a `hardhat.config.ts` file with the configuration of the local Ethereum instance running inside our [development environment](../../descartes-env), which is using port `8545`, along with the project's dependencies on Descartes' artifacts and deployments scripts and other settings such as named accounts and Solidity version:

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
