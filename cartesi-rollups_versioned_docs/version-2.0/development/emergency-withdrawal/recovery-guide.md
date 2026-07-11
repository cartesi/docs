---
id: recovery-guide
title: Emergency Withdrawal Recovery Guide
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide walks through foreclosing an application and withdrawing an account's funds directly from the base-layer contracts. For the concepts behind each step, see [Foreclosure & Emergency Withdrawal](./overview.md) and the [Claim & Foreclosure Lifecycle](./lifecycle.md).

## Before you start

You need:

- An application that was deployed with a [`WithdrawalConfig`](../../api-reference/contracts/withdrawal/withdrawal-config.md), and that has reached at least one accepted epoch;
- The **guardian** key (only the guardian can foreclose);
- The **machine tool** (`cartesi-rollups-machine-tool`), which reproduces the settled machine state and generates the proofs;
- To send the on-chain transactions, either the **`cartesi-rollups-cli`** (see [Installing the required tools](./installation-guide.md)) or, if you prefer, **Foundry's `cast`** with `jq`;
- The application's **accounts-drive parameters** from its withdrawal config: `accountsDriveStartIndex`, `log2MaxNumOfAccounts`, and `log2LeavesPerAccount`. These must match the values the application was deployed with.
- This should be done in the same environment of the node, with access to the database (and configuration variables)

This guide assumes the application already maintains its accounts drive in the layout its `WithdrawalConfig` describes. For how that drive is created, sized, and kept, see [Emergency Withdrawal (guest requirements)](../../api-reference/backend/emergency-withdrawal.md), and in particular [Creating the accounts drive](../../api-reference/backend/emergency-withdrawal.md#creating-the-accounts-drive).

The on-chain steps (1, 4, 5, and 6) can be run with either tool. Choose a tab in each step, and it applies to the others. Steps 2 and 3 use the machine tool either way. In the `cast` tabs, `<app-address>` is the application contract address, `<rpc-url>` is your node RPC endpoint, and the private key is the guardian's (step 1) or your own (steps 4 and 5).

## Step 1: Foreclose the application

Signed by the guardian, freeze the application:

<Tabs groupId="recovery-tool">
<TabItem value="cli" label="Cartesi CLI" default>

```sh
cartesi-rollups-cli foreclose <app-name-or-address>
```

</TabItem>
<TabItem value="cast" label="cast">

```sh
cast send <app-address> 'foreclose()' \
  --private-key <guardian-key> --rpc-url <rpc-url>
```

</TabItem>
</Tabs>

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

This writes two files: `drive-root-proof.json` (used once, in step 4) and `account-proof.json` (used per account, in step 5). The `cast` tabs below read their arguments out of these files with `jq`.

## Step 4: Anchor the accounts-drive root on-chain

Record the accounts-drive root against the settled machine state. This is permissionless and only needs to happen once per foreclosed application:

<Tabs groupId="recovery-tool">
<TabItem value="cli" label="Cartesi CLI" default>

```sh
cartesi-rollups-cli prove-drive-root <app-name-or-address> \
  --proof-file drive-root-proof.json
```

</TabItem>
<TabItem value="cast" label="cast">

```sh
ROOT=$(jq -r '.accounts_drive_merkle_root' drive-root-proof.json)
PROOF=$(jq -rc '.proof | join(",")' drive-root-proof.json)

cast send <app-address> 'proveAccountsDriveMerkleRoot(bytes32,bytes32[])' "$ROOT" "[$PROOF]" \
  --private-key <your-key> --rpc-url <rpc-url>
```

</TabItem>
</Tabs>

On success the contract stores the root and emits `AccountsDriveMerkleRootProved`. Anchoring a root from the wrong epoch, or from a different application, is rejected.

## Step 5: Withdraw the account's funds

With the root anchored, withdraw the account:

<Tabs groupId="recovery-tool">
<TabItem value="cli" label="Cartesi CLI" default>

```sh
cartesi-rollups-cli withdraw <app-name-or-address> \
  --proof-file account-proof.json
```

</TabItem>
<TabItem value="cast" label="cast">

```sh
ACCT=$(jq -r '.account' account-proof.json)
IDX=$(jq -r '.account_index' account-proof.json)
SIBS=$(jq -rc '.account_root_siblings | join(",")' account-proof.json)

cast send <app-address> 'withdraw(bytes,(uint64,bytes32[]))' "$ACCT" "($IDX,[$SIBS])" \
  --private-key <your-key> --rpc-url <rpc-url>
```

</TabItem>
</Tabs>

The contract validates the account against the anchored root, builds and runs the transfer, marks the account as withdrawn, and emits a `Withdrawal` event. Withdrawing the same account again is rejected.

## Step 6: Verify

<Tabs groupId="recovery-tool">
<TabItem value="cli" label="Cartesi CLI" default>

```sh
# the node indexes the on-chain Withdrawal event
cartesi-rollups-cli read withdrawals <app-name-or-address>
```

</TabItem>
<TabItem value="cast" label="cast">

```sh
# read the on-chain flag directly (account index from account-proof.json)
cast call <app-address> 'wereAccountFundsWithdrawn(uint256)(bool)' <account-index> \
  --rpc-url <rpc-url>
```

</TabItem>
</Tabs>

Either way, [`wereAccountFundsWithdrawn(accountIndex)`](../../api-reference/contracts/application.md#wereaccountfundswithdrawn) returns `true`, and the token balance has moved from the application contract to the account owner.
