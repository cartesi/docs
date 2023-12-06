---
id: deploying-dapps
title: Deploying dApps
tags: [deploy, quickstart, dapps, developer]
---

:::tip
Please check the [full documentation for deploying Rollups dApps to Cartesi's cloud-based execution infrastructure](https://github.com/cartesi/rollups-deployment/blob/main/README.md).
:::

Cartesi Rollups dApps are intended to be deployed to public blockchains, so that they can be accessed by users. This can be done by taking advantage of a cloud-based infrastructure provided by Cartesi.

As happens with any blockchain application, the act of "deploying a dApp" involves publishing its smart contract so that it is publicly available and usable by clients or [front-end applications](../dapp-architecture.md#front-end). In the context of a Cartesi dApp, the smart contract is represented by an arbitrary [back-end program](../dapp-architecture.md#back-end) that runs on Linux inside a [Cartesi Node](../components.md#cartesi-nodes). This means that deploying Cartesi dApps basically corresponds to instantiating Cartesi Nodes that run the intended back-end logic of the application.

In order to facilitate the instantiation of such nodes, Cartesi provides an infrastructure for easily getting them running in the cloud. Developers are thus invited to take advantage of this convenience service in order to jump-start bringing their applications to public blockchains.

## Supported networks

Deploying a new Cartesi dApp to a blockchain requires creating a smart contract on that network that makes use of the Cartesi Rollups smart contracts. For convenience, Cartesi has already deployed the Rollups smart contracts to a number of networks, in order to make it easier for developers to create dApps on them.

The table below shows the list of all [networks that are currently supported](https://github.com/cartesi/rollups/blob/main/onchain/rollups/hardhat.config.ts#L56) in the latest Cartesi Rollups release:

| Network Name    | Chain ID |
| --------------- | -------- |
| Arbitrum Goerli | 421613   |
| Sepolia         | 11155111 |
| Gnosis Chiado   | 10200    |
| Optimism Goerli | 420      |
| Polygon Mumbai  | 80001    |
