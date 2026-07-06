---
id: overview
title: Withdrawal Contracts Overview
---

These contracts power **emergency withdrawal**: the ability for users to recover their in-app balances straight from the base layer after an application is [foreclosed](../application.md#guardian--foreclosure), without a running node. For the concept and the operator procedure, see [Foreclosure & Emergency Withdrawal](../../../foreclosure/overview.md).

## How the pieces fit together

The withdrawal machinery lives partly on the [`Application`](../application.md) contract and partly in a small set of supporting contracts:

| Piece | Where | Role |
|-------|-------|------|
| Foreclosure + withdrawal logic | [`Application`](../application.md) (`IApplicationForeclosure`, `IApplicationWithdrawal`) | `foreclose`, `proveAccountsDriveMerkleRoot`, `withdraw`, and the account/getter views |
| [`WithdrawalConfig`](./withdrawal-config.md) | passed to the `Application` constructor | Guardian, accounts-drive geometry, and the output builder to use |
| [`IWithdrawalOutputBuilder`](./iwithdrawal-output-builder.md) | referenced by the config | Turns an account into a withdrawal output (static-called during `withdraw`) |
| [`UsdWithdrawalOutputBuilder`](./usd-withdrawal-output-builder.md) (+ [factory](./usd-withdrawal-output-builder-factory.md)) | one per ERC-20 token | The single-ERC-20 builder; emits a `DelegateCallVoucher` to a shared `SafeERC20Transfer` |

## The withdrawal flow, on-chain

1. The guardian calls [`foreclose()`](../application.md#foreclose) → the application is frozen at its last-finalized state.
2. Anyone calls [`proveAccountsDriveMerkleRoot()`](../application.md#proveaccountsdrivemerkleroot) once, anchoring the accounts-drive root against the finalized machine state.
3. Each user calls [`withdraw(account, proof)`](../application.md#withdraw). The Application validates the account against the anchored root, **static-calls** the configured output builder to build the transfer output, executes it, and marks the account withdrawn (single-use).

## The four-way agreement

Emergency withdrawal only works if four descriptions of the **accounts drive** agree:

1. the **guest application** actually writes account records with the layout it claims;
2. the [`WithdrawalConfig`](./withdrawal-config.md) (`log2LeavesPerAccount`, `log2MaxNumOfAccounts`, `accountsDriveStartIndex`) matches that layout;
3. the **proofs** generated off-chain (via the machine tool) use those same parameters; and
4. the **output builder** decodes the account encoding the guest produced.

If any of the four disagree, proofs fail to validate or funds cannot be built, so these values must be chosen together at deploy time. See [drive geometry](./withdrawal-config.md#drive-geometry).
