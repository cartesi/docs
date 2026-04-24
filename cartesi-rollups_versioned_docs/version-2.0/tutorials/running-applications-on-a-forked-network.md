---
id: running-applications-on-a-forked-network
title: Running applications on a forked network
resources:
---

## Introduction

When building Cartesi applications, it is often necessary to interact with contracts and services that are already deployed on a live blockchain network. While a local clean chain is useful during early development, it does not always reflect real world conditions.

To address this, the Cartesi CLI introduces support for running applications on a forked network. This feature allows you to replicate the state of an existing blockchain locally and run your application against it.

This is enabled through two flags available in the `cartesi run` command:

- `--fork-url`
- `--fork-block-number`

Using these flags, the CLI forks a network from a given RPC endpoint at a specific block height, load that state into your local Anvil environment, then runs your Cartesi application on top of it.

This approach makes it possible to develop and test locally while interacting with real on chain data from networks such as testnets or mainnets.

## Understanding the fork options

### `--fork-url`

This flag specifies the RPC endpoint that will serve as the source of truth for the forked network.

Example:

```bash
--fork-url https://sample-rpc.sepolia.com
```

The CLI uses this endpoint to fetch blockchain state and replicate it locally.

### `--fork-block-number`

This flag defines the exact block height used as the snapshot point for the fork.

Example:

```bash
--fork-block-number 32768
```

Using a fixed block number ensures deterministic behavior, which is especially useful when debugging or running repeatable tests.

## Basic usage

To run your application on a forked network, execute:

```bash
cartesi run --fork-url https://sample-rpc.sepolia.com --fork-block-number 32768
```

When this command is executed, the Cartesi CLI performs the following steps:

1. Connects to the specified RPC endpoint
2. Fetches blockchain state at the given block number
3. Initializes a local network using the forked state
4. Deploys required Cartesi infrastructure contracts, including portals, InputBox, and test tokens
5. Starts the Cartesi node stack, allowing your application to run in this environment

## Why use a forked network

Running your application on a forked network provides several advantages:

- Enables interaction with contracts that already exist on the source network
- Allows reproduction of issues using a known blockchain state
- Improves development speed by enabling local iteration with realistic data
- Helps validate integration logic before deploying to public test networks

## Best practices

- Prefer stable and reliable HTTPS RPC endpoints
- Use a fixed block number during debugging to ensure consistent results
- Update the block number when you need access to more recent state
- Validate that the RPC endpoint is reachable if the command fails to start

## Deploying and interacting with a sample application

In this section, you will build a simple end to end example that demonstrates how a Cartesi application can interact with a contract that already exists on a forked network.

The workflow follows a practical sequence:

- set up your development environment
- create a new Cartesi application
- deploy a contract to Sepolia
- run your application on a forked network
- interact with the deployed contract through the fork

### Set up your environment

Before getting started, ensure the following tools are installed:

- Cartesi CLI: A simple tool for building applications on Cartesi. [Install Cartesi CLI for your OS of choice](../development/installation.md).

- Docker Desktop 4.x: The tool you need to run the Cartesi Machine and its dependencies. [Install Docker for your OS of choice](https://www.docker.com/products/docker-desktop/).

### Create an application template using the Cartesi CLI

Use the Cartesi CLI to generate a starter application:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

```shell
cartesi create fork-seploia --template javascript
```

</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>

```shell
cartesi create fork-seploia --template python
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

```shell
cartesi create fork-seploia --template rust
```

</code></pre>
</TabItem>
</Tabs>

This command creates a new directory named `fork-seploia`. Depending on the selected language, the directory includes a basic project structure and an entry point for your application logic.

### Create and deploy a Solidity contract to Sepolia

Next, you will create and deploy a Solidity contract named `InputRelayer` to Sepolia.

This contract acts as a simple relay layer. It receives a user request and forwards it to the Cartesi InputBox contract. Your Cartesi application will later receive this input, decode it, and process the message.

In a real world scenario, this contract could represent an existing protocol such as a liquidity pool manager, a swap router, or any deployed smart contract that your application integrates with.

#### Create and implement contract logic

Inside the `fork-seploia` directory, create a `contracts` folder and add the `InputRelayer.sol` file:

```bash
mkdir contracts
touch contracts/InputRelayer.sol
```

Then copy the Solidity implementation into the file. This contract accepts a destination, an InputBox address, and user input. It encodes the request and forwards it to the specified InputBox.

import InputReaderSolidity from './snippets/inputRelayer-sol.md';

<Tabs>
  <TabItem value="Solidity" label="Solidity" default>
<pre><code>

<InputReaderSolidity />

</code></pre>
</TabItem>
</Tabs>

#### Deploy contract to Base Sepolia

Deploy the contract to Base Sepolia using the following command:

```bash
forge create contracts/InputRelayer.sol:InputRelayer --rpc-url <RPC-Url> --private-key <Deployment Private Key with Eth token> --broadcast -v
```

This returns an output similar to:

```bash
[⠊] Compiling...
No files changed, compilation skipped
Deployer: 0xbD8Eba8Bf9e56ad92F4C4Fc89D6CB88902535749
Deployed to: 0x06eBAF6d44B65d76C8BDcB1701E68f44C22B1057
Transaction hash: 0xa5c073210568d1d8b11b2ff6bed0d7bd0d8058cfcf0ec561f51b5de9c8e21644
```

After deployment, inspect the transaction using a block explorer. Take note of the block number in which the transaction was included, as this will be used later when configuring the fork.

### Implementing the Cartesi application logic

Now implement the logic for your Cartesi application.

This application will:

- receive inputs from the onchain relayer
- decode the payload
- extract the original sender and message
- store the data in memory
- log a structured summary of the received input

To set this up, replace the contents of the `src/` directory inside `fork-seploia` with the appropriate snippet for your chosen language.

import ForkSepoliaRs from './snippets/fork-sepolia-rs.md';
import ForkSepoliaJs from './snippets/fork-sepolia-js.md';

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

<ForkSepoliaJs />

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

<ForkSepoliaRs />

</code></pre>
</TabItem>
</Tabs>

## Build and run your application

Once your application logic is in place, build the project by running:

```shell
cartesi build
```

This command compiles your application and produces a Cartesi Machine image that includes your code.

Next, run the application using a forked network. Provide the RPC endpoint for Base Sepolia and the block number where the `InputRelayer` contract was deployed:

```bash
cartesi run --fork-url <Valid RPC URL> --fork-block-number 39988953
```

### Expected logs

```shell
WARNING: default block is set to 'latest', production configuration will likely use 'finalized'
✔ fork-sepolia-r starting at http://127.0.0.1:6751
✔ anvil service ready at http://127.0.0.1:6751/anvil
✔ rpc service ready at http://127.0.0.1:6751/rpc
✔ inspect service ready at http://127.0.0.1:6751/inspect/fork-sepolia-r
✔ fork-sepolia-r machine hash is 0xa5b369b0d19766005d12369d0fa588925093ffe24c44c64c76155734270b7ac7
✔ fork-sepolia-r contract deployed at 0xa831a9883abc2ae26c643b3cab57498b8c6fcb52
(l) View logs   (b) Build and redeploy  (q) Quit
```

At this point, your application is running on a local network that mirrors the state of Base Sepolia at the specified block.

## Interacting with the Cartesi application through the forked contract

Because the network was forked at a block where the `InputRelayer` contract already exists, you can interact with your application through this contract as if you were on the original network.

Use the following command to send an input through the relayer:

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <InputRelayer address> "relayInput(address,address,bytes)" <application address> <input-box address> --rpc-url <application local rpc_url> --private-key <private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
cast send 0x06eBAF6d44B65d76C8BDcB1701E68f44C22B1057 "relayInput(address,address,bytes)" 0xa831a9883abc2ae26c643b3cab57498b8c6fcb52 0x1b51e2992A2755Ba4D6F7094032DF91991a0Cfac "0xd8da6bf26964af9d7eed9e03e53415d37aa9604548656c6c6f2066726f6d204361727465736921"  --rpc-url http://127.0.0.1:6751/anvil --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

</code></pre>
</TabItem>

</Tabs>

This command calls the `relayInput(address,address,bytes)` function on the relayer contract, passing:

- the Cartesi application address
- the InputBox address
- the encoded user input

Ensure that you replace the application address and RPC URL with the values returned when you executed `cartesi run`.

### Expected logs

```bash
[INFO  rollup_http_server::http_service] received new request of type ADVANCE
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 434 "-" "-" 0.018560
Received finish status 200 OK
Received advance request data {"request_type":"advance_state","data":{"metadata":{"chain_id":31337,"app_contract":"0xa831a9883abc2ae26c643b3cab57498b8c6fcb52","msg_sender":"0x06ebaf6d44b65d76c8bdcb1701e68f44c22b1057","block_number":39989157,"block_timestamp":1775746604,"prev_randao":"0x50244e200a55ed7d32e48e6f0c32710fe89c537345036bf55a02608736d25cc2","input_index":1},"payload":"0xd8da6bf26964af9d7eed9e03e53415d37aa9604548656c6c6f2066726f6d204361727465736921"}}
[InputRelayer] input_index=1 relayer=0x06ebaf6d44b65d76c8bdcb1701e68f44c22b1057 original_sender=0xd8da6bf26964af9d7eed9e03e53415d37aa96045 message="Hello from Cartesi!"
Sending finish
```

## Summary

In this section, you successfully:

- deployed a contract to Sepolia
- forked the network locally at a specific block
- ran a Cartesi application on top of that fork
- interacted with the application through an already deployed contract

This demonstrates how the Cartesi CLI can be used to replicate real blockchain environments locally, enabling integration and interaction with already deployed contracts during development and testing.
