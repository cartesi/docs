---
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/portals/EtherPortal.sol
    title: EtherPortal contract
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/portals/IEtherPortal.sol
    title: IEtherPortal interface
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

The **EtherPortal** allows anyone to perform transfers of
Ether to a dApp while informing the off-chain machine.

Portals inherit `IPortal`, which extends `IApplicationChecker` and `IVersionGetter`. They do not hold an input box address; deposits are routed to the input box advertised by the application (`getInputBox()`). Deposits may revert with `ApplicationNotDeployed`, `ApplicationReverted`, `IllformedApplicationReturnData`, `InputBoxNotDeployed`, or `ApplicationForeclosed`.

## `depositEther()`

```solidity
function depositEther(address appContract, bytes calldata execLayerData) external payable
```

Transfer Ether to a dApp and add an input to
the dApp's input box to signal such operation.

All the value sent through this function is forwarded to the dApp.
If the transfer fails, an `EtherTransferFailed` error is raised.

If the application is foreclosed and the deposit input is not processed,
the user can issue a refund. If the depositor is a smart contract, a refund
succeeds only if it accepts Ether through a message call.

#### Parameters

| Name          | Type    | Description                                              |
| ------------- | ------- | -------------------------------------------------------- |
| appContract   | address | The address of the dApp                                  |
| execLayerData | bytes   | Additional data to be interpreted by the execution layer |
