> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: Erc1155BatchPortal
title: Erc1155BatchPortal
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/portals/Erc1155BatchPortal.sol
    title: Erc1155BatchPortal contract
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/portals/IErc1155BatchPortal.sol
    title: IErc1155BatchPortal interface
---

The **`Erc1155BatchPortal`** transfers multiple ERC-1155 token types to an Application and adds one input describing the batch. See the [portal overview](./overview.md) for input-box discovery and common errors.

## `depositBatchErc1155Token()`

```solidity
function depositBatchErc1155Token(
    IERC1155 token,
    address appContract,
    uint256[] calldata tokenIds,
    uint256[] calldata values,
    bytes calldata baseLayerData,
    bytes calldata execLayerData
) external
```

| Parameter | Type | Description |
| --- | --- | --- |
| `token` | `IERC1155` | ERC-1155 token contract |
| `appContract` | `address` | Application receiving the tokens and input |
| `tokenIds` | `uint256[]` | Token-type identifiers |
| `values` | `uint256[]` | Amount corresponding to each token identifier |
| `baseLayerData` | `bytes` | Data passed to the Application's ERC-1155 receiver hook |
| `execLayerData` | `bytes` | Additional data for the execution layer |

`tokenIds` and `values` must have the same length. Before depositing, the owner must authorize the portal with `setApprovalForAll`.

If an unfinalized deposit is later refunded to a contract depositor, that contract must implement the appropriate ERC-1155 receiver hook.
