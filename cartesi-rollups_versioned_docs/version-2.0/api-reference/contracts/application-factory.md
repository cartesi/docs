---
id: application-factory
title: ApplicationFactory
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/dapp/ApplicationFactory.sol
    title: Application Factory contract
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/dapp/IApplicationFactory.sol
    title: IApplicationFactory interface
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/dapp/SelfHostedApplicationFactory.sol
    title: Self-hosted Application Factory contract
---

The **ApplicationFactory** contract is a tool for reliably deploying new instances of the [`Application`](../contracts/application.md) contract with or without a specified salt value for address derivation.

Additionally, it provides a function to calculate the address of a potential new `Application` contract based on input parameters.

This contract ensures efficient and secure deployment of `Application` contracts within the Cartesi Rollups framework.

Every application deployed by a given factory uses the same refund output builder, set when the factory is deployed. See also the [`SelfHostedApplicationFactory`](#selfhostedapplicationfactory) below, which deploys an application together with its `Authority`.

## Functions

### `constructor()`

```solidity
constructor(IRefundOutputBuilder refundOutputBuilder)
```

Creates an `ApplicationFactory` contract.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `refundOutputBuilder` | `IRefundOutputBuilder` | The refund output builder passed to every application this factory deploys (see [`getRefundOutputBuilder()`](./application.md#getrefundoutputbuilder)) |

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

*On success, emits an `ApplicationCreated` event. Reverts if the application owner address is zero, or with `InvalidWithdrawalConfig` if the withdrawal configuration is invalid.*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `outputsMerkleRootValidator` | `IOutputsMerkleRootValidator` | The initial outputs Merkle root validator contract |
| `appOwner` | `address` | Address of the owner of the application |
| `templateHash` | `bytes32` | Hash of the template for the application |
| `inputBox` | `IInputBox` | The input box contract the application reads inputs from |
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

*On success, emits an `ApplicationCreated` event. Reverts if the application owner address is zero, or with `InvalidWithdrawalConfig` if the withdrawal configuration is invalid.*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `outputsMerkleRootValidator` | `IOutputsMerkleRootValidator` | The initial outputs Merkle root validator contract |
| `appOwner` | `address` | Address of the owner of the application |
| `templateHash` | `bytes32` | Hash of the template for the application |
| `inputBox` | `IInputBox` | The input box contract the application reads inputs from |
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

Calculates the address of a potential new Application contract based on input parameters. The address also depends on the factory's refund output builder.

*Only the `newApplication` function with the `salt` parameter deploys an application deterministically.*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `outputsMerkleRootValidator` | `IOutputsMerkleRootValidator` | The initial outputs Merkle root validator contract |
| `appOwner` | `address` | Address of the owner of the application |
| `templateHash` | `bytes32` | Hash of the template for the application |
| `inputBox` | `IInputBox` | The input box contract the application reads inputs from |
| `withdrawalConfig` | `WithdrawalConfig` | The withdrawal configuration (see [WithdrawalConfig](./withdrawal/withdrawal-config.md)). Pass a zero-valued config to deploy without emergency withdrawal |
| `salt` | `bytes32` | Salt value for address derivation |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `address` | Address of the potential new Application contract |

### `version()`

```solidity
function version() external pure returns (uint64 major, uint64 minor, uint64 patch, string memory preRelease, string memory buildMetadata)
```

Get the version of the contracts project, for example `(3, 0, 0, "alpha.10", "")`.

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

A new Application contract was deployed. `outputsMerkleRootValidator` is an indexed topic.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `outputsMerkleRootValidator` | `IOutputsMerkleRootValidator` | The outputs Merkle root validator contract |
| `appOwner` | `address` | The owner of the application |
| `templateHash` | `bytes32` | The template hash |
| `inputBox` | `IInputBox` | The input box contract |
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

## `SelfHostedApplicationFactory`

The **SelfHostedApplicationFactory** deploys a new `Authority` and a new `Application` already linked to it, deterministically, in a single transaction. It holds the addresses of an `AuthorityFactory` and an `ApplicationFactory`, set in its constructor. It is the factory that `cartesi-rollups-cli deploy application` uses when no `--consensus` is given (and the application is not a PRT application).

The application is deployed with the self-hosted factory as its initial owner, and the factory renounces ownership in the same transaction. Self-hosted applications are therefore **ownerless** from the start and can never migrate to another outputs Merkle root validator.

Since it deploys through the configured factories, a successful `deployContracts` call also emits `AuthorityCreated` (from the `AuthorityFactory`) and `ApplicationCreated` (from the `ApplicationFactory`, with the self-hosted factory address as `appOwner`).

### `constructor()`

```solidity
constructor(IAuthorityFactory authorityFactory, IApplicationFactory applicationFactory)
```

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `authorityFactory` | `IAuthorityFactory` | The authority factory |
| `applicationFactory` | `IApplicationFactory` | The application factory |

### `deployContracts()`

```solidity
function deployContracts(
    address authorityOwner,
    uint256 epochLength,
    uint256 claimStagingPeriod,
    bytes32 templateHash,
    IInputBox inputBox,
    WithdrawalConfig calldata withdrawalConfig,
    bytes32 salt
) external returns (IApplication application, IAuthority authority)
```

Deploy new application and authority contracts deterministically.

*Reverts if the authority owner address is zero. Reverts with `ZeroEpochLength` if the epoch length is zero, and with `InvalidWithdrawalConfig` if the withdrawal configuration is invalid.*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `authorityOwner` | `address` | The initial authority owner (the account that submits claims) |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | The claim staging period, in number of blocks (see the [claim lifecycle](./consensus/overview.md#claim-lifecycle)) |
| `templateHash` | `bytes32` | The initial machine state hash |
| `inputBox` | `IInputBox` | The input box contract |
| `withdrawalConfig` | `WithdrawalConfig` | The withdrawal configuration (see [WithdrawalConfig](./withdrawal/withdrawal-config.md)) |
| `salt` | `bytes32` | The salt used to deterministically generate the addresses |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `application` | `IApplication` | The application contract |
| `authority` | `IAuthority` | The authority contract |

### `calculateAddresses()`

```solidity
function calculateAddresses(
    address authorityOwner,
    uint256 epochLength,
    uint256 claimStagingPeriod,
    bytes32 templateHash,
    IInputBox inputBox,
    WithdrawalConfig calldata withdrawalConfig,
    bytes32 salt
) external view returns (address application, address authority)
```

Calculate the addresses of the application and authority contracts to be deployed deterministically.

**Parameters**

Same as [`deployContracts()`](#deploycontracts).

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `application` | `address` | The application address |
| `authority` | `address` | The authority address |

### `getAuthorityFactory()`

```solidity
function getAuthorityFactory() external view returns (IAuthorityFactory)
```

Get the factory used to deploy `IAuthority` contracts.

### `getApplicationFactory()`

```solidity
function getApplicationFactory() external view returns (IApplicationFactory)
```

Get the factory used to deploy `IApplication` contracts.

### `version()`

```solidity
function version() external pure returns (uint64 major, uint64 minor, uint64 patch, string memory preRelease, string memory buildMetadata)
```

Get the version of the contracts project, for example `(3, 0, 0, "alpha.10", "")`.
