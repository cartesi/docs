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
    id
    index
    status
    msgSender
    blockTimestamp
    blockNumber
    payload
    inputBoxIndex
    prevRandao
    application {
      address
      name
    }
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
        id
        index
        status
        msgSender
        blockTimestamp
        blockNumber
        payload
        inputBoxIndex
        prevRandao
        application {
          address
          name
        }
      }
      cursor
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
| `where` | [`InputFilter`](../../filters/input-filter) | Filter criteria for inputs. |


### Response Type

[`InputConnection`](../../objects/input-connection)


:::note pagination and filtering

- You cannot mix forward pagination (`first`, `after`) with backward pagination (`last`, `before`) in the same query.

- The `where` argument allows you to filter inputs based the [`InputFilter`](../../filters/input-filter).

- When using `where` with `after` or `before`, the filter is applied first, and then the pagination is applied to the filtered results.
:::



## 3. Get Input Result

Retrieve the result of a specific input, including its associated notices, vouchers, and reports.

```graphql
query getInputResult($inputIndex: Int!) {
  input(index: $inputIndex) {
    id
    index
    status
    msgSender
    blockTimestamp
    blockNumber
    payload
    inputBoxIndex
    prevRandao
    application {
      address
      name
    }
    reports {
      edges {
        node {
          index
          payload
          application {
            address
            name
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
    notices {
      edges {
        node {
          index
          payload
          proof {
            outputIndex
            outputHashesSiblings
          }
          application {
            address
            name
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
    vouchers {
      edges {
        node {
          index
          destination
          payload
          proof {
            outputIndex
            outputHashesSiblings
          }
          value
          executed
          transactionHash
          application {
            address
            name
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
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
      id
      index
      status
      msgSender
      blockTimestamp
      blockNumber
      payload
      inputBoxIndex
      prevRandao
      application {
        address
        name
      }
    }
  }
  ```

2. Listing earlier(first 5) inputs:

  ```graphql
  query {
    inputs(first: 5) {
      edges {
        node {
          id
          index
          status
          msgSender
          blockTimestamp
          blockNumber
          payload
          inputBoxIndex
          prevRandao
          application {
            address
            name
          }
        }
        cursor
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
      id
      index
      status
      msgSender
      blockTimestamp
      blockNumber
      payload
      inputBoxIndex
      prevRandao
      application {
        address
        name
      }
      notices {
        edges {
          node {
            index
            payload
            proof {
              outputIndex
              outputHashesSiblings
            }
            application {
              address
              name
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
      vouchers {
        edges {
          node {
            index
            destination
            payload
            proof {
              outputIndex
              outputHashesSiblings
            }
            value
            executed
            transactionHash
            application {
              address
              name
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
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
          id
          index
          status
          msgSender
          blockTimestamp
          blockNumber
          payload
          inputBoxIndex
          prevRandao
          application {
            address
            name
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ```

5. Listing inputs with application information:

  ```graphql
  query {
    inputs(first: 10) {
      edges {
        node {
          id
          index
          status
          msgSender
          blockTimestamp
          blockNumber
          payload
          inputBoxIndex
          prevRandao
          application {
            address
            name
          }
        }
      }
    }
  }
  ```

6. Retrieving a specific input with application information:

  ```graphql
  query {
    input(outputIndex: 1) {
      id
      index
      status
      msgSender
      blockTimestamp
      blockNumber
      payload
      inputBoxIndex
      prevRandao
      application {
        address
        name
      }
    }
  }
  ```

7. Listing inputs with application information and cursor:

  ```graphql
  query {
    inputs(first: 10) {
      edges {
        node {
          id
          index
          status
          msgSender
          blockTimestamp
          blockNumber
          payload
          inputBoxIndex
          prevRandao
          application {
            address
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ```