---
title: Creating Calculator DApp
---

:::note Section Goal
- create and initialize project for the Calculator Descartes DApp
:::

## Introduction

In creating our [basic Hello World DApp](../../helloworld/create-project/), we were able to understand the basic structure of a Descartes DApp, including how to build an appropriate Cartesi Machine, instantiate its computation from a smart contract via the Descartes API, and actually deploying and running the DApp on a test network.

As interesting as it is, this first application serves more as an introduction to the basic concepts of the Descartes SDK, since the computation performed is actually not very useful, yielding always a constant string "Hello World!" as its result. In order to build really useful DApps, we will now introduce the usage of *input drives*, which allows us to parameterize the computation performed by the machine, and thus opens up a wide range of interesting possibilities.

In this section, we will start building a *Calculator DApp* capable of evaluating an arbitrary mathematical expression. As such, this application actually enables smart contracts to perform calculations that would otherwise be very hard to perform on-chain.

As before, the complete implementation of this example can be found in the [Descartes Tutorials Github repo](https://github.com/cartesi/descartes-tutorials/tree/master/calculator).


## Initializing the DApp project

Following the same procedure that was laid out for the [Hello World DApp](../../helloworld/create-project/), we will start by creating a directory called `calculator` and initializing the project using Truffle within that directory:

```bash
mkdir calculator
cd calculator
truffle init
```

Once again, we must edit the generated `truffle-config.js` file, to reflect our development environment with a `Ganache CLI` instance running on port `8545` with network ID `7777`:

```javascript
networks: {
  development: {
   host: "127.0.0.1",     // Localhost (default: none)
   port: 8545,            // Ganache CLI port (default: none)
   network_id: "7777",    // Environment network (default: none)
  },
},
```

And finally, let's add the necessary dependencies to the Descartes SDK and Truffle:

```bash
yarn add @cartesi/descartes-sdk
yarn add @truffle/contract
```
