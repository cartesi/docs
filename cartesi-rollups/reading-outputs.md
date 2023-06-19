---
id: reading-outputs
title: Reading outputs
tags: [learn, rollups, dapps, low-level developer, components]
---

In Cartesi Rollups, the outputs include:

* [Vouchers](../main-concepts#vouchers)
* [Notices](../main-concepts#notices)
* [Reports](../main-concepts#reports)

Vouchers and Notices are intended for on-chain validation by making function calls to the [CartesiDApp](./api/json-rpc/sol-output.md) contract (which is effectively our output contract). We validate and execute Vouchers using the [`executeVoucher()`](./api/json-rpc/sol-output.md#executevoucher) function. We validate Notices using the [`validateNotice()`](./api/json-rpc/sol-output.md#validatenotice) function call. Conversely, Reports serve as stateless logs, providing read-only information without affecting the state. 

Let's take a look at how a Cartesi DApp reads Notices. We can send an input to the DApp using [Cast](https://book.getfoundry.sh/cast/):

```bash
cast send 0xInputBoxAddress123 "addInput(address,bytes)" 0xDAppAddress456 0xEncodedPayload789
```

On the back-end, the following example code creates and sends a notice payload containing a payload to the Rollup Server's [/notice](./api/rollup/add-notice.api.mdx) endpoint, enabling on-chain validation of specific events or conditions without requiring direct interaction with the DApp Rollup Contract:

```python
def handle_advance(data):
    logger.info(f"Received advance request data {data}")
    logger.info("Adding notice")
    notice = {"payload": data["payload"]}
    response = requests.post(rollup_server + "/notice", json=notice)
    logger.info(f"Received notice status {response.status_code} body {response.content}")
    return "accept"
```

These outputs can then be read through [GraphQL APIs](./api/graphql/basics.md) and the [Inspect DApp state REST API](./api/inspect/inspect.api.mdx) that the Cartesi Nodes expose.

![img](./outputs.png)
