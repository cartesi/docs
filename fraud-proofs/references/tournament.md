# PRT Core Contracts

## Tournament Factory Functions
---
Tournament factory contracts are responsible for instantiating and deploying tournaments. They handle the initialization of tournament parameters including initial machine state, data providers, and timing configurations. There are two main factory types: `SingleLevelTournamentFactory` for simple disputes and `MultiLevelTournamentFactory` for complex multi-level dispute resolution, which coordinates the creation of Top, Middle, and Bottom tournament instances. 

### `instantiate()`

```solidity
function instantiate(Machine.Hash initialState, IDataProvider provider) external returns (ITournament)
```

Create a new single-level tournament instance.

**Event Emitted:** `TournamentCreated(ITournament tournament)` when tournament is created

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `initialState` | `Machine.Hash` | Initial machine state hash |
| `provider` | `IDataProvider` | Data provider for input validation |

**Return Values:**

| Index | Type | Description |
|------|------|-------------|
| [0] | `ITournament` | Created tournament instance |

### `instantiateTop()` (MultiLevelTournamentFactory)

```solidity
function instantiateTop(Machine.Hash _initialHash, IDataProvider _provider) external returns (ITournament)
```

Create a new top-level tournament in the multi-level hierarchy.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `initialHash` | `Machine.Hash` | Initial machine state hash |
| `provider` | `IDataProvider` | Data provider for input validation |

**Returns:**

| Index | Type | Description |
|------|------|-------------|
| [0] | `Tournament` | Created top tournament instance |

### `instantiateMiddle()`

```solidity
function instantiateMiddle(Machine.Hash initialHash, Tree.Node contestedCommitmentOne, Machine.Hash contestedFinalStateOne, Tree.Node contestedCommitmentTwo, Machine.Hash contestedFinalStateTwo, Time.Duration allowance, uint256 startCycle, uint64 level, IDataProvider provider) external returns (ITournament)
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

| Index | Type | Description |
|------|------|-------------|
| [0] | `ITournament` | Created middle tournament instance |

### `instantiateBottom()`

```solidity
function instantiateBottom(Machine.Hash initialHash, Tree.Node contestedCommitmentOne, Machine.Hash contestedFinalStateOne, Tree.Node contestedCommitmentTwo, Machine.Hash contestedFinalStateTwo, Time.Duration allowance, uint256 startCycle, uint64 level, IDataProvider provider) external returns (ITournament)
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

| Index | Type | Description |
|------|------|-------------|
| [0] | `ITournament` | Created bottom tournament instance |

## Tournament Core Functions
---
Core tournament contracts implement the asynchronous PRT-style dispute resolution mechanism. The abstract Tournament contract provides the foundational skeleton that resolves disputes among N parties in O(log N) depth under chess-clock timing, with asynchronous pairing where claims are matched as they arrive without requiring a prebuilt bracket. Concrete implementations include `SingleLevelTournament` for single-level disputes, `TopTournament` for the root of multi-level instances, `MiddleTournament` for intermediate levels, and `BottomTournament` for the leaf level that performs actual state transitions.

### `joinTournament()`

```solidity
function joinTournament(Machine.Hash finalState, bytes32[] calldata proof, Tree.Node leftNode, Tree.Node rightNode) external payable
```

Join a tournament by submitting a final computation hash with Merkle proof. Creates a match if another participant is waiting.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `finalState` | `Tree.Node` | Final computational hash |
| `proof` | `bytes32[]` | Merkle proof for the final state |
| `leftNode` | `Tree.Node` | Left node of the commitment |
| `rightNode` | `Tree.Node` | Right node of the commitment |

### `arbitrationResult()`

```solidity
function arbitrationResult() external view returns (bool finished, Tree.Node winnerCommitment, Machine.Hash finalState)
```

Get the final arbitration result from the root tournament. 

**Return Values:**

| Name | Type | Description |
|------|------|-------------|
| `finished` | `bool` | Whether the tournament is finished |
| `winnerCommitment` | `Tree.Node` | The winning commitment |
| `finalState` | `Machine.Hash` | Final machine state hash of winner |

### `advanceMatch()`

```solidity
function advanceMatch(Match.Id calldata matchId, Tree.Node leftNode, Tree.Node rightNode, Tree.Node newLeftNode, Tree.Node newRightNode) external
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
function winMatchByTimeout(Match.Id calldata matchId, Tree.Node leftNode, Tree.Node rightNode) external
```

Win a match when the opponent has run out of time allowance. 

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `matchId` | `Match.Id` | Identifier of the match to win by timeout |

### `eliminateMatchByTimeout()`

```solidity
function eliminateMatchByTimeout(Match.Id calldata matchId) external
```

Eliminate a match when both participants have run out of time. 

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `matchId` | `Match.Id` | Identifier of the match to eliminate |

### `isFinished()`

```solidity
function isFinished() external view returns (bool)
```

Check if the tournament has finished (has a winner or is eliminated). 

### `isClosed()`

```solidity
function isClosed() external view returns (bool)
```

Check if the tournament is closed to new participants. 

### `bondValue()`
```solidity
function bondValue() external view returns (uint256)
```

Get the amount of Wei necessary to call `joinTournament()`.

**Return Values:**

| Index | Type | Description |
|------|------|-------------|
| [0] | `uint256` | The tournament bond value |

### `tryRecoveringBond()`

```solidity
function tryRecoveringBond() external returns (bool)
```

Try recovering the bond of the winner commitment submitter.

**Return Values:**

| Index | Type | Description |
|------|------|-------------|
| [0] | `bool` | Whether the recovery was successful |

### `sealInnerMatchAndCreateInnerTournament()`

```solidity
function sealInnerMatchAndCreateInnerTournament(Match.Id calldata matchId, Tree.Node leftLeaf, Tree.Node rightLeaf, Machine.Hash agreeHash, bytes32[] calldata agreeHashProof) external
```

Seal an inner match and create a new inner tournament to resolve the dispute at a finer granularity.

**Event Emitted:** `NewInnerTournament(Match.IdHash indexed matchIdHash, ITournament indexed childTournament)` when inner tournament is created 

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
function winInnerTournament(ITournament childTournament, Tree.Node leftNode, Tree.Node rightNode) external
```

Process the result of a finished inner tournament and advance the parent match. 

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `childTournament` | `ITournament` | The inner/child tournament |
| `leftNode` | `Tree.Node` | Left child of the winning commitment |
| `rightNode` | `Tree.Node` | Right child of the winning commitment |

### `eliminateInnerTournament()`

```solidity
function eliminateInnerTournament(ITournament childTournament) external
```

Eliminate an inner tournament that has no winner and advance the parent match. 

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `childTournament` | `ITournament` | The inner/child tournament to eliminate |

### `innerTournamentWinner()`

```solidity
function innerTournamentWinner() external view returns (bool, Tree.Node, Tree.Node, Clock.State memory)
```

Get the winner information from a finished inner tournament for parent tournament processing. 

**Returns:**

| Index | Type | Description |
|------|------|-------------|
| [0] | `bool` | Whether the tournament is finished |
| [1] | `Tree.Node` | The contested parent commitment |
| [2] | `Tree.Node` | The winning inner commitment |
| [3] | `Clock.State` | Paused clock state of the winning inner commitment |

### `canBeEliminated()`

```solidity
function canBeEliminated() external view returns (bool)
```

Check if the tournament can be safely eliminated by its parent. 

**Returns:**

| Index | Type | Description |
|------|------|-------------|
| [0] | `bool` | Whether the tournament can be eliminated |

## Other View Functions
---

### `tournamentArguments()`
```solidity
function tournamentArguments() external view returns (TournamentArguments memory)
```

Get the tournament arguments.

**Return Values:**

| Index | Type | Description |
|------|------|-------------|
| [0] | `TournamentArguments` | The tournament arguments |

### `canWinMatchByTimeout()`
```solidity
function canWinMatchByTimeout(Match.Id calldata matchId) external view returns (bool)
```

Check if a match can be won by timeout.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `matchId` | `Match.Id` | The identifier of the match |

**Return Values:**

| Index | Type | Description |
|------|------|-------------|
| [0] | `bool` | Whether the match can be won by timeout |

### `getCommitment()`
```solidity
function getCommitment(Tree.Node commitmentRoot) external view returns (Clock.State memory clock, Machine.Hash finalState)
```
Get the clock and final state of a commitment.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `commitmentRoot` | `Tree.Node` | The root of the commitment |

**Return Values:**

| Index | Type | Description |
|------|------|-------------|
| [0] | `Clock.State` | The clock state of the commitment |
| [1] | `Machine.Hash` | The final state of the commitment |

### `getMatch()`
```solidity
function getMatch(Match.IdHash matchIdHash) external view returns (Match.State memory)
```

Get the match state for a given match identifier.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `matchIdHash` | `Match.IdHash` | The identifier of the match |

**Return Values:**

| Index | Type | Description |
|------|------|-------------|
| [0] | `Match.State` | The state of the match |


### `getMatchCycle()`
```solidity
function getMatchCycle(Match.IdHash matchIdHash) external view returns (uint256)
```

Get the running machine cycle of a match by its ID hash.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `matchIdHash` | `Match.IdHash` | The identifier of the match |

**Return Values:**

| Index | Type | Description |
|------|------|-------------|
| [0] | `uint256` | The cycle of the match |


### `tournamentLevelConstants()`
```solidity
function tournamentLevelConstants() external view returns (uint64 maxLevel, uint64 level, uint64 log2step, uint64 height)
```
Get the level constants of a tournament.

**Return Values:**

| Name | Type | Description |
|------|------|-------------|
| `maxLevel` | `uint64` | The maximum number of levels in the tournament |
| `level` | `uint64` | The current level of the tournament |
| `log2step` | `uint64` | The log2 number of steps between commitment leaves |
| `height` | `uint64` | The height of the commitment tree |

### `timeFinished()`
```solidity
function timeFinished() external view returns (bool, Time.Instant)
```

Get the confirmation and time when the tournament finished.

**Return Values:**

| Index | Type | Description | 
|------|------|-------------|
| [0] | `bool` | Whether the tournament has finished |
| [1] | `Time.Instant` | The time when the tournament finished |

## Events Emitted
---

### `TournamentCreated()`
```solidity
event TournamentCreated(ITournament tournament)
```

An event emitted when a new tournament is instantiated.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `tournament` | `ITournament` | The tournament with its arguments |

### `CommitmentJoined()`
```solidity
event CommitmentJoined(Tree.Node commitmentRoot, Machine.Hash finalState, address claimer)
```

An event emitted when a commitment is successfully added.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `commitmentRoot` | `Tree.Node` | The root of the commitment |
| `finalState` | `Machine.Hash` | The final computational hash |
| `claimer` | `address` | The address of the claimer |

### `PartialBondRefund()`
```solidity
event PartialBondRefund(address indexed recipient, uint256 value, bool indexed success, bytes ret)
```

An event emitted when a partial bond refund is successful.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `recipient` | `address` | The address of the recipient |
| `value` | `uint256` | The amount of the refund |
| `success` | `bool` | Whether the refund was successful |
| `ret` | `bytes` | The return data of the refund |

### `NewInnerTournament()`
```solidity
event NewInnerTournament(Match.IdHash indexed matchIdHash, ITournament indexed childTournament)
```

An event emitted when a new inner tournament is created.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `matchIdHash` | `Match.IdHash` | Hashed Identifier of the match |
| `childTournament` | `ITournament` | The inner/child tournament |

### `MatchCreated()`
```solidity
event MatchCreated(Match.IdHash indexed matchIdHash, Tree.Node indexed one, Tree.Node indexed two, Tree.Node leftOfTwo)
```

An event emitted when a new match is created.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `matchIdHash` | `Match.IdHash` | Identifier of the match |
| `one` | `Tree.Node` | One of the participants |
| `two` | `Tree.Node` | Two of the participants |
| `leftOfTwo` | `Tree.Node` | Left node of the two |

### `MatchAdvanced()`
```solidity
event MatchAdvanced(Match.IdHash indexed matchIdHash, Tree.Node otherParent, Tree.Node leftNode)
```

An event emitted when a match is advanced.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `matchIdHash` | `Match.IdHash` | Hashed Identifier of the match |
| `otherParent` | `Tree.Node` | The new `otherParent` value |
| `leftNode` | `Tree.Node` | The new `leftNode` value |

### `MatchDeleted()`
```solidity
event MatchDeleted(Match.IdHash indexed matchIdHash, Tree.Node indexed one, Tree.Node indexed two, MatchDeletionReason reason, WinnerCommitment winnerCommitment)   
```

An event emitted when a match is deleted.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `matchIdHash` | `Match.IdHash` | Hashed Identifier of the match |
| `one` | `Tree.Node` | Commitment of the 1st participant |
| `two` | `Tree.Node` | Commitment of the 2nd participant |
| `reason` | `MatchDeletionReason` | The reason for the deletion |
| `winnerCommitment` | `WinnerCommitment` | The winner commitment |