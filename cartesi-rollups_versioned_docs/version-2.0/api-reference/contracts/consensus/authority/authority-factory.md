---
id: authority-factory
title: AuthorityFactory
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/consensus/authority/AuthorityFactory.sol
    title: AuthorityFactory Contract
---

The **AuthorityFactory** contract allows anyone to reliably deploy new `IAuthority` contracts. It implements [`IAuthorityFactory`](./iauthority-factory.md).

Every deployment takes an epoch length and a claim staging period. See the [claim lifecycle](../overview.md#claim-lifecycle) for how the staging period is used.

## Functions

### `newAuthority()`

```solidity
function newAuthority(
    address authorityOwner,
    uint256 epochLength,
    uint256 claimStagingPeriod
) external override returns (IAuthority)
```

Deploy a new authority contract.

*On success, emits an `AuthorityCreated` event. Reverts if the authority owner address is zero or if the epoch length is zero (`ZeroEpochLength`).*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `authorityOwner` | `address` | The initial authority owner |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | The claim staging period, in number of blocks |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `IAuthority` | The deployed authority contract |

### `newAuthority()` (with salt)

```solidity
function newAuthority(
    address authorityOwner,
    uint256 epochLength,
    uint256 claimStagingPeriod,
    bytes32 salt
) external override returns (IAuthority)
```

Deploy a new authority contract deterministically using CREATE2.

*On success, emits an `AuthorityCreated` event. Reverts if the authority owner address is zero or if the epoch length is zero (`ZeroEpochLength`).*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `authorityOwner` | `address` | The initial authority owner |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | The claim staging period, in number of blocks |
| `salt` | `bytes32` | The salt used to deterministically generate the authority address |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `IAuthority` | The deployed authority contract |

### `calculateAuthorityAddress()`

```solidity
function calculateAuthorityAddress(
    address authorityOwner,
    uint256 epochLength,
    uint256 claimStagingPeriod,
    bytes32 salt
) external view override returns (address)
```

Calculate the address of an authority to be deployed deterministically.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `authorityOwner` | `address` | The initial authority owner |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | The claim staging period, in number of blocks |
| `salt` | `bytes32` | The salt used to deterministically generate the authority address |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `address` | The deterministic authority address |

### `version()`

```solidity
function version() external pure returns (uint64 major, uint64 minor, uint64 patch, string memory preRelease, string memory buildMetadata)
```

Get the version of the contracts project, for example `(3, 0, 0, "alpha.10", "")`.
