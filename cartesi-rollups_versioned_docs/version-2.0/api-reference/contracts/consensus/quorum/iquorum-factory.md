---
id: iquorum-factory
title: IQuorumFactory
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/consensus/quorum/IQuorumFactory.sol
    title: IQuorumFactory Interface
---

The **IQuorumFactory** interface defines the contract for deploying new `IQuorum` contracts. It inherits from `IVersionGetter`, `IConsensusFactoryErrors` and `IQuorumFactoryErrors`.

## Events

### `QuorumCreated`

```solidity
event QuorumCreated(IQuorum quorum)
```

A new quorum was deployed. MUST be triggered on a successful call to `newQuorum`.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `quorum` | `IQuorum` | The quorum |

## Functions

### `newQuorum()`

```solidity
function newQuorum(
    address[] calldata validators,
    uint256 epochLength,
    uint256 claimStagingPeriod
) external returns (IQuorum)
```

Deploy a new quorum.

*On success, MUST emit a `QuorumCreated` event. Duplicates in the `validators` array are ignored. Reverts if the epoch length is zero.*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `validators` | `address[]` | The list of validators |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | The claim staging period |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `IQuorum` | The quorum |

### `newQuorum()` (with salt)

```solidity
function newQuorum(
    address[] calldata validators,
    uint256 epochLength,
    uint256 claimStagingPeriod,
    bytes32 salt
) external returns (IQuorum)
```

Deploy a new quorum deterministically.

*On success, MUST emit a `QuorumCreated` event. Duplicates in the `validators` array are ignored. Reverts if the epoch length is zero.*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `validators` | `address[]` | The list of validators |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | The claim staging period |
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
    uint256 claimStagingPeriod,
    bytes32 salt
) external view returns (address)
```

Calculate the address of a quorum to be deployed deterministically.

*Only the `newQuorum` function with the `salt` parameter deploys a quorum deterministically.*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `validators` | `address[]` | The list of validators |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | The claim staging period |
| `salt` | `bytes32` | The salt used to deterministically generate the quorum address |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `address` | The deterministic quorum address |

## Errors

### `ZeroEpochLength()`

```solidity
error ZeroEpochLength()
```

Raised when a consensus would be deployed with zero as epoch length. This is forbidden because it would lead to a division by zero when calculating the epoch of a block (`block.number / epochLength`).

### `ZeroAddressValidator()`

```solidity
error ZeroAddressValidator()
```

Raised when a quorum would be deployed with the zero address as one of the validators. The zero address is reserved as a sentinel value for non-validators (see `validatorById`).

### `EmptyQuorum()`

```solidity
error EmptyQuorum()
```

Raised when a quorum would be deployed with an empty array of validators.
