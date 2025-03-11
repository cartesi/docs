---
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v1.4.0/onchain/rollups/contracts/portals/ERC1155SinglePortal.sol
    title: ERC1155SinglePortal contract
---

The **ERC1155SinglePortal** allows anyone to perform single transfers of ERC-1155 tokens to a dApp while informing the off-chain machine.

### `depositSingleERC1155Token()`

```solidity
function depositSingleERC1155Token( IERC1155 token, address appContract, uint256 tokenId, uint256 value, bytes calldata baseLayerData, bytes calldata execLayerData) external;
```

Transfer an ERC-1155 token to a dApp and add an input to
the dApp's input box to signal such operation.

The caller must enable approval for the portal to manage all of their tokens
beforehand, by calling the `setApprovalForAll` function in the token contract.

#### Parameters

| Name          | Type     | Description                                              |
| ------------- | -------- | -------------------------------------------------------- |
| token         | IERC1155 | The ERC-1155 token contract                              |
| appContract   | address  | The address of the dApp                                  |
| tokenId       | uint256  | The identifier of the token being transferred            |
| value         | uint256  | Transfer amount                                          |
| baseLayerData | bytes    | Additional data to be interpreted by the base layer      |
| execLayerData | bytes    | Additional data to be interpreted by the execution layer |

