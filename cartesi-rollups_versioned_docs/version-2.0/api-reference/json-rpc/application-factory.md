---
id: application-factory
title: CartesiDAppFactory
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v1.4.0/onchain/rollups/contracts/dapp/CartesiDAppFactory.sol
    title: CartesiDAppFactory contract
---

The **CartesiDAppFactory** contract is a tool for reliably deploying new instances of the [`CartesiDApp`](../json-rpc/application.md) contract with or without a specified salt value for address derivation.

Additionally, it provides a function to calculate the address of a potential new `CartesiDApp` contract based on input parameters.

This contract ensures efficient and secure deployment of `CartesiDApp` contracts within the Cartesi Rollups framework.


## `newApplication()` 

```solidity
function newApplication( IConsensus consensus, IInputBox inputBox, IPortal[] memory portals, address appOwner, bytes32 templateHash ) external returns (Application)
```

Deploys a new Application contract without specifying a salt value for address derivation.

Emits an `ApplicationCreated` event upon successful deployment.

#### Parameters

| Name         | Type       | Description                              |
| ------------ | ---------- | ---------------------------------------- |
| consensus    | IConsensus | Instance of the consensus interface      |
| inputBox     | IInputBox  | Instance of the input box interface      |
| portals      | IPortal[]  | Array of portal instances                |
| appOwner     | address    | Address of the owner of the application  |
| templateHash | bytes32    | Hash of the template for the application |

## `newApplication()`(with salt)

```solidity
function newApplication(IConsensus consensus, IInputBox inputBox, IPortal[] memory portals, address appOwner, bytes32 templateHash, bytes32 salt) external returns (Application)
```

Deploys a new `Application` contract with a specified salt value for address derivation.

Emits an `ApplicationCreated` event upon successful deployment.

#### Parameters

| Name         | Type       | Description                              |
| ------------ | ---------- | ---------------------------------------- |
| consensus    | IConsensus | Instance of the consensus interface      |
| inputBox     | IInputBox  | Instance of the input box interface      |
| portals      | IPortal[]  | Array of portal instances                |
| appOwner     | address    | Address of the owner of the application  |
| templateHash | bytes32    | Hash of the template for the application |
| salt         | bytes32    | Salt value for address derivation        |

### `calculateApplicationAddress()`

```solidity
function calculateApplicationAddress(IConsensus consensus,IInputBox inputBox,IPortal[] memory portals,address appOwner,bytes32 templateHash,bytes32 salt ) external view returns (address)
```

Calculates the address of a potential new Application contract based on input parameters.

#### Parameters

| Name         | Type       | Description                              |
| ------------ | ---------- | ---------------------------------------- |
| consensus    | IConsensus | Instance of the consensus interface      |
| inputBox     | IInputBox  | Instance of the input box interface      |
| portals      | IPortal[]  | Array of portal instances                |
| appOwner     | address    | Address of the owner of the application  |
| templateHash | bytes32    | Hash of the template for the application |
| salt         | bytes32    | Salt value for address derivation        |

#### Returns

| Type    | Description                                       |
| ------- | ------------------------------------------------- |
| address | Address of the potential new Application contract |
