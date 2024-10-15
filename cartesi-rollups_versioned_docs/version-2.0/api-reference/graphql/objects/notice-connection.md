---
id: notice-connection
title: NoticeConnection
hide_table_of_contents: false
---


Represents a paginated connection of Notices.

```graphql
type NoticeConnection {
  edges: [NoticeEdge!]!
  pageInfo: PageInfo!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ------|
| `edges`| [`NoticeEdge`](../../objects/notice-edge) | A list of `Notice` objects. Each edge contains a `Notice` object and a cursor for pagination. |
| `pageInfo`| [`PageInfo`](../../objects/page-info) | Metadata about the pagination. |





