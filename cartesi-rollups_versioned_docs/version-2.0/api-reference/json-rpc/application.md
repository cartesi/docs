---
id: application
title: CartesiDApp
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v1.4.0/onchain/rollups/contracts/dapp/CartesiDApp.sol
    title: CartesiDApp contract
  - url: https://docs.openzeppelin.com/contracts/5.x/
    title: OpenZeppelin Contracts
---

The **CartesiDApp** contract acts as the base layer incarnation of a dApp running on the execution layer. The dApp can interact with other smart contracts through the execution of [vouchers](../backend/vouchers.md) and the validation of [notices](../backend/notices.md). The dApp frontend on the execution layer generates these outputs, which can be proven in the base layer thanks to claims submitted by a consensus contract.

Every dApp is subscribed to a consensus contract and governed by a single address, the owner. The consensus has the power to submit claims, which, in turn, are used to validate vouchers and notices. The owner has complete power over the dApp, as it can replace the consensus anytime. Therefore, the users of a dApp must trust both the consensus and the dApp owner.

The dApp developer can choose whichever ownership and consensus models it wants.


Examples of dApp ownership models include:

- no owner (address zero)
- individual signer (externally-owned account)
- multiple signers (multi-sig)
- DAO (decentralized autonomous organization)
- self-owned dApp (off-chain governance logic)

See `IConsensus` for examples of consensus models.

This contract inherits the following OpenZeppelin contracts.

- `Ownable`
- `ERC721Holder`
- `ERC1155Holder`
- `ReentrancyGuard`

For more information, please consult [OpenZeppelin's official documentation](https://docs.openzeppelin.com/contracts/4.x/).

## `executeVoucher()`

```solidity
function executeVoucher(address _destination, bytes _payload, struct Proof _proof) external returns (bool)
```

Try to execute a voucher.

Reverts if voucher was already successfully executed.

_On a successful execution, emits a `VoucherExecuted` event._

### Parameters

| Name          | Type         | Description                                                                                        |
| ------------- | ------------ | -------------------------------------------------------------------------------------------------- |
| \_destination | address      | The address that will receive the payload through a message call                                   |
| \_payload     | bytes        | The payload, which—in the case of Solidity contracts—encodes a function call                       |
| \_proof       | struct Proof | The proof used to validate the voucher against a claim submitted by the current consensus contract |

### Return Values

| Name | Type | Description                                 |
| ---- | ---- | ------------------------------------------- |
| [0]  | bool | Whether the execution was successful or not |

## `wasVoucherExecuted()`

```solidity
function wasVoucherExecuted(uint256 _inboxInputIndex, uint256 _outputIndex) external view returns (bool)
```

Check whether a voucher has been executed.

### Parameters

| Name              | Type    | Description                              |
| ----------------- | ------- | ---------------------------------------- |
| \_inboxInputIndex | uint256 | The index of the input in the input box  |
| \_outputIndex     | uint256 | The index of output emitted by the input |

### Return Values

| Name | Type | Description                                  |
| ---- | ---- | -------------------------------------------- |
| [0]  | bool | Whether the voucher has been executed before |

## `validateNotice()`

```solidity
function validateNotice(bytes _notice, struct Proof _proof) external view returns (bool)
```

Validate a notice.

### Parameters

| Name     | Type                   | Description                 |
| -------- | ---------------------- | --------------------------- |
| \_notice | bytes                  | The notice                  |
| \_proof  | struct [Proof](#proof) | Data for validating outputs |

### Return Values

| Name | Type | Description                        |
| ---- | ---- | ---------------------------------- |
| [0]  | bool | Whether the notice is valid or not |

## `migrateToConsensus()`

```solidity
function migrateToConsensus(contract IConsensus _newConsensus) external
```

Migrate the dApp to a new consensus.

_Can only be called by the dApp owner._

### Parameters

| Name           | Type                | Description       |
| -------------- | ------------------- | ----------------- |
| \_newConsensus | contract IConsensus | The new consensus |

## `getTemplateHash()`

```solidity
function getTemplateHash() external view returns (bytes32)
```

Get the dApp's template hash.

### Return Values

| Name | Type    | Description              |
| ---- | ------- | ------------------------ |
| [0]  | bytes32 | The dApp's template hash |

## `getConsensus()`

```solidity
function getConsensus() external view returns (contract IConsensus)
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

_If you wish to transfer Ether to a dApp while informing
the dApp backend of it, then please do so through the Ether portal contract._

## `withdrawEther()`

```solidity
function withdrawEther(address _receiver, uint256 _value) external
```

Transfer some amount of Ether to some recipient.

_This function can only be called by the dApp itself through vouchers._

### Parameters

| Name       | Type    | Description                                        |
| ---------- | ------- | -------------------------------------------------- |
| \_receiver | address | The address which will receive the amount of Ether |
| \_value    | uint256 | The amount of Ether to be transferred in Wei       |

### `NewConsensus()`

```solidity
event NewConsensus(IConsensus newConsensus);
```

A new consensus is used, this event is emitted when a new consensus is set. This event must be triggered on a successful call to [migrateToConsensus](#migratetoconsensus).

### Parameters

| Name         | Type       | Description                |
| ------------ | ---------- | -------------------------- |
| newConsensus | IConsensus | The new consensus contract |

## `VoucherExecuted()`

```solidity
event VoucherExecuted(uint256 voucherId);
```

A voucher was executed from the dApp, this event is emitted when a voucher is executed so it must be triggered on a successful call to [executeVoucher](#executevoucher).

### Parameters

| Name      | Type    | Description                                                                             |
| --------- | ------- | --------------------------------------------------------------------------------------- |
| voucherId | uint256 | A number that uniquely identifies the voucher amongst all vouchers emitted by this dApp |

## `Proof`

Data for validating outputs

```solidity
struct Proof {
    OutputValidityProof validity;
    bytes context;
}
```

### Members

| Name     | Type                                        | Description                                      |
| -------- | ------------------------------------------- | ------------------------------------------------ |
| validity | [OutputValidityProof](#outputvalidityproof) | A validity proof for the output                  |
| context  | bytes                                       | Data for querying the right claim from consensus |

## `OutputValidityProof`

Data used to prove the validity of an output (notices and vouchers)

```solidity
struct OutputValidityProof {
  uint256 inputIndexWithinEpoch;
  uint256 outputIndexWithinInput;
  bytes32 outputHashesRootHash;
  bytes32 vouchersEpochRootHash;
  bytes32 noticesEpochRootHash;
  bytes32 machineStateHash;
  bytes32[] outputHashInOutputHashesSiblings;
  bytes32[] outputHashesInEpochSiblings;
}
```

### Members

| Name                             | Type      | Description                                                       |
| -------------------------------- | --------- | ----------------------------------------------------------------- |
| inputIndexWithinEpoch            | uint256   | Which input, inside the epoch, the output belongs to              |
| outputIndexWithinInput           | uint256   | Index of output emitted by the input                              |
| outputHashesRootHash             | bytes32   | Merkle root of hashes of outputs emitted by the input             |
| vouchersEpochRootHash            | bytes32   | Merkle root of all epoch's voucher metadata hashes                |
| noticesEpochRootHash             | bytes32   | Merkle root of all epoch's notice metadata hashes                 |
| machineStateHash                 | bytes32   | Hash of the machine state claimed this epoch                      |
| outputHashInOutputHashesSiblings | bytes32[] | Proof that this output metadata is in metadata memory range       |
| outputHashesInEpochSiblings      | bytes32[] | Proof that this output metadata is in epoch's output memory range |
