---
id: sol-input
title: Input Endpoints
---

## addInput

```solidity
function addInput(bytes _input) external returns (bytes32)
```

### Description

Adds input to correct inbox.

_msg.sender and timestamp are preppended log2 size
has to be calculated offchain taking that into account_

### Parameters

| Name    | Type  | Description          |
| ------- | ----- | -------------------- |
| \_input | bytes | bytes array of input |

### Return Values

| Name | Type    | Description               |
| ---- | ------- | ------------------------- |
| [0]  | bytes32 | merkle root hash of input |

## getInput

```solidity
function getInput(uint256 _index) external view returns (bytes32)
```

### Description

Returns input from correct input inbox.

### Parameters

| Name    | Type    | Description                    |
| ------- | ------- | ------------------------------ |
| \_index | uint256 | position of the input on inbox |

### Return Values

| Name | Type    | Description        |
| ---- | ------- | ------------------ |
| [0]  | bytes32 | root hash of input |

## getNumberOfInputs

```solidity
function getNumberOfInputs() external view returns (uint256)
```

### Description

Returns number of inputs on correct inbox.

### Return Values

| Name | Type    | Description                          |
| ---- | ------- | ------------------------------------ |
| [0]  | uint256 | number of inputs of non active inbox |

## getCurrentInbox

```solidity
function getCurrentInbox() external view returns (uint256)
```

### Description

Returns active current inbox index.

### Return Values

| Name | Type    | Description                   |
| ---- | ------- | ----------------------------- |
| [0]  | uint256 | index of current active inbox |

## InputAdded

```solidity
event InputAdded(uint256 epochNumber, uint256 inputIndex, address sender, uint256 timestamp, bytes input)
```

### Description

Input added.

### Parameters

| Name        | Type    | Description                       |
| ----------- | ------- | --------------------------------- |
| epochNumber | uint256 | which epoch this input belongs to |
| inputIndex  | uint256 | index of the input just added     |
| sender      | address | msg.sender                        |
| timestamp   | uint256 | block.timestamp                   |
| input       | bytes   | input data                        |
