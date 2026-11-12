```python
import json
import logging
import os

import requests

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

ROLLUP_HTTP_SERVER_URL = os.environ["ROLLUP_HTTP_SERVER_URL"]
EMPTY_PAYLOAD = "0x"


def payload_hex_to_bytes(payload):
    if payload.startswith("0x"):
        payload = payload[2:]
    return bytes.fromhex(payload)


def emit_ether_voucher(recipient, amount_wei):
    """
    Emit an Ether transfer voucher.

    Per Cartesi docs for Ether transfer:
    - destination: recipient address
    - payload: empty (no function call)
    - value: Ether amount in wei, as a 0x-prefixed 32-byte hex string
    """
    recipient = recipient.lower().strip()
    value_hex = "0x" + int(amount_wei).to_bytes(32, "big").hex()

    voucher = {
        "destination": recipient,
        "payload": EMPTY_PAYLOAD,
        "value": value_hex,
    }
    response = requests.post(ROLLUP_HTTP_SERVER_URL + "/voucher", json=voucher)
    return response.status_code


def handle_advance(data):
    """
    Expected payload JSON (hex-encoded UTF-8):
    {"amount_wei":"1000000000000000","recipient":"0x...optional"}
    """
    command_raw = payload_hex_to_bytes(data["payload"]).decode("utf-8")
    command = json.loads(command_raw)

    amount_wei = int(command["amount_wei"])
    recipient = command.get("recipient") or data["metadata"]["msg_sender"]

    status = emit_ether_voucher(recipient, amount_wei)
    logger.info("Ether voucher POST status=%s", status)
    return "accept"
```
