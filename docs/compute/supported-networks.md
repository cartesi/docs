---
title: Supported networks
tags: [maintain, sdk, networks, low-level developer]
---

Broadly speaking, the Cartesi layer-2 platform architecture should be perceived as *blockchain-agnostic*, given that in principle any network could use Cartesi Machines to move complex computations off-chain without compromising on decentralization.

In practice, in order to effectively run, a Cartesi-powered DApp needs to call an *existing API* that is available on-chain, so as to instantiate the desired computation off-chain. As described in the preceding sections, the Cartesi Compute SDK provides such an [on-chain API](../compute/api), thus enabling real DApps to leverage on Cartesi.

At the moment, the Cartesi Compute API only supports the Ethereum Virtual Machine, and as such can only be deployed on Ethereum and EVM-compatible networks.

Effectively, the API is currently available in the following test networks:

## Ethereum Testnets

- [Rinkeby](https://rinkeby.etherscan.io/)
- [Kovan](https://kovan.etherscan.io/)
- [Goerli](https://goerli.etherscan.io/)

## Polygon's Matic Mumbai Testnet

[Polygon's](https://polygon.technology/) [Matic Network](https://matic.network/) is an Ethereum Layer 2 scaling solution that achieves scale by utilizing sidechains for off-chain computation while ensuring asset security using the Plasma framework and a decentralized network of Proof-of-Stake (PoS) validators. The Mumbai Testnet is mapped to the Goerli Ethereum testnet.

## BNB Smart Chain Testnet

[BNB Smart Chain](https://www.bnbchain.world/en/smartChain), formerly Binance Smart Chain (BSC), is an EVM-compatible blockchain aimed at bringing programmability and interoperability to the [BNB Chain (Binance Chain)](https://docs.binance.org/guides/intro.html). It relies on a system of 21 validators with Proof of Staked Authority (PoSA) consensus that can support short block time and lower fees.

## Avalanche FUJI C-Chain Testnet

[Avalanche](https://www.avalabs.org/) is an open-source platform for launching decentralized applications and enterprise blockchain deployments in one interoperable, highly scalable ecosystem. Avalanche's Primary Network is a subnet that includes the C-Chain, which is an instance of the Ethereum Virtual Machine powered by Avalanche’s Snowman consensus protocol.
