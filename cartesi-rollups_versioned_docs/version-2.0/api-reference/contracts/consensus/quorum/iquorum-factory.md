---
id: iquorum-factory
title: IQuorumFactory
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v2.0.1/src/consensus/quorum/IQuorumFactory.sol
    title: IQuorumFactory Interface
---

The **IQuorumFactory** interface defines the contract for deploying new `IQuorum` contracts.

## Events

### `QuorumCreated`

```solidity
event QuorumCreated(IQuorum quorum)
```

A new quorum was deployed.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `quorum` | `IQuorum` | The quorum |

## Functions

### `newQuorum()`

```solidity
function newQuorum(address[] calldata validators, uint256 epochLength) external returns (IQuorum)
```

Deploy a new quorum.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `validators` | `address[]` | The list of validators |
| `epochLength` | `uint256` | The epoch length |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `IQuorum` | The quorum |

### `newQuorum()` (with salt)

```solidity
function newQuorum(address[] calldata validators, uint256 epochLength, bytes32 salt) external returns (IQuorum)
```

Deploy a new quorum deterministically.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `validators` | `address[]` | The list of validators |
| `epochLength` | `uint256` | The epoch length |
| `salt` | `bytes32` | The salt used to deterministically generate the quorum address |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `IQuorum` | The quorum |

### `calculateQuorumAddress()`

```solidity
function calculateQuorumAddress(
    address[] calldata validators,
    uint256 epochLength,
    bytes32 salt
) external view returns (address)
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