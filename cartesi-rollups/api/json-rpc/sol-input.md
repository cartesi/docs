---
id: sol-input
title: InputBox Endpoints
---

### InputAdded

```solidity
event InputAdded(address dapp, uint256 inboxInputIndex, address sender, bytes input)
```

Emitted when an input is added to a DApp's input box

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| dapp | address | The address of the DApp |
| inboxInputIndex | uint256 | The index of the input in the input box |
| sender | address | The address that sent the input |
| input | bytes | The contents of the input |

### addInput

```solidity
function addInput(address _dapp, bytes _input) external returns (bytes32)
```

Add an input to a DApp's input box

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _dapp | address | The address of the DApp |
| _input | bytes | The contents of the input |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32 | The hash of the input plus some extra metadata |

### getNumberOfInputs

```solidity
function getNumberOfInputs(address _dapp) external view returns (uint256)
```

Get the number of inputs in a DApp's input box

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _dapp | address | The address of the DApp |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Number of inputs in the DApp's input box |

### getInputHash

```solidity
function getInputHash(address _dapp, uint256 _index) external view returns (bytes32)
```

Get the hash of an input in a DApp's input box

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _dapp | address | The address of the DApp |
| _index | uint256 | The index of the input in the DApp's input box |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32 | The hash of the input at the provided index in the DApp's input box |
