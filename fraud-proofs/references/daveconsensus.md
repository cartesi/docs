# API Reference

## DaveConsensus Contract
---

DaveConsensus(also referred to as PRT-Rollups Consensus) is the consensus contract for applications that use Dave tournaments for verification.
This contract is responsible for validating exactly one application contract, and all inputs must originate from the configured InputBox.

DaveConsensus manages epochs, which are defined as half-open block-number intervals of the form [a, b).
Epochs are numbered sequentially starting from 0.

Off-chain nodes can track progress by subscribing to the _EpochSealed_ event. This event indicates which epochs have been sealed, which ones are fully settled, and which epoch is currently open for challenges.
Anyone may settle an epoch by calling _settle()_, and an epoch’s eligibility for settlement can be checked via _canSettle()_. Learn more about epochs [here](../../../fraud-proofs/fraud-proof-basics/epochs).

This contract links input ingestion, epoch progression, and Dave tournament-based verification under a single consensus interface.

### `canSettle()`

```solidity
function canSettle() external view returns (bool isFinished, uint256 epochNumber, Tree.Node winnerCommitment)
```

Check if the current epoch can be settled by querying the tournament's arbitration result. 

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `isFinished` | `bool` | Whether the current sealed epoch tournament has finished |
| `epochNumber` | `uint256` | Current sealed epoch number |
| `winnerCommitment` | `Tree.Node` | Winner's commitment in case the tournament has finished |

### `settle()`

```solidity
function settle(uint256 epochNumber, bytes32 outputsMerkleRoot, bytes32[] calldata proof) external
```

Settle the current sealed epoch. On success, it emits an [`EpochSealed`](#epochsealed) event.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `epochNumber` | `uint256` | The current sealed epoch number (used to avoid race conditions) |
| `outputsMerkleRoot` | `bytes32` | The post-epoch outputs Merkle root (used to validate outputs) |
| `proof` | `bytes32[]` | The bottom-up Merkle proof of the outputs Merkle root in the final machine state |

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
| `tournament` | `ITournament` | The tournament that will decide the post-epoch state |

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

| Index | Type | Description |
|------|------|-------------|
| [0] | `bool` | Whether the outputs Merkle root is valid |

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

| Index | Type | Description |
|------|------|-------------|
| [0] | `bytes32` | Merkle root of the input data |

### `ConsensusCreation`
```solidity
event ConsensusCreation(IInputBox inputBox, address appContract, ITournamentFactory tournamentFactory)
```

An event emitted when a new DaveConsensus contract is deployed.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `inputBox` | `IInputBox` | The input box contract |
| `appContract` | `address` | The application contract |
| `tournamentFactory` | `ITournamentFactory` | The tournament factory contract |

### `EpochSealed`
```solidity
event EpochSealed(uint256 epochNumber, uint256 inputIndexLowerBound, uint256 inputIndexUpperBound, Machine.Hash initialMachineStateHash, bytes32 outputsMerkleRoot, ITournament tournament)
```

An event emitted when a new epoch is sealed.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `epochNumber` | `uint256` | The epoch number |
| `inputIndexLowerBound` | `uint256` | The lower bound of the input index (inclusive) |
| `inputIndexUpperBound` | `uint256` | The upper bound of the input index (exclusive) |
| `initialMachineStateHash` | `Machine.Hash` | The initial machine state hash |
| `outputsMerkleRoot` | `bytes32` | The Merkle root hash of the outputs tree |
| `tournament` | `ITournament` | The sealed epoch tournament contract|

## DaveAppFactory Contract
---

Dave-Application Factory contract allows anyone to reliably deploy an application validated with its corresponding Consensus contract.

### `newDaveApp()`

```solidity
function newDaveApp(bytes32 templateHash, bytes32 salt) external returns (IApplication appContract, IDaveConsensus daveConsensus)
```

Deploy a new Dave-Application pair deterministically.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `templateHash` | `bytes32` | Template hash of the application |
| `salt` | `bytes32` | A 32-byte value used to add entropy to the addresses |

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `IApplication` | Deployed application contract |
| `daveConsensus` | `IDaveConsensus` | Deployed DaveConsensus contract |


### `calculateDaveAppAddress()`

```solidity
function calculateDaveAppAddress(bytes32 templateHash, bytes32 salt) external view returns (address appContractAddress, address daveConsensusAddress)
```

Calculate the deployment address for a Dave-App pair before deployment. 

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | Application contract address |
| `initialMachineStateHash` | `Machine.Hash` | Initial state hash of the Cartesi machine |
| `salt` | `bytes32` | Salt for CREATE2 address calculation |

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `appContractAddress` | `address` | Calculated deployment address for the application contract |
| `daveConsensusAddress` | `address` | Calculated deployment address for the DaveConsensus contract |

### `DaveAppCreated`
```solidity
event DaveAppCreated(IApplication appContract, IDaveConsensus daveConsensus)
```

An event emitted when a new Dave-App pair is deployed.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `appContract` | `IApplication` | The deployed application contract |
| `daveConsensus` | `IDaveConsensus` | The deployed DaveConsensus contract |