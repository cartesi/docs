---
id: abstractconsensus
title: AbstractConsensus
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v2.0.1/src/consensus/AbstractConsensus.sol
    title: AbstractConsensus Contract
---

The **AbstractConsensus** contract provides an abstract implementation of `IConsensus` with common consensus functionality.

## Functions

### `isOutputsMerkleRootValid()`

```solidity
function isOutputsMerkleRootValid(address appContract, bytes32 outputsMerkleRoot) public view override returns (bool)
```

Check whether an outputs Merkle root is valid.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `outputsMerkleRoot` | `bytes32` | The outputs Merkle root |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `bool` | True if the outputs Merkle root is valid |

### `getEpochLength()`

```solidity
function getEpochLength() public view override returns (uint256)
```

Get the epoch length.

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `uint256` | The epoch length |

### `supportsInterface()`

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC165) returns (bool)
```

Check if the contract supports a specific interface.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `interfaceId` | `bytes4` | The interface identifier |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `bool` | True if the interface is supported | 