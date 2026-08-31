---
id: ioutputs-merkle-root-validator
title: IOutputsMerkleRootValidator
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/consensus/IOutputsMerkleRootValidator.sol
    title: IOutputsMerkleRootValidator interface
---

**`IOutputsMerkleRootValidator`** is the interface an [`Application`](../application.md) uses to validate outputs, locate its last finalized machine state, and determine whether an input was finalized.

It extends ERC-165. Clients can use `supportsInterface` to detect additional behavior, such as the claim-submission API in [`IConsensus`](./iconsensus.md).

## `isOutputsMerkleRootValid()`

```solidity
function isOutputsMerkleRootValid(
    address appContract,
    bytes32 outputsMerkleRoot
) external view returns (bool)
```

Returns whether `outputsMerkleRoot` was accepted for `appContract`.

## `getLastFinalizedMachineMerkleRoot()`

```solidity
function getLastFinalizedMachineMerkleRoot(address appContract)
    external
    view
    returns (bytes32)
```

Returns the most recently finalized machine state root for the Application. It returns zero when no state has been finalized.

During emergency recovery, the Application uses its template hash when this function returns zero. This makes the initial machine state the recovery source when no claim was ever accepted.

## `wasInputFinalized()`

```solidity
function wasInputFinalized(
    address appContract,
    uint256 inputIndex,
    uint256 blockNumber
) external view returns (bool)
```

Returns whether the specified input was covered by the finalized state. The standard `AbstractConsensus` implementation compares `blockNumber` with the Application's first unprocessed block number.

The caller must supply the real index and base-layer block for an existing input. [`Application.issueRefund`](../application.md#issuerefund) obtains those values from a validated encoded input before calling this function.
