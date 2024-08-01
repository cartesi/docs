---
id: erc-721-token-wallet
title: Integrating ERC721 token wallet functionality
---

This tutorial will guide you through creating a basic ERC721(NFT) token wallet for a Cartesi backend application using TypeScript.

## Setting up the project
First, set up your Cartesi project as described in the [Ether wallet tutorial](./ether-wallet.md/#setting-up-the-project). Make sure you have the necessary dependencies installed.


## Building the ERC721 wallet

Create a file named `balance.ts` in the `src/wallet` directory and add the following code:

```typescript
import { Address } from "viem";

export class Balance {
  private account: string;
  private erc721Tokens: Map<Address, Set<number>>;

  constructor(account: string, erc721Tokens: Map<Address, Set<number>>) {
    this.account = account;
    this.erc721Tokens = erc721Tokens;
  }

  listErc721(): Map<Address, Set<number>> {
    return this.erc721Tokens;
  }

  getErc721Tokens(erc721: Address): Set<number> | undefined {
    return this.erc721Tokens.get(erc721);
  }

  addErc721Token(erc721: Address, tokenId: number): void {
    if (!this.erc721Tokens.has(erc721)) {
      this.erc721Tokens.set(erc721, new Set());
    }
    const tokens = this.erc721Tokens.get(erc721);
    if (tokens) {
      tokens.add(tokenId);
    } else {
      throw new Error(`Failed to add token ${erc721}, id:${tokenId} for ${this.account}`);
    }
  }

  removeErc721Token(erc721: Address, tokenId: number): void {
    if (!this.erc721Tokens.has(erc721)) {
      throw new Error(`Failed to remove token ${erc721}, id:${tokenId} from ${this.account}: Collection not found`);
    }
    const tokens = this.erc721Tokens.get(erc721);
    if (!tokens?.delete(tokenId)) {
      throw new Error(`Failed to remove token ${erc721}, id:${tokenId} from ${this.account}: Token not found`);
    }
  }
}
```

The `Balance` class represents an account's balance. It contains a map of ERC721 tokens and their corresponding token IDs.

Now, create a file named `wallet.ts` in the `src/wallet` directory and add the following code:

```typescript
import { Address, getAddress, hexToBytes, encodeFunctionData } from "viem";
import { ethers } from "ethers";
import { Balance } from "./balance";

import { erc721Abi } from "viem";

export class Wallet {
  private accounts: Map<Address, Balance> = new Map();

  private getOrCreateBalance(address: Address): Balance {
    let balance = this.accounts.get(address);
    if (!balance) {
      balance = new Balance(address, new Map());
      this.accounts.set(address, balance);
    }
    return balance;
  }

  getBalance(address: Address): Balance {
    return this.getOrCreateBalance(address);
  }

  processErc721Deposit(payload: string): string {
    try {
      const [erc721, account, tokenId] = this.parseErc721Deposit(payload);
      console.info(`Token ERC-721 ${erc721} id: ${tokenId} deposited in ${account}`);
      return this.depositErc721(account, erc721, tokenId);
    } catch (e) {
      return `Error depositing ERC721 token: ${e}`;
    }
  }

  private parseErc721Deposit(payload: string): [Address, Address, number] {
    const erc721 = getAddress(ethers.dataSlice(payload, 0, 20));
    const account = getAddress(ethers.dataSlice(payload, 20, 40));
    const tokenId = parseInt(ethers.dataSlice(payload, 40, 72));
    return [erc721, account, tokenId];
  }

  private depositErc721(account: Address, erc721: Address, tokenId: number): string {
    const balance = this.getOrCreateBalance(account);
    balance.addErc721Token(erc721, tokenId);
    const noticePayload = {
      type: "erc721deposit",
      content: {
        address: account,
        erc721: erc721,
        tokenId: tokenId.toString(),
      },
    };
    return JSON.stringify(noticePayload);
  }

  withdrawErc721(rollupAddress: Address, account: Address, erc721: Address, tokenId: number): string {
    try {
      const balance = this.getOrCreateBalance(account);
      balance.removeErc721Token(erc721, tokenId);
      const call = encodeFunctionData({
        abi: erc721Abi,
        functionName: "safeTransferFrom",
        args: [rollupAddress, account, BigInt(tokenId)],
      });
      console.info(`Token ERC-721:${erc721}, id:${tokenId} withdrawn from ${account}`);
      return JSON.stringify(hexToBytes(call))
    } catch (e) {
      return `Error withdrawing ERC721 token: ${e}`;
    }
  }

  transferErc721(from: Address, to: Address, erc721: Address, tokenId: number): string {
    try {
      const balanceFrom = this.getOrCreateBalance(from);
      const balanceTo = this.getOrCreateBalance(to);
      balanceFrom.removeErc721Token(erc721, tokenId);
      balanceTo.addErc721Token(erc721, tokenId);
      const noticePayload = {
        type: "erc721transfer",
        content: {
          from: from,
          to: to,
          erc721: erc721,
          tokenId: tokenId.toString(),
        },
      };
      console.info(`Token ERC-721 ${erc721} id:${tokenId} transferred from ${from} to ${to}`);
      return JSON.stringify(noticePayload);
    } catch (e) {
      return `Error transferring ERC721 token: ${e}`;
    }
  }
}
```

## Using the wallet

Now, let's create a simple wallet app in the entrypoint, `src/index.ts` to test the wallet functionality.

Run `cartesi address-book` to get the contract address of the `ERC20Portal` contract. Save this as a const in the `index.ts` file.

```typescript
import createClient from "openapi-fetch";
import { components, paths } from "./schema";
import { Wallet } from "./wallet/wallet";
import { stringToHex, getAddress, Address, hexToString, toHex } from "viem";

type AdvanceRequestData = components["schemas"]["Advance"];
type InspectRequestData = components["schemas"]["Inspect"];
type RequestHandlerResult = components["schemas"]["Finish"]["status"];
type RollupsRequest = components["schemas"]["RollupRequest"];
export type Notice = components["schemas"]["Notice"];
export type Payload = components["schemas"]["Payload"];
export type Report = components["schemas"]["Report"];
export type Voucher = components["schemas"]["Voucher"];

type InspectRequestHandler = (data: InspectRequestData) => Promise<void>;
type AdvanceRequestHandler = (
  data: AdvanceRequestData
) => Promise<RequestHandlerResult>;

const wallet = new Wallet();

const ERC721Portal = `0x237F8DD094C0e47f4236f12b4Fa01d6Dae89fb87`;

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollupServer);

const handleAdvance: AdvanceRequestHandler = async (data) => {
  console.log("Received advance request data " + JSON.stringify(data));

  const sender = data["metadata"]["msg_sender"];
  const payload = data.payload;

  if (sender.toLowerCase() === ERC721Portal.toLowerCase()) {
    // Handle deposit
    const deposit = wallet.processErc721Deposit(payload);
    await sendNotice(stringToHex(deposit));
  } else {
    // Handle transfer or withdrawal
    try {
      const { operation, erc721, from, to, tokenId } = JSON.parse(hexToString(payload));

      if (operation === "transfer") {
        const transfer = wallet.transferErc721(
          getAddress(from as Address),
          getAddress(to as Address),
          getAddress(erc721 as Address),
          parseInt(tokenId)
        );
        console.log(transfer);
        await sendNotice(stringToHex(transfer));
      } else if (operation === "withdraw") {
        const withdraw = wallet.withdrawErc721(
          getAddress(ERC721Portal as Address),
          getAddress(from as Address),
          getAddress(erc721 as Address),
          parseInt(tokenId)
        );
        console.log(withdraw);
        await sendVoucher(JSON.parse(withdraw));
      } else {
        console.log("Unknown operation");
      }
    } catch (error) {
      console.error("Error processing payload:", error);
    }
  }

  return "accept";
};

const handleInspect: InspectRequestHandler = async (data) => {
  console.log("Received inspect request data " + JSON.stringify(data));

  try {
    const payloadString = hexToString(data.payload);
    const address = '0x' + payloadString.slice(0, 40);
    const erc721 = '0x' + payloadString.slice(40, 80);

    const balance = wallet.getBalance(getAddress(address as Address));
    let erc721balance = balance.getErc721Tokens(erc721 as Address);

    if (erc721balance === undefined) {
      throw new Error("ERC721 balance is undefined");
    }

    // Convert Set<number> to Uint8Array
    const erc721balanceArray = new Uint8Array(Array.from(erc721balance));

    await sendReport({ payload: toHex(erc721balanceArray) });
  } catch (error) {
    console.error("Error processing inspect payload:", error);
  }
};

const sendNotice = async (payload: Payload) => {
  await fetch(`${rollupServer}/notice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

const sendVoucher = async (payload: Voucher) => {
  await fetch(`${rollupServer}/voucher`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload }),
  });
};

const sendReport = async (payload: Report) => {
  await fetch(`${rollupServer}/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload }),
  });
};

const main = async () => {
  const { POST } = createClient<paths>({ baseUrl: rollupServer });
  let status: RequestHandlerResult = "accept";
  while (true) {
    const { response } = await POST("/finish", {
      body: { status },
      parseAs: "text",
    });

    if (response.status === 200) {
      const data = (await response.json()) as RollupsRequest;
      switch (data.request_type) {
        case "advance_state":
          status = await handleAdvance(data.data as AdvanceRequestData);
          break;
        case "inspect_state":
          await handleInspect(data.data as InspectRequestData);
          break;
      }
    } else if (response.status === 202) {
      console.log(await response.text());
    }
  }
};

main().catch((e) => {
  console.log(e);
  process.exit(1);
});

```



Here is a breakdown of the wallet functionality:
- We handle deposits when the sender is the `ERC721Portal`.
- For other senders, we parse the payload to determine the operation (`transfer` or `withdraw`).
- For `transfers`, we call `wallet.transferERC721` with the parsed parameters.
- For `withdrawals`, we call `wallet.withdrawERC721` with the parsed parameters.
- We created helper functions to `sendNotice` for deposits and transfers, `sendReport` for balance checks and `sendVoucher` for withdrawals.


#### Deposits
To deposit ERC721 tokens, use the `cartesi send erc721` command and follow the prompts.

#### Balance checks(used in Inspect requests)

To inspect balance, make an HTTP call to:

```
http://localhost:8080/inspect/{address}/{tokenAddress}
```


#### Transfers and Withdrawals

Use the `cartesi send generic` command and follow the prompts. Here are sample payloads:

1. For transfers:

	```js
	{"operation":"transfer","erc721":"0xTokenAddress","from":"0xFromAddress","to":"0xToAddress","tokenId":"1"}
	```

2. For withdrawals:

	```js
	{"operation":"withdraw","erc721":"0xTokenAddress","from":"0xFromAddress","tokenId":"1"}
	```

:::note community tools
This tutorial is for educational purposes. For production dApps, we recommend using [Deroll](https://deroll.dev/), a TypeScript package that simplifies app and wallet functionality across all token standards for Cartesi applications.
:::


