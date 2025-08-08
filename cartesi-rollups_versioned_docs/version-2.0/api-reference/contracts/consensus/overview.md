---
id: overview
title: Overview
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v2.0.1/src/consensus
    title: Consensus Smart Contracts
---

The consensus mechanism in Cartesi Rollups is responsible for validating and accepting claims submitted by validators. These contracts ensure the integrity of the rollup by validating outputs Merkle roots.

## Consensus Contracts

The framework supports different consensus mechanisms:

- **[Authority](./authority/authority.md)**: Single-owner consensus controlled by one address
- **[Quorum](./quorum/quorum.md)**: Multi-validator consensus requiring majority approval

## Core Interfaces

- **[IConsensus](./iconsensus.md)**: Main interface defining the consensus contract behavior
- **[IOutputsMerkleRootValidator](./ioutputsmerklerootvalidator.md)**: Interface for validating outputs Merkle roots
- **[AbstractConsensus](./abstractconsensus.md)**: Abstract implementation providing common consensus functionality

## Consensus Mechanism

A claim consists of:

- **Application Contract Address**: The address of the dApp being validated
- **Last Processed Block Number**: The block number up to which inputs have been processed
- **Outputs Merkle Root**: The root hash of the Merkle tree containing all outputs produced by the application

The consensus contract validates that:
- The block number is at the end of an epoch (modulo epoch length equals epoch length - 1)
- The block number is in the past (not future)
- No duplicate claim has been submitted for the same application and epoch

Once a claim is accepted, the outputs Merkle root becomes valid and can be used to validate individual outputs in the application contract.


