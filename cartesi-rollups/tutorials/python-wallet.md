---
id: python-wallet
title: Build a wallet dApp with Python
resources:
   - url: https://www.udemy.com/course/the-cartesi-dapp-developer-masterclass
     title: The Cartesi dApp Developer Free Course
   - url: https://github.com/jplgarcia/python-wallet/tree/main
     title: "Cartesi-Wallet: Python based Wallet implementation for Cartesi dApps"
   - url: https://github.com/Mugen-Builders/frontend-cartesi-wallet-x
     title: "Frontend-Cartesi-Wallet: A React frontend to showcase wallet functionality of Cartesi dApps" 
   - url: https://github.com/Mugen-Builders/sunodo-frontend-console
     title: Frontend Console Application
   - url: https://github.com/jplgarcia/cartesi-angular-frontend
     title: Angular Starter Template to Showcase Wallet Functionality of Cartesi dApps
---

Let’s build a simple dApp that uses the `cartesi-wallet` package to handle different deposits, transfers, and withdrawals of various assets.

[Cartesi Wallet](https://github.com/jplgarcia/python-wallet/tree/main) is a Python-based wallet implementation for asset handling within Cartesi dApps.

## Installation

To install the `cartesi-wallet` library, you can use pip:

```shell
pip install cartesi-wallet
```

You must compile some source code for this lib to run on Docker. Include `build-essential` in your Dockerfile in the apt-get install. Like this:

```dockerfile
apt-get install -y --no-install-recommends build-essential=12.9ubuntu3 busybox-static=1:1.30.1-7ubuntu3 ca-certificates=20230311ubuntu0.22.04.1 curl=7.81.0-1ubuntu1.15
```


## Usage

To use the `cartesi-wallet` module in your project, you need to import the module and necessary utilities:

```python
import cartesi_wallet.wallet as Wallet
from cartesi_wallet.util import hex_to_str, str_to_hex
import json
```

Create an instance of the Wallet:

```python
wallet = Wallet
rollup_address = ""
```

Initialize the wallet with the portal contract and relay addresses:

```python
dapp_relay_address = "0x...aE"
ether_portal_address = "0x...44"
erc20_portal_address = "0x...DB"
erc721_portal_address = "0x...87"
```
You can obtain the relevant addresses by running `sunodo address-book`.


## Checking Balance

To retrieve balance information from the wallet, use the `balance_get` method:

```python
balance = wallet.balance_get(account)
```

The balance object includes methods to access specific balance information, such as:

- `ether_get(self) -> int`: Returns the Ether balance.
- `erc20_get(self, erc20: str) -> int`: Returns the balance of a specific ERC20 token.
- `erc721_get(self, erc721: str) -> set[int]`: Returns a set of indexes of the ERC721 tokens owned by the user.

## Asset Handling Methods

For operations like deposits, transfers, and withdrawals, use the methods inside the handle_advance function.

### Deposits

To process a deposit, ensure the sender is the designated portal smart contract. Here's an example of an `ERC20` deposit:

```python
msg_sender = data["metadata"]["msg_sender"]
payload = data["payload"]

if msg_sender.lower() == erc20_portal_address.lower():
    notice = wallet.erc20_deposit_process(payload)
    response = requests.post(rollup_server + "/notice", json={"payload": notice.payload})
return "accept"

```


### Transfers and Withdrawals

Below is an example of `ERC20` transfer and withdrawal:


```python 
msg_sender = data["metadata"]["msg_sender"]
payload = data["payload"]

try:
    req_json = decode_json(payload)

    if req_json["method"] == "erc20_transfer":
        notice = wallet.erc20_transfer(req_json["from"].lower(), req_json["to"].lower(), req_json["erc20"].lower(), req_json["amount"])
        response = requests.post(rollup_server + "/notice", json={"payload": notice.payload})

    if req_json["method"] == "erc20_withdraw":
        voucher = wallet.erc20_withdraw(req_json["from"].lower(), req_json["erc20"].lower(), req_json["amount"])
        response = requests.post(rollup_server + "/voucher", json={"payload": voucher.payload, "destination": voucher.destination})
    
    return "accept" 

except Exception as error:
    error_msg = f"Failed to process command '{payload}'. {error}"
    response = requests.post(rollup_server + "/report", json={"payload": encode(error_msg)})
    logger.debug(error_msg, exc_info=True)
    return "reject"
```

The payload format for transfers and withdrawals may vary.

```python
# Example payload for "transfer" method
{
    "method": "erc20_transfer",
    "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "to": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "erc20": "0xae7f61eCf06C65405560166b259C54031428A9C4",
    "amount": 5000000000000000000
}

# Example payload for "withdraw" method
{
    "method": "erc20_withdraw",
    "from": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "erc20": "0xae7f61eCf06C65405560166b259C54031428A9C4",
    "amount": 3000000000000000000
}

```

## Other Tokens

The method signatures are similar for other token types (e.g., Ether, ERC721), and the logic for deposits, transfers, and withdrawals follows the same pattern.

Here are the functions:

```python
wallet.balance_get(account):

wallet.ether_deposit_process(payload: str):
wallet.ether_withdraw(rollup_address, account, amount):
wallet.erc20_transfer(account, to, erc20, amount):

wallet.erc20_deposit_process(payload:str):
wallet.erc20_withdraw(account, erc20, amount):
wallet.erc20_transfer(account, to, erc20, amount):

wallet.erc721_deposit_process(payload:str):
wallet.erc721_withdraw(rollup_address, sender, erc721, token_id):
wallet.erc721_transfer(account, to, erc721, token_id):
```

Ensure that the `rollup_address` for withdrawal operations is set trustless. Here's an example:

```python
if msg_sender.lower() == dapp_relay_address.lower():
    global rollup_address
    rollup_address = payload
    response = requests.post(rollup_server + "/notice", json={"payload": str_to_hex(f"Set rollup_address {rollup_address}")})
    return "accept"
```

With this, your dApp is ready to process deposits, transfers, and withdrawals for various assets.

## Code snippets

Here are some useful code snippets that you can utilize in your Cartesi dApp development:

### Setup
  
```python
rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

# The following addresses are for the local development environment
dapp_relay_address = "0xF5DE34d6BbC0446E2a45719E718efEbaaE179daE"
ether_portal_address = "0xFfdbe43d4c855BF7e0f105c400A50857f53AB044"
erc20_portal_address = "0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB"
erc721_portal_address = "0x237F8DD094C0e47f4236f12b4Fa01d6Dae89fb87"

wallet = Wallet
rollup_address = ""
```


### Ether

```python
def handle_advance(data):
    logger.info(f"Received advance request data {data}")
    msg_sender = data["metadata"]["msg_sender"]
    payload = data["payload"]
    print(payload)
  
    # Set Relay 
    if msg_sender.lower() == dapp_relay_address.lower():
        global rollup_address
        logger.info(f"Received advance from dapp relay")
        rollup_address = payload
        response = requests.post(rollup_server + "/notice", json={"payload": str_to_hex(f"Set rollup_address {rollup_address}")})
        return "accept"

    # Deposit
    try:
        notice = None
        if msg_sender.lower() == ether_portal_address.lower():
            notice = wallet.ether_deposit_process(payload)
            response = requests.post(rollup_server + "/notice", json={"payload": notice.payload})
        if notice:
            logger.info(f"Received notice status {response.status_code} body {response.content}")
            return "accept"
    except Exception as error:
        error_msg = f"Failed to process deposit '{payload}'. {error}"
        logger.debug(error_msg, exc_info=True)
        return "reject"

    # Transfer and Withdraw
    try:
        req_json = decode_json(payload)
        if req_json["method"] == "ether_transfer":
            notice = wallet.ether_transfer(req_json["from"].lower(), req_json["to"].lower(), req_json["amount"])
            response = requests.post(rollup_server + "/notice", json={"payload": notice.payload})
        if req_json["method"] == "ether_withdraw":
            voucher = wallet.ether_withdraw(rollup_address, req_json["from"].lower(), req_json["amount"])
            response = requests.post(rollup_server + "/voucher", json={"payload": voucher.payload, "destination": voucher.destination})
        return "accept" 
    except Exception as error:
        error_msg = f"Failed to process command '{payload}'. {error}"
        response = requests.post(rollup_server + "/report", json={"payload": encode(error_msg)})
        logger.debug(error_msg, exc_info=True)
        return "reject"
```


### ERC20

```python
def handle_advance(data):
    logger.info(f"Received advance request data {data}")
    msg_sender = data["metadata"]["msg_sender"]
    payload = data["payload"]
    
    # Deposit      
    try:
        notice = None
        if msg_sender.lower() == erc20_portal_address.lower():
            notice = wallet.erc20_deposit_process(payload)
            response = requests.post(rollup_server + "/notice", json={"payload": notice.payload})
        if notice:
            logger.info(f"Received notice status {response.status_code} body {response.content}")
            return "accept"
    except Exception as error:
        error_msg = f"Failed to process deposit '{payload}'. {error}"
        logger.debug(error_msg, exc_info=True)
        return "reject"

    # Transfer and Withdraw    
    try:
        req_json = decode_json(payload)
        if req_json["method"] == "erc20_transfer":
            notice = wallet.erc20_transfer(req_json["from"].lower(), req_json["to"].lower(), req_json["erc20"].lower(), req_json["amount"])
            response = requests.post(rollup_server + "/notice", json={"payload": notice.payload})

        if req_json["method"] == "erc20_withdraw":
            voucher = wallet.erc20_withdraw(req_json["from"].lower(), req_json["erc20"].lower(), req_json["amount"])
            response = requests.post(rollup_server + "/voucher", json={"payload": voucher.payload, "destination": voucher.destination})
        return "accept" 
    except Exception as error:
        error_msg = f"Failed to process command '{payload}'. {error}"
        response = requests.post(rollup_server + "/report", json={"payload": encode(error_msg)})
        logger.debug(error_msg, exc_info=True)
        return "reject"
```


### ERC721

```python
def handle_advance(data):
    logger.info(f"Received advance request data {data}")
    msg_sender = data["metadata"]["msg_sender"]
    payload = data["payload"]
    
    # Set Relay
    if msg_sender.lower() == dapp_relay_address.lower():
        global rollup_address
        logger.info(f"Received advance from dapp relay")
        rollup_address = payload
        response = requests.post(rollup_server + "/notice", json={"payload": str_to_hex(f"Set rollup_address {rollup_address}")})
        return "accept"

    # Deposit  
    try:
        notice = None
        if msg_sender.lower() == erc721_portal_address.lower():
            notice = wallet.erc721_deposit_process(payload)
            response = requests.post(rollup_server + "/notice", json={"payload": notice.payload})
        if notice:
            logger.info(f"Received notice status {response.status_code} body {response.content}")
            return "accept"
    except Exception as error:
        error_msg = f"Failed to process deposit '{payload}'. {error}"
        logger.debug(error_msg, exc_info=True)
        return "reject"
    
    # Transfer and Withdraw
    try:
        req_json = decode_json(payload)
        if req_json["method"] == "erc721_transfer":
            notice = wallet.erc721_transfer(req_json["from"].lower(), req_json["to"].lower(), req_json["erc721"].lower(), req_json["token_id"])
            response = requests.post(rollup_server + "/notice", json={"payload": notice.payload})
        if req_json["method"] == "erc721_withdraw":
            voucher = wallet.erc721_withdraw(rollup_address, req_json["from"].lower(), req_json["erc721"].lower(), req_json["token_id"])
            response = requests.post(rollup_server + "/voucher", json={"payload": voucher.payload, "destination": voucher.destination})
        return "accept" 
    except Exception as error:
        error_msg = f"Failed to process command '{payload}'. {error}"
        response = requests.post(rollup_server + "/report", json={"payload": encode(error_msg)})
        logger.debug(error_msg, exc_info=True)
        return "reject"
```

### Balance

```python
def handle_inspect(data):
    logger.info(f"Received inspect request data {data}")
    try:
        url = urlparse(hex_to_str(data["payload"]))
        if url.path.startswith("balance/"):
            info = url.path.replace("balance/", "").split("/")
            token_type, account = info[0].lower(), info[1].lower()
            token_address, token_id, amount = "", 0, 0

            if (token_type == "ether"):
                amount = wallet.balance_get(account).ether_get()
            elif (token_type == "erc20"):
                token_address = info[2]
                amount = wallet.balance_get(account).erc20_get(token_address.lower())
            elif (token_type == "erc721"):
                token_address, token_id = info[2], info[3]
                amount = 1 if token_id in wallet.balance_get(account).erc721_get(token_address.lower()) else 0
            
            report = {"payload": encode({"token_id": token_id, "amount": amount, "token_type": token_type})}
            response = requests.post(rollup_server + "/report", json=report)
            logger.info(f"Received report status {response.status_code} body {response.content}")
        return "accept"
    except Exception as error:
        error_msg = f"Failed to process inspect request. {error}"
        logger.debug(error_msg, exc_info=True)
        return "reject"
```


The routes for the Balance inspects implemented above are as follows:

#### Ether
```shell
balance/ether/{wallet}
balance/ether/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```


#### ERC20:
```shell
balance/ether/{wallet}/{token_address}
balance/erc20/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266/0xae7f61eCf06C65405560166b259C54031428A9C4
```

#### ERC721:
```shell
balance/ether/{wallet}/{token_addres}/{token_id}
balance/erc721/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266/0xae7f61eCf06C65405560166b259C54031428A9C4/0
```


##  Frontend Integration

You can use a couple of options for frontend integration in your backend wallet. 

- Frontend Console: The terminal can interact directly with your backend wallet. Here is [a sample frontend console application](https://github.com/Mugen-Builders/sunodo-frontend-console) ready to be used!

- Web User Interface: Alternatively, you can develop a user-friendly web interface for your dApp. This approach offers a more polished user experience and is suitable for production-ready applications. Here are [React.js starter](https://github.com/Mugen-Builders/frontend-cartesi-wallet-x) and [Angular starter](https://github.com/jplgarcia/cartesi-angular-frontend) templates you can use.

