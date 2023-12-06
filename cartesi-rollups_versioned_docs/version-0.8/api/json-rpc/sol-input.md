---
id: sol-input
title: Input Endpoints
---

### addInput

```solidity
function addInput(bytes _input) external returns (bytes32)
```

Adds an input to the accumulating epoch's inbox

_There is a maximum size for the input data that is defined by the dApp_

#### Parameters

| Name    | Type  | Description          |
| ------- | ----- | -------------------- |
| \_input | bytes | bytes array of input |

#### Return Values

| Name | Type    | Description       |
| ---- | ------- | ----------------- |
| [0]  | bytes32 | hash of the input |

### getInput

```solidity
function getInput(uint256 _index) external view returns (bytes32)
```

Returns the hash of the input at the provided input index, for the current sealed epoch

#### Parameters

| Name    | Type    | Description                    |
| ------- | ------- | ------------------------------ |
| \_index | uint256 | position of the input on inbox |

#### Return Values

| Name | Type    | Description       |
| ---- | ------- | ----------------- |
| [0]  | bytes32 | hash of the input |

### getNumberOfInputs

```solidity
function getNumberOfInputs() external view returns (uint256)
```

Returns the number of inputs on the current sealed epoch's inbox

#### Return Values

| Name | Type    | Description                          |
| ---- | ------- | ------------------------------------ |
| [0]  | uint256 | number of inputs of non active inbox |

### getCurrentInbox

```solidity
function getCurrentInbox() external view returns (uint256)
```

Returns the internal index of the current accumulating inbox

#### Return Values

| Name | Type    | Description                         |
| ---- | ------- | ----------------------------------- |
| [0]  | uint256 | index of current accumulating inbox |

### InputAdded

```solidity
event InputAdded(uint256 epochNumber, uint256 inputIndex, address sender, uint256 timestamp, bytes input)
```

Indicates that an input was added to the accumulating epoch's inbox

#### Parameters

| Name        | Type    | Description                       |
| ----------- | ------- | --------------------------------- |
| epochNumber | uint256 | which epoch this input belongs to |
| inputIndex  | uint256 | index of the input just added     |
| sender      | address | msg.sender address                |
| timestamp   | uint256 | block timestamp                   |
| input       | bytes   | input data                        |
