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

The `cartesi_getWithdrawal` method retrieves a single emergency withdrawal by its application and account index.

## Parameters

| Name          | Type   | Required | Description                                      |
|---------------|--------|----------|--------------------------------------------------|
| application   | string | Yes      | The application's name or hex encoded address    |
| account_index | string | Yes      | The account index in the accounts drive (hex encoded) |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": {
      "account_index": "0x0",
      "account": "0xe803000000000000bd8eba8bf9e56ad92f4c4fc89d6cb8890253574900000000",
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

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32602  | Invalid params         | Invalid parameter values                         |
| -32000  | Application not found  | The specified application does not exist         |
| -32003  | Withdrawal not found   | The specified withdrawal does not exist          |
| -32603  | Internal error         | An internal error occurred                       |
