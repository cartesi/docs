---
id: voucher-edge
title: VoucherEdge
hide_table_of_contents: false
---

Represents a single voucher in a paginated list.

```graphql
type VoucherEdge {
  "The voucher at this edge"
  node: Voucher!
  "A cursor for use in pagination"
  cursor: String!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `node` | [`Voucher!`](../../objects/voucher) | The voucher at this edge. |
| `cursor` | [`String!`](../../scalars/string) | A cursor for use in pagination. |

## Example Query

```graphql
query {
  vouchers(first: 10) {
    edges {
      node {
        index
        destination
        payload
        value
        executed
        transactionHash
      }
      cursor
    }
  }
}
```
