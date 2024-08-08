---
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v1.4.0/onchain/rollups/contracts/portals/ERC1155BatchPortal.sol
    title: ERC1155BatchPortal contract
---

The **ERC1155BatchPortal** allows anyone to perform batch transfers of
ERC-1155 tokens to a dApp while informing the off-chain machine.

## `depositBatchERC1155Token()`

```solidity
function depositBatchERC1155Token(contract IERC1155 _token, address _dapp, uint256[] _tokenIds, uint256[] _values, bytes _baseLayerData, bytes _execLayerData) external
```

Transfer a batch of ERC-1155 tokens to a dApp and add an input to
the dApp's input box to signal such operation.

The caller must enable approval for the portal to manage all of their tokens
beforehand, by calling the `setApprovalForAll` function in the token contract.

_Please make sure `_tokenIds` and `_values` have the same length._

#### Parameters

| Name            | Type              | Description                                              |
| --------------- | ----------------- | -------------------------------------------------------- |
| \_token         | contract IERC1155 | The ERC-1155 token contract                              |
| \_dapp          | address           | The address of the dApp                                  |
| \_tokenIds      | uint256[]         | The identifiers of the tokens being transferred          |
| \_values        | uint256[]         | Transfer amounts per token type                          |
| \_baseLayerData | bytes             | Additional data to be interpreted by the base layer      |
| \_execLayerData | bytes             | Additional data to be interpreted by the execution layer |
