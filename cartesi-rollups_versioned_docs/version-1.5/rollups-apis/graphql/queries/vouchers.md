---
id: list-vouchers
title: Vouchers
hide_table_of_contents: false
---


Vouchers represent transactions that can be carried out on the base layer blockchain, such as asset transfers. They are used to effect changes in the base layer based on the application's state.

## Get Voucher by Index

Retrieve a specific voucher based on its index and associated input index.

```graphql
query voucher($voucherIndex: Int!, $inputIndex: Int!) {
  voucher(voucherIndex: $voucherIndex, inputIndex: $inputIndex) {
    index
    input {
      index
      timestamp
      msgSender
      blockNumber
    }
    destination
    payload
    proof {
      validity {
        inputIndexWithinEpoch
        outputIndexWithinInput
        outputHashesRootHash
        vouchersEpochRootHash
        noticesEpochRootHash
        machineStateHash
        outputHashInOutputHashesSiblings
        outputHashesInEpochSiblings
      }
      context
    }
  }
}
```

### Arguments

| Name | Type | Description |
| ---- | ---- | ----------- |
| `voucherIndex` | [`Int!`](../../scalars/int) | The index of the voucher to retrieve. |
| `inputIndex` | [`Int!`](../../scalars/int) | The index of the associated input. |



### Response Type

[`Voucher`](../../objects/voucher)


## Get Vouchers

Retrieve a list of vouchers with support for pagination.

```graphql
query vouchers($first: Int, $after: String) {
  vouchers(first: $first, after: $after) {
    edges {
      node {
        index
        input {
          index
          timestamp
          msgSender
          blockNumber
        }
        destination
        payload
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


## Get Vouchers by Input

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
      voucher(voucherIndex: 3, inputIndex: 2) {
        index
        destination
        payload
        proof {
          validity {
            inputIndexWithinEpoch
            outputIndexWithinInput
          }
          context
        }
      }
    }
  ```

2. Listing recent vouchers:

  ```graphql
  query {
    vouchers(first: 5) {
      edges {
        node {
          index
          input {
            index
            timestamp
          }
          destination
          payload
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