---
id: application
title: Application
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/prerelease/2.0.0/contracts/dapp/Application.sol
    title: Application contract
  - url: https://docs.openzeppelin.com/contracts/5.x/
    title: OpenZeppelin Contracts
---

The **Application** contract acts as the base layer incarnation of a application running on the execution layer. The application can interact with other smart contracts through the execution an validation of outputs. The application frontend on the execution layer generates these outputs, which can be proven in the base layer thanks to claims submitted by a consensus contract.

Every Application is subscribed to a consensus contract and governed by a single address, the owner. The consensus has the power to submit claims, which, in turn, are used to validate outputs. The owner has complete power over the Application, as it can replace the consensus anytime. Therefore, the users of a application must trust both the consensus and the application owner.

This contract inherits the following OpenZeppelin contracts.

- `Ownable`
- `ERC721Holder`
- `ERC1155Holder`
- `ReentrancyGuard`
- `IERC721Receiver`
- `BitMaps`

For more information, please consult [OpenZeppelin's official documentation](https://docs.openzeppelin.com/contracts/5.x/).

## `executeOutput()`

```solidity
function executeOutput(bytes calldata output, OutputValidityProof calldata proof) external override nonReentrant (bool)
```

Try to execute a output.

Reverts if output was already successfully executed or if the If the caller is attempting to execute a non-executable output.

_On a successful execution, emits a `OutputExecuted` event._

### Parameters

| Name          | Type         | Description                                                                                        |
| ------------- | ------------ | -------------------------------------------------------------------------------------------------- |
| output     | bytes        | The output contains, encapsulated in the form of bytes to be decoded within the function logic, the destination contract (address), the output value (uint256), and the payload (bytes) which encodes a function call.                  |
| proof       | struct OutputValidityProof | The proof used to validate the output against a claim submitted by the current consensus contract |

## `wasOutputExecuted()`

```solidity
function wasOutputExecuted(uint256 outputIndex) external view override returns (bool)
```

Check whether a voucher has been executed.

### Parameters

| Name              | Type    | Description                              |
| ----------------- | ------- | ---------------------------------------- |
| outputIndex     | uint256 | The index of output emitted by the input |

### Return Values

| Name | Type | Description                                  |
| ---- | ---- | -------------------------------------------- |
| [0]  | bool | Whether the output has been executed before |

## `migrateToConsensus()`

```solidity
function migrateToConsensus(IConsensus newConsensus) external override onlyOwner;
```

Migrate the Application to a new consensus.

_Can only be called by the Application owner._

### Parameters

| Name           | Type                | Description       |
| -------------- | ------------------- | ----------------- |
| \_newConsensus | contract IConsensus | The new consensus address |

## `validateOutput()`

```solidity
function validateOutput(bytes calldata output, OutputValidityProof calldata proof) public view override;
```

Validate a output.

### Parameters

| Name     | Type                   | Description                 |
| -------- | ---------------------- | --------------------------- |
| output | bytes                  | The output                  |
| proof  | struct OutputValidityProof | Data for validating outputs |

Reverts if the output or its corresponding proof is invalid.

## `validateOutputHash()`

```solidity
function validateOutputHash(bytes32 outputHash, OutputValidityProof calldata proof) public view override;
```

Verifies the hash of an output against its proof.

| Name         | Type                       | Description                       |
|--------------|-------------------------------|-----------------------------------|
| outputHash   | bytes32                    | The hash of the output            |
| proof        | struct OutputValidityProof | The proof used to validate the output against a claim submitted by the current consensus contract    |

Reverts if the proof's integrity check fails or if the output Merkle root hash was ever accepted by the consensus for a particular application.

## `getTemplateHash()`

```solidity
function getTemplateHash() external view returns (bytes32)
```

Get the application template hash.

### Return Values

| Name | Type    | Description              |
| ---- | ------- | ------------------------ |
| [0]  | bytes32 | The application template hash |

## `getConsensus()`

```solidity
function getConsensus() external view override returns (IConsensus);
```

Get the current consensus.

### Return Values

| Name | Type                | Description           |
| ---- | ------------------- | --------------------- |
| [0]  | contract IConsensus | The current consensus |

### `receive()`

```solidity
receive() external payable
```

Accept Ether transfers.

_If the caller wants to transfer Ether to an application while informing the backend of it, then please do so through the Ether portal contract._

### `NewConsensus()`

```solidity
event NewConsensus(IConsensus newConsensus);
```

A new consensus is used, this event is emitted when a new consensus is set. This event must be triggered on a successful call to [migrateToConsensus](#migratetoconsensus).

### Parameters

| Name         | Type       | Description                |
| ------------ | ---------- | -------------------------- |
| newConsensus | IConsensus | The new consensus contract |

## `OutputExecuted()`

```solidity
event OutputExecuted(uint64 outputIndex, bytes output);
```

A output was executed from the Application, this event is emitted when a output is executed so it must be triggered on a successful call to [executeOutput](#executeOutput).

### Parameters

| Name         | Type    | Description           |
|--------------|---------|-----------------------|
| outputIndex  | uint64  | The index of the output |
| output       | bytes   | The output             |
