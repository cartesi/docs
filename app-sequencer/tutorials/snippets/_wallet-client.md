```json title="client/package.json"
{
  "name": "wallet-sequencer-client",
  "private": true,
  "type": "module",
  "scripts": {
    "wallet": "node wallet-client.mjs",
    "feed": "node feed.mjs"
  },
  "dependencies": {
    "viem": "^2.21.51",
    "ws": "^8.18.0"
  }
}
```

```js title="client/wallet-client.mjs"
import { concatHex, getAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function uint256LittleEndian(value) {
  if (value < 0n || value >= 1n << 256n) {
    throw new Error("value does not fit in uint256");
  }
  const bigEndian = value.toString(16).padStart(64, "0");
  return `0x${Buffer.from(bigEndian, "hex").reverse().toString("hex")}`;
}

function encodeTransfer(recipient, amount) {
  return concatHex([
    "0x01",
    uint256LittleEndian(amount),
    getAddress(recipient),
  ]);
}

function encodeWithdrawal(amount) {
  return concatHex(["0x00", uint256LittleEndian(amount)]);
}

async function submitUserOperation(privateKey, nonce, data) {
  const account = privateKeyToAccount(privateKey);
  const message = {
    nonce,
    max_fee: Number(process.env.MAX_FEE ?? 2000),
    data,
  };

  const domain = {
    name: "CartesiAppSequencer",
    version: "1",
    chainId: Number(required("CHAIN_ID")),
    verifyingContract: getAddress(required("APP_ADDRESS")),
  };

  const types = {
    UserOp: [
      { name: "nonce", type: "uint32" },
      { name: "max_fee", type: "uint16" },
      { name: "data", type: "bytes" },
    ],
  };

  const signature = await account.signTypedData({
    domain,
    types,
    primaryType: "UserOp",
    message,
  });
  const response = await fetch(`${required("SEQUENCER_URL")}/tx`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      message,
      signature,
      sender: account.address,
    }),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(
      `sequencer returned HTTP ${response.status}: ${body}`,
    );
  }

  console.log("Application payload:", data);
  console.log("Soft confirmation:", JSON.parse(body));
}

const [action, ...args] = process.argv.slice(2);
const privateKey = required("WALLET_PRIVATE_KEY");

switch (action) {
  case "transfer": {
    const [recipient, amount, nonce] = args;
    if (!recipient || !amount || nonce === undefined) {
      throw new Error(
        "usage: transfer <recipient> <amount> <nonce>",
      );
    }
    await submitUserOperation(
      privateKey,
      Number(nonce),
      encodeTransfer(recipient, BigInt(amount)),
    );
    break;
  }
  case "withdraw": {
    const [amount, nonce] = args;
    if (!amount || nonce === undefined) {
      throw new Error("usage: withdraw <amount> <nonce>");
    }
    await submitUserOperation(
      privateKey,
      Number(nonce),
      encodeWithdrawal(BigInt(amount)),
    );
    break;
  }
  default:
    throw new Error("choose one action: transfer or withdraw");
}
```
