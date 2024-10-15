---
id: voucher
title: Voucher
hide_table_of_contents: false
---


Representation of a transaction that can be carried out on the base layer blockchain, such as a transfer of assets.

```graphql
type Voucher {
  index: Int!
  input: Input!
  destination: String!
  payload: String!
  proof: Proof
}
```


## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `index`| [`Int!`](../../scalars/int) | Unique identifier for the voucher. |
| `input`| [`Input!`](../../objects/input) | The input associated with this voucher. |
| `destination`| [`String!`](../../scalars/string) | The address or identifier of the voucher's destination. |
| `payload`| [`String!`](../../scalars/string) | The actual data/content of the voucher. |
| `proof`| [`Proof`](../../objects/proof) | Proof object that allows this voucher to be validated and executed on the base layer blockchain(if available). |




