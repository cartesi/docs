---
id: architecture
title: Architecture
resources:
  - url: https://cartesi.io/blog/grokking-cartesi-virtual-machine/
    title: Grokking the Cartesi Virtual Machine
  - url: https://cartesi.io/blog/understanding-cartesi-rollups-pt2/
    title: Understanding Cartesi Rollups
  - url: https://cartesi.io/blog/grokking-cartesi-nodes/
    title: Grokking Cartesi Nodes
  - url: https://youtu.be/uUzn_vdWyDM?si=J2or_Nfym5pabkjNz3z8Gw
    title: Cartesi Machine DeepDive
    
---

The Cartesi Rollups framework comprises two main parts: **the on-chain base layer components** (where the dApp contract is deployed, such as Ethereum) and **the execution layer** (the Cartesi off-chain layer where the dApp runs its backend logic).

A dApp running on Cartesi consists of the following main components:

- [Cartesi Rollups](./optimistic-rollups.md/#cartesi-rollups), a set of on-chain and off-chain components that implement an Optimistic Rollup solution and provide the general framework for building dApps.

- [Cartesi Machine](/cartesi-machine/), a virtual machine (VM) that runs an entire Linux OS, in which a dApp's backend is executed.

- Backend, the application's state, and verifiable logic. The backend runs inside the Cartesi Machine as a regular Linux application.

- Frontend, the application's user-facing interface, such as a web app or a CLI tool like Cast.


<video width="100%" controls poster="/img/architecture_dapp.png">
    <source src="/videos/HLA_video.mp4" type="video/mp4" />
    Your browser does not support video tags.
</video>

Our backend computation operates within an off-chain virtual machine, the Cartesi Machine. Think of it as a computer running away from the blockchain. This machine is based on the [RISC-V ISA](https://riscv.org/), a set of instructions for processors. It runs in isolation, meaning it operates independently and is reproducible – it behaves predictably every time.

The Cartesi Machine achieves scalability by using significant off-chain computing capabilities while maintaining the security guarantees of smart contracts running natively on the blockchain.

As the Cartesi Machine and on-chain components live in different environments, the rollups node acts as middleware, bridging the communication gap between them.

Now, when a request is made to a dApp, the type of request determines how information flows between the on-chain and off-chain components. For example, it could involve sending data to the off-chain Cartesi Machine for computation and then returning the results to the on-chain smart contracts.

## On-chain components

The on-chain part of Cartesi Rollups involves deployed base layer smart contracts, each with distinct roles for your dApp. Every Cartesi dApp leverages the functionality these contracts provide. 


- [InputBox](./rollup-http-api/json-rpc/input-box.md): This contract receives inputs from users who want to interact with the off-chain layer. All inputs to your dApp go through this contract. 

- [CartesiDApp](./rollup-http-api/json-rpc/application.md): This `CartesiDApp` contract is instantiated for each dApp (i.e., each dApp has its application address). With this address, an application can hold ownership over digital assets on the base layer, like Ether, ERC-20 tokens, and NFTs.

- [CartesiDAppFactory](./rollup-http-api/json-rpc/application-factory.md): The `CartesiDAppFactory` contract allows anyone to deploy `CartesiDApp` contracts with a simple function call. It provides greater convenience to the deployer and security to users and validators, as they know the bytecode could not have been altered maliciously.

- Portals: These are a set of contracts used to safely teleport assets from the base layer to the execution environment of your dApp. Currently, there are Portal contracts for the following types of assets: [Ether (ETH)](./rollup-http-api/json-rpc/portals/EtherPortal.md), [ERC-20 (Fungible tokens)](./rollup-http-api/json-rpc/portals/ERC20Portal.md), [ERC-721 (Non-fungible tokens)](./rollup-http-api/json-rpc//portals/ERC721Portal.md), [ERC-1155 single transfer](./rollup-http-api/json-rpc/portals/ERC1155SinglePortal.md) and [ERC-1155 batch token transfers](./rollup-http-api/json-rpc/portals/ERC1155BatchPortal.md).


## Off-chain layer

The execution layer is off-chain and consists of the Cartesi Node, which handles input processing to change the dApp state.

It can act as a **validator** and **inspect the dApp state**.

Here is a high-level overview of the three main features of the Cartesi Node. 

- Processes inputs from the blockchain to change the state of decentralized applications.

- Allows the node to function as a Validator, generating claims at the end of epochs.

- Captures and analyzes requests to inspect the state of dApps.

- Manages a graphql server for outputs to be queried by the client.


As explained, the Cartesi Machine provides dApp developers with an environment where developers can perform large-scale verifiable computations. These machines are integrated with the on-chain smart contracts by a middleware that manages and controls their communication.  As such, this middleware is responsible for first reading data from the L1 InputBox smart contract, then sending them to the machine to be processed, and finally publishing their results to the blockchain.

The Cartesi Node is the L2 component that combines the Cartesi Machine and this middleware. Anyone interested in the rollup’s state of affairs can use it. 

Simply put, Cartesi Nodes play a similar role to Geth in the Ethereum ecosystem: they execute and retrieve information.



In practice, two distinct kinds of agents run Cartesi Nodes: users and validators. Each interacts with the on-chain rollups in different ways and thus runs different types of Cartesi Nodes:

- **User or Reader Nodes**, which are only involved in advancing the state of the off-chain machine and making that state publicly available. They consume information from the blockchain but do not bother to enforce state updates, trusting that validators will ensure the validity of all on-chain state updates.

- **Validator Nodes**, which have more responsibility: they not only watch the blockchain but also fight possible dishonest validators to ensure the prevalence of honest claims for state updates. On the other hand, if Reader Nodes are available, validators do not need to expose endpoints to retrieve the application state. Therefore, they can run in more secure environments and remain inaccessible to external clients and users.

:::caution important
Currently, all Cartesi Nodes function as Validator Nodes. Reader Nodes are being developed, adding the capability to fetch and share data. In the meantime, Validator Nodes are handling both roles effectively.
:::

