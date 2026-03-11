---
id: migration-guide
title: Migration Guide
---

## Migrating from Cartesi Rollups v1.5.x to v2.0

Rollups node v2.0 introduces some major changes in how the node works internally and how the application code interacts with it. Not all the breaking changes affect all applications. To identify which changes might affect your application, check if any of the following cases apply:

### My back-end...
- handles ERC-20 token deposit inputs. See the [ERC-20 token deposit inputs](#erc-20-token-deposit-inputs) section.
- handles application address relay inputs. See the [Application address](#application-address) section.
- generates Ether withdrawal vouchers. See the [Ether withdrawal vouchers](#ether-withdrawal-vouchers) section.

### My front-end...
- validates notices. See the [Outputs](#outputs) section.
- executes vouchers. See the [Outputs](#outputs) section.
- listens to voucher execution events. See the [Outputs](#outputs) section.
- checks if a voucher was executed. See the [Outputs](#outputs) section.
- uses inspect calls. See the [Inspect calls](#inspect-calls) section.
- queries outputs. See the [JSON queries](#jsonrpc-queries) section.

:::note
If your application uses a high-level framework(ex. Deroll, Rollmelette etc.) for either backend or frontend, check if the framework has already implemented the changes described in this guide.
:::

### ERC-20 token deposit inputs

In SDK v1, ERC-20 token deposit inputs start with a 1-byte Boolean field which indicates whether the transfer was successful or not:

| Field     | Type      | Size     | Description                              |
| :-------- | :-------- | :------- | :--------------------------------------- |
| `success` | `bool`    | 1 byte   | Whether the ERC-20 transfer succeeded    |
| `token`   | `address` | 20 bytes | Address of the ERC-20 token contract     |
| `sender`  | `address` | 20 bytes | Address of the depositor                 |
| `amount`  | `uint256` | 32 bytes | Amount of tokens deposited               |
| `data`    | `bytes`   | variable | Extra data passed by the depositor       |

In SDK v2, the ERC-20 portal was modified to only accept successful transfers. Because the `success` field would always be `true`, it has been removed. The new deposit payload is:

| Field    | Type      | Size     | Description                          |
| :------- | :-------- | :------- | :----------------------------------- |
| `token`  | `address` | 20 bytes | Address of the ERC-20 token contract |
| `sender` | `address` | 20 bytes | Address of the depositor             |
| `amount` | `uint256` | 32 bytes | Amount of tokens deposited           |
| `data`   | `bytes`   | variable | Extra data passed by the depositor   |

Update your back-end to remove any logic that reads or checks the leading `success` byte when decoding ERC-20 deposit inputs.

### Application address

In SDK v1, the back-end had no direct way to know its own on-chain address. A special contract — `DAppAddressRelay` — was used to relay the application address as an input. The back-end would detect inputs coming from the `DAppAddressRelay` address and store the payload as its own address. This address was required, for example, to construct Ether or ERC-721 withdrawal vouchers.

```python
# v1 — detect and store the relayed application address
if msg_sender.lower() == dapp_relay_address.lower():
    rollup_address = payload
```

In SDK v2, the `DAppAddressRelay` contract has been removed. The application address is now available directly in the metadata of every advance-state input under the `app_contract` field:

```typescript
// v2 — read the application address from input metadata
const dAppAddress = data["metadata"]["app_contract"];
```

Update your back-end to remove any handling of `DAppAddressRelay` inputs and instead read the application address from `data["metadata"]["app_contract"]` whenever it is needed.

### Ether withdrawal vouchers

In SDK v1, withdrawing Ether required a two-step process:
1. Relay the application address using `DAppAddressRelay`.
2. Emit a voucher that called `withdrawEther(address,uint256)` on the `CartesiDApp` contract itself, with the destination set to the application's own address.

```typescript
// v1 — Ether withdrawal voucher
import { encodeFunctionData } from "viem";
import { CartesiDAppAbi } from "./abi/CartesiDAppAbi";

const call = encodeFunctionData({
  abi: CartesiDAppAbi,
  functionName: "withdrawEther",
  args: [receiver, amount],
});

const voucher = {
  destination: applicationAddress, // the dApp contract itself
  payload: call,
};
```

In SDK v2, the `withdrawEther` function on the application contract has been removed. Ether withdrawal vouchers now send Ether directly to the recipient by using the `value` field of the voucher. The application contract executes vouchers by making a `safeCall` to the destination, forwarding the specified `value`:

- Set `destination` to the recipient address.
- Set `payload` to `0x` (empty — no function call needed).
- Set `value` to the amount of Ether (in Wei) encoded as a 32-byte big-endian hex string.

```typescript
// v2 — Ether withdrawal voucher
import { numberToHex, parseEther, zeroHash } from "viem";

const voucher = {
  destination: receiver,       // the recipient address
  payload: zeroHash,           // empty payload
  value: numberToHex(BigInt(parseEther("1"))).slice(2), // amount in Wei as hex
};
```

Update your back-end to replace any `withdrawEther` vouchers with the new direct-transfer format shown above. Note that `value` should be a 32-character (64 hex digits) big-endian encoding of the Wei amount without the `0x` prefix.

### Outputs

In SDK v1, notices and vouchers were separate on-chain concepts, each with their own contract functions:

| Action | v1 function |
| :----- | :---------- |
| Validate a notice | `validateNotice(bytes notice, Proof proof)` |
| Execute a voucher | `executeVoucher(address destination, bytes payload, Proof proof)` |
| Check if a voucher was executed | `wasVoucherExecuted(uint256 inputIndex, uint256 outputIndex)` |
| Listen for execution | `event VoucherExecuted(uint256 voucherId)` |

In SDK v2, notices and vouchers are unified into a single **output** type. The `Application` contract exposes a single set of functions for all output kinds:

| Action | v2 function |
| :----- | :---------- |
| Validate a notice | `validateOutput(bytes output, OutputValidityProof proof)` |
| Execute a voucher | `executeOutput(bytes output, OutputValidityProof proof)` |
| Check if an output was executed | `wasOutputExecuted(uint256 outputIndex)` |
| Listen for execution | `event OutputExecuted(uint64 outputIndex, bytes output)` |

Update your front-end to:
- Replace all calls to `validateNotice()` with `validateOutput()`.
- Replace all calls to `executeVoucher()` with `executeOutput()`. The `output` argument is the ABI-encoded output bytes retrieved from the JSON-RPC node (see [JSON-RPC queries](#jsonrpc-queries)).
- Replace all calls to `wasVoucherExecuted()` with `wasOutputExecuted(uint256 outputIndex)`. Note the single `outputIndex` parameter instead of separate `inputIndex` and `outputIndex`.
- Update any event listeners from `VoucherExecuted` to `OutputExecuted`.

### JSON-RPC queries

In SDK v1, notices, vouchers, and reports were queried through a GraphQL API hosted at `<node>/graphql`:

```javascript
// v1 — query notices via GraphQL
const response = await fetch("http://localhost:8080/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: `{ notices { edges { node { index input { index } payload } } } }`,
  }),
});
const { data } = await response.json();
```

In SDK v2, the GraphQL API has been removed. Notices and vouchers are unified under a single **output** concept and are queried through a JSON-RPC API:

```javascript
// v2 — list outputs (notices + vouchers) via JSON-RPC
const response = await fetch("http://localhost:8080/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "cartesi_listOutputs",
    params: { application: "0xYourAppAddress", limit: 50, offset: 0 },
    id: 1,
  }),
});
const { result } = await response.json();
```

To fetch a single output by index, use `cartesi_getOutput`:

```javascript
// v2 — get a specific output by index
const response = await fetch("http://localhost:8080/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "cartesi_getOutput",
    params: { application: "0xYourAppAddress", output_index: "0x0" },
    id: 1,
  }),
});
const { result } = await response.json();
```

Each output in the response has a `decoded_data.type` field that identifies its kind:

| Type selector | Output kind |
| :------------ | :---------- |
| `0xc258d6e5`  | Notice |
| `0x237a816f`  | Voucher |
| `0x10321e8b`  | DelegateCall Voucher |

The `raw_data` field contains the ABI-encoded output bytes needed for `executeOutput()` and `validateOutput()` on the Application contract. Reports are stateless and are not returned by the JSON-RPC output endpoints; they are available from the inspect response only.

Update your front-end to replace all GraphQL queries with the equivalent JSON-RPC calls. Refer to the [JSON-RPC API reference](../api-reference/jsonrpc/methods/outputs/list.md) for the full list of available methods and parameters.

:::tip Using @cartesi/viem
Writing raw JSON-RPC calls can be verbose. Consider using the [`@cartesi/viem`](https://github.com/cartesi/viem) extension, which provides high-level TypeScript utilities for interacting with the JSON-RPC API. It simplifies querying outputs, executing vouchers, and validating notices with a more ergonomic API.

```typescript
// Using @cartesi/viem (simplified)
import { createPublicClient, http } from "viem";
import { getOutputs } from "@cartesi/viem";

const client = createPublicClient({ transport: http("http://localhost:8080") });
const outputs = await getOutputs(client, { app: "0xYourAppAddress", limit: 50 });
```
:::

### Inspect calls

In SDK v1, inspect calls were HTTP GET requests with the payload encoded in the URL path:

```javascript
// v1 — inspect via GET
const response = await fetch(`http://localhost:8080/inspect/${encodeURIComponent(payload)}`);
const result = await response.json();
```

In SDK v2, inspect calls are HTTP POST requests to `/inspect/<application-name-or-address>` with the payload in the JSON request body:

```javascript
// v2 — inspect via POST
const response = await fetch(
  `http://localhost:8080/inspect/0xYourAppAddress`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }
);
const result = await response.json();
```

The response format is the same — a list of reports with hex-encoded payloads. Update any inspect callers to use POST and place the payload in the request body rather than the URL.
