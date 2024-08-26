---
id: input-filter
title: InputFilter
hide_table_of_contents: false
---


Filter object to restrict results depending on input properties

```graphql
input InputFilter {
  indexLowerThan: Int
  indexGreaterThan: Int
}
```


## Fields

| Name | Type | Description |
| ---- |------| ------|
| `indexLowerThan` | [`Int`](../../scalars/int) | Filter only inputs with index lower than a given value |
| `indexGreaterThan` | [`Int`](../../scalars/int) | Filter only inputs with index greater than a given value |


