---
title: Application Filter
description: Documentation for filtering applications in Cartesi Rollups GraphQL API
keywords: [graphql, filter, application, query]
---

# Application Filter

The Application Filter enables you to query and filter applications in the Cartesi Rollups GraphQL API. You can filter applications based on their address and other properties.

## Structure

The Application Filter provides the following filter options:

```graphql
input ApplicationFilter {
  address: AddressFilterInput
}

input AddressFilterInput {
  eq: String
  in: [String!]
  not: AddressFilterInput
  notIn: [String!]
}
```

## Usage Examples

### Filter by Application Address

```graphql
query {
  applications(
    filter: {
      address: {
        eq: "0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C"
      }
    }
  ) {
    edges {
      node {
        address
        inputs {
          totalCount
        }
        reports {
          totalCount
        }
      }
    }
  }
}
```

### Filter by Multiple Addresses

```graphql
query {
  applications(
    filter: {
      address: {
        in: [
          "0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C",
          "0x59b670e9fA9D0A427751Af201D676719a970857b"
        ]
      }
    }
  ) {
    edges {
      node {
      address
      inputs {
        totalCount
      }
      notices {
        totalCount
      }
      vouchers {
        totalCount
      }
      }
    }
  }
}
```

### Exclude Specific Applications

```graphql
query {
  applications(
    filter: {
      address: {
        notIn: [
          "0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C",
          "0x59b670e9fA9D0A427751Af201D676719a970857b"
        ]
      }
    }
  ) {
    edges {
      node {
        address
      }
    }
  }
}
```

## Available Filter Types

### AddressFilterInput
- `eq`: Equal to a specific address
- `in`: In array of addresses
- `not`: Not equal to a specific address
- `notIn`: Not in array of addresses

## Best Practices

1. **Address Format**:
   - Always use checksummed Ethereum addresses
   - Ensure addresses are properly formatted (0x prefix + 40 hexadecimal characters)

2. **Query Optimization**:
   - Use specific address filters when possible
   - Consider using `in` filter for multiple addresses instead of separate queries

3. **Pagination**:
   - Implement pagination when querying multiple applications
   - Use appropriate page sizes based on your application's needs

4. **Error Handling**:
   - Validate address format before querying
   - Handle cases where no applications match the filter criteria

5. **Security Considerations**:
   - Validate and sanitize address inputs
   - Implement appropriate access controls for sensitive application data 