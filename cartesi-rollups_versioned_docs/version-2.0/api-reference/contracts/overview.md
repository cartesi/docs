---
id: overview
title: Overview
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/prerelease/2.0.0/contracts
    title: Smart Contracts for Cartesi Rollups
---

The Cartesi Rollups framework consists of components on two layers: the base layer (the foundational blockchain where an application contract is deployed, such as Ethereum) and the execution layer (the Cartesi off-chain layer where the application runs its backend logic).

The frontend interacts with base layer smart contracts to send inputs to the backend, deposit assets, and process outputs.

To interact with an Ethereum-compatible blockchain, the application frontend must connect to a blockchain node using Ethereum's JSON-RPC API. 

Clients can interact with Ethereum-compatible nodes using the JSON-RPC API in two ways:

- **Querying state (read operations)** — The state can be queried by calling functions that neither alter the blockchain state nor incur gas fees.

- **Changing state (write operations)** — The state is changed by submitting a transaction that incurs gas fees. The transaction must be cryptographically signed by an Ethereum account with sufficient funds in its wallet.

## Cartesi Rollups Smart Contracts

- [`InputBox`](../contracts/input-box.md): This contract receives inputs from users who want to interact with the off-chain layer. All inputs to your application are processed through this contract. 

- [`Application`](../contracts/application.md): An `Application` contract is instantiated for each dApp (i.e., each dApp has its own application address). With this address, an application can hold ownership of digital assets on the base layer, such as Ether, ERC-20 tokens, and NFTs.

- [`ApplicationFactory`](../contracts/application-factory.md): The `ApplicationFactory` contract enables anyone to deploy [`Application`](../contracts/application.md) contracts with a simple function call. It provides greater convenience to the deployer and security to users and validators, as they can verify that the bytecode has not been maliciously altered.

- Portals: These contracts are used to safely transfer assets from the base layer to the execution environment of your application. Currently, Portal contracts are available for the following types of assets: [Ether (ETH)](../contracts/portals/EtherPortal.md), [ERC-20 (Fungible tokens)](../contracts/portals/ERC20Portal.md), [ERC-721 (Non-fungible tokens)](../contracts/portals/ERC721Portal.md), [ERC-1155 single transfer](../contracts/portals/ERC1155SinglePortal.md), and [ERC-1155 batch token transfers](../contracts/portals/ERC1155BatchPortal.md).


