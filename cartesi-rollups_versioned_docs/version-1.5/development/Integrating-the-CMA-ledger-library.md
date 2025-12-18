---
id: Integrating-the-CMA-ledger-library
title: Integrating the CMA ledger library
---

# Integrating the CMA Ledger Library

The **Cartesi Machine Asset (CMA) Ledger** is a core library for managing assets, accounts, balances, and transfers inside Cartesi applications.

You can think of the Ledger as a **plug-and-play wallet engine**. Once integrated, it allows your application to safely track and modify asset state without re-implementing common accounting logic such as deposits, withdrawals, and transfers.
The CMA tools are split into **two complementary libraries**:

- **Ledger**: Manages assets, accounts, balances, and state changes  
- **Parser**: Parses user input and structures data for the ledger to consume  

Together, they provide a smooth development experience:
1. The parser receives raw user input and converts it into structured data.
2. The ledger consumes this structured input and applies the corresponding asset and account updates.

If you are not yet familiar with the parser, see [Integrating the CMA Parser Library](./Integrating-the-CMA-parser-library.md).

By integrating the ledger, your application gains a secure, deterministic, and type-safe way to manage digital assets such as Ether, ERC20, ERC721, and ERC1155, while remaining fully compatible with Cartesi rollup workflows.

## Why Use the Ledger?

The CMA Ledger solves common asset-management problems in Cartesi applications:

- **Unified Asset Management**: Manage multiple asset standards and account models from a single interface.

- **Deterministic & Auditable**: Ledger behavior is identical across environments (tests, simulations, and production), making state changes predictable and auditable.

- **Strong Safety Guarantees**: All operations return typed errors, eliminating silent failures and ambiguous states.

- **Cartesi-Native Design**: Built specifically for Cartesi rollups, while remaining flexible and non-intrusive to application logic.

## Key Capabilities

- **Asset Models**: Support for Ether, ERC20, ERC721, and ERC1155-style assets.

- **Account Models**: Support for Ethereum wallet addresses mapped to generic identifiers' ID.

- **Asset Lifecycle Operations**: Create, retrieve, deposit, withdraw, and transfer assets.

- **Balance & Supply Queries**: Read per-account balances and total asset supply at any time.

- **Strong Typing**: Prevents asset/account mismatches at compile time.

## Defined Data Types

| Type | Description |
|-----|------------|
| `LedgerAssetId` | Internal 64-bit asset identifier |
| `LedgerAccountId` | Internal 64-bit account identifier |
| `AssetType` | ID-based, address-based, or address + ID |
| `AccountType` | Wallet address or generic account ID |
| `RetrieveOperation` | `Find`, `Create`, or `FindOrCreate` |

## Commonly Used Methods

### Asset and Account Retrieval

- **retrieve_asset()**: Retrieve or create an asset in the ledger.

- **retrieve_erc20_asset_via_address()**: Retrieve or create and return an ERC20 asset ID based on address.

- **retrieve_erc721_assets_via_address()**: Retrieve or create and return an ERC721 asset ID based on address and token ID.

- **retrieve_ether_assets**: Retrieve or create and return an Ether asset ID.

- **retrieve_account()**: Retrieve or create a ledger account.

- **retrieve_account_via_address()**: Retrieve or create and return a ledger account ID, based on a user address.

### State Mutations

- **deposit**: Deposit assets to an account's ledger record.

- **withdraw**: Withdraw assets from an account's ledger record.

- **transfer**: Transfer assets between accounts record.

### Queries

- **get_balance**: Get balance for an account from the ledger.

- **get_total_supply**: Get total supply for an asset.

### Lifecycle

- **Ledger::new**: Creates a new ledger.

- **ledger.reset**: Resets all records in a ledger. 

## Error Handling

All ledger operations return a `LedgerError`, including:

- Asset or account not found  
- Insufficient balance  
- Type mismatches  
- Internal ledger failures  

This makes error handling explicit and predictable.

## Installation

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


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
    Ledger, AssetType, RetrieveOperation, AccountType, U256, Address
};

let address_one = "0x0000000000000000000000000000000000000001";
let address_two = "0x0000000000000000000000000000000000000002";
let erc_20_token = "0x92C6bcA388E99d6B304f1Af3c3Cd749Ff0b591e2";
let erc_721_token = "0xc6582A9b48F211Fa8c2B5b16CB615eC39bcA653B";

// Initialize the ledger
let mut ledger = Ledger::new()?;

// Retrieve or create an asset
let token_address = Address::from_str_hex(erc_721_token).unwrap();
let token_id = U256::from_u64(1); // Used for NFTs

let asset_id = ledger.retrieve_asset(
    None,
    Some(token_address),
    Some(token_id),
    AssetType::TokenAddressId,
    RetrieveOperation::FindOrCreate,
)?;

// Retrieve or create an account
let wallet_address = Address::from_str_hex(address_one).unwrap();

let account_id = ledger.retrieve_account(
    None,
    AccountType::WalletAddress,
    RetrieveOperation::FindOrCreate,
    Some(wallet_address.as_bytes())
)?;

// Deposit tokens
ledger.deposit(asset_id, account_id, U256::from_u64(1000)).unwrap();

// Transfer tokens
let recipient_address = Address::from_str_hex(address_two).unwrap();
let receipient_id = ledger.retrieve_account_via_address(recipient_address).unwrap();

let transfer_result = ledger.transfer(asset_id, account_id, recipient_id, U256::from_u64(1)).unwrap();

// Query balances and supply
let balance = ledger.get_balance(asset_id, account_id).unwrap();
let supply = ledger.get_total_supply(asset_id).unwrap();

// Retrieve ERC20 asset ID
let erc20_address = Address::from_str_hex(erc_20_token).unwrap();
let erc20_token_id = ledger.retrieve_erc20_asset_via_address(erc20_address).unwrap();

// Withdraw Token
let withdraw_result = ledger.withdraw(erc20_token_id, account_id, U256::from_u64(100000000000000000000))

// Retrieve Ether ID
let ether_id = ledger.retrieve_ether_assets(); // Ether has no contract address hence there's no need to pass an address
```
</code></pre>
</TabItem>
</Tabs>

## Further Reading

- [C++ API & language bindings](https://github.com/Mugen-Builders/machine-asset-tools)
- [Integrating the CMA Library – Parser Functions](./Integrating-the-CMA-parser-library.md)
