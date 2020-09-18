---
title: Supported Networks
---

Broadly speaking, the Cartesi layer-2 platform architecture should be perceived as *blockchain-agnostic*, given that in principle any network could use Cartesi Machines to move complex computations off-chain without compromising on decentralization.

In practice, in order to effectively run, a Cartesi-powered DApp needs to call an *existing API* that is available on-chain, so as to instantiate the desired computation off-chain. As described in the preceding sections, the Descartes SDK provides such an [on-chain API](../api), thus enabling real DApps to leverage on Cartesi.

At the moment, the Descartes API only supports the Ethereum Virtual Machine, and as such can only be deployed on Ethereum and EVM-compatible networks.

Effectively, the API is currently available in the following Ethereum test networks:

- Ropsten
- Rinkeby
- Kovan
- Goerli
- Matic Testnet
- Binance Smart Chain Testnet
