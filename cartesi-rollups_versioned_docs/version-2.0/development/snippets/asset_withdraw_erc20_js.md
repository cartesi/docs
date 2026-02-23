```javascript
import { encodeFunctionData, erc20Abi, hexToString, zeroHash } from "viem";

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));

  const sender = data["metadata"]["msg_sender"];
  const payload = hexToString(data.payload);
  const erc20Token = "0x784f0c076CC55EAD0a585a9A13e57c467c91Dc3a"; // Sample ERC20 token address

  const call = encodeFunctionData({
    abi: erc20Abi,
    functionName: "transfer",
    args: [sender, BigInt(10)],
  });

  const voucher = {
    destination: erc20Token,
    payload: call,
    value: zeroHash,
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
