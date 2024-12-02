---
id: input-box
title: InputBox
resources:
    - url: https://github.com/cartesi/rollups-contracts/tree/prerelease/2.0.0/contracts/inputs/InputBox.sol
      title: InputBox contract
---

The **InputBox** is a trustless and permissionless contract that receives arbitrary blobs (called "inputs") from anyone and adds a compound hash to an append-only list (called "input box"). Each application has its input box.

The hash stored on-chain comprises the hash of the input blob, the block number and timestamp, the input sender address, and the input index.

Data availability is guaranteed by the emission of `InputAdded` events on every successful call to addInput. This ensures that inputs can be retrieved by anyone at any time without relying on centralized data providers.

From the perspective of this contract, inputs are encoding-agnostic byte arrays. It is up to the application to interpret, validate, and act upon inputs.


## `InputAdded()`

```solidity
event InputAdded(address indexed appContract, uint256 indexed index, bytes input)
```

Emitted when an input is added to a application input box.

#### Parameters

| Name        | Type     | Description                      |
|-------------|----------|----------------------------------|
| appContract | address  | The application contract address |
| index       | uint256  | The input index                 |
| input       | bytes    | The input blob                  |

## `addInput()`

```solidity
function addInput(address appContract, bytes calldata payload) external override returns (bytes32)
```

Add an input to a application input box.

_MUST fire an `InputAdded` event accordingly._

#### Parameters

| Name        | Type     | Description                      |
|-------------|----------|----------------------------------|
| appContract | address  | The application contract address |
| payload     | bytes    | The input payload                |

#### Return Values

| Name   | Type     | Description                  |
|--------|----------|------------------------------|
| [0] | bytes32  | The hash of the input blob   |

## `getNumberOfInputs()`

```solidity
function getNumberOfInputs(address appContract) external view returns (uint256)
```

Get the number of inputs in a application input box.

#### Parameters

| Name        | Type     | Description                      |
|-------------|----------|----------------------------------|
| appContract | address  | The application contract address |


#### Return Values

| Name | Type    | Description                              |
| ---- | ------- | ---------------------------------------- |
| [0] | uint256 | Number of inputs in the application input box |

## `getInputHash()`

```solidity
function getInputHash(address appContract, uint256 index) external view returns (bytes32)
```

Get the hash of an input in a application input box.

_`index` MUST be in the interval `[0,n)` where `n` is the number of
inputs in the application input box. See the `getNumberOfInputs` function._

#### Parameters

| Name        | Type     | Description                      |
|-------------|----------|----------------------------------|
| appContract | address  | The application contract address |
| index       | uint256  | The input index                  |

#### Return Values

| Name | Type    | Description                                                         |
| ---- | ------- | ------------------------------------------------------------------- |
| [0]  | bytes32 | The hash of the input at the provided index in the application input box |