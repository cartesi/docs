---
id: reports-list
title: List Reports
---

# List Reports

The `cartesi_listReports` method returns a paginated list of reports for a specific application, with optional filtering by input index.

## Method

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listReports",
  "params": {
    "application": "calculator",
    "input_index": 1,
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
| input_index | number | No       | Filter reports by input index                    |
| limit       | number | No       | Maximum number of reports to return (default: 50) |
| offset      | number | No       | Starting point for the list (default: 0)         |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "index": 1,
        "input_index": 1,
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
| index       | number | The report index                                 |
| input_index | number | The input index this report belongs to           |
| payload     | string | The report payload in hexadecimal format         |

#### Pagination

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| total_count | number | Total number of reports available                |
| limit       | number | Number of reports returned in this response      |
| offset      | number | Starting point of the returned reports           |

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
  "method": "cartesi_listReports",
  "params": {
    "application": "calculator",
    "input_index": 1,
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
        "input_index": 1,
        "payload": "0x1234..."
      },
      {
        "index": 2,
        "input_index": 1,
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