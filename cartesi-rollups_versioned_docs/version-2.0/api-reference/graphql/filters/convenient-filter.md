---
id: convenient-filter
title: Convenient Filter
hide_table_of_contents: false
---

The ConvenientFilter provides a flexible way to filter vouchers and delegate call vouchers based on various criteria. It supports filtering by destination address, execution status, and complex logical operations.

## Filter Structure

```graphql
input ConvenientFilter {
  destination: AddressFilterInput
  executed: BooleanFilterInput
  and: [ConvenientFilter]
  or: [ConvenientFilter]
}
```

### Address Filter Input

The `AddressFilterInput` allows filtering by Ethereum addresses:

```graphql
input AddressFilterInput {
  eq: String        # Equal to
  ne: String        # Not equal to
  in: [String]      # In array of addresses
  nin: [String]     # Not in array of addresses
  and: [ConvenientFilter]
  or: [ConvenientFilter]
}
```

### Boolean Filter Input

The `BooleanFilterInput` enables filtering by boolean values:

```graphql
input BooleanFilterInput {
  eq: Boolean       # Equal to
  ne: Boolean       # Not equal to
  and: [ConvenientFilter]
  or: [ConvenientFilter]
}
```

## Usage Examples

### 1. Filter by Destination Address

```graphql
query {
  vouchers(
    filter: [
      {
        destination: {
          eq: "0x1234567890123456789012345678901234567890"
        }
      }
    ]
  ) {
    edges {
      node {
        index
        destination
        executed
      }
    }
  }
}
```

### 2. Filter by Execution Status

```graphql
query {
  delegateCallVouchers(
    filter: [
      {
        executed: {
          eq: false
        }
      }
    ]
  ) {
    edges {
      node {
        index
        destination
        executed
      }
    }
  }
}
```

### 3. Complex Filter with Logical Operators

```graphql
query {
  vouchers(
    filter: [
      {
        and: [
          {
            destination: {
              eq: "0x1234567890123456789012345678901234567890"
            }
          },
          {
            executed: {
              eq: false
            }
          }
        ]
      }
    ]
  ) {
    edges {
      node {
        index
        destination
        executed
      }
    }
  }
}
```

### 4. Filter with Multiple Addresses

```graphql
query {
  delegateCallVouchers(
    filter: [
      {
        destination: {
          in: [
            "0x1234567890123456789012345678901234567890",
            "0x0987654321098765432109876543210987654321"
          ]
        }
      }
    ]
  ) {
    edges {
      node {
        index
        destination
        executed
      }
    }
  }
}
```

## Available Filters by Type

### Vouchers and Delegate Call Vouchers
- `destination`: Filter by the destination address
- `executed`: Filter by execution status

### Input Filter
```graphql
input InputFilter {
  indexLowerThan: Int    # Filter inputs with index lower than value
  indexGreaterThan: Int  # Filter inputs with index greater than value
  msgSender: String      # Filter by message sender address
  type: String          # Filter by input type ('inputbox' or 'espresso')
}
```

### Application Filter
```graphql
input AppFilter {
  indexLowerThan: Int    # Filter apps with index lower than value
  indexGreaterThan: Int  # Filter apps with index greater than value
  name: String          # Filter by application name
  address: String       # Filter by application address
}
```

## Best Practices

1. **Performance**: When using filters, try to be as specific as possible to improve query performance.
2. **Logical Operators**: Use `and` and `or` operators judiciously to create precise filter conditions.
3. **Address Format**: Always use the full 20-byte Ethereum address format starting with '0x'.
4. **Pagination**: Consider using filters in combination with pagination for better performance when dealing with large datasets. 