---
id: reading-outputs
title: Reading outputs
tags: [learn, rollups, dapps, low-level developer, components]
---

In Cartesi Rollups, the outputs include:

* Vouchers 
* Notices
* Reports

Vouchers and Notices are intended for on-chain validation by making function calls to the `CartesiDApp` contract (which is effectively our output contract). We validate and execute Vouchers using the [`executeVoucher()`](./api/json-rpc/sol-output.md#executevoucher) function. We validate Notices using the [`validateNotice()`](./api/json-rpc/sol-output.md#validatenotice) function call. Conversely, Reports serve as stateless logs, providing read-only information without affecting the state. These outputs can be read through [GraphQL APIs](./api/graphql/basics.md) and the [Inspect DApp state REST API](./api/inspect/inspect.api.mdx) that the Cartesi Nodes expose.

![img](./outputs.png)


## Vouchers

The following Python code example shows how you can create and send a voucher payload containing both an Ethereum address and a payload to the Rollup Server's [/voucher](./api/rollup/add-voucher.api.mdx) endpoint:

```python
rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
voucher_payload = {
 "destination": "0x + <address of the contract where execution will take place>",
 "payload": "0x + <selector of the function> + <abi encode of parameters>"
}

#selector - first 4 bytes of the keccak hash of the method signature (method name with arguments):
selector = web3.Web3().keccak(b"mint(address,string)")[0:4]
#abi encode of parameters 
data = encode_abi(['address', 'string'], [receiver,string])

response = requests.post(rollup_server + "/voucher", json=voucher_payload))
assert(response.status_code == 200)
```

For example, for a user to withdraw ERC20 from the DApp in this specific Python example, you need to encode a call to "erc20Token.transfer(_user,amount)". In this case, the destination will correspond to the address of the ERC20 token contract, while the payload will correspond to the appropriate encoding of the function selector + parameters, as explained before:

```python
voucher_payload = {
  "destination": "0xTheTokenAddress"
  "payload": "0x + <selector of the function> + <abi encode of parameters>"
}
```

## Notices

The following Python code example shows how you can construct and send a notice payload containing a payload to the Rollup Server's [/notice](./api/rollup/add-notice.api.mdx) endpoint, enabling on-chain validation of specific events or conditions without requiring direct interaction with the DApp Rollup Contract:

```python
rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
notice_payload = {
 "payload": "<direct hex conversion of the data the DApp sends>"
}
response = requests.post(rollup_server + "/notice", json=notice_payload)
assert(response.status_code == 200)
```

## Reports

The following Python code example shows how to create and send a report payload containing a payload to the Rollup Server's [/report](./api/rollup/add-report.api.mdx) endpoint, facilitating the logging of read-only information and data for analysis without affecting the underlying system state:

```python
rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
report_payload = {
 "payload": "<direct hex conversion of the data the DApp sends>"
}
response = requests.post(rollup_server + "/report", json=report_payload)
assert(response.status_code == 200)
```
