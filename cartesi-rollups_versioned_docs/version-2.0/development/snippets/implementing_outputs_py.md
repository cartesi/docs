```python
from os import environ
import logging
import requests
import binascii
import json
from eth_utils import function_signature_to_4byte_selector
from eth_abi import encode

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")


def handle_advance(data):
    logger.info(f"Received advance request data {data}")
    sender = data["metadata"]["msg_sender"]
    app_contract = data["metadata"]["app_contract"]
    payload = data["payload"]
    
    erc20Token = "0x784f0c076CC55EAD0a585a9A13e57c467c91Dc3a"; # Sample ERC20 token address
    
    emitNotice(payload);
    emitReport(payload);
    
    voucher = structure_voucher(
        "transferFrom(address,uint256)",
        erc20Token,
        ["address", "uint256"],
        [sender, 10],
    )
    
    emitVoucher(voucher);    
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
        "value": hex(value)
    }
    

def string_to_hex(s: str) -> str:
    return "0x" + binascii.hexlify(s.encode("utf-8")).decode()

def hex_to_string(hexstr: str) -> str:
    if not isinstance(hexstr, str):
        return ""
    if hexstr.startswith("0x"):
        hexstr = hexstr[2:]
    if hexstr == "":
        return ""
    try:
        return binascii.unhexlify(hexstr).decode("utf-8")
    except UnicodeDecodeError:
        return "0x" + hexstr
    
    
def emitReport(payload: str):
    hex_payload = string_to_hex(payload)
    try:
        response = requests.post(
            f"{rollup_server}/report",
            json={"payload": hex_payload},
            headers={"Content-Type": "application/json"},
            timeout=5,
        )
        logger.info(f"emit_report → status {response.status_code}")
    except requests.RequestException as error:
        logger.error("Error emitting report: %s", error)
        
        
def emitVoucher(voucher: dict):
    try:
        response = requests.post(
            f"{rollup_server}/voucher",
            json= voucher,
            headers={"Content-Type": "application/json"},
            timeout=5,
        )
        logger.info(f"emit_voucher → status {response.status_code}")
    except requests.RequestException as error:
        logger.error("Error emitting voucher: %s", error)

def emitNotice(payload: str):
    hex_payload = string_to_hex(payload)
    try:
        response = requests.post(
            f"{rollup_server}/notice",
            json={"payload": hex_payload},
            headers={"Content-Type": "application/json"},
            timeout=5,
        )
        logger.info(f"emit_notice → status {response.status_code}")
    except requests.RequestException as error:
        logger.error("Error emitting notice: %s", error)
        

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