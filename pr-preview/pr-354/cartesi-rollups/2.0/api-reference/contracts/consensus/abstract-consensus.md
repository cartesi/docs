> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: abstract-consensus
title: AbstractConsensus
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/consensus/AbstractConsensus.sol
    title: AbstractConsensus contract
---

**`AbstractConsensus`** implements the claim lifecycle shared by Authority and Quorum consensus. Concrete contracts provide the rule that stages a submitted claim.

## Validation and finalization

```solidity
function isOutputsMerkleRootValid(
    address appContract,
    bytes32 outputsMerkleRoot
) public view returns (bool)

function getLastFinalizedMachineMerkleRoot(address appContract)
    public view returns (bytes32)

function wasInputFinalized(
    address appContract,
    uint256 inputIndex,
    uint256 blockNumber
) public view returns (bool)
```

An outputs root becomes valid only when its staged claim is accepted. The last finalized machine root is updated at the same time.

`wasInputFinalized` returns whether the input's block is earlier than the first unprocessed block recorded for the Application. The standard implementation does not otherwise use `inputIndex`.

## Claim information

```solidity
function getEpochLength() public view returns (uint256)
function getClaimStagingPeriod() public view returns (uint256)
function getNumberOfAcceptedClaims(address appContract) external view returns (uint256)
function getNumberOfStagedClaims(address appContract) external view returns (uint256)
function getNumberOfSubmittedClaims(address appContract) external view returns (uint256)
function getClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot
) public view returns (IConsensus.Claim memory)
```

## `acceptClaim()`

```solidity
function acceptClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot
) external
```

Accepts a staged claim after the configured staging period. The function is permissionless, but it rejects a missing claim, an incomplete staging period, an invalid block boundary, or a foreclosed Application.

## Machine validation

The internal `_validateMachine` routine checks a [`MachineValidityProof`](./iconsensus.md#machine-validity-proof) and returns the outputs Merkle root stored in the proved transmit-buffer block. Authority and Quorum call it before registering a claim.

## ERC-165 support

```solidity
function supportsInterface(bytes4 interfaceId) public view returns (bool)
```

The base implementation reports support for both `IConsensus` and `IOutputsMerkleRootValidator`. Concrete consensus contracts also report their specialized interface.
