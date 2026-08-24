> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: authority
title: Authority
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/consensus/authority/Authority.sol
    title: Authority Contract
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

The **Authority** contract implements a single-owner consensus mechanism where only the contract owner can submit claims. Staged claims can be accepted after the claim staging period elapses (see [`IConsensus`](../iconsensus.md)).

## Functions

### `submitClaim()`

```solidity
function submitClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot,
    MachineValidityProof calldata proof
) external onlyOwner
```

Submit a claim to the consensus. Only the contract owner can call this function.

See [`IConsensus.submitClaim`](../iconsensus.md#submitclaim) for parameters, events, and machine-validation requirements.

### `acceptClaim()`

```solidity
function acceptClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 machineMerkleRoot
) external
```

Accept a staged claim whose staging period has elapsed. See [`IConsensus.acceptClaim`](../iconsensus.md#acceptclaim).

### `owner()`

```solidity
function owner() public view override(IOwnable, Ownable) returns (address)
```

Returns the address of the current owner.

### `renounceOwnership()`

```solidity
function renounceOwnership() public override(IOwnable, Ownable)
```

Leaves the contract without owner. It will not be possible to call onlyOwner functions.

### `transferOwnership()`

```solidity
function transferOwnership(address newOwner) public override(IOwnable, Ownable)
```

Transfers ownership of the contract to a new account.

### `supportsInterface()`

```solidity
function supportsInterface(bytes4 interfaceId) public view override(IERC165, AbstractConsensus) returns (bool)
```

Check if the contract supports a specific interface. Authority returns `true` for `IOutputsMerkleRootValidator` as well as `IConsensus`.

### `version()`

```solidity
function version() external view returns (string memory)
```

Return the rollups-contracts package version string.
