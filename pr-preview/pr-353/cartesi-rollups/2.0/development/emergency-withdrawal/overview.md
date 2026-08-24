> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: overview
title: Overview
---

When users deposit assets into a Cartesi Rollups application, those assets are held by the application contract on the base layer, and the application's off-chain state (an in-app ledger of who owns what) decides how they can be spent. In normal operation the operator runs a node that keeps this state moving and settles it on-chain. But what happens to those funds if the operator stops running the node?

**Foreclosure and emergency withdrawal** are the answer. They let a designated **guardian** freeze an application, after which any user can withdraw their in-app balance straight from the base-layer contracts by proving their account. After foreclosure, payouts do not depend on the operator continuing to advance the application; generating the proofs still needs the accepted inputs (typically from the node database or an equivalent archive). See the [recovery guide](./recovery-guide.md).

The feature is opt-in: an application only supports it if it was deployed with a [`WithdrawalConfig`](../../api-reference/contracts/withdrawal/withdrawal-config.md). Applications deployed without one behave exactly as before. In addition to that, the application is also expected to record the assets deposited into it using the CMA ledger library. This library keeps those balances inside the accounts drive in a recoverable, provable layout that matches the `WithdrawalConfig`. See the [Asset Management Library](https://cartesi.github.io/docs/pr-preview/pr-303/cartesi-rollups/2.0/api-reference/asset-management/overview/) section for more details about the CMA library. 

## The two parts

**Foreclosure** freezes the application. A guardian address, set in the withdrawal config, calls [`foreclose()`](../../api-reference/contracts/application.md#foreclose). From that moment the application is frozen at its last settled state, and it stays frozen forever. Only the configured guardian can call `foreclose()`; any other signer reverts with `NotGuardian`.

**Emergency withdrawal** is the recovery path that foreclosure unlocks, and it is built on the application's **accounts drive**.

The accounts drive is a dedicated [drive](../advanced-configuration.md#drives), a region of the Cartesi Machine's memory, that the application uses as its balance ledger. It records how much each account owns, in a fixed layout described by the [`WithdrawalConfig`](../../api-reference/contracts/withdrawal/withdrawal-config.md). Like every drive, it sits at a known, fixed address in the machine's memory.
The machine's whole memory is a single Merkle tree whose root, the machine state root hash, is finalized on-chain as part of the settled claim. Because the accounts drive occupies a known address, its own Merkle root is a fixed branch of that tree, so it can be proven up to the machine state root hash with a short list of sibling hashes. After foreclosure, anyone submits that proof once to anchor the accounts-drive root on-chain against the application's last settled machine state. The ledger is then fixed on-chain, and each user withdraws their own balance by proving their account against that anchored drive. Everything happens directly against the contracts, so it keeps working even if the operator and its node are gone.

## When funds are recoverable

All of the following must hold:

1. the application was deployed with a valid [`WithdrawalConfig`](../../api-reference/contracts/withdrawal/withdrawal-config.md) (a guardian, an accounts-drive layout, and a withdrawal output builder);
2. the guest application actually maintains the [accounts drive](../../api-reference/backend/emergency-withdrawal.md) in the layout the config describes;
3. the application has been **foreclosed** by its guardian; and
4. the account's balance was part of the last settled state.

## Where to go next

- [Claim & Foreclosure Lifecycle](./lifecycle.md) explains how inputs become settled state, and how foreclosure fits into that lifecycle.
- [Emergency Withdrawal Recovery Guide](./recovery-guide.md) is the step-by-step procedure for foreclosing and withdrawing.
- The [Application](../../api-reference/contracts/application.md#guardian--foreclosure) and [Withdrawal](../../api-reference/contracts/withdrawal/overview.md) contract pages are the on-chain reference.
