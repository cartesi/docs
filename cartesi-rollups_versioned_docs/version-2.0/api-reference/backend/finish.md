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
