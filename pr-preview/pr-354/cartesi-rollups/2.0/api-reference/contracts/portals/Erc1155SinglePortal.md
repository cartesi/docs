> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: Erc1155SinglePortal
title: Erc1155SinglePortal
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/portals/Erc1155SinglePortal.sol
    title: Erc1155SinglePortal contract
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/portals/IErc1155SinglePortal.sol
    title: IErc1155SinglePortal interface
---

The **`Erc1155SinglePortal`** transfers an amount of one ERC-1155 token type to an Application and adds an input describing the deposit. See the [portal overview](./overview.md) for input-box discovery and common errors.

## `depositSingleErc1155Token()`

```solidity
function depositSingleErc1155Token(
    IERC1155 token,
    address appContract,
    uint256 tokenId,
    uint256 value,
    bytes calldata baseLayerData,
    bytes calldata execLayerData
) external
```

| Parameter | Type | Description |
| --- | --- | --- |
| `token` | `IERC1155` | ERC-1155 token contract |
| `appContract` | `address` | Application receiving the tokens and input |
| `tokenId` | `uint256` | Token-type identifier |
| `value` | `uint256` | Amount to transfer |
| `baseLayerData` | `bytes` | Data passed to the Application's ERC-1155 receiver hook |
| `execLayerData` | `bytes` | Additional data for the execution layer |

Before depositing, the owner must authorize the portal with `setApprovalForAll`.

If an unfinalized deposit is later refunded to a contract depositor, that contract must implement the appropriate ERC-1155 receiver hook.
