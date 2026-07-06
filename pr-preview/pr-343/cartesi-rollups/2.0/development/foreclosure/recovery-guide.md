> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: recovery-guide
title: Emergency Withdrawal Recovery Guide
---

This guide walks through foreclosing an application and withdrawing an account's funds directly from the base-layer contracts. For the concepts behind each step, see [Foreclosure & Emergency Withdrawal](./overview.md) and the [Claim & Foreclosure Lifecycle](./lifecycle.md).

## Before you start

You need:

- an application that was deployed with a [`WithdrawalConfig`](../../api-reference/contracts/withdrawal/withdrawal-config.md), and that has reached at least one accepted epoch;
- the **guardian** key (only the guardian can foreclose);
- the [`cartesi-rollups-cli`](../installation.md) and the **machine tool** (`cartesi-rollups-machine-tool`), which reproduces the settled machine state and generates the proofs;
- the application's **accounts-drive parameters** from its withdrawal config: `accountsDriveStartIndex`, `log2MaxNumOfAccounts`, and `log2LeavesPerAccount`. These must match the values the application was deployed with.

## Step 1: Foreclose the application

Signed by the guardian, freeze the application:

```sh
cartesi-rollups-cli foreclose <app-name-or-address> --yes
```

After this, `isForeclosed()` returns `true` and the application is frozen at its last accepted epoch.

## Step 2: Reproduce the settled machine state

Find the last accepted epoch, then replay the node database into a machine snapshot up to that epoch:

```sh
cartesi-rollups-machine-tool replay \
  --template <template-path> \
  --application <app-name-or-address> \
  --to-epoch <accepted-epoch-index> \
  --store replay-snapshot
```

Replay is deterministic: running it again produces the same machine state, so anyone can reproduce this snapshot independently.

## Step 3: Generate the proofs

From that snapshot, generate the accounts-drive-root proof and the per-account proof for the account you want to withdraw. The `--accounts-drive-*` values **must match the withdrawal config**.

```sh
cartesi-rollups-machine-tool prove accounts-drive \
  --snapshot replay-snapshot \
  --accounts-drive-start-index <accountsDriveStartIndex> \
  --log2-max-num-of-accounts <log2MaxNumOfAccounts> \
  --log2-leaves-per-account <log2LeavesPerAccount> \
  --account <account-address> \
  --out-drive-root-proof drive-root-proof.json \
  --out-withdraw-proof account-proof.json
```

This writes two files: `drive-root-proof.json` (used once, in step 4) and `account-proof.json` (used per account, in step 5).

## Step 4: Anchor the accounts-drive root on-chain

Record the accounts-drive root against the settled machine state. This is permissionless and only needs to happen once per foreclosed application:

```sh
cartesi-rollups-cli prove-drive-root <app-name-or-address> \
  --proof-file drive-root-proof.json --yes
```

On success the contract stores the root and emits `AccountsDriveMerkleRootProved`. Anchoring a root from the wrong epoch, or from a different application, is rejected.

## Step 5: Withdraw the account's funds

With the root anchored, withdraw the account:

```sh
cartesi-rollups-cli withdraw <app-name-or-address> \
  --proof-file account-proof.json --yes
```

The contract validates the account against the anchored root, builds and runs the transfer, marks the account as withdrawn, and emits a `Withdrawal` event. Withdrawing the same account again is rejected.

## Step 6: Verify

```sh
# the node indexes the on-chain Withdrawal event
cartesi-rollups-cli read withdrawals <app-name-or-address>
```

You can also read the on-chain state directly: [`wereAccountFundsWithdrawn(accountIndex)`](../../api-reference/contracts/application.md#wereaccountfundswithdrawn) returns `true`, and the token balance has moved from the application contract to the account owner.
