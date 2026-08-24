---
id: ioutputs-merkle-root-validator
title: IOutputsMerkleRootValidator
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/consensus/IOutputsMerkleRootValidator.sol
    title: IOutputsMerkleRootValidator Interface
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

The `IOutputsMerkleRootValidator` interface provides valid outputs Merkle roots for validation, last-finalized machine Merkle roots, and input finalization checks.

## Description

This interface provides functionality to check whether an outputs Merkle root is valid. ERC-165 can be used to determine whether this contract also supports any other interface (e.g. for submitting claims).

## Functions

### `isOutputsMerkleRootValid`

```solidity
function isOutputsMerkleRootValid(address appContract, bytes32 outputsMerkleRoot) external view returns (bool)
```

Check whether an outputs Merkle root is valid.

**Parameters:**
- `appContract` (address): The application contract address
- `outputsMerkleRoot` (bytes32): The outputs Merkle root

**Returns:**
- (bool): True if the outputs Merkle root is valid

### `getLastFinalizedMachineMerkleRoot`

```solidity
function getLastFinalizedMachineMerkleRoot(address appContract) external view returns (bytes32)
```

Get the last finalized machine Merkle root for an application.

**Returns:**
- (bytes32): The last finalized machine Merkle root, or zero if none has been finalized yet

### `wasInputFinalized`

```solidity
function wasInputFinalized(
    address appContract,
    uint256 inputIndex,
    uint256 blockNumber
) external view returns (bool)
```

Check whether an input was finalized.

**Parameters:**
- `appContract` (address): The application contract address
- `inputIndex` (uint256): The index of the input in the application's input box
- `blockNumber` (uint256): The number of the base-layer block in which the input was added

**Returns:**
- (bool): Whether the input was finalized

*Assumes that an input with such an index exists and was added in that block. Foreclosed applications use this when issuing refunds for deposit inputs that were not finalized.*

## Related Contracts

- [`IConsensus`](./iconsensus.md): Interface that inherits from this interface
- [`AbstractConsensus`](./abstract-consensus.md): Abstract implementation that implements this interface
