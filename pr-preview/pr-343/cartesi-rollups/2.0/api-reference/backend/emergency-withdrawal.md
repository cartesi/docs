> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: emergency-withdrawal
title: Emergency Withdrawal (guest requirements)
---

[Emergency withdrawal](../../development/foreclosure/overview.md) lets users recover their in-app balances directly from the base layer after an application is foreclosed. For that to work, the on-chain contracts need a way to read each account's balance from the settled machine state. This page describes what the **guest application** (the code running inside the Cartesi Machine) must do to support it.

## The accounts drive

The application keeps a dedicated region of machine memory called the **accounts drive**. It is the withdrawable-balance ledger: a list of account records, where each record holds an owner and that owner's balance. After foreclosure, the contracts prove this drive against the settled machine state and pay each account out from it.

An application supports emergency withdrawal only if:

1. it maintains an accounts drive, and
2. the drive's layout matches the [`WithdrawalConfig`](../contracts/withdrawal/withdrawal-config.md) the application was deployed with.

If the layout the guest writes and the config the contract was given disagree, proofs will not validate and funds cannot be withdrawn.

## Matching the layout

The [`WithdrawalConfig`](../contracts/withdrawal/withdrawal-config.md) describes the drive with three values, and the guest must write records that match them:

- `accountsDriveStartIndex` positions the drive in machine memory;
- `log2MaxNumOfAccounts` sets how many accounts fit (the tree depth);
- `log2LeavesPerAccount` sets each record's size, which is `2^(5 + log2LeavesPerAccount)` bytes.

For the single-token case (see [`UsdWithdrawalOutputBuilder`](../contracts/withdrawal/usd-withdrawal-output-builder.md)), each record is 32 bytes: an 8-byte little-endian balance, followed by the 20-byte owner address, followed by padding.

## Keeping the balances

You rarely need to write the drive by hand. A ledger library maintains the accounts drive for you: it credits deposits, debits withdrawals and transfers, and stores every balance in the drive so it stays provable from the machine state. See the [Asset Management Library](https://cartesi.github.io/docs/pr-preview/pr-303/cartesi-rollups/2.0/api-reference/asset-management/overview/) for how to store and manage balances this way.

## The account encoding must round-trip

The bytes the guest writes for an account must be the same bytes the on-chain [withdrawal output builder](../contracts/withdrawal/iwithdrawal-output-builder.md) decodes at withdrawal time. For the USD builder, that means the `(owner, balance)` encoding the guest produces must match what the builder reads back to build the transfer.

:::note
Emergency withdrawal relies on four descriptions of the accounts drive agreeing: the layout the **guest** writes, the **`WithdrawalConfig`** on-chain, the parameters used to **generate proofs** off-chain, and the account encoding the **output builder** decodes. Choose these together at deploy time. See [Withdrawal Contracts Overview](../contracts/withdrawal/overview.md#the-four-way-agreement).
:::
