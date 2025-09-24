---
id: notice-edge
title: NoticeEdge
hide_table_of_contents: false
---

Represents a single notice in a paginated list.

```graphql
type NoticeEdge {
  "The notice at this edge"
  node: Notice!
  "A cursor for use in pagination"
  cursor: String!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `node` | [`Notice!`](../../objects/notice) | The notice at this edge. |
| `cursor` | [`String!`](../../scalars/string) | A cursor for use in pagination. |

## Example Query

```graphql
query {
  notices(first: 10) {
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
  }
}
```
