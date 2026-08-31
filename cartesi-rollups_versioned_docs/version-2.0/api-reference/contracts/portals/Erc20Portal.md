---
id: Erc20Portal
title: Erc20Portal
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/portals/Erc20Portal.sol
    title: Erc20Portal contract
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/portals/IErc20Portal.sol
    title: IErc20Portal interface
---

The **`Erc20Portal`** transfers ERC-20 tokens to an Application and adds an input describing the deposit. See the [portal overview](./overview.md) for input-box discovery and common errors.

## `depositErc20Tokens()`

```solidity
function depositErc20Tokens(
    IERC20 token,
    address appContract,
    uint256 value,
    bytes calldata execLayerData
) external
```

| Parameter | Type | Description |
| --- | --- | --- |
| `token` | `IERC20` | ERC-20 token contract |
| `appContract` | `address` | Application receiving the tokens and input |
| `value` | `uint256` | Number of token base units to transfer |
| `execLayerData` | `bytes` | Additional data for the execution layer |

Before calling the portal, the depositor must approve it to spend at least `value` tokens.

The portal measures the Application's token balance before and after `transferFrom`. It accepts the deposit only when the balance increases by exactly `value` and the token returns `true`. Fee-on-transfer tokens and other non-compliant ERC-20 implementations are rejected to prevent the backend from recording more assets than the Application received.

## Errors

| Error | Meaning |
| --- | --- |
| `Erc20TransferFailed` | `transferFrom` returned `false` |
| `Erc20TransferDecreasedApplicationBalance` | The Application's balance decreased during the transfer |
| `Erc20TransferValueIsNotBalanceDelta` | The balance increase differs from `value` |

Malformed or missing ERC-20 return data can also produce a low-level revert.
