---
id: javascript-wallet
title: Build a wallet dApp with JavaScript
resources:
  - url: https://www.udemy.com/course/the-cartesi-dapp-developer-masterclass
    title: The Cartesi dApp Developer Free Course
  - url: https://github.com/jjhbk/cartesi-wallet
    title: "Cartesi-Wallet: TypeScript-based Wallet Implementation for Cartesi dApps"
  - url: https://github.com/jjhbk/cartesi-router
    title: "Cartesi-Router: TypeScript-based Router Implementation for Cartesi dApps"
  - url: https://github.com/Mugen-Builders/frontend-cartesi-wallet-x
    title: "Frontend-Cartesi-Wallet: A React frontend to showcase wallet functionality of Cartesi dApps"
  - url: https://github.com/Mugen-Builders/sunodo-frontend-console
    title: Frontend Console Application
  - url: https://github.com/jplgarcia/cartesi-angular-frontend
    title: Angular Starter Template to Showcase Wallet Functionality of Cartesi dApps
  - url: https://github.com/Mugen-Builders/simple-cartesi-jsapp
    title: "Simple Cartesi dApp: This example showcases how to build a simple Cartesi dApp using Cartesi Wallet and Cartesi Router modules."
---

Let’s build a simple dApp that uses the `cartesi-wallet` package to handle different deposits and withdrawals.

[Cartesi Wallet](https://github.com/jjhbk/cartesi-wallet) is a JavaScript/TypeScript-based wallet implementation for Cartesi dApps.


## Installation

1. Create a backend application by running:

```shell
sunodo create js-wallet-dapp --template javascript
```

2. In the `js-wallet-dapp` directory, install `cartesi-wallet,` and `viem`.

```shell
npm install viem cartesi-wallet
```

## Usage

Import essential functions and classes from external modules:

```js
import { hexToString } from "viem";
import { Wallet } from "cartesi-wallet";
```

Create an instance of the Wallet by initializing it with an empty Map object:

```js
let wallet = new Wallet(new Map());
```


Initialize variables for the portal contract and relay addresses:

```js
const etherPortalAddress = "0x...44";
const erc20PortalAddress = "0x...DB";
const erc721PortalAddress = "0x...87";
const dAppAddressRelayContract = "0x...aE";
```

You can obtain the relevant addresses by running `sunodo address-book`.



## Implementing Deposits

In the application entry point’s `handle_advance()` function, create instances for depositing various asset types to our dApp.


```js
if (data.metadata.msg_sender.toLowerCase() == erc20PortalAddress.toLowerCase()) {
  let notice = wallet.erc20_deposit_process(data.payload);
  await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload: notice.payload }),
  });
}
```

## Implementing withdrawals and transfers

```js
let input = data.payload;
let str = Buffer.from(input.substr(2), "hex").toString("utf8");
let json = JSON.parse(str);

if (json.method == "transfer") {
  let notice = wallet.erc20_transfer(json.from, json.to, json.erc20, BigInt(json.amount));
  await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload: notice.payload }),
  });
} else if (json.method == "withdraw") {
  try {
    let voucher = wallet.erc20_withdraw(json.from, json.erc20, BigInt(json.amount));
    await fetch(rollup_server + "/voucher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: voucher.payload, destination: voucher.destination }),
    });
  } catch (error) {
    console.log("ERROR");
    console.log(error);
  }
}

```

Below are the sample payloads for the `transfer` and `withdraw` methods:

```json
// "transfer" method
{
    "method": "transfer",
    "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "to": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "erc20": "0xae7f61eCf06C65405560166b259C54031428A9C4",
    "amount": 5000000000000000000
}

// "withdraw" method
{
    "method": "withdraw",
    "from": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "erc20": "0xae7f61eCf06C65405560166b259C54031428A9C4",
    "amount": 3000000000000000000
}

```

## Method references

```js
balance_get: (_account: Address) => Balance
ether_deposit_process: (_payload: string) => Output;
ether_withdraw: (rollup_address: Address, account: Address, amount: bigint) => Voucher | Error_out;
ether_transfer: (account: Address, to: Address, amount: bigint) => Notice | Error_out;

erc20_deposit_process: (_payload: string) => Output;
erc20_withdraw: (account: Address, erc20: Address, amount: bigint) => Voucher | Error_out;
erc20_transfer: (account: Address, to: Address, erc20: Address, amount: bigint) => Notice | Error_out;

erc721_deposit_process: (_payload: string) => Output;
erc721_withdraw: (rollup_address: Address, sender: Address, erc721: Address, token_id: number) => Voucher | Error_out;
erc721_transfer: (account: Address, to: Address, erc721: Address, token_id: number) => Notice | Error_out;
```

##  Frontend Integration

You can use a couple of options for frontend integration in your backend wallet. 

- Frontend Console: The terminal can interact directly with your backend wallet. Here is [a sample frontend console application](https://github.com/Mugen-Builders/sunodo-frontend-console) ready to be used!

- Web User Interface: Alternatively, you can develop a user-friendly web interface for your dApp. This approach offers a more polished user experience and is suitable for production-ready applications. Here are [React.js starter](https://github.com/Mugen-Builders/frontend-cartesi-wallet-x) and [Angular starter](https://github.com/jplgarcia/cartesi-angular-frontend) templates you can use.

