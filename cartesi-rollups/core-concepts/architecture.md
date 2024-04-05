---
id: architecture
title: Architecture
tags: [Cartesi Rollups, Cartesi Machine]
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

- [Cartesi Rollups](/cartesi-rollups/core-concepts/optimistic-rollups/#cartesi-rollups), a set of on-chain and off-chain components that implement an [Optimistic Rollups](/cartesi-rollups/core-concepts/optimistic-rollups) solution and provide the general framework for building dApps.

- [Cartesi Machine](https://docs.cartesi.io/cartesi-machine/), a virtual machine (VM) that runs an entire Linux OS, in which each dApp's back-end is executed.

- Back-end, the application's state, and verifiable logic. The back end runs inside the Cartesi Machine as a regular Linux application.

- Front-end, the application's user-facing interface, such as a web app or a CLI tool like Cast

<video width="100%" controls poster="/img/architecture_dapp.png">
    <source src="/videos/HLA_video.mp4" type="video/mp4" />
    Your browser does not support the video tag.
</video>

Our backend computation, operates within an off-chain virtual machine, the Cartesi Machine. Think of it as a computer running away from the blockchain. This machine is based on the [RISC-V ISA](https://riscv.org/), a set of instructions for processors. It runs in isolation, meaning it operates independently and is reproducible – it behaves predictably every time.

The Cartesi Machine achieves scalability by using significant off-chain computing capabilities while maintaining the security guarantees of smart contracts running natively on the blockchain.

As the Cartesi Machine and on-chain components live in different environments, the rollups node acts as middleware, bridging the communication gap between them.

Now, when a request is made to a dApp, the type of request determines how information flows between the on-chain and off-chain components. For example, it could involve sending data to the off-chain Cartesi Machine for computation and then returning the results to the on-chain smart contracts.

## On-chain components

The [on-chain part of Cartesi Rollups](https://github.com/cartesi/rollups-contracts/tree/9436c7a922f459e80b92d9173a95ba82d60ff371) involves [deployed base layer smart contracts](/cartesi-rollups/api/json-rpc/), each with distinct roles for your dApp. Every Cartesi dApp leverages the functionality these contracts provide.

- [InputBox](/cartesi-rollups/api/json-rpc/sol-input/): This contract is responsible for receiving inputs from users who want to interact with applications. All inputs you want to send to your dApp go through this contract.

- [CartesiDApp](http://localhost:3000/cartesi-rollups/api/json-rpc/sol-output/): This Application contract is instantiated for each dApp (i.e., each dApp has its own `CartesiDApp` address). With this address, an application can hold ownership over digital assets on the base layer, like Ether, ERC-20 tokens, and NFTs.

- CartesiDAppFactory: The Application Factory allows anyone to deploy Application contracts with a simple function call. It provides greater convenience to the deployer and security to users and validators, as they know the bytecode could not have been altered maliciously.

- Portals: These are a set of contracts used to safely teleport assets from the base layer to the execution environment of your dApp. Currently, there are Portal contracts for [Ether (ETH)](/cartesi-rollups/api/json-rpc/portals/EtherPortal/), [ERC-20](/cartesi-rollups/api/json-rpc/portals/ERC20Portal/), [ERC-721](/cartesi-rollups/api/json-rpc/portals/ERC721Portal/), [ERC-1155 Single transfer](/cartesi-rollups/api/json-rpc/portals/ERC1155SinglePortal/), and [ERC-1155 batch transfers](/cartesi-rollups/api/json-rpc/portals/ERC1155BatchPortal/).

- [Relays](/cartesi-rollups/api/json-rpc/relays/DAppAddressRelay/): The DAppRelayContract allows anyone to inform the off-chain machine of the address of the dApp contract in a trustless and permissionless way

## Off-chain layer

The execution layer is off-chain, consisting of the Cartesi Node, which handles input processing to change the dApp state.

It can act as a Validator and also for inspecting dApp state.

Here is a high-level overview of the three main features of the Cartesi Node.

- Processes inputs from the blockchain to change the state of decentralized applications (DApps)

- Allows the node to function as a Validator, generating claims at the end of epochs

- Captures and analyzes requests to inspect the state of DApps.

As explained, the Cartesi Machine provides dApp developers an environment where large-scale verifiable computations can be executed. This machine is integrated with the on-chain smart contracts by a middleware that manages and controls their communication. As such, this middleware is responsible for first reading data from the L1 smart contracts, then sending them to the machine to be processed, and finally publishing their results to the blockchain.

The Cartesi Node is the L2 component that combines the Cartesi Machine and this middleware and can be used by anyone interested in the rollup's state of affairs. Simply put, Cartesi Nodes play a similar role to what Geth does in the Ethereum ecosystem: execution and retrieval of information.

In practice, two distinct kinds of agents run Cartesi Nodes: users and validators. Each interacts with the on-chain rollups in different ways and thus runs different types of Cartesi Nodes:

- **User or Reader Nodes**, which are only involved in advancing the state of the off-chain machine and making that state publicly available. They consume information from the blockchain but do not bother to enforce state updates, trusting that validators will ensure the validity of all on-chain state updates.

- **Validator Nodes**, which have more responsibility: they not only watch the blockchain but also fight possible dishonest validators to ensure the prevalence of honest claims for state updates. On the other hand, if Reader Nodes are available, validators do not need to expose endpoints for retrieving the application state. Therefore, they can run in more secure environments and remain inaccessible to external clients and users.

:::note
Currently, all Cartesi Nodes function as Validator Nodes. The development of Reader Nodes is in progress, adding the capability to fetch and share data. In the meantime, Validator Nodes are handling both roles effectively.
:::

## Cartesi Machine
Central to Cartesi Rollups is the Cartesi Machine, which is a virtual machine designed to perform off-chain computations for blockchain applications. When examined from a high level of abstraction, the Cartesi Machine can be compared to an AWS Lambda function, with similarities that encompass:

- Code execution: Code is executed based on specific inputs to perform computations, process data, or run custom logic, depending on the requirements of the task at hand.

- Abstraction of infrastructure: The underlying infrastructure is abstracted away, allowing you to focus on writing code without worrying about managing servers, hardware, or networking resources.

- Flexibility in programming languages and libraries: You have flexibility in the choice of programming languages and all open-source libraries available on Linux


The Cartesi Machine is a state machine that remains idle until a new request arises. The concept of state in this case is tied to both the input requests that the Cartesi Machine receives and the execution of the RISC-V instructions that the machine follows to process those requests. The Cartesi Machine handles:

- Discrete states: RISC-V instructions are executed step-by-step, transitioning from one state to another.

- State transitions: State transitions happen deterministically as the emulator processes these RISC-V instructions, changing the system's state to a new discrete state.

- Determinism: Given the same initial state and input, Cartesi Machine will always produce the same output and final state to ensure that off-chain computations can be verified and agreed upon.
