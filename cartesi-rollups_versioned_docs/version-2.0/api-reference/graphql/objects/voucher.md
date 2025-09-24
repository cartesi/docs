---
id: voucher
title: Voucher
hide_table_of_contents: false
---

Representation of a transaction that can be carried out on the base layer blockchain, such as a transfer of assets.

```graphql
type Voucher {
  "Voucher index within the context of the input that produced it"
  index: Int!
  "Input whose processing produced the voucher"
  input: Input!
  "Transaction destination address in Ethereum hex binary format (20 bytes), starting with '0x'"
  destination: String!
  "Transaction payload in Ethereum hex binary format, starting with '0x'"
  payload: String!
  "Proof object that allows this voucher to be validated and executed on the base layer blockchain"
  proof: Proof
  "Value to be sent with the transaction"
  value: BigInt
  "Indicates whether the voucher has been executed on the base layer blockchain"
  executed: Boolean
  "The hash of executed transaction"
  transactionHash: String
  "The application that produced the voucher"
  application: Application!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `index` | [`Int!`](../../scalars/int) | Voucher index within the context of the input that produced it. |
| `input` | [`Input!`](../../objects/input) | Input whose processing produced the voucher. |
| `destination` | [`String!`](../../scalars/string) | Transaction destination address in Ethereum hex binary format (20 bytes), starting with '0x'. |
| `payload` | [`String!`](../../scalars/string) | Transaction payload in Ethereum hex binary format, starting with '0x'. |
| `proof` | [`Proof`](../../objects/proof) | Proof object that allows this voucher to be validated and executed on the base layer blockchain. |
| `value` | [`BigInt`](../../scalars/bigint) | Value to be sent with the transaction. |
| `executed` | [`Boolean`](../../scalars/boolean) | Indicates whether the voucher has been executed on the base layer blockchain. |
| `transactionHash` | [`String`](../../scalars/string) | The hash of executed transaction. |
| `application` | [`Application!`](../../objects/application) | The application that produced the voucher. |

## Example Query

```graphql
query {
  voucher(address: "0x123...") {
    index
    input {
      index
    }
    destination
    payload
    proof {
      outputIndex
      outputHashesSiblings
    }
    value
    executed
    transactionHash
    application {
      address
      name
    }
  }
}
```