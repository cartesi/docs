---
id: scalability
title: Scalability
tags:
  [
    quickstart,
    beginner,
    low-level developer,
    researcher,
    learn,
    build,
    maintain,
  ]
---

The scalability issue is one of the three parts of the [Blockchain Trilemma](https://www.gemini.com/cryptopedia/blockchain-trilemma-decentralization-scalability-definition), along with security and decentralization. Solving the scalability issue refers to any type of improvement within a blockchain system in terms of computational power, throughput, latency, bootstrap time, or cost per transaction. For example, high gas fees make it expensive for users to pay for their transactions within the Ethereum blockchain.

Given scalability has many different aspects, there are numerous alternative and often complementary solutions for tackling it. For instance, scaling the blockchain throughput (i.e., the number of transactions that can be processed over a period of time) can be achieved by increasing block size, reducing block interval, or other improvements to the consensus protocol such as breaking down transactions into smaller partitions (shards) to process them in parallel.

Proposed blockchain scaling solutions include Lightning Network, Ethereum Plasma, sharding, and off-chain (L2) protocols.

:::note
You can read the article [L1 and L2 Blockchain Scaling Solutions](https://www.gemini.com/cryptopedia/blockchain-L2-network-layer-1-network) to explore more scaling solutions.
:::

## L2 solutions and the connection with rollups

A [L2 protocol](https://academy.binance.com/en/glossary/L2) is a scaling solution in the sense that it scales blockchains without changing the L1 trust assumptions and without extending or replacing the consensus mechanism. This protocol reduces the transaction load on the underlying blockchain and allows users to execute off-chain transactions via private and authenticated communication instead of broadcasting every single transaction on the main L1 blockchain system.

A L2 protocol inherits two properties from the blockchain layer (L1):

- Integrity that guarantees only valid transactions to be added to the blockchain ledger
- Eventual synchronicity with an upper time-bound. For example, a valid transaction is eventually added to the blockchain ledger, before a critical timeout.

In general, L2 protocols belong to one of the following four categories:

1. **Channels** that are fully secured by a blockchain system such as Ethereum and work only for a specific set of applications.
2. **Commit-chains** that rely on one central intermediary who is trusted regarding availability
3. **Side-chains** that are usually EVM-compatible and can scale general-purpose applications, but are less secure because they do not rely on the security of the underlying blockchain and thus create their own consensus models.
4. **Rollups** that aim to achieve the best of all the above, and are described in more detail in the [Cartesi Rollups overview section](/cartesi-rollups/).

## See Also

- [How to truly tackle blockchain’s scalability problem](https://medium.com/cartesi/scaling-content-90de6f3ca4fa)
