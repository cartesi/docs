> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/portals/Erc1155BatchPortal.sol
    title: Erc1155BatchPortal contract
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/portals/IErc1155BatchPortal.sol
    title: IErc1155BatchPortal interface
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

The **Erc1155BatchPortal** allows anyone to perform batch transfers of
ERC-1155 tokens to a dApp while informing the off-chain machine.

Portals inherit `IPortal`, which extends `IApplicationChecker` and `IVersionGetter`. They do not hold an input box address; deposits are routed to the input box advertised by the application (`getInputBox()`). Deposits may revert with `ApplicationNotDeployed`, `ApplicationReverted`, `IllformedApplicationReturnData`, `InputBoxNotDeployed`, or `ApplicationForeclosed`.

## `depositBatchErc1155Token()`

```solidity
function depositBatchErc1155Token(IERC1155 token, address appContract, uint256[] calldata tokenIds, uint256[] calldata values, bytes calldata baseLayerData, bytes calldata execLayerData) external;
```

Transfer a batch of ERC-1155 tokens to a dApp and add an input to
the dApp's input box to signal such operation.

The caller must enable approval for the portal to manage all of their tokens
beforehand, by calling the `setApprovalForAll` function in the token contract.

*Please make sure `tokenIds` and `values` have the same length.*

If the application is foreclosed and the deposit input is not processed,
the user can issue a refund. If the depositor is a smart contract, a refund
succeeds only if it implements the ERC-1155 receiver hooks.

#### Parameters

| Name          | Type      | Description                                              |
| ------------- | --------- | -------------------------------------------------------- |
| token         | IERC1155  | The ERC-1155 token contract                              |
| appContract   | address   | The address of the dApp                                  |
| tokenIds      | uint256[] | The identifiers of the tokens being transferred          |
| values        | uint256[] | Transfer amounts per token type                          |
| baseLayerData | bytes     | Additional data to be interpreted by the base layer      |
| execLayerData | bytes     | Additional data to be interpreted by the execution layer |
