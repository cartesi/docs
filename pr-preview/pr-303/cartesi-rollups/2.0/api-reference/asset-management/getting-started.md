> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: getting-started
title: Getting started
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page shows you how to add the CMA library to a Cartesi application and build a small wallet that accepts Ether deposits and answers balance queries.

## Start from a template

The fastest way to start is with the official [application templates](https://github.com/Mugen-Builders/libcma-app-templates). The repository contains ready to build projects for Python, Rust and C++. Each one already wires the library, the build files and the portal addresses together.

```shell
git clone https://github.com/Mugen-Builders/libcma-app-templates
```

Copy the folder for your language into your workspace and use it as the base of your application.

## Add the library to an existing application

You can also add CMA to an application you already have.

<Tabs groupId="language">
<TabItem value="python" label="Python" default>

Install `pycma` from the prebuilt RISC-V wheels:

```shell
pip3 install pycma --find-links https://prototyp3-dev.github.io/pip-wheels-riscv/wheels/
```

Or build it from the repository:

```shell
pip3 install pycma@git+https://github.com/Mugen-Builders/libcma-binding-python
```

The package is compiled for the RISC-V target, so run the install step inside the Dockerfile that builds your application's machine image.

</TabItem>
<TabItem value="rust" label="Rust">

Add the binding as a git dependency in your `Cargo.toml`:

```toml
[dependencies]
libcma_binding_rust = { git = "https://github.com/Mugen-Builders/libcma_binding_rust", branch = "main" }
```

</TabItem>
<TabItem value="cpp" label="C++">

Download a prebuilt release from the [releases page](https://github.com/Mugen-Builders/machine-asset-tools/releases). Releases contain runtime and development artifacts for musl and glibc systems. In a Dockerfile:

```dockerfile
ARG MACHINE_ASSET_TOOLS_VERSION
ADD https://github.com/Mugen-Builders/machine-asset-tools/releases/download/v${MACHINE_ASSET_TOOLS_VERSION}/machine-asset-tools_glibc_riscv64_v${MACHINE_ASSET_TOOLS_VERSION}.tar.gz /tmp/
RUN tar -xzf /tmp/machine-asset-tools_glibc_riscv64_v${MACHINE_ASSET_TOOLS_VERSION}.tar.gz -C / \
    && rm /tmp/machine-asset-tools_glibc_riscv64_v${MACHINE_ASSET_TOOLS_VERSION}.tar.gz
```

This installs the shared library. Use the `_dev` artifact when you also need the headers and the static library.

</TabItem>
</Tabs>

## Your first wallet

The example below accepts Ether deposits, records them in the ledger and answers balance queries. It is a trimmed version of the [wallet sample application](https://github.com/Mugen-Builders/libcma-binding-python/tree/main/sample_apps/wallet_app) that ships with the Python binding.

<Tabs groupId="language">
<TabItem value="python" label="Python" default>

```python
from pycma import RollupCma, Ledger, decode_ether_deposit, decode_inspect

ETHER_PORTAL_ADDRESS = "0xA632c5c05812c6a6149B7af5C56117d1D2603828"[2:].lower()

rollup = RollupCma()
ledger = Ledger()

# Create the asset entry for Ether once, at startup
ether = ledger.retrieve_asset(base_token=True)
ETHER_ID = ether["asset_id"]

def handle_advance(rollup, ledger):
    advance = rollup.read_advance_state()
    msg_sender = advance["msg_sender"].hex().lower()

    if msg_sender == ETHER_PORTAL_ADDRESS:
        deposit = decode_ether_deposit(advance)
        account = ledger.retrieve_account(account=deposit["sender"])
        ledger.deposit(ETHER_ID, account["account_id"], deposit["amount"])
        return True

    return False

def handle_inspect(rollup, ledger):
    inspect = rollup.read_inspect_state()
    query = decode_inspect(inspect)

    if query["type"] == "BALANCE":
        account = ledger.retrieve_account(account=query["account"])
        balance = ledger.balance(ETHER_ID, account["account_id"])
        rollup.emit_report(balance.to_bytes(32, "big"))
        return True

    return False

handlers = {"advance": handle_advance, "inspect": handle_inspect}

accept = True
while True:
    next_request_type = rollup.finish(accept)
    accept = handlers[next_request_type](rollup, ledger)
```

</TabItem>
<TabItem value="rust" label="Rust">

The Rust template uses [libcmt-binding-rust](https://github.com/Mugen-Builders/libcmt-binding-rust) to read inputs from the machine and the CMA parser to decode them:

```rust
use libcma_binding_rust::parser::{cma_decode_advance, CmaParserInputType, CmaParserInputData};
use libcma_binding_rust::Ledger;
use json::object;

const ETHER_PORTAL: &str = "0xA632c5c05812c6a6149B7af5C56117d1D2603828";

fn handle_ether_deposit(
    ledger: &mut Ledger,
    msg_sender: &str,
    payload_hex: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    // The parser reads the payload from data.payload
    // and the sender from data.metadata.msg_sender
    let request = object! {
        data: {
            metadata: { msg_sender: msg_sender },
            payload: payload_hex
        }
    };

    let decoded = cma_decode_advance(
        CmaParserInputType::CmaParserInputTypeEtherDeposit,
        request,
    )?;

    if let CmaParserInputData::EtherDeposit(deposit) = decoded.input {
        let ether_id = ledger.retrieve_ether_assets()?;
        let account_id = ledger.retrieve_account_via_address(deposit.sender)?;
        ledger.deposit(ether_id, account_id, deposit.amount)?;
    }
    Ok(())
}
```

Compare the sender of each advance request against the portal addresses to pick the right input type, as shown in the [Rust template](https://github.com/Mugen-Builders/libcma-app-templates/blob/main/rust/src/main.rs).

</TabItem>
<TabItem value="cpp" label="C++">

In C++ you read inputs with libcmt and pass them straight to the parser:

```cpp
extern "C" {
#include <libcmt/rollup.h>
#include <libcma/parser.h>
#include <libcma/ledger.h>
}

// input is a cmt_rollup_advance_t filled by cmt_rollup_read_advance_state(rollup, &input)
cma_parser_input_t parser_input;

const int err = cma_parser_decode_advance(CMA_PARSER_INPUT_TYPE_ETHER_DEPOSIT, &input, &parser_input);
if (err < 0) {
    printf("unable to decode deposit: %d - %s\n", -err, cma_parser_get_last_error_message());
}

// parser_input.ether_deposit.sender  -> who deposited
// parser_input.ether_deposit.amount  -> how much
```

The [C++ template](https://github.com/Mugen-Builders/libcma-app-templates/blob/main/cpp/app.cpp) shows the complete request loop.

</TabItem>
</Tabs>

## Build and run it

Applications using the CMA library build and run like any other Cartesi application. Follow [Building an application](../../development/building-an-application.md) to produce the machine image, then [Running an application](../../development/running-an-application.md) to start a local node. Use [Sending inputs and assets](../../development/send-inputs-and-assets.md) to make a deposit and watch your wallet handle it.

## Next steps

- [Parsing inputs](./parsing-inputs.md) covers every input the parser can decode.
- [Managing balances](./managing-balances.md) covers the full ledger API.
- [Vouchers and withdrawals](./vouchers.md) shows how users take their assets back to the base layer.
