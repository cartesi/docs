---
id: recovery-guide
title: Emergency Withdrawal Recovery Guide
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide walks through foreclosing an application, withdrawing an account's funds directly from the base-layer contracts, and refunding deposits that were never finalized. For the concepts behind each step, see [Foreclosure & Emergency Withdrawal](./overview.md) and the [Claim & Foreclosure Lifecycle](./lifecycle.md).

## Before you start

You need:

- An application that was deployed with a [`WithdrawalConfig`](../../api-reference/contracts/withdrawal/withdrawal-config.md);
- The **guardian** key (only the guardian can foreclose);
- The **machine tool** (`cartesi-rollups-machine-tool`), which reproduces the settled machine state and generates the proofs;
- To send the on-chain transactions, either the **`cartesi-rollups-cli`** (see [Installing the required tools](./installation-guide.md)) or, if you prefer, **Foundry's `cast`** with `jq`;
- The application's **accounts-drive parameters** from its withdrawal config: `accountsDriveStartIndex`, `log2MaxNumOfAccounts`, and `log2LeavesPerAccount`. These must match the values the application was deployed with.
- The application's **machine template** (the stored machine its template hash was computed from), and the emulator version it was built with;
- Access to a **Cartesi Rollups Node database** that holds the application's inputs. `replay` (step 2) reads the inputs from the node's PostgreSQL database, given with `--database-connection` or the `CARTESI_DATABASE_CONNECTION` variable; it cannot rebuild them from the chain. If you cannot use the operator's node database, run your own node in reader mode (`CARTESI_FEATURE_CLAIM_SUBMISSION_ENABLED=false`) with the application registered (`cartesi-rollups-cli app register`, with `--prt` for a PRT application), and let it index and process the application's inputs up to the last accepted epoch.

Only the proof generation (steps 2 and 3) needs that database. The on-chain steps need nothing but the contracts and an RPC endpoint; without a node database, pass the application's address, not its name, to `cartesi-rollups-cli`.

If no epoch of the application was ever accepted, the drive root is proven against the application's template hash, so the balances are those of the template, normally none. In that case there is usually nothing to withdraw, and deposits are returned with refunds (step 7).

This guide assumes the application already maintains its accounts drive in the layout its `WithdrawalConfig` describes. For how that drive is created, sized, and kept, see [Emergency Withdrawal (guest requirements)](../../api-reference/backend/emergency-withdrawal.md), and in particular [Creating the accounts drive](../../api-reference/backend/emergency-withdrawal.md#creating-the-accounts-drive).

The on-chain steps (1, 4, 5, 6, and 7) can be run with either tool. Choose a tab in each step, and it applies to the others. Steps 2 and 3 use the machine tool either way. In the `cast` tabs, `<app-address>` is the application contract address, `<rpc-url>` is your base-layer RPC endpoint, and the private key is the guardian's (step 1) or your own (steps 4, 5, and 7).

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

Find the last accepted epoch, then replay the inputs from the node database into a machine snapshot up to that epoch:

```sh
cartesi-rollups-machine-tool replay \
  --template <template-path> \
  --application <app-name-or-address> \
  --to-epoch <accepted-epoch-index> \
  --database-connection <node-database-url> \
  --store replay-snapshot
```

`--database-connection` can be left out when `CARTESI_DATABASE_CONNECTION` is set. Replay is deterministic: running it again produces the same machine state, so anyone with the application's inputs can reproduce this snapshot independently.

`replay` prints a JSON summary whose `machine_root` is the root of the new snapshot. Before going on, compare it with the root the application proves against. Read that root from the chain rather than from the node's epoch status:

```sh
CONSENSUS=$(cast call <app-address> 'getOutputsMerkleRootValidator()(address)' --rpc-url <rpc-url>)
cast call "$CONSENSUS" 'getLastFinalizedMachineMerkleRoot(address)(bytes32)' <app-address> --rpc-url <rpc-url>
```

If the two differ, step 4 will revert: check the `--to-epoch` value and replay again. If the consensus returns zero, no epoch was ever accepted (see [Before you start](#before-you-start)).

:::note PRT applications
For an application that uses PRT (Dave) consensus, `replay` runs a Lua script. It needs Lua 5.4 (`--lua`, default `lua5.4`) and the emulator's Lua modules (`--cartesi-sdk-root`, detected from the `cartesi-machine` installation when left out). See [Lua 5.4 (PRT applications only)](./installation-guide.md#lua-54-prt-applications-only).
:::

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

:::note What the machine tool supports
`prove accounts-drive` (Cartesi Rollups Node v2.0.0-alpha.14) handles one accounts-drive layout:

- `log2LeavesPerAccount = 0`, so every account is a single 32-byte record (any other value fails with "unsupported accounts-drive layout");
- every record in the [USD layout](../../api-reference/backend/emergency-withdrawal.md#matching-the-layout): a 12-byte little-endian balance followed by the 20-byte owner, where an all-zero record is an empty slot;
- accounts packed from slot `0` with no gaps: a record that comes after the first empty slot is an error;
- `--account` selects the record by its owner address. If the same owner appears in more than one record, only the last one is proven.

The contracts accept other geometries and other output builders, but proving those needs your own tooling.
:::

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

On success the contract stores the root and emits `AccountsDriveMerkleRootProved`. Anchoring a root from the wrong epoch, or from a different application, is rejected (`InvalidMachineMerkleRoot`), and the root can only be anchored once (`AccountsDriveMerkleRootAlreadyProved`).

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

The contract validates the account against the anchored root, builds the transfer, marks the account as withdrawn, emits a `Withdrawal` event, and then runs the transfer. Withdrawing the same account again is rejected (`AccountFundsAlreadyWithdrawn`).

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

## Step 7: Refund unfinalized deposits

Emergency withdrawal only pays out balances that are in the settled accounts drive. A portal deposit whose input was never finalized, for example one added in the epoch that was still open, or still being settled, when the application was foreclosed, is returned separately with [`issueRefund()`](../../api-reference/contracts/application.md#issuerefund).

Refunds are not automatic: someone has to send one transaction per deposit. Anyone can pay the gas, and no replay or proof is needed. The asset always goes back to the original depositor recorded by the portal; the caller cannot choose another recipient.

`issueRefund` takes the application-wide input index and the complete input, exactly as the `InputBox` emitted it in its `InputAdded` event (not only the deposit payload). If a node has indexed the application, you can export it with the CLI:

```sh
cartesi-rollups-cli read inputs <app-name-or-address> <input-index> --jsonrpc \
  | jq -er '.data.raw_data' > deposit-input.hex
```

Then send the refund:

<Tabs groupId="recovery-tool">
<TabItem value="cli" label="Cartesi CLI" default>

```sh
cartesi-rollups-cli refund <app-name-or-address> <input-index> \
  --input-file deposit-input.hex
```

</TabItem>
<TabItem value="cast" label="cast">

```sh
cast send <app-address> 'issueRefund(uint256,bytes)' <input-index> "$(cat deposit-input.hex)" \
  --private-key <your-key> --rpc-url <rpc-url>
```

</TabItem>
</Tabs>

On success the contract emits `RefundIssued` and [`wasRefundForInputIssued(inputIndex)`](../../api-reference/contracts/application.md#wasrefundforinputissued) returns `true`. The node does not index refunds, so check them on-chain. The call reverts with:

- `CannotRefundFinalizedInput` if the input was finalized: the deposit is part of the settled state, so if the application credited it to the accounts drive, recover it with steps 2 to 5 instead;
- `RefundAlreadyIssued` if the deposit was already refunded;
- `UnknownInputSender` if the input is not a deposit made through one of the portals the refund output builder knows (Ether, ERC-20, ERC-721, and single and batch ERC-1155);
- `InvalidInputIndex` or `InvalidInputHash` if the index or the input bytes do not match what the `InputBox` recorded.

:::caution
If the depositor is a contract that cannot receive the asset back (for example, one without a `receive` function, or one that does not implement the ERC-721 or ERC-1155 receiver hooks), the refund reverts and that deposit may not be recoverable.
:::
