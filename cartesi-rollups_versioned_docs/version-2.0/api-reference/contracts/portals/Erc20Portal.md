---
title: Erc20Portal
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/portals/Erc20Portal.sol
    title: Erc20Portal contract
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/portals/IErc20Portal.sol
    title: IErc20Portal interface
---

The **Erc20Portal** allows anyone to perform transfers of
ERC-20 tokens to an application contract while informing the off-chain machine.

:::note
Since rollups-contracts 3.0.0-alpha.7, this contract is named `Erc20Portal` (formerly `ERC20Portal`) and its deposit function is `depositErc20Tokens` (formerly `depositERC20Tokens`). The function selector changed, so calls encoded with the old name revert.
:::

## `depositErc20Tokens()`

```solidity
function depositErc20Tokens(IERC20 token, address appContract, uint256 value, bytes calldata execLayerData) external;
```

Transfer ERC-20 tokens to an application contract and add an input to
the application's input box to signal such operation.

The caller must allow the portal to withdraw at least `value` tokens
from their account beforehand, by calling the `approve` function in the
token contract.

Only ERC-20 compliant tokens are supported:

- The portal requires `transferFrom` to return `true`. Empty or ill-formed return values are rejected with a low-level error.
- The portal rejects fee-on-transfer tokens. It compares the application's token balance before and after the transfer and reverts unless the difference is exactly `value`.

The input is added to the input box returned by the application's `getInputBox()` function, not to a fixed input box. See the [trust note on the InputBox page](../input-box.md#choosing-and-checking-the-input-box).

If the application is foreclosed before the deposit input is finalized, anyone can call [`issueRefund()`](../application.md#issuerefund) on the application to return the tokens to the depositor.

#### Parameters

| Name          | Type    | Description                                              |
| ------------- | ------- | -------------------------------------------------------- |
| token         | IERC20  | The ERC-20 token contract address                        |
| appContract   | address | The application contract address                         |
| value         | uint256 | The amount of tokens to be transferred                   |
| execLayerData | bytes   | Additional data to be interpreted by the execution layer |

#### Errors

| Error | Condition |
| ----- | --------- |
| `Erc20TransferFailed()` | `transferFrom` returned `false` |
| `Erc20TransferDecreasedApplicationBalance(uint256 balanceBefore, uint256 balanceAfter)` | The application's token balance decreased during the transfer |
| `Erc20TransferValueIsNotBalanceDelta(uint256 value, uint256 balanceDelta)` | The application's balance did not grow by exactly `value` (for example, a fee-on-transfer token) |
| `ApplicationNotDeployed(address appContract)` | The application address has no code |
| `ApplicationReverted(address appContract, bytes error)` | The call to the application reverted |
| `IllformedApplicationReturnData(address appContract, bytes data)` | The application returned ill-formed data |
| `InputBoxNotDeployed(address inputBox)` | The input box returned by the application has no code |
| `ApplicationForeclosed(address appContract)` | The application was foreclosed (raised by the `InputBox`) |
| `InputTooLarge(address appContract, uint256 inputLength, uint256 maxInputLength)` | The encoded input exceeds the maximum input size (raised by the `InputBox`) |

Errors raised by the token contract (for example, insufficient allowance or balance) are propagated.
