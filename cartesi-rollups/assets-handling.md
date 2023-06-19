---
id: assets-handling
title: Assets handling
tags: [learn, rollups, dapps, components]
---

Assets exist on the base layer, which is where they have actual meaning and value. As with any execution layer solution, a Cartesi DApp that wants to manipulate assets (e.g. to allow players to bet on a game, so that the winner receives the loser's assets) needs a secure way of "teleporting" the assets from the base layer to the execution layer, and then a way to "teleport" them back to the base layer.

Asset handling in Cartesi DApps involves the following procedures:

  1. Locking assets on the base layer by briefly depositing them into a special contract called [Portal](../components/#portal) before transferring them to DApps. There are specific portals for each kind of asset (Ether, ERC-20, ERC-721, ERC-1155).
  2. The Cartesi Rollups framework notifies the DApp back-end of the deposit by sending it a special input.
  3. The DApp's back-end code needs to recognize and handle the special input, in order to process the deposit according to its own logic (e.g., by storing each user's balance in a hash table or database).
  4. When appropriate (e.g., when a game ends and the winner wishes to withdraw their funds), the back-end generates a [voucher](#vouchers) that encodes a transfer of assets on the base layer, from the DApp to the target user. The actual withdrawal will take effect on the base layer when the voucher is executed. This is a secure process because it can only be done when the voucher has an associated validity proof ensuring that the validator nodes have reached consensus about its contents.

### Ethereum ABI encoding for asset operations

The Ethereum Application Binary Interface (ABI) is a standard for interacting with smart contracts in the Ethereum ecosystem.

It defines a standard way to encode function calls and their parameters, so that they can be interpreted correctly by any client or node on the Ethereum network. This standard ensures that function calls and parameters are consistently encoded across different programming languages and clients, allowing smart contracts to be interoperable and usable by any client on the Ethereum network.

In particular, the [ABI-encoded payload of a voucher](https://github.com/cartesi/rollups#vouchers) defines a function call, for which the first four bytes correspond to a _function selector_. This selector identifies a method within the contract specified by the voucher's target or _destination_ address. After those initial four bytes, the remainder of the voucher's payload corresponds to the function call parameters, each of which is encoded according to its elementary type (e.g., `uint8`, `bool`, etc.)

:::tip
You can refer to [Ethereum's ABI specification](https://docs.soliditylang.org/en/latest/abi-spec.html) for the full details about the standard.
:::

### Message encoding in Cartesi Portals

As the Cartesi Rollups framework uses multiple distinct portals per specific asset, each portal has a unique message encoding scheme. Let's delve deeper into this, using ERC-20 and ERC-721 as illustrative examples.

#### ERC-20

Consider an example DApp written in Python. For operations with ERC-20 assets, this DApp will import `eth_abi` and `eth_abi_ext`. These are Ethereum-specific modules used to encode and decode data to/from Ethereum's Application Binary Interface (ABI) format:

```python
from eth_abi.abi import encode
from eth_abi_ext import decode_packed
```

##### Decoding Process

Using the `handle_advance` function, the DApp attempts to decode an ERC20 deposit:

```python
binary = bytes.fromhex(data["payload"][2:])
try:
    decoded = decode_packed(['bool','address','address','uint256'],binary)
except Exception as e:
    msg = "Payload does not conform to ERC20 deposit ABI"
    logger.error(f"{msg}\n{traceback.format_exc()}")
    return reject_input(msg, data["payload"])
```

Here, `data["payload"]` is expected to contain an Ethereum transaction payload. The payload is transformed from a hexadecimal string to a bytes object, and then passed to `decode_packed` along with a list of expected types:

* A boolean, representing whether the ERC20 deposit transaction was successful or not (for example, if the depositor did not have enough tokens in their account)
* The address of the contract that the deposited tokens belong to
* The address of the account that is making the deposit to the ERC20 token contract
* The number of tokens being deposited

The `decode_packed` will attempt to convert the bytes object back into these original values. If the payload is not in the correct format, an exception is thrown and caught.

##### Decoding Process

Further in the `handle_advance` function, the DApp creates a new Ethereum transaction payload:

```python
transfer_payload = TRANSFER_FUNCTION_SELECTOR + encode(['address','uint256'], [depositor, amount])
voucher = {"destination": erc20, "payload": "0x" + transfer_payload.hex()}
```

Here, `encode` is used to create the payload for an Ethereum transaction that calls the `transfer` function of an ERC20 token contract. This function requires two parameters: the address to transfer to (the depositor's address) and the amount to transfer. These values are passed as a list to encode, along with a list of their types.

The `encode` returns a bytes object, which is then concatenated with the `function selector` of the transfer function (a 4-byte identifier). This combined bytes object is then converted to a hexadecimal string and included in a new transaction payload.

#### ERC-721

Consider an example DApp written in Python. For operations with ERC-20 assets, this DApp will import `eth_abi` and `auction.eth_abi_ext`. These are Ethereum-specific modules used to encode and decode data to/from Ethereum's Application Binary Interface (ABI) format:

```python
from eth_abi import decode, encode
from auction.eth_abi_ext import decode_packed
```

##### Decoding Process

Let's take a look at the ERC-721 deposit process in our example DApp:

```python
def erc721_deposit_process(payload:str):
    binary_payload = bytes.fromhex(payload[2:])
    try:
        account, erc721, token_id = _erc721_deposit_parse(binary_payload)
        return _erc721_deposit(account, erc721, token_id)
    except ValueError as error:
        return Error(f"{error}")

def _erc721_deposit_parse(binary_payload: bytes):
    try:
        input_data = decode_packed(
            ['address', 'address', 'uint256'],
            binary_payload
        )
        erc721 = input_data[0]
        account = input_data[1]
        token_id = input_data[2]

        return account, erc721, token_id
    except Exception as error:
        raise ValueError("Payload does not conform to ERC-721 transfer ABI") from error

```

The `decode_packed` is used to decode the `binary_payload`. This function decodes ABI-encoded data in Ethereum. The first parameter of the decode_packed function is a list of types `(['address', 'address', 'uint256'])`, and the second parameter is the `binary_payload` to be decoded. The `binary_payload` is expected to be an ABI-encoded representation of an array containing an ERC-721 contract address (`erc721`), the address of the account that deposited the token (account), and the unique token ID (token_id). The decoded values are then returned to be used in the deposit process.

##### Decoding Process

Now let's see how ERC-721 withdraw process works in the same DApp:

```python
def erc721_withdraw(rollup_address, sender, erc721, token_id):
    try:
        balance = _balance_get(sender)
        balance._erc721_remove(erc721, token_id)
    except Exception as error:
        return Error(f"{error}")

    payload = SAFE_TRANSFER_FROM_SELECTOR + encode(
        ['address', 'address', 'uint256'],
        [rollup_address, sender, token_id]
    )
    return Voucher(erc721, payload)
```

The `encode` is used to encode the parameters of the `safeTransferFrom` function of the ERC-721 contract. The first parameter of `encode` is a list of types `(['address', 'address', 'uint256'])`, and the second parameter is the actual values to be encoded. The values are the address of the contract (`rollup_address`), the address of the sender (`sender`), and the token ID (`token_id`). This encoded payload is then concatenated with the `SAFE_TRANSFER_FROM_SELECTOR`, which is a method identifier for the `safeTransferFro`m function in an ERC-721 contract, and used as an argument in the `Voucher` object.
