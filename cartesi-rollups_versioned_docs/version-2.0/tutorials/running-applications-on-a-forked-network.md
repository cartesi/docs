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
- Use an RPC endpoint that serves historical state (an archive node) when the Cartesi contracts already exist on the source network: the node reads inputs from the block where the `InputBox` was deployed, and an endpoint that has pruned that state returns an error such as `pruned history unavailable`, so your application receives no inputs
- Use a fixed block number during debugging to ensure consistent results
- Update the block number when you need access to more recent state
- Validate that the RPC endpoint is reachable if the command fails to start

## Deploying and interacting with a sample application

In this section, you will build a simple end to end example that demonstrates how a Cartesi application can interact with a contract that already exists on a forked network.

The workflow follows a practical sequence:

- set up your development environment
- create a new Cartesi application
- deploy a contract to Sepolia or Base Sepolia
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

### Create and deploy a Solidity contract to Sepolia or Base Sepolia

Next, you will create and deploy a Solidity contract named `InputRelayer` to Sepolia or Base Sepolia. The steps that differ between the two networks are shown in tabs.

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

#### Deploy the contract

<Tabs groupId="network">
<TabItem value="sepolia" label="Sepolia" default>

Deploy the contract to Sepolia using the following command:

```bash
forge create contracts/InputRelayer.sol:InputRelayer --rpc-url <Sepolia RPC URL> --private-key <Deployment Private Key with Eth token> --broadcast -v
```

This returns an output similar to:

```bash
[⠊] Compiling...
No files changed, compilation skipped
Deployer: <your deployer address>
Deployed to: 0x070dC307580c1e3E8eE23836419A0c49780d358D
Transaction hash: <deployment transaction hash>
```

After deployment, inspect the transaction using a block explorer. Take note of the block number in which the transaction was included, as this will be used later when configuring the fork.

</TabItem>
<TabItem value="base-sepolia" label="Base Sepolia">

Deploy the contract to Base Sepolia using the following command:

```bash
forge create contracts/InputRelayer.sol:InputRelayer --rpc-url <Base Sepolia RPC URL> --private-key <Deployment Private Key with Base Sepolia ETH> --broadcast -v
```

This returns an output similar to:

```bash
[⠊] Compiling...
No files changed, compilation skipped
Deployer: 0xbD8Eba8Bf9e56ad92F4C4Fc89D6CB88902535749
Deployed to: 0x06eBAF6d44B65d76C8BDcB1701E68f44C22B1057
Transaction hash: 0xa5c073210568d1d8b11b2ff6bed0d7bd0d8058cfcf0ec561f51b5de9c8e21644
```

After deployment, inspect the transaction using a Base Sepolia block explorer. Take note of the block number in which the transaction was included, as you will need it to choose the fork block. The sample transaction above was included in block `39988953`.

:::note
An `InputRelayer` compiled from this source is already deployed on Base Sepolia at `0x06eBAF6d44B65d76C8BDcB1701E68f44C22B1057`. You can use it instead of deploying your own. The Base Sepolia samples in this tutorial use it.
:::

</TabItem>
</Tabs>

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

<Tabs groupId="network">
<TabItem value="sepolia" label="Sepolia" default>

Next, run the application using a forked network. Provide a Sepolia RPC endpoint that serves historical state (see [Best practices](#best-practices)) and the block number where the `InputRelayer` contract was deployed, for example `12148080`:

```bash
cartesi run --fork-url <Sepolia RPC URL> --fork-block-number <InputRelayer deployment block>
```

</TabItem>
<TabItem value="base-sepolia" label="Base Sepolia">

Next, run the application using a forked network. Provide a Base Sepolia RPC endpoint that serves historical state (see [Best practices](#best-practices)), such as `https://base-sepolia.gateway.tenderly.co`, and a fork block number that is at or after both of these blocks:

- the block where your `InputRelayer` contract was deployed
- block `46217246`, where the Cartesi `InputBox` was deployed on Base Sepolia

The sample `InputRelayer` was deployed in block `39988953`, before the `InputBox` existed, so the sample forks at block `46217246`:

```bash
cartesi run --fork-url <Base Sepolia RPC URL> --fork-block-number <block at or after both deployments>
```

For example:

```bash
cartesi run --fork-url https://base-sepolia.gateway.tenderly.co --fork-block-number 46217246
```

If the fork block is earlier than block `46217246`, the Cartesi contracts do not exist yet at that block, and `cartesi run` stops with:

```shell
Unsupported fork chain 84532:
No deployment found at address 0xEbE9f4Dfc04ae10bBeE663859c3dc5A23f94eA3C for contract InputBox on chain 84532 at block 39988953
No deployment found at address 0x035b11Be55656c6cfC822D1CaE568C1Af2e497b0 for contract EtherPortal on chain 84532 at block 39988953
No deployment found at address 0x3332DE61a8BB9aC84893b2f552Fe81C9a6dC5419 for contract ERC20Portal on chain 84532 at block 39988953
No deployment found at address 0x397c352d18DFf47CC8a6143403142cf7afd5Ff7E for contract ERC721Portal on chain 84532 at block 39988953
No deployment found at address 0x585F56351A66f131E176a345662215C772f80451 for contract ERC1155SinglePortal on chain 84532 at block 39988953
No deployment found at address 0xee33550a22e3Cf6Cc265524dC9bcfD99D2307EBe for contract ERC1155BatchPortal on chain 84532 at block 39988953
```

The public endpoint `https://base-sepolia-rpc.publicnode.com` does not serve this history: for block `46217246` it returns `pruned history unavailable`.

</TabItem>
</Tabs>

### Expected logs

<Tabs groupId="network">
<TabItem value="sepolia" label="Sepolia" default>

```shell
WARNING: default block is set to 'latest', production configuration will likely use 'finalized'
✔ fork-sepolia-r starting at http://127.0.0.1:6751
✔ anvil service ready at http://127.0.0.1:6751/anvil
✔ rpc service ready at http://127.0.0.1:6751/rpc
✔ inspect service ready at http://127.0.0.1:6751/inspect/fork-sepolia-r
✔ fork-sepolia-r machine hash is 0xa5b369b0d19766005d12369d0fa588925093ffe24c44c64c76155734270b7ac7
✔ fork-sepolia-r contract deployed at 0xebdd61633d7767beaf16c86b08ec7ab542719e14
(l) View logs   (b) Build and redeploy  (q) Quit
```

At this point, your application is running on a local network that mirrors the state of Sepolia at the specified block.

</TabItem>
<TabItem value="base-sepolia" label="Base Sepolia">

```shell
WARNING: default block is set to 'latest', production configuration will likely use 'finalized'
✔ fork-base-sepolia starting at http://127.0.0.1:6751
✔ anvil service ready at http://127.0.0.1:6751/anvil
✔ rpc service ready at http://127.0.0.1:6751/rpc
✔ inspect service ready at http://127.0.0.1:6751/inspect/fork-base-sepolia
✔ fork-base-sepolia machine hash is 0xf091ca929ce2f7a37099b07c64ede5f18bfe95b31ba8660b2d2450b90089d381
✔ fork-base-sepolia contract deployed at 0xebdd61633d7767beaf16c86b08ec7ab542719e14
(l) View logs   (b) Build and redeploy  (q) Quit
```

At this point, your application is running on a local network that mirrors the state of Base Sepolia at the specified block.

</TabItem>
</Tabs>

## Interacting with the Cartesi application through the forked contract

Because the network was forked at a block where the `InputRelayer` contract already exists, you can interact with your application through this contract as if you were on the original network.

Use the following command to send an input through the relayer:

<Tabs groupId="network">

<TabItem value="structure" label="Structure" default>
<pre><code>

```bash
cast send <InputRelayer address> "relayInput(address,address,bytes)" <application address> <input-box address> <input payload> --rpc-url <application local rpc_url> --private-key <private key>
```

</code></pre>
</TabItem>

<TabItem value="sepolia" label="Sepolia sample">
<pre><code>

```bash
cast send 0x070dC307580c1e3E8eE23836419A0c49780d358D "relayInput(address,address,bytes)" 0xeBDd61633D7767BEAF16c86b08eC7AB542719E14 0xEbE9f4Dfc04ae10bBeE663859c3dc5A23f94eA3C "0xd8da6bf26964af9d7eed9e03e53415d37aa9604548656c6c6f2066726f6d204361727465736921"  --rpc-url http://127.0.0.1:6751/anvil --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
```

</code></pre>
</TabItem>

<TabItem value="base-sepolia" label="Base Sepolia sample">
<pre><code>

```bash
cast send 0x06eBAF6d44B65d76C8BDcB1701E68f44C22B1057 "relayInput(address,address,bytes)" 0xeBDd61633D7767BEAF16c86b08eC7AB542719E14 0xEbE9f4Dfc04ae10bBeE663859c3dc5A23f94eA3C "0xd8da6bf26964af9d7eed9e03e53415d37aa9604548656c6c6f2066726f6d204361727465736921" --rpc-url http://127.0.0.1:6751/anvil --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
```

</code></pre>
</TabItem>

</Tabs>

This command calls the `relayInput(address,address,bytes)` function on the relayer contract, passing:

- the Cartesi application address
- the InputBox address
- the encoded user input

Ensure that you replace the `InputRelayer` address with the address printed by `forge create`, the application address and RPC URL with the values returned when you executed `cartesi run`, and the InputBox address with the input box your application was deployed with (returned by the application's `getInputBox()` function, and listed as `InputBox` by `cartesi address-book`).

:::note
On a Base Sepolia fork, `cartesi address-book` exits with `Unsupported fork chain 84532`. Read the InputBox address from the application instead:

```bash
cast call <application address> "getInputBox()(address)" --rpc-url http://127.0.0.1:6751/anvil
```

For the sample application, this returns `0xEbE9f4Dfc04ae10bBeE663859c3dc5A23f94eA3C`.
:::

### Expected logs

<Tabs groupId="network">
<TabItem value="sepolia" label="Sepolia" default>

```bash
[INFO  rollup_http_server::http_service] received new request of type ADVANCE
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 434 "-" "-" 0.018560
Received finish status 200 OK
Received advance request data {"request_type":"advance_state","data":{"metadata":{"chain_id":31337,"app_contract":"0xebdd61633d7767beaf16c86b08ec7ab542719e14","msg_sender":"0x070dc307580c1e3e8ee23836419a0c49780d358d","block_number":12148163,"block_timestamp":1794842144,"prev_randao":"0xec08afe391faa075a0d4b94bef4b21dbb166885b87f98c56100bb446a1ea532e","input_index":0},"payload":"0xd8da6bf26964af9d7eed9e03e53415d37aa9604548656c6c6f2066726f6d204361727465736921"}}
[InputRelayer] input_index=0 relayer=0x070dc307580c1e3e8ee23836419a0c49780d358d original_sender=0xd8da6bf26964af9d7eed9e03e53415d37aa96045 message="Hello from Cartesi!"
Sending finish
```

</TabItem>
<TabItem value="base-sepolia" label="Base Sepolia">

```bash
[INFO  rollup_http_server::http_service] received new request of type ADVANCE
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 434 "-" "-" 0.020416
Received finish status 200 OK
Received advance request data {"request_type":"advance_state","data":{"metadata":{"chain_id":31337,"app_contract":"0xebdd61633d7767beaf16c86b08ec7ab542719e14","msg_sender":"0x06ebaf6d44b65d76c8bdcb1701e68f44c22b1057","block_number":46217276,"block_timestamp":1788202842,"prev_randao":"0x6cddda3b61bb23e3642c17f2ad5230db7b93393d115570aa89710feebee10bc4","input_index":0},"payload":"0xd8da6bf26964af9d7eed9e03e53415d37aa9604548656c6c6f2066726f6d204361727465736921"}}
[InputRelayer] input_index=0 relayer=0x06ebaf6d44b65d76c8bdcb1701e68f44c22b1057 original_sender=0xd8da6bf26964af9d7eed9e03e53415d37aa96045 message="Hello from Cartesi!"
Sending finish
```

</TabItem>
</Tabs>

## Summary

In this section, you successfully:

- deployed a contract to Sepolia or Base Sepolia
- forked the network locally at a specific block
- ran a Cartesi application on top of that fork
- interacted with the application through an already deployed contract

This demonstrates how the Cartesi CLI can be used to replicate real blockchain environments locally, enabling integration and interaction with already deployed contracts during development and testing.
