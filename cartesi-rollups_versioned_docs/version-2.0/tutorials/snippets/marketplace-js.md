```javascript
import { encodeFunctionData, toHex, zeroHash } from "viem";

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

const asBigInt = (v) => (typeof v === "bigint" ? v : BigInt(v));
const normAddr = (a) => a.toLowerCase();
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const erc721Abi = [
  {
    name: "transferFrom",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    outputs: [],
  },
];

class Storage {
  constructor(erc721_portal_address, erc20_portal_address, erc721_token, erc20_token, list_price) {
    this.erc721_portal_address = erc721_portal_address;
    this.erc20_portal_address = erc20_portal_address;
    this.erc721_token = erc721_token;
    this.erc20_token = erc20_token;
    this.application_address = normAddr(ZERO_ADDRESS);
    this.list_price = list_price

    this.listed_tokens = [];
    this.users_erc20_token_balance = new Map();
    this.user_erc721_token_balance = new Map();
    this.erc721_id_to_owner_address = new Map();
  }

  getListedTokens() {
    return this.listed_tokens;
  }

  getAppAddress() {
    return this.application_address;
  }

  setAppAddress(app_addr) {
    this.application_address = normAddr(app_addr);
  }

  getUserERC721TokenBalance(userAddress) {
    return this.user_erc721_token_balance.get(normAddr(userAddress));
  }

  getERC721TokenOwner(tokenId) {
    return this.erc721_id_to_owner_address.get(asBigInt(tokenId)); 
  }

  getUserERC20TokenBalance(userAddress) {
    return this.users_erc20_token_balance.get(normAddr(userAddress)) || 0n;
  }

  increaseUserBalance(userAddress, amount) {
    const addr = normAddr(userAddress);
    const current = this.users_erc20_token_balance.get(addr) || 0n;
    this.users_erc20_token_balance.set(addr, current + BigInt(amount));
  }

  async reduceUserBalance(userAddress, amount) {
    const addr = normAddr(userAddress);
    const current = this.users_erc20_token_balance.get(addr);

    if (current === undefined || current < BigInt(amount)) {
      await emitReport(`User ${addr} record not found`);
      console.log("User balance record not found");
      return;
    }
    this.users_erc20_token_balance.set(addr, current - BigInt(amount));
  }

  depositERC721Token(userAddress, tokenId) {
    const addr = normAddr(userAddress);
    const tid = asBigInt(tokenId); 
    this.erc721_id_to_owner_address.set(tid, addr);

    let previous_owner = this.getERC721TokenOwner(tid);

    if (normAddr(previous_owner) === normAddr(ZERO_ADDRESS)) {
      this.changeERC721TokenOwner(tid, addr, normAddr(ZERO_ADDRESS));
    } else {
      const tokens = this.user_erc721_token_balance.get(addr) || [];
      if (!tokens.some((t) => t === tid)) tokens.push(tid);
      this.user_erc721_token_balance.set(addr, tokens);
    }
  }

  listTokenForSale(tokenId) {
    const tid = asBigInt(tokenId); 
    if (!this.listed_tokens.some((id) => id === tid)) this.listed_tokens.push(tid); 
  }

  changeERC721TokenOwner(tokenId, newOwner, oldOwner) {
    const tid = asBigInt(tokenId); 
    const newAddr = normAddr(newOwner);
    const oldAddr = normAddr(oldOwner);

    this.erc721_id_to_owner_address.set(tid, newAddr);

    const newOwnerTokens = this.user_erc721_token_balance.get(newAddr) || [];
    if (!newOwnerTokens.some((id) => id === tid)) newOwnerTokens.push(tid);
    this.user_erc721_token_balance.set(newAddr, newOwnerTokens);

    const oldOwnerTokens = this.user_erc721_token_balance.get(oldAddr) || [];
    this.user_erc721_token_balance.set(oldAddr, oldOwnerTokens.filter((id) => id !== tid));
  }


  async purchaseERC721Token(buyerAddress, erc721TokenAddress, tokenId) {
    const tid = asBigInt(tokenId); 

    if (!storage.listed_tokens.includes(tokenId)) {
      await emitReport(`Token ${erc721TokenAddress} with id ${tid} is not for sale`);
      console.log("Token is not for sale");
      return false;
    }
    const owner = this.getERC721TokenOwner(tid);
    if (!owner) {
      await emitReport(`Token owner for token ${erc721TokenAddress} with id ${tid} not found`);
      console.log("Token owner not found");
      return false;
    }

    await this.reduceUserBalance(buyerAddress, storage.list_price);
    this.increaseUserBalance(owner, storage.list_price);
    this.changeERC721TokenOwner(tid, ZERO_ADDRESS, owner);
    this.listed_tokens = this.listed_tokens.filter((id) => id !== tid);
  }
}

async function handleERC20Deposit(depositorAddress, amountDeposited, tokenAddress) {
  if (normAddr(tokenAddress) === normAddr(storage.erc20_token)) {
    try {
        storage.increaseUserBalance(depositorAddress, amountDeposited);
        console.log("Token deposit processed successfully");
    } catch (error) {
        console.log("error, handing ERC20 deposit ", error)
       await emitReport(error.toString());
    }
  } else {
    console.log("Unsupported token deposited");
    await emitReport("Unsupported token deposited");
  }
}

async function handleERC721Deposit(depositorAddress, tokenId, tokenAddress) {
  if (normAddr(tokenAddress) === normAddr(storage.erc721_token)) {
    try {
      storage.depositERC721Token(depositorAddress, tokenId);
       storage.listTokenForSale(tokenId);
      console.log("Token deposit and Listing processed successfully");
      emitNotice("Token ID: " + tokenId + " Deposited by User: " + depositorAddress)
    } catch (error) {
      console.log("error, handing ERC721 deposit ", error)
      await emitReport(error.toString());
    }
  } else {
    console.log("Unsupported token deposited");
    await emitReport("Unsupported token deposited");
  }
}


function tokenDepositParse(payload) {
  const hexstr = payload.startsWith("0x") ? payload.slice(2) : payload;
  const bytes = Buffer.from(hexstr, "hex");

  if (bytes.length < 20 + 20 + 32) {
    console.log(`payload too short: ${bytes.length} bytes`);
  }

  const token = bytes.slice(0, 20);
  const receiver = bytes.slice(20, 40);
  const amount_be = bytes.slice(40, 72);

  for (let i = 0; i < 16; i++) {
    if (amount_be[i] !== 0) {
      console.log("amount too large for u128");
    }
  }

  const lo = amount_be.slice(16);
  let amount = 0n;
  for (const b of lo) {
    amount = (amount << 8n) + BigInt(b);
  }

  return {
    token: "0x" + token.toString("hex"),
    receiver: "0x" + receiver.toString("hex"),
    amount: amount.toString(),
  };
}

async function extractField(json, field) {
  const value = json[field];

  if (typeof value === "string" && value.trim() !== "") {
    return value;
  } else {
    await emitReport(`Missing or invalid ${field} field in payload`);
    console.log(`Missing or invalid ${field} field in payload`);
  }
}


async function handlePurchaseToken(callerAddress, userInput) {
  try {
    const erc721TokenAddress = normAddr(storage.erc721_token);
    const tokenId = BigInt(await extractField(userInput, "token_id"));

    try {
      if (await storage.purchaseERC721Token(callerAddress, erc721TokenAddress, tokenId) === false) {
        return;
      }
      console.log("Token purchased successfully");
      let voucher = structureVoucher({
        abi: erc721Abi,
        functionName: "transferFrom",
        args: [storage.application_address, callerAddress, tokenId],
        destination: storage.erc721_token,
      })
      emitVoucher(voucher);
    } catch (e) {
      await emitReport(`Failed to purchase token: ${e.message}`);
      console.log(`Failed to purchase token: ${e.message}`);
    }
  } catch (error) {
    console.log("error purchasing token: ", error);
    await emitReport(error.toString());
  }
}

function hexToString(hex) {
  if (typeof hex !== "string") return "";
  if (hex.startsWith("0x")) hex = hex.slice(2);
  return Buffer.from(hex, "hex").toString("utf8");
}

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));

  const sender = data["metadata"]["msg_sender"];
  app_contract = normAddr(data["metadata"]["app_contract"])

  if (normAddr(storage.application_address) == normAddr(ZERO_ADDRESS)) {
    storage.setAppAddress(app_contract);
  }

  const payload = hexToString(data.payload);

  if (normAddr(sender) == normAddr(storage.erc20_portal_address)) {
    let { token, receiver, amount } = tokenDepositParse(data.payload);
    await handleERC20Deposit(receiver, amount, token);
  } else if (normAddr(sender) == normAddr(storage.erc721_portal_address)) {
    let { token, receiver, amount } = tokenDepositParse(data.payload)
    await handleERC721Deposit(receiver, asBigInt(amount), token);
  } else {
    const payload_obj = JSON.parse(payload);
    let method = payload_obj["method"];
    switch (method) {
      case "purchase_token": {
        await handlePurchaseToken(sender, payload_obj);
        break;
      }
      default: {console.log("Unwupported method called!!"); emitReport("Unwupported method called!!")}
    }
  }
  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));

  const payload = hexToString(data.payload);
  let payload_obj;

  try {
    payload_obj = JSON.parse(payload);
  } catch (e) {
    await emitReport("Invalid payload JSON");
    return "accept";
  }

  switch (payload_obj.method) {
    case "get_user_erc20_balance": {
      const user_address = payload_obj["user_address"]; 
      const bal = storage.getUserERC20TokenBalance(normAddr(user_address));
      await emitReport(`User: ${user_address} Balance: ${bal.toString()}`);
      break;
    }
    case "get_token_owner": {
      const token_id = BigInt(payload_obj["token_id"]);
      const token_owner = storage.getERC721TokenOwner(token_id);
      await emitReport(`Token_id: ${token_id.toString()} owner: ${token_owner ?? "None"}`); 
      break;
    }
    case "get_all_listed_tokens": {
      const listed_tokens = storage.getListedTokens();
      await emitReport(`All listed tokens are: ${listed_tokens.map(String).join(",")}`);
      break;
    }
    default: {
      console.log("Unsupported method called!!");
      await emitReport("Unsupported inspect method");
    }
  }
  return "accept";
}

function stringToHex(str) {
  if (typeof str !== "string") {
    console.log("stringToHex: input must be a string");
  }
  const utf8 = Buffer.from(str, "utf8");
  return "0x" + utf8.toString("hex");
}

function structureVoucher({ abi, functionName, args, destination, value = 0n }) {
  const payload = encodeFunctionData({
    abi,
    functionName,
    args,
  });

  const valueHex = value === 0n ? zeroHash : toHex(BigInt(value));

  return {
    destination,
    payload,
    value: valueHex,
  }
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
    emitReport("error emitting Voucher");
    console.log("error emitting voucher: ", error)
  }
};

const emitReport = async (payload) => {
  let hexPayload = stringToHex(payload);
  try {
    await fetch(rollup_server + "/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexPayload }),
    });
  } catch (error) {
    console.log("error emitting report: ", error)
  }
};

const emitNotice = async (payload) => {
  let hexPayload = stringToHex(payload);
  try {
    await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexPayload }),
    });
  } catch (error) {
    emitReport("error emitting Notice");
    console.log("error emitting notice: ", error)
  }
};

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

let erc721_portal_address = "0x9E8851dadb2b77103928518846c4678d48b5e371";
let erc20_portal_address = "0xACA6586A0Cf05bD831f2501E7B4aea550dA6562D";
let erc20_token = "0x5138f529B77B4e0a7c84B77E79c4335D31938fed";
let erc721_token = "0x1c5AB37576Af4e6BEeCB66Fa6a9FdBc608F44B78";
let list_price = BigInt("100000000000000000000");

var storage = new Storage(erc721_portal_address, erc20_portal_address, erc721_token, erc20_token, list_price);

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
```
