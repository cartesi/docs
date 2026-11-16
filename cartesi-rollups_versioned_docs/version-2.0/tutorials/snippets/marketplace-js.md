```javascript
import { Rollup } from "@cartesi/rollup";
import { encodeFunctionData } from "viem";

const rollup = new Rollup();

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
    this.erc721_portal_address = normAddr(erc721_portal_address);
    this.erc20_portal_address = normAddr(erc20_portal_address);
    this.erc721_token = normAddr(erc721_token);
    this.erc20_token = normAddr(erc20_token);
    this.list_price = list_price;

    this.listed_tokens = [];
    this.users_erc20_token_balance = new Map();
    this.user_erc721_token_balance = new Map();
    this.erc721_id_to_owner_address = new Map();
  }

  getListedTokens() {
    return this.listed_tokens;
  }

  getUserERC721TokenBalance(userAddress) {
    return this.user_erc721_token_balance.get(normAddr(userAddress)) || [];
  }

  getERC721TokenOwner(tokenId) {
    return this.erc721_id_to_owner_address.get(tokenId);
  }

  getUserERC20TokenBalance(userAddress) {
    return this.users_erc20_token_balance.get(normAddr(userAddress)) || 0n;
  }

  increaseUserBalance(userAddress, amount) {
    const addr = normAddr(userAddress);
    this.users_erc20_token_balance.set(addr, this.getUserERC20TokenBalance(addr) + amount);
  }

  reduceUserBalance(userAddress, amount) {
    const addr = normAddr(userAddress);
    const current = this.getUserERC20TokenBalance(addr);
    if (current < amount) {
      throw new Error(`User ${addr} has insufficient balance`);
    }
    this.users_erc20_token_balance.set(addr, current - amount);
  }

  depositERC721Token(userAddress, tokenId) {
    const previousOwner = this.getERC721TokenOwner(tokenId);
    this.changeERC721TokenOwner(tokenId, normAddr(userAddress), previousOwner);
  }

  listTokenForSale(tokenId) {
    if (!this.listed_tokens.includes(tokenId)) this.listed_tokens.push(tokenId);
  }

  changeERC721TokenOwner(tokenId, newOwner, oldOwner) {
    this.erc721_id_to_owner_address.set(tokenId, newOwner);

    const newOwnerTokens = this.getUserERC721TokenBalance(newOwner);
    if (!newOwnerTokens.includes(tokenId)) newOwnerTokens.push(tokenId);
    this.user_erc721_token_balance.set(newOwner, newOwnerTokens);

    if (oldOwner !== undefined) {
      const oldOwnerTokens = this.getUserERC721TokenBalance(oldOwner);
      this.user_erc721_token_balance.set(oldOwner, oldOwnerTokens.filter((id) => id !== tokenId));
    }
  }

  purchaseERC721Token(buyerAddress, tokenId) {
    if (!this.listed_tokens.includes(tokenId)) {
      throw new Error(`Token ${this.erc721_token} with id ${tokenId} is not for sale`);
    }
    const owner = this.getERC721TokenOwner(tokenId);
    if (!owner) {
      throw new Error(`Token owner for token ${this.erc721_token} with id ${tokenId} not found`);
    }

    this.reduceUserBalance(buyerAddress, this.list_price);
    this.increaseUserBalance(owner, this.list_price);
    // the NFT leaves the marketplace with the voucher below
    this.changeERC721TokenOwner(tokenId, ZERO_ADDRESS, owner);
    this.listed_tokens = this.listed_tokens.filter((id) => id !== tokenId);
  }
}

function tokenDepositParse(payload) {
  // ERC-20 and ERC-721 deposits start with the same packed fields:
  // token (20 bytes), sender (20 bytes), amount or token ID (32 bytes)
  if (payload.length < 72) {
    throw new Error(`payload too short: ${payload.length} bytes`);
  }
  return {
    token: `0x${payload.subarray(0, 20).toString("hex")}`,
    receiver: `0x${payload.subarray(20, 40).toString("hex")}`,
    amount: BigInt(`0x${payload.subarray(40, 72).toString("hex")}`),
  };
}

function handleERC20Deposit(depositorAddress, amountDeposited, tokenAddress) {
  if (normAddr(tokenAddress) !== storage.erc20_token) {
    throw new Error("Unsupported token deposited");
  }
  storage.increaseUserBalance(depositorAddress, amountDeposited);
  console.log("Token deposit processed successfully");
}

function handleERC721Deposit(depositorAddress, tokenId, tokenAddress) {
  if (normAddr(tokenAddress) !== storage.erc721_token) {
    throw new Error("Unsupported token deposited");
  }
  storage.depositERC721Token(depositorAddress, tokenId);
  storage.listTokenForSale(tokenId);
  console.log("Token deposit and listing processed successfully");
  emitNotice(`Token ID: ${tokenId} Deposited by User: ${depositorAddress}`);
}

function extractField(json, field) {
  const value = json[field];
  if (typeof value === "string" && value.trim() !== "") {
    return value;
  }
  throw new Error(`Missing or invalid ${field} field in payload`);
}

function handlePurchaseToken(callerAddress, userInput, applicationAddress) {
  const tokenId = BigInt(extractField(userInput, "token_id"));
  storage.purchaseERC721Token(callerAddress, tokenId);
  console.log("Token purchased successfully");

  // The application contract holds the deposited NFTs and executes the
  // voucher, so it is the `from` address of the transfer
  const payload = encodeFunctionData({
    abi: erc721Abi,
    functionName: "transferFrom",
    args: [applicationAddress, callerAddress, tokenId],
  });
  rollup.emitVoucher({ destination: storage.erc721_token, value: 0n, payload });
  console.log("Voucher generation successful");
}

function emitNotice(text) {
  rollup.emitNotice(Buffer.from(text, "utf8"));
}

function emitReport(text) {
  rollup.emitReport(Buffer.from(text, "utf8"));
}

function handleAdvance(request) {
  console.log(
    `Received advance request from ${request.msgSender} with index ${request.index} and payload 0x${request.payload.toString("hex")}`,
  );
  const sender = normAddr(request.msgSender);

  try {
    if (sender === storage.erc20_portal_address) {
      const { token, receiver, amount } = tokenDepositParse(request.payload);
      handleERC20Deposit(receiver, amount, token);
    } else if (sender === storage.erc721_portal_address) {
      const { token, receiver, amount } = tokenDepositParse(request.payload);
      handleERC721Deposit(receiver, amount, token);
    } else {
      const userInput = JSON.parse(request.payload.toString("utf8"));
      switch (userInput.method) {
        case "purchase_token":
          handlePurchaseToken(sender, userInput, request.appContract);
          break;
        default:
          throw new Error("Unsupported method called!!");
      }
    }
    return true;
  } catch (error) {
    console.log(`Error processing advance request: ${error.message}`);
    emitReport(error.message);
    return false;
  }
}

function handleInspect(request) {
  console.log(`Received inspect request with payload ${request.payload.toString("utf8")}`);

  let userInput;
  try {
    userInput = JSON.parse(request.payload.toString("utf8"));
  } catch {
    emitReport("Invalid payload JSON");
    return;
  }

  switch (userInput.method) {
    case "get_user_erc20_balance": {
      const user_address = userInput.user_address;
      const bal = storage.getUserERC20TokenBalance(user_address);
      emitReport(`User: ${user_address} Balance: ${bal}`);
      break;
    }
    case "get_token_owner": {
      const token_id = BigInt(userInput.token_id);
      const token_owner = storage.getERC721TokenOwner(token_id);
      emitReport(`Token_id: ${token_id} owner: ${token_owner ?? "None"}`);
      break;
    }
    case "get_all_listed_tokens": {
      const listed_tokens = storage.getListedTokens();
      emitReport(`All listed tokens are: ${listed_tokens.map(String).join(",")}`);
      break;
    }
    default: {
      console.log("Unsupported method called!!");
      emitReport("Unsupported inspect method");
    }
  }
}

const erc721_portal_address = "0x397c352d18DFf47CC8a6143403142cf7afd5Ff7E";
const erc20_portal_address = "0x3332DE61a8BB9aC84893b2f552Fe81C9a6dC5419";
const erc20_token = "0x86EA17052C8e335Ad830B54EF566274EAB46B852";
const erc721_token = "0x0761b8e3aB06F458632974393C48765E6Ddc61bB";
const list_price = 100000000000000000000n;

const storage = new Storage(erc721_portal_address, erc20_portal_address, erc721_token, erc20_token, list_price);

await rollup.run({ advance: handleAdvance, inspect: handleInspect });
```
