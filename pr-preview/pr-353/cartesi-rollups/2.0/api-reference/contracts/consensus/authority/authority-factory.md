> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: authority-factory
title: AuthorityFactory
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/consensus/authority/AuthorityFactory.sol
    title: AuthorityFactory Contract
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/consensus/authority/IAuthorityFactory.sol
    title: IAuthorityFactory Interface
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

The **AuthorityFactory** contract allows anyone to reliably deploy new `IAuthority` contracts.

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

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `authorityOwner` | `address` | The initial authority owner |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | How many base-layer blocks must elapse before a staged claim can be accepted |

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

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `authorityOwner` | `address` | The initial authority owner |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | How many base-layer blocks must elapse before a staged claim can be accepted |
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
| `claimStagingPeriod` | `uint256` | How many base-layer blocks must elapse before a staged claim can be accepted |
| `salt` | `bytes32` | The salt used to deterministically generate the authority address |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `address` | The deterministic authority address |

### `version()`

```solidity
function version() external view returns (string memory)
```

Return the rollups-contracts package version string.

## Events

### `AuthorityCreated()`

```solidity
event AuthorityCreated(IAuthority authority)
```

Emitted when a new authority is deployed.
