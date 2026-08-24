> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: overview
title: Overview
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/consensus
    title: Consensus Smart Contracts
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

The consensus mechanism in Cartesi Rollups is responsible for validating and accepting claims submitted by validators. These contracts ensure the integrity of the rollup by validating outputs Merkle roots.

## Consensus Contracts

The framework supports different consensus mechanisms:

- **[Authority](./authority/authority.md)**: Single-owner consensus controlled by one address
- **[Quorum](./quorum/quorum.md)**: Multi-validator consensus requiring majority approval

## Core Interfaces

- **[IConsensus](./iconsensus.md)**: Main interface defining the consensus contract behavior
- **[IOutputsMerkleRootValidator](./ioutputs-merkle-root-validator.md)**: Interface for validating outputs Merkle roots
- **[AbstractConsensus](./abstract-consensus.md)**: Abstract implementation providing common consensus functionality

## Consensus Mechanism

A claim submission consists of:

- Application contract address
- Last processed block number
- Machine Merkle root (post-epoch machine state)
- Machine validity proof (proves `iflags_Y`, HTIF tohost / `rx accepted`, and the outputs Merkle root in the tx buffer)

If the claim meets the consensus staging criteria, it is **staged**. After the claim staging period elapses, it can be **accepted**. Once accepted, the outputs Merkle root becomes valid and can be used to validate individual outputs in the application contract.

The consensus contract validates that:

- The block number is at the end of an epoch (modulo epoch length equals epoch length - 1)
- The block number is in the past (not future)
- No duplicate claim has been submitted for the same application and epoch by that validator
- The post-epoch machine is manually yielded with an `rx accepted` reason
