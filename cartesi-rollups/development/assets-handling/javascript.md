---
id: javascript
title: Assets handling with JavaScript
tags: [assets, portals, vouchers]
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

Let’s build a simple dApp that uses the `cartesi-wallet` and `cartesi-router` packages to handle different deposits and withdrawals.

- **Cartesi Wallet** is a JavaScript/TypeScript-based wallet implementation for Cartesi dApps.

- **Cartesi Router** is a JavaScript/TypeScript-based router implementation.

## Installation

1. Create a backend application by running:

```shell
sunodo create js-wallet-dapp --template javascript
```

2. In the `js-wallet-dapp` directory, install `cartesi-router,` `cartesi-wallet,` and `viem.`

```shell
npm install viem cartesi-router cartesi-wallet
```

## Usage

Import essential functions and classes from external modules

```js
import { hexToString } from "viem";
import { Router } from "cartesi-router";
import { Wallet, Notice, Error_out } from "cartesi-wallet";
```

Initialize variables for the portal contract and relay addresses.

```js
const etherPortalAddress = "0xFfdbe43d4c855BF7e0f105c400A50857f53AB044";
const erc20PortalAddress = "0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB";
const erc721PortalAddress = "0x237F8DD094C0e47f4236f12b4Fa01d6Dae89fb87";
const dAppAddressRelayContract = "0xF5DE34d6BbC0446E2a45719E718efEbaaE179daE";
```

## Create a helper function

Let’s create a helper function allowing the rollups server to receive requests for the three output instances, i.e., [vouchers](../../api/backend/vouchers.md), [notices](../../api/backend/notices.md), and [reports](../../api/backend/reports.md).

```js
const send_request = async (output) => {
 if (output) {
   let endpoint;
   console.log("type of output", output.type);

if (output.type == "notice") {
     endpoint = "/notice";
   } else if (output.type == "voucher") {
     endpoint = "/voucher";
   } else {
     endpoint = "/report";
   }

console.log(`sending request ${typeof output}`);
   const response = await fetch(rollup_server + endpoint, {
     method: "POST",
     headers: {
       "Content-Type": "application/json,”
     },
     body: JSON.stringify(output),
   });
   console.debug(
     `received ${output.payload} status ${response.status} body ${response.body}`
   );
 } else {
   output.forEach((value) => {
     send_request(value);
   });
 }
};
```

Implement a slight change in the main execution loop that processes the rollup request using the appropriate handler function and sends the output to the rollup server.

```js
(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();

      var typeq = rollup_req.request_type;
      var handler;
      if (typeq === "inspect_state") {
        handler = handlers.inspect_state;
      } else {
        handler = handlers.advance_state;
      }
      var output = await handler(rollup_req.data);
      finish.status = "accept";
      if (output instanceof Error_out) {
        finish.status = "reject";
      }
      // send the request
      await send_request(output);
    }
  }
})();
```
Our application is ready to process deposits and withdrawals in this state. 

## Implementing Deposits


In our application entry point’s `handle_advance()` function, let’s create instances for depositing various asset types to our dApp.

```js
async function handle_advance(data) {
 console.log("Received advance request data " + JSON.stringify(data));
 try {
   const payload = data.payload;
   const msg_sender  = data.metadata.msg_sender;
   console.log("msg sender is", msg_sender.toLowerCase());

const payloadStr = hexToString(payload);

//Deposit ether
   if (
     msg_sender.toLowerCase() ===
     etherPortalAddress.toLowerCase()
   ) {
     try {
       return router.process("ether_deposit", payload);
     } catch (e) {
       return new Error_out(`failed to process Ether deposit ${payload} ${e}`);
     }
   }

// deposit erc20
   if (
     msg_sender.toLowerCase() ===
     erc20PortalAddress.toLowerCase()
   ) {
     try {
       return router.process("erc20_deposit", payload);
     } catch (e) {
       return new Error_out(`failed to process ERC20Deposit ${payload} ${e}`);
     }
   }
 // deposit erc721
   if (
     msg_sender.toLowerCase() ===
     erc721PortalAddress.toLowerCase()
   ) {
     try {
       return router.process("erc721_deposit", payload);
     } catch (e) {
       return new Error_out(`failed to process ERC721Deposit ${payload} ${e}`);
     }
   }

} catch (e) {
   console.error(e);
   return new Error_out(`failed to process advance_request ${e}`);
 }
}

```

Finally, let’s update our handle_inspect function to return an account balance of an address.

```js

async function handle_inspect(data) {
 console.log("Received inspect request data " + JSON.stringify(data));
 const url = hexToString(data.payload).split("/");

return router.process(url[0], url[1]); // balance/account
}
```

## Implementing withdrawals
In the `handle_advance()` function, add an implementation to set the dApp address so that withdrawals can happen trustless.

```js 
// set dapp address
   if (
     msg_sender.toLowerCase() ===
     dAppAddressRelayContract.toLowerCase()
   ) {
     rollup_address = payload;
     router.set_rollup_address(rollup_address, "ether_withdraw");
     router.set_rollup_address(rollup_address, "erc20_withdraw");
     router.set_rollup_address(rollup_address, "erc721_withdraw");

console.log("Setting DApp address");
     return new Notice(
       `DApp address set up successfully to ${rollup_address}`
     );
   }
```

Now, we can add a general try-catch block to handle different types of withdrawals.

```js
try {
     const jsonpayload = JSON.parse(payloadStr);
     console.log("payload is");
     return router.process(jsonpayload.method, data);
   } catch (e) {
     return new Error_out(`failed to process command ${payloadStr} ${e}`);
   }
```

Our dApp is ready to receive requests for deposits and withdrawals in this state.

##  Frontend Integration

You can use a couple of options for frontend integration in your backend wallet. 

- Frontend Console: The terminal can interact directly with your backend wallet. Here is [a sample frontend console application](https://github.com/Mugen-Builders/sunodo-frontend-console) ready to be used!

- Web User Interface: Alternatively, you can develop a user-friendly web interface for your dApp. This approach offers a more polished user experience and is suitable for production-ready applications. Here are [React.js starter](https://github.com/Mugen-Builders/frontend-cartesi-wallet-x) and [Angular starter](https://github.com/jplgarcia/cartesi-angular-frontend) templates you can use.
