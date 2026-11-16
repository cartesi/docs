---
id: erc-20-token-wallet
title: Integrating ERC20 token wallet functionality
---

This tutorial will guide you through creating a basic ERC20 token wallet for a Cartesi backend application using TypeScript.

## Setting up the project

First, create a new TypeScript project using the [Cartesi CLI](../development/installation.md#cartesi-cli) and move into its directory:

```bash
cartesi create erc-20-token-wallet --template typescript
cd erc-20-token-wallet
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

Deposit payloads from portals are packed ABI-encoded fields; see [asset handling](../development/asset-handling.md#abi-encoding-for-deposits) for the ERC-20 layout (`token`, `sender`, `amount`). Withdrawals use vouchers executed by the on-chain [`Application`](../api-reference/contracts/application.md) contract—see [withdrawing tokens](../development/asset-handling.md#withdrawing-tokens).

## Building the ERC20 wallet

Create a file named `balance.ts` in `src/wallet` directory and add the following code:

```typescript
import type { Address } from "viem";

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
        `Failed to increase balance of ${erc20} for ${this.account}: invalid amount specified`,
      );
    }
    this.erc20Balances.set(
      erc20,
      (this.erc20Balances.get(erc20) ?? 0n) + amount,
    );
    console.log("ERC20 balance is", this.erc20Balances);
  }

  decreaseErc20Balance(erc20: Address, amount: bigint): void {
    if (amount < 0n) {
      throw new Error(
        `Failed to decrease balance of ${erc20} for ${this.account}: invalid amount specified`,
      );
    }
    const erc20Balance = this.erc20Balances.get(erc20);
    if (erc20Balance === undefined) {
      throw new Error(
        `Failed to decrease balance of ${erc20} for ${this.account}: not found with ERC20 balance`,
      );
    }
    if (erc20Balance < amount) {
      throw new Error(
        `Failed to decrease balance of ${erc20} for ${this.account}: insufficient ERC20 balance`,
      );
    }
    this.erc20Balances.set(erc20, erc20Balance - amount);
  }
}
```

The `Balance` class represents an individual account's balance. It includes methods to list ERC20 tokens and get, increase, and decrease the ERC20 balance.

Now, create a file named `wallet.ts` in the `src/wallet` directory and add the following code:

```typescript
import type { Voucher } from "@cartesi/rollup";
import {
  type Address,
  encodeFunctionData,
  erc20Abi,
  getAddress,
  type Hex,
  sliceHex,
} from "viem";
import { Balance } from "./balance";

export class Wallet {
  private accounts: Map<Address, Balance> = new Map();

  private getBalance = (account: Address): Balance => {
    const key = getAddress(account);
    let balance = this.accounts.get(key);
    if (!balance) {
      balance = new Balance(key, new Map());
      this.accounts.set(key, balance);
    }
    return balance;
  };

  getAccountBalance = (account: Address, erc20: Address): bigint => {
    const balance = this.getBalance(account);
    const erc20Balance = balance.getErc20Balance(getAddress(erc20)) ?? 0n;
    console.info(
      `Balance for ${account} and token ${erc20} retrieved as ${erc20Balance}`,
    );
    return erc20Balance;
  };

  processErc20Deposit = (payload: Hex): string => {
    const [erc20, account, amount] = this.parseErc20Deposit(payload);
    console.log(`${amount} ${erc20} tokens deposited to account ${account}`);
    return this.depositErc20(account, erc20, amount);
  };

  private parseErc20Deposit = (payload: Hex): [Address, Address, bigint] => {
    const erc20 = getAddress(sliceHex(payload, 0, 20));
    const account = getAddress(sliceHex(payload, 20, 40));
    const amount = BigInt(sliceHex(payload, 40, 72));
    return [erc20, account, amount];
  };

  private depositErc20 = (
    account: Address,
    erc20: Address,
    amount: bigint,
  ): string => {
    const balance = this.getBalance(account);
    balance.increaseErc20Balance(erc20, amount);
    const noticePayload = {
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
    amount: bigint,
  ): Voucher => {
    const balance = this.getBalance(account);
    balance.decreaseErc20Balance(erc20, amount);
    const call = encodeFunctionData({
      abi: erc20Abi,
      functionName: "transfer",
      args: [account, amount],
    });

    console.log("Voucher creation success", {
      destination: erc20,
      payload: call,
    });

    return {
      destination: erc20,
      value: 0n,
      payload: call,
    };
  };

  transferErc20 = (
    from: Address,
    to: Address,
    erc20: Address,
    amount: bigint,
  ): string => {
    const balanceFrom = this.getBalance(from);
    const balanceTo = this.getBalance(to);
    balanceFrom.decreaseErc20Balance(erc20, amount);
    balanceTo.increaseErc20Balance(erc20, amount);
    const noticePayload = {
      type: "erc20transfer",
      content: {
        from: from,
        to: to,
        erc20: erc20,
        amount: amount.toString(),
      },
    };
    console.info(`${amount} ${erc20} tokens transferred from ${from} to ${to}`);
    return JSON.stringify(noticePayload);
  };
}
```

### Voucher creation

The `withdrawErc20` method encodes `transfer(recipient, amount)` and returns a voucher whose destination is the token contract. Tokens deposited through the portal sit in your on-chain `Application` contract, and the `Application` is the caller when it executes the voucher, so `transfer` moves the tokens out of its own balance. Do not use `transferFrom(application, recipient, amount)` here: the `Application` has no allowance over its own tokens, so the voucher reverts with `ERC20InsufficientAllowance` in OpenZeppelin 5 tokens. The voucher's `value` is `0n` because no Ether is sent with the call. See [withdrawing tokens](../development/asset-handling.md#withdrawing-tokens).

## Using the ERC20 wallet

Now, let's create a simple application at the entry point `src/index.ts` to test the wallet’s functionality.

The [`Erc20Portal`](../api-reference/contracts/portals/Erc20Portal.md) contract moves ERC-20 tokens from the base layer into your application. Deposits arrive as advance requests whose `msgSender` is the portal address.

:::note Erc20Portal address
Run [`cartesi address-book`](../development/send-inputs-and-assets.md) and copy the `Erc20Portal` address for your network into `index.ts`. For a given rollups-contracts release, each portal has the same address on every supported network and on the devnet, but the address changes between releases: take it from `cartesi address-book` rather than from an older sample.
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

// Replace with the Erc20Portal address from `cartesi address-book`
const ERC20_PORTAL: Address = "0xYOUR_ERC20_PORTAL_ADDRESS";

const rollup = new Rollup();
const wallet = new Wallet();

const handleAdvance = (request: AdvanceRequest): boolean => {
  console.log(
    `Received advance request from ${request.msgSender} with index ${request.index}`,
  );

  if (isAddressEqual(request.msgSender, ERC20_PORTAL)) {
    // Deposit: the portal names the token and the depositor in the payload
    const deposit = wallet.processErc20Deposit(bytesToHex(request.payload));
    rollup.emitNotice(stringToHex(deposit));
    return true;
  }

  // Transfer or withdrawal: always on behalf of the account that sent the input
  const owner = getAddress(request.msgSender);
  try {
    const { operation, erc20, to, amount } = JSON.parse(
      request.payload.toString("utf8"),
    );

    if (operation === "transfer") {
      const transfer = wallet.transferErc20(
        owner,
        getAddress(to),
        getAddress(erc20),
        BigInt(amount),
      );
      rollup.emitNotice(stringToHex(transfer));
    } else if (operation === "withdraw") {
      const voucher = wallet.withdrawErc20(
        owner,
        getAddress(erc20),
        BigInt(amount),
      );
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
    const [address, erc20] = request.payload.toString("utf8").split("/");
    if (address === undefined || erc20 === undefined) {
      throw new Error("expected userAddress/erc20TokenAddress");
    }
    const balance = wallet.getAccountBalance(
      getAddress(address),
      getAddress(erc20),
    );
    rollup.emitReport(
      stringToHex(
        `Balance of token ${erc20} for user address ${address} is ${balance}`,
      ),
    );
  } catch (error) {
    rollup.emitReport(
      stringToHex(`Error processing inspect payload: ${error}`),
    );
  }
};

await rollup.run({ advance: handleAdvance, inspect: handleInspect });
```

This code uses the `Rollup` class of [`@cartesi/rollup`](https://www.npmjs.com/package/@cartesi/rollup/v/1.0.0-alpha.3), which the template already depends on: `rollup.run()` passes each request to `handleAdvance` or `handleInspect`, with the payload as a Node.js `Buffer`, and an advance handler rejects the input when it returns `false`.

Here is a breakdown of the wallet functionality:

- We handle deposits when the sender is the `Erc20Portal`. The portal writes the token, the depositor's address and the amount in the payload, and the wallet credits the depositor.

- We parse the payload for other senders to determine the operation (`transfer` or `withdraw`).

- The account that sends the input is the owner of the operation: transfers and withdrawals always debit `request.msgSender`, and the payload has no `from` field. Anyone can write any address in a JSON payload, but nobody can send an input on behalf of another account, so reading the owner from the payload would let anyone move anyone's tokens.

- For `transfers`, we call `wallet.transferErc20` and create a notice with the parsed parameters.

- For `withdrawals`, we call `wallet.withdrawErc20`, which encodes a `transfer` to the owner, then emit a voucher to the token contract with `rollup.emitVoucher`. The on-chain `Application` (`request.appContract`) executes it and sends the tokens it holds.

- When an operation fails, for example because of an insufficient balance, we emit the error as a report with `rollup.emitReport` and reject the input. Inspect requests answer balance checks with a report as well.

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
An approval step is needed for the [**ERC20 token standard**](https://ethereum.org/en/developers/docs/standards/tokens/). This ensures you grant explicit permission for `Erc20Portal` to transfer tokens on your behalf.

Without this approval, the `Erc20Portal` cannot deposit your tokens to the Cartesi backend.

If you don't approve the `Erc20Portal` address before depositing, the call to `depositErc20Tokens` reverts with the token contract's insufficient-allowance error (for example, `ERC20InsufficientAllowance` in OpenZeppelin 5 tokens).
:::

To deposit ERC20 tokens interactively:

```bash
cartesi deposit erc20
```

The depositing account must hold the tokens. `TestToken` starts with a total supply of zero and has a public `mint` function, so mint the tokens first as shown below.

Non-interactive alternative. Run from your **project root** (with `cartesi run` up). Resolve addresses from [`cartesi address-book`](../development/send-inputs-and-assets.md):

```bash
TOKEN=$(cartesi address-book TestToken)
ERC20_PORTAL=$(cartesi address-book Erc20Portal)

cast send "$TOKEN" \
  "mint(uint256)" \
  1000000000000000000 \
  --rpc-url http://127.0.0.1:6751/anvil \
  --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97

cast send "$TOKEN" \
  "approve(address,uint256)" \
  "$ERC20_PORTAL" \
  1000000000000000000 \
  --rpc-url http://127.0.0.1:6751/anvil \
  --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97

cartesi deposit erc20 1 \
  --token "$TOKEN" \
  --project-name erc-20-token-wallet \
  --rpc-url http://127.0.0.1:6751/anvil
```

`cartesi deposit erc20` takes the amount in token units: `1` deposits 1 FUN, which is `1000000000000000000` in the smallest unit (the amount minted and approved above). On success, the CLI prints `✔ Deposited 1 FUN to <application address>`.

### Balance checks (used in Inspect requests)

Inspect payloads use the form `userAddress/erc20TokenAddress` as a UTF-8 string. The node passes the request body to your application unchanged as the inspect payload, so send that string as the body. Example for user `0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f` and the `TestToken` contract `0x86EA17052C8e335Ad830B54EF566274EAB46B852`:

```bash
curl -X POST http://127.0.0.1:6751/inspect/erc-20-token-wallet \
  -H "Content-Type: text/plain" \
  -d '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f/0x86EA17052C8e335Ad830B54EF566274EAB46B852'
```

Replace the inspect path if your project name is not `erc-20-token-wallet` (see the URL printed by `cartesi run`). Replace the addresses in the body if you use different ones.

### Transfers and Withdrawals

To process transfers and withdrawals interactively, run the command below, select `String encoding`, then enter one of the sample payloads:

```bash
cartesi send
```

Non-interactive alternative (from your project root):

```bash
cartesi send --encoding string \
  '{"operation":"withdraw","erc20":"0x86EA17052C8e335Ad830B54EF566274EAB46B852","amount":"1000000000000000000"}' \
  --project-name erc-20-token-wallet \
  --rpc-url http://127.0.0.1:6751/anvil
```

1. For transfers:

   ```js
   {"operation":"transfer","erc20":"0xTokenAddress","to":"0xToAddress","amount":"1000000000000000000"}
   ```

2. For withdrawals:

   ```js
   {"operation":"withdraw","erc20":"0xTokenAddress","amount":"1000000000000000000"}
   ```

Replace `0xTokenAddress` with the token address (`TestToken` in the samples above, `0x86EA17052C8e335Ad830B54EF566274EAB46B852`). The wallet debits the account that sends the input: `cartesi send` sends from devnet account 8 (`0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f`), the account that made the deposit above. If you pass `--from` to send from another account, the application debits that account instead, and rejects the input with a report when that account has no balance in the wallet.

### Using the explorer

[CartesiScan](https://cartesiscan.io/) is a web application that offers a comprehensive overview of your application. It provides expandable data regarding notices, vouchers, and reports.

Start the node with the explorer service enabled:

```shell
cartesi run --services explorer
```

The local explorer is then available at `http://localhost:6751/explorer` (same port as the application node—see [running an application](../development/running-an-application.md)). The explorer is not started by plain `cartesi run`; you must pass `--services explorer`.

You can execute your vouchers via the explorer to complete the withdrawal. A voucher becomes executable only after [its epoch](../api-reference/backend/vouchers.md#epoch-configuration) closes and the epoch's claim is accepted on-chain; until then, execution reverts.

:::info Repo Link
   You can access the complete project implementation [here](https://github.com/Mugen-Builders/docs_examples/tree/af7e52df98999a28223283814bfde9a4f6f1add3/erc-20-token-wallet)!
:::