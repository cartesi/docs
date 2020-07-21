---
title: Architecture
---

What follows is a summary of the architecture and the components that are involved in running a Descartes Application, meaning some DApp that makes use of our SDK. It is convenient to start with the description of the typical ingredients involved in a decentralized application. Namely the blockchain node and the client software.

As with any decentralized application, users are expected to have access to a *blockchain node*. This could be a local Ethereum node (like [geth](https://geth.ethereum.org/), [parity](https://www.parity.io/) or a remote one such as [Infra](https://infura.io/).
On the blockchain, the application logic is written in a set of *DApp Smart Contracts*.
Moreover, the off-chain logic is executed on the *Client Software*, either through the internet browser (using [web3](https://web3js.readthedocs.io/en/v1.2.9/)) or by installing a native client. These are the typical ingredients of a decentralized application.

For an application that uses the Descartes SDK, one still needs the Descartes Infrastructure, which is described below.

Descartes is composed of an off-chain and an on-chain component.

Descartes on-chain
------------------

The on-chain component of Descartes is a set of smart contracts developed by Cartesi.
For convenience, the DApp developer interacts with a single of these contracts, named Descartes.
The API to interact with the Descartes Smart contract is described in [here](../instantiate/).

Descartes off-chain
-------------------

The off-chain component of Descartes is called the Descartes Node, which plays a very similar role as the Blockchain Node.
More precisely, in the same way that a blockchain node allows clients to interact with the first layer, a Descartes Node allows clients to interact with Cartesi.

It is expected that both users (claimer and challenger) have a Cartesi Node working on their behalves.
In Section [Topologies](../topologies/), we discuss alternatives to this setup.

These nodes will guarantee that their interests will be enforced on the blockchain by:
- automatically running computations;
- submitting results;
- verifying claims;
- challenging and punishing misbehavior.

All these tasks are performed automatically, with no intervention from the DApp users or even the DApp Client Software.

![Descartes Architecture](/img/descartes-architecture.png)

This gives a complete picture of the software components involved in running a Descartes powered DApp: The *Blockchain Node*, the *DApp Client Software*, the *DApp Smart Contracts* and the *Cartesi Node*, see the above picture.
