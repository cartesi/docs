---
id: notice-connection
title: NoticeConnection
hide_table_of_contents: false
---

Represents a paginated list of notices.

```graphql
type NoticeConnection {
  "Total number of entries that match the query"
  totalCount: Int!
  "List of edges in the connection"
  edges: [NoticeEdge!]!
  "Information about the current page"
  pageInfo: PageInfo!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `totalCount` | [`Int!`](../../scalars/int) | Total number of entries that match the query. |
| `edges` | [`[NoticeEdge!]!`](../../objects/notice-edge) | List of edges in the connection. |
| `pageInfo` | [`PageInfo!`](../../objects/page-info) | Information about the current page. |

## Example Query

```graphql
query {
  notices(first: 10) {
    totalCount
    edges {
      node {
        index
        payload
        proof {
          outputIndex
          outputHashesSiblings
        }
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
