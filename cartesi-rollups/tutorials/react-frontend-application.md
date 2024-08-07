---
id: react-frontend-application
title: Build a React frontend for Cartesi dApps
resources:
  - url: https://github.com/Mugen-Builders/cartesi-frontend-tutorial
    title: Source code for the frontend application
  - url: https://www.michaelasiedu.dev/posts/deploy-erc20-token-on-localhost/
    title: Deploying an ERC20 Token for Localhost Testing and Adding to MetaMask
  - url: https://www.michaelasiedu.dev/posts/deploy-erc721-token-on-localhost/
    title: Deploying an ERC721 Token for Localhost Testing and Adding to MetaMask
---

This tutorial will focus on building a frontend for a Cartesi dApp using [React.js](https://create-react-app.dev/docs/getting-started). Our primary goal is to create a minimalistic frontend with all the functionalities for seamless interactions with any Cartesi backend.

## Setting up the environment

To build a frontend for Cartesi dApps, we'll use React.js along with [Wagmi](https://wagmi.sh/), a library that simplifies blockchain interactions in React applications.

### Creating a new React project

To get started quickly with a pre-configured React project that includes Wagmi, you can use the `create-wagmi` CLI command. For detailed instructions on setting up a Wagmi project, refer to [the official Wagmi documentation](https://wagmi.sh/react/getting-started).

Install the following dependencies:
- [TailwindCSS](https://tailwindcss.com/docs/guides/vite)
- [Axios](https://axios-http.com/docs/intro)

Once you've set up your project, you'll have a basic structure that includes:

- A main configuration file for blockchain interactions
- A main App component
- An entry point file

## Connecting wallet and chains

The `wagmi.ts` file is the main configuration file for multiple chains and an `injected` connector.

- Enhance the `wagmi.ts` configuration by adding all the chains supported by Cartesi Rollups.

- Replace the transports property with a Viem Client integration via the `client` property to have finer control over Wagmi’s internal client creation.

Edit the `src/wagmi.ts` file:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="wagmi-ts" label="src/wagmi.ts" default>
<pre><code>

```javascript
import { http, createConfig } from "wagmi";
import {
  anvil,
  arbitrum,
  arbitrumGoerli,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismGoerli,
  sepolia,
} from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { createClient } from "viem";

export const config = createConfig({
  chains: [
    anvil,
    mainnet,
    sepolia,
    arbitrum,
    arbitrumGoerli,
    optimismGoerli,
    optimism,
    base,
    baseSepolia,
  ],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

```

</code></pre>
</TabItem>
</Tabs>

:::note supported networks
You can find the list of supported chains and their IDs in the [deployment guide](../deployment/introduction.md/#supported-networks).
:::

### Building the Account component

Let's create an implementation for easy network switching and a comprehensive wallet management interface.

Move the account connection and management logic to a separate component for a cleaner and more organized `App.tsx`. 

We will add [Tailwind CSS classes](https://tailwindcss.com/docs/guides/vite) to ensure visual appeal.

Create a new file `src/components/Account.tsx` and edit the `App.tsx`:
<Tabs>
  <TabItem value="account" label="src/components/Account.tsx" default>
<pre><code>

```jsx
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { useState } from "react";

const Account = () => {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { chains, switchChain } = useSwitchChain();
  const [isChainDropdownOpen, setIsChainDropdownOpen] = useState(false);

  return (
  <div className="max-w-2xl mx-auto mt-10 p-6 bg-gradient-to-r
    from-purple-500 to-indigo-600 rounded-lg shadow-xl">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-white mb-4">Account</h2>

      <div className="bg-white bg-opacity-20 rounded-lg p-4 text-white">
        <p className="mb-2">
          <span className="font-semibold">Status:</span> 
          <span className="text-white font-semibold"> 
          {account.status.toLocaleUpperCase()} </span>
        </p>
        <p className="mb-2 font-semibold">
          <span>Address:</span>{" "}
          {account.addresses?.[0]}
        </p>
        <p className="font-semibold">
          <span>Chain ID:</span> {account.chain?.name} | {account.chainId}
        </p>
      </div>

      {/* Display chain switching and disconnect options when connected */}
      {account.status === "connected" && (
        <div className="space-y-4 mt-4">
          {/* Chain switching dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsChainDropdownOpen(!isChainDropdownOpen)}
              className="w-full flex justify-between items-center 
              py-2 px-4 border border-gray-300 rounded-md 
              shadow-sm text-sm font-medium
                text-gray-700 bg-white hover:bg-gray-50 
                focus:outline-none focus:ring-2 focus:ring-offset-2
                 focus:ring-indigo-500 transition-colors duration-200"
            >
              Switch Chain
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 
                  0L10 10.586l3.293-3.293a1 1 0 111.414 
                  1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {/* Dropdown menu for chain options */}
            {isChainDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full
               bg-white shadow-lg rounded-md py-1">
                {chains.map((chainOption) => (
                  <button
                    key={chainOption.id}
                    onClick={() => {
                      switchChain({ chainId: chainOption.id });
                      setIsChainDropdownOpen(false);
                    }}
                    className="block w-full text-left 
                    px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {chainOption.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Disconnect button */}
          <button
            type="button"
            onClick={() => disconnect()}
            className="w-full flex justify-center py-2 
            px-4 border border-transparent rounded-md 
            shadow-sm text-sm font-medium text-white 
            bg-red-600 hover:bg-red-700 focus:outline-none 
            focus:ring-2 focus:ring-offset-2
             focus:ring-red-500 transition-colors duration-200"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>

    {/* Connect section */}
    <div>
      <h2 className="text-3xl font-bold text-white mb-4">Connect</h2>
      <div className="grid grid-cols-2 gap-4">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
            className="px-4 py-2 bg-white
             text-purple-600 rounded-md hover:bg-purple-100
              transition-colors duration-300"
          >
            {connector.name}
          </button>
        ))}
      </div>
      <div className="mt-4 text-white">
      Status: {status.toLocaleUpperCase()}
      </div>
      <div className="mt-2 text-red-300">
      {error?.message}
      </div>
    </div>
  </div>
);
};

export default Account;
```

</code></pre>
</TabItem>

  <TabItem value="app.tsx" label="src/App.tsx">
<pre><code>

```javascript
import Account from "./components/Account";

function App() {
  return (
    <>
      <Account />
    </>
  );
}

export default App;

```

</code></pre>
</TabItem>

</Tabs>


## Define the ABIs, contract addresses and hooks

In a Cartesi dApp, the frontend sends inputs to the backend via the base layer chain using JSON-RPC transactions.

Pre-deployed smart contracts on supported chains handle generic inputs and assets. 

We only need their ABIs and addresses to send transactions using Wagmi.

However, manually specifying the ABIs and addresses for all the Cartesi Rollups contracts when making function calls can be a hassle.

Thanks to [`@wagmi/cli`](https://wagmi.sh/cli/why), we can be more efficient by **autogenerating Cartesi-specific hooks**. 

:::note 
These hooks come preconfigured with all the ABIs and addresses needed for any function calls to Cartesi. We just need to add the custom arguments for our specific use case.
:::


This will automate manual work so we can build faster! We simply import the hooks, call the functions, and pass in the custom arguments.


We will install the following dependencies to our project:

- [`@wagmi/cli`](https://wagmi.sh/cli/why): The Wagmi CLI tool for ABI-specific hooks.
- [`@cartesi/rollups`](https://www.npmjs.com/package/@cartesi/rollups): The Cartesi Rollups contract implementations.
- [`@sunodo/wagmi-plugin-hardhat-deploy`](https://www.npmjs.com/package/@sunodo/wagmi-plugin-hardhat-deploy): Wagmi CLI plugin that loads contracts and deployments from the `@cartesi/rollups` package.

```bash
npm i  @wagmi/cli @cartesi/rollups @sunodo/wagmi-plugin-hardhat-deploy 
```


Create a config file in the root of your project: `wagmi.config.ts`

Then, add contracts and plugins for Cartesi Rollups:

<Tabs>
  
<TabItem value="wagmi-config" label="wagmi.config.ts" default>
<pre><code>

```typescript
import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { erc20Abi, erc721Abi } from "viem";
import hardhatDeploy from "@sunodo/wagmi-plugin-hardhat-deploy";

export default defineConfig({
  out: "src/hooks/generated.ts", // Specifies the output file for the hooks
  contracts: [
    {
      abi: erc20Abi,
      name: "erc20",
    },
    { abi: erc721Abi, name: "erc721" },
  ],
  plugins: [
    hardhatDeploy({
        directory: "node_modules/@cartesi/rollups/export/abi",
    }),
    react(),
],
});
```

</code></pre>
</TabItem>

</Tabs>


The configuration sets up the Wagmi CLI to generate TypeScript hooks for ERC20 and ERC721 contracts, as well as for any contracts in the specified Cartesi Rollups ABI directory, i.e `src/hooks/generated`.

To generate, run:

```bash
npx wagmi generate
```

## Sending a generic input

The [`InputBox`](../rollups-apis/json-rpc/input-box.md) contract is a trustless and permissionless contract that receives arbitrary blobs (called "inputs") from anyone.

The `InputBox` contract is deployed on all supported chains. We will use a React hook to send an input to the backend via the `InputBox` contract. 

Create a new file `src/components/SimpleInput.tsx` and follow the implementation below:


### Component setup and imports

```javascript
import React, { useState } from "react";
import { BaseError } from "wagmi";
import { useWriteInputBoxAddInput } from "../hooks/generated";
import { stringToHex } from "viem";
```
Here, we are importing the generated `useWriteInputBoxAddInput` hook and Viem's `stringToHex` function for data conversion.


### Component definition and state

```javascript 

const SimpleInput = () => {
  const dAppAddress = `0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e`;
  const [inputValue, setInputValue] = useState("");
  const [hexInput, setHexInput] = useState<boolean>(false);

  // ... rest of the component
};
```

We define the `dAppAddress` and create a state variable `inputValue` to manage the user's input. The `hexInput` state variable is used to toggle between the generic text input and hex values.

The `dAppAddress` is the address of the Cartesi backend that will receive the input. In this case, we are using a hardcoded address of a local dApp instance for demonstration purposes.

### Using the  Hook

We'll use the `useWriteInputBoxAddInput` hook to interact with the `InputBox` contract:

```javascript
const { isPending, isSuccess, error, writeContractAsync } = useWriteInputBoxAddInput();
```

This hook provides us with state variables and a `writeContractAsync` function to write to the smart contract.


### Form submission and component rendering

```typescript
 async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await writeContractAsync({
      args: [
        dAppAddress,
        hexInput ? (inputValue as Hex) : stringToHex(inputValue),
      ],
    });
  }
```

The `submit` function is called when the form is submitted. 

It uses the `writeContractAsync` function to send the input to the [`addInput(address _dapp, bytes _input)`](../rollups-apis/json-rpc/input-box.md/#addinput) function of the  `InputBox`. 

The `inputValue` will be received by the particular backend address is `dAppAddress`.


Now, let us build our component JSX with an input field and a submit button, styled with Tailwind CSS. It also includes conditional rendering for success and error messages.


### Final Component

Putting it all together, our complete `<SimpleInput/>` component and `App.tsx` look like this:

<Tabs>
  <TabItem value="simple-input" label="src/components/SimpleInput.tsx" default>
<pre><code>

```jsx
import React, { useState } from "react";
import { BaseError } from "wagmi";
import { useWriteInputBoxAddInput } from "../hooks/generated";
import { Hex, stringToHex } from "viem";

const SimpleInput = () => {
  const dAppAddress = `0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e`;
  const [inputValue, setInputValue] = useState("");
  const [hexInput, setHexInput] = useState<boolean>(false);

  const { isPending, isSuccess, error, writeContractAsync } =
    useWriteInputBoxAddInput();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await writeContractAsync({
      args: [
        dAppAddress,
        hexInput ? (inputValue as Hex) : stringToHex(inputValue),
      ],
    });
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 
    bg-gradient-to-r from-purple-500 to-indigo-600 
    rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-white mb-6">Send Generic Input</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-md border
             border-gray-300 focus:outline-none 
             focus:ring-2 focus:ring-purple-500"
            placeholder="Enter something"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <input
            type="checkbox"
            checked={hexInput}
            onChange={(e) => setHexInput(!hexInput)}
          />
          <span>Raw Hex </span>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-white
           text-purple-600 rounded-md hover:bg-purple-100
            transition-colors duration-300 font-medium"
        >
          {isPending ? "Sending..." : "Send"}
        </button>
      </form>

      {isSuccess && (
        <p className="mt-4 text-green-300 font-bold">Transaction Sent</p>
      )}

      {error && (
        <div className="mt-4 text-red-300">
          Error: {(error as BaseError).shortMessage || error.message}
        </div>
      )}
    </div>
  );
};

export default SimpleInput;

```

</code></pre>
</TabItem>

<TabItem value="app-ts" label="src/App.tsx" default>
<pre><code>

```typescript
import Account from "./components/Account";
import SimpleInput from "./components/SimpleInput";

function App() {
  return (
    <>
      <Account />
      <SimpleInput />
    </>
  );
}

export default App;

```

</code></pre>
</TabItem>

</Tabs>

## Depositing Ether

The [`EtherPortal`](../rollups-apis/json-rpc/portals/EtherPortal.md) contract is a pre-deployed smart contract that allows users to deposit Ether to the Cartesi backend.


This implementation will be similar to the generic input, but with a few changes to handle Ether transactions.

The key changes in this are:

  - The input field now will accept **Ether** values instead of generic text.

  - The `submit` function creates a data string representing the Ether deposit and uses `parseEther` to convert the input value.

  - We will use the `useWriteEtherPortalDepositEther` hook to send Ether.



  ```typescript
    import { useWriteEtherPortalDepositEther } from "../hooks/generated";

    // other imports here

    const [etherValue, setEtherValue] = useState("");

    // rest of the code

    const {isPending,isSuccess,error,writeContractAsync: depositToken} = useWriteEtherPortalDepositEther();

    async function submit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const data = stringToHex(`Deposited (${etherValue}) ether.`);
      await depositToken({
        args: [dAppAddress, data],
        value: parseEther(etherValue),
      });
    }


  // rest of the code
  ```

### Final Component

Create a new file `src/components/SendEther.tsx` and paste the complete code:

<Tabs>
  <TabItem value="send-ether" label="src/components/SendEther.tsx" default>
<pre><code>

```jsx
import React, { useState } from "react";
import { BaseError } from "wagmi";
import { useWriteEtherPortalDepositEther } from "../hooks/generated";

import { parseEther, stringToHex } from "viem";

const SendEther = () => {
  const dAppAddress = `0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e`;
  const [etherValue, setEtherValue] = useState("");

  const {
    isPending,
    isSuccess,
    error,
    writeContractAsync: depositToken,
  } = useWriteEtherPortalDepositEther();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = stringToHex(`Deposited (${etherValue}) ether.`);
    await depositToken({
      args: [dAppAddress, data],
      value: parseEther(etherValue),
    });
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gradient-to-r
     from-purple-500 to-indigo-600 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-white mb-6">Deposit Ether</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-md border
             border-gray-300 focus:outline-none focus:ring-2
              focus:ring-purple-500"
            placeholder="Enter Ether amount"
            value={etherValue}
            onChange={(e) => setEtherValue(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-white
           text-purple-600 rounded-md 
           hover:bg-purple-100 transition-colors duration-300 font-medium"
        >
          {isPending ? "Sending..." : "Send"}
        </button>
      </form>

      {isSuccess && (
        <p className="mt-4 text-green-300 font-bold">{etherValue} ETH sent!</p>
      )}

      {error && (
        <div className="mt-4 text-red-300">
          Error: {(error as BaseError).shortMessage || error.message}
        </div>
      )}
    </div>
  );
};

export default SendEther;

```

</code></pre>
</TabItem>

</Tabs>


## Depositing ERC20 Tokens

The [`ERC20Portal`](../rollups-apis/json-rpc/portals/ERC20Portal.md) contract is a pre-deployed smart contract that allows users to deposit ERC20 tokens to the Cartesi backend.


This implementation will be similar to the [depositing Ether](#depositing-ether), but with a few changes to handle ERC20 token transactions.

Here are the key differences in depositing ERC20 tokens compared to Ether:

  - ERC20 deposits require both the **ERC20 token address** and **amounts**.

  - The `submit` function first calls [`approve()`](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20#ERC20-approve-address-uint256-) before calling `depositERC20Tokens` on the ERC20Portal contract.

  :::note ERC Token Approval
  For [**ERC20, ERC721, and ERC1155 token standards**](https://ethereum.org/en/developers/docs/standards/tokens/), an approval step is need. This ensures you grant explicit permission for a contract (like the Portals) to transfer tokens on your behalf. 
  
  Without this approval, contracts like ERC20Portal cannot move your tokens to the Cartesi backend.
  :::

  - We will use the `useWriteErc20Approve` hook to approve the deposit and `useWriteErc20PortalDepositErc20Tokens` hook to make the deposit.

  ```typescript
    import {
      erc20PortalAddress,
      useWriteErc20Approve,
      useWriteErc20PortalDepositErc20Tokens,
    } from "../hooks/generated";

    import { Address, parseEther, stringToHex, Hex } from "viem";

    // other imports here

    const [erc20Value, setErc20Value] = useState("");
    const [tokenAddress, setTokenAddress] = useState<Address | null>();

    const { writeContractAsync: approveToken } = useWriteErc20Approve();
    const { writeContractAsync: depositToken} = useWriteErc20PortalDepositErc20Token();

    const approve = async (address: Address, amount: string) => {
      try {
        await approveToken({
          address,
          args: [erc20PortalAddress, parseEther(amount)],
        });
        console.log("ERC20 Approval successful");
      } catch (error) {
        console.error("Error in approving ERC20:", error);
        throw error;
      }
    };

    async function submit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const data = stringToHex(`Deposited (${erc20Value}).`);
      await approve(tokenAddress as Address, erc20Value);
      await depositToken({
        args: [tokenAddress as Hex, dAppAddress, parseEther(erc20Value), data],
      });
    }

    // rest of the code
   
  ```

For testing purposes, you'll need to deploy a test ERC20 token. Follow [this simple guide to deploy a test ERC20 token and add it to your Metamask wallet](https://www.michaelasiedu.dev/posts/deploy-erc20-token-on-localhost/).


### Final Component

Create a new file `src/components/SendERC20.tsx` and paste the complete code:

<Tabs>
  <TabItem value="send-erc20" label="src/components/SendERC20.tsx" default>
<pre><code>

```jsx
import React, { useState } from "react";
import { BaseError } from "wagmi";
import {
  erc20PortalAddress,
  useWriteErc20Approve,
  useWriteErc20PortalDepositErc20Tokens,
} from "../hooks/generated";
import { Address, parseEther, stringToHex, Hex } from "viem";

const SendERC20 = () => {
  const dAppAddress = `0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e`;
  const [erc20Value, setErc20Value] = useState("");
  const [tokenAddress, setTokenAddress] = useState<Address | null>();

  const {
    isPending,
    isSuccess,
    error,
    writeContractAsync: depositToken,
  } = useWriteErc20PortalDepositErc20Tokens();

  const { writeContractAsync: approveToken } = useWriteErc20Approve();

  const approve = async (address: Address, amount: string) => {
    try {
      await approveToken({
        address,
        args: [erc20PortalAddress, parseEther(amount)],
      });
      console.log("ERC20 Approval successful");
    } catch (error) {
      console.error("Error in approving ERC20:", error);
      throw error;
    }
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = stringToHex(`Deposited (${erc20Value}).`);
    await approve(tokenAddress as Address, erc20Value);
    await depositToken({
      args: [tokenAddress as Hex, dAppAddress, parseEther(erc20Value), data],
    });
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gradient-to-r
     from-purple-500 to-indigo-600 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-white mb-6">Deposit ERC20</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-md border
             border-gray-300 focus:outline-none 
             focus:ring-2 focus:ring-purple-500 mb-4"
            placeholder="ERC20 Token Address"
            value={tokenAddress as Address}
            onChange={(e) => setTokenAddress(e.target.value as Address)}
          />
          <input
            type="text"
            className="w-full px-4 py-2 rounded-md border
             border-gray-300 focus:outline-none 
             focus:ring-2 focus:ring-purple-500"
            placeholder="Enter ERC20 amount"
            value={erc20Value}
            onChange={(e) => setErc20Value(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-white
           text-purple-600 rounded-md hover:bg-purple-100
            transition-colors duration-300 font-medium"
        >
          {isPending ? "Sending..." : "Send"}
        </button>
      </form>

      {isSuccess && (
        <p className="mt-4 text-green-300 font-bold">
          {erc20Value} tokens sent!
        </p>
      )}

      {error && (
        <div className="mt-4 text-red-300">
          Error: {(error as BaseError).shortMessage || error.message}
        </div>
      )}
    </div>
  );
};

export default SendERC20;

```

</code></pre>
</TabItem>

<TabItem value="app-ts2" label="src/App.tsx" default>
<pre><code>

```typescript
import Account from "./components/Account";
import SimpleInput from "./components/SimpleInput";
import SendEther from "./components/SendEther";
import SendERC20 from "./components/SendERC20";

function App() {
  return (
    <>
      <Account />
      <SimpleInput />
      <SendEther />
      <SendERC20 />
    </>
  );
}

export default App;


```

</code></pre>
</TabItem>

</Tabs>


## Depositing ERC721 Tokens (NFTs)

The [`ERC721Portal`](../rollups-apis/json-rpc/portals/ERC721Portal.md) contract is a pre-deployed smart contract that allows users to deposit ERC721 tokens to the Cartesi backend.

This implementation will be similar to the [depositing ERC20 tokens](#depositing-erc20-tokens), but with a few changes to handle ERC721 token transactions.

Here are the key differences in depositing ERC721 tokens:

  - ERC721 deposits require both the **ERC721 token address** and **token ID**.

  - We will use the `useWriteErc721Approve` hook to approve the deposit and `useWriteErc721PortalDepositErc721Tokens` hook to make the deposit.

  ```typescript
    import { Address, erc721Abi, parseEther, stringToHex } from "viem";

    // other imports here

    const [tokenId, setTokenId] = useState<string>("");
    const [tokenAddress, setTokenAddress] = useState("");

    const {
    isPending,
    isSuccess,
    error,
    writeContractAsync: depositToken,
  } = useWriteErc721PortalDepositErc721Token();

    const { writeContractAsync: approveToken } = useWriteErc721Approve();

    const approve = async (address: Address, tokenId: bigint) => {
      try {
        await approveToken({
          address,
          args: [erc721PortalAddress, tokenId],
        });

        console.log("Approval successful");
      } catch (error) {
        console.error("Error in approving ERC721:", error);
        throw error; // Re-throw the error to be handled by the caller
      }
    };

    async function submit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const bigIntTokenId = BigInt(tokenId);
      const data = stringToHex(`Deposited NFT of token id:(${bigIntTokenId}).`);

      await approve(tokenAddress as Address, bigIntTokenId);

      depositToken({
        args: [tokenAddress as Hex, dAppAddress, bigIntTokenId, "0x", data],
      });
    }

    // rest of the code
   
  ```

For testing purposes, you'll need to deploy a test ERC721 token. Follow [this simple guide to deploy and mint a test ERC721 token and add it to your Metamask wallet](https://www.michaelasiedu.dev/posts/deploy-erc721-token-on-localhost/). 


### Final Component

Create a new file `src/components/SendERC721.tsx` and paste the complete code:

<Tabs>
  <TabItem value="send-erc721" label="src/components/SendERC721.tsx" default>
<pre><code>

```jsx
import React, { useState } from "react";
import { BaseError } from "wagmi";
import {
  erc721PortalAddress,
  useWriteErc721Approve,
  useWriteErc721PortalDepositErc721Token,
} from "../hooks/generated";
import { stringToHex, Address, Hex } from "viem";

const SendERC721 = () => {
  const dAppAddress = `0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e`;
  const [tokenId, setTokenId] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState("");

  const {
    isPending,
    isSuccess,
    error,
    writeContractAsync: depositToken,
  } = useWriteErc721PortalDepositErc721Token();

  const { writeContractAsync: approveToken } = useWriteErc721Approve();

  const approve = async (address: Address, tokenId: bigint) => {
    try {
      await approveToken({
        address,
        args: [erc721PortalAddress, tokenId],
      });

      console.log("Approval successful");
    } catch (error) {
      console.error("Error in approving ERC721:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const bigIntTokenId = BigInt(tokenId);
    const data = stringToHex(`Deposited NFT of token id:(${bigIntTokenId}).`);

    await approve(tokenAddress as Address, bigIntTokenId);

    depositToken({
      args: [tokenAddress as Hex, dAppAddress, bigIntTokenId, "0x", data],
    });
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gradient-to-r
     from-purple-500 to-indigo-600 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-white mb-6">
        Deposit ERC721 Token
      </h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-md 
            borderborder-gray-300 focus:outline-none 
            focus:ring-2 focus:ring-purple-500"
            placeholder="ERC721 Token Address"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-md border
             border-gray-300 focus:outline-none 
             focus:ring-2 focus:ring-purple-500"
            placeholder="Token ID"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-white
           text-purple-600 rounded-md hover:bg-purple-100
            transition-colors duration-300 font-medium"
        >
          {isPending ? "Sending..." : "Send"}
        </button>
      </form>

      {isSuccess && (
        <p className="mt-4 text-green-300 font-bold">
          NFT of Token number: {tokenId} sent!
        </p>
      )}

      {error && (
        <div className="mt-4 text-red-300">
          Error: {(error as BaseError).shortMessage || error.message}
        </div>
      )}
    </div>
  );
};

export default SendERC721;

```

</code></pre>
</TabItem>

<TabItem value="app-ts2" label="src/App.tsx" default>
<pre><code>

```typescript
import Account from "./components/Account";
import SendERC20 from "./components/SendERC20";
import SendERC721 from "./components/SendERC721";
import SendEther from "./components/SendEther";
import SimpleInput from "./components/SimpleInput";

function App() {
  return (
    <>
      <Account />
      <SimpleInput />
      <SendEther />
      <SendERC20 />
      <SendERC721 />
    </>
  );
}

export default App;



```

</code></pre>
</TabItem>

</Tabs>


## Listing Notices, Reports, and Vouchers

All inputs sent to the Cartesi backend are processed by the Cartesi Machine. The Cartesi Machine produces three types of outputs: [Notices](../rollups-apis/backend/notices.md), [Reports](../rollups-apis/backend/reports.md), and [Vouchers](../rollups-apis/backend/vouchers.md).

These outputs can be queried by the frontend using the [GraphQL API](../rollups-apis/graphql/basics.md) on `http://localhost:8080/graphql`.

:::note GraphQL API Reference
Refer to the [GraphQL API documentation](../rollups-apis/graphql/basics.md) for all the queries and mutations available.
:::

Let's move the GraphQL queries to an external file `src/utils/queries.ts` for better organization and reusability.

Then, we will create a shared function `fetchGraphQLData` created in `src/utils/api.ts` to handle the GraphQL request.

<Tabs>

<TabItem value="queries.ts" label="queries.ts" default>
<pre><code>

```typescript
// queries.ts

export const NOTICES_QUERY = `
  query notices {
    notices {
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
  }
`;

export const REPORTS_QUERY = `
  query reports {
    reports {
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
  }
`;

export const VOUCHERS_QUERY = `
  query vouchers {
    vouchers {
      edges {
        node {
          index
          input {
            index
          }
          destination
          payload
        }
      }
    }
  }
`;
```

</code></pre>
</TabItem>

 <TabItem value="src/utils/types.ts" label="src/utils/types.ts">
<pre><code>

```typescript
// types.ts

export type Notice = {
  index: number;
  input: {
    index: number;
  };
  payload: string;
};

export type Report = {
  index: number;
  input: {
    index: number;
  };
  payload: string;
};

export type Voucher = {
  index: number;
  input: {
    index: number;
  };
  destination: string;
  payload: string;
};

export type GraphQLResponse<T> = {
  data: T;
};
```

</code></pre>
</TabItem>

  <TabItem value="src/utils/api.ts" label="src/utils/api.ts">
<pre><code>

```typescript
// api.ts

import axios from 'axios';  
import { GraphQLResponse } from './types';

export const fetchGraphQLData = async <T>(query: string) => {
  const response = await 
  axios.post<GraphQLResponse<T>>('http://localhost:8080/graphql', {
    query,
  });
  return response.data.data;
};
```

</code></pre>
</TabItem>
</Tabs>

Let's have 3 components for Notices, Reports, and Vouchers that queries from the GraphQL API.


<Tabs>

<TabItem value="notices" label="Notices.tsx" default>
<pre><code>

```jsx
import { useEffect, useState } from 'react';
import { fetchGraphQLData } from '../utils/api';
import { Notice } from '../utils/types';
import { NOTICES_QUERY } from '../utils/queries';

const Notices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = 
        await fetchGraphQLData<{ notices: 
        { edges: { node: Notice }[] } }>(NOTICES_QUERY);
        setNotices(data.notices.edges.map(edge => edge.node));
      } catch (err) {
        setError('Error fetching notices.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6
     bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-6">Notices</h2>
      <table className="min-w-full divide-y
       divide-gray-200 bg-gradient-to-r
        from-purple-500 to-indigo-600 text-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Index</th>
            <th className="px-4 py-2">Input Index</th>
            <th className="px-4 py-2">Payload</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((notice, idx) => (
            <tr key={idx} className="hover:bg-purple-700 
            transition-colors duration-300">
              <td className="px-4 py-2">{notice.index}</td>
              <td className="px-4 py-2">{notice.input.index}</td>
              <td className="px-4 py-2">{notice.payload}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Notices;
```

</code></pre>
</TabItem>

  <TabItem value="reports" label="Reports.tsx">
<pre><code>

```jsx
import { useEffect, useState } from 'react';
import { fetchGraphQLData } from '../utils/api';
import { Report } from '../utils/types';
import { REPORTS_QUERY } from '../utils/queries';

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = 
        await fetchGraphQLData<{ reports: 
        { edges: { node: Report }[] } }>(REPORTS_QUERY);
        setReports(data.reports.edges.map(edge => edge.node));
      } catch (err) {
        setError('Error fetching reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6
     bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-6">Reports</h2>
      <table className="min-w-full divide-y
       divide-gray-200 bg-gradient-to-r
        from-purple-500 to-indigo-600 text-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Index</th>
            <th className="px-4 py-2">Input Index</th>
            <th className="px-4 py-2">Payload</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, idx) => (
            <tr key={idx} className="hover:bg-purple-700 
            transition-colors duration-300">
              <td className="px-4 py-2">{report.index}</td>
              <td className="px-4 py-2">{report.input.index}</td>
              <td className="px-4 py-2">{report.payload}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
```

</code></pre>
</TabItem>

<TabItem value="vouchers" label="Vouchers.tsx">
<pre><code>

```jsx
import { useEffect, useState } from 'react';
import { fetchGraphQLData } from '../utils/api';
import { Voucher } from '../utils/types';
import { VOUCHERS_QUERY } from '../utils/queries';

const Vouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = 
        await fetchGraphQLData<{ vouchers: 
        { edges: { node: Voucher }[] } }>(VOUCHERS_QUERY);
        setVouchers(data.vouchers.edges.map(edge => edge.node));
      } catch (err) {
        setError('Error fetching vouchers.');
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6
     bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-6">Vouchers</h2>
      <table className="min-w-full divide-y 
      divide-gray-200 bg-gradient-to-r
       from-purple-500 to-indigo-600 text-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Index</th>
            <th className="px-4 py-2">Input Index</th>
            <th className="px-4 py-2">Destination</th>
            <th className="px-4 py-2">Payload</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher, idx) => (
            <tr key={idx} className="hover:bg-purple-700 
            transition-colors duration-300">
              <td className="px-4 py-2">{voucher.index}</td>
              <td className="px-4 py-2">{voucher.input.index}</td>
              <td className="px-4 py-2">{voucher.destination}</td>
              <td className="px-4 py-2">{voucher.payload}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Vouchers;
```

</code></pre>
</TabItem>
</Tabs>


### Executing vouchers

Vouchers in Cartesi dApps authorize specific on-chain actions, such as token swaps or asset transfers, by encapsulating the details of these actions. 

They are validated and executed on the blockchain using the [`executeVoucher(address _destination, bytes _payload, struct Proof _proof)`](../rollups-apis/json-rpc/application.md#executevoucher) function in the [`CartesiDApp`](../rollups-apis/json-rpc/application.md/) contract, ensuring legitimacy and transparency. 

For example, users might generate vouchers to withdraw assets, which are executed on the base later.

At this stage, you can now interact with the Cartesi backend using the frontend you've built.

