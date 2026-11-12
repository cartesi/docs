---
id: vouchers
title: Vouchers and withdrawals
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Users deposit assets into your application, but only your application can send them back. It does this by emitting a [voucher](../backend/vouchers.md), a message that executes a call on the base layer once the epoch settles. CMA builds these vouchers for you with the correct destination and payload for each asset type.

## The withdrawal flow

A complete withdrawal has three steps, and you have already seen the first two in the previous guides:

1. **Decode the request**. The user sends an ABI encoded withdrawal input. The parser identifies it and returns the typed fields. See [Parsing inputs](./parsing-inputs.md).
2. **Debit the ledger**. Call `withdraw` so the user's balance drops inside your application. If the user lacks funds, this call fails and you stop here. See [Managing balances](./managing-balances.md).
3. **Emit the voucher**. Build and emit the voucher that releases the asset on the base layer.

Running the ledger debit before emitting the voucher matters. It guarantees a user can never withdraw more than they own.

## Emitting vouchers

<Tabs groupId="language">
<TabItem value="python" label="Python" default>

`RollupCma` has one emit method per asset type. Each builds the voucher and sends it to the machine in a single call. The application address needed for the voucher is captured automatically when you call `read_advance_state()`:

```python
# Ether
rollup.emit_ether_voucher(receiver, amount)

# ERC20
rollup.emit_erc20_voucher(token, receiver, amount)

# ERC721
rollup.emit_erc721_voucher(token, receiver, token_id)

# ERC1155
rollup.emit_erc1155_single_voucher(token, receiver, token_id, amount)
rollup.emit_erc1155_batch_voucher(token, receiver, token_ids, amounts)
```

A full withdrawal handler, from the [wallet sample](https://github.com/Mugen-Builders/libcma-binding-python/blob/main/sample_apps/wallet_app/app.py):

```python
decoded = decode_advance(advance)

if decoded["type"] == "ERC20_WITHDRAWAL":
    asset = ledger.retrieve_asset(token=decoded["token"])
    account = ledger.retrieve_account(account=msg_sender)

    ledger.withdraw(asset["asset_id"], account["account_id"], decoded["amount"])

    rollup.emit_erc20_voucher(asset["token"], msg_sender, decoded["amount"])
```

</TabItem>
<TabItem value="rust" label="Rust">

`cma_encode_voucher` builds the voucher fields. You then emit the result with your rollup I/O layer, for example [libcmt-binding-rust](https://github.com/Mugen-Builders/libcmt-binding-rust):

```rust
use libcma_binding_rust::parser::{
    cma_encode_voucher, CmaParserVoucherType, CmaVoucherFieldType, CmaParserErc20VoucherFields,
};

let voucher = cma_encode_voucher(
    CmaParserVoucherType::CmaParserVoucherTypeErc20,
    Some(application_address),
    CmaVoucherFieldType::Erc20VoucherFields(CmaParserErc20VoucherFields {
        token,
        receiver,
        amount,
    }),
)?;

// voucher.destination -> address the voucher calls
// voucher.value       -> base layer value to send, used by Ether vouchers
// voucher.payload     -> hex encoded call data

// Emit it through your rollup I/O layer, for example libcmt-binding-rust:
rollup.emit_voucher(&voucher.destination, Some(&voucher.value), &voucher.payload)?;
```

ERC721 vouchers also need your application address, because the token contract transfers the token out of the application's custody:

```rust
use libcma_binding_rust::parser::CmaParserErc721VoucherFields;

let voucher = cma_encode_voucher(
    CmaParserVoucherType::CmaParserVoucherTypeErc721,
    Some(application_address),
    CmaVoucherFieldType::Erc721VoucherFields(CmaParserErc721VoucherFields {
        token,
        token_id,
        receiver,
        application_address,
    }),
)?;
```

</TabItem>
<TabItem value="cpp" label="C++">

`cma_parser_encode_voucher` fills a voucher struct that you pass to `cmt_rollup_emit_voucher`:

```cpp
cma_parser_voucher_data_t voucher_request;
// fill voucher_request.receiver and the union member
// that matches the asset type, for example
// voucher_request.u.erc20_voucher_fields

cma_voucher_t voucher;
const int err = cma_parser_encode_voucher(CMA_PARSER_VOUCHER_TYPE_ERC20, &app_address, &voucher_request, &voucher);
if (err < 0) {
    printf("unable to encode voucher: %d - %s\n", -err, cma_parser_get_last_error_message());
}
```

The `app_address` comes from the advance request metadata of any input your application has received.

</TabItem>
</Tabs>

## What each voucher does on the base layer

| Asset   | Voucher destination  | Effect when executed                                                   |
| :------ | :------------------- | :--------------------------------------------------------------------- |
| Ether   | The receiver address | Sends the Ether amount to the receiver                                 |
| ERC20   | The token contract   | Calls the token's transfer function to pay the receiver                |
| ERC721  | The token contract   | Transfers the token ID from the application to the receiver            |
| ERC1155 | The token contract   | Transfers the token ID and amount, or batches of them, to the receiver |

After the epoch that contains the input settles, anyone can execute the voucher on the base layer through the application contract. See [Asset handling](../../development/asset-handling.md) for the full lifecycle.

## Voucher field structs

The exact fields each voucher type needs are listed in [Types and selectors](./types-and-selectors.md#voucher-fields).
