---
id: application-factory

title: ApplicationFactory
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/prerelease/2.0.0/contracts/dapp/ApplicationFactory.sol
    title: Application Factory contract
---

The **ApplicationFactory** contract is a tool for reliably deploying new instances of the [`CartesiDApp`](../json-rpc/application.md) contract with or without a specified salt value for address derivation.


Additionally, it provides a function to calculate the address of a potential new `CartesiDApp` contract based on input parameters.

This contract ensures efficient and secure deployment of `CartesiDApp` contracts within the Cartesi Rollups framework.


## `newApplication()`

```solidity
function newApplication( IConsensus consensus, address appOwner, bytes32 templateHash) external override returns (IApplication)
```

Deploys a new Application contract without specifying a salt value for address derivation.

Emits an `ApplicationCreated` event upon successful deployment.

#### Parameters

| Name         | Type       | Description                              |
| ------------ | ---------- | ---------------------------------------- |
| consensus    | IConsensus | Instance of the consensus interface      |
| appOwner     | address    | Address of the owner of the application  |
| templateHash | bytes32    | Hash of the template for the application |

## `newApplication()`(with salt)

```solidity
function newApplication( IConsensus consensus, address appOwner, bytes32 templateHash, bytes32 salt ) external override returns (IApplication)
```

Deploys a new `Application` contract with a specified salt value for address derivation.

Emits an `ApplicationCreated` event upon successful deployment.

#### Parameters

| Name         | Type       | Description                              |
| ------------ | ---------- | ---------------------------------------- |
| consensus    | IConsensus | Instance of the consensus interface      |
| appOwner     | address    | Address of the owner of the application  |
| templateHash | bytes32    | Hash of the template for the application |
| salt         | bytes32    | Salt value for address derivation        |

### `calculateApplicationAddress()`

```solidity
function calculateApplicationAddress( IConsensus consensus, address appOwner, bytes32 templateHash, bytes32 salt ) external view override returns (address)
```

Calculates the address of a potential new Application contract based on input parameters.

#### Parameters

| Name         | Type       | Description                              |
| ------------ | ---------- | ---------------------------------------- |
| consensus    | IConsensus | Instance of the consensus interface      |
| appOwner     | address    | Address of the owner of the application  |
| templateHash | bytes32    | Hash of the template for the application |
| salt         | bytes32    | Salt value for address derivation        |

#### Returns

| Type    | Description                                       |
| ------- | ------------------------------------------------- |
| address | Address of the potential new Application contract |
