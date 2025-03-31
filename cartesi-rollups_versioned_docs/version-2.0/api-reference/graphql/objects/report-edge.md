---
id: report-edge
title: ReportEdge
hide_table_of_contents: false
---

Represents a single report in a paginated list.

```graphql
type ReportEdge {
  "The report at this edge"
  node: Report!
  "A cursor for use in pagination"
  cursor: String!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `node` | [`Report!`](../../objects/report) | The report at this edge. |
| `cursor` | [`String!`](../../scalars/string) | A cursor for use in pagination. |

## Example Query

```graphql
query {
  reports(first: 10) {
    edges {
      node {
        index
        payload
      }
      cursor
    }
  }
}
```
