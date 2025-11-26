```javascript
import { encodeFunctionData, getAddress, toHex, zeroHash } from "viem";
import { ethers } from "ethers";

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
  constructor(erc721_portal_address, erc20_portal_address, erc721_token, erc20_token, list_price, dappAddressRelay) {
    this.erc721_portal_address = erc721_portal_address;
    this.erc20_portal_address = erc20_portal_address;
    this.erc721_token = erc721_token;
    this.erc20_token = erc20_token;
    this.application_address = normAddr(ZERO_ADDRESS);
    this.list_price = list_price;
    this.dappAddressRelay = dappAddressRelay;

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

function erc721TokenDepositParse(payload) {
    try {
      const erc721 = getAddress(ethers.dataSlice(payload, 0, 20));
      const account = getAddress(ethers.dataSlice(payload, 20, 40));
      const tokenId = parseInt(ethers.dataSlice(payload, 40, 72));

      return {
        token:  erc721,
        receiver: account,
        amount: tokenId,
      };
  } catch (e) {
    emitReport(`Error parsing ERC721 deposit: ${e}`);
  }
}

function erc20TokenDepositParse(payload) {
    try {
      let inputData = [];
      inputData[0] = ethers.dataSlice(payload, 0, 1);
      inputData[1] = ethers.dataSlice(payload, 1, 21);
      inputData[2] = ethers.dataSlice(payload, 21, 41);
      inputData[3] = ethers.dataSlice(payload, 41, 73);

      if (!inputData[0]) {
        emitReport("ERC20 deposit unsuccessful: invalid payload");
        throw new Error("ERC20 deposit unsuccessful");
      }
        return {
          token:  getAddress(inputData[1]),
          receiver: getAddress(inputData[2]),
          amount:  BigInt(inputData[3]),
        };
    } catch (e) {
      emitReport(`Error parsing ERC20 deposit: ${e}`);
    }
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

  const payload = hexToString(data.payload);

  if (normAddr(sender) == normAddr(storage.dappAddressRelay)) {
    if (normAddr(storage.application_address) == normAddr(ZERO_ADDRESS)) {
      storage.setAppAddress(data.payload);
    }
  } else if (normAddr(sender) == normAddr(storage.erc20_portal_address)) {
    let { token, receiver, amount } = erc20TokenDepositParse(data.payload);
    await handleERC20Deposit(receiver, amount, token);
  } else if (normAddr(sender) == normAddr(storage.erc721_portal_address)) {
    let { token, receiver, amount } = erc721TokenDepositParse(data.payload)
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

  const payload = hexToString(data.payload).trim();

  let payload_arry = payload.split("/");

  switch (payload_arry[0]) {
    case "get_user_erc20_balance": {
      const user_address = payload_arry[1]; 
      const bal = storage.getUserERC20TokenBalance(normAddr(user_address));
      await emitReport(`User: ${user_address} Balance: ${bal.toString()}`);
      break;
    }
    case "get_token_owner": {
      const token_id = BigInt(payload_arry[1]);
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

  return {
    destination,
    payload
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

let erc721_portal_address = "0x237F8DD094C0e47f4236f12b4Fa01d6Dae89fb87";
let erc20_portal_address = "0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB";
let erc20_token = "0x92C6bcA388E99d6B304f1Af3c3Cd749Ff0b591e2";
let erc721_token = "0xc6582A9b48F211Fa8c2B5b16CB615eC39bcA653B";
let dappAddressRelay = "0xF5DE34d6BbC0446E2a45719E718efEbaaE179daE";
let list_price = BigInt("100000000000000000000");

var storage = new Storage(erc721_portal_address, erc20_portal_address, erc721_token, erc20_token, list_price, dappAddressRelay);

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
