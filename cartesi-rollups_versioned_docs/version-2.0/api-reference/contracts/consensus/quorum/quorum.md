---
id: quorum
title: Quorum
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v2.0.1/src/consensus/quorum/Quorum.sol
    title: Quorum Contract
---

The **Quorum** contract implements a multi-validator consensus mechanism where claims are accepted when a majority of validators vote in favor.

## Functions

### `submitClaim()`

```solidity
function submitClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 outputsMerkleRoot
) external override
```

Submit a claim to the consensus. Only validators can call this function.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `outputsMerkleRoot` | `bytes32` | The outputs Merkle root |

### `numOfValidators()`

```solidity
function numOfValidators() external view override returns (uint256)
```

Get the number of validators.

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `uint256` | The total number of validators |

### `validatorId()`

```solidity
function validatorId(address validator) external view override returns (uint256)
```

Get the ID of a validator.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `validator` | `address` | The validator address |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `uint256` | The validator ID (0 for non-validators, >0 for validators) |

### `validatorById()`

```solidity
function validatorById(uint256 id) external view override returns (address)
```

Get the address of a validator by its ID.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `id` | `uint256` | The validator ID |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `address` | The validator address (address(0) for invalid IDs) |

### `numOfValidatorsInFavorOfAnyClaimInEpoch()`

```solidity
function numOfValidatorsInFavorOfAnyClaimInEpoch(
    address appContract,
    uint256 lastProcessedBlockNumber
) external view override returns (uint256)
```

Get the number of validators in favor of any claim in a given epoch.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `uint256` | Number of validators in favor of any claim in the epoch |

### `isValidatorInFavorOfAnyClaimInEpoch()`

```solidity
function isValidatorInFavorOfAnyClaimInEpoch(
    address appContract,
    uint256 lastProcessedBlockNumber,
    uint256 id
) external view override returns (bool)
```

Check whether a validator is in favor of any claim in a given epoch.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `id` | `uint256` | The ID of the validator |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `bool` | Whether validator is in favor of any claim in the epoch |

### `numOfValidatorsInFavorOf()`

```solidity
function numOfValidatorsInFavorOf(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 outputsMerkleRoot
) external view override returns (uint256)
```

Get the number of validators in favor of a claim.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `outputsMerkleRoot` | `bytes32` | The outputs Merkle root |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `uint256` | Number of validators in favor of claim |

### `isValidatorInFavorOf()`

```solidity
function isValidatorInFavorOf(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 outputsMerkleRoot,
    uint256 id
) external view override returns (bool)
```

Check whether a validator is in favor of a claim.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `outputsMerkleRoot` | `bytes32` | The outputs Merkle root |
| `id` | `uint256` | The ID of the validator |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `bool` | Whether validator is in favor of claim |

### `supportsInterface()`

```solidity
function supportsInterface(bytes4 interfaceId) public view override(IERC165, AbstractConsensus) returns (bool)
```

Check if the contract supports a specific interface.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `interfaceId` | `bytes4` | The interface identifier |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `bool` | True if the interface is supported | 