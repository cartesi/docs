> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: overview
title: Overview
---

These contracts power **emergency withdrawal**: the ability for users to recover finalized in-app balances from the base layer after an Application is [foreclosed](../application.md#guardian-and-foreclosure), without a running node. For the concept and operator procedure, see [Foreclosure and emergency withdrawal](../../../development/emergency-withdrawal/overview.md).

## How the pieces fit together

The withdrawal machinery lives partly on the [`Application`](../application.md) contract and partly in a small set of supporting contracts:

| Piece | Where | Role |
|-------|-------|------|
| Foreclosure and withdrawal logic | [`IApplication`](../application.md) | `foreclose`, `proveAccountsDriveMerkleRoot`, `withdraw`, and the account views |
| [`WithdrawalConfig`](./withdrawal-config.md) | passed to the `Application` constructor | Guardian, accounts-drive geometry, and the output builder to use |
| [`IWithdrawalOutputBuilder`](./iwithdrawal-output-builder.md) | referenced by the config | Turns an account into a withdrawal output (static-called during `withdraw`) |
| [`UsdWithdrawalOutputBuilder`](./usd-withdrawal-output-builder.md) and [factory](./usd-withdrawal-output-builder-factory.md) | one per ERC-20 token | The single-ERC-20 builder; emits a `DelegateCallVoucher` to a shared `SafeErc20Transfer` |

## The withdrawal flow, on-chain

1. The guardian calls [`foreclose()`](../application.md#foreclose), freezing the Application against further claim submission or acceptance.
2. Anyone calls [`proveAccountsDriveMerkleRoot()`](../application.md#proveaccountsdrivemerkleroot) once, anchoring the accounts-drive root against the last finalized machine state. If no claim was accepted, the initial template state is used.
3. Each user calls [`withdraw(account, proof)`](../application.md#withdraw). The Application validates the account against the anchored root, **static-calls** the configured output builder to build the transfer output, executes it, and marks the account withdrawn (single-use).

## The four-way agreement

Emergency withdrawal only works if four descriptions of the **accounts drive** agree:

1. the **guest application** writes account records with the expected size and places the owner address in the final 20 bytes;
2. the [`WithdrawalConfig`](./withdrawal-config.md) (`log2LeavesPerAccount`, `log2MaxNumOfAccounts`, `accountsDriveStartIndex`) matches that layout;
3. the **proofs** generated off-chain (via the machine tool) use those same parameters; and
4. the **output builder** decodes the account encoding the guest produced.

If any of the four disagree, proofs fail to validate or funds cannot be built, so these values must be chosen together at deploy time. See [drive geometry](./withdrawal-config.md#drive-geometry).

Deposit refunds cover a separate case: assets transferred by inputs that were never finalized. See [Deposit refunds](../refund/overview.md) for that recovery path.
