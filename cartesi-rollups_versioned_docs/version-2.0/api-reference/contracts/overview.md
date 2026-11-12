---
id: overview
title: Overview
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10
    title: Smart Contracts for Cartesi Rollups
---

The Cartesi Rollups framework consists of components on two layers: the base layer (the foundational blockchain where an application contract is deployed, such as Ethereum) and the execution layer (the Cartesi off-chain layer where the application runs its backend logic).

The frontend interacts with base layer smart contracts to send inputs to the backend, deposit assets, and process outputs.

To interact with an Ethereum-compatible blockchain, the application frontend must connect to a blockchain node using Ethereum's JSON-RPC API. 

Clients can interact with Ethereum-compatible nodes using the JSON-RPC API in two ways:

- Querying state: The state can be queried by calling functions that neither alter the blockchain state nor incur gas fees.

- Changing state: The state is changed by submitting a transaction that incurs gas fees. The transaction must be cryptographically signed by an Ethereum account with sufficient funds in its wallet.

## Cartesi Rollups Smart Contracts

- [`InputBox`](../contracts/input-box.md): This contract receives inputs from users who want to interact with the off-chain layer. Each application reads its inputs from the input box chosen at deployment, returned by the application's `getInputBox()` function. Because anyone can deploy an input box, users and integrators should check that an application's `getInputBox()` returns the canonical `InputBox` deployment before depositing into it or relying on its outputs (see [Choosing and checking the input box](../contracts/input-box.md#choosing-and-checking-the-input-box)).

- [`Application`](../contracts/application.md): This contract is instantiated for each dApp (i.e., each dApp has its own application address). With this address, an application can hold ownership of digital assets on the base layer, such as Ether, ERC-20 tokens, and NFTs.

- [`ApplicationFactory`](../contracts/application-factory.md): This contract enables anyone to deploy [`Application`](../contracts/application.md) contracts with a simple function call. It provides greater convenience to the deployer and security to users and validators, as they can verify that the bytecode has not been maliciously altered. The [`SelfHostedApplicationFactory`](../contracts/application-factory.md#selfhostedapplicationfactory) deploys an ownerless `Application` together with its `Authority` in a single transaction.

- [`Portals`](../contracts/portals/): These contracts are used to safely transfer assets from the base layer to the execution environment of your application. Currently, Portal contracts are available for the following types of assets: [Ether (ETH)](../contracts/portals/EtherPortal.md), [ERC-20 (Fungible tokens)](../contracts/portals/ERC20Portal.md), [ERC-721 (Non-fungible tokens)](../contracts/portals/ERC721Portal.md), [ERC-1155 single transfer](../contracts/portals/ERC1155SinglePortal.md), and [ERC-1155 batch token transfers](../contracts/portals/ERC1155BatchPortal.md). The contracts are named `EtherPortal`, `Erc20Portal`, `Erc721Portal`, `Erc1155SinglePortal` and `Erc1155BatchPortal` (the `Erc` names replaced the `ERC` ones in rollups-contracts 3.0.0-alpha.7). Each portal sends the deposit input to the input box returned by the application's `getInputBox()`.

- [`Consensus`](../contracts/consensus/overview.md): These contracts are crucial for the framework's security and integrity. They validate and stage claims submitted by validators and, after a claim staging period, accept them, ensuring the rollup's integrity by validating outputs Merkle roots. The framework supports different consensus mechanisms including [Authority-based consensus](../contracts/consensus/authority/authority.md) for single-owner control and [Quorum-based consensus](../contracts/consensus/quorum/quorum.md) for multi-validator approval. PRT applications use the `DaveConsensus` contract from the [cartesi/dave](https://github.com/cartesi/dave/tree/v3.0.0-alpha.6) repository instead (see the [consensus overview](../contracts/consensus/overview.md)).