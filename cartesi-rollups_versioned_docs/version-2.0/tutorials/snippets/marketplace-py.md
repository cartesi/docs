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

ZERO_ADDRESS = "0x" + "0" * 40


def norm_addr(addr: str) -> str:
    return addr.lower()

def as_int(v) -> int:
    # token IDs can be numbers, decimal strings or 0x-prefixed hex strings
    if isinstance(v, int):
        return v
    if isinstance(v, str) and v.strip().lower().startswith("0x"):
        return int(v, 16)
    return int(v)

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

def token_deposit_parse(payload_hex: str):
    # ERC-20 and ERC-721 deposits start with the same packed fields:
    # token (20 bytes), sender (20 bytes), amount or token ID (32 bytes)
    hexstr = payload_hex[2:] if payload_hex.startswith("0x") else payload_hex
    b = binascii.unhexlify(hexstr)

    if len(b) < 20 + 20 + 32:
        raise ValueError(f"payload too short: {len(b)} bytes")

    token = b[0:20]
    receiver = b[20:40]
    amount_be = b[40:72]

    return {
        "token": "0x" + token.hex(),
        "receiver": "0x" + receiver.hex(),
        "amount": int.from_bytes(amount_be, byteorder="big", signed=False),
    }

def extract_field(obj: dict, field: str) -> str:
    v = obj.get(field, None)
    if isinstance(v, str) and v.strip() != "":
        return v
    raise ValueError(f"Missing or invalid {field} field in payload")


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


def emitNotice(payload: str):
    hex_payload = string_to_hex(payload)
    response = requests.post(
        f"{rollup_server}/notice",
        json={"payload": hex_payload},
        headers={"Content-Type": "application/json"},
        timeout=5,
    )
    logger.info(f"notice → status {response.status_code}")
    response.raise_for_status()

def structure_voucher(function_signature, destination, types, values, value=0) -> dict:
    selector = function_signature_to_4byte_selector(function_signature)
    encoded_args = encode(types, values)
    payload = "0x" + (selector + encoded_args).hex()

    return {
        "destination": destination,
        "payload": payload,
        "value": f"0x{value:064x}"
    }

def emitVoucher(voucher: dict):
    response = requests.post(
        f"{rollup_server}/voucher",
        json= voucher,
        headers={"Content-Type": "application/json"},
        timeout=5,
    )
    logger.info(f"emit_voucher → status {response.status_code}")
    response.raise_for_status()

class Storage:
    def __init__(self, erc721_portal_address: str, erc20_portal_address: str,
                 erc721_token: str, erc20_token: str, list_price: int):

        self.erc721_portal_address = norm_addr(erc721_portal_address)
        self.erc20_portal_address = norm_addr(erc20_portal_address)
        self.erc721_token = norm_addr(erc721_token)
        self.erc20_token = norm_addr(erc20_token)
        self.application_address = ZERO_ADDRESS
        self.list_price = list_price

        self.listed_tokens: list[int] = []
        self.users_erc20_token_balance: dict[str, int] = {}
        self.user_erc721_token_balance: dict[str, list[int]] = {}
        self.erc721_id_to_owner_address: dict[int, str] = {}

    def getListedTokens(self):
        return self.listed_tokens

    def getAppAddress(self):
        return self.application_address

    def setAppAddress(self, app_addr):
        self.application_address = norm_addr(app_addr)

    def getERC721TokenOwner(self, tokenId: int):
        return self.erc721_id_to_owner_address.get(as_int(tokenId))

    def getUserERC20TokenBalance(self, userAddress: str) -> int:
        addr = norm_addr(userAddress)
        return self.users_erc20_token_balance.get(addr, 0)

    def increaseUserBalance(self, userAddress: str, amount):
        addr = norm_addr(userAddress)
        amt = as_int(amount)
        current = self.users_erc20_token_balance.get(addr, 0)
        self.users_erc20_token_balance[addr] = current + amt

    def reduceUserBalance(self, userAddress: str, amount):
        addr = norm_addr(userAddress)
        amt = as_int(amount)
        current = self.users_erc20_token_balance.get(addr, 0)
        if current < amt:
            raise ValueError(f"User {addr} has insufficient balance")
        self.users_erc20_token_balance[addr] = current - amt

    def depositERC721Token(self, userAddress: str, tokenId):
        addr = norm_addr(userAddress)
        tid = as_int(tokenId)

        previous_owner = self.getERC721TokenOwner(tid)

        if previous_owner and norm_addr(previous_owner) == ZERO_ADDRESS:
            self.changeERC721TokenOwner(tid, addr, ZERO_ADDRESS)
        else:
            self.erc721_id_to_owner_address[tid] = addr
            tokens = self.user_erc721_token_balance.get(addr, [])
            if tid not in tokens:
                tokens.append(tid)
            self.user_erc721_token_balance[addr] = tokens

    def listTokenForSale(self, tokenId):
        tid = as_int(tokenId)
        if tid not in self.listed_tokens:
            self.listed_tokens.append(tid)

    def changeERC721TokenOwner(self, tokenId, newOwner: str, oldOwner: str):
        tid = as_int(tokenId)
        new_addr = norm_addr(newOwner)
        old_addr = norm_addr(oldOwner)

        self.erc721_id_to_owner_address[tid] = new_addr

        new_tokens = self.user_erc721_token_balance.get(new_addr, [])
        if tid not in new_tokens:
            new_tokens.append(tid)
        self.user_erc721_token_balance[new_addr] = new_tokens

        old_tokens = self.user_erc721_token_balance.get(old_addr, [])
        self.user_erc721_token_balance[old_addr] = [i for i in old_tokens if i != tid]

    def purchaseERC721Token(self, buyerAddress: str, tokenId):
        tid = as_int(tokenId)

        if tid not in self.listed_tokens:
            raise ValueError(f"Token {self.erc721_token} with id {tid} is not for sale")

        owner = self.getERC721TokenOwner(tid)
        if not owner:
            raise ValueError(f"Token owner for token {self.erc721_token} with id {tid} not found")

        self.reduceUserBalance(buyerAddress, self.list_price)
        self.increaseUserBalance(owner, self.list_price)
        # the NFT leaves the marketplace with the voucher below
        self.changeERC721TokenOwner(tid, ZERO_ADDRESS, owner)
        self.listed_tokens = [i for i in self.listed_tokens if i != tid]


erc_721_portal_address = "0x397c352d18DFf47CC8a6143403142cf7afd5Ff7E"
erc20_portal_address   = "0x3332DE61a8BB9aC84893b2f552Fe81C9a6dC5419"
erc20_token            = "0x86EA17052C8e335Ad830B54EF566274EAB46B852"
erc721_token           = "0x0761b8e3aB06F458632974393C48765E6Ddc61bB"
list_price             = 100_000_000_000_000_000_000

storage = Storage(erc_721_portal_address, erc20_portal_address, erc721_token, erc20_token, list_price)


def handle_erc20_deposit(depositor_address: str, amount_deposited, token_address: str):
    if norm_addr(token_address) != storage.erc20_token:
        raise ValueError("Unsupported token deposited")
    storage.increaseUserBalance(depositor_address, as_int(amount_deposited))
    logger.info("Token deposit processed successfully")


def handle_erc721_deposit(depositor_address: str, token_id, token_address: str):
    if norm_addr(token_address) != storage.erc721_token:
        raise ValueError("Unsupported token deposited")
    storage.depositERC721Token(depositor_address, as_int(token_id))
    storage.listTokenForSale(token_id)
    logger.info("Token deposit and listing processed successfully")
    emitNotice(f"Token ID: {token_id} Deposited by User: {depositor_address}")


def handle_purchase_token(caller_address: str, payload_obj: dict):
    token_id = as_int(extract_field(payload_obj, "token_id"))
    storage.purchaseERC721Token(caller_address, token_id)
    logger.info("Token purchased successfully")

    # The application contract holds the deposited NFTs and executes the
    # voucher, so it is the `from` address of the transfer
    voucher = structure_voucher(
        "transferFrom(address,address,uint256)",
        storage.erc721_token,
        ["address", "address", "uint256"],
        [storage.application_address, norm_addr(caller_address), token_id],
    )
    emitVoucher(voucher)
    logger.info("Voucher generation successful")


def handle_advance(data):
    logger.info(f"Received advance request data {data}")

    sender = norm_addr(data["metadata"]["msg_sender"])
    app_contract = norm_addr(data["metadata"]["app_contract"])

    if storage.application_address == ZERO_ADDRESS:
        storage.setAppAddress(app_contract)

    payload_hex = data.get("payload", "")

    try:
        if sender == storage.erc20_portal_address:
            parsed = token_deposit_parse(payload_hex)
            handle_erc20_deposit(parsed["receiver"], parsed["amount"], parsed["token"])

        elif sender == storage.erc721_portal_address:
            parsed = token_deposit_parse(payload_hex)
            handle_erc721_deposit(parsed["receiver"], parsed["amount"], parsed["token"])

        else:
            try:
                payload_obj = json.loads(hex_to_string(payload_hex))
            except ValueError:
                raise ValueError("Invalid payload JSON")

            method = payload_obj.get("method") if isinstance(payload_obj, dict) else None
            if method == "purchase_token":
                handle_purchase_token(sender, payload_obj)
            else:
                raise ValueError("Unsupported method called!!")
        return "accept"
    except Exception as error:
        # invalid requests are rejected with a report: they never stop the application
        logger.error(f"Error processing advance request: {error}")
        emitReport(str(error))
        return "reject"


def handle_inspect(data: dict):
    logger.info(f"Received inspect request data {data}")

    payload_str = hex_to_string(data.get("payload", "0x"))
    try:
        payload_obj = json.loads(payload_str)
    except ValueError:
        emitReport("Invalid payload JSON")
        return "accept"

    try:
        method = payload_obj.get("method") if isinstance(payload_obj, dict) else None
        if method == "get_user_erc20_balance":
            user_address = payload_obj.get("user_address", "")
            bal = storage.getUserERC20TokenBalance(user_address)
            emitReport(f"User: {user_address} Balance: {bal}")
        elif method == "get_token_owner":
            # the token ID can be a JSON number or a string
            token_id = as_int(payload_obj.get("token_id"))
            owner = storage.getERC721TokenOwner(token_id)
            emitReport(f"Token_id: {token_id} owner: {owner if owner else 'None'}")
        elif method == "get_all_listed_tokens":
            listed = storage.getListedTokens()
            emitReport("All listed tokens are: " + ",".join(map(str, listed)))
        else:
            logger.info("Unsupported inspect method")
            emitReport("Unsupported inspect method")
        return "accept"
    except Exception as error:
        emitReport(str(error))
        return "reject"


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
