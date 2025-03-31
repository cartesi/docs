---
id: application
title: Application
hide_table_of_contents: false
---

Represents a Cartesi Rollups application.

```graphql
type Application {
  "Application ID"
  id: String!
  "Application name"
  name: String!
  "Application Address"
  address: String!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `id` | [`String!`](../../scalars/string) | Application ID. |
| `name` | [`String!`](../../scalars/string) | Application name. |
| `address` | [`String!`](../../scalars/string) | Application Address. |

## Example Query

```graphql
query {
  application(id: "0x123...") {
    id
    name
    address
  }
}
``` 