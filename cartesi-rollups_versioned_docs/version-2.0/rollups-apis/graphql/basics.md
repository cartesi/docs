---
id: overview
title: Overview
---

# GraphQL API Overview

The Cartesi Rollups GraphQL API provides a powerful interface for querying the state of a Cartesi Rollups instance. This API allows frontend clients to retrieve detailed information about inputs processed by the rollup and the outputs produced by the dApp's backend in response to these inputs.

The API primarily deals with four main types of entities:

1. [Inputs](./queries/inputs.md): Requests submitted to the application to advance its state.
2. [Notices](./queries/notices.md): Informational statements that can be validated in the base layer blockchain.
3. [Vouchers](./queries/vouchers.md): Representations of transactions that can be carried out on the base layer blockchain.
4. [Reports](./queries/reports.md): Application logs or diagnostic information.


Some key features of the GraphQL API include the ability to:

- Retrieve detailed information about individual inputs, notices, vouchers, and reports.
- List and paginate through collections of these entities.
- Access proof data for notices and vouchers, allowing for validation on the base layer.
- Filter and sort results based on various criteria.

## Basic Query Structure

GraphQL queries in the Cartesi Rollups API typically involve specifying:

1. The type of entity you're querying (input, notice, voucher, or report).
2. Any necessary arguments (e.g., index values, pagination parameters).
3. The fields you want to retrieve from the entity.

Here's a basic example of querying an input:

```graphql
query {
  input(index: 1) {
    index
    status
    timestamp
    msgSender
    payload
  }
}
```

## Pagination

The API uses cursor-based pagination for queries that return collections of entities (e.g., listing all notices). This is implemented through connection types (e.g.,[`InputConnection`](./objects/input-connection.md), [`NoticeConnection`](./objects/notice-connection.md)) that include `edges` and `pageInfo` fields.

Example of a paginated query:

```graphql
query {
  notices(first: 5, after: "cursor_value") {
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
```

## Response Format

API responses are in JSON format and typically have the following structure:

```json
{
  "data": {
    // Requested data here
  },
  "errors": [
    // Any errors encountered during query execution
  ]
}
```

## GraphQL Playground

You can use the GraphQL Playground, an interactive in-browser IDE, to test and explore the API. For local development, it's typically accessible at `http://localhost:8080/graphql`.


