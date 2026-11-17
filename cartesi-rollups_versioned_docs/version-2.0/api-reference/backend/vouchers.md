---
id: vouchers
title: Vouchers
resources:
  - url: https://www.evm.codes/?fork=cancun#f4
    title: DELEGATECALL Opcode
---

Vouchers serve as a mechanism for facilitating on-chain actions initiated in the execution layer.

Imagine vouchers as digital authorization tickets that grant dApps the authority to execute specific actions directly on the base layer. These vouchers encapsulate the details of the desired on-chain action, such as a token swap request or asset transfer.

A voucher explicitly specifies the action that the dApp intends to execute on the base layer.

For instance, in a DeFi application built on Cartesi, users may want to swap one token for another. The dApp generates a voucher that authorizes the on-chain smart contract to execute the swap on the user's behalf.

The [`Application`](../contracts/application.md) contract is crucial in validating and executing the received voucher on the blockchain. This execution process occurs through the [`executeOutput()`](../contracts/application.md#executeoutput) function, which handles different types of outputs including vouchers and DELEGATECALL vouchers.

A voucher can be executed only after the claim for its epoch has been accepted by the application's consensus contract. The `Application` contract records each execution: it emits an [`OutputExecuted`](../contracts/application.md#outputexecuted) event and marks the output as executed, so [`wasOutputExecuted()`](../contracts/application.md#wasoutputexecuted) returns `true` and the voucher cannot be executed again.

In JavaScript, the application emits a voucher with `rollup.emitVoucher()` from [`@cartesi/rollup`](https://www.npmjs.com/package/@cartesi/rollup/v/1.0.0-alpha.3), passing the `destination`, the `value` in wei as a `bigint` and the `payload` (the encoded call). The example below encodes the call with [`viem`](https://viem.sh/); add it as described in [adding dependencies](../../development/creating-an-application.md#adding-dependencies-in-javascript-and-typescript).

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="Javascript" label="Javascript" default>
<pre><code>

```javascript
import { Rollup } from "@cartesi/rollup";
import { encodeFunctionData, erc20Abi } from "viem";

const rollup = new Rollup();

const erc20Token = "0x86EA17052C8e335Ad830B54EF566274EAB46B852"; // the CLI devnet's test ERC-20 token

await rollup.run({
  advance(request) {
    console.log(`Received advance request from ${request.msgSender}`);

    const call = encodeFunctionData({
      abi: erc20Abi,
      functionName: "transfer",
      args: [request.msgSender, 10n],
    });

    rollup.emitVoucher({
      destination: erc20Token,
      value: 0n,
      payload: call,
    });
    return true;
  },
});
```

</code></pre>
</TabItem>

<TabItem value="Python" label="Python">
<pre><code>

```python
# Requirements (requirements.txt):
#   eth-abi==5.2.0
#   eth-utils==5.3.1
#   pycryptodome==3.23.0  # keccak backend used by eth-utils
# pycryptodome has no prebuilt riscv64 wheel, so `cartesi build` compiles it:
# add build-essential to the apt-get install command in the template's Dockerfile.
# Alternatively, add --find-links https://prototyp3-dev.github.io/pip-wheels-riscv/wheels/
# as the first line of requirements.txt to use prebuilt riscv64 wheels instead.
# Voucher creation process
import logging
import requests
from os import environ
from eth_utils import function_signature_to_4byte_selector
from eth_abi import decode, encode

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]

def emit_voucher(function_signature, destination, types, values):
    selector = function_signature_to_4byte_selector(function_signature)    
    encoded_params = encode(types, values)
    payload = "0x" + (selector + encoded_params).hex()
    response = requests.post(rollup_server + "/voucher", json={"payload": payload, "destination": destination, "value": '0x' + encode(["uint256"], [0]).hex()})
    if response.status_code == 200 or response.status_code == 201:
        logger.info(f"Voucher emitted successfully with data: {payload}")
    else:
        logger.error(f"Failed to emit Voucher with data: {payload}. Status code: {response.status_code}")


ERC20_TOKEN = "0x86EA17052C8e335Ad830B54EF566274EAB46B852"  # the CLI devnet's test ERC-20 token


def handle_advance(data):
    # Send 10 base units of the token to whoever sent the input.
    emit_voucher("transfer(address,uint256)", ERC20_TOKEN, ["address", "uint256"], [data["metadata"]["msg_sender"], 10])
    return "accept"
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust">
<pre><code>

```rust
async fn emit_voucher( voucher: JsonValue) -> Option<bool> {
    let server_addr = env::var("ROLLUP_HTTP_SERVER_URL").expect("ROLLUP_HTTP_SERVER_URL not set");
    let client = hyper::Client::new();

    let request = hyper::Request::builder()
    .method(hyper::Method::POST)
    .header(hyper::header::CONTENT_TYPE, "application/json")
    .uri(format!("{}/voucher", server_addr))
    .body(hyper::Body::from(voucher.dump()))
    .ok()?;

    let response = client.request(request).await;

    match response {
        Ok(_) => {
            println!("Voucher generation successful");
            return Some(true);
        }
        Err(e) => {
            println!("Voucher request failed {}", e);
            None
        }
    }
}

fn structure_voucher(
    function_signature: &str,
    destination: &str,
    args: Vec<Token>,
    value: u128,
) -> JsonValue {
    let selector = &id(function_signature)[..4];

    let encoded_args = encode(&args);

    let mut payload_bytes = Vec::new();
    payload_bytes.extend_from_slice(selector);
    payload_bytes.extend_from_slice(&encoded_args);

    let payload = format!("0x{}", hex::encode(payload_bytes));

    let response = object! {
        "destination" => format!("{}", destination),
        "payload" => format!("{}", payload),
        "value" => format!("0x{:064x}", value), // 32-byte hex
    };

    return response;
}

pub async fn handle_advance(
    _client: &hyper::Client<hyper::client::HttpConnector>,
    _server_addr: &str,
    request: JsonValue,
) -> Result<&'static str, Box<dyn std::error::Error>> {
    println!("Received advance request data {}", &request);
    let payload = request["data"]["payload"]
        .as_str()
        .ok_or("Missing payload")?;
   
    let sender = request["data"]["metadata"]["msg_sender"]
        .as_str()
        .ok_or("Missing msg_sender in metadata")?
        .to_string();

    let erc_20_token: &str = "0x86EA17052C8e335Ad830B54EF566274EAB46B852"; // the CLI devnet's test ERC-20 token

    let amount = 10;

    let args = vec![
        Token::Address(sender.parse().unwrap()),
        Token::Uint(amount.into()),
    ];
    let function_sig = "transfer(address,uint256)";

    let voucher = structure_voucher(function_sig, erc_20_token, args, 0);
    emit_voucher(voucher).await;

    Ok("accept")
}

```

</code></pre>
</TabItem>

<TabItem value="Go" label="Go">
<pre><code>

```go
func HandleAdvance(data *rollups.AdvanceResponse) error {
	// Log incoming request data.
	infolog.Printf("Received advance request data %+v\n", data)

	// Example ERC-20 transfer payload (transfer(address,uint256)).
	// Replace with encoded calldata based on your app logic.
	callData := "0xa9059cbb0000000000000000000000001111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000a"

	voucher := rollups.VoucherRequest{
		Destination: "0x86EA17052C8e335Ad830B54EF566274EAB46B852", // the CLI devnet's test ERC-20 token
		Payload:     callData,
		Value:       "0x0000000000000000000000000000000000000000000000000000000000000000", // 32-byte zero value
	}

	if _, err := rollups.SendVoucher(&voucher); err != nil {
		return fmt.Errorf("HandleAdvance: failed sending voucher: %w", err)
	}

	return nil
}
```

</code></pre>
</TabItem>

<TabItem value="C++" label="C++">
<pre><code>

```cpp
std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    std::cout << "Received advance request data " << data << std::endl;

    // Example ERC-20 transfer payload (transfer(address,uint256)).
    // Replace with encoded calldata generated from your app logic.
    const std::string call_data =
        "0xa9059cbb0000000000000000000000001111111111111111111111111111111111111111"
        "000000000000000000000000000000000000000000000000000000000000000a";

    picojson::object voucher;
    voucher["destination"] = picojson::value("0x86EA17052C8e335Ad830B54EF566274EAB46B852");
    voucher["payload"] = picojson::value(call_data);
    voucher["value"] = picojson::value("0x0000000000000000000000000000000000000000000000000000000000000000"); // 32-byte zero value

    auto response = cli.Post(
        "/voucher",
        picojson::value(voucher).serialize(),
        "application/json"
    );

    if (!response || response->status >= 400)
    {
        std::cout << "Failed to send voucher" << std::endl;
        return "reject";
    }

    return "accept";
}
```

</code></pre>
</TabItem>

</Tabs>

:::note create a voucher
[Refer to the documentation here](../../development/asset-handling.md) for asset handling and creating vouchers in your dApp.
:::

## DELEGATECALL Vouchers

:::danger Security Considerations
DELEGATECALL Vouchers are a powerful feature that should be used with extreme caution. Incorrect implementation can lead to serious security vulnerabilities as the target contract's code has full access to the Application contract's storage and funds.
:::

DELEGATECALL Vouchers are an extension of vouchers that enables advanced smart contract interactions through the [`DELEGATECALL`](https://www.evm.codes/?fork=cancun#f4) opcode.

Unlike regular vouchers, DELEGATECALL vouchers allow dApps to separate their execution logic from their storage context. When using DELEGATECALL voucher, the Application contract always maintains the storage, context, and funds (both ETH and tokens), while the target contract provides only the execution logic. This separation enables more flexible and reusable smart contract patterns while keeping all state changes and assets within the Application contract.

When a DELEGATECALL voucher is executed through the Application contract, the code at the target address is executed with the following characteristics:

- All storage operations occur in the Application contract's storage space
- All funds (ETH and tokens) remain in and are managed by the Application contract
- The msg.sender and msg.value from the original transaction are preserved
- The execution logic comes from the target contract, but operates on the Application contract's state and funds

This mechanism, where the Application contract maintains the state and funds while borrowing logic from other contracts, enables powerful patterns such as:

- **Paid Vouchers**: Vouchers that provide payment to the user who executes them.

- **Future Vouchers**: Vouchers that are time-locked and can only be executed after a specific timestamp.

- **Expirable Vouchers**: Vouchers that have an expiration timestamp, after which they can no longer be executed.

- **Targeted Vouchers**: Vouchers that are restricted to execution by specific addresses or a list of authorized addresses.

- **Atomic Vouchers**: A sequence of message calls that must be executed in order, ensuring atomicity of the operations.

- **Re-executable Vouchers**: Vouchers that can be executed multiple times, unlike standard vouchers which can only be executed once.

- **Ordered Vouchers**: Vouchers that must be executed in a specific sequence. For example, voucher A can only be executed after voucher B has been executed.

The examples below emit a DELEGATECALL voucher by posting to `/delegate-call-voucher` (in JavaScript, with `rollup.emitDelegateCallVoucher()` from [`@cartesi/rollup`](https://www.npmjs.com/package/@cartesi/rollup/v/1.0.0-alpha.3)).  
In these snippets, `destination` is the contract that contains the logic to run, while `payload` is the ABI-encoded function call data (for example, `safeTransfer(address,address,uint256)`).

The Cartesi Rollups contracts include a contract for exactly this call: [`SafeErc20Transfer`](https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/delegatecall/SafeErc20Transfer.sol) (interface `ISafeErc20Transfer`), whose `safeTransfer(IERC20 token, address to, uint256 value)` transfers ERC-20 tokens held by the application. It is deployed at `0xBB7c5367B74544542F5cE553Ed0DF4B3efAfEEdD` on every network of the [deployed contracts](../../deployment/self-hosted/standard.md#deployed-contracts) and on the CLI devnet. It is the destination the [`UsdWithdrawalOutputBuilder`](../contracts/withdrawal/usd-withdrawal-output-builder.md) uses for emergency withdrawals. Before rollups-contracts v3.0.0-alpha.7, it was named `SafeERC20Transfer` (interface `ISafeERC20Transfer`).

:::note
Since rollups-contracts v3.0.0-alpha.7, executing a DELEGATECALL voucher whose destination has no code reverts with `TargetHasNoCode(address target)`. Make sure the destination contract is deployed on the network where the voucher will be executed.
:::

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

```javascript
import { encodeFunctionData, parseAbi } from "viem";

const abi = parseAbi([
  "function safeTransfer(address,address,uint256)",
]);

// `rollup` is the Rollup instance of your application
function emitSafeErc20Transfer(rollup, token, to, amount) {
  const call = encodeFunctionData({
    abi,
    functionName: "safeTransfer",
    args: [token, to, amount],
  });

  rollup.emitDelegateCallVoucher({
    destination: "0xBB7c5367B74544542F5cE553Ed0DF4B3efAfEEdD", // SafeErc20Transfer: the contract containing the logic
    payload: call,
  });
}
```

</code></pre>
</TabItem>

<TabItem value="Python" label="Python">
<pre><code>

```python
# Requirements (requirements.txt):
#   eth-abi==5.2.0
#   eth-utils==5.3.1
#   pycryptodome==3.23.0  # keccak backend used by eth-utils
# pycryptodome has no prebuilt riscv64 wheel, so `cartesi build` compiles it:
# add build-essential to the apt-get install command in the template's Dockerfile.
# Alternatively, add --find-links https://prototyp3-dev.github.io/pip-wheels-riscv/wheels/
# as the first line of requirements.txt to use prebuilt riscv64 wheels instead.
from os import environ
from eth_utils import function_signature_to_4byte_selector, to_checksum_address
from eth_abi import encode
import requests

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]

def emit_safe_erc20_transfer(token, to, amount):
    selector = function_signature_to_4byte_selector("safeTransfer(address,address,uint256)")
    encoded_params = encode(["address", "address", "uint256"], [to_checksum_address(token), to_checksum_address(to), amount])
    payload = "0x" + (selector + encoded_params).hex()
    voucher = {
        "destination": "0xBB7c5367B74544542F5cE553Ed0DF4B3efAfEEdD",  # SafeErc20Transfer: the contract containing the logic
        "payload": payload,
    }
    response = requests.post(rollup_server + "/delegate-call-voucher", json=voucher)
    return response
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust">
<pre><code>

```rust
use ethers_core::abi::{Function, Param, ParamType, StateMutability, Token};
use json::object;

pub async fn emit_safe_erc20_transfer(
    client: &hyper::Client<hyper::client::HttpConnector>,
    server_addr: &str,
    token: &str,
    to: &str,
    amount: u64,
) -> Result<(), Box<dyn std::error::Error>> {
    let safe_transfer = Function {
        name: "safeTransfer".to_string(),
        inputs: vec![
            Param { name: "token".to_string(), kind: ParamType::Address, internal_type: None },
            Param { name: "to".to_string(), kind: ParamType::Address, internal_type: None },
            Param { name: "amount".to_string(), kind: ParamType::Uint(256), internal_type: None },
        ],
        outputs: vec![],
        constant: None,
        state_mutability: StateMutability::NonPayable,
    };

    let payload_bytes = safe_transfer.encode_input(&[
        Token::Address(token.parse()?),
        Token::Address(to.parse()?),
        Token::Uint(amount.into()),
    ])?;

    let voucher = object! {
        destination: "0xBB7c5367B74544542F5cE553Ed0DF4B3efAfEEdD", // SafeErc20Transfer: the contract containing the logic
        payload: format!("0x{}", hex::encode(payload_bytes)),
    };

    let request = hyper::Request::builder()
        .method(hyper::Method::POST)
        .header(hyper::header::CONTENT_TYPE, "application/json")
        .uri(format!("{}/delegate-call-voucher", server_addr))
        .body(hyper::Body::from(voucher.dump()))?;
    client.request(request).await?;
    Ok(())
}
```

</code></pre>
</TabItem>

<TabItem value="Go" label="Go">
<pre><code>

```go
package main

import (
	"encoding/json"
	"fmt"
	"math/big"
	"strings"

	"dapp/rollups"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
)

func emitSafeErc20Transfer(token, to common.Address, amount *big.Int) error {
	abiJSON := `[{
		"type":"function",
		"name":"safeTransfer",
		"inputs":[
			{"type":"address"},
			{"type":"address"},
			{"type":"uint256"}
		]
	}]`
	
	abiInterface, err := abi.JSON(strings.NewReader(abiJSON))
	if err != nil {
		return fmt.Errorf("failed to parse ABI: %w", err)
	}
	
	payload, err := abiInterface.Pack("safeTransfer", token, to, amount)
	if err != nil {
		return fmt.Errorf("failed to pack ABI: %w", err)
	}
	
	voucher := map[string]interface{}{
		"destination": "0xBB7c5367B74544542F5cE553Ed0DF4B3efAfEEdD", // SafeErc20Transfer: the contract containing the logic
		"payload":     "0x" + common.Bytes2Hex(payload), // the rollup server expects a 0x prefix
	}
	
	voucherJSON, err := json.Marshal(voucher)
	if err != nil {
		return fmt.Errorf("failed to marshal voucher: %w", err)
	}
	
	_, err = rollups.SendPost("delegate-call-voucher", voucherJSON)
	if err != nil {
		return fmt.Errorf("failed to send voucher: %w", err)
	}
	
	return nil
}
```

</code></pre>
</TabItem>

<TabItem value="C++" label="C++">
<pre><code>

```cpp
#include <string>

#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"

std::string emit_safe_erc20_transfer(
    httplib::Client &cli,
    const std::string &token,
    const std::string &to,
    const std::string &amount_hex_32bytes
)
{
    // safeTransfer(address,address,uint256)
    const std::string selector = "d1660f99";
    const std::string token_word = "000000000000000000000000" + token.substr(2);
    const std::string to_word = "000000000000000000000000" + to.substr(2);
    const std::string payload = "0x" + selector + token_word + to_word + amount_hex_32bytes;

    picojson::object voucher;
    voucher["destination"] = picojson::value("0xBB7c5367B74544542F5cE553Ed0DF4B3efAfEEdD"); // SafeErc20Transfer
    voucher["payload"] = picojson::value(payload);

    auto response = cli.Post(
        "/delegate-call-voucher",
        picojson::value(voucher).serialize(),
        "application/json"
    );

    if (!response || response->status >= 400)
    {
        return "error";
    }

    return "ok";
}
```

</code></pre>
</TabItem>
</Tabs>

### Implementation Considerations

When implementing DELEGATECALL vouchers, consider the following:

1. **Storage Layout**: Since all storage operations happen in the Application contract, the storage layout of the target contract must be compatible with the Application contract's layout to prevent unintended storage collisions.

2. **Security**: Since DELEGATECALL operations execute code in the context of the Application contract, careful validation of the target contract and its code is essential to prevent malicious modifications to the Application's state.

3. **State Management**: All state changes occur in the Application contract's storage, making it the single source of truth for the application's state.

### Execution Context

In a DELEGATECALL voucher execution:

- The Application contract provides the execution context and storage
- The target contract provides only the logic to be executed
- All storage operations affect the Application contract's state
- msg.sender and msg.value from the original transaction are preserved

This architecture, where the Application contract maintains all state while being able to execute logic from other contracts, makes DELEGATECALL vouchers particularly useful for customizable logics while keeping all application state centralized in the Application contract.

## Epoch Configuration

An epoch refers to a specific period during which a batch of updates is processed off-chain, and upon agreement by validators, the finalized state is recorded on-chain.

Epoch Length is the number of blocks that make up an epoch. It determines how long each epoch lasts in terms of block counts. For instance, if an epoch length is set to 7200 blocks, the epoch will end once 7200 blocks have been processed. This length directly influences how frequently updates are finalized and recorded on the blockchain.

Vouchers and DELEGATECALL vouchers can be executed on the blockchain once the claim for the corresponding epoch has been accepted by the consensus, which is some time after the epoch closes (for example, after the claim staging period). This ensures that all state changes and logic executions are properly validated and recorded in the blockchain.

One common use of vouchers in Cartesi dApps is to withdraw assets. Users initiate asset withdrawals by generating vouchers, which can then be executed on the blockchain once the claim for the corresponding epoch has been accepted.

You can set the epoch length so that withdrawals (voucher execution) become possible sooner.

:::note epoch duration
[Refer to the documentation here](/get-started/cli-commands/#run) to manually configure epoch length during development.
:::
