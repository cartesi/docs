## EtherPortal

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

### depositEther

```solidity
function depositEther(address _dapp, bytes _execLayerData) external payable
```

Transfer Ether to a DApp and add an input to
        the DApp's input box to signal such operation.

_All the value sent through this function is forwarded to the DApp_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _dapp | address | The address of the DApp |
| _execLayerData | bytes | Additional data to be interpreted by the execution layer |
