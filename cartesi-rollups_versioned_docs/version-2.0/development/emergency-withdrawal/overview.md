---
id: overview
title: Overview
---

When users deposit assets into a Cartesi Rollups application, those assets are held by the application contract on the base layer, and the application's off-chain state (an in-app ledger of who owns what) decides how they can be spent. In normal operation the operator runs a node that keeps this state moving and settles it on-chain. But what happens to those funds if the operator stops running the node?

**Foreclosure and emergency withdrawal** are the answer. They let a designated **guardian** freeze an application, after which any user can withdraw their in-app balance straight from the base-layer contracts by proving their account, **without depending on the operator or its node**. Deposits that were not yet settled when the application was frozen are returned through a second path, **deposit refunds**.

The feature is opt-in: an application only supports it if it was deployed with a [`WithdrawalConfig`](../../api-reference/contracts/withdrawal/withdrawal-config.md). Applications deployed without one behave exactly as before. In addition to that, the application must keep the balances users can withdraw in its accounts drive, in the provable layout that the `WithdrawalConfig` and its withdrawal output builder expect. A ledger library can do this for you: the single-asset ledger of the Cartesi Machine Assets library (CMA), [machine-asset-tools](https://github.com/Mugen-Builders/machine-asset-tools/tree/v0.1.0-alpha.11), writes that layout from version v0.1.0-alpha.9 on. See [Emergency Withdrawal (guest requirements)](../../api-reference/backend/emergency-withdrawal.md) for the layout.

## The two parts

**Foreclosure** freezes the application. A guardian address, set in the withdrawal config, calls [`foreclose()`](../../api-reference/contracts/application.md#foreclose). From that moment the application is frozen at its last settled state, and it stays frozen forever. Only the guardian can foreclose, and an application can be foreclosed only once.

**Emergency withdrawal** is the recovery path that foreclosure unlocks, and it is built on the application's **accounts drive**.

The accounts drive is a dedicated [drive](../advanced-configuration.md#drives), a region of the Cartesi Machine's memory, that the application uses as its balance ledger. It records how much each account owns, in a fixed layout described by the [`WithdrawalConfig`](../../api-reference/contracts/withdrawal/withdrawal-config.md). Like every drive, it sits at a known, fixed address in the machine's memory.
The machine's whole memory is a single Merkle tree whose root, the machine state root hash, is finalized on-chain as part of the settled claim. Because the accounts drive occupies a known address, its own Merkle root is a fixed branch of that tree, so it can be proven up to the machine state root hash with a short list of sibling hashes. After foreclosure, anyone submits that proof once to anchor the accounts-drive root on-chain against the application's last settled machine state (or against its template hash, if no state was ever settled). The ledger is then fixed on-chain, and each user withdraws their own balance by proving their account against that anchored drive. The on-chain steps go directly against the contracts, so they keep working even if the operator and its node are gone. Generating the proofs is different: the proof tool reads the application's inputs from a Cartesi Rollups Node database. If the operator's node is gone, anyone can run their own node as a reader to rebuild that database from the chain (see the [recovery guide](./recovery-guide.md#before-you-start)).

## When funds are recoverable

After foreclosure, users have two exits, and they cover different funds.

**Emergency withdrawal** pays out a balance recorded in the accounts drive. All of the following must hold:

1. the application was deployed with a valid [`WithdrawalConfig`](../../api-reference/contracts/withdrawal/withdrawal-config.md) (a guardian, an accounts-drive layout, and a withdrawal output builder);
2. the guest application actually maintains the [accounts drive](../../api-reference/backend/emergency-withdrawal.md) in the layout the config describes;
3. the application has been **foreclosed** by its guardian; and
4. the account's balance is in the accounts drive of the last settled state.

**Deposit refund** returns a portal deposit (Ether, ERC-20, ERC-721, or ERC-1155) whose input was never finalized, for example one added in the epoch that was still open, or still being settled, when the application was foreclosed. Once the application is foreclosed, anyone can call [`issueRefund()`](../../api-reference/contracts/application.md#issuerefund) for such a deposit, and the asset goes back to the original depositor. Refunds are not automatic: someone has to send one transaction per deposit (see [step 7 of the recovery guide](./recovery-guide.md#step-7-refund-unfinalized-deposits)).

Both exits need the application to be foreclosed, so both need a guardian. Some funds are covered by neither:

- a deposit that was finalized, but that the application had not credited to the accounts drive by the last settled state;
- anything sent to the application other than a portal deposit;
- any balance in an application without an accounts drive, or without a guardian.

Outputs, such as vouchers, of epochs accepted before the foreclosure can still be executed as usual.

## Where to go next

- [Claim & Foreclosure Lifecycle](./lifecycle.md) explains how inputs become settled state, and how foreclosure fits into that lifecycle.
- [Emergency Withdrawal Recovery Guide](./recovery-guide.md) is the step-by-step procedure for foreclosing, withdrawing, and refunding unfinalized deposits.
- The [Application](../../api-reference/contracts/application.md#guardian--foreclosure) and [Withdrawal](../../api-reference/contracts/withdrawal/overview.md) contract pages are the on-chain reference.
