---
id: overview
title: Overview
---

When users deposit assets into a Cartesi Rollups application, those assets are held by the application contract on the base layer, and the application's off-chain state (an in-app ledger of who owns what) decides how they can be spent. In normal operation the operator runs a node that keeps this state moving and settles it on-chain. But what happens to those funds if the operator stops running the node?

**Foreclosure and emergency withdrawal** are the answer. They let a designated **guardian** freeze an application, after which any user can withdraw their in-app balance straight from the base-layer contracts by proving their account, with **no running node required**.

The feature is opt-in: an application only supports it if it was deployed with a [`WithdrawalConfig`](../../api-reference/contracts/withdrawal/withdrawal-config.md). Applications deployed without one behave exactly as before. In addition to that, the application is also expected to record the assets deposited into it using the CMA ledger library. This library keeps those balances inside the accounts drive in a recoverable, provable layout that matches the `WithdrawalConfig`. See the [Asset Management Library](https://cartesi.github.io/docs/pr-preview/pr-303/cartesi-rollups/2.0/api-reference/asset-management/overview/) section for more details about the CMA library. 

## The two parts

**Foreclosure** freezes the application. A guardian address, set in the withdrawal config, calls [`foreclose()`](../../api-reference/contracts/application.md#foreclose). From that moment the application remains foreclosed permanently. Claims can no longer be submitted or accepted.

**Emergency withdrawal** is the recovery path that foreclosure unlocks, and it is built on the application's **accounts drive**.

The accounts drive is a dedicated [drive](../advanced-configuration.md#drives), a region of Cartesi Machine memory that the application uses as its balance ledger. It records how much each account owns in a fixed layout described by the [`WithdrawalConfig`](../../api-reference/contracts/withdrawal/withdrawal-config.md). Every account record must place its owner address in the final 20 bytes.

The machine's memory forms a Merkle tree whose root is finalized on-chain when a claim is accepted. Because the accounts drive occupies a known address, its root can be proved against that finalized machine root. After foreclosure, anyone anchors the accounts-drive root once, then each user proves and withdraws one account.

If no claim was ever accepted, the Application uses its template hash. Recovery therefore starts from the initial machine state, provided its accounts drive was configured and populated consistently at deployment.

## When funds are recoverable

All of the following must hold:

1. the application was deployed with a valid [`WithdrawalConfig`](../../api-reference/contracts/withdrawal/withdrawal-config.md) (a guardian, an accounts-drive layout, and a withdrawal output builder);
2. the guest application actually maintains the [accounts drive](../../api-reference/backend/emergency-withdrawal.md) in the layout the config describes;
3. the application has been **foreclosed** by its guardian; and
4. the account's balance was part of the last accepted state, or the initial template state when no claim was accepted; and
5. the account record ends with the owner's 20-byte address and can be decoded by the configured withdrawal builder.

Assets from deposit inputs that were not finalized are not part of this accounts-drive balance. Recover those assets through [deposit refunds](../../api-reference/contracts/refund/overview.md).

## Where to go next

- [Claim & Foreclosure Lifecycle](./lifecycle.md) explains how inputs become settled state, and how foreclosure fits into that lifecycle.
- [Emergency Withdrawal Recovery Guide](./recovery-guide.md) is the step-by-step procedure for foreclosing and withdrawing.
- The [Application](../../api-reference/contracts/application.md#guardian-and-foreclosure) and [Withdrawal](../../api-reference/contracts/withdrawal/overview.md) pages are the on-chain reference.
