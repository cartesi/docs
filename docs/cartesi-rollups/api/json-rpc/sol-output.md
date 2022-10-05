---
id: sol-output
title: Output Endpoints
---

## OutputValidityProof

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

## executeVoucher

```solidity
function executeVoucher(address _destination, bytes _payload, struct OutputValidityProof _v) external returns (bool)
```

### Description

Executes voucher which can only be executed once.

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _destination | address | address that will execute the payload |
| _payload | bytes | payload to be executed by destination |
| _v | struct OutputValidityProof | validity proof for this encoded voucher |

### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | true if voucher was executed successfully |

## validateNotice

```solidity
function validateNotice(bytes _notice, struct OutputValidityProof _v) external view returns (bool)
```
### Description

Validate notice.

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _notice | bytes | notice to be verified |
| _v | struct OutputValidityProof | validity proof for this notice |

### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | true if notice is valid |

## getNumberOfFinalizedEpochs

```solidity
function getNumberOfFinalizedEpochs() external view returns (uint256)
```
### Description

Get number of finalized epochs.

## getVoucherMetadataLog2Size

```solidity
function getVoucherMetadataLog2Size() external pure returns (uint256)
```
### Description

Get log2 size of voucher metadata memory range.

## getEpochVoucherLog2Size

```solidity
function getEpochVoucherLog2Size() external pure returns (uint256)
```

### Description

Get log2 size of epoch voucher memory range.

## getNoticeMetadataLog2Size

```solidity
function getNoticeMetadataLog2Size() external pure returns (uint256)
```

### Description

Get log2 size of notice metadata memory range.

## getEpochNoticeLog2Size

```solidity
function getEpochNoticeLog2Size() external pure returns (uint256)
```

### Description

Get log2 size of epoch notice memory range.

## VoucherExecuted

```solidity
event VoucherExecuted(uint256 voucherPosition)
```
