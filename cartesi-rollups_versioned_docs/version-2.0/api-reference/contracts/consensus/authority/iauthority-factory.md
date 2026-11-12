---
id: iauthority-factory
title: IAuthorityFactory
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/consensus/authority/IAuthorityFactory.sol
    title: IAuthorityFactory Interface
---

The **IAuthorityFactory** interface defines the contract for deploying new `IAuthority` contracts. It inherits from `IVersionGetter` and `IConsensusFactoryErrors`.

## Events

### `AuthorityCreated`

```solidity
event AuthorityCreated(IAuthority authority)
```

A new authority was deployed. MUST be triggered on a successful call to `newAuthority`.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `authority` | `IAuthority` | The authority |

## Functions

### `newAuthority()`

```solidity
function newAuthority(
    address authorityOwner,
    uint256 epochLength,
    uint256 claimStagingPeriod
) external returns (IAuthority)
```

Deploy a new authority.

*On success, MUST emit an `AuthorityCreated` event. Reverts if the authority owner address is zero. Reverts if the epoch length is zero.*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `authorityOwner` | `address` | The initial authority owner |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | The claim staging period |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `IAuthority` | The authority |

### `newAuthority()` (with salt)

```solidity
function newAuthority(
    address authorityOwner,
    uint256 epochLength,
    uint256 claimStagingPeriod,
    bytes32 salt
) external returns (IAuthority)
```

Deploy a new authority deterministically.

*On success, MUST emit an `AuthorityCreated` event. Reverts if the authority owner address is zero. Reverts if the epoch length is zero.*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `authorityOwner` | `address` | The initial authority owner |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | The claim staging period |
| `salt` | `bytes32` | The salt used to deterministically generate the authority address |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `IAuthority` | The authority |

### `calculateAuthorityAddress()`

```solidity
function calculateAuthorityAddress(
    address authorityOwner,
    uint256 epochLength,
    uint256 claimStagingPeriod,
    bytes32 salt
) external view returns (address)
```

Calculate the address of an authority to be deployed deterministically.

*Only the `newAuthority` function with the `salt` parameter deploys an authority deterministically.*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `authorityOwner` | `address` | The initial authority owner |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | The claim staging period |
| `salt` | `bytes32` | The salt used to deterministically generate the authority address |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `address` | The deterministic authority address |

## Errors

### `ZeroEpochLength()`

```solidity
error ZeroEpochLength()
```

Raised when a consensus would be deployed with zero as epoch length. This is forbidden because it would lead to a division by zero when calculating the epoch of a block (`block.number / epochLength`).
