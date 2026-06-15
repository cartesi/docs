---
id: ledger-reference
title: Ledger reference
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page lists every ledger operation with its signature per language. For a guided walk through, see [Managing balances](./managing-balances.md).

## Lifecycle

Create, persist, reset and release a ledger.

<Tabs groupId="language">
<TabItem value="python" label="Python" default>

| Method | Description |
| :--- | :--- |
| `Ledger()` | Creates an in memory ledger |
| `Ledger(memory_filename, offset, mem_length, n_accounts, n_assets, n_balances, initialize_memory)` | Creates or opens a file backed ledger. Pass `initialize_memory=True` only the first time, to create and size the file |
| `reset()` | Clears all accounts, assets and balances |

</TabItem>
<TabItem value="rust" label="Rust">

| Method | Returns | Description |
| :--- | :--- | :--- |
| `Ledger::new()` | `Result<Ledger, LedgerError>` | Creates an in memory ledger |
| `Ledger::init_from_file(config)` | `Result<Ledger, LedgerError>` | Opens or creates a file backed ledger from a `LedgerFileConfig` |
| `Ledger::init_from_buffer(config)` | `Result<Ledger, LedgerError>` | Creates a ledger backed by a caller provided buffer from a `LedgerBufferConfig` |
| `reset()` | `Result<(), LedgerError>` | Clears all records |
| `get_last_error_message()` | `Result<String, LedgerError>` | Returns the text of the last error |

</TabItem>
<TabItem value="cpp" label="C++">

| Function | Description |
| :--- | :--- |
| `cma_ledger_init(ledger)` | Creates an in memory ledger |
| `cma_ledger_init_file(ledger, memory_file_name, mode, offset, mem_length, n_accounts, n_assets, n_balances)` | Opens (`CMA_LEDGER_OPEN_ONLY`) or creates (`CMA_LEDGER_CREATE_ONLY`) a file backed ledger |
| `cma_ledger_init_buffer(ledger, buffer, mem_length, n_accounts, n_assets, n_balances)` | Creates a ledger backed by a caller provided buffer |
| `cma_ledger_reset(ledger)` | Clears all records |
| `cma_ledger_fini(ledger)` | Releases the ledger |
| `cma_ledger_get_last_error_message()` | Returns the text of the last error |

</TabItem>
</Tabs>

## Retrieving accounts and assets

These calls find an entry and return its internal ID. With the find or create operation they also create missing entries, which is the common case when handling deposits.

<Tabs groupId="language">
<TabItem value="python" label="Python" default>

| Method | Description |
| :--- | :--- |
| `retrieve_account(account_id=None, account=None)` | Finds or creates an account. `account` is a hex string: a 20 byte wallet address or a 32 byte account ID. Returns a dict with `account_id` and `account` |
| `retrieve_asset(asset_id=None, token=None, token_id=None, token_id_with_amount=None, base_token=None, force_find=None)` | Finds or creates an asset. Use `base_token=True` for Ether, `token` for ERC20, `token` plus `token_id` for ERC721, and add `token_id_with_amount=True` for ERC1155. `force_find=True` fails instead of creating. Returns a dict with `asset_id`, `token`, `token_id` and `total_supply` |

</TabItem>
<TabItem value="rust" label="Rust">

| Method | Returns | Description |
| :--- | :--- | :--- |
| `retrieve_account_via_address(address)` | `Result<LedgerAccountId, LedgerError>` | Finds or creates an account from a wallet address |
| `retrieve_account(account_id, account_type, operation, addr_or_id)` | `Result<LedgerAccountId, LedgerError>` | Generic account retrieval with explicit `AccountType` and `RetrieveOperation` |
| `retrieve_ether_assets()` | `Result<LedgerAssetId, LedgerError>` | Finds or creates the Ether asset |
| `retrieve_erc20_asset_via_address(token_address)` | `Result<LedgerAssetId, LedgerError>` | Finds or creates an ERC20 asset from its contract address |
| `retrieve_erc721_assets_via_address(token_address, token_id)` | `Result<LedgerAssetId, LedgerError>` | Finds or creates an ERC721 asset from its contract address and token ID |
| `retrieve_asset(asset_id, token_address, token_id, asset_type, operation)` | `Result<LedgerAssetId, LedgerError>` | Generic asset retrieval with explicit `AssetType` and `RetrieveOperation` |

</TabItem>
<TabItem value="cpp" label="C++">

| Function | Description |
| :--- | :--- |
| `cma_ledger_retrieve_account(ledger, account_id, account, addr_accid, n_balances, account_type, operation)` | Finds or creates an account. When `account_id` is set the call fills the account details, otherwise it fills the ID |
| `cma_ledger_retrieve_asset(ledger, asset_id, token_address, token_id, out_total_supply, asset_type, operation)` | Finds or creates an asset. Also returns the asset's total supply through `out_total_supply` |

</TabItem>
</Tabs>

## State changes

Each operation either completes fully or fails with an error, for example when funds are insufficient.

<Tabs groupId="language">
<TabItem value="python" label="Python" default>

| Method | Description |
| :--- | :--- |
| `deposit(asset_id, account_id, amount)` | Adds `amount` of the asset to the account and raises the total supply |
| `withdraw(asset_id, account_id, amount)` | Removes `amount` from the account and lowers the total supply |
| `transfer(asset_id, from_account_id, to_account_id, amount)` | Moves `amount` between two accounts |

</TabItem>
<TabItem value="rust" label="Rust">

| Method | Returns | Description |
| :--- | :--- | :--- |
| `deposit(asset_id, to_account_id, amount)` | `Result<(), LedgerError>` | Adds `amount` (a `U256`) to the account |
| `withdraw(asset_id, from_account_id, amount)` | `Result<(), LedgerError>` | Removes `amount` from the account |
| `transfer(asset_id, from_account_id, to_account_id, amount)` | `Result<(), LedgerError>` | Moves `amount` between two accounts |

</TabItem>
<TabItem value="cpp" label="C++">

| Function | Description |
| :--- | :--- |
| `cma_ledger_deposit(ledger, asset_id, to_account_id, amount)` | Adds the amount to the account |
| `cma_ledger_withdraw(ledger, asset_id, from_account_id, amount)` | Removes the amount from the account |
| `cma_ledger_transfer(ledger, asset_id, from_account_id, to_account_id, amount)` | Moves the amount between two accounts |

</TabItem>
</Tabs>

## Queries

Read only calls. They never change the ledger, so they are safe to use in inspect handlers.

<Tabs groupId="language">
<TabItem value="python" label="Python" default>

| Method | Description |
| :--- | :--- |
| `balance(asset_id, account_id)` | Returns the account's balance of the asset as an int |
| `supply(asset_id)` | Returns the total supply of the asset as an int |

</TabItem>
<TabItem value="rust" label="Rust">

| Method | Returns | Description |
| :--- | :--- | :--- |
| `get_balance(asset_id, account_id)` | `Result<U256, LedgerError>` | Returns the account's balance of the asset |
| `get_total_supply(asset_id)` | `Result<U256, LedgerError>` | Returns the total supply of the asset |

</TabItem>
<TabItem value="cpp" label="C++">

| Function | Description |
| :--- | :--- |
| `cma_ledger_get_balance(ledger, asset_id, account_id, out_balance, account_balance_info)` | Fills `out_balance` with the account's balance of the asset |
| `cma_ledger_retrieve_asset(...)` | Returns the asset's total supply through its `out_total_supply` parameter |

</TabItem>
</Tabs>

## Errors

Every operation reports failures with a typed error: an exception in Python, a `LedgerError` in Rust, and a negative code in C and C++. The full list, including insufficient funds, missing accounts and storage limits, is in [Types and selectors](./types-and-selectors.md#error-codes).
