---
id: introduction
title: Introduction
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v1.4.0/onchain/rollups/deployments
    title: Supported networks

---

Applications built on Cartesi Rollups are intended to be deployed to public blockchains so users can access them. This can be done by taking advantage of a cloud-based infrastructure.

Deploying a Cartesi dApp involves two steps: deploying a smart contract that defines your dApp on-chain and then instantiating a node that runs the application’s intended backend logic.

To facilitate the instantiation of such nodes, Cartesi provides an infrastructure for quickly getting them running in the cloud so the node can be run 24/7. This server will expose a single port to the internet so client applications can communicate with the node.

The Cartesi rollups node is distributed as a Docker image. Any popular cloud provider, like AWS, GCP, Azure, Digital Ocean, or Linode, can run docker containers and hence can be used to host the rollups node. 

## Deployment process

The deployment of an application involves building a Cartesi machine and deploying a smart contract to a supported network.

The `cartesi build` command produces the Cartesi genesis machine, which contains a hash representing the application and its initial state.

After deployment, any changes to the application code will generate a different hash and, hence, require another deployment.

The smart contract that represents the application on the base layer can be deployed using the [`CartesiDAppFactory`](../api-reference/json-rpc/application-factory.md) smart contract.

There are two methods to deploy an application:

1. [Self-hosted deployment](../deployment/self-hosted.md): Deploy the application node using your infrastructure. 

2. Third-party service provider: Outsource running the application node to a service provider. 

:::caution important
Deployment with a third-party service provider is under development and will be available in a future release.
:::

## Supported networks

As stated above, the first step in deploying a new Cartesi dApp to a blockchain requires creating a smart contract on that network that uses the Cartesi Rollups smart contracts. Cartesi has already deployed the Rollups smart contracts to several networks for convenience.

The table below shows the list of all [networks that are currently supported](https://github.com/cartesi/rollups-contracts/tree/v1.4.0/onchain/rollups/deployments) in the latest release:

| Network Name     | Chain ID |
| ---------------- | -------- |
| Ethereum Mainnet | 1        |
| Sepolia          | 11155111 |
| Optimism         | 10       |
| Optimism Sepolia | 11155420 |
| Arbitrum         | 42161    |
| Arbitrum Sepolia | 421614   |
| Base             | 8453     |
| Base Sepolia     | 84532    |
