---
id: deroll
title: "Deroll: A TypeScript Framework"
resources:
  - url: https://www.udemy.com/course/the-cartesi-dapp-developer-masterclass
    title: The Cartesi dApp Developer Free Course
---

# Deroll Documentation

## Overview

Deroll is a TypeScript framework designed to simplify the development of decentralized applications on Cartesi. Deroll provides a comprehensive toolkit to streamline your development workflow. 

## Quickstart

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) (Install via npm: `npm install --global yarn`)
- [Cartesi CLI](../development/installation.md/#cartesi-cli) 

### Create a New Project

First, create a new project using the Cartesi CLI TypeScript template:

```sh
cartesi create hello-world --template typescript
```

This command sets up a new project directory named `hello-world` with the necessary files and dependencies.

### Install Deroll

Navigate to your project directory and install Deroll:

```sh
cd hello-world
yarn add @deroll/app
```

### Write a Simple Application

Create a simple Cartesi application by modifying the `src/index.ts` file. Insert the following code:

```ts
import { createApp } from "@deroll/app";

const app = createApp({
  url: process.env.ROLLUP_HTTP_SERVER_URL || "http://127.0.0.1:5004",
});

app.addAdvanceHandler(async ({ payload }) => {
  // Handle input encoded in hex
  const hexString = payload.replace(/^0x/, "");
  const buffer = Buffer.from(hexString, "hex");

  // Convert the buffer to a UTF-8 string
  const utf8String = buffer.toString("utf8");
  console.log(utf8String);
  return Promise.resolve("accept");
});

app.start().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

This code creates a Cartesi application instance that listens for incoming payloads, decodes them, and prints the decoded string to the console.

### Build and Run Your dApp

Build and run your dApp using Cartesi CLI:

```sh
cartesi build
cartesi run
```

These commands compile your project and start a Cartesi node. The output should look like this:

```sh
prompt-1     | Anvil running at http://localhost:8545
prompt-1     | GraphQL running at http://localhost:8080/graphql
prompt-1     | Inspect running at http://localhost:8080/inspect/
prompt-1     | Explorer running at http://localhost:8080/explorer/
prompt-1     | Press Ctrl+C to stop the node
```

### Send an Input

Open a new terminal and run:

```sh
cartesi send
```

Follow the prompts:

1. Choose `Send generic input to the application.`
2. Select `Foundry`.
3. Use the default options for:
   - RPC URL: `http://127.0.0.1:8545`
   - Wallet: Mnemonic
   - Account, DApp address
4. Select `Input String encoding` and type `Hello world!`, then hit enter.

Expected output:

```sh
cartesi send
? Select send sub-command Send generic input to the application.
? Chain Foundry
? RPC URL http://127.0.0.1:8545
? Wallet Mnemonic
? Mnemonic test test test test test test test test test test test junk
? Account 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 9999.969240390387558666 ETH
? DApp address 0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C
? Input String encoding
? Input (as string) Hello world!
✔ Input sent: 0xebd90fe6fd50245dfa30f33e2d68236a73b25e2351106484cfa9d815e401939d
```

Expected output in the `cartesi run` terminal:

```sh
prompt-1     | Anvil running at http://localhost:8545
prompt-1     | GraphQL running at http://localhost:8080/graphql
prompt-1     | Inspect running at http://localhost:8080/inspect/
prompt-1     | Explorer running at http://localhost:8080/explorer/
prompt-1     | Press Ctrl+C to stop the node
validator-1  | [INFO  rollup_http_server::http_service] Received new request of type ADVANCE
validator-1  | [INFO  actix_web::middleware::logger] 127.0.0.1 "POST /finish HTTP/1.1" 200 224 "-" "undici" 0.000960
validator-1  | Hello world!
```

## API and Usage Guide

### Create a New Application

#### `createApp(options: HttpAppOptions): App`

Creates a new Cartesi application.

- **Parameters:**
  - `options` (`HttpAppOptions`): Configuration object.
    - `url` (`string`): URL of the rollup HTTP server.
    - `broadcastAdvanceRequests` (`boolean`, `optional`): Whether to broadcast advance requests. Default is `false`.

- **Returns:** `App` instance.

**Example:**

```ts
import { createApp } from "@deroll/app";

const app = createApp({
  url: process.env.ROLLUP_HTTP_SERVER || "http://127.0.0.1:5004",
});

app.start();
```

### Create Notices, Vouchers, and Reports

#### `app.createNotice(request: { payload: 0x${string}; }): Promise<number>`

Creates a new notice and returns the index of the created notice.

- **Parameters:**
  - `request (object)`: The request object containing:
    - `payload (string)`: The payload data in hexadecimal format.

- **Returns:**
  - `Promise<number>` A promise that resolves to the index of the created notice.

- **Throws:**
  - `Error`: Throws an error if the response does not contain data or if the response status is not `OK`.

**Example:**

```ts
app.addAdvanceHandler(async ({ payload }) => {
  try {
    const index = await app.createNotice({ payload });
    console.log(`Notice created with index: ${index}`);
  } catch (error) {
    console.error(`Failed to create notice: ${error}`);
  }

  return "accept";
});
```

#### `app.createVoucher(request: { destination: 0x${string}; payload: string; }): Promise<number>`

Creates a new voucher and returns the index of the created voucher.

- **Parameters:**
  - `request (object)`: The request object containing:
    - `destination (string)`: The destination address in hexadecimal format.
    - `payload (string)`: The payload data in hexadecimal format.

- **Returns:**
  - `Promise<number>` A promise that resolves to the index of the created voucher.

- **Throws:**
  - `Error`: Throws an error if the response does not contain data or if the response status is not `OK`.

**Example:**

```ts
app.addAdvanceHandler(async ({ payload }) => {
  const voucherRequest = {
    destination: "0x1234567890abcdef1234567890abcdef12345678",
    payload,
  };

  try {
    const index = await app.createVoucher(voucherRequest);
    console.log(`Voucher created with index: ${index}`);
  } catch (error) {
    console.error(`Failed to create voucher: ${error}`);
  }

  return "accept";
});
```

#### `app.createReport(request: { payload: 0x${string}; }): Promise<void>`

Creates a new report.

- **Parameters:**
  - `request (object)`: The request object containing:
    - `payload (string)`: The payload data in hexadecimal format.

- **Returns:**
  - `Promise<void>` A promise that resolves when the report is created.

- **Throws:**
  - `Error`: Throws an error if the response does not contain data or if the response status is not `OK`.

**Example:**

```ts
app.addAdvanceHandler(async ({ payload }) => {
  try {
    await app.createReport({ payload });
    console.log("Report created successfully");
  } catch (error) {
    console.error(`Failed to create report: ${error.message}`);
  }

  return "accept";
});
```

### Create Wallet and Router

#### `createWallet(): Wallet`

Initializes a new wallet instance.

- **Returns:** `Wallet` instance.

**Example:**

```ts
import { createWallet } from "@deroll/wallet";

const wallet = createWallet();
```

#### `createRouter(options: RouterOptions): Router`

Initializes a new router instance.

- **Parameters**:
  - `options(RouterOptions)`: Options object containing the app instance.

- **Returns:** `Router` instance.

**Example:**

```ts
import { createRouter } from "@deroll/router";

const router = createRouter({ app });
```

### Adding Handlers

Handlers are added to the app to handle advance and inspect requests.

```ts
app.addAdvanceHandler(wallet.handler);
app.addInspectHandler(router.handler);
```

### Adding Routes

Routes are added to the router using the add method. This  method takes a path and a handler function.

```ts
router.add<{ address: string }>(
  "wallet/:address",
  ({ params: { address } }) => {
    return JSON.stringify({
      balance: wallet.etherBalanceOf(address),
    });
  }
);
```

The example route matches paths like `wallet/0x1234567890abcdef` and returns the balance of the specified address.

## Wallet Reference

The `@deroll/wallet` has support for Ether, ERC20, ERC721, and ERC1155 token standards. Below is the expanded reference including the methods for handling the tokens.

### Ether Methods

#### `etherBalanceOf(address: string): bigint`

Retrieves the Ether balance of a given address.

- **Parameters:**
  - `address` (`string`): The address to check the Ether balance for. The address will be normalized.

- **Returns:**
  - `bigint`: The Ether balance of the address.

**Example:**

```typescript
const balance = wallet.etherBalanceOf(
  "0x1234567890abcdef1234567890abcdef12345678"
);
console.log(`Ether balance: ${balance}`);
```

#### `getWallet(address: string): Readonly<Wallet>`

Retrieves the wallet details of a given address.

- **Parameters:**
  - `address` (`string`): The address to retrieve the wallet details for. The address will be normalized.

- **Returns:**
  - `Readonly<Wallet>`: The wallet details of the address.

**Example:**

```typescript
const walletDetails = wallet.getWallet('0x1234567890abcdef1234567890abcdef12345678');
console.log('Wallet details:', walletDetails);
```

#### `transferEther(from: string, to: string, value: bigint): void`

Transfers Ether from one address to another.

- **Parameters:**
  - `from` (`string`): The sender's address. The address will be normalized.
  - `to` (`string`): The recipient's address. The address will be normalized.
  - `value` (`bigint`): The amount of Ether to transfer.

- **Throws:**
  - `Error`: Throws an error if the sender has insufficient balance.

**Example:**

```typescript
try {
  wallet.transferEther(
    "0x1234567890abcdef1234567890abcdef12345678",
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
    1000000000000000000n
  );
  console.log("Transfer successful");
} catch (error) {
  console.error(`Failed to transfer Ether: ${error.message}`);
}
```

#### `withdrawEther(address: Address, value: bigint): Voucher`

Creates a voucher to withdraw Ether from the specified address.

- **Parameters:**
  - `address` (`Address`): The address to withdraw Ether from. The address will be normalized.
  - `value` (`bigint`): The amount of Ether to withdraw.

- **Returns:**
  - `Voucher`: A voucher that can be used to process the withdrawal.

- **Throws:**
  - `Error`: Throws an error if the address has insufficient balance or if the dApp address is undefined.

**Example:**

```typescript
try {
  const voucher = wallet.withdrawEther(
    "0x1234567890abcdef1234567890abcdef12345678",
    500000000000000000n
  );
  console.log("Voucher created for Ether withdrawal:", voucher);
} catch (error) {
  console.error(`Failed to create withdrawal voucher: ${error.message}`);
}
```

### ERC20 Methods

#### `erc20BalanceOf(token: Address, address: string): bigint`

Retrieves the ERC20 token balance of a given address for a specified token.

- **Parameters:**
  - `token` (`Address`): The ERC20 token contract address.
  - `address` (`string`): The address to check the ERC20 token balance for. The address will be normalized.

- **Returns:**
  - `bigint`: The ERC20 token balance of the address.

**Example:**

```typescript
const balance = wallet.erc20BalanceOf(
  "0xTokenAddress",
  "0x1234567890abcdef1234567890abcdef12345678"
);
console.log(`ERC20 token balance: ${balance}`);
```

#### `transferERC20(token: Address, from: string, to: string, amount: bigint): void`

Transfers ERC20 tokens from one address to another.

- **Parameters:**
  - `token` (`Address`): The ERC20 token contract address.
  - `from` (`string`): The sender's address. The address will be normalized.
  - `to` (`string`): The recipient's address. The address will be normalized.
  - `amount` (`bigint`): The amount of ERC20 tokens to transfer.

- **Throws:**
  - `Error`: Throws an error if the sender has insufficient balance.

**Example:**

```typescript
try {
  wallet.transferERC20(
    "0xTokenAddress",
    "0x1234567890abcdef1234567890abcdef12345678",
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
    1000n
  );
  console.log("Transfer successful");
} catch (error) {
  console.error(`Failed to transfer ERC20 tokens: ${error.message}`);
}
```

#### `withdrawERC20(token: Address, address: Address, amount: bigint): Voucher`

Creates a voucher to withdraw ERC20 tokens from the specified address.

- **Parameters:**
  - `token` (`Address`): The ERC20 token contract address.
  - `address` (`Address`): The address to withdraw ERC20 tokens from. The address will be normalized.
  - `amount` (`bigint`): The amount of ERC20 tokens to withdraw.

- **Returns:**
  - `Voucher`: A voucher that can be used to process the withdrawal.

- **Throws:**
  - `Error`: Throws an error if the address has insufficient balance.

**Example:**

```typescript
try {
  const voucher = wallet.withdrawERC20(
    "0xTokenAddress",
    "0x1234567890abcdef1234567890abcdef12345678",
    1000n
  );
  console.log("Voucher created for ERC20 withdrawal:", voucher);
} catch (error) {
  console.error(`Failed to create withdrawal voucher: ${error.message}`);
}
```

### ERC721 Methods

#### `erc721Has(token: Address, address: string, tokenId: bigint): boolean`

Checks if a given address owns a specified ERC721 token.

- **Parameters:**
  - `token` (`Address`): The ERC721 token contract address.
  - `address` (`string`): The address to check ownership for. The address will be normalized.
  - `tokenId` (`bigint`): The token ID to check.

- **Returns:**
  - `boolean`: Returns `true` if the address owns the specified token ID, otherwise `false`.

**Example:**

```typescript
const hasToken = wallet.erc721Has(
  "0xTokenAddress",
  "0x1234567890abcdef1234567890abcdef12345678",
  1n
);
console.log(`Owns token: ${hasToken}`);
```

#### `transferERC721(token: Address, from: string, to: string, tokenId: bigint): void`

Transfers an ERC721 token from one address to another.

- **Parameters:**
  - `token` (`Address`): The ERC721 token contract address.
  - `from` (`string`): The sender's address. The address will be normalized.
  - `to` (`string`): The recipient's address. The address will be normalized.
  - `tokenId` (`bigint`): The token ID to transfer.

- **Throws:**
  - `Error`: Throws an error if the sender does not own the specified token ID.

**Example:**

```typescript
try {
  wallet.transferERC721(
    "0xTokenAddress",
    "0x1234567890abcdef1234567890abcdef12345678",
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
    1n
  );
  console.log("Transfer successful");
} catch (error) {
  console.error(`Failed to transfer ERC721 token: ${error.message}`);
}
```

#### `withdrawERC721(token: Address, address: Address, tokenId: bigint): Voucher`

Creates a voucher to withdraw an ERC721 token from the specified address.

- **Parameters:**
  - `token` (`Address`): The ERC721 token contract address.
  - `address` (`Address`): The address to withdraw the ERC721 token from. The address will be normalized.
  - `tokenId` (`bigint`): The token ID to withdraw.

- **Returns:**
  - `Voucher`: A voucher that can be used to process the withdrawal.

- **Throws:**
  - `Error`: Throws an error if the address does not own the specified token ID.

**Example:**

```typescript
try {
  const voucher = wallet.withdrawERC721(
    "0xTokenAddress",
    "0x1234567890abcdef1234567890abcdef12345678",
    1n
  );
  console.log("Voucher created for ERC721 withdrawal:", voucher);
} catch (error) {
  console.error(`Failed to create withdrawal voucher: ${error.message}`);
}
```

### ERC1155 Methods

#### `erc1155BalanceOf(token: Address, address: string, tokenId: bigint): bigint`

Retrieves the balance of a specific ERC1155 token for a given address.

- **Parameters:**
  - `token` (`Address`): The ERC1155 token contract address.
  - `address` (`string`): The address to check the ERC1155 token balance for. The address will be normalized.
  - `tokenId` (`bigint`): The token ID to check.

- **Returns:**
  - `bigint`: The balance of the specified ERC1155 token for the address.

**Example:**

```typescript
const balance = wallet.erc1155BalanceOf(
  "0xTokenAddress",
  "0x1234567890abcdef1234567890abcdef12345678",
  1n
);
console.log(`ERC1155 token balance: ${balance}`);
```

#### `transferERC1155(token: Address, from: string, to: string, tokenId: bigint, value: bigint): void`

Transfers a specified amount of an ERC1155 token from one address to another.

- **Parameters:**
  - `token` (`Address`): The ERC1155 token contract address.
  - `from` (`string`): The sender's address. The address will be normalized.
  - `to` (`string`): The recipient's address. The address will be normalized.
  - `tokenId` (`bigint`): The token ID to transfer.
  - `value` (`bigint`): The amount of the token to transfer.

- **Throws:**
  - `Error`: Throws an error if the sender has insufficient balance for the specified token ID.

**Example:**

```typescript
try {
  wallet.transferERC1155(
    "0xTokenAddress",
    "0x1234567890abcdef1234567890abcdef12345678",
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
    1n,
    10n
  );
  console.log("Transfer successful");
} catch (error) {
  console.error(`Failed to transfer ERC1155 token: ${error.message}`);
}
```

#### `withdrawERC1155(token: Address, address: Address, tokenId: bigint, value: bigint, data: Hex): Voucher`

Creates a voucher to withdraw a specified amount of an ERC1155 token from the specified address.

- **Parameters:**
  - `token` (`Address`): The ERC1155 token contract address.
  - `address` (`Address`): The address to withdraw the ERC1155 token from. The address will be normalized.
  - `tokenId` (`bigint`): The token ID to withdraw.
  - `value` (`bigint`): The amount of the token to withdraw.
  - `data` (`Hex`): Additional data to include with the withdrawal.

- **Returns:**
  - `Voucher`: A voucher that can be used to process the withdrawal.

- **Throws:**
  - `Error`: Throws an error if the address has insufficient balance for the specified token ID.

**Example:**

```typescript
try {
  const voucher = wallet.withdrawERC1155(
    "0xTokenAddress",
    "0x1234567890abcdef1234567890abcdef12345678",
    1n,
    10n,
    "0x"
  );
  console.log("Voucher created for ERC1155 withdrawal:", voucher);
} catch (error) {
  console.error(`Failed to create withdrawal voucher: ${error.message}`);
}
```

#### `transferBatchERC1155(token: Address, from: string, to: string, tokenIds: bigint[], values: bigint[]): void`

Transfers multiple ERC1155 tokens from one address to another in a batch.

- **Parameters:**
  - `token` (`Address`): The ERC1155 token contract address.
  - `from` (`string`): The sender's address. The address will be normalized.
  - `to` (`string`): The recipient's address. The address will be normalized.
  - `tokenIds` (`bigint[]`): The token IDs to transfer.
  - `values` (`bigint[]`): The amounts of each token to transfer.

- **Throws:**
  - `Error`: Throws an error if the sender has insufficient balance for any of the specified token IDs.

**Example:**

```typescript
try {
  wallet.transferBatchERC1155(
    '0xTokenAddress',
    '0x1234567890abcdef1234567890abcdef12345678',
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    [1n, 2n, 3n],
    [10n, 20n, 30n]
  );
  console.log('Batch transfer successful');
} catch (error) {
  console.error(`Failed to transfer ERC1155 tokens: ${error.message}`);
}
```

#### `withdrawBatchERC1155(token: Address, address: Address, tokenIds: bigint[], values: bigint[], data: Hex): Voucher`

Creates a voucher to withdraw multiple ERC1155 tokens from the specified address in a batch.

- **Parameters:**
  - `token` (`Address`): The ERC1155 token contract address.
  - `address` (`Address`): The address to withdraw the ERC1155 tokens from. The address will be normalized.
  - `tokenIds` (`bigint[]`): The token IDs to withdraw.
  - `values` (`bigint[]`): The amounts of each token to withdraw.
  - `data` (`Hex`): Additional data to include with the withdrawal.

- **Returns:**
  - `Voucher`: A voucher that can be used to process the withdrawal.

- **Throws:**
  - `Error`: Throws an error if the address has insufficient balance for any of the specified token IDs.

**Example:**

```typescript
try {
  const voucher = wallet.withdrawBatchERC1155(
    '0xTokenAddress',
    '0x1234567890abcdef1234567890abcdef12345678',
    [1n, 2n, 3n],
    [10n, 20n, 30n],
    '0x'
  );
  console.log('Voucher created for batch ERC1155 withdrawal:', voucher);
} catch (error) {
  console.error(`Failed to create batch withdrawal voucher: ${error.message}`);
}
```

