```rust
use json::{object, JsonValue};
use std::env;
use ethers_core::abi::{encode, Token};
use ethers_core::utils::id;
use hex;

const ZERO_ADDRESS: &str = "0x0000000000000000000000000000000000000000";

#[derive(Debug, Clone, Default)]
pub struct Storage {
    pub erc721_portal_address: String,
    pub erc20_portal_address: String,
    pub erc721_token: String,
    pub erc20_token: String,
    pub app_address: String,
    pub list_price: u128,
    pub listed_tokens: Vec<u128>,

    pub users_erc20_token_balance: std::collections::HashMap<String, u128>,
    pub user_erc721_token_balance: std::collections::HashMap<String, Vec<u128>>,
    pub erc721_id_to_owner_address: std::collections::HashMap<u128, String>,
}

impl Storage {
    fn new (
        erc721_portal_address: String,
        erc20_portal_address: String,
        erc721_token: String,
        erc20_token: String,
        list_price: u128
    ) -> Self {
        Storage{
            erc20_portal_address: erc20_portal_address.to_lowercase(),
            erc721_portal_address: erc721_portal_address.to_lowercase(),
            erc20_token: erc20_token.to_lowercase(),
            erc721_token: erc721_token.to_lowercase(),
            list_price,
            app_address: ZERO_ADDRESS.to_string(),
            listed_tokens: Vec::new(),
            user_erc721_token_balance: std::collections::HashMap::new(),
            users_erc20_token_balance: std::collections::HashMap::new(),
            erc721_id_to_owner_address: std::collections::HashMap::new(),
        }
    }

    fn get_listed_tokens(&self) -> Vec<&u128> {
        self.listed_tokens.iter().collect()
    }

    fn get_erc721_token_owner(&self, token_id: u128) -> Option<&String> {
        self.erc721_id_to_owner_address.get(&token_id)
    }

    fn get_user_erc20_token_balance(&self, user_address: &str) -> u128 {
        *self.users_erc20_token_balance.get(&user_address.to_lowercase()).unwrap_or(&0)
    }

    fn increase_user_balance(&mut self, user_address: String, amount: u128) -> Result<(), String> {
        let balance = self.users_erc20_token_balance.entry(user_address.to_lowercase()).or_insert(0);
        *balance = balance.checked_add(amount).ok_or("Balance does not fit in u128")?;
        Ok(())
    }

    fn deposit_erc721_token(&mut self, user_address: String, token_id: u128) {
        let zero_address = ZERO_ADDRESS.to_string();
        if self.get_erc721_token_owner(token_id) == Some(&zero_address) {
            self.change_erc721_token_owner(token_id, user_address, zero_address);
        } else {
            self.erc721_id_to_owner_address.insert(token_id, user_address.to_lowercase());
            self.user_erc721_token_balance
            .entry(user_address)
            .or_insert_with(Vec::new)
            .push(token_id);
        }
    }

    fn list_token_for_sale(&mut self, token_id: u128) {
        if !self.listed_tokens.contains(&token_id) {
            self.listed_tokens.push(token_id);
        }
    }

    fn reduce_user_balance(&mut self, user_address: &str, amount: u128) -> Result<(), String> {
        let balance = self.get_user_erc20_token_balance(user_address);
        if balance < amount {
            return Err(format!("User {} has insufficient balance", user_address));
        }
        self.users_erc20_token_balance.insert(user_address.to_lowercase(), balance - amount);
        Ok(())
    }

    fn change_erc721_token_owner(&mut self, token_id: u128, new_owner: String, old_owner: String) {
       if let Some(owner) =  self.erc721_id_to_owner_address.get_mut(&token_id) {
            *owner = new_owner.clone();
       }

        if let Some(tokens) = self.user_erc721_token_balance.get_mut(&new_owner) {
            tokens.push(token_id);
        }

        if let Some(tokens) = self.user_erc721_token_balance.get_mut(&old_owner) {
            tokens.retain(|token| !(*token == token_id));
        }
    }

    fn purchase_erc721_token(&mut self, buyer_address: &str, token_id: u128) -> Result<(), String> {
        if !self.listed_tokens.contains(&token_id) {
            return Err(format!("Token {} with id {} is not for sale", self.erc721_token, token_id));
        }
        let owner = match self.get_erc721_token_owner(token_id) {
            Some(owner) => owner.clone(),
            None => return Err(format!("Token owner for token {} with id {} not found", self.erc721_token, token_id)),
        };
        self.reduce_user_balance(buyer_address, self.list_price)?;
        self.increase_user_balance(owner.clone(), self.list_price)?;
        // the NFT leaves the marketplace with the voucher below
        self.change_erc721_token_owner(token_id, ZERO_ADDRESS.to_string(), owner);
        self.listed_tokens.retain(|token| *token != token_id);
        Ok(())
    }
}

fn handle_erc20_deposit(depositor_address: String, amount_deposited: u128, token_address: String, storage: &mut Storage) -> Result<(), String> {
    if token_address.to_lowercase() != storage.erc20_token {
        return Err("Unsupported token deposited".into());
    }
    storage.increase_user_balance(depositor_address, amount_deposited)?;
    println!("Token deposit processed successfully");
    Ok(())
}

async fn handle_erc721_deposit(depositor_address: String, token_id: u128, token_address: String, storage: &mut Storage) -> Result<(), String> {
    if token_address.to_lowercase() != storage.erc721_token {
        return Err("Unsupported token deposited".into());
    }
    storage.deposit_erc721_token(depositor_address.clone(), token_id);
    storage.list_token_for_sale(token_id);
    println!("Token deposit and listing processed successfully");
    emit_notice(format!("Token ID: {} Deposited by User: {}", token_id, depositor_address)).await
}

fn extract_field<'a>(user_input: &'a JsonValue, field: &str) -> Result<&'a str, String> {
    match user_input[field].as_str() {
        Some(value) if !value.trim().is_empty() => Ok(value),
        _ => Err(format!("Missing or invalid {} field in payload", field)),
    }
}

// Parses a decimal string, or a 0x-prefixed hex string (as BigInt() does in JavaScript)
fn parse_token_id(value: &str) -> Result<u128, String> {
    let parsed = match value.strip_prefix("0x") {
        Some(hex_digits) => u128::from_str_radix(hex_digits, 16),
        None => value.parse::<u128>(),
    };
    parsed.map_err(|_| format!("Cannot convert {} to an integer", value))
}

async fn handle_purchase_token(sender: &str, user_input: JsonValue, storage: &mut Storage) -> Result<(), String> {
    let token_id = parse_token_id(extract_field(&user_input, "token_id")?)?;
    storage.purchase_erc721_token(sender, token_id)?;
    println!("Token purchased successfully");

    // The application contract holds the deposited NFTs and executes the
    // voucher, so it is the `from` address of the transfer
    let args = vec![
        Token::Address(storage.app_address.parse().map_err(|_| "Invalid application address")?),
        Token::Address(sender.parse().map_err(|_| "Invalid buyer address")?),
        Token::Uint(token_id.into()),
    ];
    let function_sig = "transferFrom(address,address,uint256)";
    let value: u128 = 0;
    let selector = &id(function_sig)[..4];
    let encoded_args = encode(&args);

    let mut payload_bytes = Vec::new();
    payload_bytes.extend_from_slice(selector);
    payload_bytes.extend_from_slice(&encoded_args);

    let voucher = object! {
        "destination" => storage.erc721_token.clone(),
        "payload" => format!("0x{}", hex::encode(payload_bytes)),
        // 32-byte hex string: no Ether sent with the call
        "value" => format!("0x{:064x}", value),
    };

    emit_voucher(voucher).await?;
    println!("Token purchased and Withdrawn successfully");
    Ok(())
}

async fn process_advance(sender: &str, payload: &str, storage: &mut Storage) -> Result<(), String> {
    match sender {
        s if s == storage.erc20_portal_address => {
            let (deposited_token, receiver_address, amount) = token_deposit_parse(payload)?;
            println!("Deposited token: {}, Receiver: {}, Amount: {}", deposited_token, receiver_address, amount);
            handle_erc20_deposit(receiver_address, amount, deposited_token, storage)
        },
        s if s == storage.erc721_portal_address => {
            let (deposited_token, receiver_address, token_id) = token_deposit_parse(payload)?;
            println!("Deposited and listed token: {}, Receiver: {}, Token ID: {}", deposited_token, receiver_address, token_id);
            handle_erc721_deposit(receiver_address, token_id, deposited_token, storage).await
        },
        _ => {
            let payload_json = hex_to_string(payload)
                .ok()
                .and_then(|payload_str| json::parse(&payload_str).ok())
                .ok_or("Invalid payload JSON")?;
            match payload_json["method"].as_str() {
                Some("purchase_token") => handle_purchase_token(sender, payload_json.clone(), storage).await,
                _ => Err("Unsupported method called!!".into()),
            }
        }
    }
}

pub async fn handle_advance(
    _client: &hyper::Client<hyper::client::HttpConnector>,
    _server_addr: &str,
    request: JsonValue,
    storage: &mut Storage
) -> Result<&'static str, Box<dyn std::error::Error>> {
    println!("Received advance request data {}", &request);
    let _payload = request["data"]["payload"]
    .as_str()
    .ok_or("Missing payload")?;
    let app_addr = request["data"]["metadata"]["app_contract"]
    .as_str()
    .ok_or("Missing app_contract in metadata")?;

    if storage.app_address == ZERO_ADDRESS {
        storage.app_address = app_addr.to_string();
    }
    let sender = request["data"]["metadata"]["msg_sender"]
        .as_str()
        .ok_or("Missing msg_sender in metadata")?
        .to_lowercase();

    // invalid requests are rejected with a report: they never stop the application
    match process_advance(&sender, _payload, storage).await {
        Ok(()) => Ok("accept"),
        Err(error) => {
            println!("Error processing advance request: {}", error);
            emit_report(error).await;
            Ok("reject")
        }
    }
}

pub async fn handle_inspect(
    _client: &hyper::Client<hyper::client::HttpConnector>,
    _server_addr: &str,
    request: JsonValue,
    storage: &mut Storage
) -> Result<&'static str, Box<dyn std::error::Error>> {
    println!("Received inspect request data {}", &request);
    let _payload = request["data"]["payload"]
        .as_str()
        .ok_or("Missing payload")?;

    let payload_json = match hex_to_string(_payload).ok().and_then(|payload_str| json::parse(&payload_str).ok()) {
        Some(value) => value,
        None => {
            emit_report("Invalid payload JSON".into()).await;
            return Ok("accept");
        }
    };

    match payload_json["method"].as_str() {
        Some("get_user_erc20_balance") => {
            let user_address = payload_json["user_address"].as_str().unwrap_or("");
            let user_balance = storage.get_user_erc20_token_balance(user_address);
            emit_report(format!("User: {} Balance: {}", user_address, user_balance)).await;
        },
        Some("get_token_owner") => {
            // the token ID can be a JSON number or a string
            let token_id = match payload_json["token_id"].as_u64() {
                Some(number) => u128::from(number),
                None => match parse_token_id(payload_json["token_id"].as_str().unwrap_or("")) {
                    Ok(token_id) => token_id,
                    Err(error) => {
                        emit_report(error).await;
                        return Ok("reject");
                    }
                },
            };
            let token_owner = storage.get_erc721_token_owner(token_id).map(String::as_str).unwrap_or("None");
            emit_report(format!("Token_id: {} owner: {}", token_id, token_owner)).await;
        },
        Some("get_all_listed_tokens") => {
            let listed_tokens: Vec<String> = storage.get_listed_tokens().iter().map(|token| token.to_string()).collect();
            emit_report(format!("All listed tokens are: {}", listed_tokens.join(","))).await;
        },
        _ => {
            println!("Unsupported method called!!");
            emit_report("Unsupported inspect method".into()).await;
        },
    }
    Ok("accept")
}

pub fn token_deposit_parse(payload: &str) -> Result<(String, String, u128), String> {
    // ERC-20 and ERC-721 deposits start with the same packed fields:
    // token (20 bytes), sender (20 bytes), amount or token ID (32 bytes)
    let hexstr = payload.strip_prefix("0x").unwrap_or(payload);
    let bytes = hex::decode(hexstr).map_err(|e| format!("hex decode error: {}", e))?;
    if bytes.len() < 20 + 20 + 32 {
        return Err(format!("payload too short: {} bytes", bytes.len()));
    }
    let token = &bytes[0..20];
    let receiver = &bytes[20..40];
    let amount_be = &bytes[40..72];

    if amount_be[..16].iter().any(|&b| b != 0) {
        return Err("amount too large for u128".into());
    }
    let mut lo = [0u8; 16];
    lo.copy_from_slice(&amount_be[16..]);
    let amount = u128::from_be_bytes(lo);

    Ok((
        format!("0x{}", hex::encode(token)),
        format!("0x{}", hex::encode(receiver)),
        amount,
    ))
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = hyper::Client::new();
    let server_addr = env::var("ROLLUP_HTTP_SERVER_URL")?;

    let erc721_portal_address = String::from("0x397c352d18DFf47CC8a6143403142cf7afd5Ff7E");
    let erc20_portal_address = String::from("0x3332DE61a8BB9aC84893b2f552Fe81C9a6dC5419");
    let erc20_token = String::from("0x86EA17052C8e335Ad830B54EF566274EAB46B852");
    let erc721_token = String::from("0x0761b8e3aB06F458632974393C48765E6Ddc61bB");
    let list_price: u128 = 100_000_000_000_000_000_000;
    let mut storage = Storage::new(erc721_portal_address, erc20_portal_address, erc721_token, erc20_token, list_price);

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
                "advance_state" => handle_advance(&client, &server_addr[..], req,  &mut storage).await?,
                "inspect_state" => handle_inspect(&client, &server_addr[..], req,  &mut storage).await?,
                &_ => {
                    eprintln!("Unknown request type");
                    "reject"
                }
            };
        }
    }
}

fn hex_to_string(hex: &str) -> Result<String, Box<dyn std::error::Error>> {
    let hexstr = hex.strip_prefix("0x").unwrap_or(hex);
    let bytes = hex::decode(hexstr).map_err(|e| Box::new(e) as Box<dyn std::error::Error>)?;
    let s = String::from_utf8(bytes).map_err(|e| Box::new(e) as Box<dyn std::error::Error>)?;
    Ok(s)
}

async fn post_output(route: &str, body: JsonValue) -> Result<(), String> {
    let server_addr = env::var("ROLLUP_HTTP_SERVER_URL").map_err(|e| e.to_string())?;
    let client = hyper::Client::new();

    let request = hyper::Request::builder()
    .method(hyper::Method::POST)
    .header(hyper::header::CONTENT_TYPE, "application/json")
    .uri(format!("{}/{}", server_addr, route))
    .body(hyper::Body::from(body.dump()))
    .map_err(|e| e.to_string())?;

    let response = client.request(request).await.map_err(|e| e.to_string())?;
    if !response.status().is_success() {
        return Err(format!("Failed to generate {}: HTTP {}", route, response.status()));
    }
    Ok(())
}

async fn emit_report(text: String) {
    // the rollup HTTP server expects the payload as a 0x-prefixed hex string
    let report = object! { "payload" => format!("0x{}", hex::encode(text)) };
    match post_output("report", report).await {
        Ok(()) => println!("Report generation successful"),
        Err(e) => println!("Report request failed {}", e),
    }
}

async fn emit_notice(text: String) -> Result<(), String> {
    let notice = object! { "payload" => format!("0x{}", hex::encode(text)) };
    post_output("notice", notice).await?;
    println!("Notice generation successful");
    Ok(())
}

async fn emit_voucher(voucher: JsonValue) -> Result<(), String> {
    post_output("voucher", voucher).await?;
    println!("Voucher generation successful");
    Ok(())
}
```
