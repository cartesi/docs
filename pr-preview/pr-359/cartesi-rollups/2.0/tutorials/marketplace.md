> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: marketplace
title: Build a Marketplace Application
resources:
  - url: https://github.com/Mugen-Builders/Counter-X-Marketplace-apps/tree/3ea44735b2237366208f726e36a4660c55a41f1e
    title: Source code for the Marketplace Application
---

In this tutorial we'll be building a simple NFT Marketplace application, where users are able to deposit a unique token to be sold at a fixed price, then other users are able to purchase and withdraw these purchased tokens to their wallet.

This Tutorial is built using an Object oriented approach and aims to cover, application creation, Notice, Voucher and Report generation, we'll also be decoding and consuming the payload passed alongside advance and inspect requests.

## How the Marketplace Works

Before setting up the project, here is how the marketplace application works.
This tutorial uses an Object-Oriented approach. This means we will create a main Marketplace object that stores the application state and provides methods to update or retrieve that state. Then we'll build other handler functions that utilizes other helper functions to decode user requests then call the appropriate method to update the marketplace object.

For simplicity, our marketplace will support only:

- One specific ERC-721 (NFT) contract: This is the only collection users can list.

- One specific ERC-20 token: This is the token users will use to purchase NFTs.

### Advance Requests

**1. Depositing / Listing NFTs**

- A user sends an NFT to the Cartesi application through the ERC-721 Portal.
- When the application receives the deposit payload, it automatically lists the NFT for sale at a fixed price.
- The price is the same for every NFT in this tutorial to keep things simple.

**2. Depositing Payment Tokens**

- Users can then send the marketplace’s payment token to the application through the ERC-20 Portal.
- The application keeps track of how many tokens each user has deposited.

**3. Buying an NFT**

- When a user decides to buy an NFT listed on the marketplace, the application checks:
  - Is the NFT still listed?
  - Does the user have enough deposited tokens?

- If the transaction is valid, the marketplace transfers the payment token to the seller then creates a voucher that sends the purchased NFT to the buyer.

- If a check fails, the application emits a report with the reason and rejects the input.

### Inspect Requests

The Inspect route will support three simple read-only queries:

**1. `get_user_erc20_balance`**

**Description:** Shows how many tokens a user has stored in the marketplace.

**Input:** User's address

**Output:** Amount of ERC-20 tokens deposited.

**2. `get_token_owner`**

**Description:** Returns the current owner of a specific NFT.

**Input:** Token ID

**Output:** Address of current token owner. After a purchase the owner is the zero address: the NFT leaves the marketplace with the voucher.

**3. `get_all_listed_tokens`**

**Description:** Shows all NFTs currently listed for sale.

**Input:** (none)

**Output:** Array of Token IDs currently listed for sale.

## Set up your environment

You need the [Cartesi CLI](../development/installation.md) and Docker Desktop, plus the Rust toolchain (`cargo`) for the Rust version, which adds its dependencies on your machine before the build.

To create a template for your project, we run the below command, based on your language of choice:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

```shell
cartesi create marketplace --template javascript
```

</code></pre>
</TabItem>

<TabItem value="Python" label="Python">
<pre><code>

```shell
cartesi create marketplace --template python
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust">
<pre><code>

```shell
cartesi create marketplace --template rust
```

</code></pre>
</TabItem>

<TabItem value="Go" label="Go">
<pre><code>

```shell
cartesi create marketplace --template go
```

</code></pre>
</TabItem>

<TabItem value="C++" label="C++">
<pre><code>

```shell
cartesi create marketplace --template cpp
```

</code></pre>
</TabItem>
</Tabs>

## Install Project Dependencies

Since this project would be covering hex payload encoding and decoding, as well as Output (Voucher, Notice, Report) generation, it's important that we install the necessary dependencies to aid these processes.

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

```shell
pnpm add -D viem@2.57.19
```

```javascript
// rolldown.config.js
import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/index.js",
  platform: "node",
  // only the @cartesi/rollup native addon stays out of the bundle: viem and
  // any other pure JavaScript dependency are bundled into dist/index.mjs
  external: ["@cartesi/rollup"],
  output: {
    file: "dist/index.mjs",
    format: "esm",
  },
});
```

</code></pre>
</TabItem>

<TabItem value="Python" label="Python">
<pre><code>

```shell
cat > requirements.txt << 'EOF'
requests==2.32.5
eth-abi==5.2.0
eth-utils==5.3.1
regex==2025.11.3
pycryptodome==3.23.0
eth-hash==0.7.1
EOF
```

</code></pre>

`pycryptodome` (the keccak backend of `eth-utils`) and `regex` have no prebuilt riscv64 wheels on PyPI, so `cartesi build` compiles them. The Python template has no C compiler: in the template's `Dockerfile`, add `build-essential` to the `apt-get install` command:

<pre><code>

```dockerfile
apt-get install -y --no-install-recommends --snapshot=${APT_UPDATE_SNAPSHOT} \
  busybox-static \
  build-essential \
  /tmp/machine-guest-tools_riscv64.deb
```

</code></pre>

:::note Prebuilt riscv64 wheels
Instead of compiling, you can install prebuilt riscv64 wheels from the community-maintained index at `https://prototyp3-dev.github.io/pip-wheels-riscv/wheels/`: add `--find-links https://prototyp3-dev.github.io/pip-wheels-riscv/wheels/` as the first line of `requirements.txt` and leave the `Dockerfile` unchanged. The build is faster, but it depends on that third-party index.
:::

</TabItem>

<TabItem value="Rust" label="Rust">
<pre><code>

```shell
cargo add hex@=0.4.3 serde@=1.0.229 ethers-core@=2.0.14
```

</code></pre>
</TabItem>

<TabItem value="Go" label="Go">
<pre><code>

```shell
# No extra package needed for this tutorial snippet.
# The generated Go template already includes the Rollups bindings.
```

</code></pre>
</TabItem>

<TabItem value="C++" label="C++">
<pre><code>

```shell
# No extra package needed for this tutorial snippet.
# The generated C++ template already includes httplib + picojson.
```

</code></pre>
</TabItem>
</Tabs>

In JavaScript, install `viem` as a development dependency and replace the contents of `rolldown.config.js` with the configuration above, so that rolldown bundles viem into the application. `cartesi build` installs the packages listed under `dependencies` inside an emulated RISC-V container, where pnpm can crash with a segmentation fault while it installs viem; a bundled development dependency is not installed there (see [adding dependencies](../development/creating-an-application.md#adding-dependencies-in-javascript-and-typescript)). If the `pnpm` command is not available, enable it with `corepack enable pnpm`.

## Implement the Application Logic

Based on the programming language you selected earlier, copy the appropriate code snippet, then paste in your local entry point file (`dapp.py`, `src/main.rs`, `src/index.js`, `src/dapp.go`, or `dapp.cpp`) created in the setup step:

import MarketplaceJS from './snippets/marketplace-js.md';
import MarketplacePY from './snippets/marketplace-py.md';
import MarketplaceRS from './snippets/marketplace-rs.md';
import MarketplaceGO from './snippets/marketplace-go.md';
import MarketplaceCPP from './snippets/marketplace-cpp.md';

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

<MarketplaceJS />

</code></pre>
</TabItem>

<TabItem value="Python" label="Python">
<pre><code>

<MarketplacePY />

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust">
<pre><code>

<MarketplaceRS />

</code></pre>
</TabItem>

<TabItem value="Go" label="Go">
<pre><code>

<MarketplaceGO />

</code></pre>
</TabItem>

<TabItem value="C++" label="C++">
<pre><code>

<MarketplaceCPP />

</code></pre>
</TabItem>
</Tabs>

## Build and Run your Application

Once you have your application logic written out, the next step is to build the application, this is done by running the below commands using the Cartesi CLI:

```shell
cartesi build
```

- Expected Logs:
  
```shell
user@user-MacBook-Pro marketplace % cartesi build
✔ Build drives
  ✔ Build drive root

         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI
        \ /   MACHINE
         '

[INFO  rollup_http_server] starting http dispatcher service...
[INFO  rollup_http_server::http_service] starting http dispatcher http service!
[INFO  actix_server::builder] starting 1 workers
[INFO  actix_server::server] Actix runtime found; starting in Actix runtime
[INFO  actix_server::server] starting service: "actix-web-service-127.0.0.1:5004", workers: 1, listening on: 127.0.0.1:5004
[INFO  rollup_http_server::dapp_process] starting dapp: dapp
Sending finish

Manual yield rx-accepted (1) (0x000020 data)
Cycles: 76215164
76215164: 0x6ba590729f9c35be09f4d005bc2838969fc4ec0b40bd80421c0167527119bce4
Storing machine: please wait
```

The build command compiles your application then builds a Cartesi machine that contains your application.

Next, start the newly built machine, along with the other services it needs (an Anvil network, the inspect service and so on), by running:

```bash
cartesi run
```

If the `run` command is successful, you should see logs similar to this:

```bash
user@user-MacBook-Pro marketplace % cartesi run
WARNING: default block is set to 'latest', production configuration will likely use 'finalized'
✔ marketplace starting at http://127.0.0.1:6751
✔ anvil service ready at http://127.0.0.1:6751/anvil
✔ rpc service ready at http://127.0.0.1:6751/rpc
✔ inspect service ready at http://127.0.0.1:6751/inspect/marketplace
✔ marketplace machine hash is 0x6ba590729f9c35be09f4d005bc2838969fc4ec0b40bd80421c0167527119bce4
✔ marketplace contract deployed at 0x1173736abe1b9fd5af86604089c8264826c94fcd
(l) View logs   (b) Build and redeploy  (q) Quit
```

## Interacting with your Marketplace Application

Once your Marketplace application is up and running (via cartesi run), you can interact with it in two main ways — either by sending on-chain transactions through the local Anvil network (Advance requests) or by making HTTP requests directly to the node's inspect endpoint (Inspect requests).

In this section, we’ll focus on using the Cartesi CLI to send Advance requests, since it provides a much simpler and faster way to test your application locally.

:::note Inspect endpoint
If your application is running on a different port or has a different name from marketplace, remember to replace the inspect endpoint http://127.0.0.1:6751/inspect/marketplace with the one displayed after running the cartesi run command.
Also, ensure that all CLI commands are executed from the root directory of your application.
:::

### 1. Mint an ERC-721 Token and Grant Approval

With your Marketplace application now deployed, the first step is to mint the NFT you plan to list and grant approval for it to be transferred via the ERC-721 portal.
Since our app uses the test ERC-721 and ERC-20 contracts automatically deployed by the CLI, you can use the commands below to mint your token and set the necessary approvals. The commands use the `TestNFT` and `Erc721Portal` addresses printed by `cartesi address-book`, the same addresses hard-coded in the application code.

- Mint token ID 1:
  
```bash
cast send 0x0761b8e3aB06F458632974393C48765E6Ddc61bB \
  "mint(address,uint256)" \
  0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f 1 \
  --rpc-url http://127.0.0.1:6751/anvil \
  --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
```

This command calls the public `mint` function in the `TestNFT` contract deployed by the CLI, minting token `ID 1` to the address `0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f`.

- Grant approval to the ERC721-Portal:

Before an NFT can be deposited into the application, the portal contract must have permission to transfer it on behalf of the owner. Use the following command to grant that approval:

```bash
cast send 0x0761b8e3aB06F458632974393C48765E6Ddc61bB \
  "setApprovalForAll(address,bool)" \
  0x397c352d18DFf47CC8a6143403142cf7afd5Ff7E true \
  --rpc-url http://127.0.0.1:6751/anvil \
  --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
```

### 2. Deposit NFT with ID 1 to the Marketplace [advance request]

Now that the NFT is minted and approved, it’s time to list it on the marketplace.
We’ll do this by depositing it using the Cartesi CLI:

```bash
cartesi deposit erc721
```

The CLI will prompt you for the token ID (enter 1) and the token address (press Enter to use the default test token).
Under the hood, the CLI approves the portal for the token and calls `depositErc721Token`; the portal transfers the NFT from your address to the application contract and adds an input with the deposit details.

Once the deposit succeeds, the terminal running your application should show logs similar to the following. The sample logs on this page come from the Rust implementation, which runs the rollup HTTP server; the other languages print their own messages:

```bash
[INFO  rollup_http_server::http_service] received new request of type ADVANCE
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 750 "-" "-" 0.020416
Received finish status 200 OK
Received advance request data {"request_type":"advance_state","data":{"metadata":{"chain_id":31337,"app_contract":"0x1173736abe1b9fd5af86604089c8264826c94fcd","msg_sender":"0x397c352d18dff47cc8a6143403142cf7afd5ff7e","block_number":38,"block_timestamp":1794920122,"prev_randao":"0xed9592734017a764b86b7e50541f4db382e676771985cce5ab423a7afb0aa486","input_index":0},"payload":"0x0761b8e3ab06f458632974393c48765e6ddc61bb23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"}}
Deposited and listed token: 0x0761b8e3ab06f458632974393c48765e6ddc61bb, Receiver: 0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f, Token ID: 1
Token deposit and listing processed successfully
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /notice HTTP/1.1" 201 11 "-" "-" 0.001088
Notice generation successful
Sending finish
```

### 3. View All NFTs Listed on the Marketplace [inspect request]

After depositing, your NFT is automatically listed.
To verify this, you can query the marketplace for all listed tokens using an Inspect request:

```bash
curl -X POST http://127.0.0.1:6751/inspect/marketplace \
  -H "Content-Type: application/json" \
  -d '{"method":"get_all_listed_tokens"}'
```

This call returns a hex payload containing a list of all listed tokens on the marketplace.

```bash
{"status":"Accepted","reports":[{"payload":"0x416c6c206c697374656420746f6b656e73206172653a2031"}],"processed_input_count":1}
```

The payload hex `0x416c6...3a2031` when decoded, returns `All listed tokens are: 1`. Thereby confirming that the token with `Id 1` has successfully been listed.

### 4. Deposit ERC20 token for making purchases [advance request]

With the NFT successfully listed for sale, it's time to attempt to purchase this token, but before we do that, we first need to deposit enough tokens to purchase the listed NFT. Since our marketplace lists all NFTs at the price of `100` `TestToken` tokens (FUN), we'll be minting 100 tokens to the new address we'll be using to purchase, before proceeding with the purchase. `TestToken` starts with no balance on a new devnet, and its `mint` function is public.

- Mint the required tokens to the purchase address.
  
```bash
cast send 0x86EA17052C8e335Ad830B54EF566274EAB46B852 \
"mint(address,uint256)" 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 100000000000000000000 \
--private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97 \
--rpc-url http://127.0.0.1:6751/anvil
```

- Deposit 100 tokens to the marketplace application.

```bash
cartesi deposit erc20 --from 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

The CLI will prompt you for the token address (press Enter to use the default test token), and then the amount of tokens we intend to deposit `(100)`. The CLI would finally proceed to grant the necessary approvals after which it would deposit the tokens to our application.

On a successful deposit our application should return logs that look like this:

```bash
[INFO  rollup_http_server::http_service] received new request of type ADVANCE
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 494 "-" "-" 0.019008
Received finish status 200 OK
Received advance request data {"request_type":"advance_state","data":{"metadata":{"chain_id":31337,"app_contract":"0x1173736abe1b9fd5af86604089c8264826c94fcd","msg_sender":"0x3332de61a8bb9ac84893b2f552fe81c9a6dc5419","block_number":81,"block_timestamp":1794920208,"prev_randao":"0x4b9d05d49847fa57352b6fa9b22496e7dd0c7a74bb8ce84534d7c9084d448a2d","input_index":1},"payload":"0x86ea17052c8e335ad830b54ef566274eab46b85270997970c51812dc3a010c7d01b50e0d17dc79c80000000000000000000000000000000000000000000000056bc75e2d63100000"}}
Deposited token: 0x86ea17052c8e335ad830b54ef566274eab46b852, Receiver: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8, Amount: 100000000000000000000
Token deposit processed successfully
Sending finish
```

### 5. Purchase Token with ID 1 [advance request]

Now that the buyer has deposited funds, we can proceed to purchase the NFT. Use the following Cartesi CLI flow:

```bash
cartesi send --from 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
✔ Input String encoding
✔ Input (as string) {"method": "purchase_token", "token_id": "1"}
✔ Input sent: 0x209f81a43a03ac57aa22a80ce87978c02fe7d02ec298714186f692af59af4cf9
```

This sends a purchase request for token ID `1` from the buyer address. Pass `token_id` as a string, as above: the application reads it as a string and rejects the purchase, with the report `Missing or invalid token_id field in payload`, when it is a number. The marketplace validates the request (token listed and sufficient balance), executes the purchase, and emits the voucher to transfer the NFT to the buyer.

```bash
[INFO  rollup_http_server::http_service] received new request of type ADVANCE
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 440 "-" "-" 0.002624
Received finish status 200 OK
Received advance request data {"request_type":"advance_state","data":{"metadata":{"chain_id":31337,"app_contract":"0x1173736abe1b9fd5af86604089c8264826c94fcd","msg_sender":"0x70997970c51812dc3a010c7d01b50e0d17dc79c8","block_number":88,"block_timestamp":1794920222,"prev_randao":"0x6566eb1f4a1fee4e613e0b3e112fdde41187675bbdf6c90dfbdfa3403763fa21","input_index":2},"payload":"0x7b226d6574686f64223a202270757263686173655f746f6b656e222c2022746f6b656e5f6964223a202231227d"}}
Token purchased successfully
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /voucher HTTP/1.1" 201 11 "-" "-" 0.016704
Voucher generation successful
Token purchased and Withdrawn successfully
Sending finish
```

### 6. Recheck NFTs Listed on the Marketplace [inspect request]

Finally, we can confirm that the purchased NFT has been removed from the listings by running the inspect query again:

```bash
curl -X POST http://127.0.0.1:6751/inspect/marketplace \
  -H "Content-Type: application/json" \
  -d '{"method":"get_all_listed_tokens"}'
```

This call returns a hex payload like below:

```bash
{"status":"Accepted","reports":[{"payload":"0x416c6c206c697374656420746f6b656e73206172653a20"}],"processed_input_count":3}
```

The payload hex `0x416c6...653a20` when decoded, returns `All listed tokens are: ` (an empty list). Thereby verifying that the token with `Id 1` has successfully been sold and no longer listed for sale in the marketplace.

## Conclusion

Congratulations!!!

You’ve successfully built and interacted with your own Marketplace application on Cartesi. 

This example covered essential Cartesi concepts such as routing, asset management, voucher generation, and the use of both Inspect and Advance routes.

For a more detailed version of this code, you can check the `marketplace` folder for your selected language in [this repository](https://github.com/Mugen-Builders/Counter-X-Marketplace-apps/tree/3ea44735b2237366208f726e36a4660c55a41f1e)