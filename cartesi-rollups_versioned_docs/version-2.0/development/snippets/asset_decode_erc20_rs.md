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
