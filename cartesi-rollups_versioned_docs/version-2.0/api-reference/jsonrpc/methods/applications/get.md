---
id: applications-get
title: Get Application
---

# Get Application

The `cartesi_getApplication` method retrieves detailed information about a specific application by its name or address.

## Method

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getApplication",
  "params": {
    "nameOrAddress": "calculator"
  },
  "id": 1
}
```

## Parameters

| Name          | Type   | Required | Description                                      |
|---------------|--------|----------|--------------------------------------------------|
| nameOrAddress | string | Yes      | The name or Ethereum address of the application  |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "name": "calculator",
    "address": "0x1234...5678",
    "state": "ACTIVE",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "execution_parameters": {
      "max_input_size": 1024,
      "max_input_count": 1000,
      "snapshot_policy": "ALWAYS"
    }
  },
  "id": 1
}
```

### Response Fields

| Name                 | Type   | Description                                      |
|----------------------|--------|--------------------------------------------------|
| name                 | string | The name of the application                      |
| address              | string | The Ethereum address of the application contract |
| state                | string | Current state of the application (ACTIVE/INACTIVE) |
| created_at           | string | Timestamp when the application was created       |
| updated_at           | string | Timestamp when the application was last updated  |
| execution_parameters | object | Application execution parameters                 |

#### Execution Parameters

| Name            | Type   | Description                                      |
|-----------------|--------|--------------------------------------------------|
| max_input_size  | number | Maximum size of input payload in bytes           |
| max_input_count | number | Maximum number of inputs per epoch               |
| snapshot_policy | string | Policy for creating snapshots (ALWAYS/NEVER)     |

## Error Codes

| Code    | Message                | Description                                      |
|---------|------------------------|--------------------------------------------------|
| -32602  | Invalid params         | Invalid parameter values                         |
| -32000  | Application not found  | The specified application does not exist         |
| -32603  | Internal error         | An internal error occurred                       |

## Example

### Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getApplication",
  "params": {
    "nameOrAddress": "calculator"
  },
  "id": 1
}
```

### Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "name": "calculator",
    "address": "0x1234...5678",
    "state": "ACTIVE",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "execution_parameters": {
      "max_input_size": 1024,
      "max_input_count": 1000,
      "snapshot_policy": "ALWAYS"
    }
  },
  "id": 1
}
``` 