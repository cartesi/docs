---
id: delegate-call-vouchers
title: DELEGATECALL Vouchers
hide_table_of_contents: false
---

DELEGATECALL Vouchers are an extension of vouchers that enables DELEGATECALL operations to be executed on the base layer blockchain. While they share similarities with regular vouchers, they are specifically designed for DELEGATECALL operations, allowing for more flexible contract interactions.

## 1. Get DELEGATECALL Voucher by Index

Retrieve a specific DELEGATECALL voucher based on its output index.

```graphql
query delegateCallVoucher($outputIndex: Int!) {
  delegateCallVoucher(outputIndex: $outputIndex) {
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
    executed
    transactionHash
    application {
      address
      name
    }
  }
}
```

For DELEGATECALL vouchers, the API provides access to proof data that can be used for validation on the base layer blockchain. This proof data is accessible through the [`Proof`](../objects/proof.md) field on DELEGATECALL voucher objects.

### Arguments

| Name | Type | Description |
| ---- | ---- | ----------- |
| `outputIndex` | [`Int!`](../../scalars/int) | The index of the DELEGATECALL voucher to retrieve. |

### Response Type

[`DelegateCallVoucher`](../../objects/delegate-call-voucher)

## 2. Get DELEGATECALL Vouchers

Retrieve a list of DELEGATECALL vouchers with support for pagination.

```graphql
query delegateCallVouchers($first: Int, $after: String, $filter: [ConvenientFilter]) {
  delegateCallVouchers(first: $first, after: $after, filter: $filter) {
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
| `first` | [`Int`](../../scalars/int) | Number of DELEGATECALL vouchers to retrieve (for pagination). |
| `after` | [`String`](../../scalars/string) | Cursor to start retrieving DELEGATECALL vouchers from (for pagination). |
| `filter` | [`[ConvenientFilter]`](../../filters/convenient-filter) | Optional filters to apply to the query. |

### Response Type

[`DelegateCallVoucherConnection`](../../objects/delegate-call-voucher-connection)

## 3. Get DELEGATECALL Vouchers by Input

Retrieve DELEGATECALL vouchers associated with a specific input.

```graphql
query delegateCallVouchersByInput($inputIndex: Int!, $first: Int, $after: String) {
  input(index: $inputIndex) {
    delegateCallVouchers(first: $first, after: $after) {
      edges {
        node {
          index
          destination
          payload
          proof {
            outputIndex
            outputHashesSiblings
          }
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
| `inputIndex` | [`Int!`](../../scalars/int) | Index of the input to retrieve DELEGATECALL vouchers for. |
| `first` | [`Int`](../../scalars/int) | Number of DELEGATECALL vouchers to retrieve (for pagination). |
| `after` | [`String`](../../scalars/string) | Cursor to start retrieving DELEGATECALL vouchers from (for pagination). |

### Response Type

[`DelegateCallVoucherConnection`](../../objects/delegate-call-voucher-connection)

## Examples

1. Fetching a specific DELEGATECALL voucher:

```graphql
query {
  delegateCallVoucher(outputIndex: 1) {
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
    executed
    transactionHash
    application {
      address
      name
    }
  }
}
```

2. Listing earlier(first 5) DELEGATECALL vouchers with filter:

```graphql
query {
  delegateCallVouchers(
    first: 5
    filter: [
      {
        destination: { eq: "0x1234567890123456789012345678901234567890" }
        executed: { eq: false }
      }
    ]
  ) {
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

3. Retrieving DELEGATECALL vouchers for a specific input:

```graphql
query {
  input(index: 10) {
    delegateCallVouchers(first: 3) {
      edges {
        node {
          index
          destination
          payload
          proof {
            outputIndex
            outputHashesSiblings
          }
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