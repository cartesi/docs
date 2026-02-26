```rust
use json::{object, JsonValue};
use std::env;
use ethers_core::abi::{encode, Token};
use ethers_core::utils::id;
use hex;

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
            erc20_portal_address,
            erc721_portal_address,
            erc20_token,
            erc721_token,
            list_price,
            app_address: "0x0000000000000000000000000000000000000000".to_string(),
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

    fn get_user_erc20_token_balance(&self, user_address: &str) -> Option<&u128> {
        self.users_erc20_token_balance.get(user_address)
    }

    fn increase_user_balance(&mut self, user_address: String, amount: u128) {
        let balance = self.users_erc20_token_balance.entry(user_address).or_insert(0);
        *balance += amount;
    }

    fn deposit_erc721_token(&mut self, user_address: String, token_id: u128) {
        let zero_address = "0x0000000000000000000000000000000000000000".to_string();
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

    async fn reduce_user_balance(&mut self, user_address: &str, amount: u128) -> Result<(), String> {
        if let Some(balance) = self.users_erc20_token_balance.get_mut(user_address){
            if *balance >= amount {
                *balance -= amount;
                Ok(())
            } else {
                emit_report(format!("User {} has insufficient balance to purchase token", user_address)).await;
                Err(String::from("User has insufficient balance"))
            }
        } else {
            emit_report(format!("User {} Record, not found", user_address)).await;
            Err(String::from("User balance record not found"))
        }
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

    async fn purchase_erc721_token(&mut self, buyer_address: &str, token_id: u128) -> Result<(), String> {
        self.reduce_user_balance( buyer_address, self.list_price).await?;
        if let Some(owner) = self.get_erc721_token_owner( token_id) {
            self.increase_user_balance(owner.clone(), self.list_price);
        } else {
            emit_report(format!("Token owner for token with id {} not found", token_id)).await;
            return Err("Token owner not found".to_string());
        }
        self.listed_tokens.retain(|token| (*token != token_id));
        let zero_address = "0x0000000000000000000000000000000000000000";
        self.change_erc721_token_owner( token_id,  zero_address.to_string(), self.get_erc721_token_owner( token_id).unwrap().to_string());
        Ok(())
    }
}

async fn handle_erc20_deposit(depositor_address: String, amount_deposited: u128, token_address: String, storage: &mut Storage) {
    if token_address.to_lowercase() == storage.erc20_token.to_lowercase() {
        storage.increase_user_balance(depositor_address, amount_deposited);
        println!("Token deposit processed successfully");
    } else {
        println!("Unsupported token deposited");
        emit_report("Unsupported token deposited".into()).await;
    }
}

async fn handle_erc721_deposit(depositor_address: String, token_id: u128, token_address: String, storage: &mut Storage) {
    if token_address.to_lowercase() == storage.erc721_token.to_lowercase() {
        storage.deposit_erc721_token(depositor_address.clone(), token_id);
        storage.list_token_for_sale(token_id);
        println!("Token deposit and listing processed successfully");
        emit_notice(format!("Token Id: {}, Deposited by User: {}", token_id, depositor_address)).await;
    } else {
        println!("Unsupported token deposited");
        emit_report("Unsupported token deposited".into()).await;
    }
}

async fn handle_purchase_token(sender: String, user_input: JsonValue, storage: &mut Storage) {
    let token_id: u128 = user_input["token_id"].as_str().unwrap_or("0").parse().unwrap_or(0);
    if storage.listed_tokens.contains(&token_id) != true {
        emit_report("TOKEN NOT LISTED FOR SALE!!".to_string()).await;
        return;
    }
    match storage.purchase_erc721_token(&sender, token_id).await {
        Ok(_) => {
            let args = vec![
                Token::Address(storage.app_address.parse().unwrap()),
                Token::Address(sender.parse().unwrap()),
                Token::Uint(token_id.into()),
            ];
            let function_sig = "transferFrom(address,address,uint256)";
            let value: u128 = 0;
            let selector = &id(function_sig)[..4];
            let encoded_args = encode(&args);
            
            let mut payload_bytes = Vec::new();
            payload_bytes.extend_from_slice(selector);
            payload_bytes.extend_from_slice(&encoded_args);

            let payload = format!("0x{}", hex::encode(payload_bytes));

            let voucher = object! {
                "destination" => format!("{}", storage.erc721_token),
                "payload" => format!("{}", payload),
                "value" => format!("0x{}", hex::encode(value.to_be_bytes())),
            };

            emit_voucher(voucher).await;
            println!("Token purchased and Withdrawn successfully");
            
        },
        Err(e) => {emit_report("Failed to purchase token".into()).await; println!("Failed to purchase token: {}", e);}
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
    let zero_address = "0x0000000000000000000000000000000000000000".to_string();
    let app_addr = request["data"]["metadata"]["app_contract"]
    .as_str()
    .ok_or("Missing payload")?;

    if storage.app_address == zero_address {
        storage.app_address = app_addr.to_string();
    }
    let sender = request["data"]["metadata"]["msg_sender"]
        .as_str()
        .ok_or("Missing msg_sender in metadata")?
        .to_string();

    match sender.as_str() {
       s if s.to_lowercase() == storage.erc20_portal_address.as_str().to_lowercase() => {
            let (deposited_token, receiver_address, amount) = token_deposit_parse(&_payload)?;
            println!("Deposited token: {}, Receiver: {}, Amount: {}", deposited_token, receiver_address, amount);
            handle_erc20_deposit(receiver_address.to_lowercase(), amount, deposited_token.to_lowercase(), storage).await;
        },
        s if s.to_lowercase() == storage.erc721_portal_address.as_str().to_lowercase() => {
            let (deposited_token, receiver_address, token_id) = token_deposit_parse(&_payload)?;
            println!("Deposited and listed token: {}, Receiver: {}, Token ID: {}", deposited_token, receiver_address, token_id);
            handle_erc721_deposit(receiver_address.to_lowercase(), token_id, deposited_token.to_lowercase(), storage).await;
        },
        _ => {
            let payload_str = hex_to_string(_payload)?;
            let payload_json ;
            match json::parse(&payload_str) {
                Err(_) => {
                    let fixed_payload = try_fix_json_like(&payload_str);
                    match json::parse(&fixed_payload) {
                        Err(_) =>  panic!("Failed to parse decoded payload as JSON even after attempting to fix it"),
                        Ok(val) => payload_json = val,
                    };
                }
                Ok(val) => payload_json = val
            };
            if !payload_json.is_object() {
                emit_report("Decoded payload is not a JSON object".into()).await;
                println!("Decoded payload is not a JSON object");
            }
            if let Some(method_str) = payload_json["method"].as_str() {
                match method_str {
                    "purchase_token" => {handle_purchase_token(sender.to_lowercase(), payload_json.clone(), storage).await; },
                    _ => {emit_report("Unknown method in payload".into()).await; println!("Unknown method in payload")},
                }
            } else {
                emit_report("Missing or invalid method field in payload".into()).await;
                println!("Missing or invalid method field in payload");
            }
        }
    }
    Ok("accept")
}

pub async fn handle_inspect(
    _client: &hyper::Client<hyper::client::HttpConnector>,
    _server_addr: &str,
    request: JsonValue,
    storage: &mut Storage
) -> Result<&'static str, Box<dyn std::error::Error>> {
    println!("Received inspect request data {}", &request);
    let zero_address = "0x0000000000000000000000000000000000000000".to_string();
    let _payload = request["data"]["payload"]
        .as_str()
        .ok_or("Missing payload")?;
    let payload_str = hex_to_string(_payload)?;
    println!("Decoded payload: {}", payload_str);

    let payload_json ;

    match json::parse(&payload_str) {
        Err(_) => {
            let fixed_payload = try_fix_json_like(&payload_str);
            match json::parse(&fixed_payload) {
                Err(_) =>  panic!("Failed to parse decoded payload as JSON even after attempting to fix it"),
                Ok(val) => payload_json = val,
            };
        }
        Ok(val) => payload_json = val
    };

    if let Some(method_str) = payload_json["method"].as_str() {
        match method_str {
            "get_user_erc20_balance" => {  
                let user_address = payload_json["user_address"].as_str().unwrap_or(&zero_address).to_lowercase(); 
                let user_balance = storage.get_user_erc20_token_balance(user_address.as_str()).unwrap_or(&0);
                emit_report(format!("User: {}, balance: {}", user_address, user_balance)).await;
            },
            "get_token_owner" => {  
                let token_id: u128  = payload_json["token_id"].as_u64().unwrap_or(0).into();
                let token_owner = storage.get_erc721_token_owner(token_id).unwrap_or(&zero_address);
                emit_report(format!("Token id: {}, owner: {}", token_id, token_owner)).await;
            },
            "get_all_listed_tokens" => {  
                let listed_tokens = storage.get_listed_tokens();
                emit_report(format!("All listed tokens are: {:?}", listed_tokens)).await;
            },
            _ => {emit_report("Unknown method in payload".into()).await; println!("Unknown method in payload")},
        }
    } else {
        emit_report("Missing or invalid method field in payload".into()).await;
        println!("Missing or invalid method field in payload");
    }
    Ok("accept")
}

pub fn token_deposit_parse(payload: &str) -> Result<(String, String, u128), String> {
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

    let erc721_portal_address = String::from("0x9E8851dadb2b77103928518846c4678d48b5e371");
    let erc20_portal_address = String::from("0xACA6586A0Cf05bD831f2501E7B4aea550dA6562D");
    let erc20_token = String::from("0x5138f529B77B4e0a7c84B77E79c4335D31938fed");
    let erc721_token = String::from("0x1c5AB37576Af4e6BEeCB66Fa6a9FdBc608F44B78");
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

fn try_fix_json_like(s: &str) -> String {
    let mut fixed = s.to_string();

    // Add quotes around keys (rudimentary repair)
    fixed = fixed.replace("{", "{\"");
    fixed = fixed.replace(": ", "\":\"");
    fixed = fixed.replace(", ", "\", \"");
    fixed = fixed.replace("}", "\"}");

    fixed
}

async fn emit_report( payload: String) -> Option<bool> {
    // convert the provided string payload to hex (strip optional "0x" prefix if present)
    let hex_string = {
        let s = payload.strip_prefix("0x").unwrap_or(payload.as_str());
        hex::encode(s.as_bytes())
    };

    let server_addr = env::var("ROLLUP_HTTP_SERVER_URL").expect("ROLLUP_HTTP_SERVER_URL not set");
    let client = hyper::Client::new();

    let response = object! {
        "payload" => format!("0x{}", hex_string),
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

async fn emit_notice( payload: String) {
    let hex_string = {
        let s = payload.strip_prefix("0x").unwrap_or(payload.as_str());
        hex::encode(s.as_bytes())
    };

    let server_addr = env::var("ROLLUP_HTTP_SERVER_URL").expect("ROLLUP_HTTP_SERVER_URL not set");
    let client = hyper::Client::new();

    let response = object! {
        "payload" => format!("0x{}", hex_string),
    };
    let request = hyper::Request::builder()
    .method(hyper::Method::POST)
    .header(hyper::header::CONTENT_TYPE, "application/json")
    .uri(format!("{}/notice", server_addr))
    .body(hyper::Body::from(response.dump()))
    .ok();
    let _response = client.request(request.unwrap()).await;
}
```
