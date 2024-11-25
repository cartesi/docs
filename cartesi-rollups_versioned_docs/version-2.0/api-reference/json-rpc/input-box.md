---
id: input-box
title: InputBox
resources:
    - url: https://github.com/cartesi/rollups-contracts/blob/v1.4.0/onchain/rollups/contracts/inputs/InputBox.sol
      title: InputBox contract
---

The **InputBox** is a trustless and permissionless contract that receives arbitrary blobs (called "inputs") from anyone and adds a compound hash to an append-only list (called "input box"). Each dApp has its input box.

The hash stored on-chain comprises the hash of the input blob, the block number and timestamp, the input sender address, and the input index.

Data availability is guaranteed by the emission of `InputAdded` events on every successful call to addInput. This ensures that inputs can be retrieved by anyone at any time without relying on centralized data providers.

From the perspective of this contract, inputs are encoding-agnostic byte arrays. It is up to the dApp to interpret, validate, and act upon inputs.


## `InputAdded()`

```solidity
event InputAdded(address dapp, uint256 inboxInputIndex, address sender, bytes input)
```

Emitted when an input is added to a dApp's input box.

#### Parameters

| Name            | Type    | Description                             |
| --------------- | ------- | --------------------------------------- |
| dapp            | address | The address of the dApp                 |
| inboxInputIndex | uint256 | The index of the input in the input box |
| sender          | address | The address that sent the input         |
| input           | bytes   | The contents of the input               |

## `addInput()`

```solidity
function addInput(address _dapp, bytes _input) external returns (bytes32)
```

Add an input to a dApp's input box.

_MUST fire an `InputAdded` event accordingly._

#### Parameters

| Name    | Type    | Description               |
| ------- | ------- | ------------------------- |
| \_dapp  | address | The address of the dApp   |
| \_input | bytes   | The contents of the input |

#### Return Values

| Name | Type    | Description                                    |
| ---- | ------- | ---------------------------------------------- |
| [0]  | bytes32 | The hash of the input plus some extra metadata |

## `getNumberOfInputs()`

```solidity
function getNumberOfInputs(address _dapp) external view returns (uint256)
```

Get the number of inputs in a dApp's input box.

#### Parameters

| Name   | Type    | Description             |
| ------ | ------- | ----------------------- |
| \_dapp | address | The address of the dApp |

#### Return Values

| Name | Type    | Description                              |
| ---- | ------- | ---------------------------------------- |
| [0]  | uint256 | Number of inputs in the dApp's input box |

## `getInputHash()`

```solidity
function getInputHash(address _dapp, uint256 _index) external view returns (bytes32)
```

Get the hash of an input in a dApp's input box.

_`_index` MUST be in the interval `[0,n)` where `n` is the number of
inputs in the dApp's input box. See the `getNumberOfInputs` function._

#### Parameters

| Name    | Type    | Description                                    |
| ------- | ------- | ---------------------------------------------- |
| \_dapp  | address | The address of the dApp                        |
| \_index | uint256 | The index of the input in the dApp's input box |

#### Return Values

| Name | Type    | Description                                                         |
| ---- | ------- | ------------------------------------------------------------------- |
| [0]  | bytes32 | The hash of the input at the provided index in the dApp's input box |
