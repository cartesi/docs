---
title: Overview
---

Descartes SDK is the simplest infrastructure that DApps can use to run computations that would be impossible or too expensive to execute on-chain, either due to their complexity or to the amount of data to be processed.

With the SDK, DApps run these computations off-chain, on a fully fledged Linux environment without compromising decentralization, in a way that is verifiable by the DApp participants.

On blockchain smart contracts, computations need to be run by all full-nodes participating in its network or shard. Because the block limit imposes a maximum computational throughput on the network, every DApp using blockchains' native computation competes for this global and scarce resource, thus remaining severely restricted.

On Descartes SDK (and on Cartesi as a principle), DApp participants try to first agree locally and off-chain on the result of the computation. If this is the case, there is no need to perform any logic on the blockchain itself, completely avoiding the accompanying fees.

Only if parties fail to achieve agreement, the blockchain will be used for dispute resolutions. In a sense, the blockchain serves as a supreme court, where an honest party can infallibly prove and enforce correct results. With well-aligned cryptoeconomic incentives, the supreme court should rarely, if ever, be used. Honest participants are incentivized to use the system in the most cost-effective way. Meanwhile, dishonest participants are turned down from misbehaving, knowing that misbehavior is always detected and the penalties are always enforced.

Moreover, even in case a dispute arises, the blockchain is not required to perform the full computation in order to determine who is behaving dishonestly. In fact, using an algorithm of interactive verification, the cost to perform such arbitration is negligible, even for extremely large computations.

The Descartes SDK abstracts these mechanisms away from the developer, making this powerful machinery very easy to use. In a way, Descartes can be seen as a black box system, where the DApp developer is not required to understand in detail how Cartesi works. Instead, they are given a minimalistic API to run complex computations off-chain with automatic dispute resolution guarantees.
