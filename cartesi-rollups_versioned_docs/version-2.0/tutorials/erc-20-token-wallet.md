---
id: erc-20-token-wallet
title: Integrating ERC20 token wallet functionality
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

This tutorial will guide you through creating a basic ERC20 token wallet for a Cartesi backend application using TypeScript.

## Setting up the project

First, create a new TypeScript project using the [Cartesi CLI](../development/installation.md/#cartesi-cli).

```bash
cartesi create erc-20-token-wallet --template typescript
```

Run the following to generate the types for your project:

```bash
yarn && yarn run codegen
```

Now, navigate to the project directory and install [`viem`](https://viem.sh/):

```bash
yarn add viem
```

Deposit payloads from portals are packed ABI-encoded fields; see [asset handling](../development/asset-handling.md#abi-encoding-for-deposits) for the ERC-20 layout (`token`, `sender`, `amount`). Withdrawals use vouchers executed by the on-chain [`Application`](../api-reference/contracts/application.md) contract—see [withdrawing tokens](../development/asset-handling.md#withdrawing-tokens).

## Building the ERC20 wallet

Create a file named `balance.ts` in `src/wallet` directory and add the following code:

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
      throw new Error(
        `Failed to increase balance of ${erc20} for ${this.account}`
      );
    }
    try {
      if (this.erc20Balances.get(erc20) === undefined) {
        this.erc20Balances.set(erc20, 0n);
      }
      this.erc20Balances.set(
        erc20,
        (this.erc20Balances.get(erc20) || 0n) + amount
      );
      console.log("ERC20 balance is", this.erc20Balances);
    } catch (e) {
      throw new Error(
        `Failed to increase balance of ${erc20} for ${this.account}: ${e}`
      );
    }
  }

  decreaseErc20Balance(erc20: Address, amount: bigint): void {
    if (amount < 0n) {
      throw new Error(
        `Failed to decrease balance of ${erc20} for ${this.account}: invalid amount specified`
      );
    }
    if (this.erc20Balances.get(erc20) === undefined) {
      this.erc20Balances.set(erc20, 0n);
      throw new Error(
        `Failed to decrease balance of ${erc20} for ${this.account}: not found with ERC20 balance`
      );
    }
    let erc20Balance = this.erc20Balances.get(erc20) || 0n;
    if (erc20Balance < amount) {
      throw new Error(
        `Failed to decrease balance of ${erc20} for ${this.account}: insufficient ERC20 balance`
      );
    }
    this.erc20Balances.set(erc20, erc20Balance - amount);
  }
}
```

The `Balance` class represents an individual account's balance. It includes methods to list ERC20 tokens and get, increase, and decrease the ERC20 balance.

Now, create a file named `wallet.ts` in the `src/wallet` directory and add the following code:

```typescript
import {
  Address,
  getAddress,
  encodeFunctionData,
  sliceHex,
  zeroHash,
  type Hex,
} from "viem";
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

  private parseErc20Deposit = (payload: Hex): [Address, Address, bigint] => {
    try {
      const erc20 = getAddress(sliceHex(payload, 0, 20));
      const account = getAddress(sliceHex(payload, 20, 40));
      const amount = BigInt(sliceHex(payload, 40, 72));
      return [erc20, account, amount];
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
    application: Address,
    account: Address,
    erc20: Address,
    amount: bigint
  ): Voucher => {
    try {
      let balance = this.getBalance(account);
      balance.decreaseErc20Balance(erc20, amount);
      const call = encodeFunctionData({
        abi: erc20Abi,
        functionName: "transferFrom",
        args: [application, account, amount],
      });

      console.log(`Voucher creation success`, {
        destination: erc20,
        payload: call,
      });

      return {
        destination: erc20,
        payload: call,
        value: zeroHash,
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

### Voucher creation

The `withdrawErc20` method encodes `transferFrom(application, recipient, amount)` and returns a voucher. Tokens deposited through the portal sit in your on-chain `Application` contract; the application address in the voucher must match `metadata.app_contract` from the advance. Set `value` to [`zeroHash`](https://viem.sh/docs/glossary/types#zeroHash) when no Ether is sent with the call. See [withdrawing tokens](../development/asset-handling.md#withdrawing-tokens).

## Using the ERC20 wallet

Now, let's create a simple application at the entry point `src/index.ts` to test the wallet’s functionality.

The [`ERC20Portal`](../api-reference/contracts/portals/ERC20Portal.md) contract moves ERC-20 tokens from the base layer into your application. Deposits arrive as advances whose `metadata.msg_sender` is the portal address.

:::note ERC20Portal address
Run [`cartesi address-book`](../development/send-inputs-and-assets.md) and copy the `ERC20Portal` address for your network into `index.ts`. Do not hardcode portal addresses—they differ by CLI version and chain.
:::

```typescript
import createClient from "openapi-fetch";
import type { components, paths } from "./schema";
import { Wallet } from "./wallet/wallet";
import { stringToHex, getAddress, Address, hexToString } from "viem";

type AdvanceRequestData = components["schemas"]["Advance"];
type InspectRequestData = components["schemas"]["Inspect"];
type RequestHandlerResult = components["schemas"]["Finish"]["status"];
type RollupRequest = components["schemas"]["RollupRequest"];
type InspectRequestHandler = (data: InspectRequestData) => Promise<void>;
type AdvanceRequestHandler = (
  data: AdvanceRequestData
) => Promise<RequestHandlerResult>;

export type Notice = components["schemas"]["Notice"];
export type Payload = components["schemas"]["Payload"];
export type Report = components["schemas"]["Report"];
export type Voucher = components["schemas"]["Voucher"];

const wallet = new Wallet();
// Replace with the ERC20Portal address from `cartesi address-book`
const ERC20Portal = `0xYOUR_ERC20_PORTAL_ADDRESS`;

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;
console.log(`HTTP rollup_server url is ${rollupServer}`);

const handleAdvance: AdvanceRequestHandler = async (data) => {
  console.log("Received advance request data " + JSON.stringify(data));

  const application = data["metadata"]["app_contract"];
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
          getAddress(application as Address),
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

    const [address, erc20] = payloadString.split("/");

    const balance = wallet.getAccountBalance(
      address as Address,
      erc20 as Address
    );

    if (balance === undefined) {
      throw new Error("ERC20 balance is undefined");
    }

    const balmsg = `Balance of token ${erc20} for user address ${address} is ${balance}`;

    await createReport({ payload: stringToHex(balmsg) });
  } catch (error) {
    const error_message = `Error processing inspect payload: ${error}`;

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
    const { data, response } = await POST("/finish", {
      body: { status },
      parseAs: "text",
    });

    if (response.status === 200 && data) {
      const request = JSON.parse(data) as RollupRequest;
      switch (request.request_type) {
        case "advance_state":
          status = await handleAdvance(request.data as AdvanceRequestData);
          break;
        case "inspect_state":
          await handleInspect(request.data as InspectRequestData);
          break;
      }
    } else if (response.status === 202) {
      // no rollup request available
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

- For `withdrawals`, we call `wallet.withdrawErc20` with the on-chain application address (`metadata.app_contract`) as the `transferFrom` sender, then emit a voucher to the token contract.

- We created helper functions to `createNotice` for deposits and transfers, `createReport` for balance checks, and `createVoucher` for withdrawals.

## Build and run the application

With Docker running, [build your backend application](../development/running-an-application.md) by running:

```shell
cartesi build
```

To run your application, enter the command:

```shell
cartesi run
```

### Deposits

:::caution token approvals
An approval step is needed for the [**ERC20 token standard**](https://ethereum.org/en/developers/docs/standards/tokens/). This ensures you grant explicit permission for `ERC20Portal` to transfer tokens on your behalf.

Without this approval, the `ERC20Portal` cannot deposit your tokens to the Cartesi backend.

You will encounter this error if you don't approve the `ERC20Portal` address before deposits:

`ContractFunctionExecutionError: The contract function "depositERC20Tokens" reverted with the following reason: ERC20: insufficient allowance`
:::

To deposit ERC20 tokens interactively:

```bash
cartesi deposit erc20
```

Non-interactive alternative. Run from your **project root** (with `cartesi run` up). Resolve addresses from [`cartesi address-book`](../development/send-inputs-and-assets.md):

```bash
TOKEN=$(cartesi address-book 2>&1 | grep -i TestToken | awk '{print $NF}')
ERC20_PORTAL=$(cartesi address-book 2>&1 | grep -i ERC20Portal | awk '{print $NF}')

cast send "$TOKEN" \
  "approve(address,uint256)" \
  "$ERC20_PORTAL" \
  1000000000000000000 \
  --rpc-url http://127.0.0.1:6751/anvil \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

cartesi deposit erc20 100000000000000000 \
  --token "$TOKEN" \
  --project-name erc-20-token-wallet \
  --rpc-url http://127.0.0.1:6751/anvil
```

### Balance checks (used in Inspect requests)

Inspect payloads use the form `userAddress/erc20TokenAddress` as a UTF-8 string (hex-encoded in the JSON body). Example for user `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` and token `0x5FbDB2315678afecb367f032d93F642f64180aa3`:

```bash
curl -X POST http://127.0.0.1:6751/inspect/erc-20-token-wallet \
  -H "Content-Type: application/json" \
  -d '{"payload": "0x3078663339466436653531616164383846364634636536614238383237323739636666466239323236362f307835466244423233313536373861666563623336376630333264393346363432663634313830616133"}'
```

Replace the inspect path if your project name is not `erc-20-token-wallet` (see the URL printed by `cartesi run`). Build the payload with `stringToHex` from viem if you use different addresses.

### Transfers and Withdrawals

To process transfers and withdrawals interactively, run the command below, select `String encoding`, then enter one of the sample payloads:

```bash
cartesi send
```

Non-interactive alternative (from your project root):

```bash
cartesi send --encoding string \
  '{"operation":"withdraw","erc20":"0xTokenAddress","from":"0xFromAddress","amount":"1000000000000000000"}' \
  --project-name erc-20-token-wallet \
  --rpc-url http://127.0.0.1:6751/anvil
```

1. For transfers:

   ```js
   {"operation":"transfer","erc20":"0xTokenAddress","from":"0xFromAddress","to":"0xToAddress","amount":"1000000000000000000"}
   ```

2. For withdrawals:

   ```js
   {"operation":"withdraw","erc20":"0xTokenAddress","from":"0xFromAddress","amount":"1000000000000000000"}
   ```

### Using the explorer

[CartesiScan](https://cartesiscan.io/) is a web application that offers a comprehensive overview of your application. It provides expandable data regarding notices, vouchers, and reports.

Start the node with the explorer service enabled:

```shell
cartesi run --services explorer
```

The local explorer is then available at `http://localhost:6751/explorer` (same port as the application node—see [running an application](../development/running-an-application.md)). The explorer is not started by plain `cartesi run`; you must pass `--services explorer`.

You can execute your vouchers via the explorer, which completes the withdrawal process at the end of [an epoch](../api-reference/backend/vouchers.md/#epoch-configuration).

:::info Repo Link
   You can access the complete project implementation [here](https://github.com/Mugen-Builders/docs_examples/tree/main/erc-20-token-wallet)!
:::