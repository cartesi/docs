# Overview

In order to query the state of a Cartesi Rollups instance, front-end clients can make use of a [GraphQL API](https://graphql.org/learn/) that is exposed by the [Cartesi Nodes](/cartesi-rollups/1.0/main-concepts/#cartesi-nodes).

Essentially, this API allows any client to retrieve outputs produced by a dApp's back-end, and to link those outputs to the corresponding inputs that triggered them. Outputs can generally come in the form of [vouchers](./objects/voucher.mdx), [notices](./objects/notice.mdx) and [reports](./objects/report.mdx), and allow clients to both receive dApp updates and enforce consequences on the base layer, such as asset transfers.

The Cartesi Rollups state query API is fully specified by its [GraphQL schema](https://github.com/cartesi/rollups/blob/main/offchain/graphql-server/schema.graphql). This specification is displayed in a more accessible and navigable way in the next sections.

## Queries

A number of [top-level queries](../queries) are available in order to retrieve rollup information for a Cartesi dApp.

In GraphQL, submitting a query involves defining parameters for filtering the entries to retrieve, and also specifying the data fields of interest, which can span any objects linked to the entry being retrieved.

For example, the following query retrieves the number of the base layer block in which the [input](./objects/input.mdx) was recorded:

```
input(index: "1") {
    blockNumber
  }
```

You can submit the query above as an HTTP POST request, specifying the Content-Type as `application/json`. For instance, using `curl` you could submit it as follows:

```
curl 'https://<graphql_url>' -H 'Content-Type: application/json' -d '{"query":"{ input(index:1) {blockNumber} }"}'
```

The response of which would be something like this:

```
{
  "data": {
    "input": {
      "blockNumber": 8629116
    }
  }
}
```

You can also retrieve linked information from the input. For example, the following query would retrieve notices from this particular input with support for pagination and with total number of entries that match the query:

```
input(index: "1") {
    notices {
      totalCount
    }
  }
```

The response of which would be something like this:

```
{
  "data": {
    "input": {
      "notices": {
        "totalCount": 6
      }
    }
  }
}
```

### Response format

As exemplified above, GraphQL query responses are given in JSON format. In practice, a query might result in some data and some errors, and as such the specification of the returned JSON object is actually of the following form:

```
{
  "data": { ... },
  "errors": [ ... ]
}
```

### More information

- Read the article [Queries and Mutations](https://graphql.org/learn/queries/) to learn in detail about how to query a GraphQL server
- Read the article [Schemas and Types](https://graphql.org/learn/schema/) to learn all you need to know about the GraphQL type system and how it describes what data can be queried
- Check the [GraphQL spec](https://spec.graphql.org/October2021/) for the full specification of GraphQL
- Check the implemented [GraphQL Cursor Connections Specification](https://relay.dev/graphql/connections.htm)

## GraphQL Playground

The [GraphQL Playground](https://github.com/graphql/graphql-playground) is a graphical, interactive, in-browser GraphQL IDE. It is a tool that can be used to explore the contents of a GraphQL server, and as such can be used to navigate the inputs and outputs of a Cartesi Rollups dApp.

For local development, the interactive playground is accessible at [http://localhost:4000/graphql](http://localhost:4000/graphql).

:::note
You can check the list of deployed dApps with the associated GraphQL endpoint URLs by navigating to the section [Explore our dApps](../../build-dapps/run-dapp.md#explore-our-dapps).
:::
