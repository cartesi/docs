> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: overview
title: Deposit refunds
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.9/src/refund
    title: Refund contracts
---

Deposit refunds let users recover assets from deposits that were not finalized before an Application was [foreclosed](../application.md#guardian-and-foreclosure).

A portal deposit performs two base-layer actions in one transaction:

1. it transfers the asset to the Application contract; and
2. it adds an input describing the deposit to the Application's input box.

The backend normally processes that input and records the asset in its application state. If the Application is foreclosed first, an unfinalized deposit may exist on the base layer without being reflected in the last finalized machine state. Refunding returns that asset to its original depositor.

## Refund lifecycle

1. The guardian forecloses the Application.
2. A caller obtains the complete encoded input and its index from the Application's input box events.
3. The caller submits both values to [`Application.issueRefund`](../application.md#issuerefund).
4. The Application verifies the input hash and encoding.
5. The outputs Merkle root validator confirms that the input was not finalized.
6. The [`RefundOutputBuilder`](./refund-output-builder.md) decodes the portal payload and builds an output returning the asset.
7. The Application records the refund, emits `RefundIssued`, and executes the output.

Anyone can submit the refund transaction. The asset always returns to the depositor encoded by the canonical portal, not to the transaction sender.

## Supported deposits

The standard refund builder supports deposits made through the following portals:

| Portal | Refunded asset | Output form |
| --- | --- | --- |
| `EtherPortal` | Ether | Voucher transferring Ether to the depositor |
| `Erc20Portal` | ERC-20 tokens | Delegate-call voucher using `SafeErc20Transfer` |
| `Erc721Portal` | One ERC-721 token | Voucher transferring the token from the Application |
| `Erc1155SinglePortal` | One ERC-1155 token type | Voucher transferring the deposited amount |
| `Erc1155BatchPortal` | A batch of ERC-1155 token types | Voucher transferring the deposited amounts |

Direct inputs and deposits from non-canonical portals cannot be refunded by the standard builder. They revert with `UnknownInputSender`.

## When a refund is unavailable

A refund fails when:

- the Application has not been foreclosed;
- the input was finalized;
- the same input was already refunded;
- the supplied input or index does not match the input box;
- the input is malformed or was not sent by a supported portal; or
- the generated asset transfer reverts.

Refunds to contract depositors require the contract to accept the returned asset. For example, a contract receiving Ether needs a payable receive path, and a contract receiving ERC-721 or ERC-1155 tokens needs the corresponding receiver hook. Without that support, the refund output can revert and the funds may remain unrecoverable.

## Refunds compared with emergency withdrawals

Refunds and emergency withdrawals address different balances:

- **Refunds** return deposits that were never included in finalized application state.
- **Emergency withdrawals** recover balances that were already recorded in the finalized [accounts drive](../withdrawal/overview.md).

An operator should reconcile input finalization and the accounts drive before directing a user to either path.
