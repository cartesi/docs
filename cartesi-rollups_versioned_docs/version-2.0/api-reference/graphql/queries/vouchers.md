---
id: vouchers
title: Vouchers
hide_table_of_contents: false
---


Vouchers represent transactions that can be carried out on the base layer blockchain, such as asset transfers. They are used to effect changes in the base layer based on the application's state.

## 1. Get Voucher by Index

Retrieve a specific voucher based on its index and associated input index.

```graphql
query voucher($outputIndex: Int!) {
  voucher(outputIndex: $outputIndex) {
    index
    input {
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
}
```
For vouchers, the API provides access to proof data that can be used for validation on the base layer blockchain. This proof data is accessible through the [`Proof`](../objects/proof.md) field on voucher objects.

### Arguments

| Name | Type | Description |
| ---- | ---- | ----------- |
| `outputIndex` | [`Int!`](../../scalars/int) | The index of the voucher to retrieve. |



### Response Type

[`Voucher`](../../objects/voucher)


## 2. Get Vouchers

Retrieve a list of vouchers with support for pagination.

```graphql
query vouchers($first: Int, $after: String) {
  vouchers(first: $first, after: $after) {
    edges {
      node {
        index
        input {
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
```

### Arguments

| Name | Type | Description |
| ---- | ---- | ----------- |
| `first` | [`Int`](../../scalars/int) | Number of vouchers to retrieve (for pagination). |
| `after` | [`String`](../../scalars/string) | Cursor to start retrieving vouchers from (for pagination). |


### Response Type

[`VoucherConnection`](../../objects/voucher-connection)


## 3. Get Vouchers by Input

Retrieve vouchers associated with a specific input.

```graphql
query vouchersByInput($inputIndex: Int!, $first: Int, $after: String) {
  input(index: $inputIndex) {
    vouchers(first: $first, after: $after) {
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
| `inputIndex` | [`Int!`](../../scalars/int) | Index of the input to retrieve vouchers for. |
| `first` | [`Int`](../../scalars/int) | Number of vouchers to retrieve (for pagination). |
| `after` | [`String`](../../scalars/string) | Cursor to start retrieving vouchers from (for pagination). |

### Response Type

[`VoucherConnection`](../../objects/voucher-connection)



## Examples

1. Fetching a specific voucher:

  ```graphql
  query {
    voucher(outputIndex: 1) {
      index
      input {
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
  }
  ```

2. Listing earlier(first 5) vouchers:

  ```graphql
  query {
    vouchers(first: 5) {
      edges {
        node {
          index
          input {
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
  ```

3. Retrieving vouchers associated with a specific input:

  ```graphql
  query {
    input(index: 10) {
      vouchers(first: 3) {
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

4. Listing all vouchers with proof data:

  ```graphql
  query {
    vouchers(first: 10) {
      edges {
        node {
          index
          input {
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
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ```

5. Fetching a specific voucher by output index:

  ```graphql
  query {
    voucher(outputIndex: 1) {
      index
      input {
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
  }
  ```