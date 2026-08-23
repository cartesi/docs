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
    "ethers": "^6.15.0",
    "ws": "^8.18.0"
  }
}
```

```js title="client/wallet-client.mjs"
import {
  Wallet,
  concat,
  getAddress,
  getBytes,
} from "ethers";

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function uint256LittleEndian(value) {
  const bigEndian = value.toString(16).padStart(64, "0");
  return Uint8Array.from(Buffer.from(bigEndian, "hex")).reverse();
}

function encodeTransfer(recipient, amount) {
  return concat([
    "0x01",
    uint256LittleEndian(amount),
    getBytes(getAddress(recipient)),
  ]);
}

function encodeWithdrawal(amount) {
  return concat(["0x00", uint256LittleEndian(amount)]);
}

async function submitUserOperation(privateKey, nonce, data) {
  const wallet = new Wallet(privateKey);
  const message = {
    nonce,
    max_fee: Number(process.env.MAX_FEE ?? 2000),
    data,
  };

  const domain = {
    name: "CartesiAppSequencer",
    version: "1",
    chainId: Number(required("CHAIN_ID")),
    verifyingContract: required("APP_ADDRESS"),
  };

  const types = {
    UserOp: [
      { name: "nonce", type: "uint32" },
      { name: "max_fee", type: "uint16" },
      { name: "data", type: "bytes" },
    ],
  };

  const signature = await wallet.signTypedData(
    domain,
    types,
    message,
  );
  const response = await fetch(`${required("SEQUENCER_URL")}/tx`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      message,
      signature,
      sender: wallet.address,
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

```js title="client/feed.mjs"
import WebSocket from "ws";

const sequencerUrl = process.env.SEQUENCER_URL;
if (!sequencerUrl) throw new Error("SEQUENCER_URL is required");

const feedUrl =
  `${sequencerUrl.replace(/^http/, "ws")}` +
  "/ws/subscribe?from_offset=0";
const socket = new WebSocket(feedUrl);

socket.on("open", () => {
  console.log(`Subscribed to ${feedUrl}`);
});
socket.on("message", (data) => {
  console.log(JSON.stringify(JSON.parse(data.toString()), null, 2));
});
socket.on("close", (code, reason) => {
  console.log(`Feed closed with code ${code}: ${reason.toString()}`);
});
socket.on("error", (error) => {
  console.error("Feed error:", error);
});
```
