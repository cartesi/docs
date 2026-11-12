---
id: iconsensus
title: IConsensus
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/consensus/IConsensus.sol
    title: IConsensus Interface
---

The `IConsensus` interface defines functions for submitting and accepting claims about the state of multiple Cartesi Rollups applications with a single fixed epoch length.

It inherits from [`IOutputsMerkleRootValidator`](./ioutputs-merkle-root-validator.md), `IApplicationChecker`, `IVersionGetter` and `MachineValidationErrors`.

## Description

Each application has its own stream of inputs, which is split into epochs. The epoch of an input is the integer division of the number of the base layer block in which the input was added by the epoch length (see [`getEpochLength()`](#getepochlength)).

After every epoch, each validator can submit a claim about the post-epoch state of the application, summarized by a **machine Merkle root**. Along with it, the validator proves the **outputs Merkle root** (the root of the Merkle tree of all outputs ever emitted by the application up to that point), which is written at a known address in the machine memory. Some epochs might be empty (they contain no input), in which case the state of the application remains unchanged. Validators can save on base layer fees by not submitting claims for empty epochs.

If a claim meets the staging criteria of the consensus model, the claim is **staged**. The staging criteria are outside the scope of this interface. For example, a claim may be staged if it was:

- Submitted by an authority, or
- Submitted by the majority of a quorum, or
- Submitted and not proven wrong after some period of time, or
- Submitted and proven correct through an on-chain tournament

A staged claim has no effect yet. It can only be **accepted** after the claim staging period (see [`getClaimStagingPeriod()`](#getclaimstagingperiod)) has elapsed, through [`acceptClaim()`](#acceptclaim). This delay protects against malicious validators, private key leakage, smart contract bugs and other issues: if a malicious claim is staged, the application guardian has until the end of the staging period to foreclose the application, which prevents the claim from ever being accepted.

Once a claim is accepted, its outputs Merkle root becomes valid, and the outputs generated up to that epoch can be validated and executed on-chain.

## Structs

### `ClaimStatus`

```solidity
enum ClaimStatus {
    UNSTAGED,
    STAGED,
    ACCEPTED
}
```

The status of a claim.

| Value | Description |
|-------|-------------|
| `UNSTAGED` | The claim was neither staged nor accepted |
| `STAGED` | The claim was staged but not accepted |
| `ACCEPTED` | The claim was staged and accepted |

### `Claim`

```solidity
struct Claim {
    ClaimStatus status;
    uint256 stagingBlockNumber;
    bytes32 stagedOutputsMerkleRoot;
}
```

Information about a claim. The fields `stagingBlockNumber` and `stagedOutputsMerkleRoot` only have meaning if the claim was staged.

| Name | Type | Description |
|------|------|-------------|
| `status` | `ClaimStatus` | The status of the claim |
| `stagingBlockNumber` | `uint256` | The number of the block in which the claim was staged |
| `stagedOutputsMerkleRoot` | `bytes32` | The outputs Merkle root that was proven on staging |

### `MachineValidityProof`

```solidity
struct MachineValidityProof {
    LeafProof iflagsYProof;
    LeafProof htifTohostProof;
    LeafProof txBufferProof;
}

struct LeafProof {
    bytes32 dataBlock;
    bytes32[] siblings;
}
```

Proves that the post-epoch machine was manually yielded with an "rx accepted" reason, and proves its outputs Merkle root, stored at the start of the CMIO tx buffer. Each `LeafProof` holds a 32-byte data block and the bottom-up siblings of that leaf in the machine Merkle tree.

| Name | Type | Description |
|------|------|-------------|
| `iflagsYProof` | `LeafProof` | Proves the `iflags_Y` register |
| `htifTohostProof` | `LeafProof` | Proves the HTIF `tohost` register |
| `txBufferProof` | `LeafProof` | Proves the first data block of the CMIO tx buffer (the outputs Merkle root) |

Defined in [`MachineValidityProof.sol`](https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/common/MachineValidityProof.sol) and [`LeafProof.sol`](https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/common/LeafProof.sol).

## Functions

### `submitClaim()`

```solidity
function submitClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot,
    MachineValidityProof calldata proof
) external
```

Submit a claim to the consensus.

*MUST fire a `ClaimSubmitted` event. MAY fire a `ClaimStaged` event, if the staging criteria are met.*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `machineMerkleRoot` | `bytes32` | The post-epoch machine Merkle root |
| `proof` | `MachineValidityProof` | The machine validity proof, from which the outputs Merkle root is proven |

### `acceptClaim()`

```solidity
function acceptClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot
) external
```

Accept a staged claim whose staging period has elapsed.

*MUST fire a `ClaimAccepted` event.*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `machineMerkleRoot` | `bytes32` | The machine Merkle root of the staged claim |

### `getEpochLength()`

```solidity
function getEpochLength() external view returns (uint256)
```

Get the epoch length, in number of base layer blocks.

*The epoch number of a block is defined as the integer division of the block number by the epoch length.*

### `getClaimStagingPeriod()`

```solidity
function getClaimStagingPeriod() external view returns (uint256)
```

Get the number of base layer blocks after which a staged claim can be accepted.

### `getNumberOfAcceptedClaims()`

```solidity
function getNumberOfAcceptedClaims(address appContract) external view returns (uint256)
```

Get the number of claims accepted by the consensus regarding a specific application.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |

### `getNumberOfStagedClaims()`

```solidity
function getNumberOfStagedClaims(address appContract) external view returns (uint256)
```

Get the number of claims staged by the consensus regarding a specific application.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |

### `getNumberOfSubmittedClaims()`

```solidity
function getNumberOfSubmittedClaims(address appContract) external view returns (uint256)
```

Get the number of claims submitted to the consensus regarding a specific application.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |

### `getClaim()`

```solidity
function getClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot
) external view returns (Claim memory claim)
```

Get information about a claim.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `machineMerkleRoot` | `bytes32` | The machine Merkle root |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `claim` | `Claim` | Information about the claim |

### Inherited functions

- From [`IOutputsMerkleRootValidator`](./ioutputs-merkle-root-validator.md): `isOutputsMerkleRootValid()`, `getLastFinalizedMachineMerkleRoot()`, `wasInputFinalized()` and `supportsInterface()` (ERC-165).
- From `IVersionGetter`: `version()`, which returns the `(major, minor, patch, preRelease, buildMetadata)` version of the contracts project (for example `(3, 0, 0, "alpha.10", "")`).

## Events

### `ClaimSubmitted()`

```solidity
event ClaimSubmitted(
    address indexed submitter,
    address indexed appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 outputsMerkleRoot,
    bytes32 machineMerkleRoot
)
```

MUST trigger when a claim is submitted.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `submitter` | `address` | The submitter address |
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `outputsMerkleRoot` | `bytes32` | The outputs Merkle root |
| `machineMerkleRoot` | `bytes32` | The machine Merkle root |

### `ClaimStaged()`

```solidity
event ClaimStaged(
    address indexed appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 outputsMerkleRoot,
    bytes32 machineMerkleRoot
)
```

MUST trigger when a claim is staged.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `outputsMerkleRoot` | `bytes32` | The outputs Merkle root |
| `machineMerkleRoot` | `bytes32` | The machine Merkle root |

**Note:** For each application and `lastProcessedBlockNumber`, there can be at most one staged claim.

### `ClaimAccepted()`

```solidity
event ClaimAccepted(
    address indexed appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 outputsMerkleRoot,
    bytes32 machineMerkleRoot
)
```

MUST trigger when a claim is accepted.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `outputsMerkleRoot` | `bytes32` | The outputs Merkle root |
| `machineMerkleRoot` | `bytes32` | The machine Merkle root |

**Note:** For each application and `lastProcessedBlockNumber`, there can be at most one accepted claim.

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

### `ClaimNotStaged()`

```solidity
error ClaimNotStaged(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot,
    ClaimStatus claimStatus
)
```

The claim was not staged and therefore cannot be accepted. This includes claims that were already accepted.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `machineMerkleRoot` | `bytes32` | The machine Merkle root |
| `claimStatus` | `ClaimStatus` | The status of the claim |

### `ClaimStagingPeriodNotOverYet()`

```solidity
error ClaimStagingPeriodNotOverYet(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot,
    uint256 numberOfBlocksAfterStaging,
    uint256 claimStagingPeriod
)
```

The claim was staged but its staging period is not over yet.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `machineMerkleRoot` | `bytes32` | The machine Merkle root |
| `numberOfBlocksAfterStaging` | `uint256` | The number of blocks since the claim was staged |
| `claimStagingPeriod` | `uint256` | The claim staging period, in number of blocks |

### Machine validation errors

Inherited from [`MachineValidationErrors`](https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/common/MachineValidationErrors.sol). Raised by `submitClaim()` when the machine validity proof does not check out.

| Error | Condition |
|-------|-----------|
| `InvalidSiblingsArrayLength()` | A leaf proof siblings array has the wrong length. Most likely an issue in the claim submitter code |
| `InvalidMachineMerkleProof()` | The machine Merkle root computed from a leaf proof differs from the one provided. Most likely an issue in the claim submitter code |
| `InvalidPostEpochMachineIflagsYRegister()` | The post-epoch `iflags_Y` register is unset, so the machine is unsuitable for finalization |
| `InvalidPostEpochMachineHtifTohostRegister()` | The post-epoch HTIF `tohost` register does not signal a manual yield with an "rx accepted" reason |

The last two errors may indicate that the machine reached an unrecoverable state. In that case, the application should be foreclosed so that users can recover their funds through emergency withdrawals and refunds of non-finalized deposits.

### Application checker errors

Inherited from [`IApplicationChecker`](https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/dapp/IApplicationChecker.sol). [`AbstractConsensus`](./abstract-consensus.md) checks the application with its `isForeclosed()` function before recording a submitted claim, staging a claim or accepting a claim.

| Error | Condition |
|-------|-----------|
| `ApplicationNotDeployed(address appContract)` | The application address has no code |
| `ApplicationReverted(address appContract, bytes error)` | The call to the application's `isForeclosed()` reverted |
| `IllformedApplicationReturnData(address appContract, bytes data)` | The application returned ill-formed data |
| `ApplicationForeclosed(address appContract)` | The application was foreclosed |

## Related Contracts

- [`AbstractConsensus`](./abstract-consensus.md): Abstract implementation of this interface
- [`IOutputsMerkleRootValidator`](./ioutputs-merkle-root-validator.md): Interface for validating outputs Merkle roots
- [`Authority`](./authority/authority.md) and [`Quorum`](./quorum/quorum.md): Concrete consensus models
