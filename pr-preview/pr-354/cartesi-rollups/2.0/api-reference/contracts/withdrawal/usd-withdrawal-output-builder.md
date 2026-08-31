> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: usd-withdrawal-output-builder
title: UsdWithdrawalOutputBuilder
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/withdrawal/UsdWithdrawalOutputBuilder.sol
    title: UsdWithdrawalOutputBuilder contract
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/withdrawal/IUsdWithdrawalOutputBuilder.sol
    title: IUsdWithdrawalOutputBuilder interface
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/library/LibUsdAccount.sol
    title: LibUsdAccount encoding
---

**`UsdWithdrawalOutputBuilder`** implements [`IWithdrawalOutputBuilder`](./iwithdrawal-output-builder.md) for an accounts drive denominated in one ERC-20 token.

The contract is stateless and fixed to a token at construction. Its output is a delegate-call voucher that invokes the shared `SafeErc20Transfer` helper from the Application's context.

## USD account encoding

The builder accepts exactly 32 bytes:

| Byte range | Value |
| --- | --- |
| `0..11` | `uint96` token balance in little-endian byte order |
| `12..31` | 20-byte account-owner address |

This layout places the owner in the final 20 bytes, as required for accounts-drive records. The balance is measured in the token's base units. For a six-decimal token such as USDC, one token is represented as `1_000_000`.

## `constructor()`

```solidity
constructor(ISafeErc20Transfer safeErc20Transfer, IERC20 usd)
```

| Parameter | Type | Description |
| --- | --- | --- |
| `safeErc20Transfer` | `ISafeErc20Transfer` | Delegate-call target that performs the ERC-20 transfer |
| `usd` | `IERC20` | Token held and withdrawn by the Application |

## `token()`

```solidity
function token() external view returns (IERC20)
```

Returns the configured ERC-20 token.

## `buildWithdrawalOutput()`

```solidity
function buildWithdrawalOutput(address appContract, bytes calldata account)
    external
    view
    returns (bytes memory output)
```

Decodes the 32-byte account and returns a `DelegateCallVoucher` whose payload calls:

```solidity
SafeErc20Transfer.safeTransfer(token, owner, balance)
```

The `appContract` parameter is unused because the voucher executes from the calling Application's context.

The function reverts with [`InvalidAccountSize`](./iwithdrawal-output-builder.md#invalidaccountsize) unless `account` is exactly 32 bytes.
