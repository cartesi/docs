> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: notices
title: Notices
---

A notice is a verifiable data declaration that attests to off-chain events or conditions and is accompanied by proof.

Notices provide a mechanism to communicate essential off-chain events from the execution layer to the base layer in a verifiable manner.

Consider a scenario within a gaming dApp where players engage in battles. Upon the conclusion of a match, the dApp's backend generates a notice proclaiming the victorious player. This notice contains pertinent off-chain data regarding the match outcome. Once created, the notice is submitted to the rollup server as evidence of the off-chain event.

Crucially, the base layer conducts on-chain validation of these notices through the [`validateOutput()`](../contracts/application.md#validateoutput) function of the `Application` contract. Notices cannot be executed: `executeOutput()` reverts with `OutputNotExecutable` for a notice.

This validation process ensures the integrity and authenticity of the submitted notices, enabling the blockchain to verify and authenticate the declared off-chain events or conditions.

Here are sample functions you can add to your application, then call to send a notice to the rollup server (in JavaScript, `rollup.emitNotice()` from [`@cartesi/rollup`](https://www.npmjs.com/package/@cartesi/rollup/v/1.0.0-alpha.3) sends it directly to the Cartesi Machine):

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

```javascript
import { Rollup } from "@cartesi/rollup";

const rollup = new Rollup();

await rollup.run({
  advance(request) {
    const payload = request.payload.toString("utf8"); // input as a string for processing
    console.log(`Received advance request with payload ${payload}`);
    rollup.emitNotice(Buffer.from(payload, "utf8")); // notice payload as raw bytes
    return true;
  },
});
```

</code></pre>
</TabItem>

<TabItem value="Python" label="Python">
<pre><code>

```python
def handle_advance(data):
   logger.info(f"Received advance request data {data}")

   status = "accept"
   try:
       inputPayload = data["payload"]
       # Send the input payload as a notice
       response = requests.post(
           rollup_server + "/notice", json={"payload": inputPayload}
       )
       logger.info(
           f"Received notice status {response.status_code} body {response.content}"
       )
   except Exception as e:
       # Emit report with error message here
       pass
   return status
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust">
<pre><code>

```rust
pub async fn handle_advance(
    _client: &hyper::Client<hyper::client::HttpConnector>,
    _server_addr: &str,
    request: JsonValue,
) -> Result<&'static str, Box<dyn std::error::Error>> {
    println!("Received advance request data {}", &request);
    let payload = request["data"]["payload"]
        .as_str()
        .ok_or("Missing payload")?;


    emit_notice(payload.to_string()).await;
    Ok("accept")
}

async fn emit_notice(payload: String) -> Option<bool> {
    let server_addr = env::var("ROLLUP_HTTP_SERVER_URL").expect("ROLLUP_HTTP_SERVER_URL not set");
    let client = hyper::Client::new();

    let response = object! {
        "payload" => payload,
    };
    let request = hyper::Request::builder()
    .method(hyper::Method::POST)
    .header(hyper::header::CONTENT_TYPE, "application/json")
    .uri(format!("{}/notice", server_addr))
    .body(hyper::Body::from(response.dump()))
    .ok()?;

    let response = client.request(request).await;
    match response {
        Ok(_) => {
            println!("Notice generation successful");
            return Some(true);
        }
        Err(e) => {
            println!("Notice request failed {}", e);
            None
        }
    }
}
```

</code></pre>
</TabItem>

<TabItem value="Go" label="Go">
<pre><code>

```go
func HandleAdvance(data *rollups.AdvanceResponse) error {
	// Log incoming request for debugging.
	infolog.Printf("Received advance request data %+v\n", data)

	// Keep the same payload and forward it as a notice.
	notice := rollups.NoticeRequest{
		Payload: data.Payload,
	}

	if _, err := rollups.SendNotice(&notice); err != nil {
		return fmt.Errorf("HandleAdvance: failed sending notice: %w", err)
	}

	return nil
}
```

</code></pre>
</TabItem>

<TabItem value="C++" label="C++">
<pre><code>

```cpp
std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    std::cout << "Received advance request data " << data << std::endl;

    // Extract input payload and forward it as a notice.
    const std::string payload = data.get("payload").get<std::string>();
    picojson::object notice;
    notice["payload"] = picojson::value(payload);

    // Send notice to the rollup server.
    auto response = cli.Post(
        "/notice",
        picojson::value(notice).serialize(),
        "application/json"
    );

    if (!response || response->status >= 400)
    {
        std::cout << "Failed to send notice" << std::endl;
        return "reject";
    }

    return "accept";
}
```

</code></pre>
</TabItem>
</Tabs>

:::note querying notices
Frontend clients query notices through the node's JSON-RPC API, not the rollup server. See [querying outputs](../../development/query-outputs.md#query-all-notices-and-vouchers).
:::
