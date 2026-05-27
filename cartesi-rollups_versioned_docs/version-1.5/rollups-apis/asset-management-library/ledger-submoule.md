---
id: ledger-submodule
title: Ledger Submodule
---

# Integrating the Ledger Library

The **Asset Manager Library Ledger submodule** is one of the two submodules of the Asset management library, it's designed for managing assets, accounts, balances, and transfers inside Cartesi applications.

You can think of the Ledger as a **plug-and-play wallet engine**. Once integrated, it allows your application to safely track and modify asset state without re-implementing common accounting logic such as deposits, withdrawals, and transfers.
The CMA tools are split into **two complementary libraries**:

- **Ledger**: Manages assets, accounts, balances, and state changes  
- **Parser**: Parses user input and structures data for the ledger to consume  

Together, they provide a smooth development experience:

1. The parser receives raw user input and converts it into structured data.

2. The ledger consumes this structured input and applies the corresponding asset and account updates.

If you are not yet familiar with the parser, see [Integrating the CMA Parser Library](./parser-submodule.md).

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

The below table details all available methods for handling assets and account retrievals.

| Method | Description | Asset/Account type | Args | Returns |
|---|---|---|---|---|
| `retrieve_asset()` | Low-level method for retrieving or creating any asset | Generic | `asset_id`, `token_address`, `token_id`, `asset_type`, `operation` | `Result<LedgerAssetId, LedgerError>` |
| `retrieve_erc20_asset_via_address()` | Retrieves or creates an ERC20 asset using its contract address | Erc20 | `token_address` | `Result<LedgerAssetId, LedgerError>` |
| `retrieve_erc721_assets_via_address()` | Retrieves or creates an ERC721 asset using contract address and token ID | Erc721 | `token_address`, `token_id` | `Result<LedgerAssetId, LedgerError>` |
| `retrieve_ether_assets()` | Retrieves or creates the Ether asset | Ether | none | `Result<LedgerAssetId, LedgerError>` |
| `retrieve_account()` | Low level method for retrieving or creating an account | Generic | `account_id`, `account_type`, `addr_or_id`, `operation` | `Result<LedgerAccountId, LedgerError>` |
| `retrieve_account_via_address()` | Retrieves or creates an account mapped to an Ethereum address | Wallet | wallet_address | `Result<LedgerAccountId, LedgerError>` |

### State Mutations

State mutations cover methods that alter the assets record of the ledger library, this could be either to deposit, transfer or withdraw assets, the below table offers better description for each of this methods.

| Method | Description | Args |
|---|---|---|
| `deposit()` | Adds assets to an account's balance | `asset_id`, `to_account_id`, `amount` |
| `withdraw()` | Removes assets from an account's balance | `asset_id`, `from_account_id`, `amount` |
| `transfer()` | Moves assets between two accounts | `asset_id`, `from_account_id`, `to_account_id`, `amount` |

### Queries

The Ledger also exposes read only methods for inspecting its internal state. These methods do not mutate state and can be safely called at any time.

| Method | Description | Args | Returns |
|---|---|---|---|
| `get_balance()` | Returns the balance of an asset for an account | `asset_id`, `account_id` | `Result<U256, LedgerError>` |
| `get_total_supply()` | Returns the total supply of an asset | `asset_id` | `Result<U256, LedgerError>` |

### Lifecycle

Before using the ledger lib, it's necessary to initialize a new instance via the `new()` method. This returns a ledger struct that serves as the single source of truth for all asset and account records in your application. The below table provides more details about functions that alter the lifecycle of the ledger.

| Method | Description | Returns |
|---|---|---|
| `Ledger::new()` | Creates a new ledger instance | `Result<Ledger, LedgerError>` |
| `ledger.reset()` | Resets all records in the ledger | `Result<(), LedgerError>` |

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
- [Integrating the CMA Library – Parser Functions](./parser-submodule.md)
