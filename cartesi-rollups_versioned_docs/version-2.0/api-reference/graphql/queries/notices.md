---
id: notices
title: Notices
hide_table_of_contents: false
---

Notices are informational statements that can be validated in the base layer blockchain.

## 1. Get Notice by Index

Retrieve a specific notice based on its index and associated input index.

```graphql
query notice($outputIndex: Int!) {
  notice(outputIndex: $outputIndex) {
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
}
```

For notices, the API provides access to proof data that can be used for validation on the base layer blockchain. This proof data is accessible through the [`Proof`](../objects/proof.md) field on notice objects.

### Arguments

| Name         | Type                        | Description                                    |
| ------------ | --------------------------- | ---------------------------------------------- |
| `outputIndex` | [`Int!`](../../scalars/int) | Index of the notice to retrieve.               |

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
  notice(outputIndex: 1) {
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
  }
}
```

4. Listing notices with proof data and application information:

```graphql
query {
  notices(first: 10) {
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
}
```

5. Fetching a specific notice by output index:

```graphql
query {
  notice(outputIndex: 1) {
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
}
```