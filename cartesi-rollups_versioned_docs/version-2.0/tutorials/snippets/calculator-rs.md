```rust
use json::{object, JsonValue};
use std::env;

fn hex2str(payload: &str) -> Result<String, Box<dyn std::error::Error>> {
    let normalized = payload.strip_prefix("0x").unwrap_or(payload);
    let bytes = hex::decode(normalized)?;
    Ok(String::from_utf8(bytes)?)
}

fn str2hex(text: &str) -> String {
    format!("0x{}", hex::encode(text))
}

async fn post_payload(
    client: &hyper::Client<hyper::client::HttpConnector>,
    server_addr: &str,
    route: &str,
    payload_hex: String,
) -> Result<(), Box<dyn std::error::Error>> {
    let body = object! { "payload" => payload_hex };
    let request = hyper::Request::builder()
        .method(hyper::Method::POST)
        .header(hyper::header::CONTENT_TYPE, "application/json")
        .uri(format!("{}/{}", server_addr, route))
        .body(hyper::Body::from(body.dump()))?;
    let _ = client.request(request).await?;
    Ok(())
}

pub async fn handle_advance(
    client: &hyper::Client<hyper::client::HttpConnector>,
    server_addr: &str,
    request: JsonValue,
) -> Result<&'static str, Box<dyn std::error::Error>> {
    println!("Received advance request data {}", &request);
    let payload = request["data"]["payload"].as_str().ok_or("missing payload")?;

    match hex2str(payload) {
        Ok(expression) => match meval::eval_str(expression) {
            Ok(value) => {
                post_payload(client, server_addr, "notice", str2hex(&value.to_string())).await?;
                Ok("accept")
            }
            Err(err) => {
                let msg = format!("evaluation error: {}", err);
                post_payload(client, server_addr, "report", str2hex(&msg)).await?;
                Ok("reject")
            }
        },
        Err(err) => {
            let msg = format!("decode error: {}", err);
            post_payload(client, server_addr, "report", str2hex(&msg)).await?;
            Ok("reject")
        }
    }
}

pub async fn handle_inspect(
    client: &hyper::Client<hyper::client::HttpConnector>,
    server_addr: &str,
    request: JsonValue,
) -> Result<&'static str, Box<dyn std::error::Error>> {
    println!("Received inspect request data {}", &request);
    let payload = request["data"]["payload"].as_str().ok_or("missing payload")?;
    post_payload(client, server_addr, "report", payload.to_string()).await?;
    Ok("accept")
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = hyper::Client::new();
    let server_addr = env::var("ROLLUP_HTTP_SERVER_URL")?;

    let mut status = "accept";
    loop {
        println!("Sending finish");
        let finish = object! { "status" => status };
        let request = hyper::Request::builder()
            .method(hyper::Method::POST)
            .header(hyper::header::CONTENT_TYPE, "application/json")
            .uri(format!("{}/finish", &server_addr))
            .body(hyper::Body::from(finish.dump()))?;
        let response = client.request(request).await?;

        if response.status() == hyper::StatusCode::ACCEPTED {
            println!("No pending rollup request, trying again");
            continue;
        }

        let body = hyper::body::to_bytes(response).await?;
        let req = json::parse(std::str::from_utf8(&body)?)?;
        let request_type = req["request_type"].as_str().ok_or("request_type is not string")?;

        status = match request_type {
            "advance_state" => handle_advance(&client, &server_addr, req).await?,
            "inspect_state" => handle_inspect(&client, &server_addr, req).await?,
            _ => "reject",
        };
    }
}
```
