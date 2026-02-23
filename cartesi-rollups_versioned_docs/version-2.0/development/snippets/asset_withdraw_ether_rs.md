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
