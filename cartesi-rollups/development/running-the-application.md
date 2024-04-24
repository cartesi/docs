---
id: running-the-application
title: Running the application
resources:
  - url: https://github.com/gligneul/nonodo/tree/main
    title: NoNodo
---

Running your application starts your backend on port `8080` and local Anvil node on port `8545`.

In essence, the node also logs all outputs received by your backend.

You can run your application in 2 different modes — **production** or **NoNodo**.

NoNodo is a light development tool that does not require Docker running and allows running the backend application without a node.

## Production Mode

Here are the prerequisites to run the node in production mode:

- Docker Engine must be active.
- Cartesi machine snapshot successfully built with `sunodo build`.

To start the node in production mode:

```
sunodo run
```

This command runs your backend compiled to RISC-V and packages it as a Cartesi machine.

:::troubleshoot troubleshooting common errors

##### Error: Depth Too High
```
Attaching to 2bd74695-prompt-1, 2bd74695-validator-1
2bd74695-validator-1  | Error: DepthTooHigh { depth: 2, latest: 1 }
2bd74695-validator-1  | Error: DepthTooHigh { depth: 2, latest: 1 }
```

This indicates that the node is reading blocks too far behind the current blockchain state.

##### Solution:

Create or modify a `.sunodo.env` file in your project directory and set:

```
TX_DEFAULT_CONFIRMATIONS=1
```
This adjustment should align the node's block reading with the blockchain's current state.

:::

### Overview of Node Services

The `sunodo run` command activates several services essential for node operation:

- **Anvil Chain**: Runs a local blockchain available at `http://localhost:8545`.

- **GraphQL Playground**: An interactive IDE at `http://localhost:8080/graphql` for exploring the GraphQL server.

- **Blockchain Explorer**: Monitors node activity and manages transactions via `http://localhost:8080/explorer/`.

- **Inspect**: A diagnostic tool accessible at `http://localhost:8080/inspect/` to inspect the node’s state.


## NoNodo (Testing & Development)

NoNodo is a development tool for Cartesi Rollups designed to work with applications running in the host machine instead of the Cartesi machine. With NoNodo, you don’t need to run Docker or compile the application to RISC-V.

:::caution important

- Applications may still require RISC-V compilation even for interpreted languages, as they use libraries with binaries for x64 platforms.

- NoNodo works for applications that use the Cartesi Rollups HTTP API and doesn't work with applications using the low-level API.

- NoNodo offers an improved speed and performance compared to running your application inside a Cartesi machine.

:::

### Prerequisites

Set up Anvil on your system. Refer to [the instructions in the Foundry book for Anvil installation](https://book.getfoundry.sh/anvil/) details.

### Install from source

Install Go by following [the instructions on the official Go website](https://go.dev/doc/install).

Run the following command to install NoNodo:

```
go install github.com/gligneul/nonodo@latest
```

This command will install NoNodo into the bin directory inside the directory specified by the `GOPATH` environment variable.

Set `GOPATH` to use the NoNodo command directly.

To use the NoNodo command directly, add it to the PATH variable by running:

```
export PATH="$HOME/go/bin:$PATH"
```

### Usage

To start NoNodo with the default configuration, run:

```
nonodo
```

This command creates an Anvil node with the Cartesi Rollups contracts deployed by default. NoNodo uses the same deployment as Sunodo, so the contract addresses remain the same.

### Exposed APIs

GraphQL API: This API is accessible via `/graphql` and is designed for frontend clients to query notices, vouchers, and reports.

- Inspect API: Accessible via `/inspect`; this API is useful for frontend clients who want to inspect the internal state.

- Rollup API: Accessible via `/rollup`, this API serves as the application backend.

### Running the application

NoNodo can run the application backend as a sub-process.

This option helps keep the entire development in a single terminal. To use it, pass the command to run the application after `--`.

```
nonodo -- ./my-app
```

### Built-in Echo Application

NoNodo has a built-in echo application that generates a voucher, a notice, and a report for each advance input.

The echo also generates a report for each inspected input. This option is useful when testing the application frontend without a working backend.

To start NoNodo with the built-in echo application, use the `--enable-echo` flag.

```
nonodo --enable-echo
```

### Configuration

NoNodo provides configuration flags to customize the behavior of the Anvil node. Flags begin with `--anvil-*`.

NoNodo binds to the HTTP address and port specified by the `--http-address` and `--http-port` flags.

By default, it binds to `http://127.0.0.1:8080/`.

## CartesiScan

[CartesiScan](https://cartesiscan.io/) is a valuable tool for developers and users alike, offering a comprehensive overview of Cartesi Rollups applications and their interactions with the blockchain.

Key features include a Connect Wallet option, a list of dApps built on Cartesi Rollups, a log of inputs for Cartesi Rollups, and detailed information about inputs such as sender, receiver, portal used, asset amount, and the method employed.

Additionally, it provides expandable data regarding outputs, encompassing notices, vouchers, and reports.
