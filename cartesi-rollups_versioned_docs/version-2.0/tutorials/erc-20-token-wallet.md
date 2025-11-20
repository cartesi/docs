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

First, create a new TypeScript project using the [Cartesi CLI](../development/installation.md/#cartesi-cli).

```bash
cartesi create erc-20-token-wallet --template typescript
```

Run the following to generate the types for your project:

```bash
yarn && yarn run codegen
```

Now, navigate to the project directory and install [`ethers`](https://docs.ethers.org/v5/), [`viem`](https://viem.sh/) and [`@cartesi/rollups`](https://www.npmjs.com/package/@cartesi/rollups) package:

```bash
yarn add ethers viem
yarn add -D @cartesi/rollups
```

## Define the ABIs

Let's write a configuration to generate the ABIs of the Cartesi Rollups Contracts.

We will need the Solidity compiler and the contract code from the `@cartesi/rollups` package to generate the ABIs as constants.

1. [Install the Solidity compiler](https://docs.soliditylang.org/en/latest/installing-solidity.html).

2. Create a new file named `generate_abis.sh` in the root of your project and add the following code:

```bash
#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status.

# Output directory for TypeScript files
TS_DIR="src/wallet/abi"

# Temporary directory for compilation output
TEMP_DIR="temp_solc_output"

# Create output and temporary directories
mkdir -p "$TS_DIR"
mkdir -p "$TEMP_DIR"

# Function to generate ABI and export as a TypeScript variable
generate_abi() {
    local sol_file="$1"
    local contract_name="$2"
    local output_file="$TS_DIR/${contract_name}Abi.ts"

    echo "Compiling $sol_file..."

    # Compile the contract in the temporary directory
    npx solcjs --abi "$sol_file" --base-path . --include-path node_modules/ --output-dir "$TEMP_DIR"

    # Find the generated ABI file
    abi_file=$(find "$TEMP_DIR" -name "*_${contract_name}.abi")

    if [ ! -f "$abi_file" ]; then
        echo "Error: ABI file not found for $contract_name"
        return 1
    fi

    # Read the ABI content
    abi=$(cat "$abi_file")

    echo "Extracted ABI for $contract_name"

    # Create a TypeScript file with exported ABI
    echo "export const ${contract_name}Abi = $abi as const;" > "$output_file"

    echo "Generated ABI for $contract_name"
    echo "----------------------"
}

# Generate ABIs
generate_abi "node_modules/@cartesi/rollups/contracts/dapp/CartesiDApp.sol" "CartesiDApp"
generate_abi "node_modules/@cartesi/rollups/contracts/portals/EtherPortal.sol" "EtherPortal"

# Clean up the temporary directory
rm -rf "$TEMP_DIR"

echo "ABI generation complete"
```

This script will look for all specified `.sol` files and create a TypeScript file with the ABIs in the `src/wallet/abi` directory.

Now, let's make the script executable:

```bash
chmod +x generate_abis.sh
```

And run it:

```bash
./generate_abis.sh
```

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
      inputData[0] = ethers.dataSlice(payload, 0, 20);
      inputData[1] = ethers.dataSlice(payload, 20, 40);
      inputData[2] = ethers.dataSlice(payload, 40, 72);

      return [
        getAddress(inputData[0]),
        getAddress(inputData[1]),
        BigInt(inputData[2]),
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
        value: "0x0",
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
import type { components, paths } from "./schema";
import { Wallet } from "./wallet/wallet";
import { stringToHex, getAddress, Address, hexToString, toHex } from "viem";

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

const ERC20Portal = `0x05355c2F9bA566c06199DEb17212c3B78C1A3C31`;


const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;
console.log(`HTTP rollup_server url is ${rollupServer}`);

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

- For `withdrawals`, we call `wallet.withdrawErc20` and create voucher using the dApp dress and the parsed parameters.

- We created helper functions to `createNotice` for deposits and transfers, `createReport` for balance checks and `createVoucher` for withdrawals.

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

To deposit ERC20 tokens, use the `cartesi deposit erc20` command and follow the prompts.

### Balance checks(used in Inspect requests)

To inspect balance, make an HTTP (post) call to:

```bash
curl -X POST http://127.0.0.1:6751/inspect/erc-20-token-wallet \
  -H "Content-Type: application/json" \
  -d '{0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266}'
```

### Transfers and Withdrawals

Use the `cartesi send` command then follow the prompts to select `String encoding`, finally enter any of the sample payloads:

1. For transfers:

   ```js
   {"operation":"transfer","erc20":"0xTokenAddress","from":"0xFromAddress","to":"0xToAddress","amount":"1000000000000000000"}
   ```

2. For withdrawals:

   ```js
   {"operation":"withdraw","erc20":"0xTokenAddress","from":"0xFromAddress","amount":"1000000000000000000"}
   ```

:::info Repo Link
   You can access the complete project implementation [here](https://github.com/Mugen-Builders/docs_examples/tree/main/erc-20-token-wallet)!
:::