---
id: reports-list
title: List Reports
---

# List Reports

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_listReports",
  "params": {
    "application": "<name-or-address>",
    "limit": 10,
    "offset": 0
  },
  "id": 1
}
```

The `cartesi_listReports` method returns a paginated list of reports for a specific application. It returns only reports produced while processing inputs (advance requests); reports produced by inspect requests are returned in the inspect response and are not stored by the node.

## Parameters

| Name        | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| application | string | Yes      | The application's name or hex encoded address    |
| epoch_index | string | No       | Optional filter by epoch index (hex encoded)     |
| input_index | string | No       | Optional filter by input index (hex encoded)     |
| from        | string | No       | Inclusive lower bound on the report index (hex encoded) |
| to          | string | No       | Inclusive upper bound on the report index (hex encoded) |
| limit       | number | No       | Maximum number of reports to return (default: 50; 0 selects the default; values above 10000 are capped at 10000) |
| offset      | number | No       | Starting point for the list (default: 0, minimum: 0)         |
| descending  | boolean | No      | If `true`, sort by report index in descending order (default: `false`) |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "epoch_index": "0x1",
        "input_index": "0x1",
        "index": "0x1",
        "raw_data": "0x48656c6c6f",
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
| epoch_index | string | The epoch index this report belongs to (hex encoded) |
| input_index | string | The input index this report belongs to (hex encoded) |
| index       | string | The report index (hex encoded)                   |
| raw_data    | string | The report payload in hexadecimal format         |
| created_at  | string | Timestamp when the report was created            |
| updated_at  | string | Timestamp when the report was last updated       |

#### Pagination

| Name        | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| total_count | number | Total number of reports that match the filters |
| limit       | number | The page size applied to this request (after the default and the 10000 cap) |
| offset      | number | Starting point of the returned reports           |

## Error Codes

| Code    | Message                      | Description                                      |
|---------|------------------------------|--------------------------------------------------|
| -32602  | Invalid parameters           | Invalid parameter values (including `from` greater than `to`) |
| -31002  | Application not found        | The node does not know the application. Retrying does not help |
| -32603  | Internal server error        | A node-side error occurred                       |
| -32070  | Request timed out            | The request could not be processed in time       |
| -31003  | Response size limit exceeded | The response exceeds the response size budget. Request fewer items |
