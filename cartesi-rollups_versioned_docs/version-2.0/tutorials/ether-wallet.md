---
id: ether-wallet
title: Integrating Ether wallet functionality
resources:
  - url: https://github.com/masiedu4/ether-wallet-tutorial
    title: Source code for Ether wallet tutorial
---

This tutorial will build a basic Ether wallet inside a Cartesi backend application using TypeScript.

The goal is to have a backend application to track balances and receive, transfer, and withdraw Ether.

:::note community tools
This tutorial is for educational purposes. For production dApps, we recommend using [Deroll](https://deroll.dev/), a TypeScript package that simplifies app and wallet functionality across all token standards for Cartesi applications.
:::

## Setting up the project

First, create a new TypeScript project using the [Cartesi CLI](../getting-started/installation.md/#cartesi-cli).

```bash
cartesi create ether-wallet-dapp --template typescript
```

Run the following to generate the types for your project:

```bash
yarn
yarn run codegen
```

Now, navigate to the project directory and install [`ethers`](https://docs.ethers.org/v5/), [`viem`](https://viem.sh/) and [`@cartesi/rollups`](https://www.npmjs.com/package/@cartesi/rollups) package:

```bash
yarn add ethers viem
yarn add -D @cartesi/rollups
```

## Define the ABIs

Let's write a configuration to generate the ABIs of the Cartesi Rollups Contracts.

We will the Solidity compiler and the contract code from the `@cartesi/rollups` package to generate the ABIs as constants.

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

    chmod +x generate_abis.sh

And run it:

    ./generate_abis.sh

## Building the Ether wallet

Our wallet will have two main classes: `Balance` and `Wallet`. Let's implement each of these:

Create a file named `balance.ts` in the `src/wallet` directory and add the following code:

```typescript
import { Address } from "viem";

export class Balance {
  constructor(private readonly address: Address, private ether: bigint = 0n) {}

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
  hexToBytes,
  stringToHex,
  encodeFunctionData,
} from "viem";
import { ethers } from "ethers";
import { Balance } from "./balance";
import { CartesiDAppAbi } from "./abi/CartesiDAppAbi";
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

  withdrawEther(
    application: Address,
    address: Address,
    amount: bigint
  ): Voucher {
    const balance = this.getOrCreateBalance(address);

    if (balance.getEther() >= amount) {
      balance.decreaseEther(amount);
      const voucher = this.encodeWithdrawCall(application, address, amount);

      console.log("Voucher created succesfully", voucher);

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

  private parseDepositPayload(payload: string): [Address, bigint] {
    const addressData = ethers.dataSlice(payload, 0, 20);
    const amountData = ethers.dataSlice(payload, 20, 52);
    if (!addressData) {
      throw new Error("Invalid deposit payload");
    }
    return [getAddress(addressData), BigInt(amountData)];
  }

  private encodeWithdrawCall(
    application: Address,
    receiver: Address,
    amount: bigint
  ): Voucher {
    const call = encodeFunctionData({
      abi: CartesiDAppAbi,
      functionName: "withdrawEther",
      args: [receiver, amount],
    });

    return {
      destination: application,
      payload: call,
    };
  }
}
```

The `Wallet` class manages multiple accounts and provides methods for everyday wallet operations. Key features include storing balances, centralizing the logic for retrieving or creating a balance, and depositing, withdrawing, and transferring Ether.

`parseDepositPayload` and `encodeWithdrawCall` handle the low-level details of working with the base layer data.

### Voucher creation

The `encodeWithdrawCall` method returns a voucher. Creating vouchers is a crucial concept in Cartesi rollups for executing withdrawal operations on the base layer chain.

The voucher creation process occurs during Ether’s withdrawal. Here's how it works in this application:

1. The `encodeFunctionData` function creates the calldata for the [`function withdrawEther(address _receiver, uint256 _value) external`](../api-reference/json-rpc/application.md/#withdrawether) on the `CartesiDApp` contract.

It returns a Voucher object with two properties:

    - `destination`: The address of the Cartesi dApp
    - `payload`: The encoded function calldata

2. The `withdrawEther` method of the `Wallet` class is called with three parameters:

   - `application`: The address of the Cartesi dApp
   - `address`: The user's address who wants to withdraw
   - `amount`: The amount of Ether to withdraw

## Using the Ether wallet

Now, let's create a simple application at the entry point, `src/index.ts,` to test the wallet functionality.

The [`EtherPortal`](../api-reference/json-rpc/portals/EtherPortal.md) contract allows anyone to perform transfers of Ether to a dApp. All deposits to a dApp are made via the `EtherPortal` contract.

The [`DAppAddressRelay`](../api-reference/json-rpc/relays/relays.md) contract provides the critical information (the dApp's address) that the voucher creation process needs to function correctly. Without this relay mechanism, the off-chain part of the dApp wouldn't know its on-chain address, making it impossible to create valid vouchers for withdrawals.

:::note
Run `cartesi address-book` to get the addresses of the `EtherPortal` and `DAppAddressRelay` contracts. Save these as constants in the `index.ts` file.
:::

```typescript
import createClient from "openapi-fetch";
import { components, paths } from "./schema";
import { Wallet } from "./wallet/wallet";
import { stringToHex, getAddress, Address, hexToString } from "viem";

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

const EtherPortal = `0xFfdbe43d4c855BF7e0f105c400A50857f53AB044`;
const dAppAddressRelay = `0xF5DE34d6BbC0446E2a45719E718efEbaaE179daE`;

let dAppAddress: Address;

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollupServer);

const handleAdvance: AdvanceRequestHandler = async (data) => {
  console.log("Received advance request data " + JSON.stringify(data));

  const sender = data["metadata"]["msg_sender"];
  const payload = data.payload;

  if (sender.toLowerCase() === dAppAddressRelay.toLowerCase()) {
    dAppAddress = data.payload;
    return "accept";
  }

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
        const voucher = wallet.withdrawEther(
          getAddress(dAppAddress as Address),
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
  console.log("Received inspect request data " + JSON.stringify(data));

  try {
    const address = hexToString(data.payload);
    console.log(address);
    const balance = wallet.getBalance(address as Address);

    const reportPayload = `Balance for ${address} is ${balance} wei}`;
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

This code sets up a simple application that listens for requests from the Cartesi rollup server. It processes the requests and sends responses back to the server.

Here is a breakdown of the wallet functionality:

- The `handle_advance` handles three main scenarios: dApp address relay, Ether deposits, and user operations (transfers/withdrawals).

- We relay the address when the sender is `DAppAddressRelay`.

- We handle deposits and create a notice when the sender is the `EtherPortal`.

- We parse the payload for other senders to determine the operation (`transfer` or `withdraw`).

- For `transfers`, we call `wallet.transferEther` and create a notice with the parsed parameters.

For `withdrawals,` we call `wallet.withdrawEther` and create a voucher using the dApp dress and the parsed parameters.

- We created helper functions to `createNotice` for deposits and transfers, `createReport` for balance checks and `createVoucher` for withdrawals.

:::caution important
The dApp address needs to be relayed strictly before withdrawal requests.

To relay the dApp address, run: `cartesi send dapp-address`
:::

## Build and run the application

With Docker running, [build your backend application](../development/building-a-dapp.md) by running:

```shell
cartesi build
```

To run your application, enter the command:

```shell
cartesi run
```

#### Deposits

To deposit ether, run the command below and follow the prompts:

```
cartesi send ether
```

#### Balance checks(used in Inspect requests)

To inspect balance, make an HTTP call to:

```
http://localhost:8080/inspect/{address}
```

#### Transfer and Withdrawals

Transfers and withdrawal requests will be sent as generic json strings that will be parsed and processed.

To process transfers and withdrawals, run the command below and follow the prompts:

```bash
cartesi send generic
```

Here are the sample payloads as one-liners, ready to be used in your code:

1. For transfers:

```js
{"operation":"transfer","from":"0xAddress123","to":"0xAddress345","amount":"1000000000000000000"}
```

2. For withdrawals:

```js
{"operation":"withdraw","from":"0xAddress345","amount":"500000000000000000"}
```

### Using the explorer

For end-to-end functionality, developers will likely build their [custom user-facing web application](../tutorials/react-frontend-application.md).

[CartesiScan](https://cartesiscan.io/) is a web application that offers a comprehensive overview of your application. It provides expandable data regarding notices, vouchers, and reports.

When you run your application with `cartesi run`, there is a local instance of CartesiScan on `http://localhost:8080/explorer`.

You can execute your vouchers via the explorer, which completes the withdrawal process at the end of [an epoch](../api-reference/backend/vouchers.md/#epoch-configuration).
