---
id: voucher-connection
title: VoucherConnection
hide_table_of_contents: false
---

Represents a paginated list of vouchers.

```graphql
type VoucherConnection {
  "Total number of entries that match the query"
  totalCount: Int!
  "List of edges in the connection"
  edges: [VoucherEdge!]!
  "Information about the current page"
  pageInfo: PageInfo!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `totalCount` | [`Int!`](../../scalars/int) | Total number of entries that match the query. |
| `edges` | [`[VoucherEdge!]!`](../../objects/voucher-edge) | List of edges in the connection. |
| `pageInfo` | [`PageInfo!`](../../objects/page-info) | Information about the current page. |

## Example Query

```graphql
query {
  vouchers(first: 10) {
    totalCount
    edges {
      node {
        index
        destination
        payload
        value
        executed
        transactionHash
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```
