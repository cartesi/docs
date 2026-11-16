---
id: migration-guide
title: Migration Guide
---

## Migrating from Cartesi Rollups v1.5.x to v2.0

Rollups node v2.0 changes how the node works internally and how application code interacts with it. Not every breaking change affects every application. Use the checklist below, then follow the matching sections.

This guide describes the current v2.0 release set: rollups-node `v2.0.0-alpha.14`, rollups-contracts `v3.0.0-alpha.10` and Cartesi CLI `2.0.0-alpha.42`.

### If the application backend

- Decodes ERC-20 deposit inputs. See [ERC-20 token deposit inputs](#erc-20-token-deposit-inputs).
- Handles `DAppAddressRelay` inputs. See [Application address](#application-address).
- Generates Ether withdrawal vouchers. See [Ether withdrawal vouchers](#ether-withdrawal-vouchers).
- Builds a Cartesi Machine image with `machine-emulator-tools`. See [Cartesi Machine image](#cartesi-machine-image).

### If the application frontend

- Sends inputs or deposits assets. See [Inputs and portals](#inputs-and-portals).
- Queries the node GraphQL API. See [JSON-RPC queries](#json-rpc-queries).
- Validates notices. See [Outputs](#outputs).
- Executes vouchers. See [Outputs](#outputs).
- Listens to voucher execution events. See [Execution event](#execution-event).
- Checks if a voucher was executed. See [Execution check](#execution-check).
- Uses inspect `GET /inspect/<payload>`. See [Inspect calls](#inspect-calls).
- Uses `@cartesi/wagmi`, `@cartesi/viem`, or another TypeScript client. See [TypeScript applications](#typescript-applications).

:::note High-level frameworks
If you use a framework such as Deroll, Python-Cartesi or Cartesapp (see [community tools](./community-tools.md)), check whether the version you use already implements these changes before rewriting backend or frontend code by hand. Deroll, for example, targets Rollups 2.0 in its `2.0.0-alpha` releases, while its 1.0.0 release targets Rollups 1.x.
:::

---

## ERC-20 token deposit inputs

In SDK v1, ERC-20 token deposit inputs start with a 1-byte Boolean field which indicates whether the transfer was successful or not:

| Field     | Type      | Size     | Description                              |
| :-------- | :-------- | :------- | :--------------------------------------- |
| `success` | `bool`    | 1 byte   | Whether the ERC-20 transfer succeeded    |
| `token`   | `address` | 20 bytes | Address of the ERC-20 token contract     |
| `sender`  | `address` | 20 bytes | Address of the depositor                 |
| `amount`  | `uint256` | 32 bytes | Amount of tokens deposited               |
| `data`    | `bytes`   | variable | Extra data passed by the depositor       |

In SDK v2, the ERC-20 portal only accepts successful transfers: it reverts when the token's `transferFrom` fails. Because `success` would always be `true`, it was removed. The deposit payload is the packed encoding of:

| Field    | Type      | Size     | Description                          |
| :------- | :-------- | :------- | :----------------------------------- |
| `token`  | `address` | 20 bytes | Address of the ERC-20 token contract |
| `sender` | `address` | 20 bytes | Address of the depositor             |
| `amount` | `uint256` | 32 bytes | Amount of tokens deposited           |
| `data`   | `bytes`   | variable | Extra data passed by the depositor   |

Update the back-end to stop reading or checking the leading `success` byte: the token address now starts at the first byte of the payload. See [asset handling](../development/asset-handling.md#abi-encoding-for-deposits) for the payloads of all portals.

Source: [`InputEncoding.sol`](https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.10/src/common/InputEncoding.sol) in rollups-contracts `v3.0.0-alpha.10`.

---

## Application address

In SDK v1, the back-end had no direct way to know its own on-chain address. `DAppAddressRelay` relayed it as an input. The back-end detected inputs from that contract and stored the payload. That address was required to build withdrawal vouchers: for Ether, as the voucher destination (`withdrawEther` on the application), and for ERC-721 and ERC-1155, as the `from` address in `safeTransferFrom` calls on the token contract. ERC-20 withdrawals call `transfer`, which does not need it.

```python
# v1 — detect and store the relayed application address
if msg_sender.lower() == dapp_relay_address.lower():
    rollup_address = payload
```

In SDK v2, `DAppAddressRelay` is removed. Every advance-state input includes the application address in its metadata, as `app_contract`:

```python
# v2 — read the application address from the input metadata (rollup HTTP API)
app_address = data["metadata"]["app_contract"]
```

The JavaScript and TypeScript templates use [`@cartesi/rollup`](../api-reference/backend/introduction.md), where the same value is the `appContract` field of the advance request.

Remove any handling of `DAppAddressRelay` inputs. Use the `app_contract` metadata whenever a voucher needs the application contract address.

---

## Ether withdrawal vouchers

In SDK v1, withdrawing Ether was a two-step process:

1. Relay the application address using `DAppAddressRelay`.
2. Emit a voucher that called `withdrawEther(address,uint256)` on the `CartesiDApp` contract, with destination set to the application itself.

```javascript
// v1 — Ether withdrawal voucher
const call = encodeFunctionData({
  abi: CartesiDAppAbi,
  functionName: "withdrawEther",
  args: [receiver, amount],
});

const voucher = {
  destination: applicationAddress,
  payload: call,
};
```

In SDK v2, `withdrawEther` is gone. A voucher carries a `value`, and the application contract calls `destination` forwarding that amount of Wei. To withdraw Ether:

- Set `destination` to the recipient.
- Leave `payload` empty. A voucher with a non-empty payload reverts when its destination has no code, as is the case for a user's wallet.
- Set `value` to the amount in Wei.

```javascript
// v2 — Ether withdrawal voucher with @cartesi/rollup
import { parseEther } from "viem";

rollup.emitVoucher({
  destination: receiver,
  value: parseEther("1"), // Wei, as a bigint
});
```

Through the rollup HTTP API (`POST /voucher`), send `payload` as `"0x"` and `value` as a `0x`-prefixed, 32-byte hex string.

See [withdrawing Ether](../development/asset-handling.md#withdrawing-ether) for examples in every template language, and the [Ether wallet tutorial](../tutorials/ether-wallet.md).

---

## Cartesi Machine image

The application still runs inside a Cartesi Machine. The guest-tools package that provides the rollup HTTP server was renamed and is versioned independently of the node.

| | v1.5 | v2.0 |
| :-- | :-- | :-- |
| Guest tools | `machine-emulator-tools` (typically `0.14.1`) | `machine-guest-tools` `0.18.0` |
| Typical base | Ubuntu Jammy RISC-V images | Ubuntu Noble RISC-V images |
| Node emulator | Emulator SDK 0.17.x | Emulator `0.22.0` (rollups-node `v2.0.0-alpha.14`) |

The machine snapshot (template hash) must match the hash registered with the application contract and the node. Rebuilding against a different emulator or guest-tools version produces a different hash.

### Building for SDK 2.0

Do not retrofit a v1.5 Dockerfile. Create a new project with Cartesi CLI `2.0.0-alpha.42` and the current application templates, which are the source of truth for the v2 image layout:

```shell
cartesi create my-dapp --template typescript
```

Then port the application logic into the new project and run `cartesi build`. See [creating an application](../development/creating-an-application.md).

The JavaScript and TypeScript templates no longer poll the rollup HTTP server: they use the [`@cartesi/rollup`](https://www.npmjs.com/package/@cartesi/rollup/v/1.0.0-alpha.3) package, which talks to the Cartesi Machine directly.

---

## Inputs and portals

- **Input box.** Each v2 application is deployed with an input box, which its `getInputBox()` function returns. Send inputs to that input box, not to an address taken from a v1 deployment. Portals read the input box from the application, so deposits reach the right one automatically.
- **Portal names.** The token portals and their deposit functions were renamed. Use `Erc20Portal.depositErc20Tokens`, `Erc721Portal.depositErc721Token`, `Erc1155SinglePortal.depositSingleErc1155Token` and `Erc1155BatchPortal.depositBatchErc1155Token`. The function selectors changed, so calls encoded with the v1 names (for example `depositERC20Tokens`) revert. `EtherPortal.depositEther` is unchanged.
- **Addresses.** The portal and input box addresses differ from v1. Take them from the deployment of the contracts version your node uses (`cartesi address-book` in a local environment).

---

## Outputs

In SDK v1, the only verifiable outputs were notices and vouchers. Each type lived in a separate buffer inside the machine and in a separate Merkle tree in the proof. Adding or changing output types cascaded through the whole SDK.

In SDK v2, notices and vouchers share one buffer and one proof tree (**output unification**). An output is an arbitrary byte array encoded as a Solidity function call, so the type is the function selector. Any output can be validated, not only notices. A new executable type, the **DELEGATECALL voucher**, was added.

The `Application` contract API changed accordingly:

| Action | v1 (`CartesiDApp`) | v2 (`Application`) |
| :----- | :-- | :-- |
| Validate | `validateNotice(bytes notice, Proof proof)` | [`validateOutput(bytes output, OutputValidityProof proof)`](../api-reference/contracts/application.md#validateoutput) |
| Execute | `executeVoucher(address destination, bytes payload, Proof proof)` | [`executeOutput(bytes output, OutputValidityProof proof)`](../api-reference/contracts/application.md#executeoutput) |
| Execution check | `wasVoucherExecuted(uint256 inputIndex, uint256 outputIndex)` | [`wasOutputExecuted(uint256 outputIndex)`](../api-reference/contracts/application.md#wasoutputexecuted) |
| Execution event | `VoucherExecuted(uint256 voucherId)` | [`OutputExecuted(uint64 indexed outputIndex, bytes output)`](../api-reference/contracts/application.md#outputexecuted) |

An output can be validated or executed only after the claim for its epoch has been accepted on-chain. v2 consensus contracts first stage a claim and accept it only after a claim staging period, fixed when the consensus is deployed. Do not treat a voucher as executable until the epoch status is `CLAIM_ACCEPTED`: `CLAIM_SUBMITTED` and `CLAIM_STAGED` are not enough.

If the application is foreclosed by its guardian, users can recover the deposits of inputs that were never finalized with the `issueRefund(inputIndex, input)` function of the application contract. See [emergency withdrawal](../development/emergency-withdrawal/overview.md).

### Encoding

Outputs are ABI-encoded Solidity function calls. Supported signatures are in the [`Outputs` interface](https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.10/src/common/Outputs.sol). Decode them with any Ethereum ABI library (for example viem). Selectors:

| Selector | Kind | Encoded as |
| :------------ | :---------- | :-- |
| `0xc258d6e5`  | Notice | `Notice(bytes payload)` |
| `0x237a816f`  | Voucher (`CALL`) | `Voucher(address destination, uint256 value, bytes payload)` |
| `0x10321e8b`  | DelegateCall voucher | `DelegateCallVoucher(address destination, bytes payload)` |

The JSON-RPC `raw_data` field is this encoded blob. Pass the whole of it as `output` to `validateOutput` and `executeOutput`, not just the destination and payload.

The `value` field on a `CALL` voucher is the Wei forwarded with the call. It is also how Ether withdrawals work, and it can fund payable functions.

### Proofs

The proof type changed. Application code should use the proof the node returns with the output, not construct one.

SDK v1 used a nested `Proof` / `OutputValidityProof` with per-type epoch roots, input index within the epoch, and two sibling arrays:

```solidity
struct Proof {
    OutputValidityProof validity;
    bytes context;
}

struct OutputValidityProof {
    uint64 inputIndexWithinEpoch;
    uint64 outputIndexWithinInput;
    bytes32 outputHashesRootHash;
    bytes32 vouchersEpochRootHash;
    bytes32 noticesEpochRootHash;
    bytes32 machineStateHash;
    bytes32[] outputHashInOutputHashesSiblings;
    bytes32[] outputHashesInEpochSiblings;
}
```

SDK v2 uses a single, simpler structure. Outputs are numbered per application by a global, ever-increasing `outputIndex`; they are not keyed by input index:

```solidity
struct OutputValidityProof {
    uint64 outputIndex;
    bytes32[] outputHashesSiblings;
}
```

Build it from the node's output data: `outputIndex` is the output's `index` and `outputHashesSiblings` is its `output_hashes_siblings`.

### Validation

SDK v1 could validate only notices, and `validateNotice` returned `bool`:

```solidity
function validateNotice(
    bytes calldata notice,
    Proof calldata proof
) external view returns (bool success);
```

SDK v2 validates any output. `output` is the Solidity-encoded function call. There is no Boolean return: the call succeeds or it reverts.

```solidity
function validateOutput(
    bytes calldata output,
    OutputValidityProof calldata proof
) external view;
```

### Execution

SDK v1 executed only `CALL` vouchers and returned `bool`:

```solidity
function executeVoucher(
    address destination,
    bytes calldata payload,
    Proof calldata proof
) external returns (bool success);
```

SDK v2 executes `CALL` and `DELEGATECALL` vouchers through one function. Again, `output` is the encoded function call, and the call reverts on failure instead of returning `false`.

```solidity
function executeOutput(
    bytes calldata output,
    OutputValidityProof calldata proof
) external;
```

### Execution event

SDK v1 emitted `VoucherExecuted` with an opaque `voucherId` (input index packed with output index within that input):

```solidity
event VoucherExecuted(uint256 voucherId);
```

SDK v2 emits `OutputExecuted` with the global output index and the encoded output bytes:

```solidity
event OutputExecuted(uint64 indexed outputIndex, bytes output);
```

Update event listeners from `VoucherExecuted` to `OutputExecuted`. Index by `outputIndex`, not by `(inputIndex, outputIndexWithinInput)`.

### Execution check

SDK v1 required both the input index and the output index within that input:

```solidity
function wasVoucherExecuted(
    uint256 inputIndex,
    uint256 outputIndexWithinInput
) external view returns (bool executed);
```

SDK v2 only needs the output index:

```solidity
function wasOutputExecuted(
    uint256 outputIndex
) external view returns (bool);
```

---

## JSON-RPC queries

In SDK v1, inputs, notices, vouchers, and reports were queried through GraphQL at `<node>/graphql`.

```javascript
// v1 — query notices via GraphQL
const response = await fetch("http://localhost:8080/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: `{ notices { edges { node { index input { index } payload } } } }`,
  }),
});
```

In SDK v2, GraphQL is removed. Send JSON-RPC 2.0 requests with `POST` to the node's **`/rpc`** path (not the node root): `http://127.0.0.1:6751/rpc` with `cartesi run`, or port `10011` on a [self-hosted node](../deployment/self-hosted/standard.md#accessing-the-node). Parameters are named, in an object.

```javascript
// v2 — list outputs (notices and vouchers) via JSON-RPC
const response = await fetch("http://localhost:10011/rpc", {
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

```javascript
// v2 — get a specific output by index
await fetch("http://localhost:10011/rpc", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "cartesi_getOutput",
    params: { application: "0xYourAppAddress", output_index: "0x0" },
    id: 1,
  }),
});
```

Notices and vouchers are both returned as outputs. The node decodes each one into `decoded_data`, whose `type` field holds the kind of output by name:

| `decoded_data.type` | Output kind |
| :------------ | :---------- |
| `Notice`  | Notice |
| `Voucher`  | Voucher |
| `DelegateCallVoucher`  | DelegateCall voucher |

`raw_data` is the ABI-encoded output to pass to `executeOutput()` and `validateOutput()`.

Reports **are** on JSON-RPC (`cartesi_listReports`, `cartesi_getReport`). Inspect reports are different: they are returned only in the inspect response, and the node does not store them.

GraphQL → JSON-RPC map:

| v1 GraphQL | v2 JSON-RPC |
| :-- | :-- |
| `notices` / `vouchers` | `cartesi_listOutputs` / `cartesi_getOutput` |
| `reports` | `cartesi_listReports` / `cartesi_getReport` |
| `inputs` | `cartesi_listInputs` / `cartesi_getInput` |
| — | `cartesi_listApplications` / `cartesi_getApplication` |
| — | `cartesi_listEpochs` / `cartesi_getEpoch` / `cartesi_getLastAcceptedEpochIndex` |
| — | `cartesi_getChainId` / `cartesi_getNodeVersion` |

Contracts v3 add:

| Method | Use |
| :-- | :-- |
| `cartesi_listWithdrawals` / `cartesi_getWithdrawal` | Emergency withdrawals on the base layer after a foreclosure, **not** voucher withdrawals |
| `cartesi_listTournaments`, `cartesi_getTournament`, `cartesi_listMatches`, … | PRT (Dave) data |

`cartesi_getApplication` returns `enabled` (the operator's intent) and a [`status`](../api-reference/jsonrpc/types.md#application) such as `OK`, `FAILED`, `DIVERGED` or `CORRUPTED`. Foreclosure is not a status: a non-zero `foreclose_block` means the node observed the foreclosure.

Inputs are identified by `transaction_hash` and `log_index` (several `InputAdded` logs in one transaction are distinct inputs). `cartesi_listInputs` accepts a `transaction_hash` filter.

The node reads the base layer over HTTP only: it has no WebSocket endpoint setting.

Full method list: [JSON-RPC methods](../api-reference/jsonrpc/methods.md). See also [querying outputs](../development/query-outputs.md).

---

## Inspect calls

In SDK v1, inspect was an HTTP `GET` with the payload in the URL path:

```javascript
// v1 — inspect via GET
const response = await fetch(
  `http://localhost:8080/inspect/${encodeURIComponent(payload)}`
);
```

In SDK v2, inspect is an HTTP `POST` to `/inspect/<application-address-or-name>`, with the payload as the request body. The application must be in the path because one node can host several applications. Other HTTP methods are rejected with `405 Method Not Allowed`.

```javascript
// v2 — inspect via POST (port 10012 on a self-hosted node; http://127.0.0.1:6751/inspect/<app> with cartesi run)
const response = await fetch("http://localhost:10012/inspect/0xYourAppAddress", {
  method: "POST",
  headers: { "Content-Type": "application/octet-stream" },
  body: payload, // passed to the application as is
});
const result = await response.json();
```

The response holds the list of `reports` with hex payloads, a `status`, the `processed_input_count`, and, when the application raised an exception, `exception_data` and `error`. See the [inspect API specification](https://github.com/cartesi/rollups-node/blob/v2.0.0-alpha.14/api/openapi/inspect.yaml) of rollups-node `v2.0.0-alpha.14`.

Inspect reports are returned only in the response: the node does not store them. Inspect is served from a temporary machine fork and is synchronous. It returns **503** when the machine is not ready, when inspect capacity is exhausted, or when the application was **foreclosed** (`Application was foreclosed; machine unavailable`). The request body is limited to 2 MiB. See [making inspect calls](../development/send-inputs-and-assets.md#make-inspect-calls).

---

## TypeScript applications

v1.5 frontends typically called GraphQL directly, or used `@cartesi/viem` and `@cartesi/wagmi`. Those two packages are not updated for the v2.0 release set: their last releases target an earlier contracts release, so inputs and deposits sent with them go to addresses with no code on a current deployment.

Use the packages from [cartesi/rollups-ts](https://github.com/cartesi/rollups-ts/tree/37b2cb38228e08d4a87d2f1c1f63c91e57743cb4) instead. They wrap the node's JSON-RPC API, the input box, the portals and output execution.

| Role | v1.5 package | v2.0 package |
| :-- | :-- | :-- |
| viem client for the base layer and the node | `@cartesi/viem` | [`@cartesi/client@2.0.0-alpha.41`](https://github.com/cartesi/rollups-ts/tree/37b2cb38228e08d4a87d2f1c1f63c91e57743cb4/packages/client) |
| React / wagmi hooks | `@cartesi/wagmi` | [`@cartesi/react@2.0.0-alpha.45`](https://github.com/cartesi/rollups-ts/tree/37b2cb38228e08d4a87d2f1c1f63c91e57743cb4/packages/react) |

Install them with an explicit version: their `latest` tag on npm points to an empty `0.0.0` release. The [React frontend tutorial](../tutorials/react-frontend-application.md) shows both packages in use.
