---
id: iwithdrawal-output-builder
title: IWithdrawalOutputBuilder
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.6/src/withdrawal/IWithdrawalOutputBuilder.sol
    title: IWithdrawalOutputBuilder interface
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.6/src/withdrawal/IWithdrawalOutputBuilderErrors.sol
    title: IWithdrawalOutputBuilderErrors
---

A **withdrawal output builder** turns an account (as encoded in the application's [accounts drive](./withdrawal-config.md#drive-geometry)) into an [output](../../backend/vouchers.md) that, when executed by the [`Application`](../application.md) contract, transfers that account's funds to its owner.

During [`withdraw()`](../application.md#withdraw), the Application **static-calls** the builder referenced by its [`WithdrawalConfig`](./withdrawal-config.md) and executes the returned output. Because the call is a `STATICCALL`, `buildWithdrawalOutput` must be side-effect free (`view`/`pure`): any state change — contract creation, log emission, storage write, self-destruct, or Ether transfer — reverts the call and aborts the withdrawal.

The account encoding is **application-specific**. See [UsdWithdrawalOutputBuilder](./usd-withdrawal-output-builder.md) for the single-ERC-20 implementation.

## Functions

### `buildWithdrawalOutput()`

```solidity
function buildWithdrawalOutput(address appContract, bytes calldata account)
    external
    view
    returns (bytes memory output)
```

Build an output that, when executed by the application contract, transfers the funds of an account to its owner.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `appContract` | `address` | The application contract address. May be needed for outputs that move assets from the application's own account to the account owner (e.g. ERC-721 / ERC-1155 transfers). |
| `account` | `bytes` | The account, as encoded in the accounts drive |

**Return Values**

| Name | Type | Description |
|------|------|-------------|
| `output` | `bytes` | The withdrawal output |

## Errors

### `AccountTooShort()`

```solidity
error AccountTooShort(uint64 attemptedAccountSize, uint64 minAccountSize)
```

Raised when the provided account is too short for the builder to decode on-chain.

**Parameters**

| Name | Type | Description |
|------|------|-------------|
| `attemptedAccountSize` | `uint64` | The attempted account size, in bytes |
| `minAccountSize` | `uint64` | The minimum expected account size, in bytes |
