---
id: managing-a-dev-environment
title: Managing a dev environment
resources:
  - url: https://cartesiscan.io/
    title: CartesiScan
---

## Starting a Devnet Environment

The Cartesi CLI makes it much easier to create an application. This process happens in two stages. The first stage involves setting up a devnet environment. During this step, the required docker containers are downloaded and started to create a local development environment. This environment includes Cartesi node, Anvil network, Cartesi RPC services, both the Inspect and GraphQL servers. To start this process simply ensure that you have docker active then run the command:

```shell
cartesi start
```

The successful execution of this step will log this in your terminal:

```shell
WARNING: default block is set to 'latest', production configuration will likely use 'finalized'
[+] Pulling 4/4
 ✔ database Skipped - Image is already present locally                                                      0.0s 
 ✔ rollups-node Skipped - Image is already present locally                                                  0.0s 
 ✔ anvil Skipped - Image is already present locally                                                         0.0s 
✔ anvil service ready at http://127.0.0.1:8080/anvil
✔ rpc service ready at http://127.0.0.1:8080/rpc
✔ inspect service ready at http://127.0.0.1:8080/inspect/<application_address>
```

Getting a log similar to this means the CLI successfully pulled all the required services and activated the cartesi devnet container. You can confirm this by checking the Containers' section in your Docker Desktop.

With the devnet environment running, you can deploy multiple applications to this local network. Keep in mind that the state of these applications is only maintained while the devnet is active. If you stop or restart the devnet, you'll need to redeploy the applications and reinitialize their state.

### Overview of Devnet Services

The `cartesi rollups start` command starts several services essential for node operation:

- **Anvil Chain**: Runs a local blockchain available at `http://localhost:8545`.

- **GraphQL Playground**: An interactive UI at `http://localhost:8080/graphql` for exploring the GraphQL server.

- **Blockchain Explorer**: Monitors node activity and manages transactions via `http://localhost:8080/explorer/`.

- **Inspect endpoint**: A diagnostic tool accessible at `http://localhost:8080/inspect/<application_address>` to inspect the node’s state.

- **CartesiScan**: [CartesiScan](https://cartesiscan.io/) is a valuable tool for developers and users alike, offering a comprehensive overview of Cartesi Rollups applications and their interactions with the blockchain. Additionally, it provides expandable data regarding outputs, encompassing notices, vouchers, and reports. When you start your devnet environment with `cartesi rollups start`, there is a local instance of CartesiScan on `http://localhost:8080/explorer`.

## Checking the status of a Devnet Environment

The Devnet environment functions similarly to a mainnet. It runs as a single node along with all its services connected to a local Anvil network. This setup allows you to not only check the network's status but also see how many applications have been deployed to it.

To query the network's status, run the following command:

```shell
cartesi status
```

This returns the following log:

```shell
> cartesi status
cartesi-rollups is running
no applications deployed
```

We currently have no program deployed hence the message 'No application deployed', however we can correctly infer that the devnet is active and running. We should get a log like this if we had two application deployed on our devnet.

```shell
> cartesi rollups status
cartesi-rollups is running
┌────────────────────────────────────────────────────────────────────┬────────────────────────────────────────────┬─────────┐
│ Machine                                                            │ Address                                    │ State   │
├────────────────────────────────────────────────────────────────────┼────────────────────────────────────────────┼─────────┤
│ 0x9e0420c0fda1a5dc9256b3f9783b09f207e5222a88429e91629cc2e495282b35 │ 0x1db6ddecf18095847f7099cfac43a2671326d21c │ ENABLED │
├────────────────────────────────────────────────────────────────────┼────────────────────────────────────────────┼─────────┤
│ 0x4b618cb7451edae5186b75a5c614cba13badb7ca89c282b4ca9e970e9826b249 │ 0xde752d14b5bb9f81d434d0fb6e05b17c5afaa057 │ ENABLED │
└────────────────────────────────────────────────────────────────────┴────────────────────────────────────────────┴─────────┘
```

## Stopping a Devnet Environment

Once development and testing is complete, you can shut down the devnet environment by running the following command:

```shell
cartesi stop
```

Keep in mind that stopping the devnet environment will erase any previously deployed applications and their state. If you restart the devnet and still need those applications, you'll have to redeploy them.
