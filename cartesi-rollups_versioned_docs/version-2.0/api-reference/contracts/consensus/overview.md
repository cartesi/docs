---
id: overview
title: Overview
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/consensus
    title: Consensus Smart Contracts
---

The consensus mechanism in Cartesi Rollups is responsible for validating, staging and accepting claims submitted by validators. These contracts ensure the integrity of the rollup by deciding which outputs Merkle roots are valid, so that the [`Application`](../application.md) contract can validate and execute outputs.

## Consensus Contracts

The framework supports different consensus mechanisms:

- **[Authority](./authority/authority.md)**: Single-owner consensus controlled by one address
- **[Quorum](./quorum/quorum.md)**: Multi-validator consensus requiring majority approval

Both are deployed through factories ([`AuthorityFactory`](./authority/authority-factory.md), [`QuorumFactory`](./quorum/quorum-factory.md)) that take the epoch length and the claim staging period.

:::note PRT applications
Applications that use PRT (fraud proofs with permissionless dispute tournaments) use the [`DaveConsensus`](https://github.com/cartesi/dave/tree/v3.0.0-alpha.6/cartesi-rollups/contracts/src/DaveConsensus.sol) contract from the [cartesi/dave](https://github.com/cartesi/dave/tree/v3.0.0-alpha.6) repository. `DaveConsensus` implements [`IOutputsMerkleRootValidator`](./ioutputs-merkle-root-validator.md), but not `IConsensus`: it has no `submitClaim()` or `acceptClaim()`, and its epochs are settled through tournaments. The `IConsensus` lifecycle below does not apply to it.
:::

## Core Interfaces

- **[IConsensus](./iconsensus.md)**: Main interface defining the consensus contract behavior
- **[IOutputsMerkleRootValidator](./ioutputs-merkle-root-validator.md)**: Interface the `Application` contract uses to validate outputs, prove the accounts drive and decide refunds
- **[AbstractConsensus](./abstract-consensus.md)**: Abstract implementation providing common consensus functionality

## Consensus Mechanism

A claim consists of:

- Application Contract Address: The address of the application being validated
- Last Processed Block Number: The last block of the epoch the claim covers
- Machine Merkle Root: The root hash of the post-epoch machine state

When submitting a claim, the validator also sends a machine validity proof. From it, the consensus checks that the post-epoch machine is in a valid state and proves the **outputs Merkle root** (the root of the Merkle tree of all outputs produced by the application), which is stored in the machine memory.

The consensus contract validates that:
- The block number is at the end of an epoch (modulo epoch length equals epoch length - 1)
- The block number is in the past (not future)
- No duplicate claim has been submitted for the same application and epoch (by the same validator, in the case of a quorum)
- The application is deployed and not foreclosed

### Claim lifecycle

1. **Submit.** A validator calls `submitClaim(appContract, lastProcessedBlockNumber, machineMerkleRoot, proof)`. The consensus emits `ClaimSubmitted`.
2. **Stage.** When the claim meets the staging criteria of the consensus model, it is staged and the consensus emits `ClaimStaged`. In an `Authority`, a claim submitted by the owner is staged immediately. In a `Quorum`, a claim is staged when a majority of the validators (`1 + N/2`) submit the same machine Merkle root for the epoch.
3. **Wait.** The claim stays staged for at least `getClaimStagingPeriod()` blocks. During this period, the application guardian can foreclose the application, which prevents the claim from being accepted.
4. **Accept.** After the staging period, **anyone** can call `acceptClaim(appContract, lastProcessedBlockNumber, machineMerkleRoot)`. The consensus emits `ClaimAccepted`, and the claim's outputs Merkle root becomes valid. Only then can outputs of that epoch be validated and executed in the application contract.

A staged claim is not accepted automatically: someone must call `acceptClaim()` once the staging period is over. The Cartesi Rollups Node sends this transaction for the applications it validates. Calls made before the end of the staging period revert with `ClaimStagingPeriodNotOverYet`.

:::caution Choosing the claim staging period
The claim staging period is the window the guardian has to react to a bad claim. With a staging period of 0, a staged claim can be accepted in the same block in which it was staged, so the guardian has no window. Set it to a number of blocks larger than the time the guardian needs to notice a bad claim and foreclose the application.
:::

Use `getClaim()` to read the status of a claim (`UNSTAGED`, `STAGED` or `ACCEPTED`), and `getNumberOfSubmittedClaims()`, `getNumberOfStagedClaims()` and `getNumberOfAcceptedClaims()` to track progress per application.
