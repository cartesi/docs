---
id: parser-reference
title: Parser reference
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page lists every parser function with its exact signature per language. The enums, structs and error codes they use are defined in [Types and selectors](./types-and-selectors.md).

## Decode advance

Decodes an advance input into a typed result. Pass the deposit type when the sender is a portal, or the automatic type to detect withdrawals and transfers from the payload.

### Signature

<Tabs groupId="language">
<TabItem value="python" label="Python" default>

```python
# One function per deposit type. Each takes the dict returned by
# read_advance_state() and returns a dict of decoded fields.
decode_ether_deposit(input: dict) -> dict
decode_erc20_deposit(input: dict) -> dict
decode_erc721_deposit(input: dict) -> dict
decode_erc1155_single_deposit(input: dict) -> dict
decode_erc1155_batch_deposit(input: dict) -> dict

# Automatic detection for withdrawals and transfers.
# Returns a dict with a "type" key naming the operation.
decode_advance(input: dict) -> dict
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
pub fn cma_decode_advance(
    req_type: CmaParserInputType,
    input: JsonValue,
) -> Result<CmaParserInput, CmaParserError>
```

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
int cma_parser_decode_advance(
    cma_parser_input_type_t type,
    const cmt_rollup_advance_t *input,
    cma_parser_input_t *parser_input);
```

</TabItem>
</Tabs>

### Parameters

- **type / req_type**: the input type to decode. Use a specific deposit type when you matched the sender to a portal. Use the automatic type (`CMA_PARSER_INPUT_TYPE_AUTO` in C and C++, `CmaParserInputTypeAuto` in Rust) for everything else. The Python deposit functions carry the type in their name, and `decode_advance` always runs in automatic mode.
- **input**: the advance request.
  - Python: the dictionary returned by `read_advance_state()`, containing `msg_sender` and `payload`.
  - Rust: a JSON object. The parser reads the payload from `data.payload` as a hex string and, in automatic mode, the sender from `data.metadata.msg_sender`.
  - C and C++: the `cmt_rollup_advance_t` struct filled by `cmt_rollup_read_advance_state`.
- **parser_input** (C and C++ only): output struct the parser fills.

### Returns

- Python: a dictionary of decoded fields. `decode_advance` adds a `type` key, for example `ERC20_WITHDRAWAL`.
- Rust: a `CmaParserInput` with `req_type` (the detected type) and `input` (a `CmaParserInputData` variant holding the fields).
- C and C++: `0` on success, a negative error code on failure. The decoded data lands in `parser_input`, with `parser_input.type` naming the variant.

### Errors

Fails when the payload is shorter than the expected layout, the hex is invalid, or the input matches no supported operation. See [error codes](./types-and-selectors.md#error-codes).

## Decode inspect

Decodes a balance or total supply query from an inspect request. The payload is a JSON document with `method` and `params` fields, described in [Parsing inputs](./parsing-inputs.md#decoding-inspect-queries).

### Signature

<Tabs groupId="language">
<TabItem value="python" label="Python" default>

```python
decode_inspect(input: dict) -> dict
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
pub fn cma_decode_inspect(
    input: JsonValue,
) -> Result<CmaParserInput, CmaParserError>
```

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
int cma_parser_decode_inspect(
    cma_parser_input_type_t type,
    const cmt_rollup_inspect_t *input,
    cma_parser_input_t *parser_input);
```

</TabItem>
</Tabs>

### Parameters

- **input**: the inspect request. Python takes the dict from `read_inspect_state()`. Rust takes a JSON object and reads the hex payload from `data.payload`. C and C++ take the `cmt_rollup_inspect_t` struct.
- **type** (C and C++ only): pass `CMA_PARSER_INPUT_TYPE_AUTO` to accept both query methods, or a specific balance or supply type to accept only one.

### Returns

- Python: a dict with `type` set to `BALANCE` or `SUPPLY`, plus `account`, `token` and `token_id` fields. Fields not present in the query are `None`.
- Rust: a `CmaParserInput` whose `req_type` is the balance or supply type and whose data variant holds the query fields.
- C and C++: `0` on success with the result in `parser_input`, or a negative error code.

### Errors

Fails when the payload is not valid JSON, the `method` key is missing or unknown, or a parameter has the wrong format.

## Encode voucher

Builds the destination and payload of a voucher that returns an asset to the base layer.

### Signature

<Tabs groupId="language">
<TabItem value="python" label="Python" default>

```python
# Methods of RollupCma. Each encodes the voucher and emits it
# to the machine in one step.
emit_ether_voucher(receiver: str, amount: int)
emit_erc20_voucher(token: str, receiver: str, amount: int)
emit_erc721_voucher(token: str, receiver: str, token_id: int)
emit_erc1155_single_voucher(token: str, receiver: str, token_id: int, amount: int)
emit_erc1155_batch_voucher(token: str, receiver: str, token_ids: list, amounts: list)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
pub fn cma_encode_voucher(
    req_type: CmaParserVoucherType,
    voucher_request: CmaVoucherFieldType,
) -> Result<CmaVoucher, CmaParserError>
```

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
int cma_parser_encode_voucher(
    cma_parser_voucher_type_t type,
    const cma_abi_address_t *app_address,
    const cma_parser_voucher_data_t *voucher_request,
    cma_voucher_t *voucher);
```

</TabItem>
</Tabs>

### Parameters

- **type / req_type**: the voucher type, one entry per asset standard. See [voucher types](./types-and-selectors.md#voucher-fields).
- **voucher_request**: the fields for that voucher type, such as token address, receiver and amount.
- **app_address** (C and C++ only): your application's address on the base layer, available in the advance request metadata. The Python binding captures it for you from `read_advance_state()`. The Rust binding takes it as a field of the ERC721 voucher request.

### Returns

- Python: the emit methods send the voucher directly and return the emit result.
- Rust: a `CmaVoucher` with `destination` and `payload` strings, ready to emit through your rollup I/O layer.
- C and C++: `0` on success with the result in `voucher`, holding the destination address and the call data.

### Errors

Fails when the request fields do not match the voucher type. In the Rust binding, ERC1155 single and batch voucher types are not implemented yet and return an error.
