---
id: notice-edge
title: NoticeEdge
hide_table_of_contents: false
---


Pagination entry

```graphql
type NoticeEdge {
  node: Notice!
  cursor: String!
}
```

## Fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| `node` | [`Notice!`](../../objects/notice) | The Notice object. |
| `cursor` | [`String!`](../../scalars/string) | A string that serves as a pagination cursor for this particular edge. |





