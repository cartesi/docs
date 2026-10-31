```js title="submit.mjs"
import { readFileSync } from "node:fs";
import { getAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

const account = privateKeyToAccount(
  readFileSync(required("USER_PRIVATE_KEY_FILE"), "utf8").trim(),
);

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

const message = {
  nonce: Number(required("USER_NONCE")),
  max_fee: Number(required("MAX_FEE")),
  data: required("METHOD_DATA"),
};

const signature = await account.signTypedData({
  domain,
  types,
  primaryType: "UserOp",
  message,
});
const request = { message, signature, sender: account.address };
const response = await fetch(`${required("SEQUENCER_URL")}/tx`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(request),
});

const body = await response.text();
if (!response.ok) {
  throw new Error(`sequencer returned HTTP ${response.status}: ${body}`);
}

console.log(JSON.parse(body));
```
