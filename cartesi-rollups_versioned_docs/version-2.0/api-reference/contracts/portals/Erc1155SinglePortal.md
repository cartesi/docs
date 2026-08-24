---
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/portals/Erc1155SinglePortal.sol
    title: Erc1155SinglePortal contract
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/portals/IErc1155SinglePortal.sol
    title: IErc1155SinglePortal interface
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

The **Erc1155SinglePortal** allows anyone to perform single transfers of ERC-1155 tokens to a dApp while informing the off-chain machine.

Portals inherit `IPortal`, which extends `IApplicationChecker` and `IVersionGetter`. They do not hold an input box address; deposits are routed to the input box advertised by the application (`getInputBox()`). Deposits may revert with `ApplicationNotDeployed`, `ApplicationReverted`, `IllformedApplicationReturnData`, `InputBoxNotDeployed`, or `ApplicationForeclosed`.

### `depositSingleErc1155Token()`

```solidity
function depositSingleErc1155Token(IERC1155 token, address appContract, uint256 tokenId, uint256 value, bytes calldata baseLayerData, bytes calldata execLayerData) external;
```

Transfer an ERC-1155 token to a dApp and add an input to
the dApp's input box to signal such operation.

The caller must enable approval for the portal to manage all of their tokens
beforehand, by calling the `setApprovalForAll` function in the token contract.

If the application is foreclosed and the deposit input is not processed,
the user can issue a refund. If the depositor is a smart contract, a refund
succeeds only if it implements the ERC-1155 receiver hooks.

#### Parameters

| Name          | Type     | Description                                              |
| ------------- | -------- | -------------------------------------------------------- |
| token         | IERC1155 | The ERC-1155 token contract                              |
| appContract   | address  | The address of the dApp                                  |
| tokenId       | uint256  | The identifier of the token being transferred            |
| value         | uint256  | Transfer amount                                          |
| baseLayerData | bytes    | Additional data to be interpreted by the base layer      |
| execLayerData | bytes    | Additional data to be interpreted by the execution layer |
