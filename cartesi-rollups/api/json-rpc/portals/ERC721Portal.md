## ERC721Portal

Add Description here...

### getInputBox

```solidity
function getInputBox() external view returns (contract IInputBox)
```

Get the input box used by this portal

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | contract IInputBox | the input box |

### depositERC721Token

```solidity
function depositERC721Token(contract IERC721 _token, address _dapp, uint256 _tokenId, bytes _baseLayerData, bytes _execLayerData) external
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
| _baseLayerData | bytes | Additional data to be interpreted by the base layer                (forwarded to the ERC-721 token contract) |
| _execLayerData | bytes | Additional data to be interpreted by the execution layer |
