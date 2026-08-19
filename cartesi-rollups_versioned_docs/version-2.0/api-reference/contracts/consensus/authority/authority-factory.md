---
id: authority-factory
title: AuthorityFactory
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.6/src/consensus/authority/AuthorityFactory.sol
    title: AuthorityFactory Contract
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

The **AuthorityFactory** contract allows anyone to reliably deploy new `IAuthority` contracts.

## Functions

### `newAuthority()`

```solidity
function newAuthority(address authorityOwner, uint256 epochLength) external override returns (IAuthority)
```

Deploy a new authority contract.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `authorityOwner` | `address` | The initial authority owner |
| `epochLength` | `uint256` | The epoch length |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `IAuthority` | The deployed authority contract |

### `newAuthority()` (with salt)

```solidity
function newAuthority(address authorityOwner, uint256 epochLength, bytes32 salt) external override returns (IAuthority)
```

Deploy a new authority contract deterministically using CREATE2.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `authorityOwner` | `address` | The initial authority owner |
| `epochLength` | `uint256` | The epoch length |
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
    bytes32 salt
) external view override returns (address)
```

Calculate the address of an authority to be deployed deterministically.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `authorityOwner` | `address` | The initial authority owner |
| `epochLength` | `uint256` | The epoch length |
| `salt` | `bytes32` | The salt used to deterministically generate the authority address |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `address` | The deterministic authority address | 