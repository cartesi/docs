---
id: assets-handling
title: Assets handling
tags: [learn, rollups, dapps, components]
---

## Assets handling

Assets exist on the base layer, which is where they have actual meaning and value. As with any execution layer solution, a Cartesi DApp that wants to manipulate assets (e.g. to allow players to bet on a game, so that the winner receives the loser's assets) needs a secure way of "teleporting" the assets from the base layer to the execution layer, and then a way to "teleport" them back to the base layer.

Asset handling in Cartesi DApps involves the following procedures:

  1. Locking assets on layer-1 by depositing them in a special contract called [Portal](./components.md#portal). There are specific portals for each kind of asset (ERC-20 portal, ERC-721 portal, etc.)
  2. The Cartesi Rollups framework notifies the DApp back-end of the deposit by sending it a special input.
  3. The DApp's back-end code needs to recognize and handle the special input, in order to process the deposit according to its own logic (e.g., by storing each user's balance in a hash table or database).
  4. When appropriate (e.g., when a game ends and the winner wishes to withdraw their funds), the back-end generates a [voucher](#vouchers) that encodes a transfer of assets on the base layer, from the DApp to the target user. The actual withdrawal will take effect on the base layer when the voucher is executed. This is a secure process because it can only be done when the voucher has an associated validity proof ensuring that the validator nodes have reached consensus about its contents.

### Ethereum ABI encoding for asset operations

The Ethereum Application Binary Interface (ABI) is a standard for interacting with smart contracts in the Ethereum ecosystem.

It defines a standard way to encode function calls and their parameters, so that they can be interpreted correctly by any client or node on the Ethereum network.

This standard ensures that function calls and parameters are consistently encoded across different programming languages and clients, allowing smart contracts to be interoperable and usable by any client on the Ethereum network.

In particular, the ABI-encoded payload of a voucher defines a function call, for which the first four bytes correspond to a _function selector_. This selector identifies a method within the contract specified by the voucher's target or _destination_ address. After those initial four bytes, the remainder of the voucher's payload corresponds to the function call parameters, each of which is encoded according to its elementary type (e.g., `uint8`, `bool`, etc.)

You can refer to [Ethereum's ABI specification](https://docs.soliditylang.org/en/latest/abi-spec.html) for the full details about the standard.

Let's delve deeper into ABI encoding for Cartesi DApps, using ERC-20 and ERC-721 as illustrative examples.

### ERC-20

Consider the following example:

```python
def erc20_withdraw(account, erc20, amount):
    balance = _balance_get(account)
    balance._erc20_decrease(erc20, amount)

    transfer_payload = TRANSFER_FUNCTION_SELECTOR + \
            encode(['address', 'uint256'], [account, amount])

    logger.info(f"'{amount} {erc20}' tokens withdrawn from '{account}'")
    return Voucher(erc20, transfer_payload)
```

The `encode` function takes two parameters:

* An array of types, in this case `['address', 'uint256']`, which describes the data types that we're encoding. Here `address` is the Ethereum address of the account from which to withdraw the tokens, and `uint256` is the amount of tokens to withdraw.

* An array of values, in this case `[account, amount]`, which correspond to the previously mentioned types. These are the actual values we want to encode.

The `encode` function transforms these values into a byte string according to Ethereum's ABI specifications. The result is concatenated with `TRANSFER_FUNCTION_SELECTOR`, which is the identifier for the `transfer` function in ERC-20 contracts.

### ERC-721

Consider the following example:

```python
def erc721_withdraw(rollup_address, sender, erc721, token_id):
    try:
        balance = _balance_get(sender)
        balance._erc721_remove(erc721, token_id)
    except Exception as error:
        error_msg = f"{error}"
        logger.debug(error_msg, exc_info=True)
        return Error(error_msg)

    payload = SAFE_TRANSFER_FROM_SELECTOR + encode(
        ['address', 'address', 'uint256'],
        [rollup_address, sender, token_id]
    )
    logger.info(f"Token 'ERC-721: {erc721}, id: {token_id}' withdrawn "
                f"from '{sender}'")
    return Voucher(erc721, payload)
```

Similar to the ERC-20 example above, the `encode` function is used to transform the parameters into a byte string. We have two `address` types (representing the `rollup_address` and `sender`), and one `uint256` type (representing the `token_id` of the ERC-721 token). The resulting byte string is prefixed with `SAFE_TRANSFER_FROM_SELECTOR`, which is the identifier for the `safeTransferFrom` function in ERC-721 contracts. 


