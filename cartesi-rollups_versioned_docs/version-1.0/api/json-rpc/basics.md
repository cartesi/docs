---
id: basics
title: Introduction
---

The [Cartesi Rollups framework](../../overview.md#what-is-a-blockchain-rollup) consists of components on the _base layer_ (the foundational blockchain where a dApp contract is deployed, such as Ethereum) and _execution layer_ (the Cartesi off-chain layer where the dApp runs its backend logic).

- The base layer components are a set of smart contracts deployed on an Ethereum-compatible blockchain.
- The execution layer components are the Cartesi Nodes.

In a typical Cartesi dApp architecture, the dApp back-end is running on a Cartesi Node and the dApp front-ends [interact](../../overview.md#how-does-a-rollup-work) with base layer smart contracts to send inputs to the dApp back-end, deposit assets, and process outputs (execute vouchers and validate notices).

To interact with an Ethereum-compatible blockchain, the dApp front-end needs to connect to a blockchain node using [Ethereum's JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/). JSON-RPC is a lightweight remote procedure call (RPC) protocol that uses JSON as the data exchange format, and Ethereum has specified an API using this protocol to allow clients to communicate with Ethereum-compatible nodes.

There are two ways in which clients can interact with Ethereum-compatible nodes using the JSON-RPC API:

- _Querying state_ (read operations) - state can be queried by calling functions whose definition in Solidity is labeled as `view` or `pure` as they do not alter the blockchain state and do not incur gas fees

- _Changing state_ (write operations) - state is changed by submitting a transaction, which requires gas fees to be paid. It needs to be cryptographically signed by an Ethereum account that has funds in its wallet.

### Testnets vs Mainnet

#### Testnets

Ethereum testnets are testing environments or networks that are designed to test the features and capabilities of the Ethereum blockchain without using real ETH and incurring any actual cost. There are several testnets available that simulate the Ethereum Mainnet. [Sepolia](https://sepolia.etherscan.io/) is one of such testnets.

A _faucet_ is a service that provides users with free testnet Ether tokens (SepoliaETH in the case of Sepolia). These tokens can then be used to test and develop dApps on the testnet. There are several faucets available for Sepolia. You may try [Alchemy's free Sepolia Faucet](https://sepoliafaucet.com/).

#### Mainnet

The Ethereum Mainnet is the live version of the Ethereum blockchain, where all transactions involving the native cryptocurrency Ether (ETH) and tokens take place. In order to work with funds on the Ethereum Mainnet, you need to earn them through staking or purchase them on a cryptocurrency exchange.

There are several mature libraries and tools available to help developers interact with the Ethereum ecosystem without needing to read the JSON-API specification to implement their code.

- Libraries: Two popular libraries for interacting with Ethereum-compatible networks are primarily JavaScript-based: [_ethers.js_](https://docs.ethers.org/v5/) and [_web3.js_](https://web3js.readthedocs.io/en/v1.8.2/). Similar libraries are also available in [Rust](https://docs.rs/ethers/latest/ethers/) and [Python](https://pypi.org/project/ethers/).
- Command line: [Cast](https://book.getfoundry.sh/cast/) is a handy command line tool for making RPC calls on Ethereum-compatible networks, such as submitting transactions or querying state
- Wallets: [Metamask](https://metamask.io/) is a popular wallet option for managing Ethereum assets and interacting with smart contracts.

### JSON-RPC API call examples

#### Direct JSON-RPC call using `curl`

This [getBalance](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getbalance) call is an example of a direct JSON-RPC request using the `curl` command to query the balance of an Ethereum account on the Ethereum Mainnet. The request is sent to the Ethereum node via the JSON-RPC endpoint.

```shell
curl -X POST \
     --data '{
         "jsonrpc":"2.0",
         "method":"eth_getBalance",
         "params":["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "latest"],
         "id":1
     }' \
     https://eth-mainnet.alchemyapi.io/v2/Lc7oIGYeL_QvInzI0Wiu_pOZZDEKBrdf
```

The JSON-RPC request consists of the following properties:

- `jsonrpc`: The version of the JSON-RPC protocol being used, which is set to "2.0" in this example.
- `method`: The name of the JSON-RPC method to call, which is set to "eth_getBalance" in this example. This method retrieves the Ether balance of an Ethereum account at a specified block.
- `params`: An array of parameters to pass to the method, which in this case are the Ethereum account address and the block number ("latest" in this case) for which to retrieve the balance.
- `id`: An ID to associate with the JSON-RPC request, which can be any unique identifier. In this case, it is set to 1.
- `https://eth-mainnet.alchemyapi.io/v2/Lc7oIGYeL_QvInzI0Wiu_pOZZDEKBrdf` is the URL of an Alchemy gateway node on Ethereum Mainnet, which is where the request will be sent to

The result of this JSON-RPC request is a JSON object similar to the one below:

```js
{"jsonrpc":"2.0","id":1,"result":"0x117295ef834407b723d"}
```

Where we have the following properties:

- `jsonrpc`: The version of the JSON-RPC protocol being used.
- `id`: The ID of the JSON-RPC request, which in this case is 1.
- `result`: The result of the JSON-RPC request, which is the balance of the specified Ethereum account in hexadecimal format. In the example provided in the comment, the balance is `0x117295ef834407b723d`, which is equal to 15818317276196869253853 in decimal format.

#### JSON-RPC call using Cast to perform a read operation

##### eth_getBalance

To perform a read operation for `eth_getBalance` using [Cast](https://book.getfoundry.sh/cast/), we can use the [`cast balance`](https://book.getfoundry.sh/reference/cast/cast-balance) command to send a JSON-RPC request to the specified Ethereum node URL and retrieve the balance (in wei) of the specified Ethereum address.

For example:

```shell
cast balance \
     --rpc-url "https://eth-mainnet.alchemyapi.io/v2/Lc7oIGYeL_QvInzI0Wiu_pOZZDEKBrdf" \
     0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

In this example, we use the `--rpc-url` flag to specify the Ethereum node URL. The URL `https://eth-mainnet.alchemyapi.io/v2/Lc7oIGYeL_QvInzI0Wiu_pOZZDEKBrdf` is provided by the Alchemy API service. `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045` is the Ethereum address for which we want to fetch the balance. Alternatively, we can use an environment variable (`export ETH_RPC_URL` for Linux and macOS and `set ETH_RPC_URL` for Windows) to specify the Ethereum node URL instead of using the `--rpc-url` flag.

In this example, the command will fetch and display the balance as shown below:

```shell
5149622689471634567741
```

##### getNumberOfInputs

The following example is a cast command that shows how to get the number of inputs using the function [getNumberOfInputs](/cartesi-rollups/1.0/api/json-rpc/sol-input/#getnumberofinputs):

```shell
cast call <INPUTBOX_ADDRESS> getNumberOfInputs(address) <DAPP_ADDRESS>
```

Here we are using the [`cast call`](https://book.getfoundry.sh/reference/cast/cast-call) command to call the `getNumberOfInputs` function of the [`InputBox`](./sol-input.md) smart contract. We pass in the address of the InputBox contract (`<INPUTBOX_ADDRESS>`) and the function name with dApp address (`<DAPP_ADDRESS>`) as parameters.

The result of this JSON-RPC call is the number of inputs for the dApp, returned as an unsigned integer in decimal format.

#### JSON-RPC call using Cast to perform a write operation

##### addInput

The following example is a cast command that shows how to send an input using the function [addInput](/cartesi-rollups/1.0/api/json-rpc/sol-input/#addinput) of the [`InputBox`](/cartesi-rollups/1.0/api/json-rpc/sol-input) smart contract:

```shell
cast send <INPUTBOX_ADDRESS> addInput(_dapp,_input) <DAPP_ADDRESS> <INPUT>
```

Where:

- `<INPUTBOX_ADDRESS>` must be replaced with the address of the InputBox contract
- `<DAPP_ADDRESS>` must be replaced with the address of the dApp
- `<INPUT>` must be replaced with the bytes of the payload being sent as input

## Cartesi Rollups Smart Contracts

[**InputBox**](./sol-input.md): global contract where inputs for all dApps are submitted.

[**CartesiDApp**](./sol-output.md): contract instantiated for each dApp (i.e., each dApp has its own `CartesiDApp` address), used for processing outputs, such as executing vouchers and validating notices.

[**Portals**](../portals): global contracts with methods for depositing assets, so that they can be managed by Cartesi dApps.

[**Relays**](../relays): global contracts with methods for securely relaying on-chain information to dApp back-ends, such as the dApp smart contract address.
