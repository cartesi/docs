---
id: report-connection
title: ReportConnection
hide_table_of_contents: false
---


Represents a paginated connection of Reports.

```graphql
type ReportConnection {
  edges: [ReportEdge!]!
  pageInfo: PageInfo!
}
```


## Fields

| Name | Type | Description |
| ---- |------| ------|
| `edges`| [`ReportEdge`](../../objects/report-edge) | A list of `ReportEdge` objects. Each edge contains an `Input` object and a cursor for pagination. |
| `pageInfo`| [`PageInfo`](../../objects/page-info) | Metadata about the pagination. |






