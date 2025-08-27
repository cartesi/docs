# PRT Core Contracts

## Tournament Base Contract
---
### `joinTournament()`

```solidity
function joinTournament(Tree.Node finalState, bytes32[] calldata proof, Tree.Node leftChild, Tree.Node rightChild) external tournamentOpen tournamentNotFinished
```

Join a tournament by submitting a final state commitment with Merkle proof. Creates a match if another participant is waiting.

**Event Emitted:** `commitmentJoined(Tree.Node root)` when commitment is successfully added 

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `finalState` | `Tree.Node` | Final state hash commitment |
| `proof` | `bytes32[]` | Merkle proof for the final state |
| `leftChild` | `Tree.Node` | Left child of the commitment node |
| `rightChild` | `Tree.Node` | Right child of the commitment node |

### `advanceMatch()`

```solidity
function advanceMatch(Match.Id calldata matchId, Tree.Node leftNode, Tree.Node rightNode, Tree.Node newLeftNode, Tree.Node newRightNode) external tournamentNotFinished
```

Advance a match by providing new intermediate nodes in the binary search process. 

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `matchId` | `Match.Id` | Identifier of the match to advance |
| `leftNode` | `Tree.Node` | Current left node in the match |
| `rightNode` | `Tree.Node` | Current right node in the match |
| `newLeftNode` | `Tree.Node` | New left node for next iteration |
| `newRightNode` | `Tree.Node` | New right node for next iteration |

### `winMatchByTimeout()`

```solidity
function winMatchByTimeout(Match.Id calldata matchId) external tournamentNotFinished
```

Win a match when the opponent has run out of time allowance. 

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `matchId` | `Match.Id` | Identifier of the match to win by timeout |

### `eliminateMatchByTimeout()`

```solidity
function eliminateMatchByTimeout(Match.Id calldata matchId) external tournamentNotFinished
```

Eliminate a match when both participants have run out of time. 

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `matchId` | `Match.Id` | Identifier of the match to eliminate |

### `isFinished()`

```solidity
function isFinished() public view returns (bool)
```

Check if the tournament has finished (has a winner or is eliminated). 

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `finished` | `bool` | Whether the tournament is finished |

### `isClosed()`

```solidity
function isClosed() public view returns (bool)
```

Check if the tournament is closed to new participants. 

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `closed` | `bool` | Whether the tournament is closed |

## NonLeafTournament Contract Functions
---

### `sealInnerMatchAndCreateInnerTournament()`

```solidity
function sealInnerMatchAndCreateInnerTournament(Match.Id calldata matchId, Tree.Node leftLeaf, Tree.Node rightLeaf, Machine.Hash agreeHash, bytes32[] calldata agreeHashProof) external tournamentNotFinished
```

Seal an inner match and create a new inner tournament to resolve the dispute at a finer granularity.

**Event Emitted:** `newInnerTournament(Match.IdHash indexed, NonRootTournament)` when inner tournament is created 

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `matchId` | `Match.Id` | Identifier of the match to seal |
| `leftLeaf` | `Tree.Node` | Left leaf node of the disagreement |
| `rightLeaf` | `Tree.Node` | Right leaf node of the disagreement |
| `agreeHash` | `Machine.Hash` | Agreed upon machine state hash |
| `agreeHashProof` | `bytes32[]` | Merkle proof for the agreed hash |

### `winInnerTournament()`

```solidity
function winInnerTournament(NonRootTournament innerTournament) external tournamentNotFinished
```

Process the result of a finished inner tournament and advance the parent match. 

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `innerTournament` | `NonRootTournament` | Address of the finished inner tournament |

### `eliminateInnerTournament()`

```solidity
function eliminateInnerTournament(NonRootTournament innerTournament) external tournamentNotFinished
```

Eliminate an inner tournament that has no winner and advance the parent match. 

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `innerTournament` | `NonRootTournament` | Address of the inner tournament to eliminate |

## NonRootTournament Contract Functions
---

### `innerTournamentWinner()`

```solidity
function innerTournamentWinner() external view returns (bool, Tree.Node, Tree.Node, Clock.State memory)
```

Get the winner information from a finished inner tournament for parent tournament processing. 

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `isFinished` | `bool` | Whether the tournament is finished |
| `contestedCommitment` | `Tree.Node` | The contested parent commitment |
| `winnerCommitment` | `Tree.Node` | The winning inner commitment |
| `clock` | `Clock.State` | Paused clock state of the winner |

### `canBeEliminated()`

```solidity
function canBeEliminated() public view returns (bool)
```

Check if the tournament can be safely eliminated by its parent. 

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `eliminatable` | `bool` | Whether the tournament can be eliminated |

## RootTournament Contract Functions
---

### `arbitrationResult()`

```solidity
function arbitrationResult() external view returns (bool isFinished, Tree.Node winnerCommitment, Machine.Hash finalMachineStateHash)
```

Get the final arbitration result from the root tournament. 

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `isFinished` | `bool` | Whether the tournament is finished |
| `winnerCommitment` | `Tree.Node` | The winning commitment |
| `finalMachineStateHash` | `Machine.Hash` | Final machine state hash of winner |

## Tournament Factory Functions
---

### `instantiate()` (SingleLevelTournamentFactory)

```solidity
function instantiate(Machine.Hash initialHash, IDataProvider provider) external returns (ITournament)
```

Create a new single-level tournament instance.

**Event Emitted:** `tournamentCreated(ITournament)` when tournament is created

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `initialHash` | `Machine.Hash` | Initial machine state hash |
| `provider` | `IDataProvider` | Data provider for input validation |

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `tournament` | `ITournament` | Created tournament instance |

### `instantiate()` (MultiLevelTournamentFactory)

```solidity
function instantiate(Machine.Hash initialHash, IDataProvider provider) external returns (ITournament)
```

Create a new multi-level tournament hierarchy starting with a top tournament.

**Event Emitted:** `tournamentCreated(ITournament)` when tournament is created 

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `initialHash` | `Machine.Hash` | Initial machine state hash |
| `provider` | `IDataProvider` | Data provider for input validation |

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `tournament` | `ITournament` | Created top tournament instance |

### `instantiateTop()`

```solidity
function instantiateTop(Machine.Hash initialHash, IDataProvider provider) external returns (Tournament)
```

Create a new top-level tournament in the multi-level hierarchy.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `initialHash` | `Machine.Hash` | Initial machine state hash |
| `provider` | `IDataProvider` | Data provider for input validation |

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `tournament` | `Tournament` | Created top tournament instance |

### `instantiateMiddle()`

```solidity
function instantiateMiddle(Machine.Hash initialHash, Tree.Node contestedCommitmentOne, Machine.Hash contestedFinalStateOne, Tree.Node contestedCommitmentTwo, Machine.Hash contestedFinalStateTwo, Time.Duration allowance, uint256 startCycle, uint64 level, IDataProvider provider) external returns (Tournament)
```

Create a new middle-level tournament for dispute resolution.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `initialHash` | `Machine.Hash` | Initial machine state hash |
| `contestedCommitmentOne` | `Tree.Node` | First contested commitment |
| `contestedFinalStateOne` | `Machine.Hash` | First contested final state |
| `contestedCommitmentTwo` | `Tree.Node` | Second contested commitment |
| `contestedFinalStateTwo` | `Machine.Hash` | Second contested final state |
| `allowance` | `Time.Duration` | Time allowance for participants |
| `startCycle` | `uint256` | Starting cycle for the tournament |
| `level` | `uint64` | Tournament level in hierarchy |
| `provider` | `IDataProvider` | Data provider for input validation |

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `tournament` | `Tournament` | Created middle tournament instance |

### `instantiateBottom()`

```solidity
function instantiateBottom(Machine.Hash initialHash, Tree.Node contestedCommitmentOne, Machine.Hash contestedFinalStateOne, Tree.Node contestedCommitmentTwo, Machine.Hash contestedFinalStateTwo, Time.Duration allowance, uint256 startCycle, uint64 level, IDataProvider provider) external returns (Tournament)
```

Create a new bottom-level tournament for leaf dispute resolution.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `initialHash` | `Machine.Hash` | Initial machine state hash |
| `contestedCommitmentOne` | `Tree.Node` | First contested commitment |
| `contestedFinalStateOne` | `Machine.Hash` | First contested final state |
| `contestedCommitmentTwo` | `Tree.Node` | Second contested commitment |
| `contestedFinalStateTwo` | `Machine.Hash` | Second contested final state |
| `allowance` | `Time.Duration` | Time allowance for participants |
| `startCycle` | `uint256` | Starting cycle for the tournament |
| `level` | `uint64` | Tournament level in hierarchy |
| `provider` | `IDataProvider` | Data provider for input validation |

**Returns:**

| Name | Type | Description |
|------|------|-------------|
| `tournament` | `Tournament` | Created bottom tournament instance |
