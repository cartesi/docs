---
id: input-edge
title: InputEdge
hide_table_of_contents: false
---

Represents a single input in a paginated list.

```graphql
type InputEdge {
  "The input at this edge"
  node: Input!
  "A cursor for use in pagination"
  cursor: String!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `node` | [`Input!`](../../objects/input) | The input at this edge. |
| `cursor` | [`String!`](../../scalars/string) | A cursor for use in pagination. |

## Example Query

```graphql
query {
  inputs(first: 10) {
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
  }
}
```
