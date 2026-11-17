---
id: withdrawals-get
title: Get Withdrawal
---

# Get Withdrawal

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getWithdrawal",
  "params": {
    "application": "<name-or-address>",
    "account_index": "<hex-encoded-index>"
  },
  "id": 1
}
```

The `cartesi_getWithdrawal` method retrieves a single emergency withdrawal by its application and account index. A withdrawal is available once the account's [`withdraw()`](../../../contracts/application.md#withdraw) call has succeeded on-chain and the node has indexed its `Withdrawal` event.

## Parameters

| Name          | Type   | Required | Description                                      |
|---------------|--------|----------|--------------------------------------------------|
| application   | string | Yes      | The application's name or hex encoded address    |
| account_index | string | Yes      | The account index in the accounts drive, as a `0x`-prefixed hex string (for example `"0x0"`) |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": {
      "account_index": "0x0",
      "account": "0xe80300000000000000000000bd8eba8bf9e56ad92f4c4fc89d6cb88902535749",
      "output": "0x10321e8b...",
      "block_number": "0xaac079",
      "transaction_hash": "0xfe6c84b741624b237b6d09a9f71a174e81a59e5eedb7893a77f238b45e833656",
      "log_index": "0x2b7",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  },
  "id": 1
}
```

### Response Fields

See the [`Withdrawal`](../../types.md#withdrawal) type.

| Name             | Type   | Description                                      |
|------------------|--------|--------------------------------------------------|
| account_index    | string | The account index in the accounts drive (hex encoded) |
| account          | string | The account as encoded in the accounts drive (hex) |
| output           | string | The withdrawal output (hex encoded)              |
| block_number     | string | The block number of the `Withdrawal` event (hex encoded) |
| transaction_hash | string | The transaction hash of the withdrawal           |
| log_index        | string | The log index within the block (hex encoded)     |
| created_at       | string | Timestamp when the withdrawal was recorded       |
| updated_at       | string | Timestamp when the withdrawal was last updated   |

With the [`UsdWithdrawalOutputBuilder`](../../../contracts/withdrawal/usd-withdrawal-output-builder.md#account-encoding), `account` is 32 bytes: a 12-byte little-endian balance followed by the 20-byte owner address. The example above is a balance of `1000` (`0x3e8`) owned by `0xbd8eba8bf9e56ad92f4c4fc89d6cb88902535749`. The `output` of that builder is a DELEGATECALL voucher (selector `0x10321e8b`).

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32602  | Invalid parameters     | A parameter is missing or malformed, for example an `account_index` that is not a `0x`-prefixed hex string |
| -31002  | Application not found  | The node does not know the application name or address |
| -31001  | Withdrawal not found   | The application is known, but no withdrawal was recorded for this account index |
| -32603  | Internal server error  | A node-side failure occurred                     |

See [Error Handling](../../overview.md#error-handling) for the codes that any method can return, such as a timeout.
