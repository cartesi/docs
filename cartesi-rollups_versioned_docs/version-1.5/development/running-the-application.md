---
id: running-the-application
title: Running the application
resources:
  - url: https://github.com/Calindra/nonodo
    title: NoNodo
  - url: https://cartesiscan.io/
    title: CartesiScan
---

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


## CartesiScan

[CartesiScan](https://cartesiscan.io/) is a valuable tool for developers and users alike, offering a comprehensive overview of Cartesi Rollups applications and their interactions with the blockchain.

Additionally, it provides expandable data regarding outputs, encompassing notices, vouchers, and reports.

When you run your application with `cartesi run` , there is a local instance of CartesiScan on `http://localhost:8080/explorer`.

:::note Testing tools
[NoNodo](https://github.com/Calindra/nonodo) is a Cartesi Rollups testing tool that works with host machine applications, eliminating the need for Docker or RISC-V compilation.
:::
