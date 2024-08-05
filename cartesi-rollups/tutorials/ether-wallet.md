---
id: ether-wallet
title: Integrating Ether wallet functionality
---

This tutorial will build a basic Ether wallet inside a Cartesi backend application using TypeScript.

The goal is to have a backend application to track balances, receive, transfer, and withdraw Ether.

:::note community tools
This tutorial is for educational purposes. For production dApps, we recommend using [Deroll](https://deroll.dev/), a TypeScript package that simplifies app and wallet functionality across all token standards for Cartesi applications.
:::

## Setting up the project

First, let's create a new TypeScript project using the [Cartesi CLI](../development/installation.md/#cartesi-cli).

```bash
cartesi create ether-wallet-dapp --template typescript
```

Run the following to generate the types for your project:

```bash
yarn
yarn run codegen
```

Now, navigate to the project directory and install the [`@cartesi/rollups`](https://www.npmjs.com/package/@cartesi/rollups) package:

```bash
yarn add -D @cartesi/rollups
```



## Define the ABIs

Let's write a configuration to generate the ABIs of the Cartesi Rollups Contracts.

We will the Solidity compiler and the contract code from the `@cartesi/rollups` package to generate the ABIs as consts.

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

    # Create TypeScript file with exported ABI
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

Our wallet will consist of two main classes: `Balance` and `Wallet`. Let's implement each of these:

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

The `Balance` class represents an individual account's balance. It includes methods to get, increase, and decrease the Ether balance.

Now, create a file named `wallet.ts` in the `src/wallet` directory and add the following code:

```typescript
import { Address, getAddress, hexToBytes, stringToHex, encodeFunctionData } from "viem";
import { ethers } from "ethers";
import { Balance } from "./balance";
import { CartesiDAppAbi } from "./abi/CartesiDAppAbi";

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
    return JSON.stringify({ type: "etherDeposit", address, amount: amount.toString() });
  }

  withdrawEther(rollupAddress: Address, address: Address, amount: bigint): string {
    const balance = this.getOrCreateBalance(address);
    balance.decreaseEther(amount);
    const callData = this.encodeWithdrawCall(address, amount);
    return `Voucher: ${rollupAddress}, ${stringToHex(callData)}`;
  }

  transferEther(from: Address, to: Address, amount: bigint): string {
    const fromBalance = this.getOrCreateBalance(from);
    const toBalance = this.getOrCreateBalance(to);
    fromBalance.decreaseEther(amount);
    toBalance.increaseEther(amount);
    return JSON.stringify({ type: "etherTransfer", from, to, amount: amount.toString() });
  }

  private parseDepositPayload(payload: string): [Address, bigint] {
    const addressData = ethers.dataSlice(payload, 0, 20);
    const amountData = ethers.dataSlice(payload, 20, 52);
    if (!addressData) {
      throw new Error("Invalid deposit payload");
    }
    return [getAddress(addressData), BigInt(amountData)];
  }

  private encodeWithdrawCall(address: Address, amount: bigint): string {
    return encodeFunctionData({
      abi:CartesiDAppAbi,
      functionName: "withdrawEther",
      args: [address, amount],
    });
  }
}
```

The `Wallet` class manages multiple accounts and provides methods for common wallet operations. Key features include storing balances, centralizing the logic for retrieving or creating a balance and depositing, withdrawing, and transferring Ether.

`parseDepositPayload` and `encodeWithdrawCall` handle the low-level details of working with the base layer data.

The `encodeWithdrawCall` method prepares the data needed to call the [`withdrawEther()`](../rollups-apis/json-rpc/application.md/#withdrawether) function on the [CartesiDApp](../rollups-apis/json-rpc/application.md) contract. This encoded data will be used to create a voucher, which is a key concept in Cartesi rollups for executing withdrawal operations on the base layer chain.


## Using the Ether wallet

Now, let's create a simple application in the entrypoint, `src/index.ts` to test the wallet functionality.

The [`EtherPortal`](../rollups-apis/json-rpc/portals/EtherPortal.md) contract allows anyone to perform transfers of Ether to a dApp. All deposits to a dApp is done via the `EtherPortal` contract.

Run `cartesi address-book` to get the contract address of the `EtherPortal` contract. Save this as a const in the `index.ts` file.

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

const EtherPortal = `0xFfdbe43d4c855BF7e0f105c400A50857f53AB044`;

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollupServer);

const handleAdvance: AdvanceRequestHandler = async (data) => {
  console.log("Received advance request data " + JSON.stringify(data));

  const sender = data["metadata"]["msg_sender"];
  const payload = data.payload;

  if (sender.toLowerCase() === EtherPortal.toLowerCase()) {
    // Handle deposit
    const deposit = wallet.depositEther(payload);
    await sendNotice(stringToHex(deposit));
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
        console.log(transfer);
        await sendNotice(stringToHex(transfer));
      } else if (operation === "withdraw") {
        const withdraw = wallet.withdrawEther(
          getAddress(EtherPortal as Address),
          getAddress(from as Address),
          BigInt(amount)
        );
        console.log(withdraw);
        await sendVoucher({ payload: amount, destination: from });
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
    const balance = wallet.getBalance(getAddress(address as Address));
    await sendReport({ payload: toHex(balance) });
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

This code sets up a simple application that listens for requests from the Cartesi rollup server. It processes the requests and sends responses back to the server.

Here is a breakdown of the wallet functionality:
- We handle deposits when the sender is the `EtherPortal`.
- For other senders, we parse the payload to determine the operation (`transfer` or `withdraw`).
- For `transfers`, we call `wallet.transferEther` with the parsed parameters.
- For `withdrawals`, we call `wallet.withdrawEther` with the parsed parameters.
- We created helper functions to `sendNotice` for deposits and transfers, `sendReport` for balance checks and `sendVoucher` for withdrawals.




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

Transfers and withdrawal request will be sent as generic json string that will be parsed and processed.

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
