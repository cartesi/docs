---
id: proof
title: Proof
hide_table_of_contents: false
---

Represents the proof of validity for a notice or voucher.

```graphql
type Proof {
  validity: OutputValidityProof!
  context: String!
}
```


## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `validity`| [`OutputValidityProof!`](../../objects/output-validity-proof) | Validity proof for an output. |
| `context`| [`String!`](../../scalars/string) | Data that allows the validity proof to be contextualized within submitted claims, given as a payload in Ethereum hex binary format, starting with '0x'. |





