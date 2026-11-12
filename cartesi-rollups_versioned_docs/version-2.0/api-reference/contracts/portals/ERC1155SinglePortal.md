---
title: Erc1155SinglePortal
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/portals/Erc1155SinglePortal.sol
    title: Erc1155SinglePortal contract
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/portals/IErc1155SinglePortal.sol
    title: IErc1155SinglePortal interface
---

The **Erc1155SinglePortal** allows anyone to perform single transfers of ERC-1155 tokens to an application contract while informing the off-chain machine.

:::note
Since rollups-contracts 3.0.0-alpha.7, this contract is named `Erc1155SinglePortal` (formerly `ERC1155SinglePortal`) and its deposit function is `depositSingleErc1155Token` (formerly `depositSingleERC1155Token`). The function selector changed, so calls encoded with the old name revert.
:::

### `depositSingleErc1155Token()`

```solidity
function depositSingleErc1155Token(IERC1155 token, address appContract, uint256 tokenId, uint256 value, bytes calldata baseLayerData, bytes calldata execLayerData) external;
```

Transfer ERC-1155 tokens of a single type to an application contract and add an input to
the application's input box to signal such operation.

The caller must enable approval for the portal to manage all of their tokens
beforehand, by calling the `setApprovalForAll` function in the token contract.

The input is added to the input box returned by the application's `getInputBox()` function, not to a fixed input box. See the [trust note on the InputBox page](../input-box.md#choosing-and-checking-the-input-box).

If the application is foreclosed before the deposit input is finalized, anyone can call [`issueRefund()`](../application.md#issuerefund) on the application to return the tokens to the depositor. If the depositor is a smart contract, the refund only succeeds if that contract accepts the tokens through the `onERC1155Received`/`onERC1155BatchReceived` callback. Otherwise, the tokens may not be recoverable.

#### Parameters

| Name          | Type     | Description                                              |
| ------------- | -------- | -------------------------------------------------------- |
| token         | IERC1155 | The ERC-1155 token contract                              |
| appContract   | address  | The application contract address                         |
| tokenId       | uint256  | The identifier of the token being transferred            |
| value         | uint256  | Transfer amount                                          |
| baseLayerData | bytes    | Additional data to be interpreted by the base layer      |
| execLayerData | bytes    | Additional data to be interpreted by the execution layer |

#### Errors

| Error | Condition |
| ----- | --------- |
| `ApplicationNotDeployed(address appContract)` | The application address has no code |
| `ApplicationReverted(address appContract, bytes error)` | The call to the application reverted |
| `IllformedApplicationReturnData(address appContract, bytes data)` | The application returned ill-formed data |
| `InputBoxNotDeployed(address inputBox)` | The input box returned by the application has no code |
| `ApplicationForeclosed(address appContract)` | The application was foreclosed (raised by the `InputBox`) |
| `InputTooLarge(address appContract, uint256 inputLength, uint256 maxInputLength)` | The encoded input exceeds the maximum input size (raised by the `InputBox`) |

Errors raised by the token contract during `safeTransferFrom` (for example, a missing approval) are propagated.
