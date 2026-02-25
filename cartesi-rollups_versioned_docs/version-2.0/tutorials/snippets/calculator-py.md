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


def hex2str(hex_value):
    return bytes.fromhex(hex_value[2:]).decode("utf-8")


def str2hex(text):
    return "0x" + text.encode("utf-8").hex()


def handle_advance(data):
    logger.info(f"Received advance request data {data}")
    status = "accept"
    try:
        expression = hex2str(data["payload"])
        parser = Parser()
        output = parser.parse(expression).evaluate({})
        response = requests.post(
            rollup_server + "/notice",
            json={"payload": str2hex(str(output))}
        )
        logger.info(f"Received notice status {response.status_code} body {response.content}")
    except Exception:
        status = "reject"
        msg = f"Error processing data {data}\n{traceback.format_exc()}"
        logger.error(msg)
        response = requests.post(
            rollup_server + "/report",
            json={"payload": str2hex(msg)}
        )
        logger.info(f"Received report status {response.status_code} body {response.content}")
    return status


def handle_inspect(data):
    logger.info(f"Received inspect request data {data}")
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
        handler = handlers[rollup_request["request_type"]]
        finish["status"] = handler(rollup_request["data"])
```
