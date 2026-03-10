---
id: assets-handling
title: Assets handling
tags: [learn, rollups, dapps, components]
---

Assets exist on the base layer, which is where they have actual meaning and value. As with any execution layer solution, a Cartesi dApp that wants to manipulate assets (e.g. to allow players to bet on a game, so that the winner receives the loser's assets) needs a secure way of "teleporting" the assets from the base layer to the execution layer, and then a way to "teleport" them back to the base layer.

Asset handling in Cartesi dApps involves the following procedures:

1. Locking assets on the base layer by calling deposit methods on special contracts called [Portals](/cartesi-rollups/1.0/api/json-rpc/portals/), which will effectively transfer asset ownership to the target dApp contract. There are specific portals for each kind of asset (Ether, ERC-20, ERC-721, ERC-1155).
2. The Cartesi Rollups framework notifies the dApp back-end of the deposit by sending it a special input.
3. The dApp's back-end code needs to recognize and handle the special input, in order to process the deposit according to its own logic (e.g., by storing each user's balance in a hash table or database).
4. When appropriate (e.g., when a game ends and the winner wishes to withdraw their funds), the back-end generates a [voucher](/cartesi-rollups/1.0/main-concepts/#vouchers) that encodes a transfer of assets on the base layer, from the dApp to the target user. The actual withdrawal will take effect on the base layer when the voucher is executed. This is a secure process because it can only be done when the voucher has an associated validity proof ensuring that the validator nodes have reached consensus about its contents.

## Ethereum ABI encoding for asset operations

The Ethereum Application Binary Interface (ABI) is a standard for interacting with smart contracts in the Ethereum ecosystem.

It defines a standard way to encode function calls and their parameters, so that they can be interpreted correctly by any client or node on the Ethereum network. This standard ensures that function calls and parameters are consistently encoded across different programming languages and clients, allowing smart contracts to be interoperable and usable by any client on the Ethereum network.

In particular, the [ABI-encoded payload of a voucher](https://github.com/cartesi/rollups-contracts#vouchers) defines a function call, for which the first four bytes correspond to a _function selector_. This selector identifies a method within the contract specified by the voucher's target or _destination_ address. After those initial four bytes, the remainder of the voucher's payload corresponds to the function call parameters, each of which is encoded according to its elementary type (e.g., `uint8`, `bool`, etc.)

:::tip
You can refer to [Ethereum's ABI specification](https://docs.soliditylang.org/en/latest/abi-spec.html) for the full details about the standard.
:::

## Message encoding in Cartesi Portals

As the Cartesi Rollups framework uses multiple distinct portals per specific asset, each portal has a unique message encoding scheme. Let's delve deeper into this, using ERC-20 and ERC-721 as illustrative examples.

### ERC-20

Let's consider an example dApp written in Python, which can make use of the [eth_abi](https://pypi.org/project/eth-abi/) Python package to help encode and decode data to/from Ethereum's Application Binary Interface (ABI) format.
You may also refer to the full [ERC-20 example](https://github.com/cartesi/rollups-examples/tree/main/erc20) on Github for more details.

#### Decoding deposits

When handling an [advance request](./sending-requests.md#advance) that could be an ERC-20 deposit, the dApp will first have to check if the sender of the input message is the [ERC20Portal](./api/json-rpc/portals/ERC20Portal.md) contract. The back-end code should already know this contract's address to ensure the operation's authenticity.

```python
from os import environ
import requests

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]

while True:
    response = requests.post(rollup_server + "/finish", json={"status": "accept"})
    rollup_request = response.json()
    if rollup_request["request_type"] == "advance_state":
        data = rollup_request["data"]
        if data["metadata"]["msg_sender"].lower() == "0xERC20PortalAddress123":
            handle_erc20_deposit(data)
```

Once the ERC-20 deposit has been identified, the back-end needs to decode the payload to understand the owner of the assets, which ERC-20 token is being deposited, and the amount. An important detail here is that deposit payloads use [Ethereum's packed ABI encoding](https://docs.soliditylang.org/en/v0.8.11/abi-spec.html#non-standard-packed-mode), which saves some expensive bytes in base layer transaction fees.

```python
def handle_erc20_deposit(data):
    binary = bytes.fromhex(data["payload"][2:])
    try:
        decoded = decode_packed(['bool','address','address','uint256'], binary)
    except Exception as e:
        # payload does not conform to ERC20 deposit ABI
        return "reject"

    success = decoded[0]
    erc20 = decoded[1]
    depositor = decoded[2]
    amount = decoded[3]
```

Here, `data["payload"]` is expected to contain the deposit payload defined by the `ERC20Portal` contract. The payload is transformed from a hexadecimal string to a bytes object, and then an auxiliary method `decode_packed` is used to interpret its contents considering the following encoding:

- A boolean, representing whether the ERC-20 deposit transaction was successful or not on the base layer (**1 byte**)
- The address of the ERC-20 contract that the deposited tokens belong to (**20 bytes**)
- The address of the account that is making the deposit (**20 bytes**)
- The number of tokens being deposited (**32 bytes**)

The `decode_packed` method will attempt to convert the bytes object into these values. If the payload is not in the correct format, an exception is thrown and caught.

As an example, consider the following sample ERC-20 deposit payload:

```
0x014ed7c70f96b99c776995fb64377f0d4ab3b0e1c1f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000064
```

For the above example, we would have the following decoded values:

- `success: "0x01"` - indicates a successful deposit (hexadecimal representation of the boolean value `true`)
- `erc20: "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1"` - the ERC-20 contract address on the base layer
- `depositor: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"` - the address of the owner of the assets
- `amount: "0x000...0064"` - the amount being deposited (100 in decimal format)

#### Encoding withdrawals

In the case of a withdrawal, the back-end code needs to create a [voucher](/cartesi-rollups/1.0/main-concepts/#vouchers) that encodes a transfer of assets from the dApp to the target recipient address. For ERC-20, this transfer can be performed by encoding a call to the [transfer(address,uint256)](https://eips.ethereum.org/EIPS/eip-20#transfer) method of the appropriate ERC-20 contract on the base layer.

```python
TRANSFER_FUNCTION_SELECTOR = b'\xa9\x05\x9c\xbb'
transfer_payload = TRANSFER_FUNCTION_SELECTOR + encode(['address','uint256'], [recipient, amount])
voucher = {"destination": erc20, "payload": "0x" + transfer_payload.hex()}
requests.post(rollup_server + "/voucher", json=voucher)
```

Here, `eth_abi`'s [encode](https://eth-abi.readthedocs.io/en/stable/encoding.html) method is used to create the payload for an Ethereum transaction that calls the `transfer` function of an ERC-20 token contract. This function requires two parameters: the address to transfer to (the recipient's address) and the amount to transfer. These values are passed as a list to `encode`, along with a list of their types.

The `encode` method returns a bytes object, which is then concatenated with the _function selector_ of the transfer function. According to [Ethereum's ABI specification for calling contract functions](https://docs.soliditylang.org/en/v0.8.19/abi-spec.html), this selector must correspond to the first four bytes of the Keccak256 hash of the function signature string. In our case, this signature is `"transfer(address,uint256)"`, and the resulting hash's initial four bytes correspond to `0xa9059cbb`.
The combined bytes object is finally converted to a hexadecimal string in order to define the full payload of the voucher.

At last, the voucher's `destination` is specified as the ERC-20 token contract address, and an HTTP POST request is made to emit it.

### ERC-721

For ERC-721, we will also consider an example written in Python.
You may refer to the [Auction example](https://github.com/cartesi/rollups-examples/tree/main/auction) on Github for a full implementation of ERC-721 deposits and withdrawals.

#### Decoding deposits

As with [ERC-20 deposits](#decoding-deposits), the first step is to identify if the input message originated from the [ERC721Portal](./api/json-rpc/portals/ERC721Portal.md) contract:

```python
from os import environ
import requests

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]

while True:
    response = requests.post(rollup_server + "/finish", json={"status": "accept"})
    rollup_request = response.json()
    if rollup_request["request_type"] == "advance_state":
        data = rollup_request["data"]
        if data["metadata"]["msg_sender"].lower() == "0xERC721PortalAddress123":
            handle_erc721_deposit(data)
```

When ERC-721 deposits are identified, the back-end then proceeds to handle it in a manner very similar to the ERC-20 case:

```python
def handle_erc721_deposit(data):
    binary = bytes.fromhex(data["payload"][2:])
    try:
        decoded = decode_packed(['address', 'address', 'uint256'], binary)
    except Exception as e:
        # payload does not conform to ERC721 deposit ABI
        return "reject"

    erc721 = decoded[0]
    depositor = decoded[1]
    token_id = decoded[2]
```

Once again, the auxiliary method `decode_packed` is used to interpret the payload that was packed ABI encoded by the portal (in this case, the `ERC721Portal`). For ERC-721, the payload encoding is the following:

- The address of the ERC-721 contract that the deposited token belongs to (**20 bytes**)
- The address of the account that is making the deposit (**20 bytes**)
- The unique token ID (**32 bytes**)

As an example, consider the following sample ERC-721 deposit payload:

```
0x59b670e9fa9d0a427751af201d676719a970857bf39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000001
```

For the above example, we would have the following decoded values:

- `erc721: "0x59b670e9fA9D0A427751Af201D676719a970857b"` - the ERC-721 contract address on the base layer
- `depositor: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"` - the address of the owner of the asset
- `token_id: "0x000...0001"` - the ID of the token being deposited (1 in this case)

#### Encoding withdrawals

Withdrawals for ERC-721 are again very similar to what is done for ERC-20. Once more, a [voucher](/cartesi-rollups/1.0/main-concepts/#vouchers) must be emitted that encodes a transfer of the intended asset from the dApp to a target recipient address.
In the case of ERC-721 tokens, the voucher should encode a call to the [safeTransferFrom(address,address,uint256)](https://eips.ethereum.org/EIPS/eip-721#specification) method on the base layer token contract.

```python
SAFE_TRANSFER_FUNCTION_SELECTOR = b'\x42\x84\x2e\x0e'
transfer_payload = SAFE_TRANSFER_FUNCTION_SELECTOR + encode(['address','address','uint256'], [rollup_address, recipient, token_id])
voucher = {"destination": erc721, "payload": "0x" + transfer_payload.hex()}
requests.post(rollup_server + "/voucher", json=voucher)
```

In this case, again we use `eth_abi`'s [encode](https://eth-abi.readthedocs.io/en/stable/encoding.html) method to define a payload corresponding to a call to the `safeTransferFrom` function of an ERC-721 contract. This call has three parameters: the address currently owning the asset to transfer (`rollup_address`, which corresponds to the dApp contract address on the base layer), the address to which to transfer the token (`recipient`), and the token's ID (`token_id`).

As was done for ERC-20, the encoded payload is then concatenated with the function selector of the transfer function. This time, the selector corresponds to the first four bytes of the Keccak256 hash of the signature string `"safeTransferFrom(address,address,uint256)"`, which amounts to `0x42842e0e`. Then, the resulting combined bytes object is again converted to a hexadecimal string to produce the complete payload of the voucher.

Finally, the ERC-721 contract address is specified as the voucher's `destination`, and an HTTP POST request is submitted to emit the voucher.

### Other assets

Please refer to the [Cartesi Rollups repository documentation](https://github.com/cartesi/rollups-contracts#portals) for a full list of Portals, along with their corresponding deposit encodings and withdrawal voucher specifications.
