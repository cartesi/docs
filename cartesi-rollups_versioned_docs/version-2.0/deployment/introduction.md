---
id: introduction
title: Introduction
resources:
  - url: https://github.com/cartesi/rollups-contracts/releases/tag/v3.0.0-alpha.10
    title: Supported networks (rollups-contracts v3.0.0-alpha.10)

---

Applications built on Cartesi Rollups are intended to be deployed to public blockchains so users can access them. This can be done by taking advantage of a cloud-based infrastructure.

Deploying a Cartesi dApp involves two steps: deploying a smart contract that defines your dApp on-chain and then instantiating a node that runs the application's intended backend logic.

To facilitate the instantiation of such nodes, Cartesi provides an infrastructure for quickly getting them running in the cloud so the node can be run 24/7. This server will expose a single port to the internet so client applications can communicate with the node.

## Public snapshots

For production deployments, applications must use **public snapshots** that are built through public workflows and published as public releases. This ensures transparency, reproducibility, trust, and auditability - essential for the trustless nature of blockchain applications.

[Learn more about public snapshots](./snapshot.md)

## Deployment process

The deployment of an application involves building a Cartesi machine and deploying a smart contract to a supported network.

The `cartesi build` command produces the Cartesi genesis machine, which contains a hash representing the application and its initial state.

After deployment, any changes to the application code will generate a different hash and, hence, require another deployment.

There are two methods to deploy an application:

1. [Self-hosted deployment](./self-hosted/overview.md): Deploy the application node using your infrastructure
2. Third-party service provider: Outsource running the application node to a service provider

:::caution important
Deployment with a third-party service provider is under development and will be available soon.
:::

## Supported networks

As stated above, the first step in deploying a new Cartesi dApp to a blockchain requires creating a smart contract on that network that uses the Cartesi Rollups smart contracts. Cartesi has already deployed the Rollups smart contracts to several networks for convenience.

The table below lists the networks supported by [rollups-contracts v3.0.0-alpha.10](https://github.com/cartesi/rollups-contracts/releases/tag/v3.0.0-alpha.10), the release used by rollups-node v2.0.0-alpha.14:

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

The contract addresses ship as the `cartesi-rollups-contracts-3.0.0-alpha.10-deployment-addresses.tar.gz` asset of that release, under `deployments/<chain-id>/`, one entry per contract. The addresses are deterministic, so before using one, check that a contract is deployed at it on your chain (for example, `cast code <address> --rpc-url <RPC-URL>` must return non-empty bytecode). Take every address your node uses from the same release as the node.

:::caution Arbitrum and PRT
- **Authority and Quorum applications on Arbitrum:** the reference node (rollups-node v2.0.0-alpha.14) does not support them. Inside Arbitrum contracts, `block.number` is a parent-chain (Ethereum) block number, while the node counts epochs in Arbitrum block numbers, so the consensus contract rejects the node's claims (`NotPastBlock`) and no epoch is ever accepted.
- **PRT (Dave) applications:** the PRT contracts used by this node release (v3.0.0-alpha.6) support only Ethereum Mainnet and Sepolia. Their deployments on the other networks are experimental.
:::
