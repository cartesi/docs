---
id: marketplace
title: Build a marketplace Application
resources:
  - url: https://github.com/Mugen-Builders/Counter-X-Marketplace-apps
    title: Source code for the marketplace Application
---

In this tutorial we'll be building a simple NFT Marketplace application, where users are able to deposit a unique token to be sold at a fixed price, then other users are able to purchase and withdraw these purchased tokens to their wallet.

This Tutorial is built using an Object oriented approach and aims to cover, application creation, Notice, Voucher and Report generation, we'll also be decoding and consuming the payload passed alongside advance and inspect requests.

## How the Marketplace Works

Now that the basic setup is done, we can focus on how the marketplace application actually works.
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
  - Does the user have enough deposited tokens?
  - Is the NFT still listed?

- If the transaction is valid, the marketplace transfers the payment token to the seller then creates a voucher that sends the purchased NFT to the buyer.

### Inspect Requests

The Inspect route will support three simple read-only queries:

**1. `get_user_erc20_balance`**

**Description:** Shows how many tokens a user has stored in the marketplace.

**Input:** User's address

**Output:** Amount of ERC-20 tokens deposited.

**2. `get_token_owner`**

**Description:** Returns the current owner of a specific NFT.

**Input:** Token ID

**Output:** Address of current token owner.

**3. `get_all_listed_tokens`**

**Description:** Shows all NFTs currently listed for sale.

**Input:** (none)

**Output:** Array of Token IDs currently listed for sale.

## Set up your environment

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

<TabItem value="Python" label="Python" default>
<pre><code>

```shell
cartesi create marketplace --template python
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

```shell
cartesi create marketplace --template rust
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
 npm add viem
```

</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>

```shell
cat > requirements.txt << 'EOF'
--find-links https://prototyp3-dev.github.io/pip-wheels-riscv/wheels/
requests==2.32.5
eth-abi==5.2.0
eth-utils==5.3.1
regex==2025.11.3
pycryptodome==3.23.0
eth-hash==0.7.1
EOF
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

```shell
cargo add hex serde ethers-core 
```

</code></pre>
</TabItem>
</Tabs>

## Implement the Application Logic

Based on the programming language you selected earlier, copy the appropriate code snippet, then paste in your local entry point file (`dapp.py` or `src/main.rs` or `src/index.js`), created in the setup step:

import MarketplaceJS from './snippets/marketplace-js.md';
import MarketplacePY from './snippets/marketplace-py.md';
import MarketplaceRS from './snippets/marketplace-rs.md';

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

<MarketplaceJS />

</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>

<MarketplacePY />

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

<MarketplaceRS />

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
(node:4460) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
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
[INFO  rollup_http_server::dapp_process] starting dapp: python3 dapp.py
INFO:__main__:HTTP rollup_server url is http://127.0.0.1:5004
INFO:__main__:Sending finish

Manual yield rx-accepted (1) (0x000020 data)
Cycles: 8108719633
8108719633: 107174e04a294787e22b6864c61fedd845833e5c8bc9a244480f2996ddabb3c7
Storing machine: please wait
```

The build command compiles your application then builds a Cartesi machine that contains your application.

This recently built machine alongside other necessary service, like an Anvil network, inspect service, etc. wound next be started by running the command:

```bash
cartesi run
```

If the `run` command is successful, you should see logs similar to this:

```bash
user@user-MacBook-Pro marketplace % cartesi run
(node:5404) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
WARNING: default block is set to 'latest', production configuration will likely use 'finalized'
[+] Pulling 4/0
 ✔ database Skipped - Image is already present locally  
 ✔ rollups-node Skipped - Image is already present locally 
 ✔ anvil Skipped - Image is already present locally  
 ✔ proxy Skipped - Image is already present locally                                                                                                                                                                                                                   
✔ marketplace starting at http://127.0.0.1:6751
✔ anvil service ready at http://127.0.0.1:6751/anvil
✔ rpc service ready at http://127.0.0.1:6751/rpc
✔ inspect service ready at http://127.0.0.1:6751/inspect/marketplace
✔ marketplace machine hash is 0x107174e04a294787e22b6864c61fedd845833e5c8bc9a244480f2996ddabb3c7
✔ marketplace contract deployed at 0x94b32605a405d690934eb4ecc91856febfa747cc
(l) View logs   (b) Build and redeploy  (q) Quit
```

## Interacting with your Marketplace Application

Once your Marketplace application is up and running (via cartesi run), you can interact with it in two main ways — either by sending on-chain transactions through the local Anvil network (Advance requests) or by making HTTP requests directly to the Rollups HTTP server’s Inspect endpoint (Inspect requests).

In this section, we’ll focus on using the Cartesi CLI to send Advance requests, since it provides a much simpler and faster way to test your application locally.

:::note Inspect endpoint
If your application is running on a different port or has a different name from marketplace, remember to replace the inspect endpoint http://127.0.0.1:6751/inspect/marketplace with the one displayed after running the cartesi run command.
Also, ensure that all CLI commands are executed from the root directory of your application.
:::

### 1. Mint an ERC-721 Token and Grant Approval

With your Marketplace application now deployed, the first step is to mint the NFT you plan to list and grant approval for it to be transferred via the ERC-721 portal.
Since our app uses the test ERC-721 and ERC-20 contracts automatically deployed by the CLI, you can use the commands below to mint your token and set the necessary approvals.

- Mint token ID 1:
  
```bash
cast send 0xBa46623aD94AB45850c4ecbA9555D26328917c3B \
  "safeMint(address, uint256, string)" \
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 1 "" \
  --rpc-url http://127.0.0.1:6751/anvil \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

This command calls the `safeMint` function in the `testNFT` contract deployed by the CLI, minting token `ID 1` to the address `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`.

- Grant approval to the ERC721-Portal:

Before an NFT can be deposited into the application, the portal contract must have permission to transfer it on behalf of the owner. Use the following command to grant that approval:

```bash
cast send 0xBa46623aD94AB45850c4ecbA9555D26328917c3B \
  "setApprovalForAll(address,bool)" \
  0xc700d52F5290e978e9CAe7D1E092935263b60051 true \
  --rpc-url http://127.0.0.1:6751/anvil \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### 2. Deposit NFT with ID 1 to the Marketplace [advance request]

Now that the NFT is minted and approved, it’s time to list it on the marketplace.
We’ll do this by depositing it using the Cartesi CLI:

```bash
cartesi deposit erc721
```

The CLI will prompt you for the token ID (enter 1) and the token address (press Enter to use the default test token).
Under the hood, the CLI transfers the NFT from your address to the ERC-721 portal, which then sends the deposit payload to your application.

Once the deposit succeeds, the terminal running your application should show logs similar to:

```bash
INFO  rollup_http_server::http_service] received new request of type ADVANCE
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 751 "-" "-" 0.018688
Received finish status 200 OK
Received advance request data {"request_type":"advance_state","data":{"metadata":{"chain_id":13370,"app_contract":"0xb86306660e0be8e228c0cd14b8a1c5d5eddb8d20","msg_sender":"0xc700d52f5290e978e9cae7d1e092935263b60051","block_number":675,"block_timestamp":1762948794,"prev_randao":"0x3d144a3d5bb3125c92a230e7597e04e82eb5d5acbea185db2b1eadda3530d5c7","input_index":0},"payload":"0xba46623ad94ab45850c4ecba9555d26328917c3bf39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"}}
Token deposit and listing processed successfully
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /notice HTTP/1.1" 201 11 "-" "-" 0.001088
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
{"status":"Accepted","reports":[{"payload":"0x416c6c206c697374656420746f6b656e73206172653a205b315d"}],"processed_input_count":6}
```

The payload hex `0x416c6...205b315d` when decoded, returns `All listed tokens are: [1]`. Thereby confirming that the token with `Id 1` has successfully been listed.

### 4. Deposit ERC20 token for making purchases [advance request]

With the NFT successfully listed for sale, it's time to attempt to purchase this token, but before we do that, we'll need first deposit the required amount of tokens to purchase the listed NFT. Since our marketplace lists all NFT's at the price of `100 testTokens` we'll be transferring 100 tokens to the new address we'll be using to purchase, before proceeding with the purchase.

- Transfer required tokens to purchase address.
  
```bash
cast send 0xFBdB734EF6a23aD76863CbA6f10d0C5CBBD8342C \
"transfer(address,uint256)" 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 100000000000000000000 \
--private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
--rpc-url http://127.0.0.1:6751/anvil
```

- Deposit 100 tokens to the marketplace application.

```bash
cartesi deposit --from 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

The CLI will prompt you for the token address (press Enter to use the default test token), and then the amount of tokens we intend to deposit `(100)`. The CLI would finally proceed to grant the necessary approvals after which it would deposit the tokens to our application.

On a successful deposit our application should return logs that look like this:

```bash
[INFO  rollup_http_server::http_service] received new request of type ADVANCE
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 496 "-" "-" 0.018176
Received finish status 200 OK
Received advance request data {"request_type":"advance_state","data":{"metadata":{"chain_id":13370,"app_contract":"0xb86306660e0be8e228c0cd14b8a1c5d5eddb8d20","msg_sender":"0xc700d6add016eecd59d989c028214eaa0fcc0051","block_number":2272,"block_timestamp":1762951994,"prev_randao":"0x0992ab8380b23c1c98928a76ae9a79c501ae27625943a53b0fd57455f10e5164","input_index":1},"payload":"0xfbdb734ef6a23ad76863cba6f10d0c5cbbd8342c70997970c51812dc3a010c7d01b50e0d17dc79c80000000000000000000000000000000000000000000000056bc75e2d63100000"}}
Deposited token: 0xfbdb734ef6a23ad76863cba6f10d0c5cbbd8342c, Receiver: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8, Amount: 100000000000000000000
Token deposit processed successfully
Sending finish
```

### 5. Purchase Token with ID 1 [advance request]

Now that the buyer has deposited funds, we can proceed to purchase the NFT. To do this we make an advance request to the application using the Cartesi CLI by running the command:

```bash
 cartesi send  "{"method": "purchase_token", "token_id": 1}" --from 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

This command notifies the marketplace that the address `0x7099797....0d17dc79C8` which initially deposited 100 tokens, would want to purchase token ID 1, The marketplace proceeds to run necessary checks like verifying that the token is for sale, and that the buyer has sufficient tokens to make the purchase, after which it executes the purchase and finally emits a voucher that transfers the tokens to the buyer's address. On a successful purchase, you should get logs similar to the below.

```bash
[INFO  rollup_http_server::http_service] received new request of type ADVANCE
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 426 "-" "-" 0.001792
Received finish status 200 OK
Received advance request data {"request_type":"advance_state","data":{"metadata":{"chain_id":13370,"app_contract":"0xb86306660e0be8e228c0cd14b8a1c5d5eddb8d20","msg_sender":"0x70997970c51812dc3a010c7d01b50e0d17dc79c8","block_number":3576,"block_timestamp":1762954606,"prev_randao":"0xd29cd42cfd3c9ff4f31b39f497fc2f4d0a7add5a67da98be0d7841c37c7ad25f","input_index":2},"payload":"0x7b6d6574686f643a2070757263686173655f746f6b656e2c20746f6b656e5f69643a20317d"}}
PURCHASE SUCCESSFUL, STRUCTURING VOUCHERS!!
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /voucher HTTP/1.1" 201 11 "-" "-" 0.015424
Voucher generation successful
Token purchased and Withdrawn successfully
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
{"status":"Accepted","reports":[{"payload":"0x416c6c206c697374656420746f6b656e73206172653a205b5d"}],"processed_input_count":7}
```

The payload hex `0x416c6...653a205b5d` when decoded, returns `All listed tokens are: []`. Thereby verifying that the token with `Id 1` has successfully been sold and no longer listed for sale in the marketplace.

## Conclusion

Congratulations!!!

You’ve successfully built and interacted with your own Marketplace application on Cartesi. 

This example covered essential Cartesi concepts such as routing, asset management, voucher generation, and the use of both Inspect and Advance routes.

For a more detailed version of this code, you can check the `marketplace` folder for your selected language in [this repository](https://github.com/Mugen-Builders/Counter-X-Marketplace-apps)