---
id: building-a-dapp
title: Building a dApp
resources:
  - url: https://github.com/Calindra/nonodo
    title: NoNodo
  - url: https://cartesiscan.io/
    title: CartesiScan
---


## Creating the application
Cartesi CLI simplifies creating dApps on Cartesi. To create a new application, run:

```shell
cartesi create <dapp-name> --template <language>
```

For example, create a Python project.

```shell
cartesi create new-dapp --template python
```

This command creates a `new-dapp` directory with essential files for your dApp development.

- `Dockerfile`: Contains configurations to build a complete Cartesi machine with your app's dependencies. Your backend code will run in this environment.

- `README.md`: A markdown file with basic information and instructions about your dApp.

- `dapp.py`: A Python file with template backend code that serves as your application's entry point.

- `requirements.txt`: Lists the Python dependencies required for your application.

Cartesi CLI has templates for the following languages – `cpp`, `cpp-low-level`, `go`, `javascript`, `lua`, `python`, `ruby`, `rust`, and `typescript`.

After creating your application, you can start building your dApp by adding your logic to the `dapp.py` file.


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
[INFO  rollup_http_server::dapp_process] starting dapp
INFO:__main__:HTTP rollup_server url is http://127.0.0.1:5004
INFO:__main__:Sending finish

Manual yield rx-accepted (0x100000000 data)
Cycles: 2767791744
2767791744: b740d27cf75b6cb10b1ab18ebd96be445ca8011143d94d8573221342108822f5
Storing machine: please wait
Successfully copied 288MB to /Users/michaelasiedu/Code/calculator/python/.cartesi/image
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

:::troubleshoot troubleshooting common errors

#### Error: Depth Too High

```shell
Attaching to 2bd74695-prompt-1, 2bd74695-validator-1
2bd74695-validator-1  | Error: DepthTooHigh { depth: 2, latest: 1 }
2bd74695-validator-1  | Error: DepthTooHigh { depth: 2, latest: 1 }
```

This indicates that the node is reading blocks too far behind the current blockchain state.

#### Solution

Create or modify a `.cartesi.env` file in your project directory and set:

```shell
TX_DEFAULT_CONFIRMATIONS=1
```

This adjustment should align the node's block reading with the blockchain's current state.

:::

### Overview of Node Services

The `cartesi run` command activates several services essential for node operation:

- **Anvil Chain**: Runs a local blockchain available at `http://localhost:8545`.

- **GraphQL Playground**: An interactive IDE at `http://localhost:8080/graphql` for exploring the GraphQL server.

- **Blockchain Explorer**: Monitors node activity and manages transactions via `http://localhost:8080/explorer/`.

- **Inspect**: A diagnostic tool accessible at `http://localhost:8080/inspect/` to inspect the node’s state.


### CartesiScan

[CartesiScan](https://cartesiscan.io/) is a valuable tool for developers and users alike, offering a comprehensive overview of Cartesi Rollups applications and their interactions with the blockchain.

Additionally, it provides expandable data regarding outputs, encompassing notices, vouchers, and reports.

When you run your application with `cartesi run` , there is a local instance of CartesiScan on `http://localhost:8080/explorer`.

:::note Testing tools
[NoNodo](https://github.com/Calindra/nonodo) is a Cartesi Rollups testing tool that works with host machine applications, eliminating the need for Docker or RISC-V compilation.
:::
