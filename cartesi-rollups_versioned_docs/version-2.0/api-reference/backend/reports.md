---
id: reports
title: Reports
---

Reports are stateless logs, offering a means to record read-only information without changing the state. Primarily used for logging and diagnostic purposes, reports provide valuable insights into the operation and performance of a dApp.

Unlike notices, reports lack any association with proof and are therefore unsuitable for facilitating trustless interactions, such as on-chain processing or convincing independent third parties of dApp outcomes.

Consider a scenario within a financial dApp where users conduct transactions. In the event of a processing error, such as a failed transaction or insufficient funds, the dApp may generate a report detailing the encountered issue. This report, encapsulating relevant diagnostic data, aids developers in identifying and resolving underlying problems promptly.

Here is how you can write your application to send reports to the rollup server:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

```javascript
async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));

  try {
    // something here
  } catch (e) {
    //Send a report when there is an error
    const error = viem.stringToHex(`Error:${e}`);

    await fetch(rollup_server + "/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: error }),
    });
    return "reject";
  }

  return "accept";
}
```

</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>

```python
def handle_advance(data):
   logger.info(f"Received advance request data {data}")

   status = "accept"
   try:
       # Do something here to emit a notice

   except Exception as e:

       #  Emits report with error message here
       status = "reject"
       msg = f"Error processing data {data}\n{traceback.format_exc()}"
       logger.error(msg)
       response = requests.post(
           rollup_server + "/report", json={"payload": msg}
       )
       logger.info(
           f"Received report status {response.status_code} body {response.content}"
       )
   return status

```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
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

    let server_addr = env::var("ROLLUP_HTTP_SERVER_URL").expect("ROLLUP_HTTP_SERVER_URL not set");
    let client = hyper::Client::new();

    let response = object! {
        "payload" => payload,
    };
    let request = hyper::Request::builder()
    .method(hyper::Method::POST)
    .header(hyper::header::CONTENT_TYPE, "application/json")
    .uri(format!("{}/report", server_addr))
    .body(hyper::Body::from(response.dump()))
    .ok()?;

    let response = client.request(request).await;
    match response {
        Ok(_) => {
            println!("Report generation successful");
            Ok("accept")
        }
        Err(e) => {
            println!("Report request failed {}", e);
            Err("Report request failed {}")
        }
    }
}
```

</code></pre>
</TabItem>

</Tabs>

:::note querying reports
Frontend clients can query reports using a GraphQL API exposed by the Cartesi Nodes. [Refer to the documentation to query reports](../../development/query-outputs.md/#query-all-reports) from your dApp.
:::
