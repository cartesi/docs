> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: quorum
title: Quorum
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/consensus/quorum/Quorum.sol
    title: Quorum Contract
---

The **Quorum** contract implements a multi-validator consensus mechanism. A claim is staged when a strict majority of validators vote for it. Anyone can accept the staged claim after its claim-staging period through the inherited `acceptClaim()` function.

## Functions

### `submitClaim()`

```solidity
function submitClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot,
    MachineValidityProof calldata proof
) external override
```

Submit a claim and cast the caller's vote for it. Only validators can call this function, and each validator can vote for only one claim in an Application epoch. The claim is staged when it reaches a strict majority.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `machineMerkleRoot` | `bytes32` | The post-epoch machine Merkle root |
| `proof` | `MachineValidityProof` | Proof of a valid `rx accepted` yield and the outputs Merkle root stored in the machine |

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
    bytes32 machineMerkleRoot
) external view override returns (uint256)
```

Get the number of validators in favor of a claim.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `machineMerkleRoot` | `bytes32` | The machine Merkle root |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `uint256` | Number of validators in favor of claim |

### `isValidatorInFavorOf()`

```solidity
function isValidatorInFavorOf(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot,
    uint256 id
) external view override returns (bool)
```

Check whether a validator is in favor of a claim.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `machineMerkleRoot` | `bytes32` | The machine Merkle root |
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
