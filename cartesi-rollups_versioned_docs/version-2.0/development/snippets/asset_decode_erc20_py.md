```python
def decode_erc20_deposit(payload_hex):
    """
    Decode a Cartesi Rollups ERC-20 deposit payload.
    """
    payload = payload_hex[2:] if payload_hex.startswith("0x") else payload_hex
    raw = bytes.fromhex(payload)

    # Minimum size is token(20) + sender(20) + amount(32) = 72 bytes.
    if len(raw) < 72:
        raise ValueError("invalid ERC-20 deposit payload")

    token = ("0x" + raw[0:20].hex()).lower().strip()
    sender = ("0x" + raw[20:40].hex()).lower().strip()
    amount = int.from_bytes(raw[40:72], byteorder="big")
    exec_layer_data = raw[72:]

    return {
        "token": token,
        "sender": sender,
        "amount": amount,
        "exec_layer_data": exec_layer_data,
    }
```
