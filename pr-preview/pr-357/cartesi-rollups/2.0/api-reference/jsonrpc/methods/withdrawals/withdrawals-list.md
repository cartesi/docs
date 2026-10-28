> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: withdrawals-list
title: List Withdrawals
---

# List Withdrawals

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listWithdrawals",
  "params": {
    "application": "<name-or-address>",
    "limit": 10,
    "offset": 0
  },
  "id": 1
}
```

The `cartesi_listWithdrawals` method returns a paginated list of emergency withdrawals observed on-chain for a specific application. Each entry corresponds to a `Withdrawal` event emitted by the application's [`withdraw()`](../../../contracts/application.md#withdraw) function after foreclosure.

## Parameters

| Name          | Type   | Required | Description                                      |
|---------------|--------|----------|--------------------------------------------------|
| application   | string | Yes      | The application's name or hex encoded address    |
| account_index | string | No       | Filter by a specific account index (hex encoded) |
| limit         | number | No       | Maximum number of withdrawals to return (default: 50, minimum: 1) |
| offset        | number | No       | Starting point for the list (default: 0, minimum: 0)         |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "account_index": "0x0",
        "account": "0xe803000000000000bd8eba8bf9e56ad92f4c4fc89d6cb8890253574900000000",
        "output": "0x10321e8b...",
        "block_number": "0xaac079",
        "transaction_hash": "0xfe6c84b741624b237b6d09a9f71a174e81a59e5eedb7893a77f238b45e833656",
        "log_index": "0x2b7",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total_count": 1,
      "limit": 50,
      "offset": 0
    }
  },
  "id": 1
}
```

### Response Fields

#### Data

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

#### Pagination

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| total_count | number | Total number of withdrawals available            |
| limit       | number | Number of withdrawals returned in this response  |
| offset      | number | Starting point of the returned withdrawals       |

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32602  | Invalid params         | Invalid parameter values                         |
| -32000  | Application not found  | The specified application does not exist         |
| -32603  | Internal error         | An internal error occurred                       |
