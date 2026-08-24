---
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/portals/Erc721Portal.sol
    title: Erc721Portal contract
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/portals/IErc721Portal.sol
    title: IErc721Portal interface
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

The **Erc721Portal** allows anyone to perform transfers of
ERC-721 tokens to a dApp while informing the off-chain machine.

Portals inherit `IPortal`, which extends `IApplicationChecker` and `IVersionGetter`. They do not hold an input box address; deposits are routed to the input box advertised by the application (`getInputBox()`). Deposits may revert with `ApplicationNotDeployed`, `ApplicationReverted`, `IllformedApplicationReturnData`, `InputBoxNotDeployed`, or `ApplicationForeclosed`.

## `depositErc721Token()`

```solidity
function depositErc721Token(IERC721 token, address appContract, uint256 tokenId, bytes calldata baseLayerData, bytes calldata execLayerData) external
```

Transfer an ERC-721 token to a dApp and add an input to
the dApp's input box to signal such operation.

The caller must change the approved address for the ERC-721 token
to the portal address beforehand, by calling the `approve` function in the
token contract.

If the application is foreclosed and the deposit input is not processed,
the user can issue a refund. If the depositor is a smart contract, a refund
succeeds only if it accepts the NFT through `onERC721Received`.

#### Parameters

| Name          | Type    | Description                                              |
| ------------- | ------- | -------------------------------------------------------- |
| token         | IERC721 | The ERC-721 token contract address                       |
| appContract   | address | The address of the dApp                                  |
| tokenId       | uint256 | The identifier of the token being transferred            |
| baseLayerData | bytes   | Additional data to be interpreted by the base layer      |
| execLayerData | bytes   | Additional data to be interpreted by the execution layer |
