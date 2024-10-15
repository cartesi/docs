---
id: notices
title: Notices
hide_table_of_contents: false
---

Notices are informational statements that can be validated in the base layer blockchain.

## 1. Get Notice by Index

Retrieve a specific notice based on its index and associated input index.

```graphql
query notice($noticeIndex: Int!, $inputIndex: Int!) {
  notice(noticeIndex: $noticeIndex, inputIndex: $inputIndex) {
    index
    input {
      index
      timestamp
      msgSender
      blockNumber
    }
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

For notices, the API provides access to proof data that can be used for validation on the base layer blockchain. This proof data is accessible through the [`Proof`](../objects/proof.md) field on notice objects.

### Arguments

| Name          | Type                        | Description                                    |
| ------------- | --------------------------- | ---------------------------------------------- |
| `noticeIndex` | [`Int!`](../../scalars/int) | Index of the notice to retrieve.               |
| `inputIndex`  | [`Int!`](../../scalars/int) | Index of the input associated with the notice. |

### Response Type

[`Notice`](../../objects/notice)

## 2. Get Notices

Retrieve a list of notices with support for pagination.

```graphql
query notices {
  notices {
    edges {
      node {
        index
        input {
          index
          timestamp
          msgSender
          blockNumber
        }
        payload
      }
    }
  }
}
```

### Arguments

None

### Response Type

[`NoticeConnection`](../../objects/notice-connection)

## 3. Get Notices by Input

Retrieve notices associated with a specific input.

```graphql
query noticesByInput($inputIndex: Int!) {
  input(index: $inputIndex) {
    notices {
      edges {
        node {
          index
          input {
            index
            timestamp
            msgSender
            blockNumber
          }
          payload
        }
      }
    }
  }
}
```

### Arguments

| Name         | Type                        | Description                                 |
| ------------ | --------------------------- | ------------------------------------------- |
| `inputIndex` | [`Int!`](../../scalars/int) | Index of the input to retrieve notices for. |

### Response Type

[`NoticeConnection`](../../objects/notice-connection)


## Examples

1. Fetching a specific notice:

```graphql
query {
  notice(noticeIndex: 3, inputIndex: 2) {
    index
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

2. Listing earlier(first 5) notices:

```graphql
query {
  notices(first: 5) {
    edges {
      node {
        index
        input {
          index
          timestamp
        }
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

3. Retrieving notices for a specific input:

```graphql
query {
  input(index: 10) {
    notices(first: 3) {
      edges {
        node {
          index
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
