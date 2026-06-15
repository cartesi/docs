---
id: types-and-selectors
title: Types and selectors
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page is the lookup table for the CMA library: input types, decoded fields, function selectors, voucher fields, portal addresses and error codes. The values below come from the library sources: [machine-asset-tools](https://github.com/Mugen-Builders/machine-asset-tools) for C and C++ and Python, and [libcma_binding_rust](https://github.com/Mugen-Builders/libcma_binding_rust) for Rust.

## Input types

The parser identifies every input with one of these types.

<Tabs groupId="language">
<TabItem value="cpp" label="C++ and Python" default>

```cpp
typedef enum {
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
    CMA_PARSER_INPUT_TYPE_BALANCE_ACCOUNT,
    CMA_PARSER_INPUT_TYPE_BALANCE_ACCOUNT_TOKEN_ADDRESS,
    CMA_PARSER_INPUT_TYPE_BALANCE_ACCOUNT_TOKEN_ADDRESS_ID,
    CMA_PARSER_INPUT_TYPE_SUPPLY,
    CMA_PARSER_INPUT_TYPE_SUPPLY_TOKEN_ADDRESS,
    CMA_PARSER_INPUT_TYPE_SUPPLY_TOKEN_ADDRESS_ID,
} cma_parser_input_type_t;
```

The Python binding uses these same values internally and translates them to the `type` strings returned by `decode_advance` and `decode_inspect`, such as `ERC20_WITHDRAWAL` and `BALANCE`.

</TabItem>
<TabItem value="rust" label="Rust">

```rust
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

</TabItem>
</Tabs>

## Parser results

The fields the parser returns for each operation. Names match the Rust struct fields and the Python dictionary keys.

### Deposits

| Operation              | Fields                                                                          |
| :--------------------- | :------------------------------------------------------------------------------ |
| Ether deposit          | `sender`, `amount`, `exec_layer_data`                                           |
| ERC20 deposit          | `sender`, `token`, `amount`, `exec_layer_data`                                  |
| ERC721 deposit         | `sender`, `token`, `token_id`, `exec_layer_data`                                |
| ERC1155 single deposit | `sender`, `token`, `token_id`, `amount`, `exec_layer_data`                      |
| ERC1155 batch deposit  | `sender`, `token`, `token_ids`, `amounts`, `base_layer_data`, `exec_layer_data` |

### Withdrawals

The account that withdraws is the `msg_sender` of the input.

| Operation                 | Fields                                             |
| :------------------------ | :------------------------------------------------- |
| Ether withdrawal          | `amount`, `exec_layer_data`                        |
| ERC20 withdrawal          | `token`, `amount`, `exec_layer_data`               |
| ERC721 withdrawal         | `token`, `token_id`, `exec_layer_data`             |
| ERC1155 single withdrawal | `token`, `token_id`, `amount`, `exec_layer_data`   |
| ERC1155 batch withdrawal  | `token`, `token_ids`, `amounts`, `exec_layer_data` |

### Transfers

Transfers move assets between accounts inside the application. The `receiver` is a 32 byte account identifier.

| Operation               | Fields                                                         |
| :---------------------- | :------------------------------------------------------------- |
| Ether transfer          | `receiver`, `amount`, `exec_layer_data`                        |
| ERC20 transfer          | `receiver`, `token`, `amount`, `exec_layer_data`               |
| ERC721 transfer         | `receiver`, `token`, `token_id`, `exec_layer_data`             |
| ERC1155 single transfer | `receiver`, `token`, `token_id`, `amount`, `exec_layer_data`   |
| ERC1155 batch transfer  | `receiver`, `token`, `token_ids`, `amounts`, `exec_layer_data` |

### Inspect queries

| Query   | Fields                                          |
| :------ | :---------------------------------------------- |
| Balance | `account`, plus optional `token` and `token_id` |
| Supply  | optional `token` and `token_id`                 |

## Application call selectors

To request a withdrawal or transfer, the user sends an ABI encoded call as the input payload. The first four bytes select the operation. These are the selectors the C core and the Python binding decode:

| Function                                                          | Selector     | Arguments                                            |
| :---------------------------------------------------------------- | :----------- | :--------------------------------------------------- |
| `WithdrawEther(uint256,bytes)`                                    | `0x8cf70f0b` | amount, exec layer data                              |
| `WithdrawErc20(address,uint256,bytes)`                            | `0x4f94d342` | token, amount, exec layer data                       |
| `WithdrawErc721(address,uint256,bytes)`                           | `0x33acf293` | token, token ID, exec layer data                     |
| `WithdrawErc1155Single(address,uint256,uint256,bytes)`            | `0x8bb0a811` | token, token ID, amount, exec layer data             |
| `WithdrawErc1155Batch(address,uint256[],uint256[],bytes)`         | `0x50c80019` | token, token IDs, amounts, exec layer data           |
| `TransferEther(bytes32,uint256,bytes)`                            | `0xff67c903` | receiver, amount, exec layer data                    |
| `TransferErc20(address,bytes32,uint256,bytes)`                    | `0x03d61dcd` | token, receiver, amount, exec layer data             |
| `TransferErc721(address,bytes32,uint256,bytes)`                   | `0xaf615a5a` | token, receiver, token ID, exec layer data           |
| `TransferErc1155Single(address,bytes32,uint256,uint256,bytes)`    | `0xe1c913ed` | token, receiver, token ID, amount, exec layer data   |
| `TransferErc1155Batch(address,bytes32,uint256[],uint256[],bytes)` | `0x638ac6f9` | token, receiver, token IDs, amounts, exec layer data |

## Inspect methods

Inspect payloads are JSON documents with a `method` and a `params` array.

<Tabs groupId="language">
<TabItem value="cpp" label="C++ and Python" default>

Methods: `ledger_getBalance` and `ledger_getTotalSupply`.

```json
{
  "method": "ledger_getBalance",
  "params": ["0x0000000000000000000000000000000000000001"]
}
```

For balance queries, `params` holds the account, then an optional token address and an optional token ID. For supply queries, `params` holds an optional token address and an optional token ID.

</TabItem>
<TabItem value="rust" label="Rust">

Methods: `ledgerGetBalance` and `ledgerGetTotalSupply`. The payload is the hex encoding of the JSON document, and `params` holds the account, the token address and an optional array of token IDs.

</TabItem>
</Tabs>

## Voucher fields

Each voucher type takes these fields. In C and C++ the receiver lives in the outer `cma_parser_voucher_data_t` struct, and in Rust it is a field of each struct.

| Voucher type   | Fields                                                       | Voucher destination  |
| :------------- | :----------------------------------------------------------- | :------------------- |
| Ether          | `receiver`, `amount`                                         | The receiver address |
| ERC20          | `token`, `receiver`, `amount`                                | The token contract   |
| ERC721         | `token`, `token_id`, `receiver`, and the application address | The token contract   |
| ERC1155 single | `token`, `token_id`, `receiver`, `amount`                    | The token contract   |
| ERC1155 batch  | `token`, `receiver`, `token_ids`, `amounts`                  | The token contract   |

## Ledger types

| Concept            | C and C++                                                                                                     | Rust                                                |
| :----------------- | :------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------- |
| Retrieve operation | `CMA_LEDGER_OP_FIND`, `CMA_LEDGER_OP_CREATE`, `CMA_LEDGER_OP_FIND_OR_CREATE`, `CMA_LEDGER_OP_FIND_AND_REMOVE` | `RetrieveOperation::Find`, `Create`, `FindOrCreate` |
| Asset type         | `CMA_LEDGER_ASSET_TYPE_ID`, `BASE`, `TOKEN_ADDRESS`, `TOKEN_ADDRESS_ID`, `TOKEN_ADDRESS_ID_AMOUNT`            | `AssetType::Id`, `TokenAddress`, `TokenAddressId`   |
| Account type       | `CMA_LEDGER_ACCOUNT_TYPE_ID`, `WALLET_ADDRESS`, `ACCOUNT_ID`                                                  | `AccountType::Id`, `WalletAddress`, `AccountId`     |
| Asset ID           | `cma_ledger_asset_id_t`                                                                                       | `LedgerAssetId(u64)`                                |
| Account ID         | `cma_ledger_account_id_t`                                                                                     | `LedgerAccountId(u64)`                              |

The Python `Ledger` methods select these types for you from the arguments you pass, as described in the [Ledger reference](./ledger-reference.md).

## Error codes

### Parser errors

| C and C++                             | Code    | Rust                                |
| :------------------------------------ | :------ | :---------------------------------- |
| `CMA_PARSER_SUCCESS`                  | `0`     | `Ok(...)`                           |
| `CMA_PARSER_ERROR_UNKNOWN`            | `-2001` | `CmaParserError::Unknown`           |
| `CMA_PARSER_ERROR_EXCEPTION`          | `-2002` |                                     |
| `CMA_PARSER_ERROR_INCOMPATIBLE_INPUT` | `-2003` | `CmaParserError::IncompatibleInput` |
| `CMA_PARSER_ERROR_MALFORMED_INPUT`    | `-2004` | `CmaParserError::MalformedInput`    |
| `CMA_PARSER_ERROR_INVALID_AMOUNT`     | `-2005` |                                     |

The Rust binding also returns `CmaParserError::Message(String)` with a description for input validation failures. Python raises an exception that carries the code and the message from `cma_parser_get_last_error_message()`.

### Ledger errors

| C and C++                               | Code    | Rust                             |
| :-------------------------------------- | :------ | :------------------------------- |
| `CMA_LEDGER_SUCCESS`                    | `0`     | `Ok(...)`                        |
| `CMA_LEDGER_ERROR_UNKNOWN`              | `-1001` | `LedgerError::Unknown`           |
| `CMA_LEDGER_ERROR_EXCEPTION`            | `-1002` | `LedgerError::Exception`         |
| `CMA_LEDGER_ERROR_INSUFFICIENT_FUNDS`   | `-1003` | `LedgerError::InsufficientFunds` |
| `CMA_LEDGER_ERROR_ACCOUNT_NOT_FOUND`    | `-1004` | `LedgerError::AccountNotFound`   |
| `CMA_LEDGER_ERROR_ASSET_NOT_FOUND`      | `-1005` | `LedgerError::AssetNotFound`     |
| `CMA_LEDGER_ERROR_BALANCE_NOT_FOUND`    | `-1006` | `LedgerError::Other(code)`       |
| `CMA_LEDGER_ERROR_SUPPLY_OVERFLOW`      | `-1007` | `LedgerError::SupplyOverflow`    |
| `CMA_LEDGER_ERROR_BALANCE_OVERFLOW`     | `-1008` | `LedgerError::BalanceOverflow`   |
| `CMA_LEDGER_ERROR_INVALID_ACCOUNT`      | `-1009` | `LedgerError::InvalidAccount`    |
| `CMA_LEDGER_ERROR_INSERTION_ERROR`      | `-1010` | `LedgerError::InsertionError`    |
| `CMA_LEDGER_ERROR_MAX_ASSETS_REACHED`   | `-1011` | `LedgerError::Other(code)`       |
| `CMA_LEDGER_ERROR_MAX_ACCOUNTS_REACHED` | `-1012` | `LedgerError::Other(code)`       |
| `CMA_LEDGER_ERROR_MAX_BALANCES_REACHED` | `-1013` | `LedgerError::Other(code)`       |
| `CMA_LEDGER_ERROR_ASSET_SUPPLY`         | `-1014` | `LedgerError::Other(code)`       |
| `CMA_LEDGER_ERROR_ACCOUNT_BALANCE`      | `-1015` | `LedgerError::Other(code)`       |
| `CMA_LEDGER_ERROR_REMOVE`               | `-1016` | `LedgerError::Other(code)`       |
