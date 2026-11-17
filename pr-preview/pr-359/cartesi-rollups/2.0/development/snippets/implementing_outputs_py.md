> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

```python
# Requirements (requirements.txt):
#   eth-abi==5.2.0
#   eth-utils==5.3.1
#   pycryptodome==3.23.0  # keccak backend used by eth-utils
# pycryptodome has no prebuilt riscv64 wheel, so `cartesi build` compiles it:
# add build-essential to the apt-get install command in the template's Dockerfile.
# Alternatively, add --find-links https://prototyp3-dev.github.io/pip-wheels-riscv/wheels/
# as the first line of requirements.txt to use prebuilt riscv64 wheels instead.
from os import environ
import logging
import requests
from eth_utils import function_signature_to_4byte_selector
from eth_abi import encode

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

erc20Token = "0x86EA17052C8e335Ad830B54EF566274EAB46B852"  # devnet test ERC-20 token (TestToken)


def handle_advance(data):
    logger.info(f"Received advance request data {data}")
    sender = data["metadata"]["msg_sender"]
    payload = data["payload"]  # already a 0x-prefixed hex string

    # notice and report with the input payload
    emitNotice(payload)
    emitReport(payload)

    # voucher that transfers 10 units of the token to the sender
    voucher = structure_voucher(
        "transfer(address,uint256)",
        erc20Token,
        ["address", "uint256"],
        [sender, 10],
    )
    emitVoucher(voucher)
    return "accept"

def handle_inspect(data):
    logger.info(f"Received inspect request data {data}")
    return "accept"

def structure_voucher(function_signature, destination, types, values, value=0) -> dict:
    selector = function_signature_to_4byte_selector(function_signature)
    encoded_args = encode(types, values)
    payload = "0x" + (selector + encoded_args).hex()

    return {
        "destination": destination,
        "payload": payload,
        "value": "0x" + value.to_bytes(32, "big").hex()  # 32-byte hex string
    }


def post_output(route: str, body: dict):
    try:
        response = requests.post(
            f"{rollup_server}/{route}",
            json=body,
            headers={"Content-Type": "application/json"},
            timeout=5,
        )
        logger.info(f"emit_{route} → status {response.status_code}")
    except requests.RequestException as error:
        logger.error("Error emitting %s: %s", route, error)


def emitNotice(payload_hex: str):
    post_output("notice", {"payload": payload_hex})


def emitReport(payload_hex: str):
    post_output("report", {"payload": payload_hex})


def emitVoucher(voucher: dict):
    post_output("voucher", voucher)


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
