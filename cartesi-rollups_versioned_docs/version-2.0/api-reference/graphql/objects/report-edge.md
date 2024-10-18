---
id: report-edge
title: ReportEdge
hide_table_of_contents: false
---


Pagination entry

```graphql
type ReportEdge {
  node: Report!
  cursor: String!
}
```


### Fields


| Name | Type | Description |
| ---- | ---- | ----------- |
| `node` | [`Report!`](../../objects/report) | The Report object. |
| `cursor` | [`String!`](../../scalars/string) | A string that serves as a pagination cursor for this particular edge. |





