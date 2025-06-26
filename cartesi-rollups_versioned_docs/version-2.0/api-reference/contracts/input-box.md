---
id: input-box
title: InputBox
resources:
    - url: https://github.com/cartesi/rollups-contracts/tree/v2.0.1/src/inputs/InputBox.sol
      title: InputBox contract
---

The **InputBox** is a trustless and permissionless contract that receives arbitrary data blobs (called "inputs") from any sender and adds a compound hash to an append-only list (the "input box").

The hash stored on-chain comprises the hash of the input blob, block number, timestamp, input sender address, and input index.

Data availability is guaranteed through the emission of `InputAdded` events on every successful call to `addInput`. This ensures that inputs can be retrieved by anyone at any time without relying on centralized data providers.

From this contract's perspective, inputs are encoding-agnostic byte arrays. It is the application's responsibility to interpret, validate, and act upon these inputs.

This contract inherits from `IInputBox`.

## State Variables

### `_deploymentBlockNumber`
Deployment block number

```solidity
uint256 immutable _deploymentBlockNumber = block.number;
```

### `_inputBoxes`
Mapping of application contract addresses to arrays of input hashes.

```solidity
mapping(address => bytes32[]) private _inputBoxes;
```

## Functions

### `addInput()`

```solidity
function addInput(address appContract, bytes calldata payload) external override returns (bytes32)
```

Send an input to an application.

*MUST fire an InputAdded event.*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `payload` | `bytes` | The input payload |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `bytes32` | The hash of the input blob |

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
| `input` | `bytes` | The input blob |