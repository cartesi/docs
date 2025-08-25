# API Reference

## DaveConsensus Contract
---

### `canSettle()`

```solidity
function canSettle() external view returns (bool isFinished, uint256 epochNumber, Tree.Node winnerCommitment)
```

Check if the current epoch can be settled by querying the tournament's arbitration result. 

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `isFinished` | `bool` | Whether tournament is finished |
| `epochNumber` | `uint256` | Current epoch number |
| `winnerCommitment` | `Tree.Node` | Winner's commitment from tournament |

### `settle()`

```solidity
function settle(uint256 epochNumber, bytes32 outputsMerkleRoot, bytes32[] calldata proof) external
```

Settle an epoch using tournament results and create a new tournament for the next epoch. 

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `epochNumber` | `uint256` | The epoch number to settle |
| `outputsMerkleRoot` | `bytes32` | Root hash of the outputs Merkle tree |
| `proof` | `bytes32[]` | Merkle proof array for validation |

### `getCurrentSealedEpoch()`

```solidity
function getCurrentSealedEpoch() external view returns (uint256 epochNumber, uint256 inputIndexLowerBound, uint256 inputIndexUpperBound, ITournament tournament)
```

Get information about the current sealed epoch including bounds and tournament. 

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `epochNumber` | `uint256` | Current epoch number |
| `inputIndexLowerBound` | `uint256` | Lower bound of input indices (inclusive) |
| `inputIndexUpperBound` | `uint256` | Upper bound of input indices (exclusive) |
| `tournament` | `ITournament` | Current tournament contract |

### `isOutputsMerkleRootValid()`

```solidity
function isOutputsMerkleRootValid(address appContract, bytes32 outputsMerkleRoot) public view override returns (bool)
```

Validate whether a given outputs Merkle root is valid for the specified application. 

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | Application contract address to validate against |
| `outputsMerkleRoot` | `bytes32` | Outputs Merkle root hash to validate |

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `valid` | `bool` | Whether the outputs Merkle root is valid |

### `provideMerkleRootOfInput()`

```solidity
function provideMerkleRootOfInput(uint256 inputIndexWithinEpoch, bytes calldata input) external view override returns (bytes32)
```

Get the Merkle root for input data at a specific index within the current epoch. 

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `inputIndexWithinEpoch` | `uint256` | Index of input within the current epoch |
| `input` | `bytes` | Input data bytes to process |

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `merkleRoot` | `bytes32` | Merkle root of the input data |

## DaveConsensusFactory Contract
---

### `newDaveConsensus()`

```solidity
function newDaveConsensus(address appContract, Machine.Hash initialMachineStateHash) external returns (DaveConsensus)
```

Deploy a new DaveConsensus contract instance for an application. 

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | Application contract address |
| `initialMachineStateHash` | `Machine.Hash` | Initial state hash of the Cartesi machine |

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `daveConsensus` | `DaveConsensus` | Deployed DaveConsensus contract instance |

### `newDaveConsensus()` (with salt)

```solidity
function newDaveConsensus(address appContract, Machine.Hash initialMachineStateHash, bytes32 salt) external returns (DaveConsensus)
```

Deploy a new DaveConsensus contract with deterministic address using CREATE2. 

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | Application contract address |
| `initialMachineStateHash` | `Machine.Hash` | Initial state hash of the Cartesi machine |
| `salt` | `bytes32` | Salt for CREATE2 deterministic deployment |

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `daveConsensus` | `DaveConsensus` | Deployed DaveConsensus contract instance |

### `calculateDaveConsensusAddress()`

```solidity
function calculateDaveConsensusAddress(address appContract, Machine.Hash initialMachineStateHash, bytes32 salt) external view returns (address)
```

Calculate the deployment address for a DaveConsensus contract before deployment. 

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | Application contract address |
| `initialMachineStateHash` | `Machine.Hash` | Initial state hash of the Cartesi machine |
| `salt` | `bytes32` | Salt for CREATE2 address calculation |

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `address` | `address` | Calculated deployment address |
