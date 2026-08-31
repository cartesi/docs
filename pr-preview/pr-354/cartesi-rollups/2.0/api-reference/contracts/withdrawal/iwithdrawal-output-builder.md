> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: iwithdrawal-output-builder
title: IWithdrawalOutputBuilder
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/withdrawal/IWithdrawalOutputBuilder.sol
    title: IWithdrawalOutputBuilder interface
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/withdrawal/IWithdrawalOutputBuilderErrors.sol
    title: IWithdrawalOutputBuilderErrors interface
---

A **withdrawal output builder** converts one encoded accounts-drive record into an output that transfers the account's funds to its owner.

The [`Application`](../application.md#withdraw) calls the builder with `STATICCALL`. Building the output cannot change state, emit events, create contracts, transfer Ether, or self-destruct. The Application executes the returned output separately.

Account contents remain application-specific, but every account must end with its owner's 20-byte address. The builder must interpret the complete account exactly as the guest application wrote it.

## `buildWithdrawalOutput()`

```solidity
function buildWithdrawalOutput(address appContract, bytes calldata account)
    external
    view
    returns (bytes memory output)
```

| Parameter | Type | Description |
| --- | --- | --- |
| `appContract` | `address` | Application holding the base-layer assets |
| `account` | `bytes` | Complete encoded accounts-drive record |

Returns an executable output that transfers the encoded funds to the account owner.

## `InvalidAccountSize`

```solidity
error InvalidAccountSize(uint256 attemptedAccountSize, uint64 accountSize)
```

Raised when the supplied record length differs from the exact size expected by the builder.

| Parameter | Description |
| --- | --- |
| `attemptedAccountSize` | Number of bytes supplied by the caller |
| `accountSize` | Exact number of bytes required by the builder |
