---
id: iconsensus
title: IConsensus
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v2.0.1/src/consensus/IConsensus.sol
    title: IConsensus Interface
---

The `IConsensus` interface defines the main consensus contract behavior for validating and accepting claims submitted by validators.

## Description

Each application has its own stream of inputs. When an input is fed to the application, it may yield several outputs. Since genesis, a Merkle tree of all outputs ever produced is maintained both inside and outside the Cartesi Machine.

The claim that validators may submit to the consensus contract is the root of this Merkle tree after processing all base layer blocks until some height.

A validator should be able to save transaction fees by not submitting a claim if it was:
- Already submitted by the validator (see the `ClaimSubmitted` event) or
- Already accepted by the consensus (see the `ClaimAccepted` event)

The acceptance criteria for claims may depend on the type of consensus, and is not specified by this interface. For example, a claim may be accepted if it was:
- Submitted by an authority or
- Submitted by the majority of a quorum or
- Submitted and not proven wrong after some period of time or
- Submitted and proven correct through an on-chain tournament

## Functions

### `submitClaim()`

```solidity
function submitClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 outputsMerkleRoot
) external
```

Submit a claim to the consensus.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `outputsMerkleRoot` | `bytes32` | The outputs Merkle root |

**Events:**
- `ClaimSubmitted`: Must be fired
- `ClaimAccepted`: MAY be fired, if the acceptance criteria is met

### `getEpochLength()`

```solidity
function getEpochLength() external view returns (uint256)
```

Get the epoch length, in number of base layer blocks.

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `uint256` | The epoch length |

**Note:** The epoch number of a block is defined as the integer division of the block number by the epoch length.

## Events

### `ClaimSubmitted()`

```solidity
event ClaimSubmitted(
    address indexed submitter,
    address indexed appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 outputsMerkleRoot
)
```

Must trigger when a claim is submitted.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `submitter` | `address` | The submitter address |
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `outputsMerkleRoot` | `bytes32` | The outputs Merkle root |

### `ClaimAccepted()`

```solidity
event ClaimAccepted(
    address indexed appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 outputsMerkleRoot
)
```

Must trigger when a claim is accepted.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `outputsMerkleRoot` | `bytes32` | The outputs Merkle root |

**Note:** For each application and lastProcessedBlockNumber, there can be at most one accepted claim.

## Errors

### `NotEpochFinalBlock()`

```solidity
error NotEpochFinalBlock(uint256 lastProcessedBlockNumber, uint256 epochLength)
```

The claim contains the number of a block that is not at the end of an epoch (its modulo epoch length is not epoch length - 1).

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `epochLength` | `uint256` | The epoch length |

### `NotPastBlock()`

```solidity
error NotPastBlock(uint256 lastProcessedBlockNumber, uint256 currentBlockNumber)
```

The claim contains the number of a block in the future (it is greater or equal to the current block number).

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `currentBlockNumber` | `uint256` | The number of the current block |

### `NotFirstClaim()`

```solidity
error NotFirstClaim(address appContract, uint256 lastProcessedBlockNumber)
```

A claim for that application and epoch was already submitted by the validator.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |

## Related Contracts

- [`AbstractConsensus`](./abstractconsensus.md): Abstract implementation of this interface
- [`IOutputsMerkleRootValidator`](./ioutputsmerklerootvalidator.md): Interface for validating outputs Merkle roots 