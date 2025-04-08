---
title: Input Filter
description: Documentation for filtering inputs in Cartesi Rollups GraphQL API
keywords: [graphql, filter, input, query]
---

# Input Filter

The Input Filter allows you to query and filter inputs in the Cartesi Rollups GraphQL API. You can filter inputs based on various criteria such as input index, metadata, and timestamp.

## Structure

The Input Filter provides the following filter options:

```graphql
input InputFilter {
  index: BigIntFilterInput
  metadata: MetadataFilterInput
  timestamp: DateTimeFilterInput
}

input MetadataFilterInput {
  blockNumber: BigIntFilterInput
  blockTimestamp: DateTimeFilterInput
  epochIndex: BigIntFilterInput
  inputIndex: BigIntFilterInput
}

input BigIntFilterInput {
  eq: String
  gt: String
  gte: String
  in: [String!]
  lt: String
  lte: String
  not: BigIntFilterInput
  notIn: [String!]
}

input DateTimeFilterInput {
  eq: DateTime
  gt: DateTime
  gte: DateTime
  in: [DateTime!]
  lt: DateTime
  lte: DateTime
  not: DateTimeFilterInput
  notIn: [DateTime!]
}
```

## Usage Examples

### Filter by Input Index

```graphql
query {
  inputs(
    filter: {
      index: {
        eq: "42"
      }
    }
  ) {
    edges {
      node {
        index
        metadata {
          blockNumber
          blockTimestamp
        }
      }
    }
  }
}
```

### Filter by Block Number Range

```graphql
query {
  inputs(
    filter: {
      metadata: {
        blockNumber: {
          gte: "1000000"
          lt: "1000100"
        }
      }
    }
  ) {
    edges {
      node {
        index
        metadata {
          blockNumber
          blockTimestamp
        }
      }
    }
  }
}
```

### Filter by Timestamp

```graphql
query {
  inputs(
    filter: {
      timestamp: {
        gte: "2024-01-01T00:00:00Z"
        lt: "2024-02-01T00:00:00Z"
      }
    }
  ) {
    edges {
      node {
        index
        timestamp
        metadata {
          blockNumber
          blockTimestamp
        }
      }
    }
  }
}
```

## Available Filter Types

### BigIntFilterInput
- `eq`: Equal to
- `gt`: Greater than
- `gte`: Greater than or equal to
- `lt`: Less than
- `lte`: Less than or equal to
- `in`: In array of values
- `not`: Not equal to
- `notIn`: Not in array of values

### DateTimeFilterInput
- `eq`: Equal to
- `gt`: Greater than
- `gte`: Greater than or equal to
- `lt`: Less than
- `lte`: Less than or equal to
- `in`: In array of values
- `not`: Not equal to
- `notIn`: Not in array of values

### MetadataFilterInput
- `blockNumber`: Filter by block number
- `blockTimestamp`: Filter by block timestamp
- `epochIndex`: Filter by epoch index
- `inputIndex`: Filter by input index

## Best Practices

1. **Use Pagination**: When querying large datasets, always use pagination to limit the number of results returned.

2. **Optimize Query Performance**:
   - Use specific filters to narrow down results
   - Combine multiple filters when possible
   - Avoid overly broad date ranges

3. **Date Format**:
   - Use ISO 8601 format for dates (YYYY-MM-DDTHH:mm:ssZ)
   - Consider timezone implications when filtering by timestamp

4. **Index Usage**:
   - Filter by index when possible, as it's the most efficient way to query
   - Use index ranges for better performance

5. **Error Handling**:
   - Validate input values before querying
   - Handle null or undefined values appropriately 