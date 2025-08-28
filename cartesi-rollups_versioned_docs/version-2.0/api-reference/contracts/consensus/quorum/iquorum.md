---
id: iquorum
title: IQuorum
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v2.0.1/src/consensus/quorum/IQuorum.sol
    title: IQuorum Interface
---

The **IQuorum** interface defines a consensus model controlled by a small, immutable set of validators.

## Description

A consensus model controlled by a small, immutable set of `n` validators. You can know the value of `n` by calling the `numOfValidators` function. Upon construction, each validator is assigned a unique number between 1 and `n`. These numbers are used internally instead of addresses for gas optimization reasons. You can list the validators in the quorum by calling the `validatorById` function for each ID from 1 to `n`.

## Functions

### `numOfValidators`
```solidity
function numOfValidators() external view returns (uint256)
```

Get the number of validators.

**Returns:**
- (uint256): The total number of validators

### `validatorId`
```solidity
function validatorId(address validator) external view returns (uint256)
```

Get the ID of a validator.

**Parameters:**
- `validator` (address): The validator address

**Returns:**
- (uint256): The validator ID

**Note:** Validators have IDs greater than zero. Non-validators are assigned to ID zero.

### `validatorById`
```solidity
function validatorById(uint256 id) external view returns (address)
```

Get the address of a validator by its ID.

**Parameters:**
- `id` (uint256): The validator ID

**Returns:**
- (address): The validator address

**Note:** Validator IDs range from 1 to `N`, the total number of validators. Invalid IDs map to address zero.

### `numOfValidatorsInFavorOfAnyClaimInEpoch`
```solidity
function numOfValidatorsInFavorOfAnyClaimInEpoch(
    address appContract,
    uint256 lastProcessedBlockNumber
) external view returns (uint256)
```

Get the number of validators in favor of any claim in a given epoch.

**Parameters:**
- `appContract` (address): The application contract address
- `lastProcessedBlockNumber` (uint256): The number of the last processed block

**Returns:**
- (uint256): Number of validators in favor of any claim in the epoch

### `isValidatorInFavorOfAnyClaimInEpoch`
```solidity
function isValidatorInFavorOfAnyClaimInEpoch(
    address appContract,
    uint256 lastProcessedBlockNumber,
    uint256 id
) external view returns (bool)
```

Check whether a validator is in favor of any claim in a given epoch.

**Parameters:**
- `appContract` (address): The application contract address
- `lastProcessedBlockNumber` (uint256): The number of the last processed block
- `id` (uint256): The ID of the validator

**Returns:**
- (bool): Whether validator is in favor of any claim in the epoch

**Note:** Assumes the provided ID is valid.

### `numOfValidatorsInFavorOf`
```solidity
function numOfValidatorsInFavorOf(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 outputsMerkleRoot
) external view returns (uint256)
```

Get the number of validators in favor of a claim.

**Parameters:**
- `appContract` (address): The application contract address
- `lastProcessedBlockNumber` (uint256): The number of the last processed block
- `outputsMerkleRoot` (bytes32): The outputs Merkle root

**Returns:**
- (uint256): Number of validators in favor of claim

### `isValidatorInFavorOf`
```solidity
function isValidatorInFavorOf(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 outputsMerkleRoot,
    uint256 id
) external view returns (bool)
```

Check whether a validator is in favor of a claim.

**Parameters:**
- `appContract` (address): The application contract address
- `lastProcessedBlockNumber` (uint256): The number of the last processed block
- `outputsMerkleRoot` (bytes32): The outputs Merkle root
- `id` (uint256): The ID of the validator

**Returns:**
- (bool): Whether validator is in favor of claim

**Note:** Assumes the provided ID is valid.

## Related Contracts

- [`Quorum`](./quorum.md): Implementation of this interface
- [`IConsensus`](../iconsensus.md): Base consensus interface 