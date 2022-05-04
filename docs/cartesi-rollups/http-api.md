---
id: http-api
title: HTTP API
---

In a Cartesi DApp, the front-end and back-end parts of the application [communicate with each other through the Rollups framework](../dapp-architecture#communication). This is accomplished in practice by using an HTTP API.

When designing the API for this communication with the framework, we wanted to ensure developers could create their applications without having to worry too much about the idiosyncrasies of blockchain technology or our rollups solution. In particular, we wanted to allow the back-end code to abstract away whether it was running inside a specific virtual machine or not.

With this in mind, we decided to offer an HTTP API as a convenience layer for this communication, leveraging a well-known and ubiquitous standard instead of having applications deal with any kernel-level or VM-specific devices, or having to understand how our rollups solution encodes and decodes data.

## Back-end API

The DApp's back-end interacts with the Cartesi Rollups framework by retrieving processing requests and then submitting corresponding outputs. This is accomplished by calling a number of HTTP endpoints, as illustrated by the figure below:

![img](./back-end-api.png)

First, the back-end retrieves a new request as follows:

* **Finish** — Communicates that any previous processing or initialization has been completed, and that the back-end is now ready to handle the next request. This next request is itself returned as the call's response, and can be of the following types:

  * **AdvanceState** — Provides an input to be processed by the back-end in order to advance the application's state. When processing an *AdvanceState* request, the back-end can call the methods *AddVoucher*, *AddNotice* and *AddReport*, as detailed below. For *AdvanceState* requests, the input data contains both the payload itself and also metadata such as the address of the account that submitted it.

  * **InspectState** — Submits a query about the application's current state. When running inside a Cartesi Machine, this operation is guaranteed to leave the state unchanged, since the machine is reverted to its exact previous condition after processing is completed. For *InspectState* requests, the input data contains only a payload.

As the back-end processes each request, it can access a set of HTTP endpoints provided by the Rollups framework to inform it of the computed results and consequences, as shown below:

* **AddVoucher** — Called to specify a collateral effect in the form of a transaction that can be carried out on layer-1 (e.g., a transfer of ERC-20 tokens). The back-end can only add new vouchers when processing an *AdvanceState* request.

* **AddNotice** — Provides information in a form that can be verified by any third-party on layer-1. This can be used to notify about a new relevant state of the application, such as updated player rankings. As vouchers, notices can only be added when processing an *AdvanceState* request.

* **AddReport** — Outputs arbitrary data in a non-provable form. This can be used to return results of *InspectState* calls, or to provide diagnostics and logs associated with the processing of any request.

As noted before, after each request is handled the back-end should always call *Finish* to notify that processing is complete, and retrieve as response the subsequent request to be processed. This call will also inform the request's final status as either "accept" or "reject". If an *AdvanceState* request is rejected, any vouchers and notices generated during its processing are discarded. On top of that, when the back-end is running inside a Cartesi Machine the Rollups framework will completely revert the machine to its previous state, so that rejected inputs have absolutely no effect on the application's subsequent behavior. Reports, on the other hand, are not discarded when a request is rejected, and can still be used for logging purposes.

Finally, it should be noted that the HTTP API also provides a *RegisterException* endpoint to allow the DApp to inform that it has reached an unrecoverable state and cannot proceed with any further request processing. This effectively communicates that the DApp will no longer function, and as such represents the last method ever called by the back-end, which should not even expect the call to return.

:::note
The complete OpenAPI specification for these endpoints can be found in **[Cartesi’s public Github repository](https://github.com/cartesi/openapi-interfaces/blob/master/rollup.yaml)**.
:::

## Front-end API

The front-end part of the DApp needs to access the Cartesi Rollups framework to submit user requests and retrieve the corresponding outputs produced by the back-end. The following figure and table detail how this communication is done:

![img](./front-end-api.png)

* **AddInput** — Submits input data to the [Rollups smart contracts](https://github.com/cartesi/rollups/blob/main/onchain/rollups/contracts/interfaces/IInput.sol#L22) on layer-1 as a regular [JSON-RPC blockchain transaction](https://ethereum.org/en/developers/docs/apis/json-rpc/). When that transaction is mined and executed, an event is emitted containing the submitted input’s identifier (**Input ID**), which the front-end can later use to query associated outputs. In the future, there will also be support for sending inputs via an aggregator service.
* **QueryOutputs** — Submits a query to a layer-2 node to retrieve vouchers, notices and reports, as specified by the [Cartesi Rollups GraphQL schema](https://github.com/cartesi/rollups/blob/main/reader/src/graphql/typeDefs/typeDefs.graphql).
* **InspectState** — Submits a query to a layer-2 node to retrieve arbitrary DApp-specific application state. Note that this endpoint is not yet available at the time of writing.
* **ExecuteVoucher** — Submits a JSON-RPC blockchain transaction to request a given voucher to be executed by the [Rollups smart contracts](https://github.com/cartesi/rollups/blob/main/onchain/rollups/contracts/interfaces/IOutput.sol#L44) on layer-1. This is how a DApp’s results, such as a transfer of assets, can take effect on the underlying blockchain. It should be noted that the contracts will only actually execute the voucher if it has been finalized, meaning that its contents can no longer be disputed. Finalization is explained in more detail in the [Cartesi Rollups Components section](../components#epochs) and in the [Rollups On-Chain article](https://medium.com/cartesi/rollups-on-chain-d749744a9cb3).
