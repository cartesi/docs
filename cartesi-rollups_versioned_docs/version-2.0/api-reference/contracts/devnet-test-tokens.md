---
id: devnet-test-tokens
title: Devnet test tokens
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/devnet
    title: Devnet contract source
---

Running `make devnet` in the Rollups Contracts repository deploys a set of test assets to Anvil chain ID `31337`. These contracts are intended only for local development. Their unrestricted mint functions make them unsuitable for public networks or production use.

## Deployed token contracts

| Contract | Standard | Name | Symbol | Decimals or URI |
| --- | --- | --- | --- | --- |
| `TestFungibleToken` | ERC-20 | Fungible | FUN | 18 decimals |
| `TestUsdc` | ERC-20 | USD Coin | USDC | 6 decimals |
| `TestNonFungibleToken` | ERC-721 | Non-fungible | NFT | Not applicable |
| `TestMultiToken` | ERC-1155 | Not applicable | Not applicable | `https://test-multi-token.com/{id}.json` |

The deployment script also creates `TestUsdWithdrawalOutputBuilder`. This contract is not a token. It is configured to build emergency-withdrawal outputs that transfer `TestUsdc`.

## ERC-20 test tokens

### `TestFungibleToken`

`TestFungibleToken` is an 18-decimal ERC-20 token named `Fungible` with the symbol `FUN`. Use it to test standard ERC-20 deposits, transfers, vouchers, and refunds.

### `TestUsdc`

`TestUsdc` is a six-decimal ERC-20 token named `USD Coin` with the symbol `USDC`. Its decimal precision matches USDC-style frontend and accounting flows. One whole token is represented by `1_000_000` base units.

Both ERC-20 contracts inherit the following development helpers from `BaseTestFungibleToken`:

```solidity
function mint(uint256 value) external
function mint(address to, uint256 value) external
function burn(uint256 value) external
```

| Function | Description |
| --- | --- |
| `mint(value)` | Mints `value` base units to the caller |
| `mint(to, value)` | Mints `value` base units to `to` |
| `burn(value)` | Burns `value` base units from the caller's balance |

The functions are permissionless. Any account can create tokens for itself or another address, while `burn` only reduces the caller's balance.

For example, mint ten `TestUsdc` tokens to an account with:

```shell
cast send <TestUsdc-address> \
  "mint(address,uint256)" \
  <recipient-address> 10000000 \
  --rpc-url http://127.0.0.1:8545 \
  --private-key <private-key>
```

## ERC-721 test token

`TestNonFungibleToken` is an ERC-721 collection named `Non-fungible` with the symbol `NFT`. It exposes two permissionless mint functions:

```solidity
function mint(uint256 tokenId) external
function mint(address to, uint256 tokenId) external
```

| Function | Description |
| --- | --- |
| `mint(tokenId)` | Creates `tokenId` and assigns it to the caller |
| `mint(to, tokenId)` | Creates `tokenId` and assigns it to `to` |

Each token ID can be minted only once. A call reverts if the selected ID already exists.

For example:

```shell
cast send <TestNonFungibleToken-address> \
  "mint(address,uint256)" \
  <recipient-address> 1 \
  --rpc-url http://127.0.0.1:8545 \
  --private-key <private-key>
```

## ERC-1155 test token

`TestMultiToken` is an ERC-1155 contract for testing individual and batched token transfers. It uses `https://test-multi-token.com/{id}.json` as its metadata URI template.

```solidity
function mint(uint256 tokenId, uint256 value) external
function mint(address to, uint256 tokenId, uint256 value) external
function mintBatch(uint256[] calldata tokenIds, uint256[] calldata values) external
function mintBatch(
    address to,
    uint256[] calldata tokenIds,
    uint256[] calldata values
) external
```

| Function | Description |
| --- | --- |
| `mint(tokenId, value)` | Mints `value` units of `tokenId` to the caller |
| `mint(to, tokenId, value)` | Mints `value` units of `tokenId` to `to` |
| `mintBatch(tokenIds, values)` | Mints several token IDs and amounts to the caller |
| `mintBatch(to, tokenIds, values)` | Mints several token IDs and amounts to `to` |

For batch minting, `tokenIds` and `values` must have the same length. Each value at position `n` is the amount minted for the token ID at position `n`.

For example:

```shell
cast send <TestMultiToken-address> \
  "mint(address,uint256,uint256)" \
  <recipient-address> 1 25 \
  --rpc-url http://127.0.0.1:8545 \
  --private-key <private-key>
```


