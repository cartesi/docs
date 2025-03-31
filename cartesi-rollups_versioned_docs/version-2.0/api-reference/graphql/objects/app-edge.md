---
id: app-edge
title: AppEdge
hide_table_of_contents: false
---

Represents a single application in a paginated list.

```graphql
type AppEdge {
  "The application at this edge"
  node: Application!
  "A cursor for use in pagination"
  cursor: String!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `node` | [`Application!`](../../objects/application) | The application at this edge. |
| `cursor` | [`String!`](../../scalars/string) | A cursor for use in pagination. |

## Example Query

```graphql
query {
  applications(first: 10) {
    edges {
      node {
        id
        name
        address
      }
      cursor
    }
  }
}
``` 