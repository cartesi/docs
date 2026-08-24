> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: abstract-consensus
title: AbstractConsensus
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/consensus/AbstractConsensus.sol
    title: AbstractConsensus Contract
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

The **AbstractConsensus** contract provides an abstract implementation of `IConsensus` with common consensus functionality, including claim staging/acceptance counters and `IOutputsMerkleRootValidator` helpers (`isOutputsMerkleRootValid`, `getLastFinalizedMachineMerkleRoot`, `wasInputFinalized`).

## Functions

### `isOutputsMerkleRootValid()`

```solidity
function isOutputsMerkleRootValid(address appContract, bytes32 outputsMerkleRoot) public view override returns (bool)
```

Check whether an outputs Merkle root is valid.

### `getEpochLength()` / `getClaimStagingPeriod()`

```solidity
function getEpochLength() public view override returns (uint256)
function getClaimStagingPeriod() public view override returns (uint256)
```

Get the epoch length and claim staging period.

### `wasInputFinalized()` / `getLastFinalizedMachineMerkleRoot()`

See [`IOutputsMerkleRootValidator`](./ioutputs-merkle-root-validator.md).

### `supportsInterface()`

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC165) returns (bool)
```

Check if the contract supports a specific interface (`IConsensus` / `IOutputsMerkleRootValidator`). 