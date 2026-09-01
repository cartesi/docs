---
id: usd-withdrawal-output-builder
title: UsdWithdrawalOutputBuilder
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/withdrawal/UsdWithdrawalOutputBuilder.sol
    title: UsdWithdrawalOutputBuilder contract
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/withdrawal/IUsdWithdrawalOutputBuilder.sol
    title: IUsdWithdrawalOutputBuilder interface
---

**`UsdWithdrawalOutputBuilder`** is a concrete [`IWithdrawalOutputBuilder`](./iwithdrawal-output-builder.md) for applications whose accounts drive denominates a **single ERC-20 token**. It is a stateless contract fixed to one token at construction; deploy one per token with the [factory](./usd-withdrawal-output-builder-factory.md).

For each account it produces a **`DelegateCallVoucher`** that delegate-calls a shared `SafeErc20Transfer` contract to move `balance` of the token to the account owner.

USD accounts are **exactly 32 bytes**: a little-endian `uint96` balance in the first 12 bytes, and the owner address in the last 20 bytes (no tail padding). Account encodings must end with the owner address so nodes can serve owner-to-account-index lookups.

## Functions

### `constructor()`

```solidity
constructor(ISafeErc20Transfer safeErc20Transfer, IERC20 usd)
```

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `safeErc20Transfer` | `ISafeErc20Transfer` | The shared safe-transfer contract used as the delegate-call destination |
| `usd` | `IERC20` | The ERC-20 token this builder denominates withdrawals in |

### `token()`

```solidity
function token() external view override returns (IERC20)
```

Get the ERC-20 token used to generate withdrawal outputs.

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `[0]` | `IERC20` | The configured token |

### `buildWithdrawalOutput()`

```solidity
function buildWithdrawalOutput(address, bytes calldata account)
    external
    view
    override
    returns (bytes memory output)
```

Decode `account` as `(address user, uint96 balance)` and return a `DelegateCallVoucher` that, when executed by the application, calls `SafeErc20Transfer.safeTransfer(token, user, balance)`.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `account` | `bytes` | The account, decoded via `LibUsdAccount.decode` into `(user, balance)` |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `output` | `bytes` | An ABI-encoded `DelegateCallVoucher(destination, payload)` where `destination` is the `SafeErc20Transfer` contract and `payload` is `safeTransfer(token, user, balance)` |

*Raises [`InvalidAccountSize`](./iwithdrawal-output-builder.md#invalidaccountsize) if the account is not exactly 32 bytes.*
