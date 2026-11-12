---
id: quorum-factory
title: QuorumFactory
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/consensus/quorum/QuorumFactory.sol
    title: QuorumFactory Contract
---

The **QuorumFactory** contract allows anyone to reliably deploy new `IQuorum` contracts. It implements [`IQuorumFactory`](./iquorum-factory.md).

Every deployment takes an epoch length and a claim staging period. See the [claim lifecycle](../overview.md#claim-lifecycle) for how the staging period is used.

## Functions

### `newQuorum()`

```solidity
function newQuorum(
    address[] calldata validators,
    uint256 epochLength,
    uint256 claimStagingPeriod
) external override returns (IQuorum)
```

Deploy a new quorum contract.

*On success, emits a `QuorumCreated` event. Duplicates in the `validators` array are ignored. Reverts with `ZeroEpochLength`, `ZeroAddressValidator` or `EmptyQuorum` (see [`IQuorumFactory`](./iquorum-factory.md#errors)).*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `validators` | `address[]` | The list of validators |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | The claim staging period, in number of blocks |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `IQuorum` | The deployed quorum contract |

### `newQuorum()` (with salt)

```solidity
function newQuorum(
    address[] calldata validators,
    uint256 epochLength,
    uint256 claimStagingPeriod,
    bytes32 salt
) external override returns (IQuorum)
```

Deploy a new quorum contract deterministically using CREATE2.

*On success, emits a `QuorumCreated` event. Duplicates in the `validators` array are ignored. Reverts with `ZeroEpochLength`, `ZeroAddressValidator` or `EmptyQuorum` (see [`IQuorumFactory`](./iquorum-factory.md#errors)).*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `validators` | `address[]` | The list of validators |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | The claim staging period, in number of blocks |
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
    uint256 claimStagingPeriod,
    bytes32 salt
) external view override returns (address)
```

Calculate the address of a quorum to be deployed deterministically.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `validators` | `address[]` | The list of validators |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | The claim staging period, in number of blocks |
| `salt` | `bytes32` | The salt used to deterministically generate the quorum address |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `address` | The deterministic quorum address |

### `version()`

```solidity
function version() external pure returns (uint64 major, uint64 minor, uint64 patch, string memory preRelease, string memory buildMetadata)
```

Get the version of the contracts project, for example `(3, 0, 0, "alpha.10", "")`.
