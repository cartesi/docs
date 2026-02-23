---
id: counter
title: Build a counter Application
resources:
  - url: https://github.com/Mugen-Builders/Counter-X-Marketplace-apps
    title: Source code for the counter Application
---

This tutorial aims to guide you through creating and interacting with a basic Cartesi application, it'll take you through setting up your dev environment, creating a project then finally running and interacting with your application locally.

We provide Rust, JavaScript, Python, Go, and C++ implementations of the application, so you can choose whichever language you're more comfortable with.

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

<TabItem value="Go" label="Go" default>
<pre><code>

```shell
cartesi create counter --template go
```

</code></pre>
</TabItem>

<TabItem value="C++" label="C++" default>
<pre><code>

```shell
cartesi create counter --template cpp
```

</code></pre>
</TabItem>
</Tabs>

This command creates a directory called `counter` and, depending on your selected language, this directory contains the entry point file to start your application (for example: `dapp.py` for Python, `src/main.rs` for Rust, `src/index.js` for JavaScript, `main.go` for Go, and `src/main.cpp` for C++).

This entry point file contains the default template for interacting with the Cartesi Rollups HTTP Server, it also makes available, two function namely `handle_advance()` and `handle_inspect()` which process "advance / write" and "inspect / read" requests to the application. In the next section we would be updating these functions with the implementation for your application.

## Implement the Application Logic

We’ll build the counter with a simple object‑oriented design. It defines a Counter object with three methods: a constructor, `increment()` to increase the count, and `get()` to return the current count.

We also update `handle_advance()` to increment the counter whenever an advance (write) request arrives, ignoring the request payload. And we update `handle_inspect()` to log the current counter value when an inspect (read) request arrives.

Together, these handlers let you increment the counter and check its value.

To try it locally, copy the snippet for your language and replace the contents of the entry point file in your `counter/` directory.

import CounterJS from './snippets/counter-js.md';
import CounterPY from './snippets/counter-py.md';
import CounterRS from './snippets/counter-rs.md';
import CounterGO from './snippets/counter-go.md';
import CounterCPP from './snippets/counter-cpp.md';

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

<TabItem value="Go" label="Go" default>
<pre><code>

<CounterGO />

</code></pre>
</TabItem>

<TabItem value="C++" label="C++" default>
<pre><code>

<CounterCPP />

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
user@user-MacBook-Pro counter % cartesi build
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
user@user-MacBook-Pro counter % cartesi run
(node:5404) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
WARNING: default block is set to 'latest', production configuration will likely use 'finalized'
[+] Pulling 4/0
 ✔ database Skipped - Image is already present locally  
 ✔ rollups-node Skipped - Image is already present locally 
 ✔ anvil Skipped - Image is already present locally  
 ✔ proxy Skipped - Image is already present locally                                                                                                                                                                                                                   
✔ counter starting at http://127.0.0.1:6751
✔ anvil service ready at http://127.0.0.1:6751/anvil
✔ rpc service ready at http://127.0.0.1:6751/rpc
✔ inspect service ready at http://127.0.0.1:6751/inspect/counter
✔ counter machine hash is 0x107174e04a294787e22b6864c61fedd845833e5c8bc9a244480f2996ddabb3c7
✔ counter contract deployed at 0x94b32605a405d690934eb4ecc91856febfa747cc
(l) View logs   (b) Build and redeploy  (q) Quit
```

## Interacting with your Counter Application

Interacting with your Counter application could be achieved either through initiating transactions on the local anvil network which was activated when you ran the `cartesi run` command or more easily through the Cartesi CLI, for this tutorial, we'll be using the Cartesi CLI to send an input to our application which would increase our counter variable.

### 1. Query current count value

We start by querying the current count value, this is done by making an inspect request to the counter application running locally, to achieve this we run the below command in a new terminal:

```bash
curl -X POST http://127.0.0.1:6751/inspect/counter \
  -H "Content-Type: application/json" \
  -d '{""}' 
```

:::note Inspect endpoint
Please note that if your application is running on a different port or your application is not named `counter` as in the guide, then you'll need to replace the inspect endpoint `http://127.0.0.1:6751/inspect/counter` with the endpoint provided after running the `cartesi run` command.
:::

On success, we receive a confirmation response from the HTTP server, something similar to `{"status":"Accepted","reports":null,"processed_input_count":0}`, then on the terminal running our application when we press the `l` key to access our application logs we should get a log confirming that our application received the inspect call and should also contain a log of the current count value.

```bash
[INFO  rollup_http_server::http_service] received new request of type INSPECT
inspect_request.payload_length: 4
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 64 "-" "python-requests/2.31.0" 0.020096
INFO:__main__:Received finish status 200
INFO:__main__:Received inspect request data {'payload': '0x7b22227d'}
INFO:__main__:Current counter value: 0
INFO:__main__:Sending finish
2025-11-09T17:47:44.661 INF Request executed service=inspect status=Accepted application=counter
```

As seen in the third to last line of our received log, we can see the `count value` returned to be `0`

### 2. Increase count value

Now that we've confirmed our count value to be zero (0), we would be sending an advance request using the CLI to increase the value of our counter by running the below command:

```bash
cartesi send random_text
```

The above command sends an advance request with the payload "random_text" to our application, which ignores this payload then proceeds to increase out count value by `one (1)`, if this command is successful and our application process this request graciously, we should get a log similar to what's presented below on the terminal running our application:

```bash
INFO:__main__:Received advance request data {'metadata': {'chain_id': 13370, 'app_contract': '0x9d40cfc42bb386b531c5d4eb3ade360f4105c4a3', 'msg_sender': '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', 'block_number': 630, 'block_timestamp': 1762711409, 'prev_randao': '0x63a2bb3993d9f9c371624f995a10a6f493e33c2535e62b32fee565f812b4c4ab', 'input_index': 0}, 'payload': '0x72616e646f6d5f74657874'}
INFO:__main__:Counter increment requested, new count value: 1
INFO:__main__:Sending finish
```

The above logs prove that out application received the advance request, increased our count value, logs the updated count value then finishes that request successfully.

As seen in the second to last line of the log, our count value has been increased from 0 to 1. To confirm this increase, we can run an inspect request once more to verify the current count value, and on running the same inspect command as last time, we obtain the updated logs below.

```shell
[INFO  rollup_http_server::http_service] received new request of type INSPECT
inspect_request.payload_length: 4
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 64 "-" "python-requests/2.31.0" 0.002048
INFO:__main__:Received finish status 200
INFO:__main__:Received inspect request data {'payload': '0x7b22227d'}
INFO:__main__:Current counter value: 1
INFO:__main__:Sending finish
2025-11-09T18:22:45.142 INF Request executed service=inspect status=Accepted application=counter
```

From the latest application logs, it's now clear that the application's count value has been increased from 0 to one, and subsequent advance calls would further increase the count value.

## Conclusion

Congratulations, you've successfully bootstrapped, implemented, ran and interacted with your first Cartesi Application.

For a more detailed version of this code, you can check the `counter` folder for your selected language in [this repository](https://github.com/Mugen-Builders/Counter-X-Marketplace-apps)
