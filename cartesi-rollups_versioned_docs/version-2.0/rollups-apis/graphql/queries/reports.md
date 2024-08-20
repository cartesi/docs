---
id: reports
title: Reports
hide_table_of_contents: false
---

Reports contain application logs or diagnostic information and cannot be validated on-chain. 

## 1. Get Report by Index

Retrieve a specific report based on its index and associated input index.

```graphql
query report($reportIndex: Int!, $inputIndex: Int!) {
  report(reportIndex: $reportIndex, inputIndex: $inputIndex) {
    index
    input {
      index
      status
      timestamp
      msgSender
      blockNumber
    }
    payload
  }
}
```

### Arguments

| Name | Type | Description |
| ---- | ---- | ----------- |
| `reportIndex` | [`Int!`](../../scalars/int) | Index of the report to retrieve. |
| `inputIndex` | [`Int!`](../../scalars/int) | Index of the input associated with the report. |


### Response Type

 [`Report`](../../objects/report)

## 2. Get reports 

Retrieve a list of reports with support for pagination.

```graphql
query reports {
  reports {
    edges {
      node {
        index
        input {
          index
          status
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

[`ReportConnection`](../../objects/report-connection)

## 3. Get Reports by Input

Retrieve reports associated with a specific input.

```graphql
query reportsByInput($inputIndex: Int!) {
  input(index: $inputIndex) {
    reports {
      edges {
        node {
          index
          input {
            index
            status
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

| Name | Type | Description |
| ---- | ---- | ----------- |
| `inputIndex` | [`Int!`](../../scalars/int) | Index of the input to retrieve reports for. |

### Response Type

[`ReportConnection`](../../objects/report-connection)

## Examples

 1. Fetching a specific report:

  ```graphql
  query {
    report(reportIndex: 1, inputIndex: 5) {
      index
      input {
        index
        status
        timestamp
      }
      payload
    }
  }
  ```

2. Listing earlier(first 5) reports:

  ```graphql
  query {
    reports(first: 5) {
      edges {
        node {
          index
          input {
            index
            status
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

3. Paginating through reports:

  ```graphql
  query {
    reports(first: 5, after: "MA==") {
      edges {
        node {
          index
          input {
            index
            status
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

4. Retrieving reports for a specific input:

  ```graphql
  query {
    input(index: 10) {
      reports {
        edges {
          node {
            index
            payload
          }
        }
      }
    }
  }
  ```

5. Combining pagination with input-specific reports:

  ```graphql
  query {
    input(index: 0) {
      reports(last: 5, before: "MA==") {
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

