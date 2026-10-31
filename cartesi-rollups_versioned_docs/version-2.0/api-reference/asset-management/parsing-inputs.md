---
id: parsing-inputs
title: Parsing inputs
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Every input reaches your application as raw bytes. The CMA parser understands and processes three kinds of inputs and turns each one into typed values:

1. **Deposits** sent by the Cartesi portal contracts.
2. **Application calls** such as withdrawals and transfers, sent by users as ABI encoded payloads.
3. **Inspect queries** for balances and total supply, sent as JSON.

## Know who sent the input

The parser does not guess where an input came from. Your application checks the `msg_sender` of each advance request first:

- If the sender is a portal contract, the input is a deposit. Pass the matching deposit type to the parser.
- If the sender is anything else, treat it as an application call and let the parser detect the operation from the payload itself.

:::caution
Portal addresses change between Rollups versions. Always confirm the addresses for the version you deploy against.
:::

## Decoding deposits

Each portal encodes its deposits in a fixed ABI layout. The parser knows these layouts, so one call gives you all the deposit fields.

<Tabs groupId="language">
<TabItem value="python" label="Python" default>

`pycma` has one decode function per deposit type. Each takes the advance request returned by `read_advance_state()` and returns a plain dictionary:

```python
from pycma import (
    decode_ether_deposit,
    decode_erc20_deposit,
    decode_erc721_deposit,
    decode_erc1155_single_deposit,
    decode_erc1155_batch_deposit,
)

advance = rollup.read_advance_state()
msg_sender = advance["msg_sender"].hex().lower()

if msg_sender == ERC20_PORTAL_ADDRESS:
    deposit = decode_erc20_deposit(advance)
    # deposit["sender"]  -> depositor address
    # deposit["token"]   -> token contract address
    # deposit["amount"]  -> amount as an int
```

</TabItem>
<TabItem value="rust" label="Rust">

`cma_decode_advance` takes the input type and a JSON object. The parser reads the payload from `data.payload` and, for application calls, the sender from `data.metadata.msg_sender`:

```rust
use libcma_binding_rust::parser::{cma_decode_advance, CmaParserInputType, CmaParserInputData};
use json::object;

let request = object! {
    data: {
        metadata: { msg_sender: msg_sender },
        payload: payload_hex
    }
};

let decoded = cma_decode_advance(
    CmaParserInputType::CmaParserInputTypeErc20Deposit,
    request,
)?;

if let CmaParserInputData::Erc20Deposit(deposit) = decoded.input {
    // deposit.sender, deposit.token, deposit.amount, deposit.exec_layer_data
}
```

</TabItem>
<TabItem value="cpp" label="C++">

`cma_parser_decode_advance` takes the input type, the advance struct from libcmt and an output struct:

```cpp
// input is a cmt_rollup_advance_t filled by cmt_rollup_read_advance_state(rollup, &input)
cma_parser_input_t parser_input;

const int err = cma_parser_decode_advance(CMA_PARSER_INPUT_TYPE_ERC20_DEPOSIT, &input, &parser_input);
if (err < 0) {
    printf("unable to decode erc20 deposit: %d - %s\n", -err, cma_parser_get_last_error_message());
}

parser_input.erc20_deposit.sender;          // sender of the deposit
parser_input.erc20_deposit.token;           // token address
parser_input.erc20_deposit.amount;          // amount
parser_input.erc20_deposit.exec_layer_data; // extra data sent by the depositor
```

</TabItem>
</Tabs>

The full list of deposit result fields per asset is in [Types and selectors](./types-and-selectors.md#parser-results).

## Decoding application calls

Withdrawals and transfers are actions application users call directly. For the parser to decode them, the input must arrive as an ABI encoded call that matches one of the function selectors the parser knows. The first four bytes of the payload identify the operation, and the rest carries the arguments. The complete selector table is in [Types and selectors](./types-and-selectors.md#application-call-selectors).

When the sender is not a portal, the parser is tasked with detecting the operation automatically:

<Tabs groupId="language">
<TabItem value="python" label="Python" default>

`decode_advance` detects the operation from the payload and returns a dictionary with a `type` key:

```python
from pycma import decode_advance

decoded = decode_advance(advance)

if decoded["type"] == "ERC20_WITHDRAWAL":
    # decoded["token"], decoded["amount"], decoded["exec_layer_data"]
    ...
elif decoded["type"] == "ERC20_TRANSFER":
    # decoded["receiver"], decoded["token"], decoded["amount"]
    ...
```

The Python binding decodes all ten operations: Ether, ERC20, ERC721, ERC1155 single and ERC1155 batch, each as withdrawal and as transfer. It raises an exception when the payload does not match any known selector.

</TabItem>
<TabItem value="rust" label="Rust">

Pass `CmaParserInputTypeAuto` and match on the result type:

```rust
let decoded = cma_decode_advance(CmaParserInputType::CmaParserInputTypeAuto, request)?;

match decoded.req_type {
    CmaParserInputType::CmaParserInputTypeErc20Withdrawal => {
        if let CmaParserInputData::Erc20Withdrawal(w) = decoded.input {
            // w.receiver, w.token, w.amount
        }
    }
    CmaParserInputType::CmaParserInputTypeUnidentified => {
        // Not a CMA operation. The raw bytes and sender are returned
        // so your own logic can handle the input.
    }
    _ => {}
}
```

:::note current coverage in the Rust binding
In automatic mode the Rust binding currently decodes Ether, ERC20, ERC721 and ERC1155 withdrawals and transfers. Inputs that match no selector come back as `Unidentified` with the raw bytes, so your application can process its own custom input formats.
:::

</TabItem>
<TabItem value="cpp" label="C++">

Pass `CMA_PARSER_INPUT_TYPE_AUTO` and check the resulting type:

```cpp
cma_parser_input_t parser_input;

const int err = cma_parser_decode_advance(CMA_PARSER_INPUT_TYPE_AUTO, &input, &parser_input);
if (err < 0) {
    printf("unable to decode input: %d - %s\n", -err, cma_parser_get_last_error_message());
}

switch (parser_input.type) {
case CMA_PARSER_INPUT_TYPE_ERC20_WITHDRAWAL:
    // parser_input.erc20_withdrawal.token, .amount, .exec_layer_data
    break;
case CMA_PARSER_INPUT_TYPE_ERC20_TRANSFER:
    // parser_input.erc20_transfer.receiver, .token, .amount
    break;
default:
    break;
}
```

</TabItem>
</Tabs>

## Decoding inspect queries

Balance and supply queries arrive as inspect requests. The payload is a small JSON document with a `method` name and a `params` array.

<Tabs groupId="language">
<TabItem value="python" label="Python" default>

The C core and the Python binding accept the methods `ledger_getBalance` and `ledger_getTotalSupply`:

```json
{
  "method": "ledger_getBalance",
  "params": ["0x0000000000000000000000000000000000000001"]
}
```

`params[0]` is the account. You can add a token address as `params[1]` and a token ID as `params[2]` to query a specific asset:

```python
from pycma import decode_inspect

inspect = rollup.read_inspect_state()
query = decode_inspect(inspect)

if query["type"] == "BALANCE":
    # query["account"], query["token"], query["token_id"]
    ...
elif query["type"] == "SUPPLY":
    # query["token"], query["token_id"]
    ...
```

</TabItem>
<TabItem value="rust" label="Rust">

The Rust binding accepts the same `ledger_getBalance` and `ledger_getTotalSupply` methods, and also accepts the camelCase spellings `ledgerGetBalance` and `ledgerGetTotalSupply`. The inspect payload is the hex encoding of the JSON document:

```rust
use libcma_binding_rust::parser::{cma_decode_inspect, CmaParserInputType, CmaParserInputData};

let decoded = cma_decode_inspect(request)?;

match decoded.req_type {
    CmaParserInputType::CmaParserInputTypeBalance => {
        if let CmaParserInputData::Balance(q) = decoded.input {
            // q.account, q.token, q.token_id
        }
    }
    CmaParserInputType::CmaParserInputTypeSupply => {
        if let CmaParserInputData::Supply(q) = decoded.input {
            // q.token, q.token_id
        }
    }
    _ => {}
}
```

</TabItem>
<TabItem value="cpp" label="C++">

`cma_parser_decode_inspect` works like the advance variant. Use `CMA_PARSER_INPUT_TYPE_AUTO` to accept both methods:

```cpp
cma_parser_input_t parser_input;

const int err = cma_parser_decode_inspect(CMA_PARSER_INPUT_TYPE_AUTO, &input, &parser_input);
if (err < 0) {
    printf("unable to decode inspect: %d - %s\n", -err, cma_parser_get_last_error_message());
}
// parser_input.type tells you whether it is a balance or a supply query
```

</TabItem>
</Tabs>

## Handling parser errors

Every decode call can fail, for example when a payload is shorter than expected. Always check the result before you touch the ledger:

- Python raises an exception with the error code and message.
- Rust returns a `Result` with a `CmaParserError`.
- C and C++ return a negative error code, and `cma_parser_get_last_error_message()` gives the matching text.

The complete error lists are in [Types and selectors](./types-and-selectors.md#error-codes).
