> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: application-factory
title: ApplicationFactory
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/dapp/ApplicationFactory.sol
    title: Application Factory contract
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/dapp/IApplicationFactory.sol
    title: IApplicationFactory interface
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

The **ApplicationFactory** contract is a tool for reliably deploying new instances of the [`Application`](../contracts/application.md) contract with or without a specified salt value for address derivation.

Additionally, it provides a function to calculate the address of a potential new `Application` contract based on input parameters.

The factory takes an [`IRefundOutputBuilder`](https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/refund/IRefundOutputBuilder.sol) in its constructor. That refund builder is a factory-wide immutable: every application deployed by this factory shares it, and it is not part of `WithdrawalConfig` or of `newApplication` parameters.

## Functions

### `constructor()`

```solidity
constructor(IRefundOutputBuilder refundOutputBuilder)
```

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `refundOutputBuilder` | `IRefundOutputBuilder` | Factory-wide builder used for deposit refunds after foreclosure |

### `newApplication()`

```solidity
function newApplication(
    IOutputsMerkleRootValidator outputsMerkleRootValidator,
    address appOwner,
    bytes32 templateHash,
    IInputBox inputBox,
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
| `inputBox` | `IInputBox` | The input box contract |
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
    IInputBox inputBox,
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
| `inputBox` | `IInputBox` | The input box contract |
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
    IInputBox inputBox,
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
| `inputBox` | `IInputBox` | The input box contract |
| `withdrawalConfig` | `WithdrawalConfig` | The withdrawal configuration (see [WithdrawalConfig](./withdrawal/withdrawal-config.md)). Pass a zero-valued config to deploy without emergency withdrawal |
| `salt` | `bytes32` | Salt value for address derivation |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `address` | Address of the potential new Application contract |

### `version()`

```solidity
function version() external view returns (string memory)
```

Return the rollups-contracts package version string.

## Events

### `ApplicationCreated()`

```solidity
event ApplicationCreated(
    IOutputsMerkleRootValidator indexed outputsMerkleRootValidator,
    address appOwner,
    bytes32 templateHash,
    IInputBox inputBox,
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
| `inputBox` | `IInputBox` | The input box contract |
| `withdrawalConfig` | `WithdrawalConfig` | The withdrawal configuration |
| `appContract` | `IApplication` | The deployed Application contract |

## Errors

### `InvalidWithdrawalConfig()`

```solidity
error InvalidWithdrawalConfig(WithdrawalConfig withdrawalConfig)
```

Raised at deployment when the provided [`WithdrawalConfig`](./withdrawal/withdrawal-config.md) is invalid, meaning its accounts-drive layout does not fit inside the machine memory (see [`LibWithdrawalConfig.isValid`](./withdrawal/withdrawal-config.md#validation)). Checking the config in the factory means users and the node do not have to check it themselves.

## Self-hosted factory

[`ISelfHostedApplicationFactory`](https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/dapp/ISelfHostedApplicationFactory.sol) deploys an Authority + Application pair in one transaction.

```solidity
function deployContracts(
    address authorityOwner,
    uint256 epochLength,
    uint256 claimStagingPeriod,
    bytes32 templateHash,
    IInputBox inputBox,
    WithdrawalConfig calldata withdrawalConfig,
    bytes32 salt
) external returns (IApplication, IAuthority);
```

There is no `appOwner` parameter: the factory deploys the application under its own ownership and immediately renounces it, so self-hosted applications are ownerless and cannot migrate to another outputs Merkle root validator after deployment. `calculateAddresses` takes the same arguments (without returning ownership control).
