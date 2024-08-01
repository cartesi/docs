---
id: overview
title: Overview
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v1.4.0/onchain/rollups/contracts
    title: Smart Contracts for Cartesi Rollups
---

The Cartesi Rollups framework consists of components on the base layer (the foundational blockchain where a dApp contract is deployed, such as Ethereum) and the execution layer (the Cartesi off-chain layer where the dApp runs its backend logic).

The frontend interacts with base layer smart contracts to send inputs to the backend, deposit assets, and process outputs.

To interact with an Ethereum-compatible blockchain, the dApp frontend must connect to a blockchain node using Ethereum's JSON-RPC API. 

There are two ways in which clients can interact with Ethereum-compatible nodes using the JSON-RPC API:

- **Querying state (read operations)** — The state can be queried by calling functions that do not alter the blockchain state or incur gas fees.

- **Changing state (write operations)** — The state is changed by submitting a transaction, which incurs gas fees. The transaction must be cryptographically signed by an Ethereum account with funds in its wallet.

## Cartesi Rollups Smart Contracts

- [`InputBox`](../json-rpc/input-box.md): This contract receives inputs from users who want to interact with the off-chain layer. All inputs to your dApp go through this contract. 

- [`CartesiDApp`](../json-rpc/application.md): This `CartesiDApp` contract is instantiated for each dApp (i.e., each dApp has its application address). With this address, an application can hold ownership over digital assets on the base layer, like Ether, ERC-20 tokens, and NFTs.

- [`CartesiDAppFactory`](../json-rpc/application-factory.md): The `CartesiDAppFactory` contract allows anyone to deploy [`CartesiDApp`](../json-rpc//application.md) contracts with a simple function call. It provides greater convenience to the deployer and security to users and validators, as they know the bytecode could not have been altered maliciously.

- Portals: These are a set of contracts used to safely teleport assets from the base layer to the execution environment of your dApp. Currently, there are Portal contracts for the following types of assets: [Ether (ETH)](../json-rpc/portals/EtherPortal.md), [ERC-20 (Fungible tokens)](../json-rpc//portals/ERC20Portal.md), [ERC-721 (Non-fungible tokens)](../json-rpc//portals/ERC721Portal.md), [ERC-1155 single transfer](../json-rpc/portals/ERC1155SinglePortal.md) and [ERC-1155 batch token transfers](../json-rpc/portals/ERC1155BatchPortal.md).


