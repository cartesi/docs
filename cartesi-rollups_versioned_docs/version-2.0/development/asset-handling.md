---
id: asset-handling
title: Asset handling
resources:
  - url: https://www.udemy.com/course/cartesi-masterclass/
    title: The Cartesi dApp Developer Free Course
---

Assets exist on the base layer, where they have actual meaning and value.

As with any execution layer solution, a Cartesi Application that wants to manipulate assets needs a secure way of "teleporting" the assets from the base layer to the execution layer and when necessary, back to the base layer.

Currently, Cartesi Rollups support the following types of assets:

- [Ether (ETH)](../api-reference/contracts/portals/EtherPortal.md)
- [ERC-20](../api-reference/contracts/portals/ERC20Portal.md)
- [ERC-721](../api-reference/contracts/portals/ERC721Portal.md)
- [ERC-1155 Single](../api-reference/contracts/portals/ERC1155SinglePortal.md)
- [ERC-1155 Batch](../api-reference/contracts/portals/ERC1155BatchPortal.md)

![img](../../..//static/img/v2.0/onchain-contracts.jpg)

## Deposits

Portals enable the safe transfer of assets from the base layer to the execution layer. Users authorize portals to deduct assets from their accounts and initiate transfers to the Application contract.

When an asset is deposited, it is on the base layer but gains a representation in the execution layer. The corresponding Portal contract sends an input via the `InputBox` contract describing the type of asset, amount, and some data the depositor might want the application to read. The off-chain machine will then interpret and validate the input payload.

Deposit input payloads are always specified as packed ABI-encoded parameters, as detailed below.

![img](../../..//static/img/v2.0/deposit-payload.jpg)

### ABI encoding for deposits

| Asset             | Packed ABI-encoded payload fields                                                                                                                       | Standard ABI-encoded payload fields                                                                                              |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------- |
| Ether             | <ul><li>`address sender`,</li><li>`uint256 value`,</li><li>`bytes execLayerData`</li></ul>                                                              | none                                                                                                                             |
| ERC-20            | <ul><li>`address token`,</li><li>`address sender`,</li><li>`uint256 amount`,</li><li>`bytes execLayerData`</li></ul>                                    | none                                                                                                                             |
| ERC-721           | <ul><li>`address token`,</li><li>`address sender`,</li><li>`uint256 tokenId`,</li><li>standard ABI-encoded fields...</li></ul>                          | <ul><li>`bytes baseLayerData`,</li><li>`bytes execLayerData`</li></ul>                                                           |
| ERC-1155 (single) | <ul><li>`address token`,</li><li>`address sender`,</li><li>`uint256 tokenId`,</li><li>`uint256 value`,</li><li>standard ABI-encoded fields...</li></ul> | <ul><li>`bytes baseLayerData`,</li><li>`bytes execLayerData`</li></ul>                                                           |
| ERC-1155 (batch)  | <ul><li>`address token`,</li><li>`address sender`,</li><li>standard ABI-encoded fields...</li></ul>                                                     | <ul><li>`uint256[] tokenIds`,</li><li>`uint256[] values`,</li><li>`bytes baseLayerData`,</li><li>`bytes execLayerData`</li></ul> |

Refer to the functions provided below to understand how to handle asset deposits. When called inside your application's advance handler, these helpers decode the payload for the deposited asset type.

For example, to decode an ERC-20 deposit payload, you can use the following code snippets:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import AssetDecodeErc20JS from './snippets/asset_decode_erc20_js.md';
import AssetDecodeErc20PY from './snippets/asset_decode_erc20_py.md';
import AssetDecodeErc20RS from './snippets/asset_decode_erc20_rs.md';
import AssetDecodeErc20GO from './snippets/asset_decode_erc20_go.md';
import AssetDecodeErc20CPP from './snippets/asset_decode_erc20_cpp.md';
import AssetWithdrawErc20JS from './snippets/asset_withdraw_erc20_js.md';
import AssetWithdrawErc20PY from './snippets/asset_withdraw_erc20_py.md';
import AssetWithdrawErc20RS from './snippets/asset_withdraw_erc20_rs.md';
import AssetWithdrawErc20GO from './snippets/asset_withdraw_erc20_go.md';
import AssetWithdrawErc20CPP from './snippets/asset_withdraw_erc20_cpp.md';
import AssetWithdrawEtherJS from './snippets/asset_withdraw_ether_js.md';
import AssetWithdrawEtherPY from './snippets/asset_withdraw_ether_py.md';
import AssetWithdrawEtherRS from './snippets/asset_withdraw_ether_rs.md';
import AssetWithdrawEtherGO from './snippets/asset_withdraw_ether_go.md';
import AssetWithdrawEtherCPP from './snippets/asset_withdraw_ether_cpp.md';

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>
<AssetDecodeErc20JS />
</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>
<AssetDecodeErc20PY />
</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>
<AssetDecodeErc20RS />
</code></pre>
</TabItem>

<TabItem value="Go" label="Go" default>
<pre><code>

<AssetDecodeErc20GO />

</code></pre>
</TabItem>

<TabItem value="C++" label="C++" default>
<pre><code>

<AssetDecodeErc20CPP />

</code></pre>
</TabItem>

</Tabs>

For a full guide, see the Tutorials: [ERC-20 Token Wallet](../tutorials/erc-20-token-wallet.md) and [Utilizing test tokens in dev environment](../tutorials/Utilizing-test-tokens-in-dev-environment.md).

## Withdrawing assets

Users can deposit assets to a Cartesi Application, but only the Application can initiate withdrawals. When a withdrawal request is made, it’s processed and interpreted off-chain by the Cartesi Machine running the application’s code. Subsequently, the Cartesi Machine creates a voucher containing the necessary instructions for withdrawal, which is executable when an epoch has settled.

### Withdrawing Tokens

Vouchers are crucial in allowing applications in the execution layer to interact with contracts in the base layer through message calls. They are emitted by the off-chain machine and executed by any participant in the base layer. Each voucher includes a destination address and a payload, typically encoding a function call for Solidity contracts.

The application’s off-chain layer often requires knowledge of its address to facilitate on-chain interactions for withdrawals, for example: `transferFrom(sender, recipient, amount)`. In this case, the sender is the application itself.

Next, the off-chain machine uses the address of the application on the base layer to generate a voucher for execution at the executeOutput() function of the Application contract. This address is known to the offchain machine because it is embedded in the metadata of every input sent to the application, though the developer will need to implement extra logic fetch this address from the metadata then properly store and retrieve it when needed in situations like generating the above Voucher.

Below are multi-language examples showing how to transfer tokens to whoever calls the application. In each case, the encoded call data contains the token contract function and arguments (for example, recipient and amount). The voucher then includes a destination (the ERC-20 token contract), a payload (the encoded call data), and a value set to zero to indicate no Ether is sent with this transfer request.

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>
<AssetWithdrawErc20JS />
</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>
<AssetWithdrawErc20PY />
</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>
<AssetWithdrawErc20RS />
</code></pre>
</TabItem>

<TabItem value="Go" label="Go" default>
<pre><code>

<AssetWithdrawErc20GO />

</code></pre>
</TabItem>

<TabItem value="C++" label="C++" default>
<pre><code>

<AssetWithdrawErc20CPP />

</code></pre>
</TabItem>
</Tabs>

For a full guide, see the Tutorial: [ERC-20 Token Wallet](../tutorials/erc-20-token-wallet.md).

### Withdrawing Ether

To execute Ether withdrawal it is important to emit a voucher with the necessary details as regarding whom you intend to send the Ether to and also the amount to send, nevertheless since the Application contract Executes vouchers by making a [safeCall](https://github.com/cartesi/rollups-contracts/blob/cb52d00ededd2da9f8bf7757710301dccb7d536d/src/library/LibAddress.sol#L18C14-L18C22) to the destination, passing a value (Ether amount to send along with the call) and a payload (function signature to call), it's acceptable to leave the payload section empty if you do not intend to call any functions in the destination address while sending just the specified value of Ether to the destination address. If you intend to call a payable function and also send Ether along, you can add a function signature matching the payable function you intend to call to the payload field.

Below are multi-language examples for Ether withdrawal. Here, the voucher sends Ether directly to an address instead of calling a token contract function, so there is no encoded function call payload.

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>
<AssetWithdrawEtherJS />
</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>
<AssetWithdrawEtherPY />
</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>
<AssetWithdrawEtherRS />
</code></pre>
</TabItem>

<TabItem value="Go" label="Go" default>
<pre><code>

<AssetWithdrawEtherGO />

</code></pre>
</TabItem>

<TabItem value="C++" label="C++" default>
<pre><code>

<AssetWithdrawEtherCPP />

</code></pre>
</TabItem>

</Tabs>

For a full guide, see the Tutorial: [Ether Wallet](../tutorials/ether-wallet.md).

:::note epoch length
By default, Cartesi nodes close one epoch every 7200 blocks. You can manually set the epoch length to facilitate quicker asset-handling methods.
:::

Here are the function signatures used by vouchers to withdraw the different types of assets:

| Asset    | Destination    | Function signature                                                                                                                          |
| :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| Ether    | dApp contract  | `withdrawEther(address,uint256)` [:page_facing_up:](../api-reference/json-rpc/application.md/#withdrawether)                            |
| ERC-20   | Token contract | `transfer(address,uint256)` [:page_facing_up:](https://eips.ethereum.org/EIPS/eip-20#methods)                                               |
| ERC-20   | Token contract | `transferFrom(address,address,uint256)` [:page_facing_up:](https://eips.ethereum.org/EIPS/eip-20#methods)                                   |
| ERC-721  | Token contract | `safeTransferFrom(address,address,uint256)` [:page_facing_up:](https://eips.ethereum.org/EIPS/eip-721#specification)                        |
| ERC-721  | Token contract | `safeTransferFrom(address,address,uint256,bytes)` [:page_facing_up:](https://eips.ethereum.org/EIPS/eip-721#specification)                  |
| ERC-1155 | Token contract | `safeTransferFrom(address,address,uint256,uint256,data)` [:page_facing_up:](https://eips.ethereum.org/EIPS/eip-1155#specification)          |
| ERC-1155 | Token contract | `safeBatchTransferFrom(address,address,uint256[],uint256[],data)` [:page_facing_up:](https://eips.ethereum.org/EIPS/eip-1155#specification) |
