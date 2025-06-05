---
id: notices
title: Notices
---

A notice is a verifiable data declaration that attests to off-chain events or conditions and is accompanied by proof.

Notices provide a mechanism to communicate essential off-chain events in the execution layer to the base layer in a verifiable manner.

Consider a scenario within a gaming dApp where players engage in battles. Upon the conclusion of a match, the dApp's backend generates a notice proclaiming the victorious player. This notice contains pertinent off-chain data regarding the match outcome. Once created, the notice is submitted to the rollup server as evidence of the off-chain event.

Crucially, the base layer conducts on-chain validation of these notices through the [`validateNotice()`](../json-rpc/application.md/#validatenotice) function of the `CartesiDApp` contract.

This validation process ensures the integrity and authenticity of the submitted notices, enabling the blockchain to verify and authenticate the declared off-chain events or conditions.

Here are sample functions you can add to your application, then call to send a notice to the rollup server:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

```javascript
import { stringToHex, hexToString } from "viem";

const emitNotice = async (inputPayload) => {
  let hexPayload = stringToHex(inputPayload); // convert payload from string to hex 
  try {
    await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexPayload }),
    });
  } catch (error) {
    //Do something when there is an error
  }
}

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  const payload = hexToString(data.payload); // convert input from hex to string for processing
  await emitNotice(payload);
  return "accept";
}

```

</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>

```python
# Notice creation Process from a message string
def emit_notice(message):
    notice_payload = {"payload": "0x" + message.encode("utf-8").hex()}
    response = requests.post(rollup_server + "/notice", json=notice_payload)
    if response.status_code == 200 or response.status_code == 201:
        logger.info(f"Notice emitted successfully with data: {notice_payload}")
    else:
        logger.error(f"Failed to emit Notice with data: {notice_payload}. Status code: {response.status_code}")

emit_notice("hello world")
```

</code></pre>
</TabItem>

</Tabs>

:::note querying notices
Frontend clients can query notices using a GraphQL API exposed by the Cartesi Nodes. [Refer to the documentation here](../../development/query-outputs.md/#query-all-reports) to query notices from the rollup server.
:::
