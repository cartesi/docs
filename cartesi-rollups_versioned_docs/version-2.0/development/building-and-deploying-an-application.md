---
id: building-and-deploying-an-application
title: Building and Deploying an Application
resources:
  - url: https://github.com/Calindra/nonodo
    title: NoNodo
  - url: https://cartesiscan.io/
    title: CartesiScan
---

## Creating the application

Cartesi CLI simplifies creating applications on Cartesi. To create a new application, run:

```shell
cartesi create <application-name> --template <language>
```

For example, create a Python project.

```shell
cartesi create new-application --template python
```

This command creates a `new-application` directory with essential files for your application development.

- `Dockerfile`: Contains configurations to build a complete Cartesi machine with your app's dependencies. Your backend code will run in this environment.

- `README.md`: A markdown file with basic information and instructions about your application.

- `dapp.py`: A Python file with template backend code that serves as your application's entry point.

- `requirements.txt`: Lists the Python dependencies required for your application.

Cartesi CLI has templates for the following languages – `cpp`, `cpp-low-level`, `go`, `javascript`, `lua`, `python`, `ruby`, `rust`, and `typescript`.

After creating your application, you can start codding your application by adding your logic to the `dapp.py` file.

:::note Building with Go?
For Go applications on Cartesi, we recommend using [Rollmelette](https://github.com/rollmelette/rollmelette). It’s a high-level Go framework and an alternative template that simplifies development and enhances input management, providing a smoother and more efficient experience.
:::

## Building the application

“Building” in this context compiles your application into RISC-V architecture and consequently builds a Cartesi machine containing your application. This architecture enables computation done by your application to be reproducible and verifiable.

With the Docker engine running, change the directory to your application and build by running:

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

Docker Engine is active.
The Devnet environment is running.
A Cartesi machine snapshot has been successfully built using `cartesi build`.
Deployment Command
Once these prerequisites are met, deploy your application by running:

```shell
cartesi rollups deploy
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
