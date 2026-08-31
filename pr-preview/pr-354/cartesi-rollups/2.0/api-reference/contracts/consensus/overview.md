> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: overview
title: Overview
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/consensus
    title: Consensus Smart Contracts
---

The consensus contracts receive claims about an Application's post-epoch machine state. A claim proves both the machine Merkle root and the cumulative outputs Merkle root stored inside that machine. After the claim is staged and accepted, the Application can validate and execute outputs from the accepted outputs root.

## Consensus Contracts

The framework supports different consensus mechanisms:

- **[Authority](./authority/authority.md)**: One owner submits claims, which are staged immediately
- **[Quorum](./quorum/quorum.md)**: An immutable validator set stages a claim after a strict-majority vote

## Core Interfaces

- **[IConsensus](./iconsensus.md)**: Main interface defining the consensus contract behavior
- **[IOutputsMerkleRootValidator](./ioutputs-merkle-root-validator.md)**: Interface for validating outputs Merkle roots
- **[AbstractConsensus](./abstract-consensus.md)**: Abstract implementation providing common consensus functionality

## Consensus Mechanism

A claim submission identifies:

- the Application contract;
- the final base-layer block processed in the epoch;
- the post-epoch machine Merkle root; and
- a machine-validity proof showing a valid `rx accepted` yield and the outputs Merkle root in the transmit buffer.

The consensus verifies that the processed block is in the past and falls at an epoch boundary. Its concrete staging rule then applies. Staged claims remain pending for the configured claim-staging period, giving the guardian time to foreclose an Application if a bad claim is detected. After that period, anyone can accept the claim.

Acceptance makes the outputs Merkle root valid, records the latest finalized machine root, and advances the first unprocessed block for that Application. See [`IConsensus`](./iconsensus.md) for the proof, lifecycle, events, and errors.

