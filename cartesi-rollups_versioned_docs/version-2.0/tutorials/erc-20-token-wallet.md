---
id: erc-20-token-wallet
title: Integrating ERC20 token wallet functionality
resources:
  - url: https://github.com/masiedu4/erc20-wallet-tutorial
    title: Source code for ERC20 wallet tutorial
---

This tutorial will guide you through creating a basic ERC20 token wallet for a Cartesi backend application using TypeScript.

:::note community tools
This tutorial is for educational purposes. For production dApps, we recommend using [Deroll](https://deroll.dev/), a TypeScript package that simplifies app and wallet functionality across all token standards for Cartesi applications.
:::

## Setting up the project
First, set up your Cartesi project as described in the [Ether wallet tutorial](./ether-wallet.md/#setting-up-the-project). Make sure you have the necessary dependencies installed.


## Building the ERC20 wallet

Create a file named `balance.ts` in the `src/wallet` directory and add the following code:

```typescript
import { Address } from "viem";

export class Balance {
  private account: string;
  private erc20Balances: Map<Address, bigint>;

  constructor(account: string, erc20Balances: Map<Address, bigint>) {
    this.account = account;
    this.erc20Balances = erc20Balances;
  }

  listErc20(): Map<Address, bigint> {
    return this.erc20Balances;
  }

  getErc20Balance(erc20: Address): bigint | undefined {
    return this.erc20Balances.get(erc20);
  }

  increaseErc20Balance(erc20: Address, amount: bigint): void {
    if (amount < 0n) {
      throw new Error(`Failed to increase balance of ${erc20} for ${this.account}`);
    }
    try {
      if (this.erc20Balances.get(erc20) === undefined) {
        this.erc20Balances.set(erc20, 0n);
      }
      this.erc20Balances.set(erc20, (this.erc20Balances.get(erc20) || 0n) + amount);
      console.log("ERC20 balance is", this.erc20Balances);
    } catch (e) {
      throw new Error(`Failed to increase balance of ${erc20} for ${this.account}: ${e}`);
    }
  }

  decreaseErc20Balance(erc20: Address, amount: bigint): void {
    if (amount < 0n) {
      throw new Error(`Failed to decrease balance of ${erc20} for ${this.account}: invalid amount specified`);
    }
    if (this.erc20Balances.get(erc20) === undefined) {
      this.erc20Balances.set(erc20, 0n);
      throw new Error(`Failed to decrease balance of ${erc20} for ${this.account}: not found with ERC20 balance`);
    }
    let erc20Balance = this.erc20Balances.get(erc20) || 0n;
    if (erc20Balance < amount) {
      throw new Error(`Failed to decrease balance of ${erc20} for ${this.account}: insufficient ERC20 balance`);
    }
    this.erc20Balances.set(erc20, erc20Balance - amount);
  }
}
```

The `Balance` class represents an individual account's balance. It includes methods to list ERC20 tokens and get, increase, and decrease the ERC20 balance.

Now, create a file named `wallet.ts` in the `src/wallet` directory and add the following code:

```typescript
import { Address, getAddress, encodeFunctionData } from "viem";
import { ethers } from "ethers";
import { Balance } from "./balance";
import { erc20Abi } from "viem";
import { Voucher } from "..";

export class Wallet {
  static accounts: Map<Address, Balance>;

  constructor() {
    Wallet.accounts = new Map<Address, Balance>();
  }

  private getBalance = (account: Address): Balance => {
    let balance = Wallet.accounts.get(account);
    if (!balance) {
      balance = new Balance(account, new Map());
      Wallet.accounts.set(account, balance);
    }
    return balance;
  };

  getAccountBalance = (
    account: Address,
    erc20: Address
  ): bigint | undefined => {
    const balance = this.getBalance(account);
    const erc20Balance = balance.getErc20Balance(erc20);
    console.info(
      `Balance for ${account} and token ${erc20} retrieved as ${erc20Balance}`
    );
    return erc20Balance;
  };

  processErc20Deposit = (payload: string): string => {
    try {
      let [erc20, account, amount] = this.parseErc20Deposit(payload);
      console.log(`${amount} ${erc20} tokens deposited to account ${account}`);
      return this.depositErc20(account, erc20, amount);
    } catch (e) {
      return `Error depositing ERC20 tokens: ${e}`;
    }
  };

  private parseErc20Deposit = (payload: string): [Address, Address, bigint] => {
    try {
      let inputData = [];
      inputData[0] = ethers.dataSlice(payload, 0, 1);
      inputData[1] = ethers.dataSlice(payload, 1, 21);
      inputData[2] = ethers.dataSlice(payload, 21, 41);
      inputData[3] = ethers.dataSlice(payload, 41, 73);

      if (!inputData[0]) {
        throw new Error("ERC20 deposit unsuccessful");
      }
      return [
        getAddress(inputData[1]),
        getAddress(inputData[2]),
        BigInt(inputData[3]),
      ];
    } catch (e) {
      throw new Error(`Error parsing ERC20 deposit: ${e}`);
    }
  };

  private depositErc20 = (
    account: Address,
    erc20: Address,
    amount: bigint
  ): string => {
    let balance = this.getBalance(account);
    balance.increaseErc20Balance(erc20, amount);
    let noticePayload = {
      type: "erc20deposit",
      content: {
        address: account,
        erc20: erc20,
        amount: amount.toString(),
      },
    };
    return JSON.stringify(noticePayload);
  };

  withdrawErc20 = (
    account: Address,
    erc20: Address,
    amount: bigint
  ): Voucher => {
    try {
      let balance = this.getBalance(account);
      balance.decreaseErc20Balance(erc20, amount);
      const call = encodeFunctionData({
        abi: erc20Abi,
        functionName: "transfer",
        args: [account, amount],
      });

      console.log(`Voucher creation success`, {
        destination: erc20,
        payload: call,
      });
      
      return {
        destination: erc20,
        payload: call,
      };
    } catch (e) {
      throw Error(`Error withdrawing ERC20 tokens: ${e}`);
    }
  };

  transferErc20 = (
    from: Address,
    to: Address,
    erc20: Address,
    amount: bigint
  ): string => {
    try {
      let balanceFrom = this.getBalance(from);
      let balanceTo = this.getBalance(to);
      balanceFrom.decreaseErc20Balance(erc20, amount);
      balanceTo.increaseErc20Balance(erc20, amount);
      let noticePayload = {
        type: "erc20transfer",
        content: {
          from: from,
          to: to,
          erc20: erc20,
          amount: amount.toString(),
        },
      };
      console.info(
        `${amount} ${erc20} tokens transferred from ${from} to ${to}`
      );
      return JSON.stringify(noticePayload);
    } catch (e) {
      throw Error(`Error transferring ERC20 tokens: ${e}`);
    }
  };
}

```

## Using the ERC20 wallet

Now, let's create a simple wallet app at the entry point `src/index.ts` to test the wallet’s functionality.

:::note
Run `cartesi address-book` to get the contract address of the `ERC20Portal` contract. Save this as a const in the `index.ts` file.
:::

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

const ERC20Portal = `0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB`;

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollupServer);

const handleAdvance: AdvanceRequestHandler = async (data) => {
  console.log("Received advance request data " + JSON.stringify(data));

  const sender = data["metadata"]["msg_sender"];
  const payload = data.payload;

  if (sender.toLowerCase() === ERC20Portal.toLowerCase()) {
    // Handle deposit
    const deposit = wallet.processErc20Deposit(payload);
    await createNotice({ payload: stringToHex(deposit) });
  } else {
    // Handle transfer or withdrawal
    try {
      const { operation, erc20, from, to, amount } = JSON.parse(
        hexToString(payload)
      );

      if (operation === "transfer") {
        const transfer = wallet.transferErc20(
          getAddress(from as Address),
          getAddress(to as Address),
          getAddress(erc20 as Address),
          BigInt(amount)
        );

        await createNotice({ payload: stringToHex(transfer) });
      } else if (operation === "withdraw") {
        const voucher = wallet.withdrawErc20(
          getAddress(from as Address),
          getAddress(erc20 as Address),
          BigInt(amount)
        );
        
        await createVoucher(voucher);
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

    const [address, erc20] = payloadString.split('/');

    const balance = wallet.getAccountBalance(address as Address, erc20 as Address);


    if (balance === undefined) {
      throw new Error("ERC20 balance is undefined");
    }

    const balmsg = `Balance of token ${erc20} for user address ${address} is ${balance}`;

    await createReport({ payload: stringToHex(balmsg) });
  } catch (error) {
    const error_message = `Error processing inspect payload:", ${error}`;

    await createReport({ payload: stringToHex(error_message) });
  }
};

const createNotice = async (payload: Notice) => {
  console.log("creating notice with payload", payload);

  await fetch(`${rollupServer}/notice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

const createVoucher = async (payload: Voucher) => {
  await fetch(`${rollupServer}/voucher`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

const createReport = async (payload: Report) => {
  await fetch(`${rollupServer}/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
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

- We handle deposits when the sender is the `ERC20Portal`.

- We parse the payload for other senders to determine the operation (`transfer` or `withdraw`).

- For `transfers`, we call `wallet.transferErc20` and create a notice with the parsed parameters.

- For `withdrawals`, we call `wallet.withdrawErc20` and create voucher using the dApp dress and the parsed parameters. 

- We created helper functions to `createNotice` for deposits and transfers, `createReport` for balance checks and `createVoucher` for withdrawals.


## Build and run the application

With Docker running, [build your backend application](../development/building-the-application.md) by running:

```shell
cartesi build
```

To run your application, enter the command:

```shell
cartesi run
```

#### Deposits

:::caution token approvals
 An approval step is needed for the [**ERC20 token standard**](https://ethereum.org/en/developers/docs/standards/tokens/). This ensures you grant explicit permission for `ERC20Portal` to transfer tokens on your behalf. 
  
  Without this approval, the `ERC20Portal` cannot deposit your tokens to the Cartesi backend.

  You will encounter this error if you don't approve the `ERC20Portal` address before deposits:

  `ContractFunctionExecutionError: The contract function "depositERC20Tokens" reverted with the following reason: ERC20: insufficient allowance`
:::

To deposit ERC20 tokens, use the `cartesi send erc20` command and follow the prompts.

#### Balance checks(used in Inspect requests)

To inspect the balance, make an HTTP call to:

```
http://localhost:8080/inspect/{address}/{tokenAddress}
```


#### Transfers and Withdrawals

Use the `cartesi send generic` command and follow the prompts. Here are sample payloads:

1. For transfers:

  ```js
  {"operation":"transfer","erc20":"0xTokenAddress","from":"0xFromAddress","to":"0xToAddress","amount":"1000000000000000000"}
  ```

2. For withdrawals:

  ```js
  {"operation":"withdraw","erc20":"0xTokenAddress","from":"0xFromAddress","amount":"1000000000000000000"}
  ```

