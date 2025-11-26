---
id: counter
title: Build a counter Application
resources:
  - url: https://github.com/Mugen-Builders/Counter-X-Marketplace-apps
    title: Source code for the counter Application
---

This tutorial aims to guide you through creating and interacting with a basic Cartesi application, it'll take you through setting up your dev environment, creating a project then finally running and interacting with your application locally.

We would also be providing the Rust, JavaScript, Python and Go implementation of the application, so you could choose whichever language you're more conversant with.

## Set up your environment

To build an application using Cartesi, it's necessary that you have the following tools installed:

- Cartesi CLI: A simple tool for building applications on Cartesi. [Install Cartesi CLI for your OS of choice](../development/installation.md).

- Docker Desktop 4.x: The tool you need to run the Cartesi Machine and its dependencies. [Install Docker for your OS of choice](https://www.docker.com/products/docker-desktop/).

## Create an application template using the Cartesi CLI

Creating an application template for your application is a generally simple process, to do this, we utilize the Cartesi CLI by running the below command:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

```shell
cartesi create counter --template javascript
```

</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>

```shell
cartesi create counter --template python
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

```shell
cartesi create counter --template rust
```

</code></pre>
</TabItem>
</Tabs>

This command creates a directory called `counter` and depending on your selected language this directory would contain the necessary entry point file to start your application, for Python developers this would be `dapp.py` while for Rust users it would be `src/main.rs`, then finally for JavaScript users, the entry point file would be `src/index.js`.

This entry point file contains the default template for interacting with the Cartesi Rollups HTTP Server, it also makes available, two function namely `handle_advance()` and `handle_inspect()` which process "advance / write" and "inspect / read" requests to the application. In the next section we would be updating these functions with the implementation for your application.

## Implement the Application Logic

We’ll build the counter with a simple object‑oriented design. It defines a Counter object with three methods: a constructor, `increment()` to increase the count, and `get()` to return the current count.

We also update `handle_advance()` to increment the counter whenever an advance (write) request arrives, ignoring the request payload. And we update `handle_inspect()` to log the current counter value when an inspect (read) request arrives.

Together, these handlers let you increment the counter and check its value.

To try it locally, copy the snippet for your language and replace the contents of the entry point file in your `counter/` directory.

import CounterJS from './snippets/counter-js.md';
import CounterPY from './snippets/counter-py.md';
import CounterRS from './snippets/counter-rs.md';

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

<CounterJS />

</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>

<CounterPY />

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

<CounterRS />

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
Attaching to prompt-1, validator-1
validator-1  | 2025-11-24 17-06-12 info remote-cartesi-machine pid:108 ppid:67 Initializing server on localhost:0
prompt-1     | Anvil running at http://localhost:8545
prompt-1     | GraphQL running at http://localhost:8080/graphql
prompt-1     | Inspect running at http://localhost:8080/inspect/
prompt-1     | Explorer running at http://localhost:8080/explorer/
prompt-1     | Bundler running at http://localhost:8080/bundler/rpc
prompt-1     | Paymaster running at http://localhost:8080/paymaster/
prompt-1     | Press Ctrl+C to stop the node
```

## Interacting with your Counter Application

Interacting with your Counter application could be achieved either through initiating transactions on the local anvil network which was activated when you ran the `cartesi run` command or more easily through the Cartesi CLI, for this tutorial, we'll be using the Cartesi CLI to send an input to our application which would increase our counter variable.

### 1. Query current count value

We start by querying the current count value, this is done by making an inspect request to the counter application running locally, to achieve this we run the below command in a new terminal:

```bash
curl http://localhost:8080/inspect/counter
```

On success, we receive a confirmation response from the HTTP server, something similar to `{"status":"Accepted","exception_payload":null,"reports":[],"processed_input_count":0}`, then on the terminal running our application we should get a log confirming that our application received the inspect call and should also contain a log of the current count value.

```bash
validator-1  | [INFO  rollup_http_server::http_service] Received new request of type INSPECT
validator-1  | [INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 70 "-" "python-requests/2.31.0" 0.001536
validator-1  | INFO:__main__:Received finish status 200
validator-1  | INFO:__main__:Received inspect request data {'payload': '0x636f756e746572'}
validator-1  | INFO:__main__:Current counter value: 0
validator-1  | INFO:__main__:Sending finish
```

As seen in the second to last line of our received log, we can see the `counter value` returned to be `0`

### 2. Increase count value

Now that we've confirmed our count value to be zero (0), we would be sending an advance request using the CLI to increase the value of our counter by running the below command:

```bash
cartesi send generic
```

We then proceed by selecting Foundry and pressing Enter twice to accept the default RPC URL. Next, we choose Mnemonic as the authentication method and again press Enter twice to use the default mnemonic and wallet address. After that, we press Enter once more to confirm the application address.

Once the basics are set, we navigate to and select String encoding as the input format. Finally, we type any random string (e.g., increase), press Enter, and the CLI sends the request to the application.

The above process sends an advance request with the payload "increase" to our application, which ignores this payload then proceeds to increase out count value by `one (1)`, if this command is successful and our application process this request graciously, we should get a log similar to what's presented below on the terminal running our application:

```bash
validator-1  | [INFO  rollup_http_server::http_service] Received new request of type ADVANCE
validator-1  | [INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 210 "-" "python-requests/2.31.0" 0.001664
validator-1  | INFO:__main__:Received finish status 200
validator-1  | INFO:__main__:Received advance request data {'metadata': {'msg_sender': '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', 'epoch_index': 0, 'input_index': 0, 'block_number': 2408, 'timestamp': 1764015746}, 'payload': '0x6f6b6179'}
validator-1  | INFO:__main__:Counter increment requested, new count value: 1
validator-1  | INFO:__main__:Sending finish
```

The above logs prove that out application received the advance request, increased our count value, logs the updated count value then finishes that request successfully.

As seen in the second to last line of the log, our count value has been increased from 0 to 1. To confirm this increase, we can run an inspect request once more to verify the current count value, and on running the same inspect command as last time, we obtain the updated logs below.

```shell
validator-1  | [INFO  rollup_http_server::http_service] Received new request of type INSPECT
validator-1  | [INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 70 "-" "python-requests/2.31.0" 0.001280
validator-1  | INFO:__main__:Received finish status 200
validator-1  | INFO:__main__:Received inspect request data {'payload': '0x636f756e746572'}
validator-1  | INFO:__main__:Current counter value: 1
validator-1  | INFO:__main__:Sending finish
```

From the latest application logs, it's now clear that the application's count value has been increased from 0 to one, and subsequent advance calls would further increase the count value.

## Conclusion

Congratulations, you've successfully bootstrapped, implemented, ran and interacted with your first Cartesi Application.

For a more detailed version of this code, you can check the `counter` folder for your selected language in [this repository](https://github.com/Mugen-Builders/Counter-X-Marketplace-apps)
