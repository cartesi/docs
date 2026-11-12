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
- sends inputs or deposits assets. See the [Inputs and portals](#inputs-and-portals) section.
- validates notices. See the [Outputs](#outputs) section.
- executes vouchers. See the [Outputs](#outputs) section.
- listens to voucher execution events. See the [Outputs](#outputs) section.
- checks if a voucher was executed. See the [Outputs](#outputs) section.
- uses inspect calls. See the [Inspect calls](#inspect-calls) section.
- queries inputs and outputs from the node. See the [Node queries](#node-queries) section.

:::note
If your application uses a high-level framework(ex. Deroll, Rollmelette etc.) for either backend or frontend, check if the framework has already implemented the changes described in this guide.
:::

### ERC-20 token deposit inputs

In SDK v1, ERC-20 token deposit inputs start with a 1-byte Boolean field which indicates whether the transfer was successful or not.

In SDK v2, the ERC-20 portal only accepts successful transfers: it reverts when the token's `transferFrom` fails. With this change, the success field would always be true, so it has been removed. The deposit payload is now the packed encoding of:

- `address token` (20 bytes)
- `address sender` (20 bytes)
- `uint256 amount` (32 bytes)
- `bytes execLayerData` (the rest of the payload)

Update your back-end to read the token address from the first byte of the payload. See [asset handling](../development/asset-handling.md#abi-encoding-for-deposits) for the payloads of all portals.

### Application address

In v1, the back-end learned the address of its application contract from an input sent through the `DAppAddressRelay` contract. v2 has no relay: the address is part of the metadata of every advance request, in the `app_contract` field. Remove the code that handles relay inputs and read `metadata.app_contract` instead.

### Ether withdrawal vouchers

In v1, Ether was withdrawn with a voucher to the application contract that called its `withdrawEther(address,uint256)` function. v2 application contracts have no such function. Emit a voucher whose destination is the recipient, whose `value` is the amount in wei, and whose payload is empty (`0x`). A voucher with a non-empty payload reverts when its destination has no code, as is the case for a user's wallet. See [withdrawing Ether](../development/asset-handling.md#withdrawing-ether).

### Inputs and portals

- **Input box.** Each v2 application is deployed with an input box, which its `getInputBox()` function returns. Send inputs to that input box, not to an address taken from a v1 deployment. Portals read the input box from the application, so deposits reach the right one automatically.
- **Portal names.** The token portals and their deposit functions were renamed. Use `Erc20Portal.depositErc20Tokens`, `Erc721Portal.depositErc721Token`, `Erc1155SinglePortal.depositSingleErc1155Token` and `Erc1155BatchPortal.depositBatchErc1155Token`. The function selectors changed, so calls encoded with the v1 names (for example `depositERC20Tokens`) revert. `EtherPortal.depositEther` is unchanged. The portal addresses also differ from v1: take them from the deployment of the contracts version your node uses (`cartesi address-book` in a local environment).

### Outputs

The application contract changed how outputs are validated and executed:

| v1 (`CartesiDApp`) | v2 (`Application`) |
| :--- | :--- |
| `executeVoucher(address,bytes,Proof)` | [`executeOutput(bytes output, OutputValidityProof proof)`](../api-reference/contracts/application.md#executeoutput) |
| `validateNotice(bytes,Proof)` | [`validateOutput(bytes output, OutputValidityProof proof)`](../api-reference/contracts/application.md#validateoutput) |
| `wasVoucherExecuted(uint256 inputIndex, uint256 outputIndexWithinInput)` | [`wasOutputExecuted(uint256 outputIndex)`](../api-reference/contracts/application.md#wasoutputexecuted) |
| event `VoucherExecuted(uint256 voucherId)` | event [`OutputExecuted(uint64 indexed outputIndex, bytes output)`](../api-reference/contracts/application.md#outputexecuted) |

- `output` is the whole encoded output (voucher or notice) as returned by the node in the `raw_data` field, not just the destination and payload.
- Outputs are numbered per application, not per input. Build the proof from the node's output data: `outputIndex` is the output's `index` and `outputHashesSiblings` is its `output_hashes_siblings`.
- An output can be validated or executed only after the claim for its epoch has been accepted on-chain. v2 consensus contracts first stage a claim and accept it only after a claim staging period, fixed when the consensus is deployed, so check that the epoch status is `CLAIM_ACCEPTED` before you enable voucher execution in your front-end.
- If the application is foreclosed by its guardian, users can recover the deposits of inputs that were never finalized with the `issueRefund(inputIndex, input)` function of the application contract. See [emergency withdrawal](../development/emergency-withdrawal/overview.md).

### Inspect calls

Send inspect requests as HTTP `POST` requests to `/inspect/<application name or address>` on the node, with the payload as the request body. Other HTTP methods are rejected with `405 Method Not Allowed`. Inspect reports are returned only in the response: the node does not store them. See [making inspect calls](../development/send-inputs-and-assets.md#make-inspect-calls).

### Node queries

The v1 node served inputs, notices, vouchers and reports through a GraphQL API. The v2 node serves them through a [JSON-RPC API](../api-reference/jsonrpc/overview.md) with `cartesi_`-prefixed methods such as `cartesi_listInputs`, `cartesi_listOutputs` and `cartesi_getOutput`. Notices and vouchers are both returned as outputs. See [querying outputs](../development/query-outputs.md).
