---
id: delegate-call-voucher-edge
title: DelegateCallVoucherEdge
hide_table_of_contents: false
---

Represents a single DELEGATECALL voucher in a paginated list.

```graphql
type DelegateCallVoucherEdge {
  "The DELEGATECALL voucher at this edge"
  node: DelegateCallVoucher!
  "A cursor for use in pagination"
  cursor: String!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `node` | [`DelegateCallVoucher!`](../../objects/delegate-call-voucher) | The DELEGATECALL voucher at this edge. |
| `cursor` | [`String!`](../../scalars/string) | A cursor for use in pagination. |

## Example Query

```graphql
query {
  delegateCallVouchers(first: 10) {
    edges {
      node {
        index
        destination
        payload
        executed
        transactionHash
      }
      cursor
    }
  }
}
``` 