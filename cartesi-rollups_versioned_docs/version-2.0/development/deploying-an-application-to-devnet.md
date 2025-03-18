---
id: deploying-an-application-to-devnet
title: Deploying an application to devnet
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

## Running the Application

Running your application starts your backend on port `8080` and local Anvil node on port `8545`.

In essence, the node also logs all outputs received by your backend.

Here are the prerequisites to run the node:

- Docker Engine must be active.
- Cartesi machine snapshot successfully built with `cartesi build`.

To start the node, run:

```shell
cartesi run
```

This command runs your backend compiled to RISC-V and packages it as a Cartesi machine.



