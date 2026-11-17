> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: counter
title: Build a Counter Application
resources:
  - url: https://github.com/Mugen-Builders/Counter-X-Marketplace-apps/tree/3ea44735b2237366208f726e36a4660c55a41f1e
    title: Source code for the Counter Application
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

<TabItem value="Python" label="Python">
<pre><code>

```shell
cartesi create counter --template python
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust">
<pre><code>

```shell
cartesi create counter --template rust
```

</code></pre>
</TabItem>

<TabItem value="Go" label="Go">
<pre><code>

```shell
cartesi create counter --template go
```

</code></pre>
</TabItem>

<TabItem value="C++" label="C++">
<pre><code>

```shell
cartesi create counter --template cpp
```

</code></pre>
</TabItem>
</Tabs>

This command creates a directory called `counter` and, depending on your selected language, this directory contains the entry point file to start your application (for example: `dapp.py` for Python, `src/main.rs` for Rust, `src/index.js` for JavaScript, `src/dapp.go` for Go, and `dapp.cpp` for C++).

This entry point file contains the default template for interacting with the Cartesi Rollups HTTP Server, it also makes available, two functions, namely `handle_advance()` and `handle_inspect()` which process "advance / write" and "inspect / read" requests to the application. In the JavaScript template, the entry point uses the [`@cartesi/rollup`](https://www.npmjs.com/package/@cartesi/rollup/v/1.0.0-alpha.3) package instead of the HTTP server, and the two functions are the `advance` and `inspect` handlers passed to `rollup.run()`. In the next section we would be updating these functions with the implementation for your application.

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

<TabItem value="Python" label="Python">
<pre><code>

<CounterPY />

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust">
<pre><code>

<CounterRS />

</code></pre>
</TabItem>

<TabItem value="Go" label="Go">
<pre><code>

<CounterGO />

</code></pre>
</TabItem>

<TabItem value="C++" label="C++">
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
Cycles: 4100356181
4100356181: 0xb68327c128474c4d782356865c214e57f2d8d370d6db790843c5f46d2fd4e6bb
Storing machine: please wait
```

The build command compiles your application then builds a Cartesi machine that contains your application.

This recently built machine alongside other necessary services, like an Anvil network, inspect service, etc. would next be started by running the command:

```bash
cartesi run
```

If the `run` command is successful, you should see logs similar to this:

```bash
user@user-MacBook-Pro counter % cartesi run
WARNING: default block is set to 'latest', production configuration will likely use 'finalized'
✔ counter starting at http://127.0.0.1:6751
✔ anvil service ready at http://127.0.0.1:6751/anvil
✔ rpc service ready at http://127.0.0.1:6751/rpc
✔ inspect service ready at http://127.0.0.1:6751/inspect/counter
✔ counter machine hash is 0xb68327c128474c4d782356865c214e57f2d8d370d6db790843c5f46d2fd4e6bb
✔ counter contract deployed at 0x0a1ea8479098f7355f6125db1b70e01b10c805a8
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

On success, we receive a confirmation response from the HTTP server, something similar to `{"status":"Accepted","reports":[],"processed_input_count":0}`, then on the terminal running our application when we press the `l` key to access our application logs we should get a log confirming that our application received the inspect call and should also contain a log of the current count value.

```bash
[INFO  rollup_http_server::http_service] received new request of type INSPECT
inspect_request.payload_length: 4
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 64 "-" "python-requests/2.31.0" 0.020544
INFO:__main__:Received finish status 200
INFO:__main__:Received inspect request data {'payload': '0x7b22227d'}
INFO:__main__:Current counter value: 0
INFO:__main__:Sending finish
2026-11-17T12:49:42.571 INF Request executed service=inspect request_id=25e4607b-5b62-4983-9134-848363f20fda status=Accepted application=counter
```

As seen in the third to last line of our received log, we can see the `count value` returned to be `0`

The JavaScript version prints the same information without the `rollup_http_server` lines, since it talks to the Cartesi Machine directly through `@cartesi/rollup`:

```bash
Received inspect request with payload 0x7b22227d
Current counter value: 0
```

### 2. Increase count value

Now that we've confirmed our count value to be zero (0), we would be sending an advance request using the CLI to increase the value of our counter by running the below command:

```bash
cartesi send random_text
```

The above command sends an advance request with the payload "random_text" to our application, which ignores this payload then proceeds to increase our count value by `one (1)`, if this command is successful and our application processes this request successfully, we should get a log similar to what's presented below on the terminal running our application:

```bash
INFO:__main__:Received advance request data {'metadata': {'chain_id': 31337, 'app_contract': '0x0a1ea8479098f7355f6125db1b70e01b10c805a8', 'msg_sender': '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f', 'block_number': 33, 'block_timestamp': 1794919789, 'prev_randao': '0x7aa4a4572391598a47f1c1ac3b2af69425e5d936c824c6ab3b86e84b95c5c8b1', 'input_index': 0}, 'payload': '0x72616e646f6d5f74657874'}
INFO:__main__:Counter increment requested, new count value: 1
INFO:__main__:Sending finish
```

In the JavaScript version, the logs for this request are:

```bash
Received advance request from 0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f with index 0 and payload 0x72616e646f6d5f74657874
Counter increment requested, new count value: 1
```

The above logs prove that our application received the advance request, increased our count value, logs the updated count value then finishes that request successfully.

As seen in the second to last line of the log, our count value has been increased from 0 to 1. To confirm this increase, we can run an inspect request once more to verify the current count value, and on running the same inspect command as last time, we obtain the updated logs below.

```shell
[INFO  rollup_http_server::http_service] received new request of type INSPECT
inspect_request.payload_length: 4
[INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 64 "-" "python-requests/2.31.0" 0.002112
INFO:__main__:Received finish status 200
INFO:__main__:Received inspect request data {'payload': '0x7b22227d'}
INFO:__main__:Current counter value: 1
INFO:__main__:Sending finish
2026-11-17T12:49:58.712 INF Request executed service=inspect request_id=f21f61c3-14f1-4fee-8b1f-d1da7d6df97f status=Accepted application=counter
```

From the latest application logs, it's now clear that the application's count value has been increased from 0 to one, and subsequent advance calls would further increase the count value.

## Conclusion

Congratulations, you've successfully bootstrapped, implemented, ran and interacted with your first Cartesi Application.

For a more detailed version of this code, you can check the `counter` folder for your selected language in [this repository](https://github.com/Mugen-Builders/Counter-X-Marketplace-apps/tree/3ea44735b2237366208f726e36a4660c55a41f1e)
