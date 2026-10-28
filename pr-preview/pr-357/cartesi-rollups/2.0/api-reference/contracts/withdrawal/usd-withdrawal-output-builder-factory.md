> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: usd-withdrawal-output-builder-factory
title: UsdWithdrawalOutputBuilderFactory
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.6/src/withdrawal/UsdWithdrawalOutputBuilderFactory.sol
    title: UsdWithdrawalOutputBuilderFactory contract
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.6/src/withdrawal/IUsdWithdrawalOutputBuilderFactory.sol
    title: IUsdWithdrawalOutputBuilderFactory interface
---

**`UsdWithdrawalOutputBuilderFactory`** lets anyone deploy a [`UsdWithdrawalOutputBuilder`](./usd-withdrawal-output-builder.md) for a given ERC-20 token at a predictable address. Because these builders are **stateless**, it does not matter whether you deploy one yourself or reuse an existing one for the same token. The address is derived deterministically from the token and salt (using `CREATE2`).

The factory is constructed with a shared `SafeERC20Transfer` contract, which it passes to every builder it deploys (used as the delegate-call voucher destination).

## Functions

### `newUsdWithdrawalOutputBuilder()`

```solidity
function newUsdWithdrawalOutputBuilder(IERC20 token, bytes32 salt)
    external
    returns (IUsdWithdrawalOutputBuilder usdWithdrawalOutputBuilder)
```

Deploy a new USD withdrawal output builder deterministically. Emits `UsdWithdrawalOutputBuilderCreated`.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `token` | `IERC20` | The USD-like ERC-20 token |
| `salt` | `bytes32` | The salt used to deterministically generate the contract address |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `usdWithdrawalOutputBuilder` | `IUsdWithdrawalOutputBuilder` | The deployed builder |

### `calculateUsdWithdrawalOutputBuilderAddress()`

```solidity
function calculateUsdWithdrawalOutputBuilderAddress(IERC20 token, bytes32 salt)
    external
    view
    returns (address usdWithdrawalOutputBuilderAddress)
```

Compute the deterministic address a builder for `token`/`salt` would have, whether or not it is already deployed. Use this to obtain the builder address for a [`WithdrawalConfig`](./withdrawal-config.md) without deploying.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `token` | `IERC20` | The USD-like ERC-20 token |
| `salt` | `bytes32` | The salt used to deterministically generate the contract address |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `usdWithdrawalOutputBuilderAddress` | `address` | The deterministic builder address |

### `getSafeErc20Transfer()`

```solidity
function getSafeErc20Transfer() external view returns (ISafeERC20Transfer safeErc20Transfer)
```

Get the shared safe ERC-20 transfer contract passed down to the builders (used as the delegate-call voucher destination).

## Events

### `UsdWithdrawalOutputBuilderCreated()`

```solidity
event UsdWithdrawalOutputBuilderCreated(IUsdWithdrawalOutputBuilder usdWithdrawalOutputBuilder)
```

Triggered on a successful call to `newUsdWithdrawalOutputBuilder`.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `usdWithdrawalOutputBuilder` | `IUsdWithdrawalOutputBuilder` | The newly deployed builder |
