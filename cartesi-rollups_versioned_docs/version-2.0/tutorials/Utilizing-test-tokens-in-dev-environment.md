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

By default, these contracts are owned by the **Anvil's first wallet address**. This ensures developers have immediate access to and ownership over these tokens for testing purposes, without the need for manual deployments. More details about the different addresses provided by anvil can be found on the [Anvil official Docs](https://getfoundry.sh/anvil/overview#getting-started).

This tutorial will guide you through **using these default tokens** effectively while developing in a local devnet environment.

## Tokens basic Information

The following table lists the default test tokens deployed by the CLI:

| Token         | keyword                                   | Value                                         |
| --------------|-------------------------------------------|-----------------------------------------------|
| ERC20 Token   | Token Name                                | TestToken                                     |
|               | Token Symbol                              | TEST                                          |
|               | Token Decimal                             | 18                                            |
|               | Token Address                             | 0xFBdB734EF6a23aD76863CbA6f10d0C5CBBD8342C    |
|               | Contract Owner                            | 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266    |
| ERC721 Token  | Token Name                                | TestNFT                                       |
|               | Token Symbol                              | SUNN                                          |
|               | Token Address                             | 0xBa46623aD94AB45850c4ecbA9555D26328917c3B    |
|               | Contract Owner                            | 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266    |
| ERC1155 Token | Token Name                                | TestMultiToken                                |
|               | Token Address                             | 0xDC6d64971B77a47fB3E3c6c409D4A05468C398D2    |
|               | Contract Owner                            | 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266    |

You can also view these token addresses at any time using the CLI command:

```bash
cartesi address-book
```

## ERC20 Test Token

The ERC20 `TestToken` is based on the OpenZeppelin ERC20 implementation. It is deployed alongside your application contracts on the anvil devnet, with ownership assigned to the default anvil wallet `0xFBdB734EF6a23aD76863CbA6f10d0C5CBBD8342C`, ensuring that developers can readily access these test tokens without needing to manually deploy or transfer new token contracts. However, you can transfer these tokens to other wallets and also to your applications for the duration of which your anvil network is active as these transactions reset every time you restart your anvil devnet, or stop your application using the Cartesi CLI.

### Minting ERC20 Test Tokens

Minting new tokens on the `TestToken` is currently disabled, but at deployment `1000000000 * 10 units` of the token was minted to the default anvil wallet `0xFBdB734EF6a23aD76863CbA6f10d0C5CBBD8342C`, this amount should be more than suitable for testing your application. With that covered, we can proceed to transferring and also depositing these tokens to your application.

### Transferring the ERC20 Test Token to other wallets

When testing interactions that require multiple addresses (e.g., deposits from different users), you may need to transfer tokens from the owner account to other wallets.
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
cast send 0xFBdB734EF6a23aD76863CbA6f10d0C5CBBD8342C "transfer(address,uint256)" 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 202 --rpc-url http://127.0.0.1:6751/anvil --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

</code></pre>
</TabItem>

</Tabs>

The above command calls the `transfer(address,uint256)` in the `testToken` contract `0xFBdB7...8342C`. The command passes the following argument to the function: `receivers address= 0x709979...c79C8`and `amount= 202`. While you can always change the amount argument to match what you intend to deposit to your application, it's important to always maintain the same `testToken` contract as well as the private-key `0xac0974b...f2ff80`.

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
✔ Token address 0xFBdB734EF6a23aD76863CbA6f10d0C5CBBD8342C
✔ Amount (TEST) 202
✔ Approved 202 TEST
✔ Deposited 202 TEST to 0xba3347e79665924033beeb7362629ca7992897d9
```

#### Using Cast

It's also possible to use cast commands to deposit assets to your application, but this would require a more manual process of granting approval, then calling the deposit function in the ERC20Portal contract. Below is a step-by-step process to achieve this:

- Call the `testToken` contract to approve the `ERC20Portal` an equivalent of the amount of tokens you intend to deposit, using the below command

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <testsTokenContract address> "approve(address,uint256)" <ERC20Portal address> <Token amount> --rpc-url <RPC_URL> --private-key <Caller Private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
cast send 0xFBdB734EF6a23aD76863CbA6f10d0C5CBBD8342C "approve(address,uint256)" 0xc700D6aDd016eECd59d989C028214Eaa0fCC0051 300000000000000000000 --rpc-url http://127.0.0.1:6751/anvil --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

</code></pre>
</TabItem>

</Tabs>

The snippet above is an example of how to deposit 300 units of the test tokens, `http://127.0.0.1:6751/anvil` is the anvil_rpc to the local devnet where the application contract is deployed, finally the private_key `0xac0974bec39a17...e784d7bf4f2ff80` is the private key of the default anvil address which is also the owner of the erc20 test contract.

- Call the `depositERC20Tokens` function in the `ERC20Portal` contract, passing in the address of your contract along with the token address and amount of tokens deposited

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <ERC20Portal address> "depositERC20Tokens(address,address,uint256,bytes)" <testTokenContract address> <Application address> <token_Amount> <execution layer Data> --rpc-url <RPC_URL> --private-key <Caller Private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
cast send 0xc700D6aDd016eECd59d989C028214Eaa0fCC0051 "depositERC20Tokens(address,address,uint256,bytes)" 0xFBdB734EF6a23aD76863CbA6f10d0C5CBBD8342C 0xba3347e79665924033beeb7362629ca7992897d9 202 0x --rpc-url http://127.0.0.1:6751/anvil --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

</code></pre>
</TabItem>

</Tabs>

The above command interacts with the ERC20Portal which utilizes the allowance issued in the previous function to call the `transferFrom` function in the `testToken` contract. This operation transfers the amount of tokens listed to the application contract, and calls the input box to send an input to your application.

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

- CD into the new project then copy and paste the below code snippet into index page.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

```JavaScript
import { ethers } from "ethers";
import {
  getAddress,
} from "viem";

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

const PORTAL_ADDRESS = "0xc700D6aDd016eECd59d989C028214Eaa0fCC0051";


function parseDepositPayload(payload) {
    const tokenData = ethers.dataSlice(payload, 0, 20);
    const senderData = ethers.dataSlice(payload, 20, 40);
    const amountData = ethers.dataSlice(payload, 40, 72);

    if (!tokenData) {
      throw new Error("Invalid deposit payload");
    }
    return [getAddress(tokenData), getAddress(senderData), BigInt(amountData)];
  }

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  let payload = data.payload;
  const sender = data["metadata"]["msg_sender"];

  if (sender.toLowerCase() === PORTAL_ADDRESS.toLowerCase()) {
    console.log("Handling portal deposit");
    const [token, depositor, amount] = parseDepositPayload(payload);
    console.log(`Token: ${token}, Depositor: ${depositor}, Amount: ${amount}`);

    // Handle deposit logic here
  } else {
      // Handle Transaction request like a regular transaction
  }

  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
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

    let erc20_portal_address: &str = "0xc700D6aDd016eECd59d989C028214Eaa0fCC0051";

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
    ERC20_PORTAL_ADDRESS = "0xc700D6aDd016eECd59d989C028214Eaa0fCC0051";
    
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
npm install viem ethers
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

```bash
cargo add primitive_types
cargo add hex
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
[INFO  rollup_http_server::http_service] received new request of type ADVANCE
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 495 "-" "node" 0.032192
Received finish status 200
Received advance request data {"metadata":{"chain_id":13370,"app_contract":"0xba3347e79665924033beeb7362629ca7992897d9","msg_sender":"0xc700d6add016eecd59d989c028214eaa0fcc0051","block_number":823,"block_timestamp":1757042397,"prev_randao":"0xf1db9cff537dd607f721ef4aee7d2b516d4adb7fbb0d1c707b72344527e6893e","input_index":0},"payload":"0xfbdb734ef6a23ad76863cba6f10d0c5cbbd8342cf39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000000000000000000000000000c93a592cfb2a00000"}
Handling portal deposit
Token: 0xFBdB734EF6a23aD76863CbA6f10d0C5CBBD8342C, Depositor: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, Amount: 232000000000000000000
```

## ERC721 Test Tokens

The ERC721 test token is an Openzeppelin implementation of an ERC721 token, similar to other test tokens it's ownership is also set to the default address provided by anvil, therefore interactions with restricted functions on this contract would need to be signed by the default anvil private key `0xf39fd...b92266`. Using the right authorizations you could mint, transfer and also deposit these tokens to other address as well as your application. In the example below, we'll be covering minting, transferring and finally depositing `testNFT` tokens.

### Minting the ERC721 Test Tokens

#### Using Cast

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <testNFT address> "safeMint(address,uint256,string)" <receivers address> <token id> <token URI> --rpc-url <rpc_url> --private-key <caller private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
cast send 0xBa46623aD94AB45850c4ecbA9555D26328917c3B "safeMint(address,uint256,string)" 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 1 "https://example.com/metadata/1.json" --rpc-url http://127.0.0.1:6751/anvil --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

</code></pre>
</TabItem>

</Tabs>

The above example calls the `safeMint` function in the `testNFT` contract `0xBa4662...917c3B` specifying the receivers address `0xf39Fd6...2266`, the token id `1` and finally the URI for the token `https://example.com/metadata/1.json`. The receivers address, token ID and token URI specified above can all be changed to match your test case but, it's important that the `testNFT` address as well as the private_key be the same.

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
cast send 0xBa46623aD94AB45850c4ecbA9555D26328917c3B "transferFrom(address,address,uint256)" 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 2 --rpc-url http://127.0.0.1:6751/anvil --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

</code></pre>
</TabItem>

</Tabs>

This command utilizes cast to call the `transferFrom` function in the `TestNft` contract `0xBa4662...917c3B`. The function takes the following arguments: senders `address=0xf39Fd6...92266`, `receivers address = 0x709979...dc79C8` and `token_id = 2`. While the function arguments passed can be modified, it's important that the senders address is the address of the wallet which owns the token with the token ID specified, and also that the private key passed is correct private key for the senders' wallet address

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
✔ Token ID 1
✔ Token address 0xBa46623aD94AB45850c4ecbA9555D26328917c3B
✔ Approved undefined SUNN
✔ Deposited undefined SUNN to 0xba3347e79665924033beeb7362629ca7992897d9
```

#### Using Cast

It's also possible to deposit the ERC721 test tokens to your application using Cast, this process, requires a more manual approach and happens in 2 phases, one is granting approval to the ERC721Portal then the second is calling the `depositERC721Token` function in the ERC721Portal contract. Below is a step-by-step process for this:

- Grant the `ERC721Portal` contract approval

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <testNFT address> "setApprovalForAll(address,bool)" <ERC721Portal address> <approved status> --rpc-url <RPC_URL> --private-key <Caller Private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
cast send 0xBa46623aD94AB45850c4ecbA9555D26328917c3B "setApprovalForAll(address,bool)" 0xc700d52F5290e978e9CAe7D1E092935263b60051 true --rpc-url http://127.0.0.1:6751/anvil --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

</code></pre>
</TabItem>

</Tabs>

The above command calls the `testNFT` contract `0xBa46...8917c3B` to approve the `ERC721Portal` `0xc700d5...0051` to withdraw tokens to be deposited to your application, the arguments listed above should be the same if you intend to deposit the `testNFT` token, for other ERC721 tokens, then you could change the token address to match the tokens you intend to transfer.

- Call the `depositERC721Token` function in the ERC721Portal contract

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <ERC721Portal address> "depositERC721Token(address,address,uint256,bytes,bytes)" <testNFT Contract address> <Application address>  <token_Id> <base layer Data>  <execution layer Data> --rpc-url <RPC_URL> --private-key <Caller Private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
cast send 0xc700d52F5290e978e9CAe7D1E092935263b60051 "depositERC721Token(address,address,uint256,bytes,bytes)" 0xBa46623aD94AB45850c4ecbA9555D26328917c3B 0xba3347e79665924033beeb7362629ca7992897d9 8 0x 0x --rpc-url http://127.0.0.1:6751/anvil --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

</code></pre>
</TabItem>

</Tabs>

From the above command we call the `depositERC721Token` function in the `ERC721Portal` contract `0xc700...60051`, passing the `testNFT` contract `0xBa46...8917c3B`, the `Application contract address` `0x23eff...560fc`, the token_id `4` and finally the optional baseLayer and executionLayer data `0x` and `0x`. For this implementation it's expected that the token_id passed to the function should already be minted and owned by the wallet whose private key is used to sign the transaction.

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

- CD into the new project then, copy and paste the below code snippet into the index file.

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

```javascript
import { ethers } from "ethers";
import {
  getAddress,
} from "viem";

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

const ERC721_PORTAL_ADDRESS = "0xc700d52f5290e978e9cae7d1e092935263b60051";


function parseDepositPayload(payload) {
    const tokenData = ethers.dataSlice(payload, 0, 20);
    const senderData = ethers.dataSlice(payload, 20, 40);
    const tokenIdData = ethers.dataSlice(payload, 40, 72);

    if (!tokenData) {
      throw new Error("Invalid deposit payload");
    }
    return [getAddress(tokenData), getAddress(senderData), BigInt(tokenIdData)];
  }

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  let payload = data.payload;
  const sender = data["metadata"]["msg_sender"];

  if (sender.toLowerCase() === ERC721_PORTAL_ADDRESS.toLowerCase()) {
    console.log("Handling portal deposit");
    const [token, depositor, amount] = parseDepositPayload(payload);
    console.log(`Token: ${token}, Depositor: ${depositor}, Amount: ${amount}`);

    // Handle deposit logic here
  } else {
      // Handle Transaction request like a regular transaction
  }

  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();

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

    let erc721_portal_address: &str = "0xc700d52f5290e978e9cae7d1e092935263b60051";

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
    ERC721_PORTAL_ADDRESS = "0xc700d52f5290e978e9cae7d1e092935263b60051";
    
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
npm install viem ethers
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

```bash
cargo add hex
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
[INFO  rollup_http_server::http_service] received new request of type ADVANCE
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 753 "-" "node" 0.032320
Received finish status 200
Received advance request data {"metadata":{"chain_id":13370,"app_contract":"0xba3347e79665924033beeb7362629ca7992897d9","msg_sender":"0xc700d52f5290e978e9cae7d1e092935263b60051","block_number":24284,"block_timestamp":1757089398,"prev_randao":"0x1b76a6830d8a66d5908c517264984bde0ae7ecb9827d8ab4530066ce2a8f1ad0","input_index":0},"payload":"0xba46623ad94ab45850c4ecba9555d26328917c3bf39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000000000000000000000000000000000000000000b0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"}
Handling portal deposit
Token: 0xBa46623aD94AB45850c4ecbA9555D26328917c3B, Depositor: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, Token_id: 7
```

## ERC1155 Tokens

The ERC155 test token is also an Openzeppelin implementation of an ERC1155 token called `TestMultiToken`, like the other two, it is owned by the default anvil wallet and managed by the Cartesi CLI, below is a guide on, minting, transferring and depositing, this token to other wallets and also your Cartesi application.

### Minting ERC1155 Test Tokens

Minting the ERC1155 token issues new tokens to a selected wallet address, this function is restricted to just the owner of the contract, so it's necessary that the transaction be signed by the default anvil private key.

#### Using Cast

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <TestMultiToken contract address> "mint(address,uint256,uint256,bytes)" <receivers address> <token_id> <Token_amount> <data> --rpc-url <RPC_URL> --private-key <Caller Private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
cast send 0xDC6d64971B77a47fB3E3c6c409D4A05468C398D2 "mint(address,uint256,uint256,bytes)" 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 1 1 0x --rpc-url http://127.0.0.1:6751/anvil --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

</code></pre>
</TabItem>

</Tabs>

The above example we call the `mint` function in the `TestMultiToken` contract `0xDC6d...98D2`, to mint `1` unit of the token with id `1` to the receivers address `0xf39F...92266`. The function arguments passed to this function can be modified, but it's necessary that the private key remain the same as the owner of the `TestMultiToken` contract is set to the default anvil wallet with the private key `0xac097...f2ff80`.

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
cast send 0xDC6d64971B77a47fB3E3c6c409D4A05468C398D2 "safeTransferFrom(address,address,uint256,uint256,bytes)" 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 1 1 0x --rpc-url http://127.0.0.1:6751/anvil --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

</code></pre>
</TabItem>

</Tabs>

The above command interacts with the `safeTransferFrom` function of the `TestMultiToken` contract `0xDC6d...98D2`. The command transfers `1` unit of the token with id `1` from the owner address `0xf39F...92266` to the receiver address `0x7099...dc79C8`, this transaction is signed using the private key for the owner address specified.

### Depositing ERC1155 Tokens

#### Using The CLI

- Run your Cartesi application.
  
- From the project directory, open a terminal and run:

```bash
cartesi deposit
```

- From the available options, select `erc1155-single` if you intend to deposit a single token, or select `erc1155-batch` if you're depositing multiple tokens at once.
  
- Accept the pre-filled TestToken address (or enter another ERC1155 token address).
  
- Enter the ID of the token you intend to deposit, if multiple you can add all of their ID's separated by commas.

- In the next menu enter the amount of tokens you intend to deposit (separate them by comma's if multiple).

- The CLI would automatically run the approval then the deposit process for the tokens. On successful deposit you should see logs similar to this:

```bash
✔ Select type of asset to deposit erc1155-single
✔ Token address 0xDC6d64971B77a47fB3E3c6c409D4A05468C398D2
✔ Token ID 5
✔ Amount of token ID 5 1
✔ Approved ERC1155Portal
✔ Deposited 1 units of token id 5 to 0x0c0fe740dcd46f0a6ddb8498d0bfdca93c5910e6
```

#### Using Cast

- Grant the `ERC1155SinglePortal` contract approval

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <TestMultiToken contract address> "setApprovalForAll(address,bool)" <ERC1155SinglePortal address> <approved status> ---rpc-url <RPC_URL> --private-key <Caller Private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
cast send 0xDC6d64971B77a47fB3E3c6c409D4A05468C398D2 "setApprovalForAll(address,bool)" 0xc700A261279aFC6F755A3a67D86ae43E2eBD0051 true --rpc-url http://127.0.0.1:6751/anvil --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

</code></pre>
</TabItem>

</Tabs>

- Call the `depositSingleERC1155Token` function in the ERC1155SinglePortal contract

<Tabs>

<TabItem value="Structure" label="Structure" default>
<pre><code>

```bash
cast send <ERC1155SinglePortal Contract address> "depositSingleERC1155Token(address,address,uint256,uint256,bytes,bytes)" <TestMultiToken Contract address> <Application address> <token_id> <Token_amount> <base layer Data>  <execution layer Data>  ---rpc-url <RPC_URL> --private-key <Caller Private key>
```

</code></pre>
</TabItem>

<TabItem value="Sample" label="Sample" default>
<pre><code>

```bash
cast send 0xc700A261279aFC6F755A3a67D86ae43E2eBD0051 "depositSingleERC1155Token(address,address,uint256,uint256,bytes,bytes)" 0xDC6d64971B77a47fB3E3c6c409D4A05468C398D2 0x0c0fe740dcd46f0a6ddb8498d0bfdca93c5910e6 5 1 0x 0x --rpc-url http://127.0.0.1:6751/anvil --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
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

- CD into the new project then, copy and paste the below code snippet into the index file.

<Tabs>
<TabItem value="Javascript" label="Javascript" default>
<pre><code>

```Javascript
import { ethers } from "ethers";
import {
  getAddress,
} from "viem";

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

const ERC1155_SINGLE_PORTAL_ADDRESS = "0xc700A261279aFC6F755A3a67D86ae43E2eBD0051";


function parseDepositPayload(payload) {
    const tokenData = ethers.dataSlice(payload, 0, 20);
    const senderData = ethers.dataSlice(payload, 20, 40);
    const tokenIdData = ethers.dataSlice(payload, 40, 72);
    const amountData = ethers.dataSlice(payload, 72, 104);

    if (!tokenData) {
      throw new Error("Invalid deposit payload");
    }
    return [getAddress(tokenData), getAddress(senderData), BigInt(tokenIdData), BigInt(amountData)];
  }

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  let payload = data.payload;
  const sender = data["metadata"]["msg_sender"];

  if (sender.toLowerCase() === ERC1155_SINGLE_PORTAL_ADDRESS.toLowerCase()) {
    console.log("Handling portal deposit");
    const [token, depositor, tokenId, amount] = parseDepositPayload(payload);
    console.log(`Token: ${token}, Depositor: ${depositor}, Token ID: ${tokenId}, Amount: ${amount}`);

    // Handle deposit logic here
  } else {
      // Handle Transaction request like a regular transaction
  }

  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
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

    let erc1155_portal_address: &str = "0xc700A261279aFC6F755A3a67D86ae43E2eBD0051";

    if sender.to_lowercase() == erc1155_portal_address.to_lowercase() {
        println!("Received a message from the ERC20 Portal contract");
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
    ERC1155_PORTAL_ADDRESS = "0xc700A261279aFC6F755A3a67D86ae43E2eBD0051";
    
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
npm install viem ethers
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

```bash
cargo add primitive_types
cargo add hex
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
[INFO  rollup_http_server::http_service] received new request of type ADVANCE
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 814 "-" "python-requests/2.31.0" 0.020416
INFO:__main__:Received finish status 200
INFO:__main__:Received advance request data {'metadata': {'chain_id': 13370, 'app_contract': '0x1f6eb23dfa21f9013ee83c4e09a93b494736d7d9', 'msg_sender': '0xc700a261279afc6f755a3a67d86ae43e2ebd0051', 'block_number': 21, 'block_timestamp': 1757624870, 'prev_randao': '0x45c3ecf672b0c35d25c822ccb22f145f633feec5451438436f57fd310366df44', 'input_index': 0}, 'payload': '0xdc6d64971b77a47fb3e3c6c409d4a05468c398d2f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'}
INFO:__main__:Token: 0xdc6d64971b77a47fb3e3c6c409d4a05468c398d2, Depositor: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266, token ID: 1 token_amount: 1
INFO:__main__:Sending finish
```
