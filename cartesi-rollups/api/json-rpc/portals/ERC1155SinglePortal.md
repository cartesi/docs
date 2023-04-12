## ERC1155SinglePortal

### inputBox

```solidity
contract IInputBox inputBox
```

### constructor

```solidity
constructor(contract IInputBox _inputBox) public
```

### getInputBox

```solidity
function getInputBox() external view returns (contract IInputBox)
```

Get the input box used by this portal

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | contract IInputBox | the input box |

### depositSingleERC1155Token

```solidity
function depositSingleERC1155Token(contract IERC1155 _token, address _dapp, uint256 _tokenId, uint256 _value, bytes _baseLayerData, bytes _execLayerData) external
```

Transfer an ERC-1155 token to a DApp and add an input to
        the DApp's input box to signal such operation.

_The caller must allow the portal to withdraw the token
     from their account beforehand._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _token | contract IERC1155 | The ERC-1155 token contract |
| _dapp | address | The address of the DApp |
| _tokenId | uint256 | The identifier of the token being transferred |
| _value | uint256 | Transfer amount |
| _baseLayerData | bytes | Additional data to be interpreted by the base layer |
| _execLayerData | bytes | Additional data to be interpreted by the execution layer |

