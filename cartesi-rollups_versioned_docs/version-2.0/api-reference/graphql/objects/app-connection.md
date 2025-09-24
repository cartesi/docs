---
id: app-connection
title: AppConnection
hide_table_of_contents: false
---

Represents a paginated list of applications.

```graphql
type AppConnection {
  "Total number of entries that match the query"
  totalCount: Int!
  "List of edges in the connection"
  edges: [AppEdge!]!
  "Information about the current page"
  pageInfo: PageInfo!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `totalCount` | [`Int!`](../../scalars/int) | Total number of entries that match the query. |
| `edges` | [`[AppEdge!]!`](../../objects/app-edge) | List of edges in the connection. |
| `pageInfo` | [`PageInfo!`](../../objects/page-info) | Information about the current page. |

## Example Query

```graphql
query {
  applications(first: 10) {
    totalCount
    edges {
      node {
        address
        name
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