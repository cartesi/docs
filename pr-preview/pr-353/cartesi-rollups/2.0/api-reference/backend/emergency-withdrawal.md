> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: emergency-withdrawal
title: Emergency Withdrawal (guest requirements)
---

[Emergency withdrawal](../../development/emergency-withdrawal/overview.md) lets users recover their in-app balances directly from the base layer after an application is foreclosed. For that to work, the on-chain contracts need a way to read each account's balance from the settled machine state. This page describes what the **guest application** (the code running inside the Cartesi Machine) must do to support it.

## The accounts drive

The application keeps a dedicated region of machine memory called the **accounts drive**. It is the withdrawable-balance ledger: a list of account records, where each record holds an owner and that owner's balance. After foreclosure, the contracts prove this drive against the settled machine state and pay each account out from it.

An application supports emergency withdrawal only if:

1. It maintains an accounts drive, and
2. The drive's layout matches the [`WithdrawalConfig`](../contracts/withdrawal/withdrawal-config.md) the application was deployed with.
3. The WithdrawalOutputBuilder contract configured in the application can decode the account and build a valid output to withdraw the assets

If the layout the guest writes and the config the contract was given disagree, proofs will not validate and funds cannot be withdrawn.

## Matching the layout

The [`WithdrawalConfig`](../contracts/withdrawal/withdrawal-config.md) describes the drive with three values, and the guest must write records that match them:

- `accountsDriveStartIndex` positions the drive in machine memory;
- `log2MaxNumOfAccounts` sets how many accounts fit (the tree depth);
- `log2LeavesPerAccount` sets each record's size, which is `2^(5 + log2LeavesPerAccount)` bytes.

For the single-token case (see [`UsdWithdrawalOutputBuilder`](../contracts/withdrawal/usd-withdrawal-output-builder.md)), each record is exactly 32 bytes: a 12-byte little-endian `uint96` balance, followed by the 20-byte owner address (no tail padding).

## Creating the accounts drive

The accounts drive is a standard Cartesi Machine drive, declared in your project's `cartesi.toml` alongside every other drive. The [Advanced configuration](../../development/advanced-configuration.md#drives) guide covers how drives are defined and built in general; the accounts drive is distinctive only in that it is left raw, so the guest can write balance records into it directly.

Declare it next to the root drive as an empty, raw, unmounted flash drive, and set `final_hash = true` so the build produces the machine hash that on-chain deployment requires:

```toml
[machine]
# ...your existing machine settings...
final_hash = true

# The application and OS, built from your Dockerfile.
[drives.root]
builder = "docker"
dockerfile = "Dockerfile"
format = "ext2"

# The accounts drive: a raw, unformatted flash drive for the balance ledger.
[drives.accounts]
builder = "empty"
format = "raw"
size = 4194304   # size in bytes
mount = false
user = "dapp"
```

Leaving the drive raw and unmounted is deliberate. Rather than layering a filesystem on top, the guest opens the block device directly (for example `/dev/pmem1`) and writes fixed-size records at deterministic offsets. That predictable layout is precisely what allows the drive to be Merkle-proven against the machine state after foreclosure. The [Common drive options](../../development/advanced-configuration.md#common-drive-options) reference explains each field used above.

Two properties of the drive must agree with the [`WithdrawalConfig`](../contracts/withdrawal/withdrawal-config.md):

- **Size.** The drive must be large enough to hold the entire account tree, which spans `2^(5 + log2MaxNumOfAccounts + log2LeavesPerAccount)` bytes. A single-token ledger with `log2LeavesPerAccount = 0` and `log2MaxNumOfAccounts = 12`, for example, occupies `2^17` bytes (128 KiB), well within the drive declared above.
- **Position.** `accountsDriveStartIndex` records where the drive begins in machine memory, expressed as its start address divided by that account-tree size. You do not compute it by hand: `cartesi build` places the drive, and you read the assigned position from `.cartesi/image/config.json`. That value is the `accountsDriveStartIndex` you supply in the [`WithdrawalConfig`](../contracts/withdrawal/withdrawal-config.md#drive-geometry) at deploy time.

With the drive declared and sized, the guest fills it with balance records, as described next.

## Keeping the balances

You rarely need to write the drive by hand. A ledger library maintains the accounts drive for you: it credits deposits, debits withdrawals and transfers, and stores every balance in the drive so it stays provable from the machine state. See the [Asset Management Library](https://cartesi.github.io/docs/pr-preview/pr-303/cartesi-rollups/2.0/api-reference/asset-management/overview/) for how to store and manage balances this way.

## The account encoding must round-trip

The bytes the guest writes for an account must be the same bytes the on-chain [withdrawal output builder](../contracts/withdrawal/iwithdrawal-output-builder.md) decodes at withdrawal time. For the USD builder, that means the `(owner, balance)` encoding the guest produces must match what the builder reads back to build the transfer.

:::note
Emergency withdrawal relies on four descriptions of the accounts drive agreeing: the layout the **guest** writes, the **`WithdrawalConfig`** on-chain, the parameters used to **generate proofs** off-chain, and the account encoding the **output builder** decodes. Choose these together at deploy time. See [Withdrawal Contracts Overview](../contracts/withdrawal/overview.md#the-four-way-agreement).
:::
