---
id: from-08-to-09
title: Breaking Changes v0.9
tags: [learn, rollups, dapps, low-level developer]
---

This guide is designed to highlight the key distinctions between v0.8 and v0.9, offering assistance to those transitioning an existing application or individuals already acquainted with v0.8 who require a concise overview.

## Front-end

### Inputs

v0.9 makes use of a single [InputBox](../api/json-rpc/sol-input.md#inputbox) contract to receive inputs from users or other contracts (instead of each dApp having its independent entrypoint to receive inputs). The InputBox is a trustless and permissionless smart contract that keeps append-only lists for the inputs for each dApp, ensuring data availability by emitting [InputAdded](../api/json-rpc/sol-input.md#inputadded) events for every successful input addition, allowing for encoding-agnostic and decentralized access to input data.

### Deposits

#### ERC20

v0.9 makes use of the new [depositERC20Tokens](../api/json-rpc/portals/ERC20Portal.md#depositerc20tokens) function on the ERC20Portal contract, which replaces calling `erc20Deposit` on the dApp contract. The `depositERC20Tokens` function:

- Transfers the specified `_amount` of `_token` (ERC-20) from the message sender's account to the `_dapp` address.
- Encodes the transaction information (success status, token, sender, amount, and execution layer data) into an input.
- Adds the encoded input to the dApp's [InputBox](../api/json-rpc/sol-input.md#inputbox), enabling the off-chain execution layer to access and process the transaction information.

#### ERC721

v0.9 makes use of the new [depositERC721Token](../api/json-rpc/portals/ERC721Portal.md#depositerc721token) function on the ERC721Portal contract, which replaces calling `safeTransfer` on the appropriate ERC-721 contract. The `depositERC721Token` function:

- Transfers the specified ERC-721 `_token` with `_tokenId` from the message sender's account to the `_dapp` address, providing `_baseLayerData` for the transfer.
- Encodes the transaction information (token, sender, tokenId, base layer data, and execution layer data) into an input.
- Adds the encoded input to the dApp's [InputBox](../api/json-rpc/sol-input.md#inputbox).

#### Ether

v0.9 makes use of the new [depositEther](../api/json-rpc/portals/EtherPortal.md#depositether) function on the EtherPortal, which replaces calling `etherDeposit` on the dApp contract. The new function:

- Transfers the Ether sent along with the function call (`msg.value`) from the message sender's account to the `_dapp` address.
- Encodes the transaction information (sender, Ether value, and execution layer data) into an input.
- Adds the encoded input to the dApp's [InputBox](../api/json-rpc/sol-input.md#inputbox), enabling the off-chain execution layer to access and process the transaction information.

#### ERC1155

v0.9 introduces support for ERC-1155 assets, with two new methods:

- [depositSingleERC1155Token](../api/json-rpc/portals/ERC1155SinglePortal.md#depositsingleerc1155token) function on the ERC1155SinglePortal, which transfers a specified amount of an ERC-1155 token with a given ID to a dApp, while also adding an input to the dApp's [InputBox](../api/json-rpc/sol-input.md#inputbox) to signal the operation.

- [depositBatchERC1155Token](../api/json-rpc/portals/ERC1155BatchPortal.md#depositbatcherc1155token) function on the ERC1155BatchPortal, which transfers a batch of ERC-1155 tokens with specified IDs and amounts to a dApp, while also adding an input to the dApp's [InputBox](../api/json-rpc/sol-input.md#inputbox) to signal the operation.

### GraphQL API

#### Epochs

All [Epoch objects](../../../cartesi-rollups_versioned_docs/version-0.8/api/graphql/objects/epoch.mdx) have been removed. This includes:

- `EpochConnection`
- `EpochEdge`
- `Epoch`

All [Epoch queries](../../../cartesi-rollups_versioned_docs/version-0.8/api/graphql/queries/epoch.mdx) have been removed. This includes:

- `epochI`
- `epoch`
- `epochs`

#### Identifiers

Removal of Epochs from the API makes all [input indices](../api/graphql/objects/input.mdx#index-int) global. This means that you can directly retrieve a specific input as a [top-level query](../api/graphql/queries/input.mdx), just by specifying its index.

ID fields have also been removed from all objects, and now only numeric indices are used in queries for retrieving inputs and outputs.

#### InputFilter

It is now possible to filter inputs in the top-level [inputs](../api/graphql/queries/inputs.mdx) query by specifying the `indexLowerThan` or `indexGreaterThan` fields of the [InputFilter](../api/graphql/inputs/input-filter.mdx) object.

#### Proof

The internal structure of the [Proof](../api/json-rpc/sol-output.md#proof) object has changed.

These changes should not affect clients using Proof objects to call [executeVoucher](../api/json-rpc/sol-output.md#executevoucher) and [validateNotice](../api/json-rpc/sol-output.md#validatenotice) functions, as long as the code does not inspect or manipulate the Proof object's internal fields.

## Back-end

### Handling deposits

In v0.8 `TRANSFER_HEADERs` were used to identify transfers that were coming from the Portal. When the dApp received a transaction, it would check if the header of the transaction matched the `TRANSFER_HEADER`. If the headers matched, the dApp would know that the transaction is a valid transfer from the Portal. If they didn't match, the transaction would be rejected.

In v0.9 Portals are identified by checking if the `msg_sender` metadata field of the input matches the appropriate Portal address. Naturally, the addresses of the relevant Portals in the base layer must be known a priori by the back-end code.

### Emitting withdrawal vouchers

Vouchers allow dApps in the execution layer to interact with base layer contracts through message calls, and they can be used for various applications such as withdrawing funds. In v0.9 the emission of withdrawal vouchers changed for Ether, and support for ERC-1155 assets was added.

#### Ether

The new function [withdrawEther](../api/json-rpc/sol-output.md#withdrawether) replaces `etherWithdrawal`, and is still called on the dApp contract to transfer a specified amount of Ether, in Wei, to a designated recipient. The new `withdrawEther` function now directly receives the receiver address and the amount to transfer, instead of an ABI-encoded payload containing that information.
The `withdrawEther` function can only be invoked by the dApp itself through vouchers, ensuring that the transfer is limited to internal use. It checks whether the Ether was successfully sent, and raises an error if the transfer fails.

#### ERC-1155

To emit withdrawal vouchers for ERC-1155 tokens, you need to encode a call to either `safeTransferFrom` (for single tokens) or `safeBatchTransferFrom` (for multiple tokens) on the appropriate ERC-1155 contract on the base layer.
Please refer to the [Assets handling](../assets-handling.md) section for general information about emitting withdrawal vouchers.

### No more Setup Input

In v0.8 most dApps needed to know their own address on the base layer, and a mandatory "Setup Input" was always added as the very first input for every dApp. As such, the back-end code had to _always_ be prepared to handle this very first input, from which it could safely capture its `msg_sender` metadata as the dApp's contract address.

In v0.9, the dApp's address is needed only for more specific cases, and there is no longer this mandatory "Setup Input" as the very first input a dApp always receives. Instead, a special contract - [`DAppAddressRelay`](../api/json-rpc/relays/DAppAddressRelay.md) - is introduced that allows anyone, at any time, to call it to safely _relay_ the dApp's address as an input to be received and handled by the back-end code.

If a dApp needs to know its own address (which is required for withdrawing Ether and ERC-721 tokens), its back-end will need to handle the input sent by `DAppAddressRelay` with the dApp address as payload. In this case, the back-end should know a priori the address of the `DAppAddressRelay` contract on the base layer, and then check the `msg_sender` metadata of the input to safely accept its payload as the trusted dApp's address.

The significant advantage of `dAppAddressRelay` is its optional engagement; you only need to call it if you actually need it. For instance, a straightforward dApp like [Echo Python](https://github.com/cartesi/rollups-examples/tree/main/echo-python) doesn't need to concern itself with this. Another advantage is that anyone can resend that input at any time, refreshing the back-end's memory. Even if there's an update that changes the dApp's address, we can still notify the back-end about the change.
