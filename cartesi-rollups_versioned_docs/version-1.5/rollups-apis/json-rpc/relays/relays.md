---
id: relays
title: DAppAddressRelay
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v1.4.0/onchain/rollups/contracts/relays/DAppAddressRelay.sol
    title: DAppAddressRelay contract
---

The **DAppAddressRelay** contract allows anyone to inform the off-chain machine
of the address of the dApp contract in a trustless and permissionless way.

## `relayDAppAddress()`

```solidity
function relayDAppAddress(address _dapp) external
```

Add an input to a dApp's input box with its address.

### Parameters

| Name   | Type    | Description             |
| ------ | ------- | ----------------------- |
| \_dapp | address | The address of the dApp |
