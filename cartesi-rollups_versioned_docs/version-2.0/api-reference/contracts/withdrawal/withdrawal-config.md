---
id: withdrawal-config
title: WithdrawalConfig
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/common/WithdrawalConfig.sol
    title: WithdrawalConfig struct
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/library/LibWithdrawalConfig.sol
    title: LibWithdrawalConfig library
---

The **`WithdrawalConfig`** struct is passed to the [`Application`](../application.md#constructor) constructor to enable **foreclosure and emergency withdrawal**. It defines who may foreclose the application (the **guardian**), the geometry of the **accounts drive** (the in-app balance ledger held inside the machine state), and the contract that builds withdrawal outputs.

A **zero-valued** `WithdrawalConfig` is valid and deploys an application **without** the feature.

## Struct

```solidity
struct WithdrawalConfig {
    address guardian;
    uint8 log2LeavesPerAccount;
    uint8 log2MaxNumOfAccounts;
    uint64 accountsDriveStartIndex;
    IWithdrawalOutputBuilder withdrawalOutputBuilder;
}
```

| Field | Type | Description |
|-------|------|-------------|
| `guardian` | `address` | The account allowed to call [`foreclose()`](../application.md#foreclose). |
| `log2LeavesPerAccount` | `uint8` | Log2 of the machine-state-tree leaves reserved per account. Each account record occupies `2^(5 + log2LeavesPerAccount)` bytes. |
| `log2MaxNumOfAccounts` | `uint8` | Log2 of the maximum number of accounts. This is the depth of the accounts-drive tree. |
| `accountsDriveStartIndex` | `uint64` | Start-index factor that positions the accounts drive in machine memory (see [Drive geometry](#drive-geometry)). |
| `withdrawalOutputBuilder` | `IWithdrawalOutputBuilder` | The contract that builds the withdrawal output for an account. See [IWithdrawalOutputBuilder](./iwithdrawal-output-builder.md). |

## Drive geometry

Let `a = log2LeavesPerAccount`, `b = log2MaxNumOfAccounts`, and `c = accountsDriveStartIndex`. The accounts drive:

- has a **size** of `2^(a + b + 5)` bytes (the `+5` is the log2 of the 32-byte data block, `CanonicalMachine.LOG2_DATA_BLOCK_SIZE`);
- **starts** at machine memory address `c * 2^(a + b + 5)`;
- holds up to `2^b` accounts, each occupying `2^(a + 5)` bytes.

These same three values are returned on-chain by [`getLog2LeavesPerAccount()`](../application.md#getlog2leavesperaccount), [`getLog2MaxNumOfAccounts()`](../application.md#getlog2maxnumofaccounts), and [`getAccountsDriveStartIndex()`](../application.md#getaccountsdrivestartindex), and must match the layout the guest application actually writes.

## Validation

```solidity
function isValid(WithdrawalConfig memory withdrawalConfig) internal pure returns (bool)
```

The `Application` constructor calls `isValid()` and reverts with `InvalidWithdrawalConfig` (see [ApplicationFactory](../application-factory.md)) if it returns `false`. `isValid()` enforces that the accounts drive fits inside the machine memory:

- `log2(driveSize) = 5 + log2MaxNumOfAccounts + log2LeavesPerAccount` must not exceed `64` (the machine memory is `2^64` bytes); and
- the drive's end address `(accountsDriveStartIndex + 1) << log2(driveSize)` must not overflow and must not exceed `2^64`.

:::note
`isValid()` checks only the **drive geometry**. It does **not** reject a zero `guardian` or a zero `withdrawalOutputBuilder`. A config with those set to zero still passes the constructor, as long as its geometry is valid. Deployment tools such as the Cartesi Rollups CLI go further and refuse a zero guardian or builder for an *enabled* config, but a direct factory call would not.
:::
