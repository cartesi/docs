---
id: application-factory
title: ApplicationFactory
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v2.0.1/src/dapp/ApplicationFactory.sol
    title: Application Factory contract
---

The **ApplicationFactory** contract is a tool for reliably deploying new instances of the [`Application`](../contracts/application.md) contract with or without a specified salt value for address derivation.

Additionally, it provides a function to calculate the address of a potential new `CartesiDApp` contract based on input parameters.

This contract ensures efficient and secure deployment of `Application` contracts within the Cartesi Rollups framework.

## Functions

### `newApplication()`

```solidity
function newApplication(
    IOutputsMerkleRootValidator outputsMerkleRootValidator,
    address appOwner,
    bytes32 templateHash,
    bytes calldata dataAvailability
) external override returns (IApplication)
```

Deploys a new Application contract without a salt value for address derivation.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `outputsMerkleRootValidator` | `IOutputsMerkleRootValidator` | The initial outputs Merkle root validator contract |
| `appOwner` | `address` | Address of the owner of the application |
| `templateHash` | `bytes32` | Hash of the template for the application |
| `dataAvailability` | `bytes` | The data availability solution |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `IApplication` | The deployed Application contract |

### `newApplication()` (with salt)

```solidity
function newApplication(
    IOutputsMerkleRootValidator outputsMerkleRootValidator,
    address appOwner,
    bytes32 templateHash,
    bytes calldata dataAvailability,
    bytes32 salt
) external override returns (IApplication)
```

Deploys a new `Application` contract with a specified salt value for address derivation.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `outputsMerkleRootValidator` | `IOutputsMerkleRootValidator` | The initial outputs Merkle root validator contract |
| `appOwner` | `address` | Address of the owner of the application |
| `templateHash` | `bytes32` | Hash of the template for the application |
| `dataAvailability` | `bytes` | The data availability solution |
| `salt` | `bytes32` | Salt value for address derivation |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `IApplication` | The deployed Application contract |

### `calculateApplicationAddress()`

```solidity
function calculateApplicationAddress(
    IOutputsMerkleRootValidator outputsMerkleRootValidator,
    address appOwner,
    bytes32 templateHash,
    bytes calldata dataAvailability,
    bytes32 salt
) external view override returns (address)
```

Calculates the address of a potential new Application contract based on input parameters.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `outputsMerkleRootValidator` | `IOutputsMerkleRootValidator` | The initial outputs Merkle root validator contract |
| `appOwner` | `address` | Address of the owner of the application |
| `templateHash` | `bytes32` | Hash of the template for the application |
| `dataAvailability` | `bytes` | The data availability solution |
| `salt` | `bytes32` | Salt value for address derivation |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `address` | Address of the potential new Application contract |

## Events

### `ApplicationCreated()`

```solidity
event ApplicationCreated(
    IOutputsMerkleRootValidator outputsMerkleRootValidator,
    address appOwner,
    bytes32 templateHash,
    bytes dataAvailability,
    IApplication appContract
)
```

A new Application contract was deployed.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `outputsMerkleRootValidator` | `IOutputsMerkleRootValidator` | The outputs Merkle root validator contract |
| `appOwner` | `address` | The owner of the application |
| `templateHash` | `bytes32` | The template hash |
| `dataAvailability` | `bytes` | The data availability solution |
| `appContract` | `IApplication` | The deployed Application contract |
