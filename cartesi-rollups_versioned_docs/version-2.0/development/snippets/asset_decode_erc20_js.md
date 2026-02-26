```javascript
function decodeErc20Deposit(payloadHex) {
  if (typeof payloadHex !== "string") {
    throw new TypeError("payload must be a hex string");
  }

  const payload = payloadHex.startsWith("0x") ? payloadHex.slice(2) : payloadHex;
  const raw = Buffer.from(payload, "hex");

  // token(20) + sender(20) + amount(32) = 72 bytes
  if (raw.length < 72) {
    throw new Error("invalid ERC-20 deposit payload");
  }

  const token = `0x${raw.subarray(0, 20).toString("hex")}`.toLowerCase().trim();
  const sender = `0x${raw.subarray(20, 40).toString("hex")}`.toLowerCase().trim();
  const amount = BigInt(`0x${raw.subarray(40, 72).toString("hex")}`);
  const exec_layer_data = raw.subarray(72);

  return {
    token,
    sender,
    amount,
    exec_layer_data,
  };
}
```
