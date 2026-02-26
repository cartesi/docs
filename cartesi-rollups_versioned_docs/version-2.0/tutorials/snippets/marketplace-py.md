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


def norm_addr(addr: str) -> str:
    return addr.lower()

def as_int(v) -> int:
    return v if isinstance(v, int) else int(v)

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
    hexstr = payload_hex[2:] if payload_hex.startswith("0x") else payload_hex
    b = binascii.unhexlify(hexstr)

    if len(b) < 20 + 20 + 32:
        logger.error(f"payload too short: {len(b)} bytes")
        return

    token = b[0:20]
    receiver = b[20:40]
    amount_be = b[40:72]

    val = int.from_bytes(amount_be, byteorder="big", signed=False)

    token_hex = "0x" + token.hex()
    receiver_hex = "0x" + receiver.hex()
    return {
        "token": token_hex,
        "receiver": receiver_hex,
        "amount": str(val), 
    }

def extract_field(obj: dict, field: str) -> str:
    v = obj.get(field, None)
    if isinstance(v, str) and v.strip() != "":
        return v
    else:
        logger.error(f"Missing or invalid {field} field in payload")
        return


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
    try:
        response = requests.post(
            f"{rollup_server}/notice",
            json={"payload": hex_payload},
            headers={"Content-Type": "application/json"},
            timeout=5,
        )
        logger.info(f"notice → status {response.status_code}")
    except requests.RequestException as error:
        logger.error("Error emitting notice: %s", error)

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

class Storage:
    def __init__(self, erc721_portal_address: str, erc20_portal_address: str,
                 erc721_token: str, erc20_token: str, list_price: int):
        
        self.erc721_portal_address = norm_addr(erc721_portal_address)
        self.erc20_portal_address = norm_addr(erc20_portal_address)
        self.erc721_token = norm_addr(erc721_token)
        self.erc20_token = norm_addr(erc20_token)
        self.application_address = norm_addr("0x" + "0" * 40)
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
        current = self.users_erc20_token_balance.get(addr, None)

        if current is None:
            emitReport(f"User {addr} record not found")
            logger.error("User balance record not found")
            return False

        if current < amt:
            emitReport(f"User {addr} has insufficient balance")
            logger.error("User has insufficient balance")
            return False

        self.users_erc20_token_balance[addr] = current - amt
        return True

    def depositERC721Token(self, userAddress: str, tokenId):
        addr = norm_addr(userAddress)
        tid = as_int(tokenId)
        zero_addr = "0x" + "0" * 40;

        previous_owner: str = self.getERC721TokenOwner(tid);
        
        if previous_owner and norm_addr(previous_owner) == norm_addr(zero_addr):
            self.changeERC721TokenOwner(tid, addr, zero_addr);
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

    def purchaseERC721Token(self, buyerAddress: str, erc721TokenAddress: str, tokenId) -> bool:
        tid = as_int(tokenId)

        if not  tokenId in self.listed_tokens:
            emitReport(f"Token {erc721TokenAddress} with id {tid} is not for sale")
            logger.error("Token is not for sale")
            return False

        if not self.reduceUserBalance(buyerAddress, self.list_price):
            emitReport(f"Buyer {buyerAddress} has insufficient balance to purchase token {erc721TokenAddress} with id {tid}")
            logger.error("Buyer has insufficient balance")
            return False

        owner = self.getERC721TokenOwner(tid)
        if not owner:
            emitReport(f"Token owner for token {erc721TokenAddress} with id {tid} not found")
            logger.error("Token owner not found")
            return False

        zero_address = norm_addr("0x" + "0" * 40)
        self.increaseUserBalance(owner, self.list_price)
        self.listed_tokens = [i for i in self.listed_tokens if i != tid]
        self.changeERC721TokenOwner(tid, zero_address, owner)
        return True


erc_721_portal_address = "0x9E8851dadb2b77103928518846c4678d48b5e371"
erc20_portal_address   = "0xACA6586A0Cf05bD831f2501E7B4aea550dA6562D"
erc20_token            = "0x5138f529B77B4e0a7c84B77E79c4335D31938fed"
erc721_token           = "0x1c5AB37576Af4e6BEeCB66Fa6a9FdBc608F44B78"
list_price             = 100_000_000_000_000_000_000

storage = Storage(erc_721_portal_address, erc20_portal_address, erc721_token, erc20_token, list_price)


def handle_erc20_deposit(depositor_address: str, amount_deposited, token_address: str):
    if norm_addr(token_address) == storage.erc20_token:
        try:
            storage.increaseUserBalance(depositor_address, as_int(amount_deposited))
        except Exception as e:
            logger.error("Error handling ERC20 deposit: %s", e)
            emitReport(str(e))
    else:
        emitReport("Unsupported token deposited")


def handle_erc721_deposit(depositor_address: str, token_id, token_address: str):
    if norm_addr(token_address) == storage.erc721_token:
        try:
            storage.depositERC721Token(depositor_address, as_int(token_id))
            storage.listTokenForSale(token_id)
            logger.info("Token Listed Successfully")
            emitNotice(f"Token ID: {token_id}  Deposited by User: {depositor_address}")
        except Exception as e:
            logger.error("Error handling ERC721 deposit: %s", e)
            emitReport(str(e))
    else:
        logger.info("Unsupported token deposited (ERC721)")
        emitReport("Unsupported token deposited")

def handle_purchase_token(caller_address: str, payload_obj: dict):
    try:
        token_id_str = extract_field(payload_obj, "token_id")
        token_id = as_int(token_id_str)
        erc721_addr = storage.erc721_token
        try:
            if storage.purchaseERC721Token(caller_address, erc721_addr, token_id):
                logger.info("Token purchased successfully, Processing Voucher....")
                voucher = structure_voucher(
                    "transferFrom(address,address,uint256)",
                    storage.erc721_token,
                    ["address", "address", "uint256"],
                    [ storage.application_address, norm_addr(caller_address), token_id],
                )
                emitVoucher(voucher)
            else:
                emitReport(f"Error purchasing token {token_id}")
                return
        except Exception as e:
            emitReport(f"Failed to purchase token: {e}")
            logger.error("Failed to purchase token: %s", e)
    except Exception as e:
        logger.error("Error purchasing token: %s", e)
        emitReport(str(e))


def handle_advance(data):
    logger.info(f"Received advance request data {data}")

    sender = norm_addr(data["metadata"]["msg_sender"])
    app_contract = norm_addr(data["metadata"]["app_contract"])
    zero_addr = norm_addr("0x" + "0" * 40)
    
    if norm_addr(storage.application_address) == zero_addr:
        storage.setAppAddress(app_contract)
    
    payload_hex = data.get("payload", "")
    payload_str = hex_to_string(payload_hex)

    if sender == storage.erc20_portal_address:
        parsed = token_deposit_parse(payload_hex)
        token, receiver, amount = parsed["token"], parsed["receiver"], parsed["amount"]
        handle_erc20_deposit(receiver, int(amount), token)

    elif sender == storage.erc721_portal_address:
        parsed = token_deposit_parse(payload_hex)
        token, receiver, amount = parsed["token"], parsed["receiver"], parsed["amount"]
        handle_erc721_deposit(receiver, int(amount), token)

    else:
        try:
            payload_obj = json.loads(payload_str)
        except Exception:
            emitReport("Invalid payload JSON")
            return "accept"

        method = payload_obj.get("method", "")
        if method == "purchase_token":
            handle_purchase_token(sender, payload_obj)
        else:
            logger.info("Unsupported method called")
            emitReport("Unsupported method")
    return "accept"


def handle_inspect(data: dict):
    logger.info(f"Received inspect request data {data}")

    payload_str = hex_to_string(data.get("payload", "0x"))
    try:
        payload_obj = json.loads(payload_str)
    except Exception:
        emitReport("Invalid payload string")
        return "accept"

    method = payload_obj.get("method", "")
    if method == "get_user_erc20_balance":
        user_address = norm_addr(payload_obj.get("user_address", ""))
        bal = storage.getUserERC20TokenBalance(user_address)
        emitReport(f"User: {user_address} Balance: {bal}")
    elif method == "get_token_owner":
        token_id = as_int(payload_obj.get("token_id", 0))
        owner = storage.getERC721TokenOwner(token_id)
        emitReport(f"Token_id: {token_id} owner: {owner if owner else 'None'}")
    elif method == "get_all_listed_tokens":
        listed = storage.getListedTokens()
        emitReport("All listed tokens are: " + ",".join(map(str, listed)))
    else:
        logger.info("Unsupported inspect method")
        emitReport("Unsupported inspect method")
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