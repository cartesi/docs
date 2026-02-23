```python
import json
import logging
import os

import requests

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

ROLLUP_HTTP_SERVER_URL = os.environ["ROLLUP_HTTP_SERVER_URL"]
ZERO_HASH = "0x" + ("00" * 32)


def payload_hex_to_bytes(payload):
    if payload.startswith("0x"):
        payload = payload[2:]
    return bytes.fromhex(payload)


def emit_ether_voucher(recipient, amount_wei):
    """
    Emit an Ether transfer voucher.

    Per Cartesi docs for Ether transfer:
    - destination: recipient address
    - payload: zero hash (no function call)
    - value: Ether amount as hex (without 0x prefix)
    """
    recipient = recipient.lower().strip()
    value_hex = hex(int(amount_wei))[2:]

    voucher = {
        "destination": recipient,
        "payload": ZERO_HASH,
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
