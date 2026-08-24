> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: quorum
title: Quorum
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/consensus/quorum/Quorum.sol
    title: Quorum Contract
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

The **Quorum** contract implements a multi-validator consensus mechanism where claims are staged when a majority of validators vote in favor. Staged claims can be accepted after the claim staging period elapses (see [`IConsensus`](../iconsensus.md)).

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

Submit a claim to the consensus. Only validators can call this function.

See [`IConsensus.submitClaim`](../iconsensus.md#submitclaim) for parameters, events, and machine-validation requirements. Reverts with `CallerIsNotValidator` if the caller is not a validator.

### `acceptClaim()`

```solidity
function acceptClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot
) external
```

Accept a staged claim whose staging period has elapsed. See [`IConsensus.acceptClaim`](../iconsensus.md#acceptclaim).

### `numOfValidators()`

```solidity
function numOfValidators() external view override returns (uint256)
```

Get the number of validators.

### `validatorId()`

```solidity
function validatorId(address validator) external view override returns (uint256)
```

Get the ID of a validator (0 for non-validators, 1..N for validators).

### `validatorById()`

```solidity
function validatorById(uint256 id) external view override returns (address)
```

Get the address of a validator by its ID (`address(0)` for invalid IDs).

### `numOfValidatorsInFavorOfAnyClaimInEpoch()`

```solidity
function numOfValidatorsInFavorOfAnyClaimInEpoch(
    address appContract,
    uint256 lastProcessedBlockNumber
) external view override returns (uint256)
```

Get the number of validators in favor of any claim in a given epoch.

### `isValidatorInFavorOfAnyClaimInEpoch()`

```solidity
function isValidatorInFavorOfAnyClaimInEpoch(
    address appContract,
    uint256 lastProcessedBlockNumber,
    uint256 id
) external view override returns (bool)
```

Check whether a validator is in favor of any claim in a given epoch.

### `numOfValidatorsInFavorOf()`

```solidity
function numOfValidatorsInFavorOf(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot
) external view override returns (uint256)
```

Get the number of validators in favor of a claim identified by its machine Merkle root.

### `isValidatorInFavorOf()`

```solidity
function isValidatorInFavorOf(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot,
    uint256 id
) external view override returns (bool)
```

Check whether a validator is in favor of a claim identified by its machine Merkle root.

### `supportsInterface()`

```solidity
function supportsInterface(bytes4 interfaceId) public view override(IERC165, AbstractConsensus) returns (bool)
```

Check if the contract supports a specific interface. Quorum returns `true` for `IOutputsMerkleRootValidator` as well as `IConsensus`.

### `version()`

```solidity
function version() external view returns (string memory)
```

Return the rollups-contracts package version string.
