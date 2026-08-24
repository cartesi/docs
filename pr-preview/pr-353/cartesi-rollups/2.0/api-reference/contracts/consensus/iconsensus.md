> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: iconsensus
title: IConsensus
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/consensus/IConsensus.sol
    title: IConsensus Interface
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

The `IConsensus` interface defines the main consensus contract behavior for submitting, staging, and accepting claims about Cartesi Rollups applications.

## Description

Each application has its own stream of inputs, split into epochs. The epoch of an input is the integer division of the base-layer block number in which it was added by the epoch length (see `getEpochLength`).

After every epoch, each validator can submit a claim about the post-epoch machine state (a machine Merkle root), while proving the set of all outputs ever emitted (an outputs Merkle root stored at a known address in machine memory). Empty epochs can be skipped to save fees.

If a claim meets the staging criteria of the consensus model, it is **staged**. Acceptance is delayed by the claim staging period (see `getClaimStagingPeriod`) so guardians have time to foreclose the application if a malicious claim appears. After the staging period elapses, anyone can call `acceptClaim` to finalize the claim.

The staging criteria may depend on the consensus type (for example authority owner, quorum majority, challenge window, or tournament).

`IConsensus` inherits from `IOutputsMerkleRootValidator`, `IApplicationChecker`, `IVersionGetter`, and `MachineValidationErrors`.

## Types

### `ClaimStatus`

```solidity
enum ClaimStatus {
    UNSTAGED,
    STAGED,
    ACCEPTED
}
```

### `Claim`

```solidity
struct Claim {
    ClaimStatus status;
    uint256 stagingBlockNumber;
    bytes32 stagedOutputsMerkleRoot;
}
```

The `stagingBlockNumber` and `stagedOutputsMerkleRoot` fields are only meaningful when the claim was staged.

### `MachineValidityProof`

```solidity
struct MachineValidityProof {
    LeafProof iflagsYProof;     // proves the iflags_Y register
    LeafProof htifTohostProof;  // proves the HTIF tohost register
    LeafProof txBufferProof;    // proves the first data block of the CMIO tx buffer
}
```

Proves that the post-epoch machine is manually yielded with an `rx accepted` reason and that the outputs Merkle root is stored at the start of the tx buffer.

### `LeafProof`

```solidity
struct LeafProof {
    bytes32 dataBlock;      // 32-byte data block at a known offset
    bytes32[] siblings;     // bottom-up siblings of the leaf node
}
```

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

*Must fire a `ClaimSubmitted` event. May fire a `ClaimStaged` event if the staging criteria is met. The proof must show a valid post-epoch machine (yielded with `rx accepted`); otherwise machine-validation errors are raised.*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `machineMerkleRoot` | `bytes32` | The machine Merkle root |
| `proof` | `MachineValidityProof` | Proof of machine validity and outputs Merkle root |

### `acceptClaim()`

```solidity
function acceptClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot
) external
```

Accept a staged claim whose staging period has elapsed.

*Must fire a `ClaimAccepted` event.*

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `machineMerkleRoot` | `bytes32` | The machine Merkle root |

### `getEpochLength()`

```solidity
function getEpochLength() external view returns (uint256)
```

Get the epoch length, in number of base-layer blocks.

### `getClaimStagingPeriod()`

```solidity
function getClaimStagingPeriod() external view returns (uint256)
```

Get the number of base-layer blocks after which a staged claim can be accepted.

### `getNumberOfAcceptedClaims()` / `getNumberOfStagedClaims()` / `getNumberOfSubmittedClaims()`

```solidity
function getNumberOfAcceptedClaims(address appContract) external view returns (uint256)
function getNumberOfStagedClaims(address appContract) external view returns (uint256)
function getNumberOfSubmittedClaims(address appContract) external view returns (uint256)
```

Per-application counters for accepted, staged, and submitted claims.

### `getClaim()`

```solidity
function getClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot
) external view returns (Claim memory claim)
```

Get information about a claim.

### `version()`

```solidity
function version() external view returns (string memory)
```

Return the rollups-contracts package version string.

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

### `ClaimStaged()`

```solidity
event ClaimStaged(
    address indexed appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 outputsMerkleRoot,
    bytes32 machineMerkleRoot
)
```

*For each application and `lastProcessedBlockNumber`, there can be at most one staged claim.*

### `ClaimAccepted()`

```solidity
event ClaimAccepted(
    address indexed appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 outputsMerkleRoot,
    bytes32 machineMerkleRoot
)
```

*For each application and `lastProcessedBlockNumber`, there can be at most one accepted claim.*

## Errors

### `NotEpochFinalBlock()`

```solidity
error NotEpochFinalBlock(uint256 lastProcessedBlockNumber, uint256 epochLength)
```

The claim's last processed block is not at the end of an epoch.

### `NotPastBlock()`

```solidity
error NotPastBlock(uint256 lastProcessedBlockNumber, uint256 currentBlockNumber)
```

The claim contains a block number in the future.

### `NotFirstClaim()`

```solidity
error NotFirstClaim(address appContract, uint256 lastProcessedBlockNumber)
```

A claim for that application and epoch was already submitted by the validator.

### `ClaimNotStaged()`

```solidity
error ClaimNotStaged(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot,
    ClaimStatus claimStatus
)
```

Tried to accept an unstaged or already-accepted claim.

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

Tried to accept a claim during its staging period.

### Machine validation errors

From `MachineValidationErrors`:

| Error | Condition |
|-------|-----------|
| `InvalidSiblingsArrayLength` | A leaf-proof siblings array has the wrong length |
| `InvalidMachineMerkleProof` | A Merkle proof does not produce the stated machine Merkle root |
| `InvalidPostEpochMachineIflagsYRegister` | Post-epoch `iflags_Y` is unset |
| `InvalidPostEpochMachineHtifTohostRegister` | Post-epoch HTIF tohost does not signal `rx accepted` |

A machine that fails the post-epoch checks may have reached an unrecoverable state; foreclosure and emergency withdrawal / deposit refunds are the recovery path.

## Related Contracts

- [`AbstractConsensus`](./abstract-consensus.md): Abstract implementation of this interface
- [`IOutputsMerkleRootValidator`](./ioutputs-merkle-root-validator.md): Interface for validating outputs Merkle roots
