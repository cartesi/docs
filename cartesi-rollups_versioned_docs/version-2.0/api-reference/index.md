---
id: http-api
title: Overview
resources:
  - url: https://github.com/cartesi/machine-emulator
    title: Off-chain implementation of the Cartesi Machine
  - url: https://github.com/cartesi/rollups-node
    title: Reference implementation of the Rollups Node
  - url: https://github.com/cartesi/rollups-contracts/tree/v1.4.0/onchain/rollups/contracts
    title: Smart Contracts for Cartesi Rollups
---

In a Cartesi dApp, the frontend and backend components communicate through the Rollups framework using HTTP and GraphQL APIs.

When designing the APIs for this communication framework, we aimed to ensure that developers could create their applications without excessive concern about the low-level components of Cartesi Rollups. 

## Backend APIs

In a typical Cartesi dApp, the backend contains the application's state and verifiable logic. The backend runs inside the Cartesi Machine as a regular Linux application. 

The dApp's backend interacts with the Cartesi Rollups framework by retrieving processing requests and submitting corresponding outputs.

This interaction occurs through a set of HTTP endpoints, as illustrated in the figure below:

![img](../../../static/img/v1.3/backend.jpg)

You can send two types of requests to an application depending on whether you want to change or read the state:

- **Advance**: With this request, input data changes the state of the dApp.

- **Inspect**: This involves making an external HTTP API call to the Cartesi Node to read the dApp state without modifying it.

## Base Layer Contracts

The frontend component of the dApp needs to access the Cartesi Rollups framework to submit user requests and retrieve the corresponding outputs produced by the backend.

The figure below illustrates the main use cases for these interactions:

![img](../../../static/img/v1.3/frontend.jpg)

- [`addInput()`](./contracts/input-box/#addinput) — This function submits input data to the InputBox smart contract on the base layer as a regular JSON-RPC blockchain transaction. When the transaction is mined and executed, it emits an event containing the submitted input's index, which the frontend can later use to query associated outputs.

- [`executeOutput()`](./contracts/application/#executeoutput) — Submits a JSON-RPC blockchain transaction to request the execution of a given voucher or notice by the [`Application`](./contracts/application.md) smart contract on the base layer. Vouchers can only be executed when an epoch is closed.

- Query outputs — You can submit a query to a Cartesi node to retrieve vouchers, notices, and reports as specified by the Cartesi Rollups GraphQL schema.

- Inspect state — You can make an HTTP call to the Cartesi node to retrieve arbitrary dApp-specific application state.


