> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: authority
title: Authority
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/consensus/authority/Authority.sol
    title: Authority Contract
---

The **Authority** contract implements a single-owner consensus mechanism. Only the owner can submit a claim. A valid submission is staged immediately, and anyone can accept it after the claim-staging period through the inherited `acceptClaim()` function.

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

Submit a claim to the consensus. Only the contract owner can call this function. A valid claim is submitted and staged in the same transaction, then waits for the configured claim staging period before acceptance.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address |
| `lastProcessedBlockNumber` | `uint256` | The number of the last processed block |
| `machineMerkleRoot` | `bytes32` | The post-epoch machine Merkle root |
| `proof` | `MachineValidityProof` | Proof of a valid `rx accepted` yield and the outputs Merkle root |

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
