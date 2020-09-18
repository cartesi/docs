---
title: Supported Networks
---

Broadly speaking, the Cartesi layer-2 platform architecture should be perceived as *blockchain-agnostic*, given that in principle any network could use Cartesi Machines to move complex computations off-chain without compromising on decentralization.

In practice, in order to effectively run, a Cartesi-powered DApp needs to call an *existing API* that is available on-chain, so as to instantiate the desired computation off-chain. As described in the preceding sections, the Descartes SDK provides such an [on-chain API](../api), thus enabling real DApps to leverage on Cartesi.

At the moment, the Descartes API only supports the Ethereum Virtual Machine, and as such can only be deployed on Ethereum and EVM-compatible networks.

Effectively, the API is currently available in the following test networks:

## Ethereum Testnets

- [Ropsten](https://ropsten.etherscan.io/)
- [Rinkeby](https://rinkeby.etherscan.io/)
- [Kovan](https://kovan.etherscan.io/)
- [Goerli](https://goerli.etherscan.io/)

## Matic Testnet

[Matic](https://matic.network/) is an Ethereum sidechain that provides an adapted version of the Plasma framework for faster and extremely low-cost transactions with finality on the main chain.


## Binance Smart Chain Testnet

[Binance Smart Chain](https://www.binance.org/en/smartChain) is an EVM-compatible blockchain aimed at bringing programmability and interoperability to the [Binance Chain](https://docs.binance.org/guides/intro.html). It relies on a system of 21 validators with Proof of Staked Authority (PoSA) consensus that can support short block time and lower fees.


