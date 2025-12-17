# Bonds

## What is a bond mechanism?

A bond mechanism in the fraud-proof system is an economic security system that requires any participant to post a collateral when submitting a claim in the dispute-resolution process.

The goal is to introduce a modest economic cost to submitting claims, thereby mitigating the impact of Sybil attacks. Bonds provide a means to reimburse dispute-related expenses, ensuring that honest participants are not financially penalized for engaging in validation. 

The mechanism is not intended to create participation incentives, rather, its design objective is to keep honest, altruistic validation as close to costless as possible, irrespective of the number or behavior of Sybil identities.

## Why do we need bonds? A Case without Bonds
In a dispute process, each transaction made on Ethereum would incur gas costs for the proposer and the challenger. This cost does not include the bond amount. In this setup, a malicious proposer who can spend a relatively large amount of gas fees has an advantage to repeatedly post claims until the honest challenger exhausts their funds or computational resources.

This is infamously known as the resource-exhaustion attack or [proof-of-whale attack](https://ethresear.ch/t/fraud-proofs-are-broken/19234). It is a type of Sybil attack. To deter such an attack, we introduce a bond system in the fraud-proof system.

Naively introducing a high bond amount will impact decentralisation. Liveness and security may depend on preventing the adversary from creating too many Sybils. Increasing bonds in such a scenario harms decentralization by restricting the number of players that can afford to participate.

## Implementation in PRT v2
Cartesi’s _Permissionless Refereed Tournament (PRT) v2_ features a bond system. Each tournament level requires a bond to be posted in order for a commitment to be submitted. 

A defender gets the gas fees as a refund with an optional incentive to be an active defender of the system. In a single dispute process (a tournament system), the fraud-proof design asks participants to stake a bond at each level of the game.

In the worst-case scenario, an honest validator will have one bond for each tournament level. Currently, PRT v2 features three levels: top, middle, and bottom, which correspond to three bonds. Bond values differ at each level.

When joining a tournament, participants must send the bond value in Ether. The contract enforces this requirement and reverts with an `InsufficientBond` error if the payment is insufficient.

The **refund calculation** is capped by three values: the contract balance, a weighted fraction of the bond value, and the actual gas used plus a profit margin. The profit margin incentivizes honest participants to perform necessary operations.

The submitter of the winning commitment receives any remaining bonds after tournament completion, recovering their costs plus rewards from eliminated participants.

However, in practice, issuing refunds introduces an additional challenge. During dispute actions such as bisections and steps, multiple honest validators may attempt the same operation simultaneously. Only the first transaction succeeds, while any following ones revert, creating a race condition that leads to unnecessary gas losses and complicates proper refunds.

To address this, PRT can leverage a targeted technique based on **MEV-Share’s** `mev_sendBundle` RPC. Although MEV-Share is a general MEV redistribution protocol, we rely on it only for its ability to relay transactions predictably through searcher relays. By submitting dispute actions via `mev_sendBundle`, validators avoid public mempool races and ensure that the intended action is included without incurring failed-transaction costs.

This approach preserves the goal of making honest validation effectively costless, even when many validators attempt the same operation.
