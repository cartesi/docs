> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: introduction
title: Introduction
---

The backend of a Cartesi dApp processes requests in the following manner:

  - **Finish** — Called via [`/finish`](./finish.md), indicates that any previous processing has been completed and the backend is ready to handle the next request. The subsequent request is returned as the call's response and can be of the following types:

    - **Advance** — Provides input to be processed by the backend to advance the Cartesi Machine state. When processing an Advance request, the backend can call the [`/notice`](./notices.md), [`/voucher`](./vouchers.md), [`/delegate-call-voucher`](./vouchers.md#delegatecall-vouchers) and [`/report`](./reports.md) endpoints. For such requests, the input data contains both the payload and metadata, including the account address that submitted the input.

    - **Inspect** — Submits a query about the application's current state. When running inside a Cartesi Machine, this operation is guaranteed to leave the state unchanged, as the machine reverts to its exact previous condition after processing. For Inspect requests, the input data contains only a payload, and the backend can only call the [`/report`](./reports.md) and [`/exception`](./exception.md) endpoints.

  - **Exception** — Called by the backend when it encounters an unrecoverable error during request processing. This signals to the Rollup HTTP Server that the current request processing failed and should be terminated. See [`/exception`](./exception.md) for more details.

:::note JavaScript and TypeScript
The JavaScript and TypeScript templates do not use the Rollup HTTP Server. They use the [`@cartesi/rollup`](https://www.npmjs.com/package/@cartesi/rollup/v/1.0.0-alpha.3) package (version `1.0.0-alpha.3`), which makes the same calls directly to the Cartesi Machine: `rollup.finish()`, `rollup.emitNotice()`, `rollup.emitVoucher()`, `rollup.emitDelegateCallVoucher()`, `rollup.emitReport()` and `rollup.emitException()`. Request payloads arrive as Node.js `Buffer` objects, and advance requests carry their metadata as fields such as `msgSender`, `appContract` and `index`.
:::

## Advance and Inspect

Here is a simple boilerplate application that handles Advance and Inspect requests:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import RequestHandlingJS from '../../development/snippets/request_handling_js.md';
import RequestHandlingPY from '../../development/snippets/request_handling_py.md';
import RequestHandlingRS from '../../development/snippets/request_handling_rs.md';
import RequestHandlingGO from '../../development/snippets/request_handling_go.md';
import RequestHandlingCPP from '../../development/snippets/request_handling_cpp.md';

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

<RequestHandlingJS />

</code></pre>
</TabItem>

<TabItem value="Python" label="Python">
<pre><code>

<RequestHandlingPY />

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust">
<pre><code>

<RequestHandlingRS />

</code></pre>
</TabItem>

<TabItem value="Go" label="Go">
<pre><code>

<RequestHandlingGO />

</code></pre>
</TabItem>

<TabItem value="C++" label="C++">
<pre><code>

<RequestHandlingCPP />

</code></pre>
</TabItem>
</Tabs>

An **Advance** request starts as a transaction on the base layer: an input sent to the InputBox contract, which the node reads and passes to the dApp backend to change the application's state.

![img](../../../../static/img/v1.3/advance.jpg)

Here is how an advance request works in the dApp architecture:

- Step 1: Send an input to the [`addInput(address, bytes)`](../contracts/input-box.md#addinput) function of the InputBox smart contract.

- Step 2: The node reads the `InputAdded` event from the base layer and feeds the input to the application's Cartesi Machine. Inside the machine, the backend receives it as the response to its [`/finish`](./finish.md) call.

- Step 3: The backend processes the input and emits its outputs (notices, vouchers, reports). The node stores them and serves them through its [JSON-RPC API](../jsonrpc/overview.md).

An **Inspect** request is an HTTP call to the node's inspect endpoint, which runs the request on a temporary copy of the machine to read the dApp state without modifying it.

![img](../../../../static/img/v1.3/inspect.jpg)

You can make a simple inspect call from your frontend client to retrieve reports.

To perform an Inspect call, make an HTTP POST request to `<address of the node>/inspect/<application name>` with the payload as the request body. For example, with the local node started by `cartesi run`:

```shell
curl -X POST http://127.0.0.1:6751/inspect/<application name> \
    -d 'test'
```

The node passes the raw bytes of the request body to the backend, which receives them hex-encoded in the `payload` field of the inspect request (`0x74657374` for the body `test`). The node does not interpret the body or its content type, so do not wrap the payload in JSON.

After receiving the call's response, the payload is extracted from the response data, allowing the backend code to examine it and produce outputs as **reports**.

The direct output types for **Advance** requests are [vouchers](./vouchers.md), [notices](./notices.md), and [reports](./reports.md), while **Inspect** requests generate only [reports](./reports.md).
