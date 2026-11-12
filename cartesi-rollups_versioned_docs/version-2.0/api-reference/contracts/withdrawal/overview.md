---
id: overview
title: Overview
---

These contracts power **emergency withdrawal**: the ability for users to recover their in-app balances straight from the base layer after an application is [foreclosed](../application.md#guardian--foreclosure), without the operator's node. For the concept and the operator procedure, see [Foreclosure & Emergency Withdrawal](../../../development/emergency-withdrawal/overview.md).

Deposits whose inputs were never finalized are not part of any settled balance. They are returned through a separate path, [deposit refunds](../application.md#issuerefund), described in the [recovery guide](../../../development/emergency-withdrawal/recovery-guide.md#step-7-refund-unfinalized-deposits).

## How the pieces fit together

The withdrawal machinery lives partly on the [`Application`](../application.md) contract and partly in a small set of supporting contracts:

| Piece | Where | Role |
|-------|-------|------|
| Foreclosure + withdrawal logic | [`Application`](../application.md) (`IApplication`) | `foreclose`, `proveAccountsDriveMerkleRoot`, `withdraw`, `issueRefund`, and the account/getter views |
| [`WithdrawalConfig`](./withdrawal-config.md) | passed to the `Application` constructor | Guardian, accounts-drive geometry, and the output builder to use |
| [`IWithdrawalOutputBuilder`](./iwithdrawal-output-builder.md) | referenced by the config | Turns an account into a withdrawal output (static-called during `withdraw`) |
| [`UsdWithdrawalOutputBuilder`](./usd-withdrawal-output-builder.md) (+ [factory](./usd-withdrawal-output-builder-factory.md)) | one per ERC-20 token | The single-ERC-20 builder; emits a `DelegateCallVoucher` to a shared `SafeErc20Transfer` |
| [`RefundOutputBuilder`](https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/refund/RefundOutputBuilder.sol) | one per `ApplicationFactory`, passed to every application it deploys | Turns an unfinalized portal deposit into an output that returns the asset to its depositor (static-called during `issueRefund`) |

## The withdrawal flow, on-chain

1. The guardian calls [`foreclose()`](../application.md#foreclose) → the application is frozen at its last-finalized state.
2. Anyone calls [`proveAccountsDriveMerkleRoot()`](../application.md#proveaccountsdrivemerkleroot) once, anchoring the accounts-drive root against the finalized machine state. The application reads that state from its consensus with `getLastFinalizedMachineMerkleRoot()`: the machine root of the latest accepted claim under Authority and Quorum, or the post-epoch machine state of the latest accepted tournament result under PRT (`DaveConsensus`). If no state has been finalized yet, the consensus returns zero and the application uses its template hash instead.
3. Each user calls [`withdraw(account, proof)`](../application.md#withdraw). The Application validates the account against the anchored root, **static-calls** the configured output builder to build the transfer output, marks the account withdrawn (single-use) and emits `Withdrawal`, and then executes the output.

Separately, once the application is foreclosed, anyone can call [`issueRefund(inputIndex, input)`](../application.md#issuerefund) for a portal deposit whose input was never finalized. The refund output builder returns the asset to the original depositor.

## The four-way agreement

Emergency withdrawal only works if four descriptions of the **accounts drive** agree:

1. the **guest application** actually writes account records with the layout it claims;
2. the [`WithdrawalConfig`](./withdrawal-config.md) (`log2LeavesPerAccount`, `log2MaxNumOfAccounts`, `accountsDriveStartIndex`) matches that layout, and points at the drive the template actually reserves for the ledger;
3. the **proofs** generated off-chain (via the machine tool) use those same parameters; and
4. the **output builder** decodes the account encoding the guest produced. Every encoding must end with the owner's 20-byte address.

If any of the four disagree, proofs fail to validate or funds cannot be built, so these values must be chosen together at deploy time. None of this is checked at deploy time: deployment only checks that the drive fits in machine memory (see [Validation](./withdrawal-config.md#validation) and [Checking the drive position](../../backend/emergency-withdrawal.md#checking-the-drive-position)). The machine tool also supports only one layout (single-leaf, 32-byte USD records); see the [recovery guide](../../../development/emergency-withdrawal/recovery-guide.md#step-3-generate-the-proofs). See [drive geometry](./withdrawal-config.md#drive-geometry).
