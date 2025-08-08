---
id: quorum-factory
title: QuorumFactory
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v2.0.1/src/consensus/quorum/QuorumFactory.sol
    title: QuorumFactory Contract
---

The **QuorumFactory** contract allows anyone to reliably deploy new `IQuorum` contracts.

## Functions

### `newQuorum()`

```solidity
function newQuorum(address[] calldata validators, uint256 epochLength) external override returns (IQuorum)
```

Deploy a new quorum contract.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `validators` | `address[]` | The list of validators |
| `epochLength` | `uint256` | The epoch length |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `IQuorum` | The deployed quorum contract |

### `newQuorum()` (with salt)

```solidity
function newQuorum(address[] calldata validators, uint256 epochLength, bytes32 salt) external override returns (IQuorum)
```

Deploy a new quorum contract deterministically using CREATE2.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `validators` | `address[]` | The list of validators |
| `epochLength` | `uint256` | The epoch length |
| `salt` | `bytes32` | The salt used to deterministically generate the quorum address |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `IQuorum` | The deployed quorum contract |

### `calculateQuorumAddress()`

```solidity
function calculateQuorumAddress(
    address[] calldata validators,
    uint256 epochLength,
    bytes32 salt
) external view override returns (address)
```

Calculate the address of a quorum to be deployed deterministically.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `validators` | `address[]` | The list of validators |
| `epochLength` | `uint256` | The epoch length |
| `salt` | `bytes32` | The salt used to deterministically generate the quorum address |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `address` | The deterministic quorum address | 