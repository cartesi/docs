---
id: managing-balances
title: Managing balances
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The CMA ledger records which account owns which asset, and how much of it. Think of it as a plug in wallet for your application: instead of writing your own balance bookkeeping, you call deposit, withdraw and transfer, and the ledger keeps the state consistent.

## Core ideas

The ledger works with three things:

- **Accounts**. An account usually maps to a wallet address, but it can also map to a generic 32 byte ID. Internally each account gets a small numeric `account_id`.
- **Assets**. An asset is anything you track: Ether, an ERC20 token (identified by its address), an ERC721 or ERC1155 token (identified by address plus token ID). Internally each asset gets a numeric `asset_id`.
- **Balances**. The amount of an asset that an account holds. The ledger also tracks the total supply of each asset inside your application.

Most ledger calls follow a retrieve pattern: you describe the account or asset, and the ledger finds it or creates it and hands back its ID. After that, you work with IDs only.

The ledger comes in two flavors. The multi asset ledger described above tracks many assets at once. The single asset ledger tracks one fixed asset and stores balances in a form the default emergency withdrawal tooling can prove. See [Single-asset ledger](#single-asset-ledger) below.

## Creating a ledger

<Tabs groupId="language">
<TabItem value="python" label="Python" default>

Create an in memory ledger with no arguments, or a file backed ledger that survives restarts by passing a memory file and size limits:

```python
from pycma import Ledger

# In memory
ledger = Ledger()

# File backed, sized for your application. The file is created and sized
# when missing, and validated when it already exists.
ledger = Ledger(
    memory_filename="/dev/pmem2",
    offset=0,
    mem_length=64 * 1024 * 1024,
    n_accounts=16 * 1024,
    n_assets=8,
    n_balances=8 * 16 * 1024,
)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use libcma_binding_rust::Ledger;

// In memory
let mut ledger = Ledger::new()?;
```

The binding also exposes `init_from_file` and `init_from_buffer` for persistent multi asset ledgers, configured through `LedgerFileConfig` and `LedgerBufferConfig`, and `init_single_from_file` and `init_single_from_buffer` for the single asset ledger. Call them on a ledger created with `Ledger::new()`.

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
cma_ledger_t ledger;
if (cma_ledger_init(&ledger) < 0) {
    printf(cma_ledger_get_last_error_message());
}

// ... use the ledger ...

cma_ledger_fini(&ledger);
```

`cma_ledger_init_file` and `cma_ledger_init_buffer` create persistent multi asset ledgers backed by a memory file or a buffer you provide. `cma_ledger_init_single_file` and `cma_ledger_init_single_buffer` create the single asset ledger.

</TabItem>
</Tabs>

## Single-asset ledger

The single asset ledger is a variant that tracks one fixed asset for the life of the store. You choose the asset when you create it, either Ether or one ERC20, and it cannot change after that. Use it when your application handles a single token and you want balances that are easy to recover on the base layer.

It differs from the multi asset ledger in a few ways:

- **One immutable asset**. There is always exactly one asset, with id `0`. Reopening the store with a different asset is rejected.
- **64 bit balances**. Amounts are 64 bit values rather than 256 bit.
- **A 32 byte account record**. Each withdrawable account is stored as a 32 byte record: an 8 byte balance in little endian order, then the 20 byte owner address, then 4 bytes of padding. This is the standard accounts drive layout, so the default emergency withdrawal tooling can prove a balance and release it without a custom output builder.
- **Withdrawable and virtual accounts**. Accounts keyed by a wallet address are withdrawable and live in the drive records. Accounts keyed by an internal id are virtual and live off the drive, so they are not part of the provable set.

Create it from a file. The deposit, withdraw, transfer and query calls are the same as the multi asset ledger, and the asset id is always `0`.

<Tabs groupId="language">
<TabItem value="python" label="Python" default>

```python
from pycma import Ledger

# Single ERC20 drive. Omit account_drive_token for an Ether drive.
ledger = Ledger(
    memory_filename="/dev/pmem1",
    offset=0,
    mem_length=4 * 1024 * 1024,
    n_accounts=4096,
    n_assets=1,    # unused by the single asset ledger, but must be non zero
    n_balances=1,  # unused by the single asset ledger, but must be non zero
    single_asset_account_drive=True,
    account_drive_token="0x88A2120B7068E78692C8fd12E751d610B6377E4d",
)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
use libcma_binding_rust::{Ledger, LedgerAsset, LedgerSingleFileConfig};

let mut ledger = Ledger::new()?;
ledger.init_single_from_file(
    "/dev/pmem1",
    LedgerSingleFileConfig { offset: 0, memory_length: 4 * 1024 * 1024, max_accounts: 4096 },
    LedgerAsset::Erc20(token_address), // or LedgerAsset::Ether
)?;
```

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
cma_ledger_t ledger;
cma_token_address_t token = { /* 20 bytes */ };

// Single ERC20 drive. Use CMA_LEDGER_ASSET_TYPE_BASE and a null token for Ether.
cma_ledger_init_single_file(&ledger, "/dev/pmem1", 0, 4 * 1024 * 1024, 4096,
    CMA_LEDGER_ASSET_TYPE_TOKEN_ADDRESS, &token);
```

</TabItem>
</Tabs>

## Accounts and assets

<Tabs groupId="language">
<TabItem value="python" label="Python" default>

`retrieve_account` and `retrieve_asset` find an entry or create it when it does not exist yet. Both return a dictionary that includes the internal ID:

```python
# Account from a wallet address
account = ledger.retrieve_account(account="0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")
account_id = account["account_id"]

# The Ether asset (the base token has no contract address)
ether = ledger.retrieve_asset(base_token=True)

# An ERC20 asset, identified by its contract address
erc20 = ledger.retrieve_asset(token="0x491604c0fdf08347dd1fa4ee062a822a5dd06b5d")

# An ERC721 asset, identified by address plus token ID
nft = ledger.retrieve_asset(token="0x...", token_id=1)

# An ERC1155 asset, where each token ID has its own amount
sft = ledger.retrieve_asset(token="0x...", token_id=1, token_id_with_amount=True)

# Find only, do not create
existing = ledger.retrieve_asset(base_token=True, force_find=True)
```

</TabItem>
<TabItem value="rust" label="Rust">

The binding has one generic method and shortcuts for the common cases:

```rust
use libcma_binding_rust::types::{AssetType, AccountType, RetrieveOperation};
use libcma_binding_rust::types::{Address, U256};

// Shortcuts
let ether_id = ledger.retrieve_ether_assets()?;
let erc20_id = ledger.retrieve_erc20_asset_via_address(token_address)?;
let erc721_id = ledger.retrieve_erc721_assets_via_address(token_address, token_id)?;
let account_id = ledger.retrieve_account_via_address(wallet_address)?;

// Generic forms
let asset_id = ledger.retrieve_asset(
    None,                            // asset_id, when you already know it
    Some(token_address),
    Some(token_id),
    AssetType::TokenAddressId,
    RetrieveOperation::FindOrCreate,
)?;

let account_id = ledger.retrieve_account(
    None,
    AccountType::WalletAddress,
    RetrieveOperation::FindOrCreate,
    Some(wallet_address.as_bytes()),
)?;
```

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
// Find or create an account from a wallet address
cma_ledger_account_t account = {.address = {.data = {
    0xf3, 0x9f, 0xd6, 0xe5, 0x1a, 0xad, 0x88, 0xf6, 0xf4, 0xce,
    0x6a, 0xb8, 0x82, 0x72, 0x79, 0xcf, 0xff, 0xb9, 0x22, 0x66,
}}};
cma_ledger_account_id_t account_id;
cma_ledger_account_type_t account_type = CMA_LEDGER_ACCOUNT_TYPE_WALLET_ADDRESS;
cma_ledger_retrieve_account(&ledger, &account_id, &account, NULL, NULL, &account_type, CMA_LEDGER_OP_FIND_OR_CREATE);

// Find or create an asset from a token address
cma_token_address_t token_address = { /* 20 bytes */ };
cma_ledger_asset_id_t asset_id;
cma_amount_t total_supply;
cma_ledger_asset_type_t asset_type = CMA_LEDGER_ASSET_TYPE_TOKEN_ADDRESS;
cma_ledger_retrieve_asset(&ledger, &asset_id, &token_address, NULL, &total_supply, &asset_type, CMA_LEDGER_OP_FIND_OR_CREATE);
```

</TabItem>
</Tabs>

## Moving assets

Three operations change balances. Each one fails with a clear error instead of leaving partial state, for example when an account tries to spend more than it holds.

<Tabs groupId="language">
<TabItem value="python" label="Python" default>

```python
# Credit an account, for example after a decoded deposit
ledger.deposit(asset_id, account_id, amount)

# Move assets between two accounts inside the application
ledger.transfer(asset_id, from_account_id, to_account_id, amount)

# Debit an account, for example before emitting a withdrawal voucher
ledger.withdraw(asset_id, account_id, amount)
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
ledger.deposit(asset_id, to_account_id, amount)?;
ledger.transfer(asset_id, from_account_id, to_account_id, amount)?;
ledger.withdraw(asset_id, from_account_id, amount)?;
```

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
cma_ledger_deposit(&ledger, asset_id, to_account_id, &amount);
cma_ledger_transfer(&ledger, asset_id, from_account_id, to_account_id, &amount);
cma_ledger_withdraw(&ledger, asset_id, from_account_id, &amount);
```

</TabItem>
</Tabs>

## Reading balances

Queries never change state, so you can call them from inspect handlers.

<Tabs groupId="language">
<TabItem value="python" label="Python" default>

```python
balance = ledger.balance(asset_id, account_id)   # int
supply = ledger.supply(asset_id)                 # int, total supply of the asset
```

</TabItem>
<TabItem value="rust" label="Rust">

```rust
let balance = ledger.get_balance(asset_id, account_id)?;   // U256
let supply = ledger.get_total_supply(asset_id)?;           // U256
```

</TabItem>
<TabItem value="cpp" label="C++">

```cpp
cma_amount_t balance;
cma_ledger_get_balance(&ledger, asset_id, account_id, &balance, NULL);

// The total supply is returned by cma_ledger_retrieve_asset
// through its out_total_supply parameter.
```

</TabItem>
</Tabs>

## A complete deposit flow

This is how the parser and the ledger work together when an ERC20 deposit arrives. The snippet comes from the [Python wallet sample](https://github.com/Mugen-Builders/libcma-binding-python/blob/main/sample_apps/wallet_app/app.py):

```python
if msg_sender == ERC20_PORTAL_ADDRESS:
    deposit = decode_erc20_deposit(advance)

    asset = ledger.retrieve_asset(token=deposit["token"])
    account = ledger.retrieve_account(account=deposit["sender"])

    ledger.deposit(asset["asset_id"], account["account_id"], deposit["amount"])
    return True
```

## Error handling

Ledger operations report failures such as insufficient funds, unknown accounts or full storage. The full code list is in [Types and selectors](./types-and-selectors.md#error-codes). In Python a failed call raises an exception, in Rust it returns a `LedgerError`, and in C and C++ it returns a negative code with details available from `cma_ledger_get_last_error_message()`.
