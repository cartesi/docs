---
id: calculator
title: Build a calculator dApp
resources:
  - url: https://github.com/Mugen-Builders/calculator
    title: Source code for the Calculator dApp
---

In this tutorial, we will build a simple Calculator dApp to illustrate how requests are sent and processed within Cartesi Rollups Infrastructure.

This dApp will be written in Python.

:::note source code
The backend will be written using Python. For added flexibility, feel free to explore [the JavaScript version here](https://github.com/Mugen-Builders/calculator/tree/main/javascript).
:::

## Set up your environment

Install these to set up your environment for quick building:

- Cartesi CLI: A simple tool for building applications on Cartesi. [Install Cartesi CLI for your OS of choice](../development/installation.md).

- Docker Desktop 4.x: The tool you need to run the Cartesi Machine and its dependencies. [Install Docker for your OS of choice](https://www.docker.com/products/docker-desktop/).

- Python 3.x: This is used to write your backend application logic. [Install Python3 here](https://www.python.org/downloads/).

## Create the backend application

To create a backend application with Python, run:

```shell
cartesi create calculator --template python
```

This creates a `calculator/` directory with essential files for your Python development.

- `Dockerfile`: Contains configurations to boot a complete Cartesi machine.

- `README.md`: A markdown file.

- `dapp.py`: A Python file with template backend code that serves as your application's endpoint.

- `requirements.txt`: The Python dependencies required for your application.

Let’s review the backend code in the `dapp.py` file.

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
    logger.info("Adding notice")
    notice = {"payload": data["payload"]}
    response = requests.post(rollup_server + "/notice", json=notice)
    logger.info(f"Received notice status {response.status_code} body {response.content}")
    return "accept"

def handle_inspect(data):
    logger.info(f"Received inspect request data {data}")
    logger.info("Adding report")
    report = {"payload": data["payload"]}
    response = requests.post(rollup_server + "/report", json=report)
    logger.info(f"Received report status {response.status_code}")
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

This Python script establishes a communication loop with the Cartesi rollup server.

Two functions, `handle_advance` and `handle_inspect,` are defined to process “advance” and “inspect” requests.

The script enters an infinite loop, continually listening and sending finish requests to the rollup server.

## Build the backend application

We will use the [Python Mathematical Expression Evaluator](https://pypi.org/project/py-expression-eval/) to parse and evaluate payloads.

For example, an advance request to the backend with payload `“1+2”` will add a notice and a response of `“3”`.

In the requirements.txt file, paste the following code to install the libraries.

```python
requests == 2.31.0
py_expression_eval == 0.3.14
```

Import the Parser from `py_expression_eval,` the main class of the library, which contains the methods to parse, evaluate, and simplify mathematical expressions.

```python
from py_expression_eval import Parser
```

Payloads sent from the client are hex encoded – the utility functions below will decode a hexadecimal string into a conventional string and vice versa.

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


Update the advance request function to have a mechanism for parsing payload and sending the output as a notice to the rollup server.

def handle_advance(data):
    logger.info(f"Received advance request data {data}")

    status = "accept"
    try:
        input = hex2str(data["payload"])
        logger.info(f"Received input: {input}")

        # Evaluates expression
        parser = Parser()
        output = parser.parse(input).evaluate({})

        # Emits notice with result of calculation
        logger.info(f"Adding notice with payload: '{output}'")
        response = requests.post(rollup_server + "/notice", json={"payload": str2hex(str(output))})
        logger.info(f"Received notice status {response.status_code} body {response.content}")

    except Exception as e:
        status = "reject"
        msg = f"Error processing data {data}\n{traceback.format_exc()}"
        logger.error(msg)
        response = requests.post(rollup_server + "/report", json={"payload": str2hex(msg)})
        logger.info(f"Received report status {response.status_code} body {response.content}")

    return status
```

Here is the final code of the application:

```python
from os import environ
import traceback
import logging
import requests
from py_expression_eval import Parser

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

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

def handle_advance(data):
    logger.info(f"Received advance request data {data}")

    status = "accept"
    try:
        input = hex2str(data["payload"])
        logger.info(f"Received input: {input}")

        # Evaluates expression
        parser = Parser()
        output = parser.parse(input).evaluate({})

        # Emits notice with result of calculation
        logger.info(f"Adding notice with payload: '{output}'")
        response = requests.post(rollup_server + "/notice", json={"payload": str2hex(str(output))})
        logger.info(f"Received notice status {response.status_code} body {response.content}")

    except Exception as e:
        status = "reject"
        msg = f"Error processing data {data}\n{traceback.format_exc()}"
        logger.error(msg)
        response = requests.post(rollup_server + "/report", json={"payload": str2hex(msg)})
        logger.info(f"Received report status {response.status_code} body {response.content}")

    return status

def handle_inspect(data):
    logger.info(f"Received inspect request data {data}")
    logger.info("Adding report")
    response = requests.post(rollup_server + "/report", json={"payload": data["payload"]})
    logger.info(f"Received report status {response.status_code}")
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

With Docker running, “build your backend” application by running:

```shell
cartesi build
```

“Building” in this context installs the libraries in the `requirements.txt`, compiles your application into RISC-V architecture, and consequently builds a Cartesi machine that contains your backend application.

The anvil node can now run your application.

To run your application, enter the command:

```shell
cartesi run
```

### Sending inputs with the CLI

We can send inputs to your application with a custom JavaScript frontend, Cast, or Cartesi CLI.

To send a string encoded input to your application, run the below command:

```shell
cartesi send "1+2"
```

Example: Send `1+2` as an input to the application.

```shell
(base) user@user-MacBook-Pro calculator % cartesi send "1 + 2"
(node:64729) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
✔ Input sent: 0x1866ab903f8fa5bd712fc2d322b8c0ba119bb31d30885a06e0fe6005ff079ff2
```

<!-- <video width="100%" controls poster="/static/img/v1.3/calculatorPoster.png">
    <source src="/videos/Sunodo_Send.mp4" type="video/mp4" />
    Your browser does not support video tags.
</video> -->

## Retrieving outputs from the application

The `cartesi send generic` sends a request to the calculator application to process the computation `(1 + 2)`, this is computed and a payload (notice) containing the result is sent to the Rollup Server's `/notice` endpoint.

:::note querying notices
Notice payloads will be returned in hexadecimal format; developers will need to decode these to convert them into plain text.
:::

We can query these notices using the JSON-RPC server running on `http://127.0.0.1:6751/rpc` or with a custom frontend client.

You can retrieve all notices sent to the rollup server by executing this request on a terminal:

```bash
curl -X POST http://127.0.0.1:6751/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "cartesi_listOutputs",
    "params": {
      "application": "calculator",
      "limit": 10,
      "offset": 0
    },
    "id": 1
  }'
```

Alternatively you can make a post request to the JsonRPC server like below:

```javascript
const response = await fetch("http://127.0.0.1:6751/rpc", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "cartesi_listOutputs",
    params: {
      application: "calculator",
      limit: 10,
      offset: 0
    },
    id: 1
  })
});

const result = await response.json();

const outputs = result?.result?.data ?? [];

for (const output of outputs) {
  const decoded = output.decoded_data;
  console.log("Output payload:", decoded);
}
```

You can also [query a notice based on its input index](/cartesi-rollups/2.0/development/query-outputs/#query-a-single-notice-or-voucher).

Congratulations, you have successfully built a dApp on Cartesi Rollups!

:::info Repo Link
   You can access the complete project implementation [here](https://github.com/Mugen-Builders/docs_examples/tree/main/calculator)!
:::