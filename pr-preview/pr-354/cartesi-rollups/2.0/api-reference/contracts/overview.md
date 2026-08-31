> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: overview
title: Overview
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9
    title: Smart Contracts for Cartesi Rollups
---

The Cartesi Rollups framework consists of components on two layers: the base layer (the foundational blockchain where an application contract is deployed, such as Ethereum) and the execution layer (the Cartesi off-chain layer where the application runs its backend logic).

The frontend interacts with base layer smart contracts to send inputs to the backend, deposit assets, and process outputs.

To interact with an Ethereum-compatible blockchain, the application frontend must connect to a blockchain node using Ethereum's JSON-RPC API. 

Clients can interact with Ethereum-compatible nodes using the JSON-RPC API in two ways:

- Querying state: The state can be queried by calling functions that neither alter the blockchain state nor incur gas fees.

- Changing state: The state is changed by submitting a transaction that incurs gas fees. The transaction must be cryptographically signed by an Ethereum account with sufficient funds in its wallet.

## Cartesi Rollups Smart Contracts

- [`InputBox`](../contracts/input-box.md): This contract receives inputs from users who want to interact with the off-chain layer. All inputs to your application are processed through this contract. 

- [`Application`](../contracts/application.md): This contract is instantiated for each dApp (i.e., each dApp has its own application address). With this address, an application can hold ownership of digital assets on the base layer, such as Ether, ERC-20 tokens, and NFTs.

- [`ApplicationFactory`](../contracts/application-factory.md): This contract enables anyone to deploy [`Application`](../contracts/application.md) contracts with a simple function call. It provides greater convenience to the deployer and security to users and validators, as they can verify that the bytecode has not been maliciously altered.

- [`SelfHostedApplicationFactory`](../contracts/self-hosted-application-factory.md): This contract deploys an Authority and ownerless Application together at deterministic addresses for self-hosted operation.

- [`Devnet test tokens`](../contracts/devnet-test-tokens.md): These development-only assets include mintable fungible tokens, the six-decimal `TestUsdc`, and the local USD withdrawal builder.

- [`Deposit refunds`](../contracts/refund/overview.md): The refund builder and Application refund API return assets from canonical portal deposits that were not finalized before foreclosure.

- [`Portals`](../contracts/portals/overview.md): These contracts safely transfer assets from the base layer to the execution environment. The available portals support [Ether](../contracts/portals/EtherPortal.md), [ERC-20](../contracts/portals/Erc20Portal.md), [ERC-721](../contracts/portals/Erc721Portal.md), [ERC-1155 single transfers](../contracts/portals/Erc1155SinglePortal.md), and [ERC-1155 batch transfers](../contracts/portals/Erc1155BatchPortal.md).

- [`Consensus`](../contracts/consensus/overview.md): These contracts are crucial for the framework's security and integrity. They validate and accept claims submitted by validators, ensuring the rollup's integrity by validating outputs Merkle roots. The framework supports different consensus mechanisms including [Authority-based consensus](../contracts/consensus/authority/authority.md) for single-owner control and [Quorum-based consensus](../contracts/consensus/quorum/quorum.md) for multi-validator approval.

- [`Emergency withdrawal`](../contracts/withdrawal/overview.md): These contracts define the accounts-drive layout and build outputs that recover finalized balances after foreclosure.
