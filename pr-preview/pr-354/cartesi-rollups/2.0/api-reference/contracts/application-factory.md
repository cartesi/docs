> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: application-factory
title: ApplicationFactory
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/dapp/ApplicationFactory.sol
    title: ApplicationFactory contract
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/dapp/IApplicationFactory.sol
    title: IApplicationFactory interface
---

The **ApplicationFactory** deploys [`Application`](./application.md) contracts directly or at deterministic `CREATE2` addresses.

Every Application created by one factory uses the same immutable [refund output builder](./refund/overview.md). The caller still chooses the validator, owner, template hash, input box, and withdrawal configuration for each deployment.

## `constructor()`

```solidity
constructor(IRefundOutputBuilder refundOutputBuilder)
```

| Parameter | Type | Description |
| --- | --- | --- |
| `refundOutputBuilder` | `IRefundOutputBuilder` | Builder assigned to every Application deployed by this factory |

## `newApplication()`

```solidity
function newApplication(
    IOutputsMerkleRootValidator outputsMerkleRootValidator,
    address appOwner,
    bytes32 templateHash,
    IInputBox inputBox,
    WithdrawalConfig calldata withdrawalConfig
) external returns (IApplication appContract)
```

Deploys an Application with the standard `CREATE` opcode.

| Parameter | Type | Description |
| --- | --- | --- |
| `outputsMerkleRootValidator` | `IOutputsMerkleRootValidator` | Initial output validator |
| `appOwner` | `address` | Nonzero initial Application owner |
| `templateHash` | `bytes32` | Initial machine state hash |
| `inputBox` | `IInputBox` | Input box used by the Application and its portals |
| `withdrawalConfig` | `WithdrawalConfig` | Guardian, accounts-drive geometry, and withdrawal builder; use a zero-valued config to disable recovery |

Returns the deployed Application and emits `ApplicationCreated`.

| Return value | Type | Description |
| --- | --- | --- |
| `appContract` | `IApplication` | Deployed Application contract |

## `newApplication()` with salt

```solidity
function newApplication(
    IOutputsMerkleRootValidator outputsMerkleRootValidator,
    address appOwner,
    bytes32 templateHash,
    IInputBox inputBox,
    WithdrawalConfig calldata withdrawalConfig,
    bytes32 salt
) external returns (IApplication appContract)
```

Deploys the same configuration with `CREATE2`. The address depends on every constructor value, the factory's immutable refund builder, and `salt`.

| Parameter | Type | Description |
| --- | --- | --- |
| `outputsMerkleRootValidator` | `IOutputsMerkleRootValidator` | Initial output validator |
| `appOwner` | `address` | Nonzero initial Application owner |
| `templateHash` | `bytes32` | Initial machine state hash |
| `inputBox` | `IInputBox` | Input box used by the Application and its portals |
| `withdrawalConfig` | `WithdrawalConfig` | Guardian, accounts-drive geometry, and withdrawal builder; use a zero-valued config to disable recovery |
| `salt` | `bytes32` | Value used to derive the deterministic deployment address |

| Return value | Type | Description |
| --- | --- | --- |
| `appContract` | `IApplication` | Deployed Application contract |

## `calculateApplicationAddress()`

```solidity
function calculateApplicationAddress(
    IOutputsMerkleRootValidator outputsMerkleRootValidator,
    address appOwner,
    bytes32 templateHash,
    IInputBox inputBox,
    WithdrawalConfig calldata withdrawalConfig,
    bytes32 salt
) external view returns (address appContract)
```

Returns the address at which the salted `newApplication` overload would deploy the Application. It does not deploy a contract.

| Parameter | Type | Description |
| --- | --- | --- |
| `outputsMerkleRootValidator` | `IOutputsMerkleRootValidator` | Initial output validator |
| `appOwner` | `address` | Nonzero initial Application owner |
| `templateHash` | `bytes32` | Initial machine state hash |
| `inputBox` | `IInputBox` | Input box used by the Application and its portals |
| `withdrawalConfig` | `WithdrawalConfig` | Guardian, accounts-drive geometry, and withdrawal builder; use a zero-valued config to disable recovery |
| `salt` | `bytes32` | Value used to derive the deterministic deployment address |

| Return value | Type | Description |
| --- | --- | --- |
| `appContract` | `address` | Address calculated for the Application |

Use exactly the same factory and arguments for calculation and deployment. Changing the input box, validator, withdrawal configuration, or any other constructor value changes the resulting address.

## `ApplicationCreated`

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

Emitted after either deployment method succeeds.

| Parameter | Type | Description |
| --- | --- | --- |
| `outputsMerkleRootValidator` | `IOutputsMerkleRootValidator` | Initial output validator assigned to the Application |
| `appOwner` | `address` | Initial Application owner |
| `templateHash` | `bytes32` | Initial machine state hash |
| `inputBox` | `IInputBox` | Input box assigned to the Application |
| `withdrawalConfig` | `WithdrawalConfig` | Withdrawal configuration assigned to the Application |
| `appContract` | `IApplication` | Deployed Application contract |

## Errors

### `InvalidWithdrawalConfig`

```solidity
error InvalidWithdrawalConfig(WithdrawalConfig withdrawalConfig)
```

Raised when the accounts-drive layout in `withdrawalConfig` does not fit within the Cartesi Machine memory. See [`WithdrawalConfig` validation](./withdrawal/withdrawal-config.md#validation).

| Parameter | Type | Description |
| --- | --- | --- |
| `withdrawalConfig` | `WithdrawalConfig` | Invalid withdrawal configuration supplied for deployment |
