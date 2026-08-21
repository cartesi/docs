> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: ioutputs-merkle-root-validator
title: IOutputsMerkleRootValidator
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.6/src/consensus/IOutputsMerkleRootValidator.sol
    title: IOutputsMerkleRootValidator Interface
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

The `IOutputsMerkleRootValidator` interface provides valid outputs Merkle roots for validation.

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

## Related Contracts

- [`IConsensus`](./iconsensus.md): Interface that inherits from this interface
- [`AbstractConsensus`](./abstract-consensus.md): Abstract implementation that implements this interface 