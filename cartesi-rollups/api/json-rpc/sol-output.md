---
id: sol-output
title: CartesiDApp
---

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
| _proof | struct [Proof](#proof) | Data for validating outputs |

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
| _proof | struct [Proof](#proof) | Data for validating outputs |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | Whether the notice is valid or not |


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

### NewConsensus

```solidity
event NewConsensus(IConsensus newConsensus);
```

A new consensus is used, this event is emitted when a new consensus is set

### VoucherExecuted

```solidity
event VoucherExecuted(uint256 voucherId);
```

A voucher was executed from the DApp, this event is emitted when a voucher is executed

### Proof

Data for validating outputs

```solidity
struct Proof {
    OutputValidityProof validity;
    bytes context;
}
```

#### Members

| Name                        | Type      | Description                                                       |
| --------------------------- | --------- | ----------------------------------------------------------------- |
| validity                  | [OutputValidityProof](#outputvalidityproof)   | validity A validity proof for the output                                |
| context                 | bytes   | context Data for querying the right claim from consensus                     |

### OutputValidityProof

Data used to prove the validity of an output (notices and vouchers)

```solidity
struct OutputValidityProof {
  uint256 epochInputIndex;
  uint256 outputIndex;
  bytes32 outputHashesRootHash;
  bytes32 vouchersEpochRootHash;
  bytes32 noticesEpochRootHash;
  bytes32 machineStateHash;
  bytes32[] keccakInHashesSiblings;
  bytes32[] outputHashesInEpochSiblings;
}
```

#### Members

| Name                        | Type      | Description                                                       |
| --------------------------- | --------- | ----------------------------------------------------------------- |
| epochIndex                  | uint256   | which input, inside the epoch, the output belongs to                                |
| outputIndex                 | uint256   | index of output emitted by the input                      |
| outputHashesRootHash        | bytes32   | Merkle root of hashes of outputs emitted by the input    |
| vouchersEpochRootHash       | bytes32   | merkle root of all epoch's voucher metadata hashes   |
| noticesEpochRootHash        | bytes32   | merkle root of all epoch's notice metadata hashes    |
| machineStateHash            | bytes32   | hash of the machine state claimed this epoch           |
| keccakInHashesSiblings      | bytes32[] | proof that this output metadata is in metadata memory range       |
| outputHashesInEpochSiblings | bytes32[] | proof that this output metadata is in epoch's output memory range |
