---
id: creating-an-application
title: Creating an Application
resources:
  - url: https://github.com/Calindra/nonodo
    title: NoNodo
  - url: https://cartesiscan.io/
    title: CartesiScan
---



Cartesi CLI simplifies creating applications on Cartesi. To create a new application, run:

```shell
cartesi create <application-name> --template <language>
```

For example, create a Javascript project.

```shell
cartesi create new-app --template javascript
```

This command creates a `new-app` directory with essential files for your application development.

- `Dockerfile`: Contains configurations to build a complete Cartesi machine with your app's dependencies. Your backend code will run in this environment.

- `README.md`: A markdown file with basic information and instructions about your application.

- `src/index.js`: A javascript file with template backend code that serves as your application's entry point.

- `package.json`: A list of dependencies required for your application along with the name, version and description of your application.

Cartesi CLI has templates for the following languages – `cpp`, `cpp-low-level`, `go`, `javascript`, `lua`, `python`, `ruby`, `rust`, and `typescript`.

:::note Building with Go?
For Go applications on Cartesi, we recommend using [Rollmelette](https://github.com/rollmelette/rollmelette). It’s a high-level Go framework and an alternative template that simplifies development and enhances input management, providing a smoother and more efficient experience.
:::

## Implementing your application Logic

After creating your application, you can begin building your application by adding your logic to the index.js file. This file serves as the entry point of your application. While your project can include multiple files and directories, the default application file should remain the entry point of your application.

It’s important not to modify or remove existing code in index.js unless you fully understand its purpose, as doing so may prevent your application from functioning correctly. Instead, you are encouraged to extend the file by adding your own logic and implementations alongside the default code.

If your application needs to emit notices, vouchers, or reports, make sure to implement the corresponding logic within your codebase to properly handle these outputs. You can check out the respective pages for [Notice](../api-reference/backend/notices.md), [Vouchers](../api-reference/backend/vouchers.md) or [Report](../api-reference/backend/reports.md) for better understanding of what they are and how to implement them.

The default application template includes two primary functions; handle_advance and handle_inspect. These act as entry points for different types of operations within your application. The `handle_advance` function is the entry point for state modifying logic, you can think of this like handling "write" requests in traditional web context. It is intended to carry out computations, updates, and other logic that changes the state of the application. Where appropriate, it can emit outputs such as `notices`, `vouchers`, or `reports`.

On the other hand, the `handle_inspect` function serves as the entry point for read only operations, similar to "read" requests in a typical web context. This function should be implemented to accept user input, perform any necessary lookups or calculations based on the current state, and return the results by emitting a `report`. It's important to understand that handle_inspect is designed strictly for reading the application's state, it should not perform any modifications.

Below is a sample application that has been modified to include the logic to simply receive an input from a user in both inspect and advance route then, emits a notice, voucher and a report. For your application you'll need to include your personal logic and also emit outputs when necessary:

```javascript

import { stringToHex, encodeFunctionData, erc20Abi, hexToString } from "viem";

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));

  const sender = data["metadata"]["msg_sender"];
  const payload = hexToString(data.payload);
  const erc20Token = "0x784f0c076CC55EAD0a585a9A13e57c467c91Dc3a"; // Sample ERC20 token address

  await emitNotice(payload);
  await emitReport(payload);

    const call = encodeFunctionData({
    abi: erc20Abi,
    functionName: "transfer",
    args: [sender, BigInt(10)],
  });

  let voucher = {
    destination: erc20Token,
    payload: call,
    value: '0x',
  };

  await emitVoucher(voucher);
  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  const payload = data.payload;
  await emitReport(payload);
  return "accept";
}

const emitNotice = async (inputPayload) => {
  let hexPayload = stringToHex(inputPayload);
  try {
    await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexPayload }),
    });
  } catch (error) {
    //Do something when there is an error
  }
}

const emitVoucher = async (voucher) => {
  try {
    await fetch(rollup_server + "/voucher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(voucher),
    });
  } catch (error) {
    //Do something when there is an error
  }
};

const emitReport = async (payload) => {
  let hexPayload = stringToHex(payload);
  try {
    await fetch(rollup_server + "/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: hexPayload }),
    });
  } catch (error) {
    //Do something when there is an error
  }
};

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

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
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();


```