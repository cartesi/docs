---
id: voucher-connection
title: VoucherConnection
hide_table_of_contents: false
---


Represents a paginated connection of Vouchers.

```graphql
type VoucherConnection {
  edges: [VoucherEdge!]!
  pageInfo: PageInfo!
}
```


## Fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| `edges` | [`[VoucherEdge!]!`](../../objects/voucher-edge) | A list of `VoucherEdge` objects. Each edge contains a `Voucher` object and a cursor for pagination. |
| `pageInfo` | [`PageInfo!`](../../objects/page-info) | Pagination metadata. |






