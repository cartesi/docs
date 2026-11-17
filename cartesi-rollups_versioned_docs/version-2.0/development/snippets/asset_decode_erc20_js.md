```javascript
// payload: the `request.payload` Buffer of an advance request sent by the Erc20Portal
function decodeErc20Deposit(payload) {
  // token(20) + sender(20) + amount(32) = 72 bytes
  if (payload.length < 72) {
    throw new Error("invalid ERC-20 deposit payload");
  }

  const token = `0x${payload.subarray(0, 20).toString("hex")}`;
  const sender = `0x${payload.subarray(20, 40).toString("hex")}`;
  const amount = BigInt(`0x${payload.subarray(40, 72).toString("hex")}`);
  const exec_layer_data = payload.subarray(72);

  return {
    token,
    sender,
    amount,
    exec_layer_data,
  };
}
```
