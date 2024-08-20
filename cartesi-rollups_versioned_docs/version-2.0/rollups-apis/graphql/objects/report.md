---
id: report
title: Report
hide_table_of_contents: false
---


Represents application log or diagnostic information.

```graphql
type Report {
  index: Int!
  input: Input!
  payload: String!
}
```


## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `index`| [`Int!`](../../scalars/int) | Unique identifier for the report. |
| `input`| [`Input!`](../../objects/input) | The input associated with this report. |
| `payload`| [`String!`](../../scalars/string) | The actual data/content of the report. |






