---
id: input-edge
title: InputEdge
hide_table_of_contents: false
---


Pagination entry.

```graphql
type InputEdge {
  node: Input!
  cursor: String!
}
```


## Fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| `node` | [`Input!`](../../objects/input) | The Input object. |
| `cursor` | [`String!`](../../scalars/string) | A string that serves as a pagination cursor for this particular edge. |




