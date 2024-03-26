---
id: running-the-application
title: Running the application
tags: [nonodo, sunodo]
resources:
   - url: https://github.com/gligneul/nonodo/tree/main
     title: NoNodo
---

Running your application creates a local anvil chain/node on port `8545`.

In essence, the node also logs all outputs received by your backend.

You can run your application in 2 different modes — **production** or **NoNodo**.

NoNodo is a light development tool that does not require Docker.

## Production Mode

Before running in this mode, you must successfully build a Cartesi machine snapshot with sunodo build.

To start in production mode, the Docker Engine must be on. Run the following command:

```
sunodo run
```

`sunodo run` will run a node with your backend compiled to RISC-V and packaged as a Cartesi machine.

After successfully running a node, your application can receive inputs.

:::troubleshoot

```
Error: Depth Too High

Attaching to 2bd74695-prompt-1, 2bd74695-validator-1
2bd74695-validator-1  | Error: DepthTooHigh { depth: 2, latest: 1 }
2bd74695-validator-1  | Error: DepthTooHigh { depth: 2, latest: 1 }
```

This error happens when the node reads too many blocks behind the blockchain.

To fix this, create a `.sunodo.env.` and overwrite the set `TX_DEFAULT_CONFIRMATIONS` to 1, as in:

```
TX_DEFAULT_CONFIRMATIONS=1
```

:::

## NoNodo (Testing & Development)

NoNodo is a development tool for Cartesi Rollups designed to work with applications running in the host machine instead of the Cartesi machine. With NoNodo, you don’t need to run Docker or compile the application to RISC-V.


:::note
Applications may require RISC-V compilation for interpreted languages. NoNodo allows unrestricted operations outside Cartesi's sandbox but lacks support for Cartesi-specific behaviors like full machine reversion. 

Additionally, NoNodo exclusively supports applications utilizing the Cartesi Rollups HTTP API, with performance degradation and input delays compared to running locally.
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

GraphQL API: This API is accessible via `/graphql` and is designed for front-end clients to query notices, vouchers, and reports.

- Inspect API: Accessible via `/inspect`; this API is useful for frontend clients who want to inspect the internal state.

- Rollup API: Accessible via `/rollup`, this API serves as the application backend.

### Running the application

NoNodo can run the application back-end as a sub-process.

This option helps keep the entire development in a single terminal. To use it, pass the command to run the application after `--`.

```
nonodo -- ./my-app
```

### Built-in Echo Application

NoNodo has a built-in echo application that generates a voucher, a notice, and a report for each advance input.

The echo also generates a report for each inspected input. This option is useful when testing the application front-end without a working back-end.

To start NoNodo with the built-in echo application, use the `--enable-echo` flag.

```
nonodo --enable-echo
```

### Configuration

NoNodo provides configuration flags to customize the behavior of the Anvil node. Flags begin with `--anvil-*`.

NoNodo binds to the HTTP address and port specified by the `--http-address` and `--http-port` flags.

By default, it binds to `http://127.0.0.1:8080/`.

