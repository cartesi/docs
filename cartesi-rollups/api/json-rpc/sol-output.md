---
id: sol-output
title: Output Endpoints
---

### executeVoucher

```solidity
function executeVoucher(address _destination, bytes _payload, struct OutputValidityProof _v) external returns (bool)
```

Executes a voucher

_vouchers can only be successfully executed one time, and only if the provided proof is valid_

#### Parameters

| Name          | Type                       | Description                                                                                                  |
| ------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| \_destination | address                    | address of the target contract that will execute the payload                                                 |
| \_payload     | bytes                      | payload to be executed by the destination contract, containing a method signature and ABI-encoded parameters |
| \_v           | struct OutputValidityProof | validity proof for the voucher                                                                               |

#### Return Values

| Name | Type | Description                               |
| ---- | ---- | ----------------------------------------- |
| [0]  | bool | true if voucher was executed successfully |

### validateNotice

```solidity
function validateNotice(bytes _notice, struct OutputValidityProof _v) external view returns (bool)
```

Validates a notice

#### Parameters

| Name     | Type                       | Description                   |
| -------- | -------------------------- | ----------------------------- |
| \_notice | bytes                      | notice to be validated        |
| \_v      | struct OutputValidityProof | validity proof for the notice |

#### Return Values

| Name | Type | Description             |
| ---- | ---- | ----------------------- |
| [0]  | bool | true if notice is valid |

### getNumberOfFinalizedEpochs

```solidity
function getNumberOfFinalizedEpochs() external view returns (uint256)
```

Get number of finalized epochs

### getVoucherMetadataLog2Size

```solidity
function getVoucherMetadataLog2Size() external pure returns (uint256)
```

Get log2 size of voucher metadata memory range

### getEpochVoucherLog2Size

```solidity
function getEpochVoucherLog2Size() external pure returns (uint256)
```

Get log2 size of epoch voucher memory range

### getNoticeMetadataLog2Size

```solidity
function getNoticeMetadataLog2Size() external pure returns (uint256)
```

Get log2 size of notice metadata memory range

### getEpochNoticeLog2Size

```solidity
function getEpochNoticeLog2Size() external pure returns (uint256)
```

Get log2 size of epoch notice memory range

### VoucherExecuted

```solidity
event VoucherExecuted(uint256 voucherPosition)
```

Indicates that a voucher was executed

#### Parameters

| Name            | Type    | Description                                                           |
| --------------- | ------- | --------------------------------------------------------------------- |
| voucherPosition | uint256 | voucher unique identifier considering epoch, input and output indices |

### OutputValidityProof

Data used to prove the validity of an output (notices and vouchers)

```solidity
struct OutputValidityProof {
  uint256 epochIndex;
  uint256 inputIndex;
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
| epochIndex                  | uint256   | which epoch the output belongs to                                 |
| inputIndex                  | uint256   | which input, inside the epoch, the output belongs to              |
| outputIndex                 | uint256   | index of output inside the input                                  |
| outputHashesRootHash        | bytes32   | merkle root of all output metadata hashes of the related input    |
| vouchersEpochRootHash       | bytes32   | merkle root of all voucher metadata hashes of the related epoch   |
| noticesEpochRootHash        | bytes32   | merkle root of all notice metadata hashes of the related epoch    |
| machineStateHash            | bytes32   | hash of the machine state claimed for the related epoch           |
| keccakInHashesSiblings      | bytes32[] | proof that this output metadata is in metadata memory range       |
| outputHashesInEpochSiblings | bytes32[] | proof that this output metadata is in epoch's output memory range |
