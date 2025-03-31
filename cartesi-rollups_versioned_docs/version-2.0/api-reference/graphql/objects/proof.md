---
id: proof
title: Proof
hide_table_of_contents: false
---

Data that can be used as proof to validate notices and execute vouchers on the base layer blockchain.

```graphql
type Proof {
  "Index of the output in the output box"
  outputIndex: BigInt!
  "Array of sibling hashes in the output box merkle tree"
  outputHashesSiblings: [String]!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `outputIndex` | [`BigInt!`](../../scalars/bigint) | Index of the output in the output box. |
| `outputHashesSiblings` | [`[String]!`](../../scalars/string) | Array of sibling hashes in the output box merkle tree. |

## Example Query

```graphql
query {
  voucher(outputIndex: 1) {
    proof {
      outputIndex
      outputHashesSiblings
    }
  }
}
```
