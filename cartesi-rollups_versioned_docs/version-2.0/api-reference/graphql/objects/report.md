---
id: report
title: Report
hide_table_of_contents: false
---

Application log or diagnostic information.

```graphql
type Report {
  "Report index within the context of the input that produced it"
  index: Int!
  "Input whose processing produced the report"
  input: Input!
  "Report data as a payload in Ethereum hex binary format, starting with '0x'"
  payload: String!
  "The application that produced the report"
  application: Application!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `index` | [`Int!`](../../scalars/int) | Report index within the context of the input that produced it. |
| `input` | [`Input!`](../../objects/input) | Input whose processing produced the report. |
| `payload` | [`String!`](../../scalars/string) | Report data as a payload in Ethereum hex binary format, starting with '0x'. |
| `application` | [`Application!`](../../objects/application) | The application that produced the report. |

## Example Query

```graphql
query {
  report(reportIndex: 1) {
    index
    input {
      index
    }
    payload
    application {
      address
      name
    }
  }
}
```