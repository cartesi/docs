---
id: usd-withdrawal-output-builder
title: UsdWithdrawalOutputBuilder
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/withdrawal/UsdWithdrawalOutputBuilder.sol
    title: UsdWithdrawalOutputBuilder contract
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/withdrawal/IUsdWithdrawalOutputBuilder.sol
    title: IUsdWithdrawalOutputBuilder interface
---

**`UsdWithdrawalOutputBuilder`** is a concrete [`IWithdrawalOutputBuilder`](./iwithdrawal-output-builder.md) for applications whose accounts drive denominates a **single ERC-20 token**. It is a stateless contract fixed to one token at construction; deploy one per token with the [factory](./usd-withdrawal-output-builder-factory.md).

For each account it produces a **`DelegateCallVoucher`** that delegate-calls a shared [`SafeErc20Transfer`](https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/delegatecall/SafeErc20Transfer.sol) contract to move `balance` of the token to the account owner. (Before rollups-contracts v3.0.0-alpha.7, this contract and its interface were named `SafeERC20Transfer` and `ISafeERC20Transfer`.)

## Account encoding

The builder decodes each account with `LibUsdAccount`. An account is **exactly 32 bytes**, with no padding:

| Bytes | Content |
|-------|---------|
| `0` to `11` | The balance, a `uint96` stored **little-endian** (at most `2^96 - 1`) |
| `12` to `31` | The owner address (20 bytes, big-endian) |

For example, a balance of `1000` (`0x3e8`) owned by `0xbd8eba8bf9e56ad92f4c4fc89d6cb88902535749` is encoded as `0xe80300000000000000000000bd8eba8bf9e56ad92f4c4fc89d6cb88902535749`.

:::caution
Before rollups-contracts v3.0.0-alpha.7, the balance was a `uint64` in bytes `0` to `7` and the owner was in bytes `8` to `27`. A record written in that older layout still has a valid proof, but this builder decodes it to a different owner and balance. Make sure the guest writes the layout above.
:::

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

Decode `account` (see [Account encoding](#account-encoding)) into the owner `user` and its `balance`, and return a `DelegateCallVoucher` that, when executed by the application, calls `SafeErc20Transfer.safeTransfer(token, user, balance)`.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `account` | `bytes` | The account, decoded via `LibUsdAccount.decode` into `(address user, uint96 balance)` |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `output` | `bytes` | An ABI-encoded `DelegateCallVoucher(destination, payload)` where `destination` is the `SafeErc20Transfer` contract and `payload` is `safeTransfer(token, user, balance)` |

*Raises [`InvalidAccountSize`](./iwithdrawal-output-builder.md#invalidaccountsize) if the account is not exactly 32 bytes long.*
