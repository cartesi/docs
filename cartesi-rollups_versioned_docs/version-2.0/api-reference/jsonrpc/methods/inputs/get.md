---
id: inputs-get
title: Get Input
---

# Get Input

The `cartesi_getInput` method retrieves detailed information about a specific input by its application and index.

## Method

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getInput",
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
| index       | number | Yes      | The input index                                  |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "index": 1,
    "epoch_index": 1,
    "status": "ACCEPTED",
    "msg_sender": "0x1234...5678",
    "timestamp": "2024-01-01T00:00:00Z",
    "payload": "0x1234...",
    "notices": [
      {
        "index": 0,
        "payload": "0x5678..."
      }
    ],
    "vouchers": [
      {
        "index": 0,
        "destination": "0x8765...4321",
        "payload": "0x9abc..."
      }
    ],
    "reports": [
      {
        "index": 0,
        "payload": "0xdef0..."
      }
    ]
  },
  "id": 1
}
```

### Response Fields

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| index       | number | The input index                                  |
| epoch_index | number | The epoch index this input belongs to            |
| status      | string | Current status of the input (ACCEPTED/REJECTED)  |
| msg_sender  | string | Address of the message sender                    |
| timestamp   | string | Timestamp when the input was created             |
| payload     | string | The input payload in hexadecimal format          |
| notices     | array  | List of notices produced by this input           |
| vouchers    | array  | List of vouchers produced by this input          |
| reports     | array  | List of reports produced by this input           |

#### Notice Fields

| Name    | Type   | Description                                      |
|---------|--------|--------------------------------------------------|
| index   | number | The notice index                                 |
| payload | string | The notice payload in hexadecimal format         |

#### Voucher Fields

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| index       | number | The voucher index                                |
| destination | string | The destination address for the voucher          |
| payload     | string | The voucher payload in hexadecimal format        |

#### Report Fields

| Name    | Type   | Description                                      |
|---------|--------|--------------------------------------------------|
| index   | number | The report index                                 |
| payload | string | The report payload in hexadecimal format         |

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32602  | Invalid params         | Invalid parameter values                         |
| -32000  | Application not found  | The specified application does not exist         |
| -32002  | Input not found        | The specified input does not exist               |
| -32603  | Internal error         | An internal error occurred                       |

## Example

### Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getInput",
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
    "epoch_index": 1,
    "status": "ACCEPTED",
    "msg_sender": "0x1234...5678",
    "timestamp": "2024-01-01T00:00:00Z",
    "payload": "0x1234...",
    "notices": [
      {
        "index": 0,
        "payload": "0x5678..."
      }
    ],
    "vouchers": [
      {
        "index": 0,
        "destination": "0x8765...4321",
        "payload": "0x9abc..."
      }
    ],
    "reports": [
      {
        "index": 0,
        "payload": "0xdef0..."
      }
    ]
  },
  "id": 1
}
``` 