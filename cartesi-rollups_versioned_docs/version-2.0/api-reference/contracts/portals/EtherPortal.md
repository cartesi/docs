---
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/portals/EtherPortal.sol
    title: EtherPortal contract
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/portals/IEtherPortal.sol
    title: IEtherPortal interface
---

The **EtherPortal** allows anyone to perform transfers of
Ether to an application contract while informing the off-chain machine.

## `depositEther()`

```solidity
function depositEther(address appContract, bytes calldata execLayerData) external payable;
```

Transfer Ether to an application contract and add an input to
the application's input box to signal such operation.

All the value sent through this function is forwarded to the application contract.

The input is added to the input box returned by the application's `getInputBox()` function, not to a fixed input box. See the [trust note on the InputBox page](../input-box.md#choosing-and-checking-the-input-box).

If the application is foreclosed before the deposit input is finalized, anyone can call [`issueRefund()`](../application.md#issuerefund) on the application to return the Ether to the depositor. If the depositor is a smart contract, the refund only succeeds if that contract accepts Ether through a message call. Otherwise, the funds may not be recoverable.

#### Parameters

| Name          | Type    | Description                                              |
| ------------- | ------- | -------------------------------------------------------- |
| appContract   | address | The application contract address                         |
| execLayerData | bytes   | Additional data to be interpreted by the execution layer |

#### Errors

| Error | Condition |
| ----- | --------- |
| `EtherTransferFailed()` | The Ether transfer to the application contract failed |
| `ApplicationNotDeployed(address appContract)` | The application address has no code |
| `ApplicationReverted(address appContract, bytes error)` | The call to the application reverted |
| `IllformedApplicationReturnData(address appContract, bytes data)` | The application returned ill-formed data |
| `InputBoxNotDeployed(address inputBox)` | The input box returned by the application has no code |
| `ApplicationForeclosed(address appContract)` | The application was foreclosed (raised by the `InputBox`) |
| `InputTooLarge(address appContract, uint256 inputLength, uint256 maxInputLength)` | The encoded input exceeds the maximum input size (raised by the `InputBox`) |
