# Overview

In order to query the state of a Cartesi Rollups instance, front-end clients can make use of a [GraphQL API](https://graphql.org/learn/) that is exposed by the [Cartesi Nodes](../../components.md#cartesi-nodes).

Essentially, this API allows any client to retrieve outputs produced by a dApp's back-end, and to link those outputs to the corresponding inputs that triggered them. Outputs can generally come in the form of [vouchers](./objects/voucher.mdx), [notices](./objects/notice.mdx) and [reports](./objects/report.mdx), and allow clients to both receive dApp updates and enforce consequences on the base layer, such as asset transfers.

The Cartesi Rollups state query API is fully specified by its [GraphQL schema](https://github.com/cartesi/rollups/blob/main/offchain/data/graphql/typeDefs.graphql). This specification is displayed in a more accessible and navigable way in the next sections.

## Queries

A number of [top-level queries](../queries) are available in order to retrieve rollup information for a Cartesi dApp.

In GraphQL, submitting a query involves defining parameters for filtering the entries to retrieve, and also specifying the data fields of interest, which can span any objects linked to the entry being retrieved.

As an example, to retrieve a specific [epoch](./objects/epoch.mdx) given its index, one could specify the following query:

```
{
  epochI(
    index: 0
  ) {
    id
  }
}
```

This query can be submitted as an HTTP POST request, specifying the Content-Type as `application/json`. For instance, using `curl` you could submit it as follows:

```
curl 'https://<graphql_url>' -H 'Content-Type: application/json' -d '{"query":"{ epochI(index:0) {id} }"}'
```

The response of which would be something like this:

```
{
  "data": {
    "epochI": {
      "id": "1"
    }
  }
}
```

In this simple example, only the epoch's identifier is retrieved. However, linked information from the epoch's inputs can be retrieved as well. For example, the following query would retrieve the identifiers and timestamps of each input submitted for that epoch:

```
{
  epochI(
    index: 0
  ) {
    inputs {
      nodes {
        id
        timestamp
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

Please refer to the [GraphQL spec](https://spec.graphql.org/October2021/) for the full specification of GraphQL.

Aside from that, the article [Queries and Mutations](https://graphql.org/learn/queries/) can be useful to learn in detail about how to query a GraphQL server.
Finally, you may also read the article [Schemas and Types](https://graphql.org/learn/schema/) to learn all you need to know about the GraphQL type system and how it describes what data can be queried.

## GraphQL Playground

The [GraphQL Playground](https://github.com/graphql/graphql-playground) is a graphical, interactive, in-browser GraphQL IDE. It is a tool that can be used to explore the contents of a GraphQL server, and as such can be used to navigate the inputs and outputs of a Cartesi Rollups dApp.

For local development, the interactive playground is accessible at [http://localhost:4000/graphql](http://localhost:4000/graphql).

:::note
You can check the list of deployed dApps with the associated GraphQL endpoint URLs by navigating to the section [Explore our dApps](../../build-dapps/run-dapp.md#explore-our-dapps).
:::
