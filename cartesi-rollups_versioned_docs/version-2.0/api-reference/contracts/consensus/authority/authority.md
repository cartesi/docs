---
id: authority
title: Authority
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/consensus/authority/Authority.sol
    title: Authority Contract
---

The **Authority** contract implements a single-owner consensus mechanism where only the contract owner can submit claims. A claim submitted by the owner is staged immediately. After the claim staging period, **anyone** can accept it through `acceptClaim()`, inherited from [`AbstractConsensus`](../abstract-consensus.md).

At most one claim can be submitted per application and epoch.

This contract inherits from [`IAuthority`](./iauthority.md), [`AbstractConsensus`](../abstract-consensus.md) and OpenZeppelin's `Ownable`.

## Functions

### `constructor()`

```solidity
constructor(address initialOwner, uint256 epochLength, uint256 claimStagingPeriod)
```

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `initialOwner` | `address` | The initial contract owner |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | The claim staging period, in number of blocks |

*Reverts with `ZeroEpochLength()` if the epoch length is zero, and with OpenZeppelin's `OwnableInvalidOwner` if the initial owner is the zero address.*

### `submitClaim()`

```solidity
function submitClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot,
    MachineValidityProof calldata proof
) external override onlyOwner
```

Submit a claim to the consensus. Only the contract owner can call this function.

The function validates the block number, checks that no claim was submitted for this application and epoch, validates the machine and proves its outputs Merkle root, then emits `ClaimSubmitted` and stages the claim (`ClaimStaged`).

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
| `OwnableUnauthorizedAccount` | The caller is not the owner |
| `NotEpochFinalBlock` | `lastProcessedBlockNumber` is not the last block of an epoch |
| `NotPastBlock` | `lastProcessedBlockNumber` is not in the past |
| `NotFirstClaim` | A claim was already submitted for this application and epoch |
| [Machine validation errors](../iconsensus.md#machine-validation-errors) | The machine validity proof is invalid |
| [Application checker errors](../iconsensus.md#application-checker-errors) | The application is not deployed, could not be checked or is foreclosed |

### `owner()`

```solidity
function owner() public view override(IOwnable, Ownable) returns (address)
```

Returns the address of the current owner.

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `address` | The current owner address |

### `renounceOwnership()`

```solidity
function renounceOwnership() public override(IOwnable, Ownable)
```

Leaves the contract without owner. It will not be possible to call onlyOwner functions, so no further claims can be submitted.

### `transferOwnership()`

```solidity
function transferOwnership(address newOwner) public override(IOwnable, Ownable)
```

Transfers ownership of the contract to a new account.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `newOwner` | `address` | The new owner address |

### `supportsInterface()`

```solidity
function supportsInterface(bytes4 interfaceId) public view override(IERC165, AbstractConsensus) returns (bool)
```

Check if the contract supports a specific interface. Returns true for `IAuthority`, `IConsensus`, `IOutputsMerkleRootValidator` and `IERC165`.

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
