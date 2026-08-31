> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: EtherPortal
title: EtherPortal
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/portals/EtherPortal.sol
    title: EtherPortal contract
---

The **EtherPortal** allows anyone to perform transfers of
Ether to a dApp while informing the off-chain machine.

The portal obtains the input-box address from the target Application for every deposit. See the [portal overview](./overview.md) for the shared validation flow and errors.

## `depositEther()`

```solidity
function depositEther(address appContract, bytes execLayerData) external payable
```

Transfer Ether to a dApp and add an input to
the dApp's input box to signal such operation.

All the value sent through this function is forwarded to the dApp.

If an unfinalized deposit is later refunded to a contract depositor, that contract must accept the returned Ether through a payable message call.

#### Parameters

| Name          | Type    | Description                                              |
| ------------- | ------- | -------------------------------------------------------- |
| appContract   | address | The address of the dApp                                  |
| execLayerData | bytes   | Additional data to be interpreted by the execution layer |
