```javascript
import { hexToString, numberToHex, parseEther, zeroHash } from "viem";

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));

  const sender = data["metadata"]["msg_sender"];
  const payload = hexToString(data.payload);

  const voucher = {
    destination: sender,
    payload: zeroHash,
    value: numberToHex(BigInt(parseEther("1"))).slice(2),
  };

  await emitVoucher(voucher);
  return "accept";
}

const emitVoucher = async (voucher) => {
  try {
    await fetch(rollup_server + "/voucher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(voucher),
    });
  } catch (error) {
    // Do something when there is an error.
  }
};
```
