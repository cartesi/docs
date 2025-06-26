---
id: running-an-application
title: Running an application
resources:
  - url: https://cartesiscan.io/
    title: CartesiScan
---

Running an application locally mimics the process of deploying an application to production on a testnet or mainnet environment. When working locally, your application’s smart contracts are deployed to an Anvil network, which acts as a local Ethereum environment. The main difference is that your application node runs on your own machine using Docker, rather than on a remote server. Running an application involves two main phases: first, you build your application, and then you deploy it to your local development network (devnet). This process allows you to test and debug your application in an environment that closely resembles the real blockchain, making it easier to catch issues early and ensure a smooth deployment to production later.

## Building the application

“Building” in this context compiles your application into RISC-V architecture, this architecture enables computation done by your application to be reproducible and verifiable. While "Running" encompasses the process of publishing your application to your local node running on docker and also deploying the necessary contracts for your application to a local Anvil devnet.

With the Docker engine running, CD into your application and build by running:

```shell
cartesi build
```

The successful execution of this step will log this in your terminal:

```shell

         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI
        \ /   MACHINE
         '

[INFO  rollup_http_server] starting http dispatcher service...
[INFO  rollup_http_server::http_service] starting http dispatcher http service!
[INFO  actix_server::builder] starting 1 workers
[INFO  actix_server::server] Actix runtime found; starting in Actix runtime
[INFO  rollup_http_server::dapp_process] starting dapp: dapp
Sending finish

Manual yield rx-accepted (1) (0x000020 data)
Cycles: 69709199
69709199: 9e0420c0fda1a5dc9256b3f9783b09f207e5222a88429e91629cc2e495282b35
Storing machine: please wait
```

### Memory

To change the default memory size for the Cartesi Machine, you can personalize it by adding a specific label in your Dockerfile.

The line below lets you define the memory size in megabytes (MB):

```dockerfile
LABEL io.cartesi.rollups.ram_size=128Mi
```

:::note environment variables
You can create a `.cartesi.env` in the project's root and override any variable controlling the rollups-node.
:::

## Deploying the application to devnet

Running the deployment command compiles your application and publishes it to the node running in the devnet environment. It also deploys the required authority and application contracts to the local Anvil network.

You can deploy multiple applications to this environment. For each application, you can either create a new authority contract or link it to an existing one.

Prerequisites for Deployment
Before deploying your application, ensure the following:

- Docker Engine is active.
- The Devnet environment is running.
- A Cartesi machine snapshot has been successfully built using `cartesi build`.

Once these prerequisites are met, proceed to deploy your application by running:

```shell
cartesi deploy
```

This command compiles your backend to RISC-V, packages it as a Cartesi machine, then publishes it to the node running on the devnet.

During deployment, you'll have to specify:

- Private key or Mnemonic to fund the deployment.
- The authority owner address.
- The application owner address.
- An application name (making it easier to identify your application instead of relying on the contract address).

Once the deployment is complete, you should have logs similar to the following:

```shell
✔ Cartesi machine template hash 0x9e0420c0fda1a5dc9256b3f9783b09f207e5222a88429e91629cc2e495282b35
✔ Wallet Mnemonic
✔ Mnemonic test test test test test test test test test test test junk
✔ Account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 9994.000195973381758124 ETH
✔ Authority Owner 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
✔ Application Owner 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
✔ Application 0x1Db6DdECF18095847f7099cfAc43A2671326d21c
✔ Machine snapshot /var/lib/cartesi-rollups-node/snapshots/0x9e0420c0fda1a5dc9256b3f9783b09f207e5222a88429e91629cc2e495282b35/
✔ Application Name counter
✔ Registration counter
```
