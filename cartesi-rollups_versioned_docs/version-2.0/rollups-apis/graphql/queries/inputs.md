---
id: inputs
title: Inputs
hide_table_of_contents: false
---

Inputs represent requests submitted to the application to advance its state.

## 1. Get Input by Index

Retrieve a specific input based on its identifier.

```graphql
query getInput($inputIndex: Int!) {
  input(index: $inputIndex) {
    index
    status
    timestamp
    msgSender
    blockNumber
    payload
  }
}
```

### Arguments

| Name | Type | Description |
| ---- | ---- | ----------- |
| `inputIndex` | [`Int`](../../scalars/int) | Index of the input to retrieve. |

### Response Type

[`Input`](../../objects/input)


## 2. Get Inputs 

Retrieve a list of inputs with support for pagination.

```graphql
query inputs(
  $first: Int
  $last: Int
  $after: String
  $before: String
  $where: InputFilter
) {
  inputs(
    first: $first
    last: $last
    after: $after
    before: $before
    where: $where
  ) {
    edges {
      node {
        index
        status
        timestamp
        msgSender
        blockNumber
        payload
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

### Arguments

| Name | Type | Description |
| ---- | ---- | ----------- |
| `first` | [`Int`](../../scalars/int) | Get at most the first `n` entries (forward pagination). |
| `last` | [`Int`](../../scalars/int) | Get at most the last `n` entries (backward pagination). |
| `after` | [`String`](../../scalars/string) | Get entries after the provided cursor (forward pagination). |
| `before` | [`String`](../../scalars/string) | Get entries before the provided cursor (backward pagination). |
| `where` | [`InputFilter`](../../inputs/input-filter) | Filter criteria for inputs. |


### Response Type

[`InputConnection`](../../objects/input-connection)


:::note pagination and filtering

- You cannot mix forward pagination (`first`, `after`) with backward pagination (`last`, `before`) in the same query.

- The `where` argument allows you to filter inputs based the [`InputFilter`](../../inputs/input-filter).

- When using `where` with `after` or `before`, the filter is applied first, and then the pagination is applied to the filtered results.
:::



## 3. Get Input Result

Retrieve the result of a specific input, including its associated notices, vouchers, and reports.

```graphql
query getInputResult($inputIndex: Int!) {
  input(index: $inputIndex) {
    status
    timestamp
    msgSender
    blockNumber
    reports {
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
    notices {
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
    vouchers {
      edges {
        node {
          index
          input {
            index
          }
          destination
          payload
        }
      }
    }
  }
}
```

### Arguments

| Name | Type | Description |
| ---- | ---- | ----------- |
| `inputIndex` | [`Int`](../../scalars/int) | Index of the input to retrieve. |


### Response Type

[`Input`](../../objects/input) with nested connections for reports, notices, and vouchers.


## Examples

1. Fetching a specific input:

  ```graphql
  query {
    input(index: 5) {
      index
      status
      timestamp
      msgSender
      blockNumber
      payload
    }
  }
  ```

2. Listing earlier(first 5) inputs:

  ```graphql
  query {
    inputs(first: 5) {
      edges {
        node {
          index
          status
          timestamp
          msgSender
          payload
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ```

3. Retrieving input results:

  ```graphql
  query {
    input(index: 10) {
      status
      timestamp
      notices {
        edges {
          node {
            index
            payload
          }
        }
      }
      vouchers {
        edges {
          node {
            index
            destination
            payload
          }
        }
      }
    }
  }
  ```

4. Using pagination and filtering:

  ```graphql
  query {
    inputs(first: 5, where: { indexLowerThan: 1 }) {
      edges {
        node {
          index
          status
          timestamp
          msgSender
          payload
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ```