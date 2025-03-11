---
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v1.4.0/onchain/rollups/contracts/portals/ERC20Portal.sol
    title: ERC20Portal contract
---

The **ERC20Portal** allows anyone to perform transfers of
ERC-20 tokens to a dApp while informing the off-chain machine.

## `depositERC20Tokens()`

```solidity
function depositERC20Tokens(IERC20 token, address appContract, uint256 value, bytes calldata execLayerData) external;
```

Transfer ERC-20 tokens to a dApp and add an input to
the dApp's input box to signal such operation.

The caller must allow the portal to withdraw at least `_amount` tokens
from their account beforehand, by calling the `approve` function in the
token contract.

#### Parameters

| Name          | Type    | Description                                              |
| ------------- | ------- | -------------------------------------------------------- |
| token         | IERC20  | The ERC-20 token contract address                        |
| appContract   | address | The address of the dApp                                  |
| value         | uint256 | The amount of tokens to be transferred                   |
| execLayerData | bytes   | Additional data to be interpreted by the execution layer |

