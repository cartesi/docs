---
id: finish
title: Finish
---

The `/finish` endpoint is used to indicate that any previous processing has been completed and the backend is ready to handle the next request. The subsequent request is returned as the call's response.

The dApp backend should call the `/finish` endpoint to start processing rollup requests. The Rollup HTTP Server returns the next rollup request in the response body.

The possible values for the `request_type` field are:
- `'advance_state'` - For requests that modify the dApp state
- `'inspect_state'` - For read-only queries about the dApp state

For advance-state requests, the input data contains:
- The advance-state metadata (including the account address that submitted the input)
- The payload

For inspect-state requests, the input data contains only the payload.

After processing a rollup request, the dApp backend should call the `/finish` endpoint again. For advance-state requests, depending on the processing result, it should set the `status` field to either `'accept'` or `'reject'`. The status field is ignored for inspect-state requests.

If an advance-state request is rejected:
- Any vouchers and notices generated during processing are discarded
- Reports are not discarded
- The state is reverted to its previous condition

During a finish call, the next rollup request might not be immediately available. In this case:
- The Rollup HTTP Server returns status code 202
- When receiving status 202, the dApp backend should retry the finish call with the same arguments

Let's see how a Cartesi dApp's backend processes requests using the finish endpoint:

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
      body: JSON.stringify(finish),
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
        let response = object! {"status" => status};
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

<TabItem value="Go" label="Go" default>
<pre><code>

```go
func HandleAdvance(data *rollups.AdvanceResponse) error {
	// Add your state-changing logic here.
	infolog.Printf("Received advance request data %+v\n", data)
	return nil
}

func HandleInspect(data *rollups.InspectResponse) error {
	// Add your read-only logic here.
	infolog.Printf("Received inspect request data %+v\n", data)
	return nil
}

func main() {
	finish := rollups.FinishRequest{Status: "accept"}

	for {
		infolog.Println("Sending finish")
		res, err := rollups.SendFinish(&finish)
		if err != nil {
			errlog.Panicln("Error calling /finish:", err)
		}

		if res.StatusCode == 202 {
			infolog.Println("No pending rollup request, trying again")
			continue
		}

		// Parse next request and dispatch to the correct handler.
		response, err := rollups.ParseFinishResponse(res)
		if err != nil {
			errlog.Panicln("Error parsing finish response:", err)
		}

		finish.Status = "accept"
		if response.Type == "advance_state" {
			data := new(rollups.AdvanceResponse)
			_ = json.Unmarshal(response.Data, data)
			if err = HandleAdvance(data); err != nil {
				finish.Status = "reject"
			}
		} else if response.Type == "inspect_state" {
			data := new(rollups.InspectResponse)
			_ = json.Unmarshal(response.Data, data)
			_ = HandleInspect(data)
		}
	}
}
```

</code></pre>
</TabItem>

<TabItem value="C++" label="C++" default>
<pre><code>

```cpp
std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    // Add your state-changing logic here.
    std::cout << "Received advance request data " << data << std::endl;
    return "accept";
}

std::string handle_inspect(httplib::Client &cli, picojson::value data)
{
    // Add your read-only logic here.
    std::cout << "Received inspect request data " << data << std::endl;
    return "accept";
}

int main(int argc, char **argv)
{
    std::map<std::string, decltype(&handle_advance)> handlers = {
        {"advance_state", &handle_advance},
        {"inspect_state", &handle_inspect},
    };

    httplib::Client cli(getenv("ROLLUP_HTTP_SERVER_URL"));
    std::string status = "accept";

    while (true)
    {
        // Request next rollup input.
        auto finish_body = std::string("{\"status\":\"") + status + "\"}";
        auto response = cli.Post("/finish", finish_body, "application/json");
        if (!response)
        {
            continue;
        }

        if (response->status == 202)
        {
            std::cout << "No pending rollup request, trying again" << std::endl;
            continue;
        }

        // Dispatch to advance/inspect handlers.
        picojson::value req;
        picojson::parse(req, response->body);
        auto request_type = req.get("request_type").get<std::string>();
        auto data = req.get("data");
        status = handlers[request_type](cli, data);
    }
}
```

</code></pre>
</TabItem>

</Tabs>

## Notes

- The `/finish` endpoint must be called after processing each request to indicate readiness for the next one
- For advance state requests, the status field determines whether the request is accepted or rejected
- For inspect state requests, the status field is ignored
- If an advance state request is rejected:
  - Any vouchers and notices generated during processing are discarded
  - Reports are not discarded
  - The state is reverted to its previous condition
- During a finish call, the next rollup request might not be immediately available:
  - The Rollup HTTP Server returns status code 202
  - When receiving status 202, the dApp backend should retry the finish call with the same arguments
