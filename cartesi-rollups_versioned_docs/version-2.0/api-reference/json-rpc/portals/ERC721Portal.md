---
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v1.4.0/onchain/rollups/contracts/portals/ERC721Portal.sol
    title: ERC721Portal contract
---

The **ERC721Portal** allows anyone to perform transfers of
ERC-721 tokens to a dApp while informing the off-chain machine.

## `depositERC721Token()`

```solidity
function depositERC721Token( IERC721 token, address appContract, uint256 tokenId, bytes baseLayerData, bytes execLayerData) external
```

Transfer an ERC-721 token to a dApp and add an input to
the dApp's input box to signal such operation.

The caller must change the approved address for the ERC-721 token
to the portal address beforehand, by calling the `approve` function in the
token contract.

#### Parameters

| Name          | Type    | Description                                              |
| ------------- | ------- | -------------------------------------------------------- |
| token         | IERC721 | The ERC-721 token contract address                       |
| appContract   | address | The address of the dApp                                  |
| tokenId       | uint256 | The identifier of the token being transferred            |
| baseLayerData | bytes   | Additional data to be interpreted by the base layer      |
| execLayerData | bytes   | Additional data to be interpreted by the execution layer |

