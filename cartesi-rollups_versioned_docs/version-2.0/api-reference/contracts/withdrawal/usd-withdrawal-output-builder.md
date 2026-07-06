---
id: usd-withdrawal-output-builder
title: UsdWithdrawalOutputBuilder
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.6/src/withdrawal/UsdWithdrawalOutputBuilder.sol
    title: UsdWithdrawalOutputBuilder contract
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.6/src/withdrawal/IUsdWithdrawalOutputBuilder.sol
    title: IUsdWithdrawalOutputBuilder interface
---

**`UsdWithdrawalOutputBuilder`** is a concrete [`IWithdrawalOutputBuilder`](./iwithdrawal-output-builder.md) for applications whose accounts drive denominates a **single ERC-20 token**. It is a stateless contract fixed to one token at construction; deploy one per token with the [factory](./usd-withdrawal-output-builder-factory.md).

For each account it produces a **`DelegateCallVoucher`** that delegate-calls a shared `SafeERC20Transfer` contract to move `balance` of the token to the account owner.

## Functions

### `constructor()`

```solidity
constructor(ISafeERC20Transfer safeErc20Transfer, IERC20 usd)
```

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `safeErc20Transfer` | `ISafeERC20Transfer` | The shared safe-transfer contract used as the delegate-call destination |
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

Decode `account` as `(address user, uint256 balance)` and return a `DelegateCallVoucher` that, when executed by the application, calls `SafeERC20Transfer.safeTransfer(token, user, balance)`.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `account` | `bytes` | The account, decoded via `LibUsdAccount.decode` into `(user, balance)` |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `output` | `bytes` | An ABI-encoded `DelegateCallVoucher(destination, payload)` where `destination` is the `SafeERC20Transfer` contract and `payload` is `safeTransfer(token, user, balance)` |

*Raises [`AccountTooShort`](./iwithdrawal-output-builder.md#accounttooshort) if the account cannot be decoded.*
