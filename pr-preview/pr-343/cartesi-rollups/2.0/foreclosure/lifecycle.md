> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: lifecycle
title: Claim & Foreclosure Lifecycle
---

To understand foreclosure, it helps to first see how an application's inputs turn into settled state, and where foreclosure fits in. This page walks through that lifecycle.

## From inputs to a settled claim

**Inputs.** A user action (a deposit through a portal, or a message sent to the app) becomes an **input**, recorded on-chain in the [`InputBox`](../api-reference/contracts/input-box.md).

**Epochs.** Inputs are not settled one at a time. They are grouped into **epochs**, where an epoch is a fixed range of blocks (set by the consensus `epochLength`). Every input is assigned to an epoch by the block it arrived in.

**Claims.** The application runs as a deterministic Cartesi Machine. Once an epoch's block range closes, the node feeds that epoch's inputs to the machine, which updates its state and produces outputs. The node then reduces the result to a single fingerprint, a **claim** (a Merkle root), and posts it on-chain so the consensus contract can trust the off-chain computation by checking one hash.

Posting a claim happens in **two transactions**, both sent by the operator:

1. **Submit** (`submitClaim`) posts the claim. The epoch becomes `CLAIM_STAGED`.
2. **Accept** (`acceptClaim`) finalizes it, once a waiting period has passed. The epoch becomes `CLAIM_ACCEPTED`.

The waiting period between the two is the **claim staging period**, measured in blocks and fixed when the consensus is deployed. The consensus contract enforces it: `acceptClaim` reverts until enough blocks have passed. A staging period of `0` lets acceptance happen right away.

## The epoch status flow

An epoch moves through these statuses:

```text
OPEN ──▶ INPUTS_PROCESSED ──▶ CLAIM_COMPUTED ──▶ CLAIM_STAGED ──▶ CLAIM_ACCEPTED
 │            (machine ran        (claim/root       (submitted        (finalized
 │             the inputs)         computed)         on-chain,         on-chain)
 │                                                   waiting)
 │                                                       │
 └───────────────────────  if the app is foreclosed  ───┴──▶ CLAIM_FORECLOSED
```

- **OPEN**: the epoch's block range is still current and collecting inputs.
- **INPUTS_PROCESSED**: the range closed and the machine processed the inputs.
- **CLAIM_COMPUTED**: the node has the claim ready.
- **CLAIM_STAGED**: the claim was submitted on-chain and is in its staging window.
- **CLAIM_ACCEPTED**: the staging period elapsed and the claim was finalized. This is the settled state that outputs (and emergency withdrawal) rely on.
- **CLAIM_FORECLOSED**: a terminal status a claim reaches if the application is foreclosed before that claim finalizes (see below).

## Foreclosure

Everything above assumes the operator keeps running the node. Foreclosure is what happens when you no longer want to depend on that.

The **guardian** calls [`foreclose()`](../api-reference/contracts/application.md#foreclose). This freezes the application: [`isForeclosed()`](../api-reference/contracts/application.md#isforeclosed) becomes `true` and stays `true`. Foreclosure has three effects on claims:

- **Accepted history is kept.** An epoch that already reached `CLAIM_ACCEPTED` stays accepted. Foreclosure does not rewrite settled history.
- **In-flight claims are cancelled.** A claim that has not finalized cannot finalize once the operator's authority is frozen, so the node marks it terminal as `CLAIM_FORECLOSED` instead of leaving it stuck. This happens whether the claim was still pre-staging (`CLAIM_COMPUTED`) or already `CLAIM_STAGED`.
- **The state is frozen.** The application settles at its last accepted epoch, a final state that anyone can reproduce on their own.

## After foreclosure: prove and withdraw

Once frozen, the accounts drive (the in-app balance ledger inside the machine state) at the last settled epoch is the source of truth for balances. Turning that into on-chain payouts takes two on-chain steps:

1. **Anchor the ledger.** Anyone calls [`proveAccountsDriveMerkleRoot()`](../api-reference/contracts/application.md#proveaccountsdrivemerkleroot) once, proving the accounts-drive root against the settled machine state. The contract stores it.
2. **Withdraw per account.** Each user calls [`withdraw()`](../api-reference/contracts/application.md#withdraw) with their account and a Merkle proof. The contract validates the account against the anchored root, builds a transfer output, runs it, and marks the account as withdrawn so it cannot be withdrawn twice.

The [Emergency Withdrawal Recovery Guide](./recovery-guide.md) turns these steps into concrete commands.
