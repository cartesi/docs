---
id: ETH
title: Depositing ETH assets
tags: [learn, rollups, dapps, components]
---

In this guide, you will learn how to deposit ETH assets into a Cartesi DApp both locally and on a testnet. We will demonstrate this using an example ETH DApp based on the ERC20 rollups example. If you have a custom DApp, please refer to the [Assets Handling section](./assets-handling.md).


## Pre-requisites

1. Docker Environment
  - Docker version 20.10.14 with Docker Buildkit enabled.
  - We recommend Docker Desktop, as it enables Buildkit by default.
  - Alternatively, set the environment variable: `DOCKER_BUILDKIT=1`.
2. Cast
  - Download and install from [Foundry's Installation Guide](https://book.getfoundry.sh/getting-started/installation).


## Sending ETH to a DApp running on a testnet

### Starting the DApp

1. Clone the rollups-examples repository

```shell
git clone https://github.com/cartesi/rollups-examples.git
```

2. Navigate to the DApp repository:

```shell
cd erc20
```

3. Replace the code in the erc20.py with the following:

```python
# Copyright 2022 Cartesi Pte. Ltd.
#
# SPDX-License-Identifier: Apache-2.0
# Licensed under the Apache License, Version 2.0 (the "License"); you may not use
# this file except in compliance with the License. You may obtain a copy of the
# License at http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed
# under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
# CONDITIONS OF ANY KIND, either express or implied. See the License for the
# specific language governing permissions and limitations under the License.


from os import environ
import traceback
import logging
import requests
import json
from eth_abi.abi import encode
from eth_abi_ext import decode_packed

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
network = environ["NETWORK"]

logger.info(f"HTTP rollup_server url is {rollup_server}")
logger.info(f"Network is {network}")

# Function selector to be called during the execution of a voucher that transfers funds,
# which corresponds to the first 4 bytes of the Keccak256-encoded result of "transfer(address,uint256)"
TRANSFER_FUNCTION_SELECTOR = b'\xa9\x05\x9c\xbb'

# Setup contracts addresses
ETHERPortalFile = open(f'./deployments/{network}/EtherPortal.json')
etherPortal = json.load(ETHERPortalFile) 


def str2hex(str):
    """
    Encode a string as an hex string
    """
    return "0x" + str.encode("utf-8").hex()

def reject_input(msg, payload):
    logger.error(msg)
    response = requests.post(rollup_server + "/report", json={"payload": payload})
    logger.info(f"Received report status {response.status_code} body {response.content}")
    return "reject"

def handle_advance(data):
    logger.info(f"Received advance request data {data}")

    try:
        # Check wether an input was sent by the ERC20 Portal,
        # which is where all deposits must come from
        if data["metadata"]["msg_sender"].lower() != etherPortal['address'].lower():
            return reject_input(f"Input does not come from the ERC20 Portal", data["payload"])

        # Attempt to decode input as an ABI-packed-encoded ERC20 deposit
        binary = bytes.fromhex(data["payload"][2:])
        try:
            decoded = decode_packed(['address','uint256'],binary)
        except Exception as e:
            msg = "Payload does not conform to ERC20 deposit ABI"
            logger.error(f"{msg}\n{traceback.format_exc()}")
            return reject_input(msg, data["payload"])

        depositor = decoded[0]
        amount = decoded[1]
        
        # Post notice about the deposit
        notice_str = f"Deposit received from: {depositor}; ETH Amount: {amount}"
        logger.info(f"Adding notice: {notice_str}")
        notice = {"payload": str2hex(notice_str)}
        response = requests.post(rollup_server + "/notice", json=notice)
        logger.info(f"Received notice status {response.status_code} body {response.content}")




        return "accept"

    except Exception as e:
        return reject_input(f"Error processing data {data}\n{traceback.format_exc()}")

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

4. Build the application back-end, replacing `<network>` with the name of your target network:

```shell
docker buildx bake machine --load --set *.args.NETWORK=<network>
```

:::note
If you are running `zsh`, Tto avoid the zsh error when using a glob pattern, enclose the argument in quotes like `docker buildx bake machine --load --set "*.args.NETWORK=sepolia"`.
:::

5. Deploy the back-end to a corresponding Rollups smart contract by running:


```python
export MNEMONIC=<user sequence of twelve words>
export RPC_URL=<https://your.rpc.gateway>
```

The `<user sequence of twelve words>` sets your wallet's mnemonic, a sequence of twelve words used to generate private keys.

The `<https://your.rpc.gateway>` sets the URL for your preferred RPC gateway, a connection point for interacting with the Ethereum network. 

6. Start the local Cartesi Node, replacing `<network>` with the name of your preferred network:

```shell
DAPP_NAME=<example> docker compose --env-file ../env.<network> -f ../docker-compose-testnet.yml -f ./docker-compose.override.yml up
```

### Obtaining the DApp settings

For asset deposits, you need:

* PRIVATE_KEY
* ETH_PORTAL_ADDR
* ETH_PORTAL
* RPC_URL
* DAPP_ADDRESS

On application start, a `deployments` directory is created. The `EtherPortal.json` inside this directory contains the address of the ETH Portal. The `dapp.json` contains your DApp's address.


The ETH_PORTAL_ADDR is an ETH token utilized by Cartesi DApps. Find its address in [rollups-contracts](https://github.com/cartesi/rollups-contracts/tree/main/onchain%2Frollups%2Fdeployments).

### Building the frontend-console

1. Open a separate terminal window
2. From the rollups-examples base directory, navigate to the `frontend-console` one:
```shell
cd frontend-console
```
3. Build the frontend console application:
```shell
yarn
yarn build
```

### Sending a request through cast

1. Declare the variables:

```shell
export ETHER=$1    # amount of ETHER to send to the DApp
export ETH_PORTAL_ADDR="0x...0"
export DAPP_ADDR="0x...0"
export PRIVATE_KEY="0x...0" # private key for addr 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
export RPC_URL="<https://your.rpc.gateway>"
export EXE_LAYER_DATA="0x...0"   # data to be sent to the DAPP with the deposit
```

Replace `"0x...0"`and `<https://your.rpc.gateway>` with their corresponding actual values, as detailed in the preceding sections.

2. Deposit the assets:

```shell
cast send --private-key ${PRIVATE_KEY} --rpc-url ${RPC_URL} ${ETH_PORTAL_ADDR} "depositEther(address,bytes)" ${DAPP_ADDR} ${EXE_LAYER_DATA} --value "${ETHER}ether"
```
