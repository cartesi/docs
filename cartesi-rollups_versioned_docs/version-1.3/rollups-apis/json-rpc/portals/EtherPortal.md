---
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v1.4.0/onchain/rollups/contracts/portals/EtherPortal.sol
    title: EtherPortal contract
---

The **EtherPortal** allows anyone to perform transfers of
Ether to a dApp while informing the off-chain machine.

## `depositEther()`

```solidity
function depositEther(address _dapp, bytes _execLayerData) external payable
```

Transfer Ether to a dApp and add an input to
the dApp's input box to signal such operation.

All the value sent through this function is forwarded to the dApp.

#### Parameters

| Name            | Type    | Description                                              |
| --------------- | ------- | -------------------------------------------------------- |
| \_dapp          | address | The address of the dApp                                  |
| \_execLayerData | bytes   | Additional data to be interpreted by the execution layer |
