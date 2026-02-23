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
