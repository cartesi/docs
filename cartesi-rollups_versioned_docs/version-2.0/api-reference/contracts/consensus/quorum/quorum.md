---
id: quorum
title: Quorum
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/consensus/quorum/Quorum.sol
    title: Quorum Contract
---

The **Quorum** contract implements a multi-validator consensus mechanism controlled by a small, immutable set of validators. Each validator can vote for one claim per application and epoch by submitting it. A claim is **staged** when a majority of the validators (`1 + N/2`, where `N` is the number of validators) submit the same machine Merkle root for that epoch. After the claim staging period, **anyone** can accept it through `acceptClaim()`, inherited from [`AbstractConsensus`](../abstract-consensus.md).

This contract inherits from [`IQuorum`](./iquorum.md) and [`AbstractConsensus`](../abstract-consensus.md).

## Functions

### `constructor()`

```solidity
constructor(
    address[] memory validators,
    uint256 epochLength,
    uint256 claimStagingPeriod
)
```

Each distinct validator receives an ID from 1 to `N`, in the order of the array. Duplicates in the `validators` array are ignored.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `validators` | `address[]` | The array of validator addresses |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | The claim staging period, in number of blocks |

**Errors**

| Error | Condition |
|-------|-----------|
| `ZeroEpochLength` | The epoch length is zero |
| `ZeroAddressValidator` | The `validators` array contains the zero address |
| `EmptyQuorum` | The quorum would have no validators |

### `submitClaim()`

```solidity
function submitClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot,
    MachineValidityProof calldata proof
) external override
```

Submit a claim to the consensus, which counts as the caller's vote for that claim. Only validators can call this function.

The function emits `ClaimSubmitted` and registers the vote. When the vote count for the claim reaches `1 + N/2`, the claim is staged (`ClaimStaged`).

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `machineMerkleRoot` | `bytes32` | The post-epoch machine Merkle root |
| `proof` | `MachineValidityProof` | The machine validity proof (see [`IConsensus`](../iconsensus.md#machinevalidityproof)) |

**Errors**

| Error | Condition |
|-------|-----------|
| `CallerIsNotValidator` | The caller is not a validator |
| `NotEpochFinalBlock` | `lastProcessedBlockNumber` is not the last block of an epoch |
| `NotPastBlock` | `lastProcessedBlockNumber` is not in the past |
| `NotFirstClaim` | The caller already voted for a claim in this epoch |
| [Machine validation errors](../iconsensus.md#machine-validation-errors) | The machine validity proof is invalid |
| [Application checker errors](../iconsensus.md#application-checker-errors) | The application is not deployed, could not be checked or is foreclosed |

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

Check if the contract supports a specific interface. Returns true for `IQuorum`, `IConsensus`, `IOutputsMerkleRootValidator` and `IERC165`.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `interfaceId` | `bytes4` | The interface identifier |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `bool` | True if the interface is supported |

### Inherited functions

From [`AbstractConsensus`](../abstract-consensus.md): `acceptClaim()`, `getClaim()`, `getEpochLength()`, `getClaimStagingPeriod()`, `getNumberOfSubmittedClaims()`, `getNumberOfStagedClaims()`, `getNumberOfAcceptedClaims()`, `isOutputsMerkleRootValid()`, `getLastFinalizedMachineMerkleRoot()`, `wasInputFinalized()` and `version()`.
