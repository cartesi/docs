---
id: overview
title: Foreclosure & Emergency Withdrawal
---

When users deposit assets into a Cartesi Rollups application, those assets are held by the application contract on the base layer, and the application's off-chain state (an in-app ledger of who owns what) decides how they can be spent. In normal operation the operator runs a node that keeps this state moving and settles it on-chain. But what happens to those funds if the operator stops running the node?

**Foreclosure and emergency withdrawal** are the answer. They let a designated **guardian** freeze an application, after which any user can withdraw their in-app balance straight from the base-layer contracts by proving their account, with **no running node required**.

The feature is opt-in: an application only supports it if it was deployed with a [`WithdrawalConfig`](../api-reference/contracts/withdrawal/withdrawal-config.md). Applications deployed without one behave exactly as before.

## The two parts

**Foreclosure** freezes the application. A guardian address, set in the withdrawal config, calls [`foreclose()`](../api-reference/contracts/application.md#foreclose). From that moment the application is frozen at its last settled state, and it stays frozen forever. See [FOR-005](../api-reference/contracts/application.md#foreclose) for the guardian-only rule.

**Emergency withdrawal** is the recovery path that foreclosure unlocks. The application's **accounts drive** (the in-app balance ledger, held inside the machine state) is proved on-chain once, and then each user withdraws their own balance by proving their account against that proved ledger. Everything happens directly against the contracts, so it keeps working even if the operator and its node are gone.

## What you are trusting

This is important to understand before relying on the feature.

An application is settled by a **consensus** contract. With an [`Authority`](../api-reference/contracts/consensus/authority/authority.md) consensus (a single operator), the operator is **trusted to settle honest state**. The contracts do not re-run the machine, so they accept whatever state the operator finalizes.

:::warning
Foreclosure protects you against an operator who **disappears**, not against one who **lies**. Emergency withdrawal faithfully pays out whatever state was finalized. If a dishonest Authority operator settles a state that omits a deposit, that deposit is not recoverable through this path. Trust-minimized consensus models (such as Quorum or dispute-based settlement) reduce this risk by not relying on a single operator's honesty.
:::

## When funds are recoverable

All of the following must hold:

1. the application was deployed with a valid [`WithdrawalConfig`](../api-reference/contracts/withdrawal/withdrawal-config.md) (a guardian, an accounts-drive layout, and a withdrawal output builder);
2. the guest application actually maintains the [accounts drive](../api-reference/backend/emergency-withdrawal.md) in the layout the config describes;
3. the application has been **foreclosed** by its guardian; and
4. the account's balance was part of the last settled state.

## Where to go next

- [Claim & Foreclosure Lifecycle](./lifecycle.md) explains how inputs become settled state, and how foreclosure fits into that lifecycle.
- [Emergency Withdrawal Recovery Guide](./recovery-guide.md) is the step-by-step procedure for foreclosing and withdrawing.
- The [Application](../api-reference/contracts/application.md#guardian--foreclosure) and [Withdrawal](../api-reference/contracts/withdrawal/overview.md) contract pages are the on-chain reference.
