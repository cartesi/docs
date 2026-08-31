> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: refund-output-builder
title: RefundOutputBuilder
resources:
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/refund/RefundOutputBuilder.sol
    title: RefundOutputBuilder contract
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/refund/IRefundOutputBuilder.sol
    title: IRefundOutputBuilder interface
  - url: https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.9/src/refund/IRefundOutputBuilderErrors.sol
    title: IRefundOutputBuilderErrors interface
---

**`RefundOutputBuilder`** decodes a canonical portal deposit and builds an executable output that returns the asset to its original depositor.

The [`Application`](../application.md) calls the builder with `STATICCALL`. The builder cannot write storage, emit events, create contracts, transfer Ether, or perform another state-changing action while constructing the output. The Application executes the returned output separately.

## `constructor()`

```solidity
constructor(
    IEtherPortal etherPortal,
    IErc20Portal erc20Portal,
    IErc721Portal erc721Portal,
    IErc1155SinglePortal erc1155SinglePortal,
    IErc1155BatchPortal erc1155BatchPortal,
    ISafeErc20Transfer safeTransfer
)
```

The constructor fixes the canonical portal addresses recognized by this builder and the safe-transfer helper used for ERC-20 refunds.

## `buildRefundOutput()`

```solidity
function buildRefundOutput(
    address appContract,
    address inputSender,
    bytes calldata inputPayload
) external view returns (bytes memory output)
```

| Parameter | Type | Description |
| --- | --- | --- |
| `appContract` | `address` | Application holding the deposited asset |
| `inputSender` | `address` | Direct input sender, expected to be a canonical portal |
| `inputPayload` | `bytes` | Portal-encoded deposit payload |

The function identifies the deposit format from `inputSender`, decodes `inputPayload`, and returns an encoded voucher or delegate-call voucher. It assumes the Application has already verified that the input exists in its input box.

## `UnknownInputSender`

```solidity
error UnknownInputSender(address inputSender)
```

Raised when `inputSender` is not one of the five canonical portal addresses configured in the constructor. This normally means the input is not a deposit or came through a custom portal unsupported by the standard builder.
