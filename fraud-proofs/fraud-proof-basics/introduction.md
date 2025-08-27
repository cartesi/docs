# Introduction

This page provides a beginner-friendly introduction to fraud proof systems and their role in blockchain security.

## What is a Fraud Proof System?

In [Cartesi rollups](../../../get-started/optimistic-rollups), users submit their input transactions to the base layer, the off-chain validator nodes process the inputs and submit _claims_ back to the blockchain. These claims are treated as correct by default - _optimistically_ - but they don’t finalize immediately rather, they remain open to challenge for a certain period. In case of conflicting claims, a fraud-proof system kicks in.

A **fraud-proof system** is a mechanism that enables the blockchain to adjudicate disputes between participants and identify the valid claim, while requiring only minimal on-chain computation.

Note that the base layer (_here Ethereum_) acts as the data provider of inputs and also the on-chain verifier to resolve the disputes. Because of this, Cartesi rollups inherit Ethereum’s security: as long as at least one honest participant monitors the rollup and submits a valid claim when needed, the system can’t be corrupted.



![Fraud Proof](../images/fraud-proofs-general-3.png)

Fraud proofs implemented by Cartesi are **interactive** in nature where the _proposer_ and the _challenger_ go through a series of rounds to find a single step where they both disagree. This step is then executed on the base layer which acts as source of truth. This scheme allows the entire rollup inherit the base layer security, with minimal computation done on-chain.

The scope of this documentation deals with interactive fraud proofs only. Next, we dive into the commonly observed properties across fraud proof designs in optimistic rollups.

## Key properties of interactive fraud proof systems

Fraud proof systems are carefully designed with formal properties and economic incentives to ensure security and liveness. Below are the key components and mechanisms that make fraud proofs effective:

### State Transition Function
At the heart of any fraud proof system is a state transition function - an implementation on the base layer that defines how the system state evolves when a computation step is applied. Rather than re-executing the entire disputed computation, the on-chain state transition function is designed to execute only a single step during the final phase of an interactive dispute resolution process. The state transition function executes the step of computation, and this is compared with the commitments made by both the proposer and the challenger. If the result differs from the proposer’s claim and matches the challenger’s claim, the latter is declared the winner of the dispute.

The validity of a fraud proof hinges on deterministically replaying the transition and comparing roots. This is why determinism and reproducibility are foundational to the design of any optimistic rollup.

### Bisection Game Algorithm
To avoid loading the chain with full execution traces, most systems(notably fraud proofs by Cartesi, Arbitrum and Optimism) use an interactive bisection game. This protocol allows the challenger and the proposer to gradually narrow down their disagreement:
The disputed computation (e.g., execution trace or session) is split into halves.
The challenger selects the half containing the error.
The process repeats recursively until only one step remains.

This logarithmic narrowing reduces on-chain data and minimizes gas usage. Once a single step remains, it’s proven or disproven via a one-step proof - a minimal, verifiable computation step submitted to the rollup contract.

### Bonds and Slashing
To ensure honest participation and deter malicious fraud proofs, rollup systems require participants (both proposers and challengers) to stake a bond. If a party is proven wrong (e.g., submits an invalid claim), their bond is slashed - partially or entirely forfeited.

This economic game has a few core outcomes depending on the design:
- Honest challengers are rewarded when they expose fraud.
- Dishonest actors lose their bonds.
- Participants are incentivized to submit valid claims.

By aligning incentives with correctness, bonds and slashing mechanisms create a trustless system where where misbehavior is penalized while good behavior incentivized.

### Challenge Window
Optimistic rollups define a challenge window - a time period (usually several days) during which any submitted claim can be disputed. If no fraud-proof is submitted during this window, the claim is finalized and assumed valid. While this delays finality, it ensures a safety-first approach, allowing any observer (even lightweight clients) to intervene.

This tradeoff balances fast inclusion with delayed finality, a key distinction from zero-knowledge rollups where validity is proven immediately.

In the following sections, we will dive deeper into some of these components from the perspective of the Cartesi's fraud proof system.
