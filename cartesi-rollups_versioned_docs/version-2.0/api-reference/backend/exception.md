---
id: exception
title: Exception
---

The `/exception` endpoint is used to register an exception when the dApp cannot proceed with request processing. This should be the last method called by the dApp backend while processing a request.

When an exception occurs during request processing, the dApp backend should:
1. Call the `/exception` endpoint with a payload describing the error
2. Not make any further API calls after registering the exception
3. Exit the processing loop

The Rollup HTTP Server will:
- Skip the input with the reason [`EXCEPTION`](../jsonrpc/types.md#inputcompletionstatus)
- Forward the exception message
- Return status code 200

The exception payload should be a hex-encoded string starting with '0x' followed by pairs of hexadecimal numbers.

Let's see how a Cartesi dApp's backend handles exceptions:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

```javascript
async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));

  try {
    // Process the request
    // ...
  } catch (error) {
    // Register exception and exit
    await fetch(rollup_server + "/exception", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payload: "0x" + Buffer.from(error.message).toString("hex"),
      }),
    });
    process.exit(1);
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

   try:
       # Process the request
       # ...
   except Exception as e:
       # Register exception and exit
       response = requests.post(
           rollup_server + "/exception",
           json={"payload": "0x" + e.message.encode("utf-8").hex()},
       )
       logger.info(
           f"Received exception status {response.status_code} body {response.content}"
       )
       sys.exit(1)

   return "accept"
```

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

```rust
fn hex_to_string(hex: &str) -> Result<String, Box<dyn std::error::Error>> {
    let hexstr = hex.strip_prefix("0x").unwrap_or(hex);
    let bytes = hex::decode(hexstr).map_err(|e| Box::new(e) as Box<dyn std::error::Error>)?;
    let s = String::from_utf8(bytes).map_err(|e| Box::new(e) as Box<dyn std::error::Error>)?;
    Ok(s)
}

pub async fn handle_advance(
    _client: &hyper::Client<hyper::client::HttpConnector>,
    _server_addr: &str,
    request: JsonValue,
) -> Result<&'static str, Box<dyn std::error::Error>> {
    println!("Received advance request data {}", &request);
    let payload = request["data"]["payload"]
        .as_str()
        .ok_or("Missing payload")?;
   
    let payload_string = hex_to_string(payload);

    match payload_string {
      Ok(payload_extract) => {
        // DO SOMETHING HERE!!
      }
      Err(e) => {
        throw_execption(e.to_string()).await;
      }
    }
    Ok("accept")
}

async fn throw_execption( payload: String) -> Option<bool> {
    let hex_string = {
        let s = payload.strip_prefix("0x").unwrap_or(payload.as_str());
        hex::encode(s.as_bytes())
    };

    let server_addr = env::var("ROLLUP_HTTP_SERVER_URL").expect("ROLLUP_HTTP_SERVER_URL not set");
    let client = hyper::Client::new();

    let response = object! {
        "payload" => format!("0x{}", hex_string),
    };
    let request = hyper::Request::builder()
    .method(hyper::Method::POST)
    .header(hyper::header::CONTENT_TYPE, "application/json")
    .uri(format!("{}/exception", server_addr))
    .body(hyper::Body::from(response.dump()))
    .ok()?;

    let response = client.request(request).await;
    match response {
        Ok(_) => {
            println!("Exception generation successful");
            return Some(true);
        }
        Err(e) => {
            println!("Exception request failed {}", e);
            None
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
	infolog.Printf("Received advance request data %+v\n", data)

	// Process request. Replace with your app logic.
	if _, err := rollups.Hex2Str(data.Payload); err != nil {
		// Register exception payload and stop processing.
		exception := rollups.ExceptionRequest{
			Payload: rollups.Str2Hex(fmt.Sprintf("Error: %v", err)),
		}
		if _, sendErr := rollups.SendException(&exception); sendErr != nil {
			return fmt.Errorf("HandleAdvance: failed sending exception: %w", sendErr)
		}
		return fmt.Errorf("HandleAdvance: fatal exception: %w", err)
	}

	return nil
}
```

</code></pre>
</TabItem>

<TabItem value="C++" label="C++" default>
<pre><code>

```cpp
std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    std::cout << "Received advance request data " << data << std::endl;

    try
    {
        // Process request. Replace with your app logic.
        const std::string payload_hex = data.get("payload").get<std::string>();
        (void)hex_to_string(payload_hex);
    }
    catch (const std::exception &e)
    {
        // Register exception and stop processing.
        picojson::object exception_body;
        exception_body["payload"] = picojson::value(string_to_hex(std::string("Error: ") + e.what()));
        auto response = cli.Post(
            "/exception",
            picojson::value(exception_body).serialize(),
            "application/json"
        );
        if (!response || response->status >= 400)
        {
            std::cout << "Failed to register exception" << std::endl;
        }
        return "reject";
    }

    return "accept";
}
```

</code></pre>
</TabItem>

</Tabs>

## Notes

- This endpoint should only be called when the dApp cannot proceed with request processing
- After calling this endpoint, the dApp should not make any further API calls
- The exception payload should be a hex-encoded string starting with '0x'
- An empty payload is represented by the string '0x'
