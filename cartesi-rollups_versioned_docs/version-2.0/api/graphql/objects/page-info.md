---
id: page-info
title: PageInfo
hide_table_of_contents: false
---


Page metadata for the cursor-based Connection pagination pattern.

```graphql
type PageInfo {
  startCursor: String
  endCursor: String
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}
```


## Fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| `startCursor` | [`String`](../../scalars/string) | Cursor pointing to the first entry of the page. |
| `endCursor` | [`String`](../../scalars/string) | Cursor pointing to the last entry of the page. |
| `hasNextPage` | [`Boolean!`](../../scalars/boolean) | Indicates if there are more pages after the current one. |
| `hasPreviousPage` | [`Boolean!`](../../scalars/boolean) | Indicates if there are previous pages before the current one. |


