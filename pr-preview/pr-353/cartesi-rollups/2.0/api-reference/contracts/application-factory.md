> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: application-factory
title: ApplicationFactory
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.6/src/dapp/ApplicationFactory.sol
    title: Application Factory contract
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

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
    bytes calldata dataAvailability,
    WithdrawalConfig calldata withdrawalConfig
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
| `withdrawalConfig` | `WithdrawalConfig` | The withdrawal configuration (see [WithdrawalConfig](./withdrawal/withdrawal-config.md)). Pass a zero-valued config to deploy without emergency withdrawal |

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
    WithdrawalConfig calldata withdrawalConfig,
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
| `withdrawalConfig` | `WithdrawalConfig` | The withdrawal configuration (see [WithdrawalConfig](./withdrawal/withdrawal-config.md)). Pass a zero-valued config to deploy without emergency withdrawal |
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
    WithdrawalConfig calldata withdrawalConfig,
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
| `withdrawalConfig` | `WithdrawalConfig` | The withdrawal configuration (see [WithdrawalConfig](./withdrawal/withdrawal-config.md)). Pass a zero-valued config to deploy without emergency withdrawal |
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
    WithdrawalConfig withdrawalConfig,
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
| `withdrawalConfig` | `WithdrawalConfig` | The withdrawal configuration (see [WithdrawalConfig](./withdrawal/withdrawal-config.md)). Pass a zero-valued config to deploy without emergency withdrawal |
| `appContract` | `IApplication` | The deployed Application contract |

## Errors

### `InvalidWithdrawalConfig()`

```solidity
error InvalidWithdrawalConfig(WithdrawalConfig withdrawalConfig)
```

Raised at deployment when the provided [`WithdrawalConfig`](./withdrawal/withdrawal-config.md) is invalid, meaning its accounts-drive layout does not fit inside the machine memory (see [`LibWithdrawalConfig.isValid`](./withdrawal/withdrawal-config.md#validation)). Checking the config in the factory means users and the node do not have to check it themselves.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `withdrawalConfig` | `WithdrawalConfig` | The invalid withdrawal configuration |
