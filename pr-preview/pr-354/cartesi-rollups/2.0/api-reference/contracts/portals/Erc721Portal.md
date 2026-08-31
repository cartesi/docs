> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: Erc721Portal
title: Erc721Portal
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/portals/Erc721Portal.sol
    title: Erc721Portal contract
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/portals/IErc721Portal.sol
    title: IErc721Portal interface
---

The **`Erc721Portal`** transfers one ERC-721 token to an Application and adds an input describing the deposit. See the [portal overview](./overview.md) for input-box discovery and common errors.

## `depositErc721Token()`

```solidity
function depositErc721Token(
    IERC721 token,
    address appContract,
    uint256 tokenId,
    bytes calldata baseLayerData,
    bytes calldata execLayerData
) external
```

| Parameter | Type | Description |
| --- | --- | --- |
| `token` | `IERC721` | ERC-721 token contract |
| `appContract` | `address` | Application receiving the token and input |
| `tokenId` | `uint256` | Token identifier |
| `baseLayerData` | `bytes` | Data passed to the Application's ERC-721 receiver hook |
| `execLayerData` | `bytes` | Additional data for the execution layer |

Before depositing, the owner must approve the portal for `tokenId` or grant it operator approval with `setApprovalForAll`.

If an unfinalized deposit is later refunded to a contract depositor, that contract must accept the token through `onERC721Received`.
