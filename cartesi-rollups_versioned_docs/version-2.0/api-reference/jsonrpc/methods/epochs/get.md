---
id: epochs-get
title: Get Epoch
---

# Get Epoch

The `cartesi_getEpoch` method retrieves detailed information about a specific epoch by its application and index.

## Method

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getEpoch",
  "params": {
    "application": "calculator",
    "index": 1
  },
  "id": 1
}
```

## Parameters

| Name        | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| application | string | Yes      | The name or address of the application           |
| index       | number | Yes      | The epoch index                                  |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "index": 1,
    "status": "ACCEPTED",
    "inputs_count": 10,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "inputs": [
      {
        "index": 0,
        "status": "ACCEPTED",
        "msg_sender": "0x1234...5678",
        "timestamp": "2024-01-01T00:00:00Z",
        "payload": "0x1234..."
      }
    ]
  },
  "id": 1
}
```

### Response Fields

| Name         | Type   | Description                                      |
|--------------|--------|--------------------------------------------------|
| index        | number | The epoch index                                  |
| status       | string | Current status of the epoch (ACCEPTED/REJECTED)  |
| inputs_count | number | Number of inputs in this epoch                   |
| created_at   | string | Timestamp when the epoch was created             |
| updated_at   | string | Timestamp when the epoch was last updated        |
| inputs       | array  | List of inputs in this epoch                     |

#### Input Fields

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| index       | number | The input index within the epoch                 |
| status      | string | Current status of the input (ACCEPTED/REJECTED)  |
| msg_sender  | string | Address of the message sender                    |
| timestamp   | string | Timestamp when the input was created             |
| payload     | string | The input payload in hexadecimal format          |

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
  "method": "cartesi_getEpoch",
  "params": {
    "application": "calculator",
    "index": 1
  },
  "id": 1
}
```

### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "index": 1,
    "status": "ACCEPTED",
    "inputs_count": 10,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "inputs": [
      {
        "index": 0,
        "status": "ACCEPTED",
        "msg_sender": "0x1234...5678",
        "timestamp": "2024-01-01T00:00:00Z",
        "payload": "0x1234..."
      },
      {
        "index": 1,
        "status": "ACCEPTED",
        "msg_sender": "0x8765...4321",
        "timestamp": "2024-01-01T00:01:00Z",
        "payload": "0x5678..."
      }
    ]
  },
  "id": 1
}
``` 