---
id: authority
title: Authority
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v2.0.1/src/consensus/authority/Authority.sol
    title: Authority Contract
---

The **Authority** contract implements a single-owner consensus mechanism where only the contract owner can submit and accept claims.

## Functions

### `submitClaim()`

```solidity
function submitClaim(
    address appContract,
    uint256 lastProcessedBlockNumber,
    bytes32 outputsMerkleRoot
) external onlyOwner
```

Submit a claim to the consensus. Only the contract owner can call this function.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `outputsMerkleRoot` | `bytes32` | The outputs Merkle root |

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

Leaves the contract without owner. It will not be possible to call onlyOwner functions.

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

Check if the contract supports a specific interface.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `interfaceId` | `bytes4` | The interface identifier |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `bool` | True if the interface is supported | 