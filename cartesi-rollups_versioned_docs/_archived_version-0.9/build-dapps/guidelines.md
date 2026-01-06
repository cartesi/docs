---
id: guidelines
title: Performance recommendations
tags: [build, dapps, developer]
---

The Cartesi Rollups framework offers a plethora of possibilities for developing dApps, giving you the freedom to choose the technologies and stacks that align with your goals. Nonetheless, it is essential to consider certain recommendations to ensure that the dApps work seamlessly, given the current state of the Cartesi Rollups framework.

This article explains common practices for developing dApps using the Cartesi Rollups framework to ensure better performance and reliability.

## Summary of a Cartesi dApp's architecture

:::tip
Please, check the [dApp architecture](../dapp-architecture.md) article to explore more essential topics such as the [back-end](../dapp-architecture.md#back-end) and [front-end](../dapp-architecture.md#front-end) components, and the [communication](../dapp-architecture.md#communication) between them.
:::

Cartesi dApps communicate between the front-end and back-end using the Rollups framework via a [set of HTTP APIs](..//http-api.md). The Cartesi dApp back-end contains the application's business logic and executes within the Cartesi Rollups framework. The back-end produces outputs in the form of [vouchers](../components.md#vouchers), [notices](../components.md#notices), or [reports](../components.md#reports), which provide vital information about the application's status. The Cartesi dApp front-end is responsible for presenting information and collecting user inputs. The front-end communicates with the back-end via APIs, and Cartesi provides a range of APIs that you can use to interact with the Rollups framework.

When it comes to dApp architecture and APIs, several points are important to highlight:

- The [Cartesi Machine](/machine/intro) serves as the back-end for the dApp, and it is managed by a [Cartesi Node](../components.md#cartesi-nodes), providing a secure and efficient environment for running the dApp
- All inputs are sent to the L1 smart contracts
- You can query the Rollups state using a [GraphQL API](../api/graphql/basics.md). This state includes the received inputs and the associated outputs produced in the form of notices, vouchers and reports
- You can retrieve arbitrary application state via the [Inspect HTTP API](../api/inspect/inspect.api.mdx). It allows you to implement a REST-like API on the back-end of your dApp to return arbitrary information about it, much like what web2 applications are used to

## General recommendations

Optimizing performance is crucial to ensure your application runs smoothly and meets user requirements when you develop dApps.

Here are some recommendations to follow to optimize dApp performance:

### Choose a programming language

Interpreted languages such as JavaScript/TypeScript, Python, and Lua are ideal for rapidly prototyping dApps. However, keep in mind that they are less efficient than compiled languages like C++ or Rust.

If performance is a critical concern for your dApp, consider implementing the back-end in a compiled language such as C++ or Rust. These languages often have better security and stability features, making them the preferred choice for production-level Cartesi dApps.

### Understand Cartesi Machine limitations

The Cartesi Machine is a deterministic RISC-V emulator that runs software in an emulated environment. This means that software running inside it will not perform as well as running on the host machine using an x86 or ARM architecture. Expect performance to be at least 50x slower than bare metal.

## Recommendations to retrieve dApp information

The dApp front-end clients have two ways of retrieving information:

- [Inspect HTTP API](../api/inspect/inspect.api.mdx)
- [GraphQL API](../api/graphql/basics.md)

The **Inspect API** provides enhanced flexibility and aligns better with the conventions of modern web2 applications. Enabling the implementation of a REST-like API on the back-end allows for the retrieval of a variety of information about the dApp.

In contrast, the **GraphQL API** allows you to retrieve vouchers and notices, which can be leveraged to enforce consequences on the base layer, such as executing a voucher to withdraw assets. Additionally, it offers a standardized approach to retrieve information in the form of notices and reports. This aspect is particularly advantageous for generic clients, including the Cartesi Rollups Explorer, as well as the front-end console client, which is available in the [rollups-examples repository](https://github.com/cartesi/rollups-examples/tree/main/frontend-console).

### GraphQL Server

The GraphQL Server is the Cartesi Node component that processes GraphQL API requests, and it scales well, allowing thousands of requests to be processed per second.

### Inspect Server

The Inspect Server is the component that processes Inspect API requests. At its current stage, its implementation is very basic and it does not scale well. In order to answer an inspect request, it asks the back-end to stop processing new inputs so that it can process the inspect call. As a consequence, inspect requests are currently _serialized_ and processed one at a time. If too many inspect requests are received at the same time, they may start to get rejected by the server.

### Front-End Applications

Front-end applications, and in particular web apps, often expect very frequent updates to keep the user informed of the current application state. Web apps often either subscribe to status updates (e.g., via websockets), or send very frequent polling requests to the back-end (e.g., every 500 ms).

The Cartesi Rollups framework currently does not support any mechanism to subscribe to status updates (which is a strategy that does not scale well for the server).

### Recommendations for multiple simultaneous clients

As a developer, you need to consider the following points when implementing Cartesi dApps that can support a large number of simultaneous clients:

#### Inspect API requests

When you need to load the application, it is interesting to use the [Inspect API](../api/inspect/inspect.api.mdx) to retrieve the complete current state of the application.

For example, you can make Inspect API requests when the user opens a webpage in a web browser. However, it is recommended to avoid frequent calls to the Inspect API for updating the state, as this may impact the application's efficiency.

#### GraphQL API requests

When you need to regularly check for status updates, it is recommended to utilize the [GraphQL API](../api/graphql/basics.md) and poll it at intervals of around 500ms.

For example, the [Echo dApp Front-end](https://github.com/cartesi/rollups-examples/tree/main/frontend-echo) web application provides a practical example of how to implement a GraphQL API polling mechanism to check for new notices and keep the front-end updated. Also, Web modules such as the [Apollo Client](https://www.apollographql.com/apollo-client) enable you to easily configure a polling GraphQL query.

:::note
At the moment of writing this documentation, using GraphQL is the most efficient way to query for dApp state updates.
:::
