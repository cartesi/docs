```rust
use json::{object, JsonValue};
use std::env;
use std::sync::Mutex;

#[derive(Clone)]
struct AdvanceMessage {
    relayer: String,
    original_sender: String,
    message: String,
    input_index: u64,
}

static MESSAGES: Mutex<Vec<AdvanceMessage>> = Mutex::new(Vec::new());

fn hex_decode(hex: &str) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    let hex = hex.strip_prefix("0x").unwrap_or(hex);
    if hex.len() % 2 != 0 {
        return Err("hex string has odd length".into());
    }
    (0..hex.len())
        .step_by(2)
        .map(|i| u8::from_str_radix(&hex[i..i + 2], 16).map_err(|e| Box::new(e) as _))
        .collect()
}

fn hex_encode(bytes: &[u8]) -> String {
    bytes.iter().map(|b| format!("{:02x}", b)).collect()
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

    let relayer = request["data"]["metadata"]["msg_sender"]
        .as_str()
        .unwrap_or("unknown")
        .to_string();

    let input_index = request["data"]["metadata"]["input_index"]
        .as_u64()
        .unwrap_or(0);

    // Decode payload: first 20 bytes = original sender address (abi.encodePacked),
    // remaining bytes = UTF-8 message.
    let bytes = hex_decode(payload)?;

    if bytes.len() < 20 {
        eprintln!("Payload too short to contain a 20-byte sender address, rejecting");
        return Ok("reject");
    }

    let original_sender = format!("0x{}", hex_encode(&bytes[0..20]));
    let message = std::str::from_utf8(&bytes[20..])
        .unwrap_or("<invalid utf-8>")
        .to_string();

    println!(
        "[InputRelayer] input_index={} relayer={} original_sender={} message=\"{}\"",
        input_index, relayer, original_sender, message
    );

    MESSAGES.lock().unwrap().push(AdvanceMessage {
        relayer,
        original_sender,
        message,
        input_index,
    });

    Ok("accept")
}

pub async fn handle_inspect(
    client: &hyper::Client<hyper::client::HttpConnector>,
    server_addr: &str,
    request: JsonValue,
) -> Result<&'static str, Box<dyn std::error::Error>> {
    println!("Received inspect request data {}", &request);

    let payload = request["data"]["payload"]
        .as_str()
        .ok_or("Missing payload")?;

    let route_bytes = hex_decode(payload)?;
    let route = std::str::from_utf8(&route_bytes)
        .unwrap_or("")
        .trim_start_matches('/');

    println!("Inspect route: \"{}\"", route);

    let report_body = match route {
        "messages" | "" => {
            let messages = MESSAGES.lock().unwrap();
            let mut arr = JsonValue::new_array();
            for msg in messages.iter() {
                let _ = arr.push(object! {
                    "input_index" => msg.input_index,
                    "relayer" => msg.relayer.clone(),
                    "original_sender" => msg.original_sender.clone(),
                    "message" => msg.message.clone(),
                });
            }
            arr.dump()
        }
        "messages/count" => {
            let count = MESSAGES.lock().unwrap().len();
            format!("{{\"count\":{}}}", count)
        }
        _ => {
            format!("{{\"error\":\"unknown route\",\"route\":\"{}\"}}", route)
        }
    };

    let hex_payload = format!("0x{}", hex_encode(report_body.as_bytes()));
    let report = object! { "payload" => hex_payload };
    let req = hyper::Request::builder()
        .method(hyper::Method::POST)
        .header(hyper::header::CONTENT_TYPE, "application/json")
        .uri(format!("{}/report", server_addr))
        .body(hyper::Body::from(report.dump()))?;
    let resp = client.request(req).await?;
    println!("Report response status: {}", resp.status());

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
