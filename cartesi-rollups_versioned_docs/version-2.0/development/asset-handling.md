---
id: asset-handling
title: Asset handling
resources:
  - url: https://www.udemy.com/course/cartesi-masterclass/
    title: The Cartesi dApp Developer Free Course
---

Assets exist on the base layer, where they have actual meaning and value.

As with any execution layer solution, a Cartesi Application that wants to manipulate assets needs a secure way of "teleporting" the assets from the base layer to the execution layer and when necessary, back to the base layer.

Currently, Cartesi Rollups support the following types of assets:

- [Ether (ETH)](../api-reference/contracts/portals/EtherPortal.md)
- [ERC-20](../api-reference/contracts/portals/ERC20Portal.md)
- [ERC-721](../api-reference/contracts/portals/ERC721Portal.md)
- [ERC-1155 Single](../api-reference/contracts/portals/ERC1155SinglePortal.md)
- [ERC-1155 Batch](../api-reference/contracts/portals/ERC1155BatchPortal.md)

![img](../../..//static/img/v2.0/onchain-contracts.jpg)

## Deposits

Portals enable the safe transfer of assets from the base layer to the execution layer. Users authorize portals to deduct assets from their accounts and initiate transfers to the Application contract.

When an asset is deposited, it is on the base layer but gains a representation in the execution layer. The corresponding Portal contract sends an input via the `InputBox` contract describing the type of asset, amount, and some data the depositor might want the application to read. The off-chain machine will then interpret and validate the input payload.

Deposit input payloads are always specified as packed ABI-encoded parameters, as detailed below.

![img](../../..//static/img/v2.0/deposit-payload.jpg)

### ABI encoding for deposits

| Asset             | Packed ABI-encoded payload fields                                                                                                                       | Standard ABI-encoded payload fields                                                                                              |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------- |
| Ether             | <ul><li>`address sender`,</li><li>`uint256 value`,</li><li>`bytes execLayerData`</li></ul>                                                              | none                                                                                                                             |
| ERC-20            | <ul><li>`address token`,</li><li>`address sender`,</li><li>`uint256 amount`,</li><li>`bytes execLayerData`</li></ul>                                    | none                                                                                                                             |
| ERC-721           | <ul><li>`address token`,</li><li>`address sender`,</li><li>`uint256 tokenId`,</li><li>standard ABI-encoded fields...</li></ul>                          | <ul><li>`bytes baseLayerData`,</li><li>`bytes execLayerData`</li></ul>                                                           |
| ERC-1155 (single) | <ul><li>`address token`,</li><li>`address sender`,</li><li>`uint256 tokenId`,</li><li>`uint256 value`,</li><li>standard ABI-encoded fields...</li></ul> | <ul><li>`bytes baseLayerData`,</li><li>`bytes execLayerData`</li></ul>                                                           |
| ERC-1155 (batch)  | <ul><li>`address token`,</li><li>`address sender`,</li><li>standard ABI-encoded fields...</li></ul>                                                     | <ul><li>`uint256[] tokenIds`,</li><li>`uint256[] values`,</li><li>`bytes baseLayerData`,</li><li>`bytes execLayerData`</li></ul> |

Refer to the functions provided below to understand how to handle asset deposits. These functions when called inside the `handle_advance` function of your application will help you decode the payload for the asset type being deposited. 

For example, to decode an ERC-20 deposit payload, you can use the following code snippets:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>
```javascript
function decodeErc20Deposit(payloadHex) {
  if (typeof payloadHex !== "string") {
    throw new TypeError("payload must be a hex string");
  }

  const payload = payloadHex.startsWith("0x") ? payloadHex.slice(2) : payloadHex;
  const raw = Buffer.from(payload, "hex");

  // token(20) + sender(20) + amount(32) = 72 bytes
  if (raw.length < 72) {
    throw new Error("invalid ERC-20 deposit payload");
  }

  const token = `0x${raw.subarray(0, 20).toString("hex")}`.toLowerCase().trim();
  const sender = `0x${raw.subarray(20, 40).toString("hex")}`.toLowerCase().trim();
  const amount = BigInt(`0x${raw.subarray(40, 72).toString("hex")}`);
  const exec_layer_data = raw.subarray(72);

  return {
    token,
    sender,
    amount,
    exec_layer_data,
  };
}
```
</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>
```python
def decode_erc20_deposit(payload_hex):
    """
    Decode a Cartesi Rollups ERC-20 deposit payload.
    """
    # Accept both prefixed and non-prefixed hex payloads.
    payload = payload_hex[2:] if payload_hex.startswith("0x") else payload_hex
    raw = bytes.fromhex(payload)

    # Minimum size is token(20) + sender(20) + amount(32) = 72 bytes.
    if len(raw) < 72:
        raise ValueError("invalid ERC-20 deposit payload")

    token = ("0x" + raw[0:20].hex()).lower().strip()
    sender = ("0x" + raw[20:40].hex()).lower().strip()
    amount = int.from_bytes(raw[40:72], byteorder="big")
    exec_layer_data = raw[72:]

    return {
        "token": token,
        "sender": sender,
        "amount": amount,
        "exec_layer_data": exec_layer_data,
    }
```
</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>
```rust
use num_bigint::BigUint;

#[derive(Debug)]
pub struct Erc20Deposit {
    pub token: String,
    pub sender: String,
    pub amount: BigUint,
    pub exec_layer_data: Vec<u8>,
}

pub fn decode_erc20_deposit(payload_hex: &str) -> Result<Erc20Deposit, String> {
    let payload = payload_hex.strip_prefix("0x").unwrap_or(payload_hex);
    let mut raw = Vec::with_capacity(payload.len() / 2);
    for i in (0..payload.len()).step_by(2) {
        let byte = payload
            .get(i..i + 2)
            .ok_or("invalid hex payload length")?
            .to_string();
        raw.push(u8::from_str_radix(&byte, 16).map_err(|_| "invalid hex payload")?);
    }

    if raw.len() < 72 {
        return Err("invalid ERC-20 deposit payload".to_string());
    }

    let token = format!(
        "0x{}",
        raw[0..20]
            .iter()
            .map(|b| format!("{:02x}", b))
            .collect::<String>()
    );
    let sender = format!(
        "0x{}",
        raw[20..40]
            .iter()
            .map(|b| format!("{:02x}", b))
            .collect::<String>()
    );
    let amount = BigUint::from_bytes_be(&raw[40..72]);
    let exec_layer_data = raw[72..].to_vec();

    Ok(Erc20Deposit {
        token,
        sender,
        amount,
        exec_layer_data,
    })
}
```
</code></pre>
</TabItem>

</Tabs>

## Withdrawing assets

Users can deposit assets to a Cartesi Application, but only the Application can initiate withdrawals. When a withdrawal request is made, it’s processed and interpreted off-chain by the Cartesi Machine running the application’s code. Subsequently, the Cartesi Machine creates a voucher containing the necessary instructions for withdrawal, which is executable when an epoch has settled.

### Withdrawing Tokens

Vouchers are crucial in allowing applications in the execution layer to interact with contracts in the base layer through message calls. They are emitted by the off-chain machine and executed by any participant in the base layer. Each voucher includes a destination address and a payload, typically encoding a function call for Solidity contracts.

The application’s off-chain layer often requires knowledge of its address to facilitate on-chain interactions for withdrawals, for example: `transferFrom(sender, recipient, amount)`. In this case, the sender is the application itself.

Next, the off-chain machine uses the address of the application on the base layer to generate a voucher for execution at the executeOutput() function of the Application contract. This address is known to the offchain machine because it is embedded in the metadata of every input sent to the application, though the developer will need to implement extra logic fetch this address from the metadata then properly store and retrieve it when needed in situations like generating the above Voucher.

Below is a sample JavaScript code with the implementations to transfer tokens to whoever calls the application, notice that the `const call` variable is an encoded function data containing the token contract ABI, function name and also arguments like recipient and amount, while the actual `voucher` structure itself contains a destination (erc20 token contract where the transfer execution should occur), the payload (encoded function data in `call`) and finally a value field which is initialized to `0` meaning no Ether is intended to be sent alongside this transfer request.

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>
```javascript
import { stringToHex, encodeFunctionData, erc20Abi, hexToString, zeroHash } from "viem";

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));

  const sender = data["metadata"]["msg_sender"];
  const payload = hexToString(data.payload);
  const erc20Token = "0x784f0c076CC55EAD0a585a9A13e57c467c91Dc3a"; // Sample ERC20 token address

    const call = encodeFunctionData({
    abi: erc20Abi,
    functionName: "transfer",
    args: [sender, BigInt(10)],
  });

  let voucher = {
    destination: erc20Token,
    payload: call,
    value: zeroHash,
  };

  await emitVoucher(voucher);
  return "accept";
}

const emitVoucher = async (voucher) => {
  try {
    await fetch(rollup_server + "/voucher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(voucher),
    });
  } catch (error) {
    //Do something when there is an error
  }
};
```
</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>
```python
import json
import logging
import os

import requests

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

ROLLUP_HTTP_SERVER_URL = os.environ["ROLLUP_HTTP_SERVER_URL"]
TOKEN_ADDRESS = "0x5138f529b77b4e0a7c84b77e79c4335d31938fed"


def payload_hex_to_bytes(payload):
    if payload.startswith("0x"):
        payload = payload[2:]
    return bytes.fromhex(payload)


def encode_erc20_transfer(recipient, amount):
    recipient = recipient.lower().strip()
    if recipient.startswith("0x"):
        recipient = recipient[2:]

    selector = bytes.fromhex("a9059cbb")  # transfer(address,uint256)
    recipient_word = bytes.fromhex("00" * 12 + recipient)
    amount_word = int(amount).to_bytes(32, byteorder="big")
    return "0x" + (selector + recipient_word + amount_word).hex()


def emit_transfer_voucher(token_address, recipient, amount):
    voucher = {
        "destination": token_address.lower().strip(),
        "payload": encode_erc20_transfer(recipient, amount),
    }
    response = requests.post(ROLLUP_HTTP_SERVER_URL + "/voucher", json=voucher)
    return response.status_code


def handle_advance(data):
    command_raw = payload_hex_to_bytes(data["payload"]).decode("utf-8")
    command = json.loads(command_raw)

    amount = int(command["amount"])
    recipient = command.get("recipient") or data["metadata"]["msg_sender"]

    status = emit_transfer_voucher(TOKEN_ADDRESS, recipient, amount)
    logger.info("Voucher POST status=%s", status)
    return "accept"
```
</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>
```rust
use json::{object, JsonValue};
use num_bigint::BigUint;

pub const TOKEN_ADDRESS: &str = "0x5138f529b77b4e0a7c84b77e79c4335d31938fed";

fn payload_hex_to_bytes(payload: &str) -> Result<Vec<u8>, String> {
    let payload = payload.strip_prefix("0x").unwrap_or(payload);
    let mut out = Vec::with_capacity(payload.len() / 2);
    for i in (0..payload.len()).step_by(2) {
        let byte = payload
            .get(i..i + 2)
            .ok_or("invalid hex payload length")?
            .to_string();
        out.push(u8::from_str_radix(&byte, 16).map_err(|_| "invalid hex payload")?);
    }
    Ok(out)
}

fn encode_erc20_transfer(recipient: &str, amount: &BigUint) -> Result<String, String> {
    let recipient = recipient
        .trim()
        .to_lowercase()
        .strip_prefix("0x")
        .unwrap_or(recipient)
        .to_string();
    let recipient_bytes = payload_hex_to_bytes(&recipient)?;

    let mut data = Vec::with_capacity(68);
    data.extend_from_slice(&[0xa9, 0x05, 0x9c, 0xbb]); // transfer(address,uint256)
    data.extend_from_slice(&[0u8; 12]); // left-pad address to 32 bytes
    data.extend_from_slice(&recipient_bytes);

    let amount_bytes = amount.to_bytes_be();
    let amount_padding = 32usize.saturating_sub(amount_bytes.len());
    data.extend(std::iter::repeat_n(0u8, amount_padding));
    data.extend_from_slice(&amount_bytes);

    Ok(format!(
        "0x{}",
        data.iter().map(|b| format!("{:02x}", b)).collect::<String>()
    ))
}

pub async fn emit_transfer_voucher(
    client: &hyper::Client<hyper::client::HttpConnector>,
    server_addr: &str,
    token_address: &str,
    recipient: &str,
    amount: &BigUint,
) -> Result<hyper::StatusCode, Box<dyn std::error::Error>> {
    let voucher = object! {
        "destination" => token_address.trim().to_lowercase(),
        "payload" => encode_erc20_transfer(recipient, amount)?,
    };

    let request = hyper::Request::builder()
        .method(hyper::Method::POST)
        .header(hyper::header::CONTENT_TYPE, "application/json")
        .uri(format!("{}/voucher", server_addr))
        .body(hyper::Body::from(voucher.dump()))?;

    let response = client.request(request).await?;
    Ok(response.status())
}

pub async fn handle_advance(
    client: &hyper::Client<hyper::client::HttpConnector>,
    server_addr: &str,
    request: JsonValue,
) -> Result<&'static str, Box<dyn std::error::Error>> {
    let command_raw = std::str::from_utf8(&payload_hex_to_bytes(
        request["data"]["payload"].as_str().ok_or("Missing payload")?,
    )?)?;
    let command = json::parse(command_raw)?;

    let amount = if let Some(v) = command["amount"].as_str() {
        BigUint::parse_bytes(v.as_bytes(), 10).ok_or("invalid amount")?
    } else if let Some(v) = command["amount"].as_u64() {
        BigUint::from(v)
    } else {
        return Err("missing amount".into());
    };

    let recipient = command["recipient"]
        .as_str()
        .or_else(|| request["data"]["metadata"]["msg_sender"].as_str())
        .ok_or("missing recipient")?;

    let status = emit_transfer_voucher(client, server_addr, TOKEN_ADDRESS, recipient, &amount).await?;
    println!("Voucher POST status={}", status);
    Ok("accept")
}
```
</code></pre>
</TabItem>
</Tabs>

### Withdrawing Ether

To execute Ether withdrawal it is important to emit a voucher with the necessary details as regarding whom you intend to send the Ether to and also the amount to send, nevertheless since the Application contract Executes vouchers by making a [safeCall](https://github.com/cartesi/rollups-contracts/blob/cb52d00ededd2da9f8bf7757710301dccb7d536d/src/library/LibAddress.sol#L18C14-L18C22) to the destination, passing a value (Ether amount to send along with the call) and a payload (function signature to call), it's acceptable to leave the payload section empty if you do not intend to call any functions in the destination address while sending just the specified value of Ether to the destination address. If you intend to call a payable function and also send Ether along, you can add a function signature matching the payable function you intend to call to the payload field.

Below is another sample JavaScript code, this time the voucher structure has been modified to send ether to an address instead of calling a function in a smart contract, notice there is no `encodedFunctionData`, so the payload section is initialized to zeroHash.

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>
```javascript
import { stringToHex, encodeFunctionData, erc20Abi, hexToString, zeroHash, parseEther } from "viem";

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));

  const sender = data["metadata"]["msg_sender"];
  const payload = hexToString(data.payload);


  let voucher = {
    destination: sender,
    payload: zeroHash,
    value: numberToHex(BigInt(parseEther("1"))).slice(2),
  };

  await emitVoucher(voucher);
  return "accept";
}

const emitVoucher = async (voucher) => {
  try {
    await fetch(rollup_server + "/voucher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(voucher),
    });
  } catch (error) {
    //Do something when there is an error
  }
};
```
</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>
```python
import json
import logging
import os

import requests

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

ROLLUP_HTTP_SERVER_URL = os.environ["ROLLUP_HTTP_SERVER_URL"]
ZERO_HASH = "0x" + ("00" * 32)


def payload_hex_to_bytes(payload):
    if payload.startswith("0x"):
        payload = payload[2:]
    return bytes.fromhex(payload)


def emit_ether_voucher(recipient, amount_wei):
    """
    Emit an Ether transfer voucher.

    Per Cartesi docs for Ether transfer:
    - destination: recipient address
    - payload: zero hash (no function call)
    - value: Ether amount as hex (without 0x prefix)
    """
    recipient = recipient.lower().strip()
    value_hex = hex(int(amount_wei))[2:]

    voucher = {
        "destination": recipient,
        "payload": ZERO_HASH,
        "value": value_hex,
    }
    response = requests.post(ROLLUP_HTTP_SERVER_URL + "/voucher", json=voucher)
    return response.status_code


def handle_advance(data):
    """
    Expected payload JSON (hex-encoded UTF-8):
    {"amount_wei":"1000000000000000","recipient":"0x...optional"}
    """
    command_raw = payload_hex_to_bytes(data["payload"]).decode("utf-8")
    command = json.loads(command_raw)

    amount_wei = int(command["amount_wei"])
    recipient = command.get("recipient") or data["metadata"]["msg_sender"]

    status = emit_ether_voucher(recipient, amount_wei)
    logger.info("Ether voucher POST status=%s", status)
    return "accept"
```
</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>
```rust 
use json::{object, JsonValue};
use num_bigint::BigUint;

fn payload_hex_to_bytes(payload: &str) -> Result<Vec<u8>, String> {
    let payload = payload.strip_prefix("0x").unwrap_or(payload);
    let mut out = Vec::with_capacity(payload.len() / 2);
    for i in (0..payload.len()).step_by(2) {
        let byte = payload
            .get(i..i + 2)
            .ok_or("invalid hex payload length")?
            .to_string();
        out.push(u8::from_str_radix(&byte, 16).map_err(|_| "invalid hex payload")?);
    }
    Ok(out)
}

fn encode_ether_value(amount: &BigUint) -> String {
    let bytes = amount.to_bytes_be();
    let mut padded = vec![0u8; 32usize.saturating_sub(bytes.len())];
    padded.extend_from_slice(&bytes);
    format!(
        "0x{}",
        padded
            .iter()
            .map(|b| format!("{:02x}", b))
            .collect::<String>()
    )
}

pub async fn emit_ether_transfer_voucher(
    client: &hyper::Client<hyper::client::HttpConnector>,
    server_addr: &str,
    recipient: &str,
    amount: &BigUint,
) -> Result<hyper::StatusCode, Box<dyn std::error::Error>> {
    let voucher = object! {
        "destination" => recipient.trim().to_lowercase(),
        "payload" => "0x",
        "value" => encode_ether_value(amount),
    };

    let request = hyper::Request::builder()
        .method(hyper::Method::POST)
        .header(hyper::header::CONTENT_TYPE, "application/json")
        .uri(format!("{}/voucher", server_addr))
        .body(hyper::Body::from(voucher.dump()))?;

    let response = client.request(request).await?;
    Ok(response.status())
}

pub async fn handle_advance(
    client: &hyper::Client<hyper::client::HttpConnector>,
    server_addr: &str,
    request: JsonValue,
) -> Result<&'static str, Box<dyn std::error::Error>> {
    let command_raw = std::str::from_utf8(&payload_hex_to_bytes(
        request["data"]["payload"].as_str().ok_or("Missing payload")?,
    )?)?;
    let command = json::parse(command_raw)?;

    let amount = if let Some(v) = command["amount"].as_str() {
        BigUint::parse_bytes(v.as_bytes(), 10).ok_or("invalid amount")?
    } else if let Some(v) = command["amount"].as_u64() {
        BigUint::from(v)
    } else {
        return Err("missing amount".into());
    };

    let recipient = command["recipient"]
        .as_str()
        .or_else(|| request["data"]["metadata"]["msg_sender"].as_str())
        .ok_or("missing recipient")?;

    let status = emit_ether_transfer_voucher(client, server_addr, recipient, &amount).await?;
    println!("Voucher POST status={}", status);
    Ok("accept")
}
```
</code></pre>
</TabItem>

</Tabs>

:::note epoch length
By default, Cartesi nodes close one epoch every 7200 blocks. You can manually set the epoch length to facilitate quicker asset-handling methods.
:::

Here are the function signatures used by vouchers to withdraw the different types of assets:

| Asset    | Destination    | Function signature                                                                                                                          |
| :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| Ether    | dApp contract  | `withdrawEther(address,uint256)` [:page_facing_up:](../api-reference/json-rpc/application.md/#withdrawether)                            |
| ERC-20   | Token contract | `transfer(address,uint256)` [:page_facing_up:](https://eips.ethereum.org/EIPS/eip-20#methods)                                               |
| ERC-20   | Token contract | `transferFrom(address,address,uint256)` [:page_facing_up:](https://eips.ethereum.org/EIPS/eip-20#methods)                                   |
| ERC-721  | Token contract | `safeTransferFrom(address,address,uint256)` [:page_facing_up:](https://eips.ethereum.org/EIPS/eip-721#specification)                        |
| ERC-721  | Token contract | `safeTransferFrom(address,address,uint256,bytes)` [:page_facing_up:](https://eips.ethereum.org/EIPS/eip-721#specification)                  |
| ERC-1155 | Token contract | `safeTransferFrom(address,address,uint256,uint256,data)` [:page_facing_up:](https://eips.ethereum.org/EIPS/eip-1155#specification)          |
| ERC-1155 | Token contract | `safeBatchTransferFrom(address,address,uint256[],uint256[],data)` [:page_facing_up:](https://eips.ethereum.org/EIPS/eip-1155#specification) |
