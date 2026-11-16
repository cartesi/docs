> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: ether-wallet
title: Integrating Ether wallet functionality
---

This tutorial will build a basic Ether wallet inside a Cartesi backend application using TypeScript.

The goal is to have a backend application to track balances and receive, transfer, and withdraw Ether.

## Setting up the project

First, create a new TypeScript project using the [Cartesi CLI](../development/installation.md/#cartesi-cli) and move into its directory:

```bash
cartesi create ether-wallet --template typescript
cd ether-wallet
```

The template manages its packages with [pnpm](https://pnpm.io), through [corepack](https://nodejs.org/api/corepack.html). If the `pnpm` command is not available, enable it with:

```bash
corepack enable pnpm
```

Now, install [`viem`](https://viem.sh/) as a development dependency:

```bash
pnpm add -D viem@2.57.19
```

Then replace the contents of `rolldown.config.ts` with the following, so that rolldown bundles viem into your application and only leaves out the `@cartesi/rollup` native addon:

```typescript
import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/index.ts",
  platform: "node",
  // only the @cartesi/rollup native addon stays out of the bundle: viem and
  // any other pure JavaScript dependency are bundled into dist/index.mjs
  external: ["@cartesi/rollup"],
  output: {
    file: "dist/index.mjs",
    format: "esm",
  },
});
```

`cartesi build` installs the packages listed under `dependencies` inside an emulated RISC-V container, where pnpm can crash with a segmentation fault while it installs viem. A bundled development dependency is not installed there. See [adding dependencies](../development/creating-an-application.md#adding-dependencies-in-javascript-and-typescript).

## Building the Ether wallet

Our wallet will have two main classes: `Balance` and `Wallet`. Let's implement each of these:

Create a file named `balance.ts` in the `src/wallet` directory and add the following code:

```typescript
import type { Address } from "viem";

export class Balance {
  constructor(
    private readonly address: Address,
    private ether: bigint = 0n,
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
    if (amount < 0n) {
      throw new Error(`Invalid amount: ${amount}`);
    }
    if (this.ether < amount) {
      throw new Error(`Insufficient balance for ${this.address}`);
    }
    this.ether -= amount;
  }
}
```

The `Balance` class represents an individual account's balance. It includes methods for getting, increasing, and decreasing the Ether balance.

Now, create a file named `wallet.ts` in the `src/wallet` directory and add the following code:

```typescript
import type { Voucher } from "@cartesi/rollup";
import { type Address, getAddress, type Hex, sliceHex } from "viem";
import { Balance } from "./balance";

export class Wallet {
  private accounts: Map<Address, Balance> = new Map();

  private getOrCreateBalance(address: Address): Balance {
    const key = getAddress(address);
    let balance = this.accounts.get(key);
    if (!balance) {
      balance = new Balance(key);
      this.accounts.set(key, balance);
    }
    return balance;
  }

  getBalance(address: Address): bigint {
    return this.getOrCreateBalance(address).getEther();
  }

  depositEther(payload: Hex): string {
    const [address, amount] = this.parseDepositPayload(payload);
    const balance = this.getOrCreateBalance(address);
    balance.increaseEther(amount);
    console.log(
      `After deposit, balance for ${address} is ${balance.getEther()}`,
    );
    return JSON.stringify({
      type: "etherDeposit",
      address,
      amount: amount.toString(),
    });
  }

  withdrawEther(address: Address, amount: bigint): Voucher {
    const balance = this.getOrCreateBalance(address);
    balance.decreaseEther(amount);
    console.log(
      `After withdrawal, balance for ${address} is ${balance.getEther()}`,
    );
    return this.encodeWithdrawCall(address, amount);
  }

  transferEther(from: Address, to: Address, amount: bigint): string {
    const fromBalance = this.getOrCreateBalance(from);
    const toBalance = this.getOrCreateBalance(to);
    fromBalance.decreaseEther(amount);
    toBalance.increaseEther(amount);
    console.log(
      `After transfer, balance for ${from} is ${fromBalance.getEther()}`,
    );
    console.log(`After transfer, balance for ${to} is ${toBalance.getEther()}`);
    return JSON.stringify({
      type: "etherTransfer",
      from,
      to,
      amount: amount.toString(),
    });
  }

  private parseDepositPayload(payload: Hex): [Address, bigint] {
    const addressData = sliceHex(payload, 0, 20);
    const amountData = sliceHex(payload, 20, 52);
    return [getAddress(addressData), BigInt(amountData)];
  }

  private encodeWithdrawCall(receiver: Address, amount: bigint): Voucher {
    return {
      destination: receiver,
      value: amount,
      payload: "0x",
    };
  }
}
```

The `Wallet` class manages multiple accounts and provides methods for everyday wallet operations. Key features include storing balances, centralizing the logic for retrieving or creating a balance, and depositing, withdrawing, and transferring Ether.

`parseDepositPayload` and `encodeWithdrawCall` handle the low-level details of working with the base layer data.

### Voucher creation

The `encodeWithdrawCall` method returns a voucher, typed with the `Voucher` interface of `@cartesi/rollup`. Creating vouchers is a crucial concept in Cartesi Rollups for executing withdrawal operations on the base layer chain.

In Rollups v2, the on-chain [`Application`](../api-reference/contracts/application.md) contract executes vouchers through [`executeOutput()`](../api-reference/contracts/application.md#executeoutput), which decodes a voucher as `(destination, value, payload)` and performs a [`safeCall`](https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.10/src/library/LibAddress.sol) to `destination` with the specified wei `value`. Ether held by your application (`request.appContract` on each advance request) is sent to the recipient this way.

For a plain Ether transfer, leave `payload` empty (`0x`, no calldata). The voucher fields are:

- `destination`: The address that receives the withdrawn Ether.
- `value`: The withdrawal amount in wei, as a `bigint`. `@cartesi/rollup` encodes it as the voucher's 32-byte `uint256`.
- `payload`: `0x` when you are not calling a function on the recipient. A non-empty payload, even 32 zero bytes such as `zeroHash`, makes the voucher revert with `TargetHasNoCode` when the recipient is a wallet with no code (see [asset handling](../development/asset-handling.md#withdrawing-ether)).

## Using the Ether wallet

Now, let's create a simple application at the entry point, `src/index.ts,` to test the wallet functionality.

The [`EtherPortal`](../api-reference/contracts/portals/EtherPortal.md) contract allows anyone to transfer Ether into your application. All deposits are made via the `EtherPortal` contract.

:::note EtherPortal address
Run [`cartesi address-book`](../development/send-inputs-and-assets.md) and copy the `EtherPortal` address for your network into `index.ts`. Do not hardcode portal addresses—they differ by CLI version and chain.
:::

```typescript
import {
  type AdvanceRequest,
  type InspectRequest,
  Rollup,
} from "@cartesi/rollup";
import {
  type Address,
  bytesToHex,
  getAddress,
  isAddressEqual,
  stringToHex,
} from "viem";
import { Wallet } from "./wallet/wallet";

// Replace with the EtherPortal address from `cartesi address-book`
const ETHER_PORTAL: Address = "0xYOUR_ETHER_PORTAL_ADDRESS";

const rollup = new Rollup();
const wallet = new Wallet();

const handleAdvance = (request: AdvanceRequest): boolean => {
  console.log(
    `Received advance request from ${request.msgSender} with index ${request.index}`,
  );

  if (isAddressEqual(request.msgSender, ETHER_PORTAL)) {
    // Deposit: the portal names the depositor in the payload
    const deposit = wallet.depositEther(bytesToHex(request.payload));
    rollup.emitNotice(stringToHex(deposit));
    return true;
  }

  // Transfer or withdrawal: always on behalf of the account that sent the input
  const owner = getAddress(request.msgSender);
  try {
    const { operation, to, amount } = JSON.parse(
      request.payload.toString("utf8"),
    );

    if (operation === "transfer") {
      const transfer = wallet.transferEther(owner, getAddress(to), BigInt(amount));
      rollup.emitNotice(stringToHex(transfer));
    } else if (operation === "withdraw") {
      // The application contract (request.appContract) holds the deposited
      // Ether and sends it to the owner when the voucher is executed
      const voucher = wallet.withdrawEther(owner, BigInt(amount));
      rollup.emitVoucher(voucher);
    } else {
      throw new Error(`Unknown operation: ${operation}`);
    }
    return true;
  } catch (error) {
    console.error("Error processing payload:", error);
    rollup.emitReport(stringToHex(`Error processing payload: ${error}`));
    return false;
  }
};

const handleInspect = (request: InspectRequest): void => {
  try {
    const address = getAddress(request.payload.toString("utf8"));
    const balance = wallet.getBalance(address);
    rollup.emitReport(stringToHex(`Balance for ${address} is ${balance} wei`));
  } catch (error) {
    rollup.emitReport(
      stringToHex(`Error processing inspect payload: ${error}`),
    );
  }
};

await rollup.run({ advance: handleAdvance, inspect: handleInspect });
```

This code uses the `Rollup` class of [`@cartesi/rollup`](https://www.npmjs.com/package/@cartesi/rollup), which the template already depends on and which talks directly to the Cartesi Machine. `rollup.run()` waits for each request and passes it to `handleAdvance` or `handleInspect`, with the request payload as a Node.js `Buffer`. An advance handler accepts the input when it returns `true` and rejects it when it returns `false`: the node then discards the notices and vouchers of that input and reverts the application state, but keeps its reports.

Here is a breakdown of the wallet functionality:

- `handleAdvance` handles Ether deposits (from `EtherPortal`) and user operations (transfers/withdrawals).

- We handle deposits and create a notice when the sender is the `EtherPortal`. The portal writes the depositor's address and the amount in the payload, and the wallet credits that address.

- We parse the payload for other senders to determine the operation (`transfer` or `withdraw`).

- The account that sends the input is the owner of the operation: transfers and withdrawals always debit `request.msgSender`, and the payload has no `from` field. Anyone can write any address in a JSON payload, but nobody can send an input on behalf of another account, so reading the owner from the payload would let anyone move anyone's balance.

- For `transfers`, we call `wallet.transferEther` and create a notice with the parsed parameters.

- For withdrawals, we call `wallet.withdrawEther` and emit a voucher with `rollup.emitVoucher`. When it is executed, the voucher sends wei from the on-chain Application (`request.appContract`) to the owner.

- When an operation fails, for example because of an insufficient balance or an unknown operation, we emit the error as a report with `rollup.emitReport` and reject the input. Inspect requests answer balance checks with a report as well.

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
  -d '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f'
```

The node passes the request body to your application unchanged as the inspect payload, so the body is the address to query as plain text (here `0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f`). Replace the inspect path if your project name is not `ether-wallet` (see the URL printed by `cartesi run`).

### Transfer and Withdrawals

Transfers and withdrawal requests will be sent as generic json strings that will be parsed and processed.

To process transfers and withdrawals interactively, run the command below, select `String encoding`, then follow the prompts:

```bash
cartesi send
```

Non-interactive alternative (from your project root):

```bash
cartesi send --encoding string \
  '{"operation":"transfer","to":"0x3f2bd12ea0b8604c2af5bf241f6a606e892a403a","amount":"1000000000000000000"}' \
  --project-name ether-wallet \
  --rpc-url http://127.0.0.1:6751/anvil
```

Here are the sample payloads as one-liners, ready to be used in your code:

1. For transfers:

   ```js
   {"operation":"transfer","to":"0x3f2bd12ea0b8604c2af5bf241f6a606e892a403a","amount":"1000000000000000000"}
   ```

2. For withdrawals:

   ```js
   {"operation":"withdraw","amount":"1000000000000000000"}
   ```

The wallet debits the account that sends the input: `cartesi send` sends from devnet account 8 (`0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f`), the account that made the deposit above. Pass `--from` to send from another account; the application then debits that account, and rejects the input with a report such as `Error processing payload: Error: Insufficient balance for 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720` when it has no balance in the wallet.

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