---
id: ether-wallet
title: Integrating Ether wallet functionality
---

This tutorial will build a basic Ether wallet inside a Cartesi backend application using TypeScript. 

The goal is to have a backend application to receive, transfer, and withdraw Ether. 

## Setting up the project

First, let's create a new TypeScript project using the [Cartesi CLI](../development/installation.md/#cartesi-cli). 

```bash
cartesi create ether-wallet-dapp --template typescript 
```

Now, let's navigate to the project directory and install the required dependencies.

- [`@wagmi/cli`](https://wagmi.sh/cli/why): The Wagmi CLI tool to generate ABIs .
- [`@cartesi/rollups`](https://www.npmjs.com/package/@cartesi/rollups): The Cartesi Rollups Contracts implementations.
- [`@sunodo/wagmi-plugin-hardhat-deploy`](https://www.npmjs.com/package/@sunodo/wagmi-plugin-hardhat-deploy): Wagmi CLI plugin that loads contracts and deployments from the `@cartesi/rollups` package.

```bash
yarn add viem
yarn add -D @cartesi/rollups @sunodo/wagmi-plugin-hardhat-deploy @wagmi/cli
```

## Define the ABIs

Let's write a configuration to generate the ABIs of the Cartesi Rollups Contracts.

Create a file named `wagmi.config.js` in the root of the project with the following content:

```typescript
import { defineConfig } from "@wagmi/cli";
import hardhatDeploy from "@sunodo/wagmi-plugin-hardhat-deploy";

export default defineConfig({
  out: "src/wallet/abi.ts", // Specifies the output file for the ABIs
  contracts: [],
  plugins: [
    hardhatDeploy({
      directory: "node_modules/@cartesi/rollups/export/abi",
    }),
  ],
});
```

Now, let's generate the ABIs by running the following command:

```bash
yarn wagmi generate
```

## Building the Ether wallet

