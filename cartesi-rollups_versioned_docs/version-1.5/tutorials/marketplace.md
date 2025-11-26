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
 npm add viem ethers
```

</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>

```shell
cat > requirements.txt << 'EOF'
requests==2.32.3
eth-abi==2.2.0
eth-utils==1.10.0
eth-hash==0.3.3
pycryptodome==3.20.0
EOF
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

```shell
cargo add json@0.12
cargo add hyper@0.14 --features http1,runtime,client
cargo add tokio@1.32 --features macros,rt-multi-thread
cargo add ethers-core@0.5.3
cargo add serde@1.0.228
cargo add hex@0.4.3
```

</code></pre>
</TabItem>
</Tabs>

**NOTE::** For python developers, add the below snippet to `line 26` of your Dockerfile. It should come immediately after the line `COPY ./requirements.txt .`.

This command would help install essential compilers to help compile some dependencies we'll be using.

```Dockerfile
# Install build dependencies for compiling native extensions
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        python3-dev && \
    rm -rf /var/lib/apt/lists/*
```

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
View build details: docker-desktop://dashboard/build/multiarch/multiarch0/vzzzuxvcznba66icpyk3wyde9

What's next:
    View a summary of image vulnerabilities and recommendations → docker scout quickview 
copying from tar archive /tmp/input

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
[INFO  rollup_http_server::dapp_process] starting dapp: python3 dapp.py
INFO:__main__:HTTP rollup_server url is http://127.0.0.1:5004
INFO:__main__:Sending finish

Manual yield rx-accepted (0x100000000 data)
Cycles: 3272156820
3272156820: 3903552ee499ef4a10b2c8ffba6b8d49088a0a8b9137b8d10be359910080432a
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
Attaching to prompt-1, validator-1
validator-1  | 2025-11-24 21-27-29 info remote-cartesi-machine pid:109 ppid:68 Initializing server on localhost:0
prompt-1     | Anvil running at http://localhost:8545
prompt-1     | GraphQL running at http://localhost:8080/graphql
prompt-1     | Inspect running at http://localhost:8080/inspect/
prompt-1     | Explorer running at http://localhost:8080/explorer/
prompt-1     | Bundler running at http://localhost:8080/bundler/rpc
prompt-1     | Paymaster running at http://localhost:8080/paymaster/
prompt-1     | Press Ctrl+C to stop the node
```

## Interacting with your Marketplace Application

Once your Marketplace application is up and running (via cartesi run), you can interact with it in two main ways — either by sending on-chain transactions through the local Anvil network (Advance requests) or by making HTTP requests directly to the Rollups HTTP server’s Inspect endpoint (Inspect requests).

In this section, we’ll focus on using the Cartesi CLI to send Advance requests, since it provides a much simpler and faster way to test your application locally.

### 1. Mint an ERC-721 Token and Grant Approval

With your Marketplace application now deployed, the first step is to mint the NFT you plan to list and grant approval for it to be transferred via the ERC-721 portal.
Since our app uses the test ERC-721 and ERC-20 contracts automatically deployed by the CLI, you can use the commands below to mint your token and set the necessary approvals.

- Mint token ID 1:
  
```bash
cast send 0xc6582A9b48F211Fa8c2B5b16CB615eC39bcA653B \
  "safeMint(address, uint256, string)" \
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 1 "" \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

This command calls the `safeMint` function in the `testNFT` contract deployed by the CLI, minting token `ID 1` to the address `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`.

- Grant approval to the ERC721-Portal:

Before an NFT can be deposited into the application, the portal contract must have permission to transfer it on behalf of the owner. Use the following command to grant that approval:

```bash
cast send 0xc6582A9b48F211Fa8c2B5b16CB615eC39bcA653B \
  "setApprovalForAll(address,bool)" \
  0xab7528bb862fB57E8A2BCd567a2e929a0Be56a5e true \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### 2. Relay Application address

Before any interaction with the application, it's important that the application logic is aware of Its contract address, as this is important during voucher generation. To register the application address, we use the Cartesi CLI to trigger a call from the `DappAddressRelayer` contract to our application, this can be achieved through the below process:

```bash
cartesi send
```

Run the command above, then choose `Send DApp address input to the application.` as the action. Press Enter twice to accept Foundry as the interaction chain. Next, press Enter to use the default RPC URL, then press Enter three more times to select Mnemonic as the authentication method and confirm both the default mnemonic and the default wallet address. Finally, press Enter one last time to confirm the displayed application address.

At this point, the CLI will initiate the request and forward the application’s address to your Cartesi application. The application codebase already includes logic to verify the caller and ensure that the received application address is correctly recognized as the `dappAddressRelayer`.

### 3. Deposit NFT with ID 1 to the Marketplace [advance request]

Now that the NFT is minted and approved, it’s time to list it on the marketplace.
We’ll do this by depositing it using the Cartesi CLI:

```bash
cartesi send erc721
```

The CLI will prompt you for the chain, RPC URL, Wallet, Mnemonic, Account and Application address, for those sections you can simply keep hitting enter to use the default values, when the CLI Prompts for token address, you enter the address `0xc6582A9b48F211Fa8c2B5b16CB615eC39bcA653B`, token ID (enter 1).
Under the hood, the CLI transfers the NFT from your address to the ERC-721 portal, which then sends the deposit payload to your application.

Once the deposit succeeds, the terminal running your application should show logs similar to:

```bash
validator-1  | [INFO  rollup_http_server::http_service] Received new request of type ADVANCE
validator-1  | [INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 601 "-" "node" 0.001152
validator-1  | Received finish status 200
validator-1  | Received advance request data {"metadata":{"msg_sender":"0x237f8dd094c0e47f4236f12b4fa01d6dae89fb87","epoch_index":0,"input_index":2,"block_number":298,"timestamp":1764095710},"payload":"0xc6582a9b48f211fa8c2b5b16cb615ec39bca653bf39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"}
validator-1  | Token deposit and Listing processed successfully
validator-1  | [INFO  actix_web::middleware::logger] 127.0.0.1 "POST /notice HTTP/1.1" 201 11 "-" "node" 0.000704
validator-1  | [INFO  rollup_http_server::http_service] Received new request of type INSPECT
validator-1  | [INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 98 "-" "node" 0.000960
validator-1  | Received finish status 200
```

### 4. View All NFTs Listed on the Marketplace [inspect request]

After depositing, your NFT is automatically listed.
To verify this, you can query the marketplace for all listed tokens using an Inspect request:

```bash
curl http://localhost:8080/inspect/get_all_listed_tokens
```

This call returns a hex payload containing a list of all listed tokens on the marketplace.

```bash
{"status":"Accepted","reports":[{"payload":"0x416c6c206c697374656420746f6b656e73206172653a2031"}],"processed_input_count":6}
```

The payload hex `0x416c6...2653a2031` when decoded, returns `All listed tokens are: [1]`. Thereby confirming that the token with `Id 1` has successfully been listed.

### 5. Deposit ERC20 token for making purchases [advance request]

With the NFT successfully listed for sale, it's time to attempt to purchase this token, but before we do that, we'll need first deposit the required amount of tokens to purchase the listed NFT. Since our marketplace lists all NFT's at the price of `100 testTokens` we'll be transferring 100 tokens to the new address we'll be using to purchase, before proceeding with the purchase.

- Transfer required tokens to purchase address.
  
```bash
cast send 0x92C6bcA388E99d6B304f1Af3c3Cd749Ff0b591e2 \
"transfer(address,uint256)" 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 100000000000000000000 \
--private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
--rpc-url http://localhost:8545
```

- Deposit 100 tokens to the marketplace application.

```bash
  cartesi send erc20
```

The CLI will prompt you for the interaction chain, select Foundry, then press Enter twice to accept the default RPC URL. Next, choose Mnemonic as the authentication method. When asked to select an account, choose the second address in the list: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`.

After that, select the default application address. When prompted for the ERC-20 token address, enter: `0x92C6bcA388E99d6B304f1Af3c3Cd749Ff0b591e2`.

Finally, enter the amount of tokens you want to deposit (100). The CLI will then automatically handle the necessary approvals and complete the deposit into your application.

On a successful deposit our application should return logs that look like this:

```bash
validator-1  | [INFO  rollup_http_server::http_service] Received new request of type ADVANCE
validator-1  | [INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 347 "-" "node" 0.001024
validator-1  | Received finish status 200
validator-1  | Received advance request data {"metadata":{"msg_sender":"0x9c21aeb2093c32ddbc53eef24b873bdcd1ada1db","epoch_index":0,"input_index":4,"block_number":305,"timestamp":1764095745},"payload":"0x0192c6bca388e99d6b304f1af3c3cd749ff0b591e270997970c51812dc3a010c7d01b50e0d17dc79c800000000000000000000000000000000000000000000000821ab0d4414980000"}
validator-1  | Token deposit processed successfully
validator-1  | [INFO  rollup_http_server::http_service] Received new request of type ADVANCE
validator-1  | [INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 285 "-" "node" 0.001024
validator-1  | Received finish status 200
```

### 6. Purchase Token with ID 1 [advance request]

Now that the buyer has deposited funds, we can proceed to purchase the NFT. To do this we make an advance request to the application using the Cartesi CLI by running the command:

```bash
  cartesi send generic
```

The CLI will prompt you for the interaction chain, select Foundry, then press Enter twice to accept the default RPC URL. Next, choose Mnemonic as the authentication method. When asked to select an account, choose the second address in the list: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`.

After that, select the default application address. When prompted for Input method, select `String encoding`.

Finally, pass the below Json object to the terminal as the input:

```bash
{"method": "purchase_token", "token_id": "1"}
```

This command notifies the marketplace that the address `0x7099797....0d17dc79C8` which initially deposited 100 tokens, would want to purchase token ID 1, The marketplace proceeds to run necessary checks like verifying that the token is for sale, and that the buyer has sufficient tokens to make the purchase, after which it executes the purchase and finally emits a voucher that transfers the tokens to the buyer's address. On a successful purchase, you should get logs similar to the below.

```bash
validator-1  | [INFO  rollup_http_server::http_service] Received new request of type ADVANCE
validator-1  | [INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 285 "-" "node" 0.001024
validator-1  | Received finish status 200
validator-1  | Received advance request data {"metadata":{"msg_sender":"0x70997970c51812dc3a010c7d01b50e0d17dc79c8","epoch_index":0,"input_index":5,"block_number":306,"timestamp":1764095750},"payload":"0x7b226d6574686f64223a2270757263686173655f746f6b656e222c22746f6b656e5f6964223a2234227d"}
validator-1  | Token purchased successfully
validator-1  | [INFO  actix_web::middleware::logger] 127.0.0.1 "POST /voucher HTTP/1.1" 201 11 "-" "node" 0.000896
validator-1  | [INFO  rollup_http_server::http_service] Received new request of type ADVANCE
validator-1  | [INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 285 "-" "node" 0.001024
validator-1  | Received finish status 200
```

### 7. Recheck NFTs Listed on the Marketplace [inspect request]

Finally, we can confirm that the purchased NFT has been removed from the listings by running the inspect query again:

```bash
curl http://localhost:8080/inspect/get_all_listed_tokens
```

This call returns a hex payload like below:

```bash
  {"status":"Accepted","exception_payload":null,"reports":[{"payload":"0x416c6c206c697374656420746f6b656e73206172653a20"}],"processed_input_count":7}
```

The payload hex `0x416c6...6172653a20` when decoded, returns `All listed tokens are: `. Thereby verifying that the token with `Id 1` has successfully been sold and no longer listed for sale in the marketplace.

## Conclusion

Congratulations!!!

You’ve successfully built and interacted with your own Marketplace application on Cartesi.

This example covered essential Cartesi concepts such as routing, asset management, voucher generation, and the use of both Inspect and Advance routes.

For a more detailed version of this code, you can check the `marketplace` folder for your selected language in [this repository](https://github.com/Mugen-Builders/Counter-X-Marketplace-apps)