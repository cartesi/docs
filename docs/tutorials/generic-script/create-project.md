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

As we did for the [other DApps](../../helloworld/create-project/), we will first initialize our project by creating an appropriate directory and using Truffle to create its basic structure:

```bash
mkdir generic-script
cd generic-script
truffle init
```

We should not forget to edit the generated `truffle-config.js` file, so that we can properly interact with our [development environment's](../../descartes-env) `Ganache CLI` instance, which is running on port `8545` and has network ID `7777`:

```javascript
networks: {
  development: {
   host: "127.0.0.1",     // Localhost (default: none)
   port: 8545,            // Ganache CLI port (default: none)
   network_id: "7777",    // Environment network (default: none)
  },
},
```

Last but not least, let's add the necessary dependencies to the Descartes SDK and Truffle:

```bash
yarn add @cartesi/descartes-sdk@0.2.0
yarn add @truffle/contract --dev
```
