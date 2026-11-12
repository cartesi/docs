---
id: ether-wallet
title: Integrating Ether wallet functionality
---

This tutorial will build a basic Ether wallet inside a Cartesi backend application using TypeScript.

The goal is to have a backend application to track balances and receive, transfer, and withdraw Ether.

## Setting up the project

First, create a new TypeScript project using the [Cartesi CLI](../development/installation.md/#cartesi-cli).

```bash
cartesi create ether-wallet --template typescript
```

Run the following to generate the types for your project:

```bash
yarn && yarn run codegen
```

Now, navigate to the project directory and install [`viem`](https://viem.sh/):

```bash
yarn add viem@2.57.19
```

## Building the Ether wallet

Our wallet will have two main classes: `Balance` and `Wallet`. Let's implement each of these:

Create a file named `balance.ts` in the `src/wallet` directory and add the following code:

```typescript
import { Address } from "viem";

export class Balance {
  constructor(
    private readonly address: Address,
    private ether: bigint = 0n
  ) {}

  getEther(): bigint {
    return this.ether;
  }

  increaseEther(amount: bigint): void {
    if (amount < 0n) {
      throw new Error(`Invalid amount: ${amount}`);
    }
    this.ether += amount;
  }

  decreaseEther(amount: bigint): void {
    if (amount < 0n || this.ether < amount) {
      throw new Error(`Invalid amount: ${amount}`);
    }
    this.ether -= amount;
  }
}
```

The `Balance` class represents an individual account's balance. It includes methods for getting, increasing, and decreasing the Ether balance.

Now, create a file named `wallet.ts` in the `src/wallet` directory and add the following code:

```typescript
import {
  Address,
  getAddress,
  Hex,
  numberToHex,
  sliceHex,
} from "viem";
import { Balance } from "./balance";
import { Voucher } from "..";

export class Wallet {
  private accounts: Map<string, Balance> = new Map();

  private getOrCreateBalance(address: Address): Balance {
    const key = address.toLowerCase();
    if (!this.accounts.has(key)) {
      this.accounts.set(key, new Balance(address));
    }
    return this.accounts.get(key)!;
  }

  getBalance(address: Address): bigint {
    return this.getOrCreateBalance(address).getEther();
  }

  depositEther(payload: string): string {
    const [address, amount] = this.parseDepositPayload(payload);
    const balance = this.getOrCreateBalance(address);
    balance.increaseEther(amount);
    console.log(
      `After deposit, balance for ${address} is ${balance.getEther()}`
    );
    return JSON.stringify({
      type: "etherDeposit",
      address,
      amount: amount.toString(),
    });
  }

  withdrawEther(address: Address, amount: bigint): Voucher {
    const balance = this.getOrCreateBalance(address);

    if (balance.getEther() >= amount) {
      balance.decreaseEther(amount);
      const voucher = this.encodeWithdrawCall(address, amount);

      console.log("Voucher created successfully", voucher);

      return voucher;
    } else {
      throw Error("Insufficient balance");
    }
  }

  transferEther(from: Address, to: Address, amount: bigint): string {
    const fromBalance = this.getOrCreateBalance(from);
    const toBalance = this.getOrCreateBalance(to);

    if (fromBalance.getEther() >= amount) {
      fromBalance.decreaseEther(amount);
      toBalance.increaseEther(amount);
      console.log(
        `After transfer, balance for ${from} is ${fromBalance.getEther()}`
      );
      console.log(
        `After transfer, balance for ${to} is ${toBalance.getEther()}`
      );
      return JSON.stringify({
        type: "etherTransfer",
        from,
        to,
        amount: amount.toString(),
      });
    } else {
      throw Error("Insufficient amount");
    }
  }

  private parseDepositPayload(payload: Hex): [Address, bigint] {
    const addressData = sliceHex(payload, 0, 20);
    const amountData = sliceHex(payload, 20, 52);
    return [getAddress(addressData), BigInt(amountData)];
  }

  private encodeWithdrawCall(receiver: Address, amount: bigint): Voucher {
    return {
      destination: receiver,
      payload: "0x",
      value: numberToHex(amount, { size: 32 }),
    };
  }
}
```

The `Wallet` class manages multiple accounts and provides methods for everyday wallet operations. Key features include storing balances, centralizing the logic for retrieving or creating a balance, and depositing, withdrawing, and transferring Ether.

`parseDepositPayload` and `encodeWithdrawCall` handle the low-level details of working with the base layer data.

### Voucher creation

The `encodeWithdrawCall` method returns a voucher. Creating vouchers is a crucial concept in Cartesi Rollups for executing withdrawal operations on the base layer chain.

In Rollups v2, the on-chain [`Application`](../api-reference/contracts/application.md) contract executes vouchers through [`executeOutput()`](../api-reference/contracts/application.md#executeoutput), which decodes a voucher as `(destination, value, payload)` and performs a [`safeCall`](https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.10/src/library/LibAddress.sol) to `destination` with the specified wei `value`. Ether held by your application (see `metadata.app_contract` on each advance) is sent to the recipient this way.

For a plain Ether transfer, leave `payload` empty (`0x`, no calldata). The voucher fields are:

- `destination`: The address that receives the withdrawn Ether.
- `payload`: `0x` when you are not calling a function on the recipient. A non-empty payload, even 32 zero bytes such as `zeroHash`, makes the voucher revert with `TargetHasNoCode` when the recipient is a wallet with no code (see [asset handling](../development/asset-handling.md#withdrawing-ether)).
- `value`: The withdrawal amount in wei, as a `0x`-prefixed hex string. `numberToHex(amount, { size: 32 })` pads it to 32 bytes.

## Using the Ether wallet

Now, let's create a simple application at the entry point, `src/index.ts,` to test the wallet functionality.

The [`EtherPortal`](../api-reference/contracts/portals/EtherPortal.md) contract allows anyone to transfer Ether into your application. All deposits are made via the `EtherPortal` contract.

:::note EtherPortal address
Run [`cartesi address-book`](../development/send-inputs-and-assets.md) and copy the `EtherPortal` address for your network into `index.ts`. Do not hardcode portal addresses—they differ by CLI version and chain.
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
// Replace with the EtherPortal address from `cartesi address-book`
const EtherPortal = `0xYOUR_ETHER_PORTAL_ADDRESS`;

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;
console.log(`HTTP rollup_server url is ${rollupServer}`);

const handleAdvance: AdvanceRequestHandler = async (data) => {
  console.log(`Received advance request data ${JSON.stringify(data)}`);

  const application = data["metadata"]["app_contract"];
  const sender = data["metadata"]["msg_sender"];
  const payload = data.payload;

  if (sender.toLowerCase() === EtherPortal.toLowerCase()) {
    // Handle deposit
    const deposit = wallet.depositEther(payload);
    await createNotice({ payload: stringToHex(deposit) });
  } else {
    // Handle transfer or withdrawal
    try {
      const { operation, from, to, amount } = JSON.parse(hexToString(payload));

      if (operation === "transfer") {
        const transfer = wallet.transferEther(
          getAddress(from as Address),
          getAddress(to as Address),
          BigInt(amount)
        );
        await createNotice({ payload: stringToHex(transfer) });
      } else if (operation === "withdraw") {
        // `application` is the on-chain Application that holds deposited ETH
        console.log(`Withdrawing from application ${application}`);
        const voucher = wallet.withdrawEther(
          getAddress(from as Address),
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
  console.log(`Received inspect request data ${JSON.stringify(data)}`);

    try {
    const address = hexToString(data.payload);
    console.log(address);
    const balance = wallet.getBalance(address as Address);

    const reportPayload = `Balance for ${address} is ${balance} wei`;
    await createReport({ payload: stringToHex(reportPayload) });
  } catch (error) {
    console.error("Error processing inspect payload:", error);
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

This code sets up a simple application that listens for requests from the Cartesi rollup server. It processes the requests and sends responses back to the server.

Here is a breakdown of the wallet functionality:

- `handleAdvance` handles Ether deposits (from `EtherPortal`) and user operations (transfers/withdrawals).

- We handle deposits and create a notice when the sender is the `EtherPortal`.

- We parse the payload for other senders to determine the operation (`transfer` or `withdraw`).

- For `transfers`, we call `wallet.transferEther` and create a notice with the parsed parameters.

For withdrawals, we call `wallet.withdrawEther` and create a voucher that sends wei from the on-chain Application (`metadata.app_contract`) to the user.

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

To deposit ether interactively:

```bash
cartesi deposit ether
```

Non-interactive alternative (with `cartesi run` up). Run from your **project root** directory so the CLI can resolve the application address:

```bash
cartesi deposit ether 1 \
  --project-name ether-wallet \
  --rpc-url http://127.0.0.1:6751/anvil
```

Change the amount (`1` = 1 ETH) as needed. Use your project name in `--project-name` if it differs from `ether-wallet`.

### Balance checks(used in Inspect requests)

To inspect balance, make an HTTP (post) call to:

```bash
curl -X POST http://127.0.0.1:6751/inspect/ether-wallet \
  -H "Content-Type: text/plain" \
  -d '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
```

The node passes the request body to your application unchanged as the inspect payload, so the body is the address to query as plain text (here `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`). Replace the inspect path if your project name is not `ether-wallet` (see the URL printed by `cartesi run`).

### Transfer and Withdrawals

Transfers and withdrawal requests will be sent as generic json strings that will be parsed and processed.

To process transfers and withdrawals interactively, run the command below, select `String encoding`, then follow the prompts:

```bash
cartesi send
```

Non-interactive alternative (from your project root):

```bash
cartesi send --encoding string \
  '{"operation":"transfer","from":"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266","to":"0x3f2bd12ea0b8604c2af5bf241f6a606e892a403a","amount":"1000000000000000000"}' \
  --project-name ether-wallet \
  --rpc-url http://127.0.0.1:6751/anvil
```

Here are the sample payloads as one-liners, ready to be used in your code:

1. For transfers:

   ```js
   {"operation":"transfer","from":"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266","to":"0x3f2bd12ea0b8604c2af5bf241f6a606e892a403a","amount":"1000000000000000000"}
   ```

2. For withdrawals:

   ```js
   {"operation":"withdraw","from":"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266","amount":"1000000000000000000"}
   ```

### Using the explorer

For end-to-end functionality, developers will likely build their [custom user-facing web application](../tutorials/react-frontend-application.md).

[CartesiScan](https://cartesiscan.io/) is a web application that offers a comprehensive overview of your application. It provides expandable data regarding notices, vouchers, and reports.

Start the node with the explorer service enabled:

```shell
cartesi run --services explorer
```

The local explorer is then available at `http://localhost:6751/explorer` (same port as the application node—see [running an application](../development/running-an-application.md)). The explorer is not started by plain `cartesi run`; you must pass `--services explorer`.

You can execute your vouchers via the explorer to complete the withdrawal. A voucher becomes executable only after [its epoch](../api-reference/backend/vouchers.md/#epoch-configuration) closes and the epoch's claim is accepted on-chain; until then, execution reverts.

:::info Repo Link
   You can access the complete project implementation [here](https://github.com/Mugen-Builders/docs_examples/tree/af7e52df98999a28223283814bfde9a4f6f1add3/ether-wallet)!
:::