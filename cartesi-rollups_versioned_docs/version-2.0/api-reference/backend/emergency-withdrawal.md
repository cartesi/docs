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

An application that keeps its balances only in its own state and pays users out only through vouchers has no accounts drive, so it does not support emergency withdrawal, even if it was deployed with a guardian. After such an application is foreclosed, users can still execute vouchers from epochs accepted before the foreclosure, and deposits whose inputs were never finalized can be refunded, but balances held in the application are not recoverable.

## Matching the layout

The [`WithdrawalConfig`](../contracts/withdrawal/withdrawal-config.md) describes the drive with three values, and the guest must write records that match them:

- `accountsDriveStartIndex` positions the drive in machine memory;
- `log2MaxNumOfAccounts` sets how many accounts fit (the tree depth);
- `log2LeavesPerAccount` sets each record's size, which is `2^(5 + log2LeavesPerAccount)` bytes.

For the single-token case (see [`UsdWithdrawalOutputBuilder`](../contracts/withdrawal/usd-withdrawal-output-builder.md)), each record is exactly 32 bytes, with no padding:

| Bytes | Content |
|-------|---------|
| `0` to `11` | The balance, a `uint96` stored **little-endian** (at most `2^96 - 1`) |
| `12` to `31` | The owner address (20 bytes, big-endian) |

For example, a balance of `1000` (`0x3e8`) owned by `0xbd8eba8bf9e56ad92f4c4fc89d6cb88902535749` is the record `0xe80300000000000000000000bd8eba8bf9e56ad92f4c4fc89d6cb88902535749`. The proof tool treats an all-zero record as an empty slot.

This is the layout of `LibUsdAccount` in rollups-contracts v3.0.0-alpha.7 and later, including v3.0.0-alpha.10. Earlier versions used an 8-byte balance followed by the owner and 4 bytes of padding. A record written in that older layout still proves correctly against the machine state, but the builder decodes it to a different owner and balance, so the withdrawal pays a wrong amount to a wrong address. Write the layout above.

Whatever builder you use, each record must end with the owner's address as its last 20 bytes. This is a rule of the [`IWithdrawalOutputBuilder`](../contracts/withdrawal/iwithdrawal-output-builder.md) interface, and it lets the node look up accounts by owner.

## Creating the accounts drive

The accounts drive is a standard Cartesi Machine drive, declared in your project's `cartesi.toml` alongside every other drive. The [Advanced configuration](../../development/advanced-configuration.md#drives) guide covers how drives are defined and built in general; the accounts drive is distinctive only in that it is left raw, so the guest can write balance records into it directly.

Declare it next to the root drive as an empty, raw, unmounted flash drive. `cartesi build` always stores the machine with its final hash, which on-chain deployment requires, so there is no setting to enable for it (older `cartesi.toml` files may still have a `final_hash` key; remove it, since Cartesi CLI 2.0.0-alpha.41 rejects unknown keys):

```toml
# SDK image for rollups-node v2.0.0-alpha.14 (Cartesi Machine emulator 0.22.0).
sdk = "cartesi/sdk:0.12.0-alpha.45"

[machine]
# ...your existing machine settings...

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
- **Position.** `accountsDriveStartIndex` records where the drive begins in machine memory, expressed as its start address divided by that account-tree size (so the start address must be a multiple of that size). You do not choose the address: `cartesi build` places the drive, and you read the assigned start address from `.cartesi/image/config.json`. Dividing it by the account-tree size gives the `accountsDriveStartIndex` you supply in the [`WithdrawalConfig`](../contracts/withdrawal/withdrawal-config.md#drive-geometry) at deploy time.

### Checking the drive position

:::warning
Nothing checks that the `WithdrawalConfig` points at the accounts drive. The contracts and the Cartesi Rollups CLI only check that the drive described by the config fits in machine memory. A config with a wrong start index or wrong sizes deploys without error, but every proof and withdrawal then reads whatever machine memory the config selects: withdrawals can become impossible, or pay out amounts that are not real balances. Check the config against the template before you deploy.
:::

In the template's `config.json` (the stored machine directory, `.cartesi/image/config.json` for a `cartesi build`), one entry of the `config.flash_drive` list must satisfy both:

- `start` equals `accountsDriveStartIndex << (5 + log2MaxNumOfAccounts + log2LeavesPerAccount)`; and
- `length` is at least `2^(5 + log2MaxNumOfAccounts + log2LeavesPerAccount)`.

The machine tool applies the same rule when it looks for the accounts drive in a snapshot, so with a config that fails this check it cannot generate proofs either.

With the drive declared and sized, the guest fills it with balance records, as described next.

## Keeping the balances

You rarely need to write the drive by hand. A ledger library can maintain the accounts drive for you: it credits deposits, debits withdrawals and transfers, and stores every balance in the drive so it stays provable from the machine state. The Cartesi Machine Assets library (CMA), [machine-asset-tools](https://github.com/Mugen-Builders/machine-asset-tools/tree/v0.1.0-alpha.11), provides such a ledger: its single-asset ledger (Ether or one ERC-20 token) stores balances in the 32-byte layout above.

:::caution
Use machine-asset-tools v0.1.0-alpha.9 or later. Earlier versions write the 8-byte balance layout, which rollups-contracts v3.0.0-alpha.7 and later decode incorrectly (see [Matching the layout](#matching-the-layout)).
:::

## The account encoding must round-trip

The bytes the guest writes for an account must be the same bytes the on-chain [withdrawal output builder](../contracts/withdrawal/iwithdrawal-output-builder.md) decodes at withdrawal time. For the USD builder, that means the `(owner, balance)` encoding the guest produces must match what the builder reads back to build the transfer: you can test your encoder against [`LibUsdAccount`](https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/library/LibUsdAccount.sol)'s `encode` and `decode`.

:::note
Emergency withdrawal relies on four descriptions of the accounts drive agreeing: the layout the **guest** writes, the **`WithdrawalConfig`** on-chain, the parameters used to **generate proofs** off-chain, and the account encoding the **output builder** decodes. Choose these together at deploy time. See [Withdrawal Contracts Overview](../contracts/withdrawal/overview.md#the-four-way-agreement).
:::
