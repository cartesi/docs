---
id: parser-submodule
title: Parser Submodule
---

# Integrating the Parser Library

The **Asset Manager Library Parser submodule** is a submodule of the Asset management library designed to handle the encoding and decoding of Cartesi application inputs and outputs in a type-safe, user-friendly, and extensible way. The parser is implemented natively in each language (Rust, Python, C++, etc.) to maximize flexibility and allow seamless integration into various application development environments.

## Functions of the Parser Lib

- **Parsing Rollup Inputs and Inspects**: Decode raw payloads from Cartesi rollup advance/inspect requests into rich, typed objects for validation/business logic.

- **Voucher Encoding**: Construct valid voucher payloads targeting Ether, ERC20, ERC721, and ERC1155 standards to move these assets back to L1.

## Benefits of the Parser Lib

- **Full Coverage of Token Standards**: Supports parsing of inspects requests, token deposit and voucher generation for major assets (Ether, ERC20, ERC721, ERC1155).

- **Cartesi-Native Design**: Built specifically for Cartesi rollups, while remaining flexible and non-intrusive to application logic.

- **Deterministic & Auditable**: Ledger behavior is identical across languages and environments (tests, simulations, and production), making state changes predictable and auditable.

- **Data Integrity & Safety**: Strictly typed output models and errors boost security while eliminating common integration bugs.

## Defined Data Types

| Type               | Description                                |
|--------------------|--------------------------------------------|
| `CmaParserInputType` | An enum of all supported operation types (requests) that can be decoded (deposit, withdrawal, transfer, inspect, etc.)|
| `CmaParserInputData` | An enum containing a definition of all possible decoded input return object  |
| `CmaParserInput`   | The fully parsed request object containing the request type and the decoded input object (CmaParserInputData) |
| `CmaVoucherFieldType`| Enum, fields for all voucher types (Ether, ERC20, etc.)|
| `CmaVoucher`       | Output-ready voucher ABI fields            |
| `TxHexCodes`       | An enum containing function selector definitions for all decodable methods  |

Result objects and error types are strictly enforced, ensuring safe contract logic in every supported language.

## Commonly Used Methods

### **cma_decode_advance():** 
This function receives a request type identifier as well as the application advance input, then decodes the input and returns a well structured output object based on the specified request type.

#### **Function declaration:** 
Below is a function declaration of the cma_decode_advance() function across multiple languages, it contains the function arguments and return types.

<Tabs>
<TabItem value="Rust" label="Rust" default>
<pre><code>

```rust
fn cma_decode_advance(req_type:  CmaParserInputType, input: JsonValue) -> Result<CmaParserInput, CmaParserError>;
```
</code></pre>
</TabItem>

<TabItem value="cpp" label="cpp" default>
<pre><code>

```cpp
cma_parser_error_t cma_decode_advance(cma_parser_input_type_t type, const cmt_rollup_advance_t *input, cma_parser_input_t *parser_input);
```
</code></pre>
</TabItem>
</Tabs>

#### **Arguments:** 
The cma_decode_advance function takes two arguments `req_type` and `input` :

- **req_type**: This an enum, it represents the type of request being passed to the parser and helps the parser decide how to decode the `input`. Below is a sample definition of the req_type in different languages.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="▶" label="▶" default>

```bash
Click on Rust or Cpp tab to expand
```

</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CmaParserInputType {
    CmaParserInputTypeNone,
    CmaParserInputTypeAuto,
    CmaParserInputTypeUnidentified,
    CmaParserInputTypeEtherDeposit,
    CmaParserInputTypeErc20Deposit,
    CmaParserInputTypeErc721Deposit,
    CmaParserInputTypeErc1155SingleDeposit,
    CmaParserInputTypeErc1155BatchDeposit,
    CmaParserInputTypeEtherWithdrawal,
    CmaParserInputTypeErc20Withdrawal,
    CmaParserInputTypeErc721Withdrawal,
    CmaParserInputTypeErc1155SingleWithdrawal,
    CmaParserInputTypeErc1155BatchWithdrawal,
    CmaParserInputTypeEtherTransfer,
    CmaParserInputTypeErc20Transfer,
    CmaParserInputTypeErc721Transfer,
    CmaParserInputTypeErc1155SingleTransfer,
    CmaParserInputTypeErc1155BatchTransfer,
    CmaParserInputTypeBalance,
    CmaParserInputTypeSupply,
}
```
</code></pre>
</TabItem>

<TabItem value="cpp" label="cpp" default>
<pre><code>

```cpp
enum cma_parser_input_type_t {
    CMA_PARSER_INPUT_TYPE_NONE,
    CMA_PARSER_INPUT_TYPE_AUTO,
    CMA_PARSER_INPUT_TYPE_ETHER_DEPOSIT,
    CMA_PARSER_INPUT_TYPE_ERC20_DEPOSIT,
    CMA_PARSER_INPUT_TYPE_ERC721_DEPOSIT,
    CMA_PARSER_INPUT_TYPE_ERC1155_SINGLE_DEPOSIT,
    CMA_PARSER_INPUT_TYPE_ERC1155_BATCH_DEPOSIT,
    CMA_PARSER_INPUT_TYPE_ETHER_WITHDRAWAL,
    CMA_PARSER_INPUT_TYPE_ERC20_WITHDRAWAL,
    CMA_PARSER_INPUT_TYPE_ERC721_WITHDRAWAL,
    CMA_PARSER_INPUT_TYPE_ERC1155_SINGLE_WITHDRAWAL,
    CMA_PARSER_INPUT_TYPE_ERC1155_BATCH_WITHDRAWAL,
    CMA_PARSER_INPUT_TYPE_ETHER_TRANSFER,
    CMA_PARSER_INPUT_TYPE_ERC20_TRANSFER,
    CMA_PARSER_INPUT_TYPE_ERC721_TRANSFER,
    CMA_PARSER_INPUT_TYPE_ERC1155_SINGLE_TRANSFER,
    CMA_PARSER_INPUT_TYPE_ERC1155_BATCH_TRANSFER,
    CMA_PARSER_INPUT_TYPE_BALANCE,
    CMA_PARSER_INPUT_TYPE_SUPPLY,
};
```
</code></pre>
</TabItem>
</Tabs>

- **input**: This is a Json object type, and is expected to be the exact JSON object that was passed to the application from the rollup server.


#### **Return / Output:** 
The `cma_decode_advance()` function returns either an error or a struct, in certain languages, it returns both. The struct returned contains the `req_type` and another struct called `input` which contains well labelled arguments extracted from the JSON input received from the rollups server. Below is a sample declaration of the return values of the cma_decode_advance function.

import RustOutput from './snippets/rust-parser-result-types.md';
import CppOutput from './snippets/cpp-parser-result-types.md';

<Tabs>
<TabItem value="▶" label="▶" default>

```bash
Click on Rust or Cpp tab to expand
```

</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>
    <RustOutput />
</code></pre>
</TabItem>

<TabItem value="cpp" label="cpp" default>
<pre><code>
    <CppOutput />
</code></pre>
</TabItem>
</Tabs>

### **cma_decode_inspect():** 
This receives the application inspect value, then decodes and returns a structured object based on the inspect request type.

#### **Function declaration:** 
Below is a function declaration of the cma_decode_inspect() function across multiple languages, it also contains the function arguments and return types.

<Tabs>
<TabItem value="Rust" label="Rust" default>
<pre><code>

```rust
fn cma_decode_inspect(input: JsonValue) -> Result<CmaParserInput, CmaParserError>;
```
</code></pre>
</TabItem>

<TabItem value="cpp" label="cpp" default>
<pre><code>

```cpp
int cma_parser_decode_inspect(cma_parser_input_type_t type, const cmt_rollup_inspect_t *input, cma_parser_input_t *parser_input);
```
</code></pre>
</TabItem>
</Tabs>

#### **Arguments:** 
Depending on the implementation language, the cma_decode_inspect function takes a single or two arguments (just `input` or `type` and `input`) then returns the destructured `CmaParserInput`.

- **input**: This is a JSON object type, and is expected to be the exact JSON object that was passed to the application from the rollup server.

- **type**: This an enum, it represents the type of request being passed to the parser and helps the parser decide how to decode the `input`. It is of the same type as the `req_input` from the cma_decode_advance() function, but the cma_parser_decode_inspect() function only accepts the `CMA_PARSER_INPUT_TYPE_BALANCE`, `CMA_PARSER_INPUT_TYPE_SUPPLY` components of the enum.

#### **Return / Output:** 
The `cma_parser_decode_inspect()` function returns either an error or a struct, in certain languages like C++, it returns both. The struct returned is the same as the `req_type` that's returned by the cma_parser_decode_advance function.

### **cma_encode_voucher():** 
This function requires the request type as well as a well defined struct containing all necessary details to construct the specified voucher, then proceeds to build and return the constructed voucher struct.

#### **Function declaration:** 
Below is a function declaration of the cma_encode_voucher() function across multiple languages:

<Tabs>
<TabItem value="Rust" label="Rust" default>
<pre><code>

```rust
fn cma_encode_voucher( req_type: CmaParserVoucherType, voucher_request: CmaVoucherFieldType) -> Result<CmaVoucher, CmaParserError> 
```
</code></pre>
</TabItem>

<TabItem value="cpp" label="cpp" default>
<pre><code>

```cpp
cma_parser_error_t cma_encode_voucher(cma_parser_voucher_type_t type, cma_abi_address_t *app_address, const cma_parser_voucher_data_t *voucher_request, cma_voucher_t *voucher);
```
</code></pre>
</TabItem>
</Tabs>

#### **Arguments:** 
For Rust applicaitons the cma_decode_advance function takes two arguments, `req_type` and `voucher_request`, while for C++ it takes 4 arguments; `type`, `app_address`, `voucher_request`, `voucher`.

- **req_type / type**: This is an enum, it specifies the exact voucher type which the application wants the parser lib to encode.

<Tabs>
<TabItem value="Rust" label="Rust" default>
<pre><code>

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CmaParserVoucherType {
    CmaParserVoucherTypeNone,
    CmaParserVoucherTypeEther,
    CmaParserVoucherTypeErc20,
    CmaParserVoucherTypeErc721,
    CmaParserVoucherTypeErc1155Single,
    CmaParserVoucherTypeErc1155Batch,
}
```
</code></pre>
</TabItem>

<TabItem value="cpp" label="cpp" default>
<pre><code>

```cpp
enum cma_parser_voucher_type_t {
    CMA_PARSER_VOUCHER_TYPE_NONE,
    CMA_PARSER_VOUCHER_TYPE_ETHER,
    CMA_PARSER_VOUCHER_TYPE_ERC20,
    CMA_PARSER_VOUCHER_TYPE_ERC721,
    CMA_PARSER_VOUCHER_TYPE_ERC1155_SINGLE,
    CMA_PARSER_VOUCHER_TYPE_ERC1155_BATCH,
};
```
</code></pre>
</TabItem>
</Tabs>

- **app_address**: This is the address of the application on the base layer.

- **voucher_request**: This is an enum containing a group of structs, with each struct containing the different arguments needed to create a specific type of voucher, the parser library receives this struct then creates a voucher based on the contents of that struct. Below is a structure of the voucher_request enum along with all supported child structs.


<Tabs>
<TabItem value="▶" label="▶" default>

```bash
Click on Rust or Cpp tab to expand
```

</TabItem>


<TabItem value="Rust" label="Rust" default>
<pre><code>

```rust
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CmaVoucherFieldType {
    EtherVoucherFields(CmaParserEtherVoucherFields),
    Erc20VoucherFields(CmaParserErc20VoucherFields),
    Erc721VoucherFields(CmaParserErc721VoucherFields),
    Erc1155SingleVoucherFields(CmaParserErc1155SingleVoucherFields),
    Erc1155BatchVoucherFields(CmaParserErc1155BatchVoucherFields),
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserEtherVoucherFields {
    pub amount: U256,
    pub receiver: Address,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserErc20VoucherFields {
    pub token: Address,
    pub receiver: Address,
    pub amount: U256,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserErc721VoucherFields {
    pub token: Address,
    pub token_id: U256,
    pub receiver: Address,
    pub application_address: Address,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserErc1155SingleVoucherFields {
    pub token: Address,
    pub token_id: U256,
    pub receiver: Address,
    pub value: U256,
    pub amount: U256,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserErc1155BatchVoucherFields {
    pub token: Address,
    pub receiver: Address,
    pub count: usize,
    pub token_ids: Vec<U256>,
    pub value: U256,
    pub amounts: Vec<U256>,
}
```
</code></pre>
</TabItem>

<TabItem value="cpp" label="cpp" default>
<pre><code>

```cpp
typedef struct cma_parser_voucher_data {
    cma_abi_address_t *receiver;
    union {
        struct cma_parser_ether_voucher_fields_t ether_voucher_fields;
        struct cma_parser_erc20_voucher_fields_t erc20_voucher_fields;
        struct cma_parser_erc721_voucher_fields_t erc721_voucher_fields;
        struct cma_parser_erc1155_single_voucher_fields_t erc1155_single_voucher_fields;
        struct cma_parser_erc1155_batch_voucher_fields_t erc1155_batch_voucher_fields;
    } u;
} cma_parser_voucher_data_t;

struct cma_parser_ether_voucher_fields_t {
    cma_amount_t amount;
};
struct cma_parser_erc20_voucher_fields_t {
    cma_token_address_t token;
    cma_amount_t amount;
};
struct cma_parser_erc721_voucher_fields_t {
    cma_token_address_t token;
    cma_token_id_t token_id;
    cma_abi_bytes_t exec_layer_data;
};
struct cma_parser_erc1155_single_voucher_fields_t {
    cma_token_address_t token;
    cma_token_id_t token_id;
    cma_amount_t amount;
};
struct cma_parser_erc1155_batch_voucher_fields_t {
    cma_token_address_t token;
    size_t count;
    cma_token_id_t *token_ids;
    cma_amount_t *amounts;
};
```
</code></pre>
</TabItem>
</Tabs>

#### **Return / Output:** 
The `cma_encode_voucher()` function returns either an error or a struct for the rust implementation, but for C++ it returns an error as well as populate an area in memory with the voucher it generated based on the application request. Below is a definition and structure of the possible return struct containing the voucher.

<Tabs>
<TabItem value="Rust" label="Rust" default>
<pre><code>

```rust
fn cma_encode_voucher( req_type: CmaParserVoucherType, voucher_request: CmaVoucherFieldType) -> Result<CmaVoucher, CmaParserError> 

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaVoucher {
    pub destination: String,
    pub payload: String,
}
```
</code></pre>
</TabItem>

<TabItem value="cpp" label="cpp" default>
<pre><code>

```cpp
cma_parser_error_t cma_encode_voucher(cma_parser_voucher_type_t type, cma_abi_address_t *app_address, const cma_parser_voucher_data_t *voucher_request, cma_voucher_t *voucher);

typedef struct cma_voucher {
    cmt_abi_address_t address;
    cmt_abi_bytes_t data;
} cma_voucher_t;
```
</code></pre>
</TabItem>
</Tabs>


## Error Handling

All parser operations return a possible `CmaParserError`, Error, which may include:

- Incompatible input error
- Malformed Input Error  
- Unknown Error  
- User specified message string Error

## Supported Advance Operations

### **Deposits:** 

The parser library automatically decodes deposits sent through the **Cartesi asset portals** (Ether, ERC20, ERC721, and ERC1155). When the application receives a deposit request from any of the portals. The application logic compares and identifies the caller to be one of the portal, then calls the **cma_decode_advance()** function in the parser lib, passing it the input type (based on the exact portal), and the exact input received. The parser lib:

1. Extracts relevant details such as:
   - Deposited asset
   - Depositor address
   - Amount or token ID(s)
   - Execution layer data (if any)

2. Builds a strongly typed struct specific to the deposited asset.

3. Returns the decoded struct to the application.

The returned struct can then be consumed directly by **The Application-defined logic**, or **The CMA Ledger library** for state updates. This process is automatic and does **not** require application-defined function selectors.

### **Application defined calls (Withdrawals, Transfers, Etc.)**:

Unlike deposits, **application-defined calls** must follow a predefined ABI structure for the parser to decode them correctly. To properly decode an application input, the parser must:
- Know the expected function selector
- Know the argument order and types

The parser achieves this by maintaining a **predefined collection of supported function selectors**. When an input is received:
1. The parser extracts the first 4 bytes (function selector)
2. It compares the selector against its supported collection
3. If a match is found, the input is decoded according to the expected ABI
4. The decoded data is returned as a structured type

It is therefore important that **if you intend to use the parser lib, you should structure your input to match one of the supported function selector signatures then also send the input to the applicaton as an abi encoded hex string**. In a situation where the input does not match any of the predefined function selectors, the parser simply returns the Input to the application as decode response.

The table below lists all **application-defined function selectors** supported by the parser library. Inputs **must** be ABI-encoded and match one of these signatures to be decoded correctly.

| Function Declaration | Function Selector | Function Arguments |
|----------------------|-------------------|--------------------|
| `WithdrawEther(uint256, bytes)` | `0x8cf70f0b` | • `uint256` – Amount of Ether to withdraw<br/>• `bytes` – Execution-layer data |
| `WithdrawErc20(address, uint256, bytes)` | `0x4f94d342` | • `address` – ERC20 token contract address<br/>• `uint256` – Amount to withdraw<br/>• `bytes` – Execution-layer data |
| `WithdrawErc721(address, uint256, bytes)` | `0x33acf293` | • `address` – ERC721 token contract address<br/>• `uint256` – Token ID to withdraw<br/>• `bytes` – Execution-layer data |
| `WithdrawErc1155Single(address, uint256, uint256, bytes)` | `0x8bb0a811` | • `address` – ERC1155 token contract address<br/>• `uint256` – Token ID<br/>• `uint256` – Amount to withdraw<br/>• `bytes` – Execution-layer data |
| `WithdrawErc1155Batch(address, uint256[], uint256[], bytes)` | `0x50c80019` | • `address` – ERC1155 token contract address<br/>• `uint256[]` – Token IDs<br/>• `uint256[]` – Amounts (must match token IDs)<br/>• `bytes` – Execution-layer data |
| `TransferEther(uint256, bytes32, bytes)` | `0x428c9c4d` | • `uint256` – Amount of Ether to transfer<br/>• `bytes32` – Recipient account identifier<br/>• `bytes` – Execution-layer data |
| `TransferErc20(address, bytes32, uint256, bytes)` | `0x03d61dcd` | • `address` – ERC20 token contract address<br/>• `bytes32` – Recipient account identifier<br/>• `uint256` – Amount to transfer<br/>• `bytes` – Execution-layer data |
| `TransferErc721(address, bytes32, uint256, bytes)` | `0xaf615a5a` | • `address` – ERC721 token contract address<br/>• `bytes32` – Recipient account identifier<br/>• `uint256` – Token ID to transfer<br/>• `bytes` – Execution-layer data |
| `TransferErc1155Single(address, bytes32, uint256, uint256, bytes)` | `0xe1c913ed` | • `address` – ERC1155 token contract address<br/>• `bytes32` – Recipient account identifier<br/>• `uint256` – Token ID<br/>• `uint256` – Amount to transfer<br/>• `bytes` – Execution-layer data |
| `TransferErc1155Batch(address, bytes32, uint256[], uint256[], bytes)` | `0x638ac6f9` | • `address` – ERC1155 token contract address<br/>• `bytes32` – Recipient account identifier<br/>• `uint256[]` – Token IDs<br/>• `uint256[]` – Amounts<br/>• `bytes` – Execution-layer data |

## Installation

<Tabs>
<TabItem value="Rust" label="Rust" default>
<pre><code>

```bash
cargo add cma-rust-parser
```
</code></pre>
</TabItem>
</Tabs>


## Usage Example

<Tabs>
<TabItem value="Rust" label="Rust" default>
<pre><code>

```rust
use cma_rust_parser::{
    CmaParserInputType, cma_decode_advance, cma_encode_voucher, CmaParserVoucherType, CmaVoucherFieldType, CmaParserEtherVoucherFields, CmaParserInputData, CmaParserErc721VoucherFields
};
use cma_rust_parser::helpers::{ToAddress, ToJson};

pub struct Storage {
    pub erc721_portal_address: String,
    pub dapp_address_relay: String,
    pub erc721_token: String,
    pub app_address: String,
}

pub async fn handle_advance( _client: &hyper::Client<hyper::client::HttpConnector>, _server_addr: &str, request: JsonValue, storage: &mut Storage
) -> Result<&'static str, Box<dyn std::error::Error>> {
    let zero_address = "0x0000000000000000000000000000000000000000".to_string();
    let msg_sender = request["data"]["metadata"]["msg_sender"].as_str().ok_or("Invalid msg_sender address")?;
    let mut decoded_req = Err(CmaParserError::Unknown);

    match msg_sender {
        s if s.to_lowercase() == storage.erc721_portal_address.to_lowercase() => {
            let req_type = CmaParserInputType::CmaParserInputTypeErc721Deposit;
            // CALL THE PARSER LIBRARY TO DECODE THE ERC721 TOKEN DEPOSIT
            decoded_req = cma_decode_advance(req_type, request.clone()); 
        },
        s if s.to_lowercase() == storage.dapp_address_relay.to_lowercase() => {
            if storage.app_address == zero_address {
                let _payload = request["data"]["payload"].as_str().ok_or("Missing payload")?;
                storage.app_address = _payload.to_string();
            }
        },
        _ => { // IF THE MSG_SENDER IS NOT ANY OF THE PORTALS OR THE ADDRESS RELAYER, IT'S SAFE TO ASSUME IT'S A REGULAR USER INTERACTION
            let req_type: CmaParserInputType = CmaParserInputType::CmaParserInputTypeAuto;
            // CALL THE PARSER LIBRARY TO DECODE A USER INTERACTION (PARSER LIB MATCHES FUNCTION SELECTOR)
            decoded_req = cma_decode_advance(req_type, request.clone()); 
        }
    }

    match decoded_req { // MATCH ON THE RESPONSE FROM THE PARSER LIB SO AS TO HANDLE ERRORS OR CONSUME RESPONSE OBJECT
        Ok(decoded) => {
            match decoded.req_type { // MATCH ON A SUCCESFUL RESPONSE TO IDENTIFY WHICH OBJECT WAS RETURNED (ERC721)
                CmaParserInputType::CmaParserInputTypeErc721Deposit => {
                    if let CmaParserInputData::Erc721Deposit(data) = input {                        
                        // BUILD A STRUCT WHICH CONTAINS ALL NECESSARY DATA TO BUILD A VOUCHER
                        let voucher_request = CmaParserErc721VoucherFields{
                            token: format!("{:?}", data.token).to_address().unwrap(),
                            token_id: data.token_id.into(),
                            receiver: format!("{:?}", data.sender).to_address().unwrap(),
                            application_address: storage.app_address.to_address().unwrap()
                        };
                        // CALL THE PARSER LIB TO BUILD AN ERC721 VOUCHER
                        if let Ok(voucher) = cma_encode_voucher(CmaParserVoucherType::CmaParserVoucherTypeErc721, CmaVoucherFieldType::Erc721VoucherFields(voucher_request)) {
                            emit_voucher(voucher.to_json()).await;
                        }
                    }
                },
                CmaParserInputType::CmaParserInputTypeUnidentified => {
                    // HANDLE THE RESULT STRUCT FOR USER DEFINED INPUTS
                }
                _ => {
                    // HANDLE ANY OTHER POSSIBLE RESPONSE STRUCTURE THE APPLICAITON EXPECTS
                }
            }
        },
        Err(e) => {
            emit_report(format!("Could'nt decoding advance request: {:?}", e)).await;
        }
    }
    Ok("accept")
}
```
</code></pre>
</TabItem>
</Tabs>

## Best Practices
- Use type-safe enums and objects in every language to avoid logic bugs
- Always check error results, especially when parsing raw input or encoding vouchers

## See Also
- [Using the CMA library - Ledger component](./ledger-submoule.md)
- [Original C++ implementation & FFI headers](https://github.com/Mugen-Builders/machine-asset-tools)
- [Rust parser reference (crate)](https://github.com/Mugen-Builders/machine-asset-tools/tree/main/cma-rust-parser)
