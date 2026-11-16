> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

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

### Overview of Node Services

The `cartesi run` command activates several services essential for node operation: some of these services are not activated by default and can be activated by adding them to the `--service` flag when starting your application. The below command starts your application with all available services:

```shell
cartesi run --services explorer,bundler,paymaster,passkey
```

Each of these services runs independently and can be activated or deactivated at will by simply including or removing them from the list of services while running your application. Below is a breakdown of these services and their default URL's.

- **Anvil Chain**: Runs a local blockchain available at `http://localhost:6751/anvil`.

  :::caution Be careful with devnet account 0
  The local node signs its claims with devnet account 0 (`0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`), the first account of the anvil mnemonic. Do not send your own transactions from it: they compete with the node's transactions for the same nonce and can be dropped, even when the command that sent them reports success. `cartesi send` and `cartesi deposit` use devnet account 8 (`0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f`) by default; with `--from`, `cast` or a wallet, use any account except account 0. See [Send inputs](./send-inputs-and-assets.md#initiate-an-advance-request).
  :::

- **Explorer**: Monitors Rollups application activity and manages transactions via `http://localhost:6751/explorer`.

- **Inspect**: A diagnostic tool accessible at `http://localhost:6751/inspect/<app_name>` to inspect the node’s state.

- **Bundler**: A server accessible at `http://localhost:6751/bundler/rpc` to enable account abstraction by providing an alternative mempool for receiving and bundling user operations.

- **Paymaster**: An account abstraction implementation that works hand in hand with the bundler to sponsor gas fees for transactions handled by the bundler, available at `http://localhost:6751/paymaster`.

- **Passkey**: Runs a local passkey server, that enables account generation and interaction with application without a traditional wallet, available at `http://localhost:6751/passkey`

:::note Testing tools
[NoNodo](https://github.com/Calindra/nonodo/tree/1400b7f184f9b4293561f73127d9eac91a677098) is a Cartesi Rollups testing tool that works with host machine applications, eliminating the need for Docker or RISC-V compilation.
:::
