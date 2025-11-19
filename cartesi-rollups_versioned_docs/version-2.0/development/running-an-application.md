---
id: running-an-application
title: Running an application
resources:
  - url: https://cartesiscan.io/
    title: CartesiScan
---

Running your application creates a docker container containing all required services, and exposes your application node on port `6751`, then an anvil network specific to your application on port `6751/anvil`. The node also logs all outputs received by your backend.

Here are the prerequisites to run the node:

- Docker Engine must be active.
- Cartesi machine snapshot successfully built with `cartesi build`.

To start the node, run:

```shell
cartesi run
```

Response:

```shell
[+] Pulling 4/0
 ✔ proxy Skipped - Image is already present locally                                       0.0s 
 ✔ database Skipped - Image is already present locally                                    0.0s 
 ✔ rollups-node Skipped - Image is already present locally                                0.0s 
 ✔ anvil Skipped - Image is already present locally                                       0.0s 
✔ demo-application starting at http://127.0.0.1:6751
✔ anvil service ready at http://127.0.0.1:6751/anvil
✔ rpc service ready at http://127.0.0.1:6751/rpc
✔ inspect service ready at http://127.0.0.1:6751/inspect/demo-application
✔ demo-application machine hash is 0xa3ca2e40420f3c2424ca95549b6c16fd9b11c27d76b8ef9ae9bf78cde36829fc
✔ demo-application contract deployed at 0xa083af219355288722234c47d4c8469ca9af6605
(l) View logs   (b) Build and redeploy  (q) Quit
```

This command runs your backend compiled to RISC-V and packages it as a Cartesi machine. It is therefore important that after every code update, the application needs to be rebuilt then the run command executed again, the Cartesi CLI makes this process very easy and all you need do is hit the `<b>` button on your keyboard to trigger a rebuild and run command.

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

The `cartesi run` command activates several services essential for node operation: some of these services are not activated by default and can be activated by adding them to the `--service` flag when starting your application. The below command starts your application with all available services:

```shell
cartesi run --services explorer,bundler,paymaster,passkey
```

Each of these services runs independently and can be activated or deactivated at will by simply including or removing them from the list of services while running your application. Below is a breakdown of these services and their default URL's.

- **Anvil Chain**: Runs a local blockchain available at `http://localhost:6751/anvil`.

- **Explorer**: Monitors Rollups application activity and manages transactions via `http://localhost:6751/explorer`.

- **Inspect**: A diagnostic tool accessible at `http://localhost:6751/inspect/<app_name>` to inspect the node’s state.

- **Bundler**: A server accessible at `http://localhost:6751/bundler/rpc` to enable account abstraction by providing an alternative mempool for receiving and bundling user operations.

- **Paymaster**: An account abstraction implementation that works hand in hand with the bundler to sponsor gas fees for transactions handled by the bundler, available at `http://localhost:6751/paymaster`.

- **Passkey**: Runs a local passkey server, that enables account generation and interaction with application without a traditional wallet, available at `http://localhost:6751/passkey`

:::note Testing tools
[NoNodo](https://github.com/Calindra/nonodo) is a Cartesi Rollups testing tool that works with host machine applications, eliminating the need for Docker or RISC-V compilation.
:::
