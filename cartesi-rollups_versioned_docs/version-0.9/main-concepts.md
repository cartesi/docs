---
id: main-concepts
title: Main concepts
tags: [learn, rollups, dapps, low-level developer, components]
---

As explained in the [previous section](./overview.md), the Cartesi Rollups framework achieves scalability by moving the bulk of the computation outside the blockchain, using the ledger as a data source but not as an execution environment. As such, the solution contains both on-chain (L1) and off-chain (L2) components.

## Main concepts

### Cartesi Nodes

As explained before, [Cartesi Machines](/machine/intro) provide dApp developers with an environment in which large scale verifiable computations can be executed. These machines are integrated with the on-chain smart contracts by a _middleware_ that manages and controls the communication between them. As such, this middleware is responsible for first reading data from the L1 smart contracts, then sending them to the machine to be processed, and finally publishing their results back to the blockchain.

The _Cartesi Node_ is the L2 component that consists of the combination of the Cartesi Machine and this middleware, and can be used by anyone interested in the rollups state of affairs. Put simply, Cartesi Nodes play a role that is similar to what Geth does on the Ethereum ecosystem: execution and retrieval of information.

In practice, there are two distinct kinds of agents that run Cartesi Nodes: _users_ and _validators_. Each of them interacts with the on-chain rollups in different ways, and thus run different types of Cartesi Nodes:

- **User or Reader Nodes**, which are only involved in advancing the state of the off-chain machine, and making that state publicly available. They consume information from the blockchain but do not bother to enforce state updates, trusting that validators will ensure the validity of all on-chain state updates.
- **Validator Nodes**, which have more responsibility: they not only watch the blockchain but also fight possible dishonest validators to ensure the prevalence of honest claims for state updates. On the other hand, if Reader Nodes are available, validators do not need to expose endpoints for retrieving application state. Therefore, they can run in more secure environments and remain inaccessible to external clients and users.

### Epochs

In order to avoid over interacting with the blockchain, validators don't checkpoint every new state update on the off-chain machine. They do it at the end of an _epoch_, which is a batch of inputs that follow the same cycle.
In order to end an epoch, all validators need to reach a consensus about the state of the machine after processing all the batched inputs. At this point, the outputs generated in the form of [vouchers](#vouchers) and [notices](#notices) are considered to be _final_, meaning that their contents can no longer be disputed.

### Vouchers

A _voucher_ is a combination of a target address and a payload in bytes. It is used by the off-chain machine to respond and interact with L1 smart contracts. Upon execution, a voucher sends a message to the target address with the payload as a parameter. Vouchers can be used for anything, ranging from providing liquidity in a DeFi protocol to withdrawing funds from the [Portals](#portals). Vouchers can only be executed when the epoch in which they are contained is _finalized_, at which point a _validity proof_ will be available to ensure L1 smart contracts can trust its content.

### Notices

A _notice_ is an arbitrary payload in bytes that is submitted by the off-chain machine for informational purposes. Similarly to vouchers, when the epoch containing a notice is finalized a proof will be produced so that the validity of the notice's content can be verified on-chain by any interested party.

### Reports

A _report_ is an application log or a piece of diagnostic information. Like a notice, it is represented by an arbitrary payload in bytes. However, a report is never associated with a proof and is thus not suitable for trustless interactions such as on-chain processing or convincing independent third parties of dApp outcomes. Reports are commonly used to indicate processing errors or to retrieve application information for display.

### Portals

The Portals, as the name suggests, are used to teleport assets from the Ethereum blockchain to dApps running on Cartesi Rollups. Once deposited, those L1 assets gain a representation in L2 and are owned, there, by whomever the depositor assigned them to. After being teleported, L2 assets can be moved around in a significantly cheaper way, using simple inputs that are understood by the Linux logic.

When an asset is deposited, the Portal contract sends an input to the dApp’s inbox, describing the type of asset, amount, receivers, and some data the depositor might want the dApp to read. This allows deposits and instructions to be sent as a single L1 interaction. One could think of a Portal as a bank account, owned by the off-chain machine.

Anyone can deposit assets there but only the dApp — through its CartesidApp contract — can decide on withdrawals. The withdrawal process is quite simple from a user perspective. An input is sent requesting a withdrawal, which gets processed and interpreted off-chain. If everything is correct, the machine creates a voucher destined to the appropriate Portal contract, ordering and finalizing that withdrawal request. Currently, we support the following types of assets:

- [Ether (ETH)](./api/json-rpc/portals/EtherPortal.md)
- [ERC-20](./api/json-rpc/portals/ERC20Portal.md)
- [ERC-721](./api/json-rpc/portals/ERC721Portal.md)
- [ERC-1155 batch transfers](./api/json-rpc/portals/ERC1155BatchPortal.md)
- [ERC-1155 single transfers](./api/json-rpc/portals/ERC1155SinglePortal.md)
