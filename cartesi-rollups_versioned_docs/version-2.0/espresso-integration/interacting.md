# Sending inputs to your dApp

## Interacting via the CLI

- Sending transactions such as deposits or generic messages through the layer 1 is done in the same ways as Cartesi Rollups standalone. You can use `cast`, the `cartesi cli` or other approaches. You can follow them here in the [docs](https://docs.cartesi.io/cartesi-rollups/1.5/development/send-requests/)

- To send a dummy anvil execution that should go through Espresso network before being picked up by your dapp running in the Cartesi Machine you can run the following command:

  - Install The mugen-builders cli using npm:

  ```bash
  npm install -g @mugen-builders/cli
  ```

  - Run the below command to start the process of sending the transaction:

  ```bash
  mugen-cli send
  ```

> [!IMPORTANT]
> Check out [this Video](https://drive.google.com/file/d/1kK6SP8rTw4O5l6lBOGPexNfiUYJrzr7E/view?usp=sharing) for a demo on using the cli

## Interacting via the Frontend Template

We have a demo example available which you can clone, and integrate into the dapp running on your local machine very easily. You can choose to modify this dApp to fit and match your ideal implementation and design.
It contains a ways to send many types of input. Including interacting with your Cartesi dApp via espresso, which utilizes EIP-712 to sign typed data which is relayed on the users' behalf to the espresso testnet.

### Installation

- Clone the frontend repo integrated with EIP 712 by using this command:

```bash
git clone https://github.com/Calindra/frontend-web-cartesi
```

- Install all the necessary dependencies by running this commands:

```bash
cd frontend-web-cartesi
git checkout feature/refactor-simplification
yarn install
```

- Generate the necessary rollup data’s by running this command;

```bash
yarn codegen
```

- Start the frontend application by running:

```bash
yarn dev --port 3000
```

- Finally open your browser and navigate to the URL where your frontend dapp is running, you can now interact with your dapp running on local by signing and sending data to your dapp via espresso.
- To send data via espresso use the “Send L2 EIP-712 Input” form in the Input section.
- If you are running with the testnet remember to point to Sepolia

## Interacting via the NPM Package

Interacting with your Cartesi dApp using the `@mugen-builders/client` npm package allows you to send data via EIP-712 or directly using signed inputs. This package simplifies the process of relaying data to Cartesi dApps, providing flexibility to work with both EIP-712 formatted data and standard inputs.
You can check the description of the function in the package's [page](https://www.npmjs.com/package/@mugen-builders/client)

### Installation

- Install the npm package by running the following command:

```bash
npm install @mugen-builders/client@0.1.2-rc1.0
```

### Usage

To integrate the package into the front-end of your dApp, use the `advanceEIP712` and `advanceInput` methods to handle both EIP-712 typed data and simple input data(which goes through the L1). Below is an example implementation:

```javascript
import { advanceInput, advanceEIP712 } from "@mugen-builders/client";

const addInput = async (_input) => {
  const provider = new ethers.providers.Web3Provider(wallet.provider);
  const signer = provider.getSigner();

  // For EIP-712 input
  let espressoInput = await advanceEIP712(
    signer,
    provider,
    dappAddress,
    _input,
    {
      cartesiNodeUrl: "http://localhost:8080",
    }
  );

  // For simple input
  let l1Input = await advanceInput(signer, dappAddress, _input, {
    inputBoxAddress: "0x58Df21fE097d4bE5dCf61e01d9ea3f6B81c2E1dB",
  });
};
```

The return of `advanceEIP712` will be the same as `advanceInput`. Both methods will return lists with reports, notices and vouchers generated from that input, allowing you to interact with your dApp using the provided data.

This simplifies interaction with your dApp, providing an easy way to handle both types of inputs.
