---
id: input-box
title: InputBox
resources:
    - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/inputs/InputBox.sol
      title: InputBox contract
    - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/inputs/IInputBox.sol
      title: IInputBox interface
---

The **InputBox** is a trustless and permissionless contract that receives inputs for applications from any sender. For each application, it keeps an append-only list (the "input box") of input hashes.

When an input is added, the contract wraps the sender's payload in an `EvmAdvance` envelope, which also records the chain ID, the application address, the sender, the block number, the block timestamp, `prevrandao` and the input index:

```solidity
bytes memory input = abi.encodeCall(
    Inputs.EvmAdvance,
    (block.chainid, appContract, msg.sender, block.number, block.timestamp, block.prevrandao, index, payload)
);
```

The hash stored on-chain is `keccak256(input)`, and the whole encoded `input` is emitted in the `InputAdded` event.

Data availability is guaranteed through the emission of `InputAdded` events on every successful call to `addInput`. This ensures that inputs can be retrieved by anyone at any time without relying on centralized data providers.

From this contract's perspective, payloads are encoding-agnostic byte arrays. It is the application's responsibility to interpret, validate, and act upon them.

This contract inherits from `IInputBox`, `RollupsContract` and `ApplicationChecker`.

## Choosing and checking the input box

Each application chooses its input box when it is deployed. The address is an immutable constructor argument of the [`Application`](./application.md) contract, returned by its [`getInputBox()`](./application.md#getinputbox) function. Portals deliver deposit inputs to the input box that the application reports.

Because the input box is a permissionless contract that anyone can deploy, an application can report an input box other than the canonical one. Such an input box may add inputs that do not correspond to real transactions on the canonical contracts, including deposit inputs for assets that were never transferred.

Before depositing assets into an application or relying on its outputs, users and integrators should check that the application's `getInputBox()` returns the canonical `InputBox` address of the rollups-contracts release in use. The canonical addresses are published with each release, for example in `cartesi-rollups-contracts-3.0.0-alpha.10-deployment-addresses.tar.gz` on the [v3.0.0-alpha.10 release page](https://github.com/cartesi/rollups-contracts/releases/tag/v3.0.0-alpha.10).

## State Variables

### `DEPLOYMENT_BLOCK_NUMBER`
Deployment block number

```solidity
uint256 immutable DEPLOYMENT_BLOCK_NUMBER = block.number;
```

### `_inputBoxes`
Mapping of application contract addresses to arrays of input hashes.

```solidity
mapping(address => bytes32[]) private _inputBoxes;
```

## Functions

### `addInput()`

```solidity
function addInput(address appContract, bytes calldata payload) external override notForeclosed(appContract) returns (bytes32)
```

Send an input to an application.

*Must fire an InputAdded event.*

Before adding the input, the contract checks that `appContract` is a deployed application that is not foreclosed, by calling its `isForeclosed()` function. Inputs cannot be sent to an address with no code, such as a precomputed application address before the application is deployed.

The encoded `EvmAdvance` input, not only the payload, must fit in `CanonicalMachine.INPUT_MAX_SIZE` (65,536 bytes). Because of the envelope, the largest accepted payload is 65,216 bytes.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `payload` | `bytes` | The input payload |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `bytes32` | The hash of the encoded input (`keccak256` of the `EvmAdvance` envelope) |

**Errors**

| Error | Condition |
|-------|-----------|
| `ApplicationNotDeployed(address appContract)` | The application address has no code |
| `ApplicationReverted(address appContract, bytes error)` | The call to the application's `isForeclosed()` reverted |
| `IllformedApplicationReturnData(address appContract, bytes data)` | The application's `isForeclosed()` returned ill-formed data |
| `ApplicationForeclosed(address appContract)` | The application was foreclosed |
| `InputTooLarge(address appContract, uint256 inputLength, uint256 maxInputLength)` | The encoded input is larger than `maxInputLength` (65,536 bytes) |

### `getNumberOfInputs()`

```solidity
function getNumberOfInputs(address appContract) external view override returns (uint256)
```

Get the number of inputs sent to an application.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `uint256` | Number of inputs in the application input box |

### `getInputHash()`

```solidity
function getInputHash(address appContract, uint256 index) external view override returns (bytes32)
```

Get the hash of an input in an application's input box.

*The provided index must be valid.*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `index` | `uint256` | The input index |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `bytes32` | The hash of the input at the provided index in the application input box |

### `getDeploymentBlockNumber()`

```solidity
function getDeploymentBlockNumber() external view override returns (uint256)
```

Get number of block in which contract was deployed.

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `uint256` | The deployment block number |

### `version()`

```solidity
function version() external pure returns (uint64 major, uint64 minor, uint64 patch, string memory preRelease, string memory buildMetadata)
```

Get the version of the contracts project, for example `(3, 0, 0, "alpha.10", "")`.

## Events

### `InputAdded()`

```solidity
event InputAdded(address indexed appContract, uint256 indexed index, bytes input)
```

Emitted when an input is added to an application's input box.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `index` | `uint256` | The input index |
| `input` | `bytes` | The ABI-encoded `EvmAdvance` call (selector included). Decode it to get the sender, block data and the original `payload` |

## Errors

### `InputTooLarge()`

```solidity
error InputTooLarge(address appContract, uint256 inputLength, uint256 maxInputLength)
```

Input is too large.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `inputLength` | `uint256` | The input length |
| `maxInputLength` | `uint256` | The maximum input length |

### Application checker errors

`IInputBox` inherits `ApplicationNotDeployed`, `ApplicationReverted`, `IllformedApplicationReturnData`, `InputBoxNotDeployed` and `ApplicationForeclosed` from [`IApplicationChecker`](https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/dapp/IApplicationChecker.sol). `addInput()` can raise all of them except `InputBoxNotDeployed`, which is raised by the portals.
