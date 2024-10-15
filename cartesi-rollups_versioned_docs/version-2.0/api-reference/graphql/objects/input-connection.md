---
id: input-connection
title: InputConnection
hide_table_of_contents: false
---


Represents a paginated connection of Inputs.

```graphql
type InputConnection {
  edges: [InputEdge!]!
  pageInfo: PageInfo!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ------|
| `edges`| [`InputEdge`](../../objects/input-edge) | A list of `InputEdge` objects. Each edge contains an `Input` object and a cursor for pagination. |
| `pageInfo`| [`PageInfo`](../../objects/page-info) | Metadata about the pagination. |




