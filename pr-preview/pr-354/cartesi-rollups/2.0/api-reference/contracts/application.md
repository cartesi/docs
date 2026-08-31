> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: application
title: Application
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/dapp/Application.sol
    title: Application contract
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/dapp/IApplication.sol
    title: IApplication interface
---

The **Application** contract is the base-layer representation of an application running inside a Cartesi Machine. Inputs advance the machine off-chain, while accepted claims allow the contract to validate and execute outputs on-chain.

Each Application stores the contracts and values that define its lifecycle:

- an [`IInputBox`](./input-box.md) containing the application's inputs;
- an [`IOutputsMerkleRootValidator`](./consensus/ioutputs-merkle-root-validator.md) that determines which outputs are valid;
- the initial machine state hash, called the template hash;
- a [refund output builder](./refund/overview.md) for returning assets from unprocessed deposits; and
- an optional [`WithdrawalConfig`](./withdrawal/withdrawal-config.md) for foreclosure and emergency withdrawal.

An Application can have an owner, but consensus migration is restricted to the block in which the Application is deployed. The owner cannot replace the validator later. Self-hosted factory deployments renounce ownership before the deployment transaction finishes.

## Deployment

### `constructor()`

```solidity
constructor(
    IOutputsMerkleRootValidator outputsMerkleRootValidator,
    address initialOwner,
    bytes32 templateHash,
    IInputBox inputBox,
    IRefundOutputBuilder refundOutputBuilder,
    WithdrawalConfig memory withdrawalConfig
)
```

Creates an Application and stores its immutable input, refund, machine, and withdrawal configuration.

| Parameter | Type | Description |
| --- | --- | --- |
| `outputsMerkleRootValidator` | `IOutputsMerkleRootValidator` | Initial contract that validates accepted outputs |
| `initialOwner` | `address` | Nonzero initial owner; ownership can be renounced after deployment |
| `templateHash` | `bytes32` | Merkle root of the initial machine state |
| `inputBox` | `IInputBox` | Contract containing this application's input stream |
| `refundOutputBuilder` | `IRefundOutputBuilder` | Builder used to create deposit-refund outputs |
| `withdrawalConfig` | `WithdrawalConfig` | Guardian, accounts-drive geometry, and withdrawal output builder |

The constructor reverts when `initialOwner` is zero or when the accounts-drive layout does not fit in machine memory. A zero-valued withdrawal configuration disables foreclosure recovery.

### `receive()`

```solidity
receive() external payable
```

Accepts Ether. Use the [`EtherPortal`](./portals/EtherPortal.md) when the backend must also receive an input describing the transfer.

## Output execution

### `executeOutput()`

```solidity
function executeOutput(bytes calldata output, OutputValidityProof calldata proof) external
```

Validates an output against the current outputs Merkle root validator, prevents the same output index from being executed twice, records the execution, emits `OutputExecuted`, and executes the output.

| Parameter | Type | Description |
| --- | --- | --- |
| `output` | `bytes` | Encoded output to validate and execute |
| `proof` | `OutputValidityProof` | Merkle proof that locates the output in an accepted outputs tree |

The state flag and event are updated before the external interaction. During that interaction, `wasOutputExecuted(outputIndex)` already returns `true`.

Executable outputs currently include vouchers and delegate-call vouchers. Execution can revert when the output encoding is unsupported, the output was already executed, the target has no deployed code where code is required, the Application lacks enough Ether, or the target call fails.

### `wasOutputExecuted()`

```solidity
function wasOutputExecuted(uint256 outputIndex) external view returns (bool)
```

Returns whether the output was executed previously or is being executed in the current transaction.

| Parameter | Type | Description |
| --- | --- | --- |
| `outputIndex` | `uint256` | Global index of the output |

| Return value | Type | Description |
| --- | --- | --- |
| unnamed | `bool` | `true` if the output was already executed or is being executed |

### `getNumberOfExecutedOutputs()`

```solidity
function getNumberOfExecutedOutputs() external view returns (uint256)
```

Returns the number of outputs the Application has executed. Indexers can use this count when synchronizing `OutputExecuted` events.

| Return value | Type | Description |
| --- | --- | --- |
| unnamed | `uint256` | Number of outputs executed by the Application |

### `validateOutput()`

```solidity
function validateOutput(bytes calldata output, OutputValidityProof calldata proof)
    external
    view
```

Hashes `output` and calls `validateOutputHash`.

| Parameter | Type | Description |
| --- | --- | --- |
| `output` | `bytes` | Encoded output to validate |
| `proof` | `OutputValidityProof` | Merkle proof that locates the output in an accepted outputs tree |

### `validateOutputHash()`

```solidity
function validateOutputHash(bytes32 outputHash, OutputValidityProof calldata proof)
    external
    view
```

Reconstructs the outputs Merkle root from `outputHash` and `proof`, then checks that root with the current validator.

| Parameter | Type | Description |
| --- | --- | --- |
| `outputHash` | `bytes32` | Hash of the encoded output |
| `proof` | `OutputValidityProof` | Merkle proof that reconstructs the outputs root |

It can revert with `InvalidOutputHashesSiblingsArrayLength` or `InvalidOutputsMerkleRoot`.

## Deposit refunds

Deposit refunds recover assets from deposit inputs that were not finalized before foreclosure. See [Deposit refunds](./refund/overview.md) for the complete lifecycle and supported asset types.

### `issueRefund()`

```solidity
function issueRefund(uint256 inputIndex, bytes calldata input) external
```

Issues a refund after the Application has been foreclosed. Anyone can call it.

| Parameter | Type | Description |
| --- | --- | --- |
| `inputIndex` | `uint256` | Index of the deposit input in the Application's input box |
| `input` | `bytes` | Complete encoded input stored at `inputIndex` |

The function:

1. verifies that the input has not already been refunded;
2. validates the complete encoded input against the Application's input box;
3. asks the outputs Merkle root validator whether the input was finalized;
4. asks the refund output builder to construct the asset transfer;
5. records the refund and emits `RefundIssued`; and
6. executes the refund output.

It reverts for a finalized input, a repeated refund, an invalid input, a non-deposit input, or a deposit sent through an unsupported portal.

### `wasRefundForInputIssued()`

```solidity
function wasRefundForInputIssued(uint256 inputIndex) external view returns (bool)
```

Returns whether a refund for `inputIndex` was issued previously or is being issued in the current transaction.

| Parameter | Type | Description |
| --- | --- | --- |
| `inputIndex` | `uint256` | Index of the input to check |

| Return value | Type | Description |
| --- | --- | --- |
| unnamed | `bool` | `true` if the input was already refunded or is being refunded |

### `getNumberOfIssuedRefunds()`

```solidity
function getNumberOfIssuedRefunds() external view returns (uint256)
```

Returns the number of issued refunds. Indexers can compare this count with synchronized `RefundIssued` events.

| Return value | Type | Description |
| --- | --- | --- |
| unnamed | `uint256` | Number of refunds issued by the Application |

### `getRefundOutputBuilder()`

```solidity
function getRefundOutputBuilder() external view returns (IRefundOutputBuilder)
```

Returns the immutable builder used for deposit refunds.

| Return value | Type | Description |
| --- | --- | --- |
| unnamed | `IRefundOutputBuilder` | Refund output builder assigned at deployment |

## Input validation

### `validateInput()`

```solidity
function validateInput(uint256 inputIndex, bytes calldata input)
    external
    view
    returns (uint256 blockNumber, address inputSender, bytes memory inputPayload)
```

Checks that `keccak256(input)` matches the hash stored at `inputIndex`, then decodes an EVM advance input. It also verifies the chain ID, Application address, block number, timestamp, and embedded input index.

| Parameter | Type | Description |
| --- | --- | --- |
| `inputIndex` | `uint256` | Index of the input in the Application's input box |
| `input` | `bytes` | Complete encoded input to validate and decode |

| Return value | Type | Description |
| --- | --- | --- |
| `blockNumber` | `uint256` | Base-layer block in which the input was added |
| `inputSender` | `address` | Direct sender to the input box, such as a portal contract |
| `inputPayload` | `bytes` | Application payload encoded in the input |

### `validateInputHash()`

```solidity
function validateInputHash(uint256 inputIndex, bytes32 inputHash) external view
```

Checks that `inputIndex` exists in the Application's input box and that its stored hash equals `inputHash`.

| Parameter | Type | Description |
| --- | --- | --- |
| `inputIndex` | `uint256` | Index of the input in the Application's input box |
| `inputHash` | `bytes32` | Hash expected at `inputIndex` |

It reverts with `InvalidInputIndex` or `InvalidInputHash`.

## Guardian and foreclosure

### `foreclose()`

```solidity
function foreclose() external
```

Permanently forecloses the Application. Only the configured guardian can call it. Foreclosure prevents new claims from being submitted or accepted and enables deposit refunds and emergency withdrawals.

A second call reverts with `Foreclosed`, so the Application emits `Foreclosure` at most once.

### `isForeclosed()`

```solidity
function isForeclosed() external view returns (bool)
```

Returns whether the Application has been foreclosed.

| Return value | Type | Description |
| --- | --- | --- |
| unnamed | `bool` | `true` if the Application is foreclosed |

### `getGuardian()`

```solidity
function getGuardian() external view returns (address)
```

Returns the address allowed to foreclose the Application.

| Return value | Type | Description |
| --- | --- | --- |
| unnamed | `address` | Configured guardian address |

## Emergency withdrawal

After foreclosure, users can recover balances recorded in the accounts drive. The canonical procedure is documented in [Foreclosure and emergency withdrawal](../../development/emergency-withdrawal/overview.md).

### `proveAccountsDriveMerkleRoot()`

```solidity
function proveAccountsDriveMerkleRoot(
    bytes32 accountsDriveMerkleRoot,
    bytes32[] calldata proof
) external
```

Proves and stores the accounts-drive Merkle root. Anyone can call it after foreclosure, but it can succeed only once.

| Parameter | Type | Description |
| --- | --- | --- |
| `accountsDriveMerkleRoot` | `bytes32` | Merkle root of the configured accounts drive |
| `proof` | `bytes32[]` | Sibling hashes connecting the accounts-drive root to the finalized machine root |

The proof is checked against the last finalized machine state. If no machine state was ever finalized, the constructor's `templateHash` is used. This allows recovery even when the Application has no accepted claim.

### `withdraw()`

```solidity
function withdraw(bytes calldata account, AccountValidityProof calldata proof) external
```

Validates an account against the proved accounts-drive root, builds a withdrawal output, records the withdrawal, emits `Withdrawal`, and executes the output. Anyone can submit a valid withdrawal after foreclosure.

| Parameter | Type | Description |
| --- | --- | --- |
| `account` | `bytes` | Complete encoded accounts-drive record |
| `proof` | `AccountValidityProof` | Proof that locates the account in the proved accounts drive |

The state flag and event are updated before the output interaction. During that interaction, `wereAccountFundsWithdrawn(accountIndex)` already returns `true`.

### `getAccountsDriveMerkleRoot()`

```solidity
function getAccountsDriveMerkleRoot()
    external
    view
    returns (bool wasProved, bytes32 accountsDriveMerkleRoot)
```

Returns whether the root was proved and, when available, its value.

| Return value | Type | Description |
| --- | --- | --- |
| `wasProved` | `bool` | Whether the accounts-drive root has been proved and stored |
| `accountsDriveMerkleRoot` | `bytes32` | Stored accounts-drive root, or zero before it is proved |

### `getNumberOfWithdrawals()`

```solidity
function getNumberOfWithdrawals() external view returns (uint256)
```

Returns the number of completed withdrawals.

| Return value | Type | Description |
| --- | --- | --- |
| unnamed | `uint256` | Number of completed withdrawals |

### `wereAccountFundsWithdrawn()`

```solidity
function wereAccountFundsWithdrawn(uint256 accountIndex) external view returns (bool)
```

Returns whether the account's funds were withdrawn previously or are being withdrawn in the current transaction.

| Parameter | Type | Description |
| --- | --- | --- |
| `accountIndex` | `uint256` | Index of the account in the accounts drive |

| Return value | Type | Description |
| --- | --- | --- |
| unnamed | `bool` | `true` if the account was already withdrawn or is being withdrawn |

### `validateAccount()`

```solidity
function validateAccount(bytes calldata account, AccountValidityProof calldata proof)
    external
    view
```

Hashes an encoded account and calls `validateAccountMerkleRoot`.

| Parameter | Type | Description |
| --- | --- | --- |
| `account` | `bytes` | Complete encoded accounts-drive record |
| `proof` | `AccountValidityProof` | Proof that locates the account in the accounts drive |

### `validateAccountMerkleRoot()`

```solidity
function validateAccountMerkleRoot(
    bytes32 accountMerkleRoot,
    AccountValidityProof calldata proof
) external view
```

Checks an account root at `proof.accountIndex` against the proved accounts-drive root.

| Parameter | Type | Description |
| --- | --- | --- |
| `accountMerkleRoot` | `bytes32` | Merkle root of the encoded account record |
| `proof` | `AccountValidityProof` | Proof that locates the account root in the accounts drive |

### Accounts-drive configuration views

```solidity
function getWithdrawalConfig() external view returns (WithdrawalConfig memory)
function getLog2LeavesPerAccount() external view returns (uint8)
function getLog2MaxNumOfAccounts() external view returns (uint8)
function getAccountsDriveStartIndex() external view returns (uint64)
function getWithdrawalOutputBuilder() external view returns (IWithdrawalOutputBuilder)
```

These functions expose the immutable [`WithdrawalConfig`](./withdrawal/withdrawal-config.md) and its builder.

| Function | Return type | Description |
| --- | --- | --- |
| `getWithdrawalConfig()` | `WithdrawalConfig` | Complete withdrawal configuration |
| `getLog2LeavesPerAccount()` | `uint8` | Base-2 logarithm of the number of Merkle leaves in each account |
| `getLog2MaxNumOfAccounts()` | `uint8` | Base-2 logarithm of the maximum number of accounts |
| `getAccountsDriveStartIndex()` | `uint64` | Machine-memory leaf index at which the accounts drive begins |
| `getWithdrawalOutputBuilder()` | `IWithdrawalOutputBuilder` | Builder used to turn an account record into a withdrawal output |

## General configuration and ownership

### Configuration views

```solidity
function getTemplateHash() external view returns (bytes32)
function getOutputsMerkleRootValidator()
    external
    view
    returns (IOutputsMerkleRootValidator)
function getInputBox() external view returns (IInputBox)
function getDeploymentBlockNumber() external view returns (uint256)
```

`getInputBox()` is also used by the portal contracts to discover where each Application receives inputs.

| Function | Return type | Description |
| --- | --- | --- |
| `getTemplateHash()` | `bytes32` | Initial machine state hash |
| `getOutputsMerkleRootValidator()` | `IOutputsMerkleRootValidator` | Current output validator |
| `getInputBox()` | `IInputBox` | Input box assigned at deployment |
| `getDeploymentBlockNumber()` | `uint256` | Base-layer block in which the Application was deployed |

### `migrateToOutputsMerkleRootValidator()`

```solidity
function migrateToOutputsMerkleRootValidator(
    IOutputsMerkleRootValidator newOutputsMerkleRootValidator
) external
```

Changes the validator only when called by the owner in the Application's deployment block and before foreclosure. Calls in later blocks revert with `NotDeploymentBlock`.

| Parameter | Type | Description |
| --- | --- | --- |
| `newOutputsMerkleRootValidator` | `IOutputsMerkleRootValidator` | Validator to assign to the Application |

### Ownership functions

```solidity
function owner() external view returns (address)
function renounceOwnership() external
function transferOwnership(address newOwner) external
```

These functions implement OpenZeppelin ownership. Because validator migration is limited to the deployment block, ownership after deployment does not grant an ongoing ability to change consensus.

| Function | Parameter or return value | Type | Description |
| --- | --- | --- | --- |
| `owner()` | Return value | `address` | Current owner address |
| `transferOwnership()` | `newOwner` | `address` | Address that will become the owner |

## Events

```solidity
event OutputsMerkleRootValidatorChanged(
    IOutputsMerkleRootValidator newOutputsMerkleRootValidator
)
event OutputExecuted(uint64 indexed outputIndex, bytes output)
event Foreclosure()
event RefundIssued(uint256 indexed inputIndex, bytes input, bytes output)
event AccountsDriveMerkleRootProved(bytes32 accountsDriveMerkleRoot)
event Withdrawal(uint64 indexed accountIndex, bytes account, bytes output)
```

The output, refund, and withdrawal indexes are indexed event parameters, so clients can filter them by topic.

## Errors

| Error | Meaning |
| --- | --- |
| `OutputNotExecutable` | The output selector is not an executable output type |
| `OutputNotReexecutable` | The output index was already executed |
| `InvalidOutputHashesSiblingsArrayLength` | The output proof has the wrong number of siblings |
| `InvalidOutputsMerkleRoot` | The reconstructed outputs root is not accepted |
| `NotGuardian` | A non-guardian called a guardian-only function |
| `NotForeclosed` | A recovery action was attempted before foreclosure |
| `Foreclosed` | An action requires an active Application, or foreclosure was repeated |
| `InvalidInputIndex` | The requested input index does not exist |
| `InvalidInputHash` | The provided input does not match the stored hash |
| `IllFormedInput` | The encoded input is not a valid EVM advance for this Application |
| `CannotRefundFinalizedInput` | The input was finalized and cannot be refunded |
| `RefundAlreadyIssued` | The input was already refunded |
| `UnknownInputSender` | The refund builder does not recognize the input sender as a supported portal |
| `InvalidAccountsDriveMerkleRootProofSize` | The accounts-drive proof has the wrong size |
| `AccountsDriveMerkleRootAlreadyProved` | The accounts-drive root was already stored |
| `AccountsDriveMerkleRootNotProved` | Account validation was attempted before proving the drive root |
| `InvalidAccountRootSiblingsArrayLength` | The account proof has the wrong number of siblings |
| `InvalidMachineMerkleRoot` | The drive proof does not reconstruct the finalized or template machine root |
| `InvalidAccountsDriveMerkleRoot` | The account proof does not reconstruct the stored drive root |
| `AccountFundsAlreadyWithdrawn` | The account was already withdrawn |
| `InvalidAccountSize` | A withdrawal builder received an account with an unexpected size |
| `NotDeploymentBlock` | Validator migration was attempted after deployment |
| `InsufficientFunds` | A voucher requires more Ether than the Application owns |
| `TargetHasNoCode` | An executable output targets an address without deployed code |

Merkle-tree validation can also raise the errors inherited from `BinaryMerkleTreeErrors`.
