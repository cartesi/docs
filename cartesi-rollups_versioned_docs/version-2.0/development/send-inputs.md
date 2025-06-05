---
id: send-inputs
title: Send inputs
resources:
  - url: https://github.com/prototyp3-dev/frontend-web-cartesi
    title: React.js + Typescript template
  - url: https://github.com/jplgarcia/cartesi-angular-frontend
    title: Angular template
---

You can send two requests to an application depending on whether you want to change or read the state.

- **Advance**: In this request, any input data changes the state of the application.

- **Inspect**: This involves making an external HTTP API call to the Cartesi Node to read the application state without changing it.

## Advance and Inspect Requests

Here is a simple boilerplate application that shows the default implementation of the handle_advance and handle_inspect functions:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

```javascript
const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
```

</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>

```python
from os import environ
import logging
import requests

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

def handle_advance(data):
   logger.info(f"Received advance request data {data}")
   return "accept"

def handle_inspect(data):
   logger.info(f"Received inspect request data {data}")
   return "accept"


handlers = {
   "advance_state": handle_advance,
   "inspect_state": handle_inspect,
}

finish = {"status": "accept"}

while True:
   logger.info("Sending finish")
   response = requests.post(rollup_server + "/finish", json=finish)
   logger.info(f"Received finish status {response.status_code}")
   if response.status_code == 202:
       logger.info("No pending rollup request, trying again")
   else:
       rollup_request = response.json()
       data = rollup_request["data"]
       handler = handlers[rollup_request["request_type"]]
       finish["status"] = handler(rollup_request["data"])

```

</code></pre>
</TabItem>

</Tabs>

As stated in the [creating an application section](./creating-an-application.md#implementing-your-application-logic), a typical Cartesi backend application has two primary functions, `handle_advance` and `handle_inspect,` these are defined to handle the two different types of requests.

Your application listens to rollup requests, handles them asynchronously using defined handler functions, and communicates the completion status to the rollup server.

Every starter project you create has this base code as a template, ready to receive inputs!

### Initiate an advance request

You can initiate an advance request by sending input from the CLI using Cast, Cartesi CLI, or a custom frontend client.

Advance requests involve sending input data to the L1 through a JSON-RPC call, allowing the information to reach the applciation backend and trigger a change in the application's state.

![img](../../../static/img/v1.3/advance.jpg)

In the application architecture, here is how an advance request plays out.

- Step 1: Send an input to the [`addInput(address, bytes)`](../api-reference/contracts/input-box.md#addinput) function of the InputBox smart contract.

- Step 2: The Cartesi Node reads the data and gives it to the Cartesi machine for processing.

- Step 3: After the computation, the state is updated, and the results are sent back to the rollup server.

You can send inputs to your application with [Cast](https://book.getfoundry.sh/cast/), Cartesi CLI, or a custom web interface.

#### 1. Send inputs with Cast

```shell
cast send <InputBoxAddress> "addInput(address,bytes)" <ApplicationAddress> <EncodedPayload> --mnemonic <MNEMONIC>
```

This command sends the payload to the InputBox smart contract, initiating the advance request.

Replace placeholders like `<InputBoxAddress>`, `<ApplicationAddress>`, `<EncodedPayload>`, and `<MNEMONIC>` with the actual addresses, payload, and mnemonic for your specific use case.

You can obtain the relevant addresses by running `cartesi address-book`.

#### 2. Send inputs with Cartesi CLI

Cartesi CLI provides a convenient way of sending inputs to an application.

To send an input, you could use the interactive or the direct option, for the interactive option run:

```shell
cartesi send
```

Response:

```shell
$ cartesi send
? Select the type of input to send (Use arrow keys)
❯ generic
  erc20
  erc721
  ether
```

There are five types of inputs using a sub-command: `erc20`, `erc721`, `ether`, `generic`.

Unlike the asset-type sub-commands (Ether, ERC20, and ERC721), the generic input command allows you to send inputs with any payload format (hex, string, and ABI).

```shell
$ cartesi send generic
✔ Select the type of input to send generic
✔ Wallet Mnemonic
✔ Mnemonic test test test test test test test test test test test junk
✔ Account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 9993.999194554374748191 ETH
✔ Application address 0xb483897a2790a5D1a1C5413690bC5933f269b3A9
✔ Input String encoding
✔ Input (as string) 32.9
✔ Input sent: 0x048a25e6341234b8102f7676b3a8defb947559125197dbd45cfa3afa451a93fd
```

:::note Interacting with Sample application?
Replacing the above dapp address `0xb48..3A9` with the application address from deploying the sample application in the [creating an application section](./creating-an-application.md#implementing-your-application-logic), would emit a notice, voucher and report which can all be quarried using the JSON RPC or GraphQl server.
:::

#### 3. Send inputs via a custom web app

You can create a custom frontend that interacts with your application.

Follow [the React.js tutorial to build a frontend for your application](../tutorials/react-frontend-application.md).

### Make Inspect calls

Inspect requests are directly made to the rollup server, and the Cartesi Machine is activated without modifying its state.

:::caution Inspect requests
Inspect requests are best suited for non-production use, such as debugging and testing. They may not function reliably in production environments, potentially leading to errors or disruptions.
:::

![img](../../../static/img/v1.3/inspect.jpg)

You can make a simple inspect call from your frontend client to retrieve reports.

To perform an Inspect call, use an HTTP POST request to `<address of the node>/inspect/<application name or address>` with a body containing the request payload. For example:

```shell
curl -X POST http://localhost:8080/inspect/0xb483897a2790a5D1a1C5413690bC5933f269b3A9 \
  -H "Content-Type: application/json" \
  -d '"test"'
```

Once the call's response is received, the payload is extracted from the response data, allowing the backend code to examine it and produce outputs as **reports**.

From a frontend client, here is an example of extracting the payload from an inspect request:

```javascript
const response = await fetch("http://localhost:8080/inspect/0xb483897a2790a5D1a1C5413690bC5933f269b3A9", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify("test")
});

const result = await response.json();

for (let i in result.reports) {
  let payload = result.reports[i].payload;
  console.log("Report Payload:", payload);
}

```

:::note Interacting with Sample application?
Replacing the above address `0xb48..3A9` with the application address from deploying the sample application in the [creating an application](./creating-an-application.md#implementing-your-application-logic), then executing the inspect command would emit a report which would immediately be logged to the CLI and can also be quarried using the JSON RPC or GraphQl server.
:::