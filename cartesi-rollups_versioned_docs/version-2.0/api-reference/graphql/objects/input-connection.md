---
id: input-connection
title: InputConnection
hide_table_of_contents: false
---

Represents a paginated list of inputs.

```graphql
type InputConnection {
  "Total number of entries that match the query"
  totalCount: Int!
  "List of edges in the connection"
  edges: [InputEdge!]!
  "Information about the current page"
  pageInfo: PageInfo!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `totalCount` | [`Int!`](../../scalars/int) | Total number of entries that match the query. |
| `edges` | [`[InputEdge!]!`](../../objects/input-edge) | List of edges in the connection. |
| `pageInfo` | [`PageInfo!`](../../objects/page-info) | Information about the current page. |

## Example Query

```graphql
query {
  inputs(first: 10) {
    totalCount
    edges {
      node {
        id
        index
        status
        msgSender
        payload
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
