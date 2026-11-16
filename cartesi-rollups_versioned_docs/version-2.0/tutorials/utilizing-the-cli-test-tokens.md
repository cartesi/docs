---
id: utilizing-the-cli-test-tokens
title: Utilizing test tokens in dev environment
resources:
---

## Introduction

The **Cartesi CLI** is one of the most important tools for developing applications with Cartesi. It provides a wide range of functionalities that simplify and automate the process of setting up, deploying, and interacting with your applications.

When you run your application using the `cartesi run` command, the CLI automatically spins up a **Local anvil network** in a Docker container. Within this network, all the required contracts are deployed such as the **InputBox contract**, your **application contract**, and **Portals contract**.  

In addition, the CLI also deploys **test token contracts** by default:

- ERC20 (`TestToken`)
- ERC721 (`TestNFT`)
- ERC1155 (`TestMultiToken`)
- ERC20 with 6 decimals, similar to USDC (`TestUsdc`)

These contracts have no owner, and their mint functions are public: any account can mint test tokens for itself or for another account, without the need for manual deployments. `cartesi send` and `cartesi deposit` send from devnet account 8, `0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f`, by default, and the samples on this page sign transactions with its private key. Do not use the first anvil account (`0xf39F...2266`) for your own transactions: the local node signs its claims with it, and transactions that compete with the node's for the same nonce can be dropped. More details about the different addresses provided by anvil can be found on the [Anvil official Docs](https://getfoundry.sh/anvil/overview#getting-started).

This tutorial will guide you through **using these default tokens** effectively while developing in a local devnet environment.

## Tokens basic Information

The following table lists the default test tokens deployed by the CLI:

| Token         | keyword                                   | Value                                         |
| --------------|-------------------------------------------|-----------------------------------------------|
| ERC20 Token   | Address book entry                        | TestToken                                     |
|               | Token Name                                | Fungible                                      |
|               | Token Symbol                              | FUN                                           |
|               | Token Decimal                             | 18                                            |
|               | Token Address                             | 0x86EA17052C8e335Ad830B54EF566274EAB46B852    |
| ERC721 Token  | Address book entry                        | TestNFT                                       |
|               | Token Name                                | Non-fungible                                  |
|               | Token Symbol                              | NFT                                           |
|               | Token Address                             | 0x0761b8e3aB06F458632974393C48765E6Ddc61bB    |
| ERC1155 Token | Address book entry                        | TestMultiToken                                |
|               | Token URI                                 | `https://test-multi-token.com/{id}.json`      |
|               | Token Address                             | 0xAaE893D28b7645B5E09bc16688dddd451aC89C19    |
| ERC20 Token   | Address book entry                        | TestUsdc                                      |
|               | Token Name                                | USD Coin                                      |
|               | Token Symbol                              | USDC                                          |
|               | Token Decimal                             | 6                                             |
|               | Token Address                             | 0x7a051EDffC0884cd88d4a377F4C87BE074CF6c81    |

These are the addresses deployed by Cartesi CLI 2.0.0-alpha.42. You can view the token and portal addresses of your CLI version at any time by running the following command from your project directory:

```bash
cartesi address-book
```

To print a single address, pass the name of its entry, for example `cartesi address-book TestToken`. The samples on this page use this form to read the token, portal and application addresses.

## ERC20 Test Token

The ERC20 `TestToken` is based on the OpenZeppelin ERC20 implementation. It is deployed on the anvil devnet together with the Cartesi contracts and starts with a total supply of zero, so you mint the tokens you need before you transfer them to other wallets or deposit them to your applications. Balances last only while your anvil devnet is running, as these transactions reset every time you restart your anvil devnet, or stop your application using the Cartesi CLI.

### Minting ERC20 Test Tokens

`TestToken` has two public mint functions:

- `mint(uint256 value)` mints `value` tokens to the caller.
- `mint(address to, uint256 value)` mints `value` tokens to the address `to`.

Amounts are expressed in the smallest unit of the token, which has 18 decimals, so `1000000000000000000000` is 1000 FUN.

#### Using Cast Command

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <testTokenContract address> "mint(uint256)" <token amount> --rpc-url <rpc_url> --private-key <private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
TEST_TOKEN=$(cartesi address-book TestToken)
cast send $TEST_TOKEN "mint(uint256)" 1000000000000000000000 --rpc-url http://127.0.0.1:6751/anvil --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
```

</code></pre>
</TabItem>

</Tabs>

The above command mints 1000 FUN to devnet account 8, `0x23618e...21E8f`, the address of the private key that signs the transaction. To mint tokens to another wallet, call `mint(address,uint256)` with the receiver's address instead, for example `cast send $TEST_TOKEN "mint(address,uint256)" 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 1000000000000000000000 --rpc-url http://127.0.0.1:6751/anvil --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97`.

### Transferring the ERC20 Test Token to other wallets

When testing interactions that require multiple addresses (e.g., deposits from different users), you may need to transfer tokens from one account to other wallets; you can also mint tokens directly to those wallets as shown above.
For this example, we’ll use the second Anvil address as the recipient. You can change the recipient to any address of your choice.

#### Using Cast Command

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <testTokenContract address> "transfer(address,uint256)" <receivers address> <token amount> --rpc-url <rpc_url> --private-key <private key>
```


</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
TEST_TOKEN=$(cartesi address-book TestToken)
cast send $TEST_TOKEN "transfer(address,uint256)" 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 202000000000000000000 --rpc-url http://127.0.0.1:6751/anvil --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
```

</code></pre>
</TabItem>

</Tabs>

The above command calls the `transfer(address,uint256)` in the `TestToken` contract `0x86EA...B852`. The command passes the following argument to the function: `receivers address= 0x709979...c79C8`and `amount= 202000000000000000000` (202 FUN). While you can always change the amount argument to match what you intend to deposit to your application, the private key `0xdbda182...a67b97` must belong to the wallet that holds the tokens, here devnet account 8, which minted them in the previous step.

### Depositing the ERC20 Test Token to your application

Similar to mainnet, applications undergoing development or testing on devnet can also receive erc20 tokens deposit, it is essential that your application includes the proper logic to receive and also record token deposit. This example will guide you through the process of depositing the test token to your application and also how to properly decode the deposit data sent to your application.

There are two main approaches:

#### Using the CLI

- Ensure you have your Cartesi application running, then from project directory, open a terminal and run the below command:
  
``` bash
cartesi deposit
```

- Select ERC20 from the list of deposit options.

- The next menu requests for a token address, but has the `TestToken` address filled but grayed out, hit the enter button to use the `TestToken`.
  
- In the next menu, enter the amount to tokens, you intend to deposit then finally hit enter.
  
- This would trigger the approval process, then deposit the tokens to your application.

For a successful deposit process you should show logs similar to this:

```bash
✔ Select type of asset to deposit erc20
✔ Token address 0x86EA17052C8e335Ad830B54EF566274EAB46B852
✔ Amount (FUN) 202
✔ Approved 202 FUN
✔ Deposited 202 FUN to 0x9ec96ddfacdb3144d729ae433c05f1ef774aafab
```

The last address is the address of your application. You can also pass the amount and the token as arguments and skip the prompts, for example `cartesi deposit erc20 202 --token $(cartesi address-book TestToken)`. The CLI deposits from devnet account 8 by default; use the `--from <address>` option to deposit from another devnet account. If that address does not hold enough tokens, the command stops with `✖ Insufficient balance`, so mint tokens first as shown above.

#### Using Cast

It's also possible to use cast commands to deposit assets to your application, but this would require a more manual process of granting approval, then calling the deposit function in the `Erc20Portal` contract. Below is a step-by-step process to achieve this:

- Call the `testToken` contract to approve the `Erc20Portal` an equivalent of the amount of tokens you intend to deposit, using the below command

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <testsTokenContract address> "approve(address,uint256)" <Erc20Portal address> <Token amount> --rpc-url <RPC_URL> --private-key <Caller Private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
TEST_TOKEN=$(cartesi address-book TestToken)
ERC20_PORTAL=$(cartesi address-book Erc20Portal)
cast send $TEST_TOKEN "approve(address,uint256)" $ERC20_PORTAL 300000000000000000000 --rpc-url http://127.0.0.1:6751/anvil --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
```

</code></pre>
</TabItem>

</Tabs>

The snippet above is an example of how to approve the deposit of 300 test tokens (`300000000000000000000` in the smallest unit), `http://127.0.0.1:6751/anvil` is the anvil_rpc to the local devnet where the application contract is deployed, finally the private_key `0xdbda1821b805...5d620ea67b97` is the private key of devnet account 8, which holds the tokens minted earlier.

- Call the `depositErc20Tokens` function in the `Erc20Portal` contract, passing in the address of your contract along with the token address and amount of tokens deposited

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <Erc20Portal address> "depositErc20Tokens(address,address,uint256,bytes)" <testTokenContract address> <Application address> <token_Amount> <execution layer Data> --rpc-url <RPC_URL> --private-key <Caller Private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
APP_ADDRESS=$(cartesi address-book Application)
cast send $ERC20_PORTAL "depositErc20Tokens(address,address,uint256,bytes)" $TEST_TOKEN $APP_ADDRESS 300000000000000000000 0x --rpc-url http://127.0.0.1:6751/anvil --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
```

</code></pre>
</TabItem>

</Tabs>

The above command interacts with the `Erc20Portal`, which utilizes the allowance issued in the previous function to call the `transferFrom` function in the `TestToken` contract. This operation transfers the amount of tokens listed to the application contract, and calls the input box to send an input to your application. The `Application` entry of `cartesi address-book` is the address of the application that `cartesi run` deployed.

The next section covers implementations on your application to handle deposits.

#### Handling Deposited ERC20 tokens

One important part of the deposit workflow is the decoding of the inputs. It is an important and delicate process, requiring accurate decoding as errors in this section could lease to unaccounted deposits.

While the previous example, help deposit tokens to your applications, without proper logic implementation, your application will be unable to record and track tokens deposited by users. The below code snippet is a simple application designed to receive deposit calls, decode, then finally log the data it received. You can test the application through the following steps:

- Create a new JavaScript application, using the command:
  
<Tabs>
<TabItem value="Javascript" label="Javascript" default>
<pre><code>
```bash
cartesi create deposit-erc20 --template javascript
```
</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>
```bash
cartesi create deposit-erc20 --template rust
```
</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>
```bash
cartesi create deposit-erc20 --template python
```
</code></pre>
</TabItem>
</Tabs>

- CD into the new project then copy and paste the below code snippet into index page. The code compares the sender of each input with the `Erc20Portal` address printed by `cartesi address-book`.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

```JavaScript
import { Rollup } from "@cartesi/rollup";

// Erc20Portal address printed by `cartesi address-book`
const PORTAL_ADDRESS = "0x3332DE61a8BB9aC84893b2f552Fe81C9a6dC5419";

const rollup = new Rollup();

function parseDepositPayload(payload) {
  // token (20 bytes), sender (20 bytes), amount (32 bytes), execLayerData
  if (payload.length < 72) {
    throw new Error("Invalid deposit payload");
  }
  const token = `0x${payload.subarray(0, 20).toString("hex")}`;
  const depositor = `0x${payload.subarray(20, 40).toString("hex")}`;
  const amount = BigInt(`0x${payload.subarray(40, 72).toString("hex")}`);
  return [token, depositor, amount];
}

await rollup.run({
  advance(request) {
    console.log(
      `Received advance request from ${request.msgSender} with payload 0x${request.payload.toString("hex")}`,
    );

    if (request.msgSender.toLowerCase() === PORTAL_ADDRESS.toLowerCase()) {
      console.log("Handling portal deposit");
      const [token, depositor, amount] = parseDepositPayload(request.payload);
      console.log(`Token: ${token}, Depositor: ${depositor}, Amount: ${amount}`);

      // Handle deposit logic here
    } else {
      // Handle transaction request like a regular transaction
    }

    return true;
  },
  inspect(request) {
    console.log(
      `Received inspect request with payload 0x${request.payload.toString("hex")}`,
    );
  },
});
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

```Rust
use json::{object, JsonValue};
use primitive_types::{H160, U256};
use std::env;
use hex::FromHex;
use std::error::Error;
use std::io;

pub async fn parse_deposit_payload(
    payload: &str
) -> Result<(String, String, U256), Box<dyn Error>> {

    let clean = payload.trim().trim_start_matches("0x");

    let bytes: Vec<u8> = Vec::from_hex(clean).map_err(|e| -> Box<dyn Error> { e.into() })?;

    const TOKEN_ADDR_LEN: usize = 20;
    const DEPOSITOR_ADDR_LEN: usize = 20;
    const AMOUNT_LEN: usize = 32;
    const MIN_LEN: usize = TOKEN_ADDR_LEN + DEPOSITOR_ADDR_LEN + AMOUNT_LEN;

    if bytes.len() < MIN_LEN {
        return Err(io::Error::new(io::ErrorKind::InvalidData, "payload too short").into());
    }

    let token_addr_bytes = bytes.get(0..20)
        .ok_or_else(|| io::Error::new(io::ErrorKind::InvalidData, "token address slice"))?;
    let depositor_addr_bytes = bytes.get(20..40)
        .ok_or_else(|| io::Error::new(io::ErrorKind::InvalidData, "depositor address slice"))?;
    let token_amount_32 = bytes.get(40..72)
        .ok_or_else(|| io::Error::new(io::ErrorKind::InvalidData, "token id slice"))?;

    let token_address = format!("0x{}", hex::encode(token_addr_bytes));
    let depositor_address = format!("0x{}", hex::encode(depositor_addr_bytes));

    let token_amount = U256::from_big_endian(token_amount_32);

    Ok((token_address, depositor_address, token_amount))
}

pub fn format_erc20_18(amount: U256) -> String {
    let base = U256::from(10).pow(U256::from(18));
    let int = amount / base;
    let frac = amount % base;
    format!("{}.{:018}", int, frac) 
}

pub async fn handle_advance(
    _client: &hyper::Client<hyper::client::HttpConnector>,
    _server_addr: &str,
    request: JsonValue,
) -> Result<&'static str, Box<dyn std::error::Error>> {
    println!("Received advance request data {}", &request);
    let _payload = request["data"]["payload"]
        .as_str()
        .ok_or("Missing payload")?;

    let sender = request["data"]["metadata"]["msg_sender"]
        .as_str()
        .ok_or("Missing sender")?;

    let erc20_portal_address: &str = "0x3332DE61a8BB9aC84893b2f552Fe81C9a6dC5419";

    if sender.to_lowercase() == erc20_portal_address.to_lowercase() {
        println!("Received a message from the ERC20 Portal contract");
        match parse_deposit_payload(_payload).await {
            Ok((token, depositor, token_amount)) => {
                let formatted_amount = format_erc20_18(token_amount);
                println!("Token: {token}, Depositor: {depositor}, token_amount: {formatted_amount}");
            }
            Err(e) => {
                eprintln!("Failed to parse deposit payload: {}", e);
                return Err("reject".into());
            }
        } 
    }

    // TODO: add application logic here
    Ok("accept")
}

pub async fn handle_inspect(
    _client: &hyper::Client<hyper::client::HttpConnector>,
    _server_addr: &str,
    request: JsonValue,
) -> Result<&'static str, Box<dyn std::error::Error>> {
    println!("Received inspect request data {}", &request);
    let _payload = request["data"]["payload"]
        .as_str()
        .ok_or("Missing payload")?;
    // TODO: add application logic here
    Ok("accept")
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = hyper::Client::new();
    let server_addr = env::var("ROLLUP_HTTP_SERVER_URL")?;

    let mut status = "accept";
    loop {
        println!("Sending finish");
        let response = object! {"status" => status};
        let request = hyper::Request::builder()
            .method(hyper::Method::POST)
            .header(hyper::header::CONTENT_TYPE, "application/json")
            .uri(format!("{}/finish", &server_addr))
            .body(hyper::Body::from(response.dump()))?;
        let response = client.request(request).await?;
        println!("Received finish status {}", response.status());

        if response.status() == hyper::StatusCode::ACCEPTED {
            println!("No pending rollup request, trying again");
        } else {
            let body = hyper::body::to_bytes(response).await?;
            let utf = std::str::from_utf8(&body)?;
            let req = json::parse(utf)?;

            let request_type = req["request_type"]
                .as_str()
                .ok_or("request_type is not a string")?;
            status = match request_type {
                "advance_state" => handle_advance(&client, &server_addr[..], req).await?,
                "inspect_state" => handle_inspect(&client, &server_addr[..], req).await?,
                &_ => {
                    eprintln!("Unknown request type");
                    "reject"
                }
            };
        }
    }
}

```

</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>

```python
from os import environ
import logging
import requests

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

def parse_deposit_payload(payload: str):
    
    clean = payload.strip().removeprefix("0x")

    bytes_data = bytes.fromhex(clean)

    TOKEN_ADDR_LEN = 20
    DEPOSITOR_ADDR_LEN = 20
    TOKEN_ID_LEN = 32
    EXPECTED_LEN = TOKEN_ADDR_LEN + DEPOSITOR_ADDR_LEN + TOKEN_ID_LEN
    if len(bytes_data) < EXPECTED_LEN:
        raise ValueError(f"Invalid payload length: expected {EXPECTED_LEN}, got {len(bytes_data)}")

    token_addr_bytes = bytes_data[0:TOKEN_ADDR_LEN]
    depositor_addr_bytes = bytes_data[TOKEN_ADDR_LEN:TOKEN_ADDR_LEN + DEPOSITOR_ADDR_LEN]
    token_amount_32 = bytes_data[TOKEN_ADDR_LEN + DEPOSITOR_ADDR_LEN:EXPECTED_LEN]

    token_address = "0x" + token_addr_bytes.hex()
    depositor_address = "0x" + depositor_addr_bytes.hex()

    token_amount = int.from_bytes(token_amount_32, byteorder="big")

    return [token_address, depositor_address, token_amount]

def format_erc20_18(amount: int) -> str:
    base = 10 ** 18
    integer_part = amount // base
    fractional_part = amount % base
    return f"{integer_part}.{fractional_part:018d}"

def handle_advance(data):
    logger.info(f"Received advance request data {data}")
    sender = data["metadata"]["msg_sender"]
    payload = data["payload"]
    ERC20_PORTAL_ADDRESS = "0x3332DE61a8BB9aC84893b2f552Fe81C9a6dC5419";
    
    if sender.lower() == ERC20_PORTAL_ADDRESS.lower():
        try:
            [token, depositor, token_amount] = parse_deposit_payload(payload)
            formated_token = format_erc20_18(token_amount)
            logger.info(f"Token: {token}, Depositor: {depositor}, token_amount: {formated_token}")
        except ValueError as e:
            logger.error(f"Failed to parse deposit payload: {e}")

    return "accept"


def handle_inspect(data):
    logger.info(f"Received inspect request data {data}")
    return "accept"


handlers = {
    "advance_state": handle_advance,
    "inspect_state": handle_inspect,
}

finish = {"status": "accept"}

while True:
    logger.info("Sending finish")
    response = requests.post(rollup_server + "/finish", json=finish)
    logger.info(f"Received finish status {response.status_code}")
    if response.status_code == 202:
        logger.info("No pending rollup request, trying again")
    else:
        rollup_request = response.json()
        data = rollup_request["data"]
        handler = handlers[rollup_request["request_type"]]
        finish["status"] = handler(rollup_request["data"])

```

</code></pre>
</TabItem>

</Tabs>

- Install necessary dependencies for rust or javasctipt by running the command:

<Tabs>

<TabItem value="Javascript" label="Javascript" default>
<pre><code>

```bash
# No extra package needed: the JavaScript handler decodes the
# payload with Node.js Buffer methods.
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

```bash
cargo add primitive-types@=0.14.0
cargo add hex@=0.4.3
```

</code></pre>
</TabItem>

</Tabs>

- Build and run your application using the command:

```bash
cartesi build

cartesi run
```

- In a new terminal, ensure you're in the directory of your Cartesi application then run deposit command and follow though on the prompts to deposit an ERC20 token.

```bash
cartesi deposit
```

On successful deposit your application should log an object containing the deposited token, depositor and finally the amount deposited.

Sample Log

```bash
Received advance request from 0x3332de61a8bb9ac84893b2f552fe81c9a6dc5419 with payload 0x86ea17052c8e335ad830b54ef566274eab46b85223618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f00000000000000000000000000000000000000000000000c93a592cfb2a00000
Handling portal deposit
Token: 0x86ea17052c8e335ad830b54ef566274eab46b852, Depositor: 0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f, Amount: 232000000000000000000
```

## ERC721 Test Tokens

The ERC721 test token, `TestNFT`, is an Openzeppelin implementation of an ERC721 token. Like the other test tokens, it has no owner and its mint functions are public, so any account can mint, transfer and also deposit these tokens to other address as well as your application. In the example below, we'll be covering minting, transferring and finally depositing `TestNFT` tokens.

### Minting the ERC721 Test Tokens

`TestNFT` has two public mint functions: `mint(uint256 tokenId)` mints the token to the caller, and `mint(address to, uint256 tokenId)` mints it to the address `to`. Each token ID can be minted only once. The contract does not store token URIs, so `tokenURI` returns an empty string.

#### Using Cast

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <testNFT address> "mint(address,uint256)" <receivers address> <token id> --rpc-url <rpc_url> --private-key <caller private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
TEST_NFT=$(cartesi address-book TestNFT)
cast send $TEST_NFT "mint(address,uint256)" 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f 1 --rpc-url http://127.0.0.1:6751/anvil --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
```

</code></pre>
</TabItem>

</Tabs>

The above example calls the `mint` function in the `TestNFT` contract `0x0761b8...Ddc61bB` specifying the receivers address `0x23618e...1E8f` and the token id `1`. The receivers address and token ID specified above can be changed to match your test case, and any funded account can sign the transaction. The next sections also use the token IDs `2` and `3`; mint them the same way before you follow along.

### Transferring The ERC721 Test Tokens

#### Using Cast

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <testNFT address> "transferFrom(address,address,uint256)" <senders address> <receivers address> <token id>--rpc-url http://127.0.0.1:6751/anvil --private-key <caller private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
TEST_NFT=$(cartesi address-book TestNFT)
cast send $TEST_NFT "transferFrom(address,address,uint256)" 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 1 --rpc-url http://127.0.0.1:6751/anvil --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
```

</code></pre>
</TabItem>

</Tabs>

This command utilizes cast to call the `transferFrom` function in the `TestNFT` contract `0x0761b8...Ddc61bB`. The function takes the following arguments: senders `address=0x23618e...21E8f`, `receivers address = 0x709979...dc79C8` and `token_id = 1`. While the function arguments passed can be modified, it's important that the senders address is the address of the wallet which owns the token with the token ID specified, and also that the private key passed is correct private key for the senders' wallet address

### Depositing the ERC721 Test Tokens

Depositing the ERC721 test tokens follow a similar process with depositing ERC20 tokens, this can be done either through cast or through the Cartesi CLI. Cast offers a more manual approach while using the CLI automates and simplifies the process.

#### Using the CLI

- Ensure you have your Cartesi application running, then from project directory, open a terminal and run the below command:
  
``` bash
cartesi deposit
```

- Select ERC721 from the list of available transfer options.

- The next menu requests for token ID, pass the ID of the token you intend to deposit.

- The next menu requests for a token address, but has the `TestNFT` address filled but grayed out, hit the enter button to use the `TestNFT`, or enter the address of another deployed token.

- This will trigger the approval process, if successful it'll proceed to trigger the deposit process, then transfer the tokens to your application.
  
For a successful deposit process you should get a log similar to this below:

```bash
✔ Select type of asset to deposit erc721
✔ Token ID 2
✔ Token address 0x0761b8e3aB06F458632974393C48765E6Ddc61bB
✔ Approved undefined NFT
✔ Deposited undefined NFT to 0x9ec96ddfacdb3144d729ae433c05f1ef774aafab
```

When you enter the token ID at the prompt, the CLI prints `undefined` in place of the token ID in the last two lines; the deposit itself is not affected. To get the full message and skip the prompts, pass the token ID and address as arguments, for example `cartesi deposit erc721 2 --token $(cartesi address-book TestNFT)`, which prints `✔ Approved 2 NFT` and `✔ Deposited 2 NFT to <application address>`.

#### Using Cast

It's also possible to deposit the ERC721 test tokens to your application using Cast, this process, requires a more manual approach and happens in 2 phases, one is granting approval to the `Erc721Portal` then the second is calling the `depositErc721Token` function in the `Erc721Portal` contract. Below is a step-by-step process for this:

- Grant the `Erc721Portal` contract approval

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <testNFT address> "setApprovalForAll(address,bool)" <Erc721Portal address> <approved status> --rpc-url <RPC_URL> --private-key <Caller Private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
TEST_NFT=$(cartesi address-book TestNFT)
ERC721_PORTAL=$(cartesi address-book Erc721Portal)
cast send $TEST_NFT "setApprovalForAll(address,bool)" $ERC721_PORTAL true --rpc-url http://127.0.0.1:6751/anvil --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
```

</code></pre>
</TabItem>

</Tabs>

The above command calls the `TestNFT` contract `0x0761b8...Ddc61bB` to approve the `Erc721Portal` (address read from `cartesi address-book`) to withdraw tokens to be deposited to your application, the arguments listed above should be the same if you intend to deposit the `testNFT` token, for other ERC721 tokens, then you could change the token address to match the tokens you intend to transfer.

- Call the `depositErc721Token` function in the `Erc721Portal` contract

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <Erc721Portal address> "depositErc721Token(address,address,uint256,bytes,bytes)" <testNFT Contract address> <Application address>  <token_Id> <base layer Data>  <execution layer Data> --rpc-url <RPC_URL> --private-key <Caller Private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
APP_ADDRESS=$(cartesi address-book Application)
cast send $ERC721_PORTAL "depositErc721Token(address,address,uint256,bytes,bytes)" $TEST_NFT $APP_ADDRESS 3 0x 0x --rpc-url http://127.0.0.1:6751/anvil --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
```

</code></pre>
</TabItem>

</Tabs>

From the above command we call the `depositErc721Token` function in the `Erc721Portal` contract, passing the `TestNFT` contract `0x0761b8...Ddc61bB`, the application address read from `cartesi address-book`, the token_id `3` and finally the optional baseLayer and executionLayer data `0x` and `0x`. For this implementation it's expected that the token_id passed to the function should already be minted and owned by the wallet whose private key is used to sign the transaction.

#### Handling Deposited ERC721 tokens

The below example is a process flow to setup and test a simple application designed to receive deposit input, decode, then finally log the data it received. You can run the application through the following steps:

- Create a new JavaScript application, using the command:

<Tabs>
<TabItem value="Javascript" label="Javascript" default>
<pre><code>
```bash
cartesi create deposit-erc721 --template javascript
```
</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>
```bash
cartesi create deposit-erc721 --template rust
```
</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>
```bash
cartesi create deposit-erc721 --template python
```
</code></pre>
</TabItem>
</Tabs>

- CD into the new project then, copy and paste the below code snippet into the index file. The code compares the sender of each input with the `Erc721Portal` address printed by `cartesi address-book`.

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

```javascript
import { Rollup } from "@cartesi/rollup";

// Erc721Portal address printed by `cartesi address-book`
const ERC721_PORTAL_ADDRESS = "0x397c352d18DFf47CC8a6143403142cf7afd5Ff7E";

const rollup = new Rollup();

function parseDepositPayload(payload) {
  // token (20 bytes), sender (20 bytes), tokenId (32 bytes), ABI-encoded data
  if (payload.length < 72) {
    throw new Error("Invalid deposit payload");
  }
  const token = `0x${payload.subarray(0, 20).toString("hex")}`;
  const depositor = `0x${payload.subarray(20, 40).toString("hex")}`;
  const tokenId = BigInt(`0x${payload.subarray(40, 72).toString("hex")}`);
  return [token, depositor, tokenId];
}

await rollup.run({
  advance(request) {
    console.log(
      `Received advance request from ${request.msgSender} with payload 0x${request.payload.toString("hex")}`,
    );

    if (
      request.msgSender.toLowerCase() === ERC721_PORTAL_ADDRESS.toLowerCase()
    ) {
      console.log("Handling portal deposit");
      const [token, depositor, tokenId] = parseDepositPayload(request.payload);
      console.log(
        `Token: ${token}, Depositor: ${depositor}, Token ID: ${tokenId}`,
      );

      // Handle deposit logic here
    } else {
      // Handle transaction request like a regular transaction
    }

    return true;
  },
  inspect(request) {
    console.log(
      `Received inspect request with payload 0x${request.payload.toString("hex")}`,
    );
  },
});
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

```Rust
use json::{object, JsonValue};
use std::env;
use hex::FromHex;
use std::error::Error;
use std::io;

pub async fn parse_deposit_payload(
    payload: &str
) -> Result<(String, String, u32), Box<dyn Error>> {

    let clean = payload.trim().trim_start_matches("0x");

    let bytes: Vec<u8> = Vec::from_hex(clean).map_err(|e| -> Box<dyn Error> { e.into() })?;

    const TOKEN_ADDR_LEN: usize = 20;
    const DEPOSITOR_ADDR_LEN: usize = 20;
    const TOKEN_ID_LEN: usize = 32;
    const MIN_LEN: usize = TOKEN_ADDR_LEN + DEPOSITOR_ADDR_LEN + TOKEN_ID_LEN;

    if bytes.len() < MIN_LEN {
        return Err(io::Error::new(io::ErrorKind::InvalidData, "payload too short").into());
    }

    let token_addr_bytes = bytes.get(0..20)
        .ok_or_else(|| io::Error::new(io::ErrorKind::InvalidData, "token address slice"))?;
    let depositor_addr_bytes = bytes.get(20..40)
        .ok_or_else(|| io::Error::new(io::ErrorKind::InvalidData, "depositor address slice"))?;
    let token_id_32 = bytes.get(40..72)
        .ok_or_else(|| io::Error::new(io::ErrorKind::InvalidData, "token id slice"))?;

    let token_address = format!("0x{}", hex::encode(token_addr_bytes));
    let depositor_address = format!("0x{}", hex::encode(depositor_addr_bytes));

    let last4: [u8; 4] = token_id_32[28..32].try_into().unwrap();
    let token_id = u32::from_be_bytes(last4);

    Ok((token_address, depositor_address, token_id))
}

pub async fn handle_advance(
    _client: &hyper::Client<hyper::client::HttpConnector>,
    _server_addr: &str,
    request: JsonValue,
) -> Result<&'static str, Box<dyn std::error::Error>> {
    println!("Received advance request data {}", &request);
    let _payload = request["data"]["payload"]
        .as_str()
        .ok_or("Missing payload")?;

    let sender = request["data"]["metadata"]["msg_sender"]
        .as_str()
        .ok_or("Missing sender")?;

    let erc721_portal_address: &str = "0x397c352d18DFf47CC8a6143403142cf7afd5Ff7E";

    if sender.to_lowercase() == erc721_portal_address.to_lowercase() {
        println!("Received a message from the ERC721 Portal contract");
        match parse_deposit_payload(_payload).await {
            Ok((token, depositor, token_id)) => {
                println!("Token: {token}, Depositor: {depositor}, Token_id: {token_id}");
            }
            Err(e) => {
                eprintln!("Failed to parse deposit payload: {}", e);
                return Err("reject".into());
            }
        } 
    }

    // TODO: add application logic here
    Ok("accept")
}

pub async fn handle_inspect(
    _client: &hyper::Client<hyper::client::HttpConnector>,
    _server_addr: &str,
    request: JsonValue,
) -> Result<&'static str, Box<dyn std::error::Error>> {
    println!("Received inspect request data {}", &request);
    let _payload = request["data"]["payload"]
        .as_str()
        .ok_or("Missing payload")?;
    // TODO: add application logic here
    Ok("accept")
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = hyper::Client::new();
    let server_addr = env::var("ROLLUP_HTTP_SERVER_URL")?;

    let mut status = "accept";
    loop {
        println!("Sending finish");
        let response = object! {"status" => status};
        let request = hyper::Request::builder()
            .method(hyper::Method::POST)
            .header(hyper::header::CONTENT_TYPE, "application/json")
            .uri(format!("{}/finish", &server_addr))
            .body(hyper::Body::from(response.dump()))?;
        let response = client.request(request).await?;
        println!("Received finish status {}", response.status());

        if response.status() == hyper::StatusCode::ACCEPTED {
            println!("No pending rollup request, trying again");
        } else {
            let body = hyper::body::to_bytes(response).await?;
            let utf = std::str::from_utf8(&body)?;
            let req = json::parse(utf)?;

            let request_type = req["request_type"]
                .as_str()
                .ok_or("request_type is not a string")?;
            status = match request_type {
                "advance_state" => handle_advance(&client, &server_addr[..], req).await?,
                "inspect_state" => handle_inspect(&client, &server_addr[..], req).await?,
                &_ => {
                    eprintln!("Unknown request type");
                    "reject"
                }
            };
        }
    }
}

```

</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>

```python
from os import environ
import logging
import requests

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

def parse_deposit_payload(payload: str):
    
    clean = payload.strip().removeprefix("0x")

    bytes_data = bytes.fromhex(clean)

    TOKEN_ADDR_LEN = 20
    DEPOSITOR_ADDR_LEN = 20
    TOKEN_ID_LEN = 32
    EXPECTED_LEN = TOKEN_ADDR_LEN + DEPOSITOR_ADDR_LEN + TOKEN_ID_LEN
    if len(bytes_data) < EXPECTED_LEN:
        raise ValueError(f"Invalid payload length: expected {EXPECTED_LEN}, got {len(bytes_data)}")

    token_addr_bytes = bytes_data[0:TOKEN_ADDR_LEN]
    depositor_addr_bytes = bytes_data[TOKEN_ADDR_LEN:TOKEN_ADDR_LEN + DEPOSITOR_ADDR_LEN]
    token_id_32 = bytes_data[TOKEN_ADDR_LEN + DEPOSITOR_ADDR_LEN:EXPECTED_LEN]

    token_address = "0x" + token_addr_bytes.hex()
    depositor_address = "0x" + depositor_addr_bytes.hex()

    token_id = int.from_bytes(token_id_32[28:32], byteorder="big")

    return [token_address, depositor_address, token_id]

def handle_advance(data):
    logger.info(f"Received advance request data {data}")
    sender = data["metadata"]["msg_sender"]
    payload = data["payload"]
    ERC721_PORTAL_ADDRESS = "0x397c352d18DFf47CC8a6143403142cf7afd5Ff7E";
    
    if sender.lower() == ERC721_PORTAL_ADDRESS.lower():
        try:
            [token, depositor, token_id] = parse_deposit_payload(payload)
            logger.info(f"Token: {token}, Depositor: {depositor}, Token_id: {token_id}")
        except ValueError as e:
            logger.error(f"Failed to parse deposit payload: {e}")

    return "accept"


def handle_inspect(data):
    logger.info(f"Received inspect request data {data}")
    return "accept"


handlers = {
    "advance_state": handle_advance,
    "inspect_state": handle_inspect,
}

finish = {"status": "accept"}

while True:
    logger.info("Sending finish")
    response = requests.post(rollup_server + "/finish", json=finish)
    logger.info(f"Received finish status {response.status_code}")
    if response.status_code == 202:
        logger.info("No pending rollup request, trying again")
    else:
        rollup_request = response.json()
        data = rollup_request["data"]
        handler = handlers[rollup_request["request_type"]]
        finish["status"] = handler(rollup_request["data"])

```

</code></pre>
</TabItem>

</Tabs>

- Install necessary dependencies for rust or javascript by running the command:

<Tabs>

<TabItem value="Javascript" label="Javascript" default>
<pre><code>

```bash
# No extra package needed: the JavaScript handler decodes the
# payload with Node.js Buffer methods.
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

```bash
cargo add hex@=0.4.3
```

</code></pre>
</TabItem>

</Tabs>

- Build and run your application using the command:

```bash
cartesi build

cartesi run
```

- In a new terminal, ensure you're in the directory of your Cartesi application then run deposit command and follow though on the prompts to deposit an ERC721 token.

```bash
cartesi deposit
```

On successful deposit your application should log an object containing the deposited token, depositor and finally the amount deposited.

Sample Log

```bash
Received advance request from 0x397c352d18dff47cc8a6143403142cf7afd5ff7e with payload 0x0761b8e3ab06f458632974393c48765e6ddc61bb23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f000000000000000000000000000000000000000000000000000000000000000b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
Handling portal deposit
Token: 0x0761b8e3ab06f458632974393c48765e6ddc61bb, Depositor: 0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f, Token ID: 11
```

## ERC1155 Tokens

The ERC1155 test token is also an Openzeppelin implementation of an ERC1155 token called `TestMultiToken`. Like the other two, it has no owner and its mint functions are public, and its metadata URI is `https://test-multi-token.com/{id}.json`. Below is a guide on minting, transferring and depositing this token to other wallets and also your Cartesi application.

### Minting ERC1155 Test Tokens

Minting the ERC1155 token issues new tokens to a selected wallet address. `TestMultiToken` has four public mint functions: `mint(uint256 id, uint256 value)` and `mintBatch(uint256[] ids, uint256[] values)` mint to the caller, while `mint(address to, uint256 id, uint256 value)` and `mintBatch(address to, uint256[] ids, uint256[] values)` mint to the address `to`. None of them takes a `data` argument.

#### Using Cast

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <TestMultiToken contract address> "mint(address,uint256,uint256)" <receivers address> <token_id> <Token_amount> --rpc-url <RPC_URL> --private-key <Caller Private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
TEST_MULTI_TOKEN=$(cartesi address-book TestMultiToken)
cast send $TEST_MULTI_TOKEN "mint(address,uint256,uint256)" 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f 5 10 --rpc-url http://127.0.0.1:6751/anvil --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
```

</code></pre>
</TabItem>

</Tabs>

In the above example we call the `mint` function in the `TestMultiToken` contract `0xAaE8...9C19`, to mint `10` units of the token with id `5` to the receivers address `0x23618e...1E8f`. The function arguments passed to this function can be modified to match your test case, and any funded account can sign the transaction.

### Transferring ERC1155 Test Tokens

#### Using Cast

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <TestMultiToken contract address> "safeTransferFrom(address,address,uint256,uint256,bytes)" <senders address> <receivers address> <token_id> <Token_amount> <data> --rpc-url <RPC_URL> --private-key <Caller Private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
TEST_MULTI_TOKEN=$(cartesi address-book TestMultiToken)
cast send $TEST_MULTI_TOKEN "safeTransferFrom(address,address,uint256,uint256,bytes)" 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 5 1 0x --rpc-url http://127.0.0.1:6751/anvil --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
```

</code></pre>
</TabItem>

</Tabs>

The above command interacts with the `safeTransferFrom` function of the `TestMultiToken` contract `0xAaE8...9C19`. The command transfers `1` unit of the token with id `5` from the sender address `0x23618e...1E8f` to the receiver address `0x7099...dc79C8`, this transaction is signed using the private key for the sender address specified.

### Depositing ERC1155 Tokens

#### Using The CLI

- Run your Cartesi application.
  
- From the project directory, open a terminal and run:

```bash
cartesi deposit
```

- From the available options, select `erc1155-single` if you intend to deposit a single token, or select `erc1155-batch` if you're depositing multiple tokens at once.
  
- Accept the pre-filled `TestMultiToken` address (or enter another ERC1155 token address).
  
- Enter the ID of the token you intend to deposit, if multiple you can add all of their ID's separated by commas.

- In the next menu enter the amount of tokens you intend to deposit (separate them by comma's if multiple).

- The CLI would automatically run the approval then the deposit process for the tokens. On successful deposit you should see logs similar to this:

```bash
✔ Select type of asset to deposit erc1155-single
✔ Token address 0xAaE893D28b7645B5E09bc16688dddd451aC89C19
✔ Token ID 5
✔ Amount of token ID 5 1
✔ Approved ERC1155Portal
✔ Deposited 1 units of token id 5 to 0x9ec96ddfacdb3144d729ae433c05f1ef774aafab
```

#### Using Cast

- Grant the `Erc1155SinglePortal` contract approval

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <TestMultiToken contract address> "setApprovalForAll(address,bool)" <Erc1155SinglePortal address> <approved status> --rpc-url <RPC_URL> --private-key <Caller Private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
TEST_MULTI_TOKEN=$(cartesi address-book TestMultiToken)
ERC1155_SINGLE_PORTAL=$(cartesi address-book Erc1155SinglePortal)
cast send $TEST_MULTI_TOKEN "setApprovalForAll(address,bool)" $ERC1155_SINGLE_PORTAL true --rpc-url http://127.0.0.1:6751/anvil --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
```

</code></pre>
</TabItem>

</Tabs>

- Call the `depositSingleErc1155Token` function in the `Erc1155SinglePortal` contract

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <Erc1155SinglePortal Contract address> "depositSingleErc1155Token(address,address,uint256,uint256,bytes,bytes)" <TestMultiToken Contract address> <Application address> <token_id> <Token_amount> <base layer Data>  <execution layer Data>  --rpc-url <RPC_URL> --private-key <Caller Private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
APP_ADDRESS=$(cartesi address-book Application)
cast send $ERC1155_SINGLE_PORTAL "depositSingleErc1155Token(address,address,uint256,uint256,bytes,bytes)" $TEST_MULTI_TOKEN $APP_ADDRESS 5 1 0x 0x --rpc-url http://127.0.0.1:6751/anvil --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
```

</code></pre>
</TabItem>

</Tabs>

#### Handling Deposited ERC1155 tokens

This sections provides sample codes and also a step by step guide to design and test the deposit flow for ERC1155 tokens.

- Create a new JavaScript application, using the command:

<Tabs>
<TabItem value="Javascript" label="Javascript" default>
<pre><code>
```bash
cartesi create deposit-erc1155 --template javascript
```
</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>
```bash
cartesi create deposit-erc1155 --template rust
```
</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>
```bash
cartesi create deposit-erc1155 --template python
```
</code></pre>
</TabItem>
</Tabs>

- CD into the new project then, copy and paste the below code snippet into the index file. The code compares the sender of each input with the `Erc1155SinglePortal` address printed by `cartesi address-book`.

<Tabs>
<TabItem value="Javascript" label="Javascript" default>
<pre><code>

```Javascript
import { Rollup } from "@cartesi/rollup";

// Erc1155SinglePortal address printed by `cartesi address-book`
const ERC1155_SINGLE_PORTAL_ADDRESS =
  "0x585F56351A66f131E176a345662215C772f80451";

const rollup = new Rollup();

function parseDepositPayload(payload) {
  // token (20 bytes), sender (20 bytes), tokenId (32 bytes), amount (32 bytes),
  // ABI-encoded data
  if (payload.length < 104) {
    throw new Error("Invalid deposit payload");
  }
  const token = `0x${payload.subarray(0, 20).toString("hex")}`;
  const depositor = `0x${payload.subarray(20, 40).toString("hex")}`;
  const tokenId = BigInt(`0x${payload.subarray(40, 72).toString("hex")}`);
  const amount = BigInt(`0x${payload.subarray(72, 104).toString("hex")}`);
  return [token, depositor, tokenId, amount];
}

await rollup.run({
  advance(request) {
    console.log(
      `Received advance request from ${request.msgSender} with payload 0x${request.payload.toString("hex")}`,
    );

    if (
      request.msgSender.toLowerCase() ===
      ERC1155_SINGLE_PORTAL_ADDRESS.toLowerCase()
    ) {
      console.log("Handling portal deposit");
      const [token, depositor, tokenId, amount] = parseDepositPayload(
        request.payload,
      );
      console.log(
        `Token: ${token}, Depositor: ${depositor}, Token ID: ${tokenId}, Amount: ${amount}`,
      );

      // Handle deposit logic here
    } else {
      // Handle transaction request like a regular transaction
    }

    return true;
  },
  inspect(request) {
    console.log(
      `Received inspect request with payload 0x${request.payload.toString("hex")}`,
    );
  },
});
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

```Rust
use json::{object, JsonValue};
use primitive_types::{H160, U256};
use std::env;
use hex::FromHex;
use std::error::Error;
use std::io;

pub async fn parse_deposit_payload(
    payload: &str
) -> Result<(String, String, U256, U256), Box<dyn Error>> {

    let clean = payload.trim().trim_start_matches("0x");

    let bytes: Vec<u8> = Vec::from_hex(clean).map_err(|e| -> Box<dyn Error> { e.into() })?;

    const TOKEN_ADDR_LEN: usize = 20;
    const DEPOSITOR_ADDR_LEN: usize = 20;
    const TOKEN_ID_LEN: usize = 32;
    const AMOUNT_LEN: usize = 32;
    const MIN_LEN: usize = TOKEN_ADDR_LEN + DEPOSITOR_ADDR_LEN + AMOUNT_LEN + TOKEN_ID_LEN;

    if bytes.len() < MIN_LEN {
        return Err(io::Error::new(io::ErrorKind::InvalidData, "payload too short").into());
    }

    let token_addr_bytes = bytes.get(0..20)
        .ok_or_else(|| io::Error::new(io::ErrorKind::InvalidData, "token address slice"))?;
    let depositor_addr_bytes = bytes.get(20..40)
        .ok_or_else(|| io::Error::new(io::ErrorKind::InvalidData, "depositor address slice"))?;
    let token_id_32 = bytes.get(40..72)
        .ok_or_else(|| io::Error::new(io::ErrorKind::InvalidData, "token id slice"))?;
    let token_amount_32 = bytes.get(72..104)
        .ok_or_else(|| io::Error::new(io::ErrorKind::InvalidData, "token id slice"))?;

    let token_address = format!("0x{}", hex::encode(token_addr_bytes));
    let depositor_address = format!("0x{}", hex::encode(depositor_addr_bytes));
    let token_id = U256::from_big_endian(token_id_32);
    let token_amount = U256::from_big_endian(token_amount_32);

    Ok((token_address, depositor_address, token_id, token_amount))
}

pub async fn handle_advance(
    _client: &hyper::Client<hyper::client::HttpConnector>,
    _server_addr: &str,
    request: JsonValue,
) -> Result<&'static str, Box<dyn std::error::Error>> {
    println!("Received advance request data {}", &request);
    let _payload = request["data"]["payload"]
        .as_str()
        .ok_or("Missing payload")?;

    let sender = request["data"]["metadata"]["msg_sender"]
        .as_str()
        .ok_or("Missing sender")?;

    let erc1155_portal_address: &str = "0x585F56351A66f131E176a345662215C772f80451";

    if sender.to_lowercase() == erc1155_portal_address.to_lowercase() {
        println!("Received a message from the ERC1155 Single Portal contract");
        match parse_deposit_payload(_payload).await {
            Ok((token, depositor, token_id, token_amount)) => {
                println!("Token: {token}, Depositor: {depositor}, token_id: {token_id}, token_amount: {token_amount}");
            }
            Err(e) => {
                eprintln!("Failed to parse deposit payload: {}", e);
                return Err("reject".into());
            }
        } 
    }
    // TODO: add application logic here
    Ok("accept")
}

pub async fn handle_inspect(
    _client: &hyper::Client<hyper::client::HttpConnector>,
    _server_addr: &str,
    request: JsonValue,
) -> Result<&'static str, Box<dyn std::error::Error>> {
    println!("Received inspect request data {}", &request);
    let _payload = request["data"]["payload"]
        .as_str()
        .ok_or("Missing payload")?;
    // TODO: add application logic here
    Ok("accept")
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = hyper::Client::new();
    let server_addr = env::var("ROLLUP_HTTP_SERVER_URL")?;

    let mut status = "accept";
    loop {
        println!("Sending finish");
        let response = object! {"status" => status};
        let request = hyper::Request::builder()
            .method(hyper::Method::POST)
            .header(hyper::header::CONTENT_TYPE, "application/json")
            .uri(format!("{}/finish", &server_addr))
            .body(hyper::Body::from(response.dump()))?;
        let response = client.request(request).await?;
        println!("Received finish status {}", response.status());

        if response.status() == hyper::StatusCode::ACCEPTED {
            println!("No pending rollup request, trying again");
        } else {
            let body = hyper::body::to_bytes(response).await?;
            let utf = std::str::from_utf8(&body)?;
            let req = json::parse(utf)?;

            let request_type = req["request_type"]
                .as_str()
                .ok_or("request_type is not a string")?;
            status = match request_type {
                "advance_state" => handle_advance(&client, &server_addr[..], req).await?,
                "inspect_state" => handle_inspect(&client, &server_addr[..], req).await?,
                &_ => {
                    eprintln!("Unknown request type");
                    "reject"
                }
            };
        }
    }
}
```

</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>

```python
from os import environ
import logging
import requests

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

def parse_deposit_payload(payload: str):
    
    clean = payload.strip().removeprefix("0x")

    bytes_data = bytes.fromhex(clean)

    TOKEN_ADDR_LEN = 20
    DEPOSITOR_ADDR_LEN = 20
    TOKEN_ID_LEN = 32
    AMOUNT_LEN = 32
    EXPECTED_LEN = TOKEN_ADDR_LEN + DEPOSITOR_ADDR_LEN + TOKEN_ID_LEN + AMOUNT_LEN
    if len(bytes_data) < EXPECTED_LEN:
        raise ValueError(f"Invalid payload length: expected {EXPECTED_LEN}, got {len(bytes_data)}")

    token_addr_bytes = bytes_data[0:20]
    depositor_addr_bytes = bytes_data[20:40]
    token_id_32 = bytes_data[40:72]
    token_amount_32 = bytes_data[72:104]

    token_address = "0x" + token_addr_bytes.hex()
    depositor_address = "0x" + depositor_addr_bytes.hex()
    token_id= int.from_bytes(token_id_32, byteorder="big")
    token_amount = int.from_bytes(token_amount_32, byteorder="big")

    return [token_address, depositor_address, token_id, token_amount]

def handle_advance(data):
    logger.info(f"Received advance request data {data}")
    sender = data["metadata"]["msg_sender"]
    payload = data["payload"]
    ERC1155_PORTAL_ADDRESS = "0x585F56351A66f131E176a345662215C772f80451";
    
    if sender.lower() == ERC1155_PORTAL_ADDRESS.lower():
        try:
            [token, depositor, token_id, token_amount] = parse_deposit_payload(payload)
            logger.info(f"Token: {token}, Depositor: {depositor}, token ID: {token_id} token_amount: {token_amount}")
        except ValueError as e:
            logger.error(f"Failed to parse deposit payload: {e}")
    return "accept"

def handle_inspect(data):
    logger.info(f"Received inspect request data {data}")
    return "accept"

handlers = {
    "advance_state": handle_advance,
    "inspect_state": handle_inspect,
}

finish = {"status": "accept"}

while True:
    logger.info("Sending finish")
    response = requests.post(rollup_server + "/finish", json=finish)
    logger.info(f"Received finish status {response.status_code}")
    if response.status_code == 202:
        logger.info("No pending rollup request, trying again")
    else:
        rollup_request = response.json()
        data = rollup_request["data"]
        handler = handlers[rollup_request["request_type"]]
        finish["status"] = handler(rollup_request["data"])
```

</code></pre>
</TabItem>

</Tabs>

- Install necessary dependencies for rust or javasctipt by running the command:

<Tabs>

<TabItem value="Javascript" label="Javascript" default>
<pre><code>

```bash
# No extra package needed: the JavaScript handler decodes the
# payload with Node.js Buffer methods.
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

```bash
cargo add primitive-types@=0.14.0
cargo add hex@=0.4.3
```

</code></pre>
</TabItem>

</Tabs>

- Build and run your application using the command:

```bash
cartesi build

cartesi run
```

- In a new terminal, ensure you're in the directory of your Cartesi application then run deposit command and follow though on the prompts to deposit an ERC1155 token.

```bash
cartesi deposit
```

On successful deposit your application should log an object containing the deposited token, depositor and finally the amount deposited.

Sample Log

```bash
[INFO  rollup_http_server::http_service] received new request of type ADVANCE
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 814 "-" "python-requests/2.31.0" 0.020416
INFO:__main__:Received finish status 200
INFO:__main__:Received advance request data {'metadata': {'chain_id': 31337, 'app_contract': '0x9ec96ddfacdb3144d729ae433c05f1ef774aafab', 'msg_sender': '0x585f56351a66f131e176a345662215c772f80451', 'block_number': 21, 'block_timestamp': 1757624870, 'prev_randao': '0x45c3ecf672b0c35d25c822ccb22f145f633feec5451438436f57fd310366df44', 'input_index': 0}, 'payload': '0xaae893d28b7645b5e09bc16688dddd451ac89c1923618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'}
INFO:__main__:Token: 0xaae893d28b7645b5e09bc16688dddd451ac89c19, Depositor: 0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f, token ID: 1 token_amount: 1
INFO:__main__:Sending finish
```

The JavaScript version logs the following for a deposit of one unit of token ID `5`:

```bash
Received advance request from 0x585f56351a66f131e176a345662215c772f80451 with payload 0xaae893d28b7645b5e09bc16688dddd451ac89c1923618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
Handling portal deposit
Token: 0xaae893d28b7645b5e09bc16688dddd451ac89c19, Depositor: 0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f, Token ID: 5, Amount: 1
```
