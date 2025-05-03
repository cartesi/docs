---
id: notice
title: Notice
hide_table_of_contents: false
---

Informational statement that can be validated in the base layer blockchain.

```graphql
type Notice {
  "Notice index within the context of the input that produced it"
  index: Int!
  "Input whose processing produced the notice"
  input: Input!
  "Notice data as a payload in Ethereum hex binary format, starting with '0x'"
  payload: String!
  "Proof object that allows this notice to be validated by the base layer blockchain"
  proof: Proof
  "The application that produced the notice"
  application: Application!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `index` | [`Int!`](../../scalars/int) | Notice index within the context of the input that produced it. |
| `input` | [`Input!`](../../objects/input) | Input whose processing produced the notice. |
| `payload` | [`String!`](../../scalars/string) | Notice data as a payload in Ethereum hex binary format, starting with '0x'. |
| `proof` | [`Proof`](../../objects/proof) | Proof object that allows this notice to be validated by the base layer blockchain. |
| `application` | [`Application!`](../../objects/application) | The application that produced the notice. |

## Example Query

```graphql
query {
  notice(outputIndex: 1) {
    index
    input {
      index
    }
    payload
    proof {
      outputIndex
      outputHashesSiblings
    }
    application {
      address
      name
    }
  }
}
```