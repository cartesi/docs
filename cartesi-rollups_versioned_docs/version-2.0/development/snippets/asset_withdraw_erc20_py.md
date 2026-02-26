```python
import json
import logging
import os

import requests

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

ROLLUP_HTTP_SERVER_URL = os.environ["ROLLUP_HTTP_SERVER_URL"]
TOKEN_ADDRESS = "0x5138f529b77b4e0a7c84b77e79c4335d31938fed"


def payload_hex_to_bytes(payload):
    if payload.startswith("0x"):
        payload = payload[2:]
    return bytes.fromhex(payload)


def encode_erc20_transfer(recipient, amount):
    recipient = recipient.lower().strip()
    if recipient.startswith("0x"):
        recipient = recipient[2:]

    selector = bytes.fromhex("a9059cbb")  # transfer(address,uint256)
    recipient_word = bytes.fromhex("00" * 12 + recipient)
    amount_word = int(amount).to_bytes(32, byteorder="big")
    return "0x" + (selector + recipient_word + amount_word).hex()


def emit_transfer_voucher(token_address, recipient, amount):
    voucher = {
        "destination": token_address.lower().strip(),
        "payload": encode_erc20_transfer(recipient, amount),
    }
    response = requests.post(ROLLUP_HTTP_SERVER_URL + "/voucher", json=voucher)
    return response.status_code


def handle_advance(data):
    command_raw = payload_hex_to_bytes(data["payload"]).decode("utf-8")
    command = json.loads(command_raw)

    amount = int(command["amount"])
    recipient = command.get("recipient") or data["metadata"]["msg_sender"]

    status = emit_transfer_voucher(TOKEN_ADDRESS, recipient, amount)
    logger.info("Voucher POST status=%s", status)
    return "accept"
```
