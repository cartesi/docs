---
id: introduction
title: Introduction
resources:
  - url: https://github.com/cartesi/rollups-contracts/releases/tag/v3.0.0-alpha.9
    title: Rollups Contracts v3.0.0
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/docs/deployment.md
    title: Contract deployment guide
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/docs/verification.md
    title: Contract verification guide

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

## Use published contract addresses

The contract reference in this documentation targets Rollups Contracts `v3.0.0`. Use the deployment addresses published with that release when following its interfaces.

The contracts can be deployed to any EVM-compatible chain that supports the required EVM version. The Cartesi Foundation commonly deploys releases to Ethereum, Arbitrum, Optimism, Base, and their testnets, but availability depends on the release and network.

Before deploying an Application:

1. obtain `cartesi-rollups-contracts-3.0.0-deployment-addresses.tar.gz` from the GitHub release, or deploy the suite from the tagged source;
2. verify the chain ID and bytecode for each address;
3. keep that artifact with the Application deployment record; and
4. configure every client and node component with addresses from the same release.

The repository uses Foundry deployment scripts and stores results under `deployments/<chain-id>`. Each contract has a plain-text `<Contract>.txt` address file. Integrations should read the plain-text address files.

Follow the linked contract deployment guide to simulate and broadcast a deployment. Verification can be retried independently with `make verify-<chain>` or for one contract with `make verify-<chain>-<contract>`.

Contract source is distributed through the Soldeer package `cartesi-rollups-contracts~3.0.0`. Compiled artifacts and the Anvil state are available as separate assets on the GitHub release.
