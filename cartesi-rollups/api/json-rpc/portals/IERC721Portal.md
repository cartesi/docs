## IERC721Portal

### depositERC721Token

```solidity
function depositERC721Token(contract IERC721 _token, address _dapp, uint256 _tokenId, bytes _L1data, bytes _L2data) external
```

Transfer an ERC-721 token to a DApp and add an input to
        the DApp's input box to signal such operation.

_The caller must allow the portal to withdraw the token
     from their account beforehand._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _token | contract IERC721 | The ERC-721 token contract |
| _dapp | address | The address of the DApp |
| _tokenId | uint256 | The identifier of the NFT being transferred |
| _L1data | bytes | Additional data to be interpreted by L1                (forwarded to the ERC-721 token contract) |
| _L2data | bytes | Additional data to be interpreted by L2 |

