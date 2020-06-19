---
title: Architecture
---

The Descartes infrastructure is composed of various on-chain and off-chain components.

The on-chain component of Descartes is a set of smart contracts developed by Cartesi. For convenience, the DApp developer needs to access and use one single contract, named Descartes.

The off-chain component of Descartes is called the Descartes Node. In the same way that a blockchain node allows clients to interact with the first layer, a Descartes Node allows clients to interact with Cartesi. In order to guarantee that their interests will be enforced on the blockchain, both the claimer and challenger nodes need to run the computation and go through dispute resolutions when necessary. The nodes automatically run computations, submit results, verify, challenge and punish misbehaving adversaries. All these tasks are performed automatically, independently from the DApp users or even the DApp itself.

![Descartes Architecture](/img/descartes-architecture.png)

To understand how Descartes is used, consider a basic Cartesi DApp setup, with one claimer and one challenger. This could be, for instance, a skill-based game where players place their bets and challenge each other for the highest score over the blockchain. The winner takes the pot. 

Typically, a DApp is composed of a set of smart contracts and an off-chain client that interacts with these contracts through HTTP calls to the blockchain node, that is either locally or remotely hosted.

DApps that use Descartes will work in a similar fashion, with two small differences:

- The DApp smart contracts will request computations to Descartes contract through a simple smart contract API;
- The off-chain DApp client will feed any additional data to the Descartes Node through HTTP request
