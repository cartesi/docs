---
id: page-info
title: PageInfo
hide_table_of_contents: false
---

Page metadata for the cursor-based Connection pagination pattern.

```graphql
type PageInfo {
  "Cursor pointing to the first entry of the page"
  startCursor: String
  "Cursor pointing to the last entry of the page"
  endCursor: String
  "Indicates if there are additional entries after the end cursor"
  hasNextPage: Boolean!
  "Indicates if there are additional entries before the start cursor"
  hasPreviousPage: Boolean!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `startCursor` | [`String`](../../scalars/string) | Cursor pointing to the first entry of the page. |
| `endCursor` | [`String`](../../scalars/string) | Cursor pointing to the last entry of the page. |
| `hasNextPage` | [`Boolean!`](../../scalars/boolean) | Indicates if there are additional entries after the end cursor. |
| `hasPreviousPage` | [`Boolean!`](../../scalars/boolean) | Indicates if there are additional entries before the start cursor. |

## Example Query

```graphql
query {
  inputs(first: 10) {
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}
```
