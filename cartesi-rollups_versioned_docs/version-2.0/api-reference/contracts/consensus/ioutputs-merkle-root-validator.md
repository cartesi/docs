---
id: ioutputs-merkle-root-validator
title: IOutputsMerkleRootValidator
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/consensus/IOutputsMerkleRootValidator.sol
    title: IOutputsMerkleRootValidator Interface
---

The `IOutputsMerkleRootValidator` interface provides valid outputs Merkle roots for validation.

## Description

This is the interface an [`Application`](../application.md) relies on: it validates outputs against `isOutputsMerkleRootValid`, proves its accounts drive against `getLastFinalizedMachineMerkleRoot` after foreclosure, and decides which deposits can be refunded with `wasInputFinalized`. A custom validator must implement all three functions.

This interface inherits from `IERC165`. ERC-165 can be used to determine whether this contract also supports any other interface (e.g. for submitting claims).

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

Get the last finalized machine Merkle root.

**Parameters:**
- `appContract` (address): The application contract address

**Returns:**
- (bytes32): The last finalized machine Merkle root

**Note:** Returns zero if no machine Merkle root has been finalized yet for that application. In that case, the `Application` contract uses its template hash instead when proving the accounts drive.

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
- `blockNumber` (uint256): The number of the base layer block in which the input was added

**Returns:**
- (bool): Whether the input was finalized

**Note:** This function assumes that an input with such an index exists in the input box of the application, and that it was added in such a base layer block. Foreclosed applications use this function to issue refunds for deposit inputs that were not finalized.

## Related Contracts

- [`IConsensus`](./iconsensus.md): Interface that inherits from this interface
- [`AbstractConsensus`](./abstract-consensus.md): Abstract implementation that implements this interface
- [`DaveConsensus`](https://github.com/cartesi/dave/tree/v3.0.0-alpha.6/cartesi-rollups/contracts/src/DaveConsensus.sol): The PRT consensus contract, which implements this interface but not `IConsensus`
