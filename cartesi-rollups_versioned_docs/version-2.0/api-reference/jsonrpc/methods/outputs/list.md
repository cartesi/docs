---
id: outputs-list
title: List Outputs
---

# List Outputs

The `cartesi_listOutputs` method returns a paginated list of outputs for a specific application.

## Method

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listOutputs",
  "params": {
    "application": "calculator",
    "limit": 50,
    "offset": 0,
    "epoch_index": "0x1",
    "input_index": "0x1",
    "output_type": "NOTICE"
  },
  "id": 1
}
```

## Parameters

| Name        | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| application | string | Yes      | The name or address of the application           |
| limit       | number | No       | Maximum number of outputs to return (default: 50, minimum: 1) |
| offset      | number | No       | Starting point for the list (default: 0, minimum: 0)         |
| epoch_index | string | No       | Filter outputs by epoch index                    |
| input_index | string | No       | Filter outputs by input index                    |
| output_type | string | No       | Filter outputs by type (NOTICE/VOUCHER)          |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "index": "0x1",
        "epoch_index": "0x1",
        "input_index": "0x1",
        "output_type": "NOTICE",
        "payload": "0x1234...5678",
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

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| index       | string | The output index                                 |
| epoch_index | string | The epoch index this output belongs to           |
| input_index | string | The input index this output belongs to           |
| output_type | string | The type of output (NOTICE/VOUCHER)              |
| payload     | string | The output payload                               |
| created_at  | string | Timestamp when the output was created            |
| updated_at  | string | Timestamp when the output was last updated       |

#### Pagination

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| total_count | number | Total number of outputs available                |
| limit       | number | Number of outputs returned in this response      |
| offset      | number | Starting point of the returned outputs           |

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32602  | Invalid params         | Invalid parameter values                         |
| -32603  | Internal error         | An internal error occurred                       |
| -32000  | Application not found  | The specified application does not exist         |

## Example

### Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listOutputs",
  "params": {
    "application": "calculator",
    "limit": 10,
    "offset": 0,
    "epoch_index": "0x1",
    "input_index": "0x1",
    "output_type": "NOTICE"
  },
  "id": 1
}
```

### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "index": "0x1",
        "epoch_index": "0x1",
        "input_index": "0x1",
        "output_type": "NOTICE",
        "payload": "0x1234...5678",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total_count": 1,
      "limit": 10,
      "offset": 0
    }
  },
  "id": 1
}
``` 