> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: migration-guide
title: Migration Guide
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

## Migrating from Cartesi Rollups v1.5.x to v2.0

Rollups node v2.0 changes how the node works internally and how application code interacts with it. Not every breaking change affects every application. Use the checklist below, then follow the matching sections.

### If the application backend

- Decodes ERC-20 deposit inputs. See [ERC-20 token deposit inputs](#erc-20-token-deposit-inputs).
- Handles `DAppAddressRelay` inputs. See [Application address](#application-address).
- Generates Ether withdrawal vouchers. See [Ether withdrawal vouchers](#ether-withdrawal-vouchers).
- Builds a Cartesi Machine image with `machine-emulator-tools`. See [Cartesi Machine image](#cartesi-machine-image).

### If the application frontend

- Queries the node GraphQL API. See [JSON-RPC queries](#json-rpc-queries).
- Validates notices. See [Outputs](#outputs).
- Executes vouchers. See [Outputs](#outputs).
- Listens to voucher execution events. See [Outputs](#execution-event).
- Checks if a voucher was executed. See [Outputs](#execution-check).
- Uses inspect `GET /inspect/<payload>`. See [Inspect calls](#inspect-calls).
- Uses `@cartesi/wagmi`, `@cartesi/viem`, or another TypeScript client. See [TypeScript applications](#typescript-applications).

:::note High-level frameworks
If you use Deroll, python-cartesi, Cartesapp, or a similar framework, check whether it already implements these changes before rewriting backend or frontend code by hand.
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

In SDK v2, the ERC-20 portal only accepts successful transfers. Because `success` would always be `true`, it was removed. The deposit payload is:

| Field    | Type      | Size     | Description                          |
| :------- | :-------- | :------- | :----------------------------------- |
| `token`  | `address` | 20 bytes | Address of the ERC-20 token contract |
| `sender` | `address` | 20 bytes | Address of the depositor             |
| `amount` | `uint256` | 32 bytes | Amount of tokens deposited           |
| `data`   | `bytes`   | variable | Extra data passed by the depositor   |

Update the back-end to stop reading or checking the leading `success` byte. See [asset handling](../development/asset-handling.md#abi-encoding-for-deposits).

Sources: [rollups-contracts `InputEncoding`](https://github.com/cartesi/rollups-contracts/blob/main/contracts/common/InputEncoding.sol); [contracts.md](https://github.com/cartesi/rollups-contracts/blob/v2.0.1/docs/contracts.md).

---

## Application address

In SDK v1, the back-end had no direct way to know its own on-chain address. `DAppAddressRelay` relayed it as an input. The back-end detected inputs from that contract and stored the payload. That address was required to build withdrawal vouchers: for Ether, as the voucher destination (`withdrawEther` on the application), and for ERC-20, ERC-721, and ERC-1155 as the `from` / `sender` in calls such as `transferFrom` or `safeTransferFrom` on the token contract.

```python
# v1 — detect and store the relayed application address
if msg_sender.lower() == dapp_relay_address.lower():
    rollup_address = payload
```

In SDK v2, `DAppAddressRelay` is removed. Every advance-state input includes the application address in metadata as `app_contract`:

```javascript
// v2 — read the application address from input metadata
const dAppAddress = data["metadata"]["app_contract"];
```

Remove any handling of `DAppAddressRelay` inputs. Use `data.metadata.app_contract` whenever a voucher needs the application contract address.

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

In SDK v2, `withdrawEther` is gone. Ether withdrawal vouchers send wei directly: the application contract `safeCall`s `destination` with `value`.

- Set `destination` to the recipient.
- Set `payload` to empty (`zeroHash` / `0x`).
- Set `value` to the Wei amount as a 32-byte big-endian hex string **without** the `0x` prefix.

```javascript
// v2 — Ether withdrawal voucher
import { numberToHex, parseEther, zeroHash } from "viem";

const voucher = {
  destination: receiver,
  payload: zeroHash,
  value: numberToHex(BigInt(parseEther("1"))).slice(2),
};
```

See [asset handling](../development/asset-handling.md#withdrawing-tokens) and the [ether wallet tutorial](../tutorials/ether-wallet.md).

---

## Cartesi Machine image

The application still runs inside a Cartesi Machine. The guest-tools package that provides the rollup HTTP loop was renamed and versioned independently of the node.

| | v1.5 | v2.0 |
| :-- | :-- | :-- |
| Guest tools | `machine-emulator-tools` (typically `0.14.1`) | `machine-guest-tools` (typically `0.17.2`) |
| Typical base | Ubuntu Jammy RISC-V images | Ubuntu Noble RISC-V images |
| Node emulator | Emulator SDK 0.17.x | Emulator `v0.20.0` |

The machine snapshot (template hash) must match the hash registered with the application contract and the node. Rebuilding against a different emulator or guest-tools version produces a different hash.

### Building for SDK 2.0

Do not retrofit a v1.5 Dockerfile. Start the application from scratch with **Cartesi CLI 2.0** and the current application templates. Those templates are the source of truth for the v2 image layout.

```shell
cartesi create my-dapp --template javascript --branch prerelease/sdk-12
```

`--branch` selects a branch of [cartesi/application-templates](https://github.com/cartesi/application-templates/tree/prerelease/sdk-12). `prerelease/sdk-12` is the CLI 2.0 default. Then port application logic into the new project and run `cartesi build`.

---

## Outputs

In SDK v1, the only verifiable outputs were notices and vouchers. Each type lived in a separate buffer inside the machine and in a separate Merkle tree in the proof. Adding or changing output types cascaded through the whole SDK.

In SDK v2, notices and vouchers share one buffer and one proof tree (**output unification**). An output is an arbitrary byte array encoded as a Solidity function call, so the type is the function selector. Any output can be validated, not only notices. A new executable type, the **DELEGATECALL voucher**, was added.

The `Application` contract API changed accordingly. The following subsections match the [rollups-contracts v1→v2 wiki](https://github.com/cartesi/rollups-contracts/wiki/Migration-Guide-(v1%E2%86%92v2)#outputs).

| Action | v1 | v2 |
| :----- | :-- | :-- |
| Validate | `validateNotice(bytes notice, Proof proof)` | `validateOutput(bytes output, OutputValidityProof proof)` |
| Execute | `executeVoucher(address destination, bytes payload, Proof proof)` | `executeOutput(bytes output, OutputValidityProof proof)` |
| Execution check | `wasVoucherExecuted(uint256 inputIndex, uint256 outputIndex)` | `wasOutputExecuted(uint256 outputIndex)` |
| Execution event | `VoucherExecuted(uint256 voucherId)` | `OutputExecuted(uint64 outputIndex, bytes output)` |

On contracts v3, do not treat a voucher as executable until the epoch status is `CLAIM_ACCEPTED`. `CLAIM_SUBMITTED` and `CLAIM_STAGED` are not enough.

### Encoding

Outputs are ABI-encoded Solidity function calls. Supported signatures are on the [`Outputs` interface](https://github.com/cartesi/rollups-contracts/blob/v2.0.1/src/common/Outputs.sol). Decode them with any Ethereum ABI library (for example viem). Selectors:

| Selector | Kind | Encoded as |
| :------------ | :---------- | :-- |
| `0xc258d6e5`  | Notice | `Notice(bytes payload)` |
| `0x237a816f`  | Voucher (`CALL`) | `Voucher(address destination, uint256 value, bytes payload)` |
| `0x10321e8b`  | DelegateCall voucher | `DelegateCallVoucher(address destination, bytes payload)` |

The JSON-RPC `raw_data` field is this encoded blob. Pass it as `output` to `validateOutput` and `executeOutput`. `decoded_data.type` on the node is the same selector.

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

SDK v2 uses a single, simpler structure. Outputs are identified by a global, ever-increasing `outputIndex` (they are not keyed by input index):

```solidity
struct OutputValidityProof {
    uint64 outputIndex;
    bytes32[] outputHashesSiblings;
}
```

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
event OutputExecuted(uint64 outputIndex, bytes output);
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
) external view returns (bool executed);
```

---

## JSON-RPC queries

In SDK v1, notices, vouchers, and reports were queried through GraphQL at `<node>/graphql`.

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

In SDK v2, GraphQL is removed. POST JSON-RPC 2.0 to the node's **`/rpc`** path (not the node root). The host and port depend on how the node is exposed.

```javascript
// v2 — list outputs (notices + vouchers) via JSON-RPC
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

Each output has a `decoded_data.type` selector:

| Type selector | Output kind |
| :------------ | :---------- |
| `0xc258d6e5`  | Notice |
| `0x237a816f`  | Voucher |
| `0x10321e8b`  | DelegateCall Voucher |

`raw_data` is the ABI-encoded bytes for `executeOutput()` / `validateOutput()`.

Reports **are** on JSON-RPC (`cartesi_listReports`, `cartesi_getReport`). They are also returned inline on inspect responses.

GraphQL → JSON-RPC map:

| v1 GraphQL | v2 JSON-RPC |
| :-- | :-- |
| `notices` / `vouchers` | `cartesi_listOutputs` / `cartesi_getOutput` |
| `reports` | `cartesi_listReports` / `cartesi_getReport` |
| `inputs` | `cartesi_listInputs` / `cartesi_getInput` |
| — | `cartesi_listApplications` / `cartesi_getApplication` |
| — | `cartesi_listEpochs` / `cartesi_getEpoch` / `cartesi_getLastAcceptedEpochIndex` |
| — | `cartesi_getChainId` / `cartesi_getNodeVersion` |

On contracts v3, also:

| Method | Use |
| :-- | :-- |
| `cartesi_listWithdrawals` / `cartesi_getWithdrawal` | Emergency L1 withdrawals after foreclosure — **not** voucher withdrawals |
| `cartesi_listTournaments`, `cartesi_getTournament`, `cartesi_listMatches`, … | PRT / Dave data |

`cartesi_getApplication` on contracts v3 returns `enabled` plus `status` (`OK`, `FAILED`, `INOPERABLE` / `DIVERGED` / `CORRUPTED`, `FORECLOSED`). Do not read a single `state: ENABLED` field from older examples.

Inputs are identified by `transaction_hash` + `log_index` (multiple `InputAdded` logs in one L1 transaction are distinct). `cartesi_listInputs` accepts `transaction_hash`. There is no `transaction_reference`.

The node's EVM reader polls HTTP for new blocks. A WebSocket blockchain endpoint is no longer required for the reader.

Full method list: [JSON-RPC methods](../api-reference/jsonrpc/methods.md).

---

## Inspect calls

In SDK v1, inspect was an HTTP GET with the payload in the URL path:

```javascript
// v1 — inspect via GET
const response = await fetch(
  `http://localhost:8080/inspect/${encodeURIComponent(payload)}`
);
```

In SDK v2, inspect is HTTP POST to `/inspect/<application-address-or-name>` with the payload in the body. The application must be in the path because one node can host several apps.

```javascript
// v2 — inspect via POST
const response = await fetch(`http://localhost:10012/inspect/0xYourAppAddress`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
const result = await response.json();
```

The OpenAPI spec also accepts `application/octet-stream` for a binary body ([`api/openapi/inspect.yaml` on `next/2.0`](https://github.com/cartesi/rollups-node/blob/next/2.0/api/openapi/inspect.yaml)).

The response is still a list of reports with hex payloads, plus `status`, `exception_payload`, and `processed_input_count`.

Inspect is served from a temporary machine fork and is synchronous. It returns **503** when the machine is not ready, inspect capacity is exhausted, or the application was **foreclosed** (`Application was foreclosed; machine unavailable`). Request body size is limited.

---

## TypeScript applications

v1.5 frontends typically called GraphQL directly. v2 TypeScript clients should use the packages in [cartesi/rollups-ts](https://github.com/cartesi/rollups-ts/tree/prerelease/v2-alpha). They wrap the JSON-RPC node API, InputBox, and output execution.

| Role | Earlier name | Current package |
| :-- | :-- | :-- |
| JSON-RPC typed client | `@cartesi/rpc` | [`@cartesi/rpc`](https://github.com/cartesi/rollups-ts/tree/prerelease/v2-alpha/packages/rpc) |
| viem L1 / node helpers | `@cartesi/viem` | [`@cartesi/client`](https://github.com/cartesi/rollups-ts/tree/prerelease/v2-alpha/packages/client) |
| React / wagmi hooks | `@cartesi/wagmi` | [`@cartesi/react`](https://github.com/cartesi/rollups-ts/tree/prerelease/v2-alpha/packages/react) |
| Input/output codec | — | [`@cartesi/codec`](https://github.com/cartesi/rollups-ts/tree/prerelease/v2-alpha/packages/codec) |

Replace `@cartesi/viem` imports with `@cartesi/client` and `@cartesi/wagmi` with `@cartesi/react`.

