---
id: inputs-list
title: List Inputs
---

# List Inputs

The `cartesi_listInputs` method returns a paginated list of inputs for a specific application, with optional filtering by epoch index and sender address.

## Method

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listInputs",
  "params": {
    "application": "calculator",
    "epoch_index": 1,
    "sender": "0x1234...5678",
    "limit": 50,
    "offset": 0
  },
  "id": 1
}
```

## Parameters

| Name        | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| application | string | Yes      | The name or address of the application           |
| epoch_index | number | No       | Filter inputs by epoch index                     |
| sender      | string | No       | Filter inputs by sender address                  |
| limit       | number | No       | Maximum number of inputs to return (default: 50) |
| offset      | number | No       | Starting point for the list (default: 0)         |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "index": 1,
        "epoch_index": 1,
        "status": "ACCEPTED",
        "msg_sender": "0x1234...5678",
        "timestamp": "2024-01-01T00:00:00Z",
        "payload": "0x1234..."
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
| index       | number | The input index                                  |
| epoch_index | number | The epoch index this input belongs to            |
| status      | string | Current status of the input (ACCEPTED/REJECTED)  |
| msg_sender  | string | Address of the message sender                    |
| timestamp   | string | Timestamp when the input was created             |
| payload     | string | The input payload in hexadecimal format          |

#### Pagination

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| total_count | number | Total number of inputs available                 |
| limit       | number | Number of inputs returned in this response       |
| offset      | number | Starting point of the returned inputs            |

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32602  | Invalid params         | Invalid parameter values                         |
| -32000  | Application not found  | The specified application does not exist         |
| -32001  | Epoch not found        | The specified epoch does not exist               |
| -32603  | Internal error         | An internal error occurred                       |

## Example

### Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listInputs",
  "params": {
    "application": "calculator",
    "epoch_index": 1,
    "limit": 10,
    "offset": 0
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
        "index": 1,
        "epoch_index": 1,
        "status": "ACCEPTED",
        "msg_sender": "0x1234...5678",
        "timestamp": "2024-01-01T00:00:00Z",
        "payload": "0x1234..."
      },
      {
        "index": 2,
        "epoch_index": 1,
        "status": "ACCEPTED",
        "msg_sender": "0x8765...4321",
        "timestamp": "2024-01-01T00:01:00Z",
        "payload": "0x5678..."
      }
    ],
    "pagination": {
      "total_count": 2,
      "limit": 10,
      "offset": 0
    }
  },
  "id": 1
}
``` 