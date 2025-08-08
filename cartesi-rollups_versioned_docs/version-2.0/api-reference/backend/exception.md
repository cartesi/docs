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

</Tabs>

## Notes

- This endpoint should only be called when the dApp cannot proceed with request processing
- After calling this endpoint, the dApp should not make any further API calls
- The exception payload should be a hex-encoded string starting with '0x'
- An empty payload is represented by the string '0x'
