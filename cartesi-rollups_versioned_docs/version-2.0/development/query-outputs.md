---
id: query-outputs
title: Query outputs
resources:
  - url: https://www.udemy.com/course/cartesi-masterclass/
    title: The Cartesi dApp Developer Free Course
---

In Cartesi Rollups, outputs are essential in interacting with the blockchain. The direct output types are vouchers, notices, and reports.

## Vouchers: On-chain actions

A voucher in Cartesi Rollups is a mechanism for executing on-chain actions from a dApp.

Think of it as a digital authorization ticket that enables a dApp to perform specific actions on the blockchain, such as transferring assets or approving transactions.

### How Vouchers Work:

- The dApp backend creates a voucher while executing in the Cartesi Machine.

- The voucher specifies the action, such as a token swap, and is sent to the blockchain.

- The [`CartesiDApp`](../api-reference/contracts/application.md) contract executes the voucher using the [`executeVoucher()`](../api-reference/contracts/application.md/#executevoucher) function.

- The result is recorded on the base layer through claims submitted by a consensus contract.

:::note create a voucher
[Refer to the documentation here](./asset-handling.md) for asset handling and creating vouchers in your dApp.
:::

## Notices: Off-chain events

A notice is a verifiable data declaration that attests to off-chain events or conditions and is accompanied by proof. Unlike vouchers, notices do not trigger direct interactions with other smart contracts.

They serve as a means for application to notify the blockchain about particular events.

### How Notices Work

- The application backend creates a notice containing relevant off-chain data.

- The notice is submitted to the Rollup Server as evidence of the off-chain event.

- Notices are validated on-chain using the [`validateNotice()`](../api-reference/contracts/application.md/#validatenotice) function of the [`CartesiDApp`](../api-reference/contracts/application.md) contract.

### Send a notice

Let's examine how an Application has its Advance request **calculating and returning the first five multiples of a given number**.

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
    //Do something when there is an error
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

For example, sending an input payload of `“2”` to the application using Cast or `cartesi send generic` will log:

```bash
Received finish status 200
Received advance request data {"metadata":{"chain_id":31337,"app_contract":"0xef34611773387750985673f94067ea22db406f72","msg_sender":"0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266","block_number":188,"block_timestamp":1741291197,"prev_randao":"0xa8b0097138c68949870aabe7aa4dc62a91b6dd0bc2b4582eac2be9eaee280032","input_index":0},"payload":"0x32"}
Adding notice with values 2, 4, 6, 8, 10
```

The notice can be validated and queried by any interested party.

### Query all notices

Frontend clients can use a GraphQL API exposed by the Cartesi Nodes to query the state of a Cartesi Rollups instance.

You can use the interactive in-browser GraphQL playground hosted on `http://localhost:8080/graphql/{dapp_address}` for local development. Note that you'll have to replace `{dapp_address}` with the address of your application.

In a GraphQL Playground, you typically have a section where you can input your query and variables separately. Here's how you would do it:

Input your query in the left pane:

```graphql
query notices {
  notices {
    totalCount
    edges {
      node {
        index
        input {
          index
        }
        application {
          id
          name
          address
        }
        payload
      }
    }
  }
}
```

Click the "Play" button (a triangular icon). The Playground will send the request to the server, and you'll see the response in the right pane.

<!-- <video width="100%" controls poster="/static/img/v1.3/graphqlPoster.png">
    <source src="/videos/Query_Allnotices.mp4" type="video/mp4" />
    Your browser does not support video tags.
</video> -->

Alternatively, you can use a frontend client to query all the notices of an application running in a local environment:

```javascript
async function fetchNotices() {
  const query = '{ "query": "{ notices { edges { node { payload } } } }" }';

  try {
    const response = await fetch(
      "http://localhost:8080/graphql/0x75135d8ADb7180640d29d822D9AD59E83E8695b2",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: query,
      }
    );

    const result = await response.json();

    for (const edge of result.data.notices.edges) {
      const payload = edge.node.payload;
      // Do something with the payload
    }
  } catch (error) {
    console.error("Error fetching notices:", error);
  }
}

fetchNotices();
```

You can get notices based on their `inputIndex`:

Input your query in the left pane.

```graphql
query noticesByInput($inputIndex: String!) {
  input(id: $inputIndex) {
    id
    index
    payload
    msgSender
    notices {
      edges {
        node {
          index
          input {
            index
          }
          application {
            id
            name
            address
          }
          payload
        }
      }
    }
  }
}
```

Then, in the bottom-left corner of the Playground, you'll find a section that provides variables. Click on it to expand it, and then you can input your variables like this:

```
{
  "inputIndex": "0"
}
```

Replace `123` with the value you want to pass for `$inputIndex`.

<!-- <video width="100%" controls poster="/static/img/v1.3/graphqlPoster.png">
    <source src="/videos/Query_Singlenotice.mp4" type="video/mp4" />
    Your browser does not support video tags.
</video> -->

With a JavaScript client, you can construct the GraphQL query and variables separately and send them as a JSON object in the request's body.

```javascript
const query = `
query noticesByInput($inputIndex: String!) {
  input(id: $inputIndex) {
    id
    index
    payload
    msgSender
    notices {
      edges {
        node {
          index
          input {
            index
          }
          application {
            id
            name
            address
          }
          payload
        }
      }
    }
  }
}
`;

const variables = {
  inputIndex: "0", // Replace 0 with the desired value
};

const response = await fetch(
  "http://localhost:8080/graphql/0x75135d8ADb7180640d29d822D9AD59E83E8695b2",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  }
);

const result = await response.json();
for (let edge of result.data.input.notices.edges) {
  let payload = edge.node.payload;
}
```

### Query a single notice

You can retrieve detailed information about a notice, including its proof information:

Here is the query which takes the variable: `outputIndex` and returns the details of a notice.

```graphql
query notice($outputIndex: Int!) {
  notice(outputIndex: $outputIndex) {
    index
    input {
      index
    }
    payload
    proof {
      outputIndex
      outputHashesSiblings
    }
    application {
      id
      name
      address
    }
  }
}
```

## Reports: Stateless logs

Reports serve as stateless logs, providing read-only information without affecting the state. They are commonly used for logging and diagnostics within the application.

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

</Tabs>

You can use the exposed GraphQL API to query all reports from your application.

### Query all reports

Frontend clients can use a GraphQL API exposed by the Cartesi Nodes to query the state of a Cartesi Rollups instance.

You can use the interactive in-browser GraphQL playground hosted on `http://localhost:8080/graphql/{dapp_address}` for local development.

In a GraphQL Playground, you typically have a section where you can input your query and variables separately. Here's how you would do it:

Input your query in the left pane:

```graphql
query reports {
  reports {
    totalCount
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

You can retrieve reports based on their `inputIndex`.

Input your query in the left pane:

```graphql
query reportsByInput($inputIndex: String!) {
  input(id: $inputIndex) {
    id
    index
    payload
    msgSender
    reports {
      totalCount
      edges {
        node {
          index
          input {
            index
          }
          application {
            id
            name
            address
          }
          payload
        }
      }
    }
  }
}
```

Then, in the bottom-left corner of the Playground, you'll find a section that provides variables. Click on it to expand it, and then you can input your variables like this:

```graphql
{
  "inputIndex": "0"
}
```

Replace `0` with the value you want to pass for `$inputIndex`.

### Query a single report

You can retrieve a report with its `reportIndex`.

```graphql
query report($reportIndex: Int!) {
  report(reportIndex: $reportIndex) {
    index
    input {
      index
    }
    payload
    application {
      id
      name
      address
    }
  }
}
```

Unlike Vouchers and Notices, reports are stateless and need attached proof.

## Vouchers: On-chain actions

A voucher in Cartesi Rollups is a mechanism for executing on-chain actions from an application.

Think of it as a digital authorization ticket that enables an application to perform specific actions on the blockchain, such as transferring assets or approving transactions.

### How Vouchers Work:

- The application backend creates a voucher while executing in the Cartesi Machine.

- The voucher specifies the action, such as a token swap, and is sent to the blockchain.

- The [`Application`](../api-reference/contracts/application.md) contract executes the voucher using the [`executeOutput()`](../api-reference/contracts/application.md#executeoutput) function.

- The result is recorded on the base layer through claims submitted by a consensus contract.

  :::note create a voucher
  [Refer to the documentation here](./asset-handling.md) for asset handling and creating vouchers in your application.
  :::

### Query all Vouchers

Similar to Notices and Reports the Frontend client can use a GraphQL API exposed by the Cartesi Nodes to query for voucher details from a Cartesi Rollups instance

You can use the interactive in-browser GraphQL playground hosted on `http://localhost:8080/graphql/{application_address}` for local development.

Input your query in the left pane:

```graphql
query vouchers {
  vouchers {
    totalCount
    edges {
      node {
        index
        input {
          index
        }
        destination
        payload
        value
        proof {
          outputIndex
          outputHashesSiblings
        }
        executed
        application {
          id
          name
          address
        }
      }
    }
  }
}
```

Click the "Play" button (a triangular icon). The Playground will send the request to the server, and you'll see the response in the right pane.

### Query a Voucher via it's input index

You can retrieve vouchers based on their `inputIndex`, to do that you need to, Input the below query in the left pane of the GraphQL playground:

```graphql
query voucherByInput($inputIndex: String!) {
  input(id: $inputIndex) {
    id
    index
    payload
    msgSender
    vouchers {
      totalCount
      edges {
        node {
          index
          input {
            index
          }
          destination
          payload
          value
          proof {
            outputIndex
            outputHashesSiblings
          }
          executed
          application {
            id
            name
            address
          }
        }
      }
    }
  }
}
```

Then, in the bottom-left corner of the Playground, you'll find a section that provides variables. Click on it to expand it, and then you can input your variables like this:

```graphql
{
  "inputIndex": "0"
}
```

Replace `0` with the value you want to pass for `$inputIndex`.

### Query a single Voucher

You can retrieve a report with its `reportIndex`.

```graphql
query voucher($outputIndex: Int!) {
  voucher(outputIndex: $outputIndex) {
    index
    input {
      index
    }
    destination
    payload
    proof {
      outputIndex
      outputHashesSiblings
    }
    value
    executed
    transactionHash
    application {
      id
      name
      address
    }
  }
}
```

As always remember to add the variable `$outputIndex` to the variables tab in the bottom-left corner of the playground, like this:

```graphql
{
  "outputIndex": 0
}
```
