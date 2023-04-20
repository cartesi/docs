---
id: sol-output
title: CartesiDApp Endpoints
---

### templateHash

```solidity
bytes32 templateHash
```

### voucherBitmask

```solidity
mapping(uint256 => uint256) voucherBitmask
```

### consensus

```solidity
contract IConsensus consensus
```

### constructor

```solidity
constructor(contract IConsensus _consensus, address _owner, bytes32 _templateHash) public
```

### executeVoucher

```solidity
function executeVoucher(address _destination, bytes _payload, struct Proof _proof) external returns (bool)
```

Execute a voucher

_Each voucher can only be executed once_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _destination | address | The contract that will execute the payload |
| _payload | bytes | The ABI-encoded function call |
| _proof | struct Proof | Data for validating outputs |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | Whether the voucher was executed successfully or not |

### wasVoucherExecuted

```solidity
function wasVoucherExecuted(uint256 _inboxInputIndex, uint256 _outputIndex) external view returns (bool)
```

Check whether a voucher has been executed

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _inboxInputIndex | uint256 | The index of the input in the input box |
| _outputIndex | uint256 | The index of output emitted by the input |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | Whether the voucher has been executed before |

### validateNotice

```solidity
function validateNotice(bytes _notice, struct Proof _proof) external view returns (bool)
```

Validate a notice

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _notice | bytes | The notice |
| _proof | struct Proof | Data for validating outputs |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | Whether the notice is valid or not |

### getClaim

```solidity
function getClaim(bytes _proofContext) internal view returns (bytes32, uint256, uint256)
```

### migrateToConsensus

```solidity
function migrateToConsensus(contract IConsensus _newConsensus) external
```

Migrate the DApp to a new consensus

_Should have access control_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _newConsensus | contract IConsensus | The new consensus |

### getTemplateHash

```solidity
function getTemplateHash() external view returns (bytes32)
```

Get the DApp's template hash

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32 | The DApp's template hash |

### getConsensus

```solidity
function getConsensus() external view returns (contract IConsensus)
```

Get the current consensus

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | contract IConsensus | The current consensus |

### receive

```solidity
receive() external payable
```

### withdrawEther

```solidity
function withdrawEther(address _receiver, uint256 _value) external
```

### onERC721Received

```solidity
function onERC721Received(address, address, uint256, bytes) external pure returns (bytes4)
```
