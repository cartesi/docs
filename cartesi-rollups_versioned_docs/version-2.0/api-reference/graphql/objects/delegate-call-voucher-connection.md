---
id: delegate-call-voucher-connection
title: DelegateCallVoucherConnection
hide_table_of_contents: false
---

Represents a paginated list of DELEGATECALL vouchers.

```graphql
type DelegateCallVoucherConnection {
  "Total number of entries that match the query"
  totalCount: Int!
  "List of edges in the connection"
  edges: [DelegateCallVoucherEdge!]!
  "Information about the current page"
  pageInfo: PageInfo!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `totalCount` | [`Int!`](../../scalars/int) | Total number of entries that match the query. |
| `edges` | [`[DelegateCallVoucherEdge!]!`](../../objects/delegate-call-voucher-edge) | List of edges in the connection. |
| `pageInfo` | [`PageInfo!`](../../objects/page-info) | Information about the current page. |

## Example Query

```graphql
query {
  delegateCallVouchers(first: 10) {
    totalCount
    edges {
      node {
        index
        destination
        payload
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