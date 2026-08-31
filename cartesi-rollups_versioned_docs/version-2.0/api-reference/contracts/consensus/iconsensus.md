---
id: iconsensus
title: IConsensus
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/consensus/IConsensus.sol
    title: IConsensus interface
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/common/MachineValidityProof.sol
    title: MachineValidityProof structure
---

**`IConsensus`** defines how validators submit, stage, and accept claims about an Application's post-epoch state.

Each Application has its own input stream, divided into epochs by base-layer block number. After processing an epoch, a validator can submit the resulting machine Merkle root together with a proof that the machine stopped at a valid manual yield. The proof also reveals the cumulative outputs Merkle root stored in the machine's transmit buffer.

## Claim lifecycle

1. A validator submits a claim for an epoch.
2. The consensus model stages the claim when its own criteria are satisfied. Authority stages the owner's claim immediately. Quorum stages a claim after a majority supports it.
3. The claim remains staged for `getClaimStagingPeriod()` base-layer blocks.
4. Anyone can call `acceptClaim` after the staging period.
5. The accepted outputs Merkle root becomes valid for on-chain output execution.

If the Application is foreclosed before acceptance, the consensus cannot submit or accept further claims.

## Machine validity proof

```solidity
struct LeafProof {
    bytes32 dataBlock;
    bytes32[] siblings;
}

struct MachineValidityProof {
    LeafProof iflagsYProof;
    LeafProof htifTohostProof;
    LeafProof txBufferProof;
}
```

The three leaf proofs establish that:

- the machine's `iflags_Y` register is set;
- the HTIF `tohost` register signals a manual yield with the `rx accepted` reason; and
- the first data block of the CMIO transmit buffer contains the outputs Merkle root.

All three proofs must reconstruct the submitted `machineMerkleRoot`.

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

Submits a claim. The concrete consensus contract decides who may call the function and when the claim becomes staged.

| Parameter | Type | Description |
| --- | --- | --- |
| `appContract` | `address` | Application whose state was computed |
| `lastProcessedBlockNumber` | `uint256` | Final base-layer block covered by the claim |
| `machineMerkleRoot` | `bytes32` | Post-epoch machine state root |
| `proof` | `MachineValidityProof` | Proof of a valid accepted yield and the outputs root |

Every successful call emits `ClaimSubmitted`. It may also emit `ClaimStaged` when the staging criteria are met.

### `acceptClaim()`

```solidity
function acceptClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot
) external
```

Accepts a staged claim after its staging period. A successful call emits `ClaimAccepted` and makes the claim's outputs root valid.

| Parameter | Type | Description |
| --- | --- | --- |
| `appContract` | `address` | Application whose claim will be accepted |
| `lastProcessedBlockNumber` | `uint256` | Final base-layer block covered by the claim |
| `machineMerkleRoot` | `bytes32` | Post-epoch machine state root submitted with the claim |

### Configuration and counters

```solidity
function getEpochLength() external view returns (uint256)
function getClaimStagingPeriod() external view returns (uint256)
function getNumberOfAcceptedClaims(address appContract) external view returns (uint256)
function getNumberOfStagedClaims(address appContract) external view returns (uint256)
function getNumberOfSubmittedClaims(address appContract) external view returns (uint256)
```

The epoch number of a block is its integer division by `getEpochLength()`.

| Function | Parameter | Type | Return type | Description |
| --- | --- | --- | --- | --- |
| `getEpochLength()` | None | None | `uint256` | Number of base-layer blocks in an epoch |
| `getClaimStagingPeriod()` | None | None | `uint256` | Number of blocks a staged claim must wait before acceptance |
| `getNumberOfAcceptedClaims()` | `appContract` | `address` | `uint256` | Number of claims accepted for the Application |
| `getNumberOfStagedClaims()` | `appContract` | `address` | `uint256` | Number of claims staged for the Application |
| `getNumberOfSubmittedClaims()` | `appContract` | `address` | `uint256` | Number of claims submitted for the Application |

### `getClaim()`

```solidity
function getClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot
) external view returns (Claim memory claim)
```

Returns the status, staging block, and staged outputs Merkle root for one claim.

| Parameter | Type | Description |
| --- | --- | --- |
| `appContract` | `address` | Application associated with the claim |
| `lastProcessedBlockNumber` | `uint256` | Final base-layer block covered by the claim |
| `machineMerkleRoot` | `bytes32` | Post-epoch machine state root submitted with the claim |

| Return value | Type | Description |
| --- | --- | --- |
| `claim` | `Claim` | Stored claim status and staging data |

```solidity
enum ClaimStatus { UNSTAGED, STAGED, ACCEPTED }

struct Claim {
    ClaimStatus status;
    uint256 stagingBlockNumber;
    bytes32 stagedOutputsMerkleRoot;
}
```

The staging fields are meaningful only for staged or accepted claims.

## Events

```solidity
event ClaimSubmitted(
    address indexed submitter,
    address indexed appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 outputsMerkleRoot,
    bytes32 machineMerkleRoot
)

event ClaimStaged(
    address indexed appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 outputsMerkleRoot,
    bytes32 machineMerkleRoot
)

event ClaimAccepted(
    address indexed appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 outputsMerkleRoot,
    bytes32 machineMerkleRoot
)
```

At most one claim can be staged for an Application and `lastProcessedBlockNumber` pair.

| Event | Parameter | Type | Description |
| --- | --- | --- | --- |
| `ClaimSubmitted` | `submitter` | `address` | Validator that submitted the claim |
| `ClaimSubmitted` | `appContract` | `address` | Application associated with the claim |
| `ClaimSubmitted` | `lastProcessedBlockNumber` | `uint256` | Final base-layer block covered by the claim |
| `ClaimSubmitted` | `outputsMerkleRoot` | `bytes32` | Cumulative outputs root extracted from the machine proof |
| `ClaimSubmitted` | `machineMerkleRoot` | `bytes32` | Post-epoch machine state root |
| `ClaimStaged` | `appContract` | `address` | Application associated with the staged claim |
| `ClaimStaged` | `lastProcessedBlockNumber` | `uint256` | Final base-layer block covered by the claim |
| `ClaimStaged` | `outputsMerkleRoot` | `bytes32` | Cumulative outputs root staged for acceptance |
| `ClaimStaged` | `machineMerkleRoot` | `bytes32` | Post-epoch machine state root |
| `ClaimAccepted` | `appContract` | `address` | Application associated with the accepted claim |
| `ClaimAccepted` | `lastProcessedBlockNumber` | `uint256` | Final base-layer block covered by the claim |
| `ClaimAccepted` | `outputsMerkleRoot` | `bytes32` | Cumulative outputs root accepted for validation |
| `ClaimAccepted` | `machineMerkleRoot` | `bytes32` | Post-epoch machine state root |

## Errors

| Error | Meaning |
| --- | --- |
| `NotEpochFinalBlock` | The claim does not end at an epoch boundary |
| `NotPastBlock` | The claimed block is not strictly in the past |
| `NotFirstClaim` | The validator already submitted a claim for that Application epoch |
| `ClaimNotStaged` | Acceptance was requested for a claim that is not staged |
| `ClaimStagingPeriodNotOverYet` | The required number of blocks has not elapsed |
| `InvalidSiblingsArrayLength` | A machine leaf proof has the wrong number of siblings |
| `InvalidMachineMerkleProof` | A leaf proof does not reconstruct the submitted machine root |
| `InvalidPostEpochMachineIflagsYRegister` | The machine did not finish in a finalizable yielded state |
| `InvalidPostEpochMachineHtifTohostRegister` | The machine did not yield with the `rx accepted` reason |

Application-check errors can also be raised when the target Application is missing, malformed, reverting, or foreclosed.
