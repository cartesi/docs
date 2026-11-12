---
id: abstract-consensus
title: AbstractConsensus
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/consensus/AbstractConsensus.sol
    title: AbstractConsensus Contract
---

The **AbstractConsensus** contract provides an abstract implementation of [`IConsensus`](./iconsensus.md) with common consensus functionality. [`Authority`](./authority/authority.md) and [`Quorum`](./quorum/quorum.md) inherit from it and only implement `submitClaim()`, which decides when a claim is staged.

`AbstractConsensus` keeps, per application, the valid outputs Merkle roots, the status of every claim, the last finalized machine Merkle root, the first block not covered by an accepted claim, and the number of submitted, staged and accepted claims. It also inherits `ERC165`, `ApplicationChecker` and `RollupsContract` (which implements `version()`).

## Constructor

### `constructor()`

```solidity
constructor(uint256 epochLength, uint256 claimStagingPeriod)
```

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `epochLength` | `uint256` | The epoch length, in number of base layer blocks |
| `claimStagingPeriod` | `uint256` | The claim staging period, in number of base layer blocks |

*Reverts with `ZeroEpochLength()` if the epoch length is zero.*

## Functions

### `acceptClaim()`

```solidity
function acceptClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot
) external override notForeclosed(appContract)
```

Accept a staged claim whose staging period has elapsed. This function is permissionless: anyone can call it.

On success, it marks the claim as accepted, makes its outputs Merkle root valid for the application, and emits `ClaimAccepted`. If the claim covers a later block than any previously accepted claim, its machine Merkle root becomes the last finalized machine Merkle root of the application.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `machineMerkleRoot` | `bytes32` | The machine Merkle root of the staged claim |

**Errors**

| Error | Condition |
|-------|-----------|
| `ApplicationNotDeployed`, `ApplicationReverted`, `IllformedApplicationReturnData` | The application could not be checked (see [`IConsensus`](./iconsensus.md#application-checker-errors)) |
| `ApplicationForeclosed` | The application was foreclosed |
| `NotEpochFinalBlock` | `lastProcessedBlockNumber` is not the last block of an epoch |
| `NotPastBlock` | `lastProcessedBlockNumber` is not in the past |
| `ClaimNotStaged` | The claim is unstaged or was already accepted |
| `ClaimStagingPeriodNotOverYet` | Fewer than `getClaimStagingPeriod()` blocks have passed since the claim was staged |

### `isOutputsMerkleRootValid()`

```solidity
function isOutputsMerkleRootValid(address appContract, bytes32 outputsMerkleRoot) public view override returns (bool)
```

Check whether an outputs Merkle root is valid, that is, whether it belongs to an accepted claim of the application.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `outputsMerkleRoot` | `bytes32` | The outputs Merkle root |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `bool` | True if the outputs Merkle root is valid |

### `getLastFinalizedMachineMerkleRoot()`

```solidity
function getLastFinalizedMachineMerkleRoot(address appContract) public view override returns (bytes32)
```

Get the machine Merkle root of the accepted claim with the highest last processed block number. Returns zero if no claim was accepted for the application.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |

### `wasInputFinalized()`

```solidity
function wasInputFinalized(address appContract, uint256 inputIndex, uint256 blockNumber) public view override returns (bool)
```

Check whether an input was finalized. Returns true if `blockNumber` is less than or equal to the highest last processed block number among the accepted claims of the application. The `inputIndex` argument is not used by this implementation.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `inputIndex` | `uint256` | The index of the input in the application's input box |
| `blockNumber` | `uint256` | The number of the base layer block in which the input was added |

### `getEpochLength()`

```solidity
function getEpochLength() public view override returns (uint256)
```

Get the epoch length.

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `uint256` | The epoch length |

### `getClaimStagingPeriod()`

```solidity
function getClaimStagingPeriod() public view override returns (uint256)
```

Get the claim staging period, in number of base layer blocks.

### `getNumberOfAcceptedClaims()`

```solidity
function getNumberOfAcceptedClaims(address appContract) external view override returns (uint256)
```

Get the number of claims accepted for an application.

### `getNumberOfStagedClaims()`

```solidity
function getNumberOfStagedClaims(address appContract) external view override returns (uint256)
```

Get the number of claims staged for an application.

### `getNumberOfSubmittedClaims()`

```solidity
function getNumberOfSubmittedClaims(address appContract) external view override returns (uint256)
```

Get the number of claims submitted for an application.

### `getClaim()`

```solidity
function getClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot
) public view override returns (Claim memory claim)
```

Get the status, staging block number and staged outputs Merkle root of a claim. See [`Claim`](./iconsensus.md#claim).

### `supportsInterface()`

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC165) returns (bool)
```

Check if the contract supports a specific interface. Returns true for `IConsensus`, `IOutputsMerkleRootValidator` and `IERC165`.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `interfaceId` | `bytes4` | The interface identifier |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `bool` | True if the interface is supported |

### `version()`

```solidity
function version() external pure returns (uint64 major, uint64 minor, uint64 patch, string memory preRelease, string memory buildMetadata)
```

Get the version of the contracts project, for example `(3, 0, 0, "alpha.10", "")`.

## Internal functions

These functions are used by concrete consensus contracts to implement `submitClaim()`.

| Function | Description |
|----------|-------------|
| `_validateLastProcessedBlockNumber(uint256 lastProcessedBlockNumber)` | Reverts with `NotEpochFinalBlock` or `NotPastBlock` if the block number is not the last block of an epoch in the past |
| `_validateMachine(bytes32 machineMerkleRoot, MachineValidityProof calldata proof)` | Validates the post-epoch machine and returns the proven outputs Merkle root. May raise any of the [machine validation errors](./iconsensus.md#machine-validation-errors) |
| `_submitClaim(address submitter, address appContract, uint256 lastProcessedBlockNumber, bytes32 outputsMerkleRoot, bytes32 machineMerkleRoot)` | Checks that the application is not foreclosed, emits `ClaimSubmitted` and increments the submitted claims count |
| `_stageClaim(address appContract, uint256 lastProcessedBlockNumber, bytes32 outputsMerkleRoot, bytes32 machineMerkleRoot)` | Checks that the application is not foreclosed and, if the claim is unstaged, records the staging block number and outputs Merkle root, emits `ClaimStaged` and increments the staged claims count |
