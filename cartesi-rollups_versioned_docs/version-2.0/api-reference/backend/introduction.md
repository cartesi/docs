---
id: introduction
title: Introduction
---

The backend of a Cartesi application as mentioned in the [overview section](../index.md#backend-apis) contains the applications logic and state, it interacts with the Cartesi rollups framework by retrieving request and submitting structured outputs. The application backend retrieves a new request as follows:

  - **Finish** — Called via [`/finish`](./finish.md), indicates that any previous processing has been completed and the backend is ready to handle the next request. The subsequent request is returned as the call's response and can be of the following types:

    - **Advance** — Provides input to be processed by the backend to advance the Cartesi Machine state. When processing an Advance request, the backend can call the [`/voucher`](./vouchers.md), [`/delegate-call-voucher`](./vouchers.md#delegatecall-vouchers), [`/notice`](./notices.md), and [`/report`](./reports.md) endpoints. For such requests, the input data contains both the payload and metadata, including the account address that submitted the input.

    - **Inspect** — Submits a query about the application's current state. When running inside a Cartesi Machine, this operation is guaranteed to leave the state unchanged, as the machine reverts to its exact previous condition after processing. For Inspect requests, the input data contains only a payload, and the backend can only call the [`/report`](./reports.md) endpoint.

  - **Exception** — Called by the backend when it encounters an unrecoverable error during request processing. This signals to the Rollup HTTP Server that the current request processing failed and should be terminated. See [`/exception`](./exception.md) for more details.
  
## Advance and Inspect

Here is a simple boilerplate application that handles Advance and Inspect requests:

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

<TabItem value="Rust" label="Rust" default>
<pre><code>

```rust
use json::{object, JsonValue};
use std::env;

pub async fn handle_advance(
    _client: &hyper::Client<hyper::client::HttpConnector>,
    _server_addr: &str,
    request: JsonValue,
) -> Result<&'static str, Box<dyn std::error::Error>> {
    println!("Received advance request data {}", &request);
    let _payload = request["data"]["payload"]
        .as_str()
        .ok_or("Missing payload")?;
    // TODO: add application logic here
    Ok("accept")
}

pub async fn handle_inspect(
    _client: &hyper::Client<hyper::client::HttpConnector>,
    _server_addr: &str,
    request: JsonValue,
) -> Result<&'static str, Box<dyn std::error::Error>> {
    println!("Received inspect request data {}", &request);
    let _payload = request["data"]["payload"]
        .as_str()
        .ok_or("Missing payload")?;
    // TODO: add application logic here
    Ok("accept")
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = hyper::Client::new();
    let server_addr = env::var("ROLLUP_HTTP_SERVER_URL")?;

    let mut status = "accept";
    loop {
        println!("Sending finish");
        let response = object! {"status" => status.clone()};
        let request = hyper::Request::builder()
            .method(hyper::Method::POST)
            .header(hyper::header::CONTENT_TYPE, "application/json")
            .uri(format!("{}/finish", &server_addr))
            .body(hyper::Body::from(response.dump()))?;
        let response = client.request(request).await?;
        println!("Received finish status {}", response.status());

        if response.status() == hyper::StatusCode::ACCEPTED {
            println!("No pending rollup request, trying again");
        } else {
            let body = hyper::body::to_bytes(response).await?;
            let utf = std::str::from_utf8(&body)?;
            let req = json::parse(utf)?;

            let request_type = req["request_type"]
                .as_str()
                .ok_or("request_type is not a string")?;
            status = match request_type {
                "advance_state" => handle_advance(&client, &server_addr[..], req).await?,
                "inspect_state" => handle_inspect(&client, &server_addr[..], req).await?,
                &_ => {
                    eprintln!("Unknown request type");
                    "reject"
                }
            };
        }
    }
}
```

</code></pre>
</TabItem>
</Tabs>

An **Advance** request involves sending input data to the base layer via JSON-RPC, allowing it to reach the dApp backend to change the application's state.

![img](../../../../static/img/v1.3/advance.jpg)

Here is how an advance request works in the dApp architecture:

- Step 1: Send an input to the [`addInput(address, bytes)`](../contracts/input-box.md#addinput) function of the InputBox smart contract.

- Step 2: The HTTP Rollups Server reads the data and sends it to the Cartesi Machine for processing.

- Step 3: After computation, the machine state is updated, and the results are returned to the rollup server.

An **Inspect** request involves making an external HTTP API call to the rollups server to read the dApp state without modifying it.

![img](../../../../static/img/v1.3/inspect.jpg)

You can make a simple inspect call from your frontend client to retrieve reports.

To perform an Inspect call, make an HTTP POST request to `<address of the node>/inspect/<application name or address>` with a body containing the request payload. For example:

```shell
curl -X POST http://localhost:8080/inspect/0xb483897a2790a5D1a1C5413690bC5933f269b3A9 \
  -H "Content-Type: application/json" \
  -d '"test"'
```

The payload should be a hex-encoded string starting with '0x' followed by pairs of hexadecimal numbers.

After receiving the call's response, the payload is extracted from the response data, allowing the backend code to examine it and produce outputs as **reports**.

The direct output types for **Advance** requests are [vouchers](./vouchers.md), [notices](./notices.md), and [reports](./reports.md), while **Inspect** requests generate only [reports](./reports.md).
