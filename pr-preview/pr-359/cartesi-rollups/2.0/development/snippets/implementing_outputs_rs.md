> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

```rust
use json::{object, JsonValue};
use std::env;
use ethers_core::abi::{encode, Token};
use ethers_core::utils::id;
use hex;

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
        // 32-byte hex string
        "value" => format!("0x{:064x}", value),
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

    const ERC20_TOKEN: &str = "0x86EA17052C8e335Ad830B54EF566274EAB46B852"; // devnet test ERC-20 token (TestToken)

    // notice and report with the input payload, already a 0x-prefixed hex string
    emit_notice(payload.to_string()).await;
    emit_report(payload.to_string()).await;

    // voucher that transfers 10 units of the token to the sender
    let amount = 10;

    let args = vec![
        Token::Address(sender.parse().unwrap()),
        Token::Uint(amount.into()),
    ];
    let function_sig = "transfer(address,uint256)";

    let voucher = structure_voucher(function_sig, ERC20_TOKEN, args, 0);
    emit_voucher(voucher).await;

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

async fn emit_report(payload: String) -> Option<bool> {
    let server_addr = env::var("ROLLUP_HTTP_SERVER_URL").expect("ROLLUP_HTTP_SERVER_URL not set");
    let client = hyper::Client::new();

    // `payload` is already a 0x-prefixed hex string: post it unchanged
    let response = object! {
        "payload" => payload,
    };
    let request = hyper::Request::builder()
    .method(hyper::Method::POST)
    .header(hyper::header::CONTENT_TYPE, "application/json")
    .uri(format!("{}/report", server_addr))
    .body(hyper::Body::from(response.dump()))
    .ok()?;

    let response = client.request(request).await;
    match response {
        Ok(_) => {
            println!("Report generation successful");
            return Some(true);
        }
        Err(e) => {
            println!("Report request failed {}", e);
            None
        }
    }
}

async fn emit_notice(payload: String) -> Option<bool> {
    let server_addr = env::var("ROLLUP_HTTP_SERVER_URL").expect("ROLLUP_HTTP_SERVER_URL not set");
    let client = hyper::Client::new();

    // `payload` is already a 0x-prefixed hex string: post it unchanged
    let response = object! {
        "payload" => payload,
    };
    let request = hyper::Request::builder()
    .method(hyper::Method::POST)
    .header(hyper::header::CONTENT_TYPE, "application/json")
    .uri(format!("{}/notice", server_addr))
    .body(hyper::Body::from(response.dump()))
    .ok()?;

    let response = client.request(request).await;

    match response {
        Ok(_) => {
            println!("Notice generation successful");
            return Some(true);
        }
        Err(e) => {
            println!("Notice request failed {}", e);
            None
        }
    }
}

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