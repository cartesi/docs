> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/portals/Erc20Portal.sol
    title: Erc20Portal contract
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/portals/IErc20Portal.sol
    title: IErc20Portal interface
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

The **Erc20Portal** allows anyone to perform transfers of
ERC-20 tokens to a dApp while informing the off-chain machine.

Portals inherit `IPortal`, which extends `IApplicationChecker` and `IVersionGetter`. They do not hold an input box address; deposits are routed to the input box advertised by the application (`getInputBox()`). Deposits may revert with `ApplicationNotDeployed`, `ApplicationReverted`, `IllformedApplicationReturnData`, `InputBoxNotDeployed`, or `ApplicationForeclosed`.

## `depositErc20Tokens()`

```solidity
function depositErc20Tokens(IERC20 token, address appContract, uint256 value, bytes calldata execLayerData) external;
```

Transfer ERC-20 tokens to a dApp and add an input to
the dApp's input box to signal such operation.

The caller must allow the portal to withdraw at least `value` tokens
from their account beforehand, by calling the `approve` function in the
token contract.

Only ERC-20 compliant tokens are supported. The portal rejects deposits
of fee-on-transfer ERC-20 tokens by comparing the application balance
before and after the transfer. Empty or ill-formed `transferFrom` return
values raise a low-level error.

#### Parameters

| Name          | Type    | Description                                              |
| ------------- | ------- | -------------------------------------------------------- |
| token         | IERC20  | The ERC-20 token contract address                        |
| appContract   | address | The address of the dApp                                  |
| value         | uint256 | The amount of tokens to be transferred                   |
| execLayerData | bytes   | Additional data to be interpreted by the execution layer |

#### Errors

| Error | Condition |
|-------|-----------|
| `Erc20TransferFailed` | Token transfer did not succeed |
| `Erc20TransferDecreasedApplicationBalance` | Application balance fell during the transfer |
| `Erc20TransferValueIsNotBalanceDelta` | Balance delta did not equal `value` (fee-on-transfer) |
