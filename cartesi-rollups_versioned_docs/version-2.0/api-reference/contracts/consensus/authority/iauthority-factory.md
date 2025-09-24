---
id: iauthority-factory
title: IAuthorityFactory
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v2.0.1/src/consensus/authority/IAuthorityFactory.sol
    title: IAuthorityFactory Interface
---

The **IAuthorityFactory** interface defines the contract for deploying new `IAuthority` contracts.

## Events

### `AuthorityCreated`

```solidity
event AuthorityCreated(IAuthority authority)
```

A new authority was deployed.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `authority` | `IAuthority` | The authority |

## Functions

### `newAuthority()`

```solidity
function newAuthority(address authorityOwner, uint256 epochLength) external returns (IAuthority)
```

Deploy a new authority.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `authorityOwner` | `address` | The initial authority owner |
| `epochLength` | `uint256` | The epoch length |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `IAuthority` | The authority |

### `newAuthority()` (with salt)

```solidity
function newAuthority(address authorityOwner, uint256 epochLength, bytes32 salt) external returns (IAuthority)
```

Deploy a new authority deterministically.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `authorityOwner` | `address` | The initial authority owner |
| `epochLength` | `uint256` | The epoch length |
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
    bytes32 salt
) external view returns (address)
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