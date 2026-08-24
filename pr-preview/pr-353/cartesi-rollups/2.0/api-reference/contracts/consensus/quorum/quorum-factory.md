> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: quorum-factory
title: QuorumFactory
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/consensus/quorum/QuorumFactory.sol
    title: QuorumFactory Contract
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/consensus/quorum/IQuorumFactory.sol
    title: IQuorumFactory Interface
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

The **QuorumFactory** contract allows anyone to reliably deploy new `IQuorum` contracts.

## Functions

### `newQuorum()`

```solidity
function newQuorum(
    address[] calldata validators,
    uint256 epochLength,
    uint256 claimStagingPeriod
) external override returns (IQuorum)
```

Deploy a new quorum contract.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `validators` | `address[]` | The list of validators (duplicates are ignored) |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | How many base-layer blocks must elapse before a staged claim can be accepted |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `IQuorum` | The deployed quorum contract |

### `newQuorum()` (with salt)

```solidity
function newQuorum(
    address[] calldata validators,
    uint256 epochLength,
    uint256 claimStagingPeriod,
    bytes32 salt
) external override returns (IQuorum)
```

Deploy a new quorum contract deterministically using CREATE2.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `validators` | `address[]` | The list of validators (duplicates are ignored) |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | How many base-layer blocks must elapse before a staged claim can be accepted |
| `salt` | `bytes32` | The salt used to deterministically generate the quorum address |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `IQuorum` | The deployed quorum contract |

### `calculateQuorumAddress()`

```solidity
function calculateQuorumAddress(
    address[] calldata validators,
    uint256 epochLength,
    uint256 claimStagingPeriod,
    bytes32 salt
) external view override returns (address)
```

Calculate the address of a quorum to be deployed deterministically.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `validators` | `address[]` | The list of validators |
| `epochLength` | `uint256` | The epoch length |
| `claimStagingPeriod` | `uint256` | How many base-layer blocks must elapse before a staged claim can be accepted |
| `salt` | `bytes32` | The salt used to deterministically generate the quorum address |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `address` | The deterministic quorum address |

### `version()`

```solidity
function version() external view returns (string memory)
```

Return the rollups-contracts package version string.

## Events

### `QuorumCreated()`

```solidity
event QuorumCreated(IQuorum quorum)
```

Emitted when a new quorum is deployed.
