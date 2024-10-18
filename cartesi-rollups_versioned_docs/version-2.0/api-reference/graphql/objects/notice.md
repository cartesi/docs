---
id: notice
title: Notice
hide_table_of_contents: false
---


Informational statement that can be validated in the base layer blockchain.

```graphql
type Notice {
  index: Int!
  input: Input!
  payload: String!
  proof: Proof
}
```


## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `index`| [`Int!`](../../scalars/int) | Unique identifier for the notice. |
| `input`| [`Input!`](../../objects/input) | The input associated with this notice. |
| `payload`| [`String!`](../../scalars/string) |The actual data/content of the notice. |
| `proof`| [`Proof`](../../objects/proof) | Proof of the notice's validity (if available). |






