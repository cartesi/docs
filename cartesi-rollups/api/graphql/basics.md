---
id: overview
title: Overview
---

# Overview

To query the state of a Cartesi Rollups instance, frontend clients can make use of a GraphQL API that is exposed by the Cartesi Nodes.

This API allows any client to retrieve outputs produced by a dApp's backend, and to link those outputs to the corresponding inputs that triggered them. Outputs can generally come in the form of vouchers, notices and reports, and allow clients to both receive dApp updates and enforce consequences on the base layer. 

The Cartesi Rollups state query API is fully specified by its GraphQL schema. 

This specification is displayed in a more accessible and navigable way in the next sections.


## Queries

A number of top-level queries are available in order to retrieve rollup information for a Cartesi dApp.

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

## Response format

As exemplified above, GraphQL query responses are given in JSON format. In practice, a query might result in some data and some errors, and as such the specification of the returned JSON object is actually of the following form:

```
{
  "data": { ... },
  "errors": [ ... ]
}
```


## GraphQL Playground

The [GraphQL Playground](https://github.com/graphql/graphql-playground) is a graphical, interactive, in-browser GraphQL IDE. It is a tool that can be used to explore the contents of a GraphQL server, and as such can be used to navigate the inputs and outputs of a Cartesi Rollups dApp.

For local development, the interactive playground is accessible at [http://localhost:8080/graphql](http://localhost:8080/graphql).


