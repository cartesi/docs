## ERC1155BatchPortal

Transfer a batch of ERC-1155 tokens to a DApp and add an input to the DApp's input box to signal such operation.

### getInputBox

```solidity
function getInputBox() external view returns (contract IInputBox)
```

Get the input box used by this portal

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | contract IInputBox | the input box |

### depositBatchERC1155Token

```solidity
function depositBatchERC1155Token(contract IERC1155 _token, address _dapp, uint256[] _tokenIds, uint256[] _values, bytes _baseLayerData, bytes _execLayerData) external
```

Transfer a batch of ERC-1155 tokens to a DApp and add an input to
        the DApp's input box to signal such operation.

_Requirements:_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _token | contract IERC1155 | The ERC-1155 token contract |
| _dapp | address | The address of the DApp |
| _tokenIds | uint256[] | The identifiers of the tokens being transferred |
| _values | uint256[] | Transfer amounts per token type |
| _baseLayerData | bytes | Additional data to be interpreted by the base layer |
| _execLayerData | bytes | Additional data to be interpreted by the execution layer |