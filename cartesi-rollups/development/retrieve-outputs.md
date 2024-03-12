---
id: retrieve-outputs
title: Retrieve outputs
tags: [notices, vouchers, reports]
resources:
   - url: https://www.udemy.com/course/the-cartesi-dapp-developer-masterclass
     title: The Cartesi dApp Developer Free Course
---

In Cartesi Rollups, outputs are essential in interacting with the blockchain. The direct output types are vouchers, notices, and reports.

## Vouchers: On-chain actions

A voucher in Cartesi Rollups is a mechanism for executing on-chain actions from a dApp.

Think of it as a digital authorization ticket that enables a dApp to perform specific actions on the blockchain, such as transferring assets or approving transactions.

Consider a DeFi application built on Cartesi where users want to swap one token for another. The Cartesi dApp generates a voucher that authorizes the on-chain smart contract to execute the swap on behalf of the user.

### How Vouchers Work:

- The dApp backend creates a voucher during its execution on the Cartesi Machine.

- The voucher specifies the action, such as a token swap, and is sent to the blockchain.

- The [`Application`](../api/json-rpc/application.md) contract validates and executes the voucher using the executeVoucher() function.

- The result is recorded on the base layer through claims submitted by a consensus contract.

## Notices: Off-chain events

A notice is a verifiable data declaration that attests to off-chain events or conditions and is accompanied by proof. Unlike vouchers, notices do not trigger direct interactions with other smart contracts.

They serve as a means for dApp to notify the blockchain about particular events.

Imagine a gaming dApp where players engage in battles. When a player wins a match off-chain, the dApp backend generates a notice declaring the winner. This notice is submitted to the blockchain, allowing on-chain validation of the match outcome.

### How Notices Work

- The dApp backend creates a notice containing relevant off-chain data.

- The notice is submitted to the Rollup Server as evidence of the off-chain event.

- On-chain validation of notices is performed using the [`validateOutput()`](../api/json-rpc/application.md/#validateoutput) function of the [`Application`](../api/json-rpc/application.md) contract.

:::note
Notices enable the dApp to communicate off-chain events without directly triggering smart contract interactions.
:::

### Send a notice

Let's look at how a Cartesi dApp has its Advance request **calculating and returning the first 5 multiples of a given number**.

We will send the output to the rollup server as a notice.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

```javascript
function calculateMultiples(num) {
  let multiples = "";
  for (let i = 1; i <= 5; i++) {
    multiples += (num * i).toString();
    if (i < 5) {
      multiples += ", ";
    }
  }
  return multiples;
}

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));

  const numberHex = data["payload"];
  const number = parseInt(viem.hexToString(numberHex));

  try {
    const multiples = calculateMultiples(number);

    console.log(`Adding notice with  value ${multiples}`);

    const hexresult = viem.stringToHex(multiples);

    await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexresult }),
    });
  } catch (error) {
    // do something when there is an error
  }

  return "accept";
}
```

</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>

```python
def hex2str(hex):
   """
   Decodes a hex string into a regular string
   """
   return bytes.fromhex(hex[2:]).decode("utf-8")

def str2hex(str):
   """
   Encodes a string as a hex string
   """
   return "0x" + str.encode("utf-8").hex()

def calculate_multiples(num):
   multiples = ""
   for i in range(1, 6):
       multiples += str(num * i)
       if i < 5:
           multiples += ", "
   return multiples

def handle_advance(data):
   logger.info(f"Received advance request data {data}")

   status = "accept"
   try:
       input = hex2str(data["payload"])
       logger.info(f"Received input: {input}")

       # Evaluates expression

       multiples = calculate_multiples(int(input))

       # Emits notice with result of calculation
       logger.info(f"Adding notice with payload: '{multiples}'")
       response = requests.post(
           rollup_server + "/notice", json={"payload": str2hex(str(multiples))}
       )
       logger.info(
           f"Received notice status {response.status_code} body {response.content}"
       )
   except Exception as e:
       #  Emits report with error message here
   return status

```

</code></pre>
</TabItem>

</Tabs>

For example, send an input payload of `“2”` to the application using Cast or `sunodo send generic` will log:

```bash
Received finish status 200
Received advance request data {"metadata":{"msg_sender":"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266","epoch_index":0,"input_index":0,"block_number":11,"timestamp":1708331280},"payload":"0x32"}
Adding notice with  value 2, 4, 6, 8, 10
```

The notice can be validated and queried by any interested party.

### Query all notices

To query the state of a Cartesi Rollups instance, frontend clients can use a GraphQL API exposed by the Cartesi Nodes.

For local development, you can use the interactive in-browser GraphQL playground hosted on `http://localhost:8080/graphql`.

In a GraphQL Playground, you typically have a section where you can input your query and variables separately. Here's how you would do it:

Input your query in the left pane:

```graphql
query notices {
  notices {
    edges {
      node {
        index
        input {
          index
        }
        payload
      }
    }
  }
}
```

Click the "Play" button (a triangular icon). The Playground will send the request to the server, and you'll see the response in the right pane.

<video width="100%" controls>
    <source src="/videos/queryAllNotices.mp4" type="video/mp4" />
    Your browser does not support the video tag.
</video>

Alternatively, you can use a frontend client to query all the notices of a dApp running in a local environment:

```javascript
async function fetchNotices() {
  const query = '{ "query": "{ notices { edges { node { payload } } } }" }';

  try {
    const response = await fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: query,
    });

    const result = await response.json();

    for (const edge of result.data.notices.edges) {
      const payload = edge.node.payload;
      // Do something with payload
    }
  } catch (error) {
    console.error("Error fetching notices:", error);
  }
}

fetchNotices();
```

### Query a single notice

You can get a notice based on its index.

Input your query in the left pane

```graphql
query noticesByInput($inputIndex: Int!) {
  input(index: $inputIndex) {
    notices {
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
  }
}
```

Then, in the bottom-left corner of the Playground, you'll find a section for providing variables. Click on it to expand it, and then you can input your variables like this:

```
{
  "inputIndex": 123
}
```

:::note
Replace `123` with the value you want to pass for `$inputIndex`.
:::

<video width="100%" controls>
    <source src="/videos/queryASingleNotice.mp4" type="video/mp4" />
    Your browser does not support the video tag.
</video>

With a JavaScript client, you can construct the GraphQL query and variables separately and send them as a JSON object in the request's body.

```javascript
const query = `
  query noticesByInput($inputIndex: Int!) {
    input(index: $inputIndex) {
      notices {
        edges {
          node {
            index
            input {
              index
            }
            payload
          }
        }
      }
    }
  }
`;

const variables = {
  inputIndex: 123, // Replace 123 with the desired value
};

const response = await fetch("http://localhost:8080/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables }),
});

const result = await response.json();
for (let edge of result.data.input.notices.edges) {
  let payload = edge.node.payload;
}
```

You can also fetch detailed information about a notice, including its proof information.

Here is the query which takes 2 variables: noticeIndex and inputIndex.

```graphql
query notice($noticeIndex: Int!, $inputIndex: Int!) {
  notice(noticeIndex: $noticeIndex, inputIndex: $inputIndex) {
    index
    input {
      index
    }
    payload
    proof {
      validity {
        inputIndexWithinEpoch
        outputIndexWithinInput
        outputHashesRootHash
        vouchersEpochRootHash
        noticesEpochRootHash
        machineStateHash
        outputHashInOutputHashesSiblings
        outputHashesInEpochSiblings
      }
      context
    }
  }
}
```

## Reports: Stateless logs

Reports serve as stateless logs, providing read-only information without affecting the state. They are commonly used for logging and diagnostics within the dApp.

Here is how you can write your application to send reports to the rollup server:

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

```javascript
async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));

  try {
    // something here
  } catch (e) {
    // send a report when there is an error
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
           rollup_server + "/report", json={"payload": str2hex(msg)}
       )
       logger.info(
           f"Received report status {response.status_code} body {response.content}"
       )
   return status

```

</code></pre>
</TabItem>

</Tabs>

You can use the exposed GraphQL API to query all reports from your dApp.

### Query all reports

To query the state of a Cartesi Rollups instance, frontend clients can use a GraphQL API exposed by the Cartesi Nodes.

For local development, you can use the interactive in-browser GraphQL playground hosted on `http://localhost:8080/graphql`.

In a GraphQL Playground, you typically have a section where you can input your query and variables separately. Here's how you would do it:

Input your query in the left pane:

```graphql
query reports {
  reports {
    edges {
      node {
        index
        input {
          index
        }
        payload
      }
    }
  }
}
```

Click the "Play" button (a triangular icon). The Playground will send the request to the server, and you'll see the response in the right pane.

### Query a single report

You can get a report based on its index.

Input your query in the left pane.

```graphql
query reportsByInput($inputIndex: Int!) {
  input(index: $inputIndex) {
    reports {
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
  }
}

```

Then, in the bottom-left corner of the Playground, you'll find a section for providing variables. Click on it to expand it, and then you can input your variables like this:

```graphql
{
  "inputIndex": 123
}
```

:::note
Replace `123` with the value you want to pass for `$inputIndex`.
:::

You can also fetch information about a report with its `reportIndex` and `inputIndex`.

```graphql
query report($reportIndex: Int!, $inputIndex: Int!) {
  report(reportIndex: $reportIndex, inputIndex: $inputIndex) {
    index
    input {
      index
    }
    payload
  }
}
```

:::note
Unlike Voucher and Notices, reports are stateless and do need come with attached proof.
:::