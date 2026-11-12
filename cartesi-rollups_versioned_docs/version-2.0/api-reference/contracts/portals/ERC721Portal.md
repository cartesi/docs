---
title: Erc721Portal
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/portals/Erc721Portal.sol
    title: Erc721Portal contract
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/portals/IErc721Portal.sol
    title: IErc721Portal interface
---

The **Erc721Portal** allows anyone to perform transfers of
ERC-721 tokens to an application contract while informing the off-chain machine.

:::note
Since rollups-contracts 3.0.0-alpha.7, this contract is named `Erc721Portal` (formerly `ERC721Portal`) and its deposit function is `depositErc721Token` (formerly `depositERC721Token`). The function selector changed, so calls encoded with the old name revert.
:::

## `depositErc721Token()`

```solidity
function depositErc721Token(IERC721 token, address appContract, uint256 tokenId, bytes calldata baseLayerData, bytes calldata execLayerData) external;
```

Transfer an ERC-721 token to an application contract and add an input to
the application's input box to signal such operation.

The caller must change the approved address for the ERC-721 token
to the portal address beforehand, by calling the `approve` function in the
token contract.

The input is added to the input box returned by the application's `getInputBox()` function, not to a fixed input box. See the [trust note on the InputBox page](../input-box.md#choosing-and-checking-the-input-box).

If the application is foreclosed before the deposit input is finalized, anyone can call [`issueRefund()`](../application.md#issuerefund) on the application to return the token to the depositor. If the depositor is a smart contract, the refund only succeeds if that contract accepts the token through the `onERC721Received` callback. Otherwise, the token may not be recoverable.

#### Parameters

| Name          | Type    | Description                                              |
| ------------- | ------- | -------------------------------------------------------- |
| token         | IERC721 | The ERC-721 token contract address                       |
| appContract   | address | The application contract address                         |
| tokenId       | uint256 | The identifier of the token being transferred            |
| baseLayerData | bytes   | Additional data to be interpreted by the base layer      |
| execLayerData | bytes   | Additional data to be interpreted by the execution layer |

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
