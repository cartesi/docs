---
id: delegate-call-voucher
title: DelegateCallVoucher
hide_table_of_contents: false
---

Represents a delegate call voucher in a Cartesi Rollups application.

```graphql
type DelegateCallVoucher {
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
  "Indicates whether the voucher has been executed on the base layer blockchain"
  executed: Boolean
  "The hash of executed transaction"
  transactionHash: String
  "The application that produced the delegateed voucher"
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
| `executed` | [`Boolean`](../../scalars/boolean) | Indicates whether the voucher has been executed on the base layer blockchain. |
| `transactionHash` | [`String`](../../scalars/string) | The hash of executed transaction. |
| `application` | [`Application!`](../../objects/application) | The application that produced the delegateed voucher. |

## Example Query

```graphql
query {
  delegateCallVoucher(outputIndex: 1) {
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
    executed
    transactionHash
    application {
      address
      name
    }
  }
}
```