---
id: reading-outputs
title: Reading outputs
tags: [learn, rollups, dapps, low-level developer, components]
---

In Cartesi Rollups, the outputs include:

- [Vouchers](../main-concepts#vouchers)
- [Notices](../main-concepts#notices)
- [Reports](../main-concepts#reports)

Vouchers and Notices are intended for on-chain validation by making function calls to the [CartesiDApp](./api/json-rpc/sol-output.md) contract (which is effectively our output contract). We validate and execute Vouchers using the [`executeVoucher()`](./api/json-rpc/sol-output.md#executevoucher) function. We validate Notices using the [`validateNotice()`](./api/json-rpc/sol-output.md#validatenotice) function call. Conversely, Reports serve as stateless logs, providing read-only information without affecting the state.

Let's take a look at how a Cartesi dApp reads Notices. We can send an input to the dApp using [Cast](https://book.getfoundry.sh/cast/):

```bash
cast send 0xInputBoxAddress123 "addInput(address,bytes)" 0xDAppAddress456 0xEncodedPayload789
```

On the back-end, the following example code creates and sends a notice containing a payload to the Rollup Server's [/notice](./api/rollup/add-notice.api.mdx) endpoint, enabling on-chain validation of specific events or conditions without requiring direct interaction with the dApp Rollup Contract:

```python
notice = {"payload": "0xdeadbeef"}
requests.post(rollup_server + "/notice", json=notice)
```

These outputs can then be read through the [GraphQL API](./api/graphql/basics.md) that the Cartesi Nodes expose.

The following code shows an example of a Javascript client querying the notices of a dApp that is running in a local environment:

```javascript
const response = await fetch("http://localhost:4000/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: '{ "query": "{ notices { edges { node { payload } } } }" }',
});
const result = await response.json();
for (let edge of result.data.notices.edges) {
  let payload = edge.node.payload;
}
```
