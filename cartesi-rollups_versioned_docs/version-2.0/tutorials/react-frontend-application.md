---
id: react-frontend-application
title: Build a React frontend for Cartesi Apps
resources:
  - url: https://github.com/Mugen-Builders/cartesi-frontend-tutorial
    title: Source code for the frontend application
---

# Building a React Frontend for Cartesi Apps

This is a comprehensive guide for building a React frontend that interacts with the deployed Cartesi applications using Cartesi TypeScript packages, wagmi hooks and viem library.

## Installation

The fastest way to get started is using `create-wagmi` to bootstrap a new React project in TypeScript with _wagmi_ already configured:

```bash
pnpm create wagmi@latest my-cartesi-webapp
cd my-cartesi-webapp
```

Install the required Cartesi packages and dependencies:

```bash
# Core Cartesi packages
pnpm add @cartesi/wagmi@2.0.0-alpha.10 @cartesi/viem@2.0.0-alpha.10
```
:::note
This guide has been tested with Cartesi CLI 2.0.0-alpha.11 pre-release.
:::

## Project Structure

```plaintext
src/
├── components/
│ ├── CartesiInput.tsx        # To send inputs
│ ├── CartesiOutputs.tsx      # To read outputs
│ └── CartesiApps.tsx         # To list all applications
├── providers/
│ └── Web3Provider.tsx        # Wagmi and Cartesi providers setup
├── wagmi.ts                  # Wagmi configuration file
├── App.tsx                   # Main application component
└── .env.local                # Environment variables
```

## Core Components

Before we begin writing the core components, make sure to configure _Cannon_ as your local chain in `wagmi.ts` file at the root of the project. This will make sure our web app is ready to interact with locally deployed Cartesi app. 

### 1. Configure the local environment 
Modify the existing `wagmi.ts` file with the code below. We add support for locally running with `cannon` network.
```tsx
import { http, createConfig } from 'wagmi'
import { cannon, mainnet, sepolia } from 'wagmi/chains'
import { coinbaseWallet, injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [cannon, mainnet, sepolia],
  connectors: [
    injected(),
    coinbaseWallet(),
  ],
  transports: {
    [cannon.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
```

:::note 
WalletConnect is removed from the default wagmi setup. You can add it as per your project requirements. For this guide, we're using only Metamask wallet.
:::

Add the deployed Cartesi app address and Cartesi RPC URL to the `.env.local` file.
```
VITE_CARTESI_APP_ADDRESS=<0x_your_app_address>
VITE_CARTESI_RPC_URL=http://localhost:8080/rpc
```


### 2. Setting up Providers

Create `src/providers/Web3Provider.tsx`:

```tsx
import { CartesiProvider } from '@cartesi/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '../wagmi'; 

const queryClient = new QueryClient();

// Local Cartesi node RPC endpoint
const CARTESI_RPC_URL = import.meta.env.VITE_CARTESI_RPC_URL || 'http://localhost:8080/rpc';

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CartesiProvider rpcUrl={CARTESI_RPC_URL}>
          {children}
        </CartesiProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### 3. Sending Inputs to Cartesi Application
The `InputBox` contract is a trustless and permissionless contract that receives arbitrary blobs (called "inputs") from anyone. It is deployed on all supported chains. We will use `@cartesi/viem` library to send an input to the backend via the InputBox contract.

Create `src/components/CartesiInput.tsx`:

```tsx
import { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { stringToHex, type Address } from 'viem';
import { walletActionsL1 } from '@cartesi/viem';

interface CartesiInputProps {
    applicationAddress: Address;
  }

export function CartesiInput({ applicationAddress }: CartesiInputProps) {
const [input, setInput] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [txHash, setTxHash] = useState<string>('');

const { address } = useAccount();
const { data: walletClient } = useWalletClient();

const sendInput = async () => {
    if (!walletClient || !address || !input.trim()) return;
    
    setIsLoading(true);
    setTxHash('');
    
    try {
    // Extend wallet client with Cartesi L1 actions
    const extendedClient = walletClient.extend(walletActionsL1());
    
    // Convert input string to hex
    const payload = stringToHex(input);
    
    // Send input to Cartesi application
    const hash = await extendedClient.addInput({
        account: address,
        application: applicationAddress,
        payload,
        chain: walletClient.chain,
    });
    
    setTxHash(hash);
    setInput('');
    
    console.log('Input sent with transaction hash:', hash);
    } catch (error) {
    console.error('Failed to send input:', error);
    } finally {
    setIsLoading(false);
    }
};

return (
    <div>
    <h3>Send Input</h3>
    
    <div>
        <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your input message..."
        rows={4}
        disabled={isLoading}
        />
        
        <button 
        onClick={sendInput}
        disabled={!address || isLoading || !input.trim()}
        >
        {isLoading ? 'Sending...' : 'Send Input'}
        </button>
    </div>
    
    {txHash && (
        <div>
        <p>✅ Input sent successfully!</p>
        <p>Transaction: <code>{txHash}</code></p>
        </div>
    )}
    </div>
);
}
```

### 3. Reading Outputs from Cartesi Application
Cartesi rollups node provides an RPC endpoint to fetch the outputs generated by an app. The component `CartesiOutputs` as shown below will list `Notices`, `Vouchers`, `Delegated Vouchers` and `Reports` on the UI. 

Create `src/components/CartesiOutputs.tsx`:

```tsx
import { useOutputs, useReports } from '@cartesi/wagmi';
import { hexToString, type Address } from 'viem';

interface CartesiOutputsProps {
  applicationAddress: Address;
  inputIndex?: number;
}

export function CartesiOutputs({ applicationAddress, inputIndex }: CartesiOutputsProps) {
  const { 
    data: outputsData, 
    isLoading: outputsLoading, 
    error: outputsError, 
    refetch: refetchOutputs 
  } = useOutputs({
    application: applicationAddress,
    inputIndex: inputIndex ? BigInt(inputIndex) : undefined,
    enabled: !!applicationAddress,
  });

  const {
    data: reportsData,
    isLoading: reportsLoading,
    error: reportsError,
    refetch: refetchReports
  } = useReports({
    application: applicationAddress,
    inputIndex: inputIndex ? BigInt(inputIndex) : undefined,
    enabled: !!applicationAddress,
  });

  // Add logging for debugging
  console.log('Reports Data:', reportsData);
  console.log('Outputs Data:', outputsData);

  const formatOutput = (output: any) => {
    const { decodedData, index, inputIndex: outputInputIndex, epochIndex } = output;
    
    // Convert BigInt to number for consistent handling
    const indexNumber = typeof index === 'bigint' ? Number(index) : index;
    const inputIndexNumber = typeof outputInputIndex === 'bigint' ? Number(outputInputIndex) : outputInputIndex;
    
    if (!decodedData) {
      return {
        type: 'Unknown',
        content: output.rawData || 'No data available',
        index: indexNumber,
        inputIndex: inputIndexNumber
      };
    }
    
    switch (decodedData.type) {
      case 'Notice':
        return {
          type: 'Notice',
          content: decodedData.payload ? hexToString(decodedData.payload) : 'Empty payload',
          index: indexNumber,
          inputIndex: inputIndexNumber
        };
        
      case 'Voucher':
        return {
          type: 'Voucher',
          content: `To: ${decodedData.destination} | Value: ${decodedData.value?.toString() || 'N/A'} | Payload: ${decodedData.payload || 'Empty'}`,
          index: indexNumber,
          inputIndex: inputIndexNumber
        };
        
      case 'DelegateCallVoucher':
        return {
          type: 'Delegate Call',
          content: `To: ${decodedData.destination} | Payload: ${decodedData.payload || 'Empty'}`,
          index: indexNumber,
          inputIndex: inputIndexNumber
        };
        
      default:
        return {
          type: decodedData.type,
          content: 'Unknown format',
          index: indexNumber,
          inputIndex: inputIndexNumber
        };
    }
  };

  const formatReport = (report: any) => {
    console.log('Processing report:', report);
    
    const { index, rawData, inputIndex, createdAt } = report;
    
    // Convert BigInt to number for consistent handling
    const indexNumber = typeof index === 'bigint' ? Number(index) : index;
    const inputIndexNumber = typeof inputIndex === 'bigint' ? Number(inputIndex) : inputIndex;
    
    let content = 'Empty report';
    
    if (rawData) {
      try {
        console.log('Attempting to convert rawData:', rawData);
        content = hexToString(rawData);
        console.log('Converted content:', content);
      } catch (error) {
        console.log('Error converting rawData:', error);
        content = `Raw: ${rawData}`;
      }
    } else {
      console.log('No rawData found in report');
    }
    
    const formattedReport = {
      type: 'Report',
      content,
      index: indexNumber,
      inputIndex: inputIndexNumber,
      createdAt: createdAt ? new Date(createdAt).toLocaleString() : 'Unknown'
    };
    
    return formattedReport;
  };

  if (outputsLoading || reportsLoading) return <div>Loading...</div>;
  if (outputsError) return <div>Error loading outputs: {outputsError.message}</div>;
  if (reportsError) return <div>Error loading reports: {reportsError.message}</div>;

  // Combine and sort all outputs and reports
  const allOutputs = [
    ...(outputsData?.data?.map(formatOutput) || []),
    ...(reportsData?.data?.map(formatReport) || [])
  ].sort((a, b) => {
    // Primary sort: by inputIndex (descending - latest input first)
    const aInputIndex = Number(a.inputIndex);
    const bInputIndex = Number(b.inputIndex);
    
    if (aInputIndex !== bInputIndex) {
      return bInputIndex - aInputIndex;
    }
    
    // Secondary sort: by output index (descending - latest output first within same input)
    const aIndex = Number(a.index);
    const bIndex = Number(b.index);
    return bIndex - aIndex;
  });

  console.log('All combined outputs:', allOutputs);

  return (
    <div>
      <div>
        <h2>Application Outputs</h2>
        <button onClick={() => {
          refetchOutputs();
          refetchReports();
        }}>🔄 Refresh</button>
      </div>
      
      {allOutputs.length === 0 ? (
        <p>No outputs found for this application.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', borderBottom: '2px solid #ddd' }}>Input Index</th>
              <th style={{ padding: '8px', borderBottom: '2px solid #ddd' }}>Index</th>
              <th style={{ padding: '8px', borderBottom: '2px solid #ddd' }}>Type</th>
              <th style={{ padding: '8px', borderBottom: '2px solid #ddd' }}>Content</th>
            </tr>
          </thead>
          <tbody>
            {allOutputs.map((output, idx) => (
              <tr key={`${output.type}-${output.index}-${idx}`}>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {output.inputIndex !== undefined ? `#${output.inputIndex}` : 'N/A'}
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>#{output.index}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {output.type === 'Notice' && '📢 Notice'}
                  {output.type === 'Voucher' && '🎫 Voucher'}
                  {output.type === 'Delegate Call' && '🎫 Delegate Call'}
                  {output.type === 'Report' && '📊 Report'}
                  {output.type === 'Unknown' && '❓ Unknown'}
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{output.content}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <div style={{ marginTop: '16px' }}>
        <p>
          Showing {allOutputs.length} outputs
        </p>
      </div>
    </div>
  );
}
```

## Complete Example

Stitch the components together inside the App.

Create `src/App.tsx`:

```tsx
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Web3Provider } from './providers/Web3Provider';
import { CartesiInput } from './components/CartesiInput';
import { CartesiOutputs } from './components/CartesiOutputs';
import { type Address } from 'viem';

// Get application address from environment variable
const CARTESI_APP_ADDRESS = import.meta.env.VITE_CARTESI_APP_ADDRESS as Address;

function CartesiApp() {
  const { isConnected, address } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div>
      <header>
        <h1>🐧 Cartesi App Frontend</h1>
        
        {isConnected ? (
          <div>
            <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            <button onClick={() => disconnect()}>Disconnect</button>
          </div>
        ) : (
          <div>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
              >
                {connector.name}
              </button>
            ))}
          </div>
        )}
      </header>

      {isConnected ? (
        <main>
          <section>
            <p>App Address: {CARTESI_APP_ADDRESS}</p>
            <CartesiInput applicationAddress={CARTESI_APP_ADDRESS} />
          </section>
          {/* Outputs Section */}
          <section>
            <CartesiOutputs applicationAddress={CARTESI_APP_ADDRESS} />
          </section>
        </main>
      ) : (
        <div>
          <p>Connect your wallet to interact with Cartesi application.</p>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Web3Provider>
      <CartesiApp />
    </Web3Provider>
  );
}

export default App
```
You're good to run the application and test sending inputs and list the corresponding outputs on the web UI.

Run the web application locally: 
```
pnpm dev
```


## Bridging of Assets
This section has other relevant components that can be plugged to the App as per the requirements.

### Depositing Ether
In this component, we use `depositEther()` function to bridge Ether from the base layer to the Cartesi rollups application.

Create a `DepositEther.tsx` file in `src/components/` folder.

```tsx
import { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { parseEther, toHex, type Address } from 'viem';
import { walletActionsL1 } from '@cartesi/viem';

interface DepositEtherProps {
  applicationAddress: Address;
}

export function DepositEther({ applicationAddress }: DepositEtherProps) {
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>('');

  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const handleDeposit = async () => {
    if (!walletClient || !address || !amount || parseFloat(amount) <= 0) return;

    setIsLoading(true);
    setTxHash('');

    try {
      const valueInWei = parseEther(amount);
      const data = toHex(`Deposited ${amount} ether`);

      // Extend wallet client with Cartesi L1 actions
      const cartesiWalletClient = walletClient.extend(walletActionsL1());

      const hash = await cartesiWalletClient.depositEther({
        application: applicationAddress,
        value: valueInWei,
        account: address,
        execLayerData: data,
        chain: walletClient.chain,
      });

      setTxHash(hash);
      setAmount('');

      console.log('Deposit sent with transaction hash:', hash);
    } catch (error) {
      console.error('Failed to deposit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3>Deposit Ether</h3>
      
      <div>
        <label>Amount (ETH):</label>
        <input
          type="number"
          step="0.01"
          placeholder="0.1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <button
        onClick={handleDeposit}
        disabled={!address || isLoading || !amount || parseFloat(amount) <= 0}
      >
        {isLoading ? 'Depositing...' : 'Deposit'}
      </button>

      {txHash && (
        <div>
          <p>✅ Deposit sent successfully!</p>
          <p>Transaction: <code>{txHash}</code></p>
        </div>
      )}
    </div>
  );
}
```

## Advanced Usage
### Waiting for Input Processing

```tsx
import { useWaitForInput } from '@cartesi/wagmi';

function InputTracker({ applicationAddress, inputIndex }: { 
  applicationAddress: string; 
  inputIndex: number; 
}) {
  const { data: input, isLoading } = useWaitForInput({
    application: applicationAddress,
    inputIndex,
    enabled: !!applicationAddress && inputIndex !== undefined,
  });

  if (isLoading) return <div>⏳ Waiting for input to be processed...</div>;
  
  return (
    <div>
      ✅ Input #{inputIndex} processed with status: {input?.status}
    </div>
  );
}
```

### Using Low-level RPC Client

```tsx
import { createClient } from '@cartesi/rpc';

const rpcClient = createClient({
  uri: 'http://localhost:8080/rpc',
});

// Use RPC client directly
const outputs = await rpcClient.request('cartesi_listOutputs', {
  application: '0x...',
  limit: 10,
  offset: 0,
});
```

### Listing all available applications
Create `src/components/CartesiApps.ts`:

```tsx
import { useApplications } from '@cartesi/wagmi';
import { useState, useEffect } from 'react';
import { type Address } from 'viem';


The configuration sets up the Wagmi CLI to generate TypeScript hooks for ERC20 and ERC721 contracts, as well as for any contracts in the specified Cartesi Rollups ABI directory, i.e `src/hooks/generated`.

To generate, run:

```bash
npx wagmi generate
```

## Sending a generic input

The [`InputBox`](../api-reference/contracts/input-box.md) contract is a trustless and permissionless contract that receives arbitrary blobs (called "inputs") from anyone.

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

It uses the `writeContractAsync` function to send the input to the [`addInput(address _dapp, bytes _input)`](../api-reference/contracts/input-box.md/#addinput) function of the  `InputBox`. 

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

The [`EtherPortal`](../api-reference/contracts/portals/EtherPortal.md) contract is a pre-deployed smart contract that allows users to deposit Ether to the Cartesi backend.


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

The [`ERC20Portal`](../api-reference/contracts/portals/ERC20Portal.md) contract is a pre-deployed smart contract that allows users to deposit ERC20 tokens to the Cartesi backend.


This implementation will be similar to the [depositing Ether](#depositing-ether), but with a few changes to handle ERC20 token transactions.

Here are the key differences in depositing ERC20 tokens compared to Ether:

  - ERC20 deposits require both the **ERC20 token address** and **amounts**.

  - The `submit` function first calls [`approve()`](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20#ERC20-approve-address-uint256-) before calling `depositERC20Tokens` on the ERC20Portal contract.

  :::note ERC Token Approval
  For [**ERC20, ERC721, and ERC1155 token standards**](https://ethereum.org/en/developers/docs/standards/tokens/), an approval step is need. This ensures you grant explicit permission for a contract (like the Portals) to transfer tokens on your behalf. 
  
  const { 
    data: applicationsData, 
    isLoading: isLoadingApps,
    error: appsError 
  } = useApplications({});

  // Auto-select first application if available
  useEffect(() => {
    if (applicationsData?.data?.length && !selectedApp) {
      const firstApp = applicationsData.data[0].applicationAddress;
      setSelectedApp(firstApp);
      onAppSelect?.(firstApp as Address);
    }
  }, [applicationsData, selectedApp, onAppSelect]);

  const handleAppChange = (appAddress: string) => {
    setSelectedApp(appAddress);
    onAppSelect?.(appAddress as Address);
  };

  if (isLoadingApps) return <div>Loading applications...</div>;
  if (appsError) return <div>Error loading applications: {appsError.message}</div>;

  return (
    <div>
      <h2>Cartesi Applications</h2>
      {applicationsData?.data?.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div>
          <label>Select Application:</label>
          <select 
            value={selectedApp} 
            onChange={(e) => handleAppChange(e.target.value)}
          >
            {applicationsData?.data?.map((app) => (
              <option key={app.applicationAddress} value={app.applicationAddress}>
                {app.applicationAddress}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
```

</code></pre>
</TabItem>

</Tabs>


## Depositing ERC721 Tokens (NFTs)

The [`ERC721Portal`](../api-reference/contracts/portals/ERC721Portal.md) contract is a pre-deployed smart contract that allows users to deposit ERC721 tokens to the Cartesi backend.

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

All inputs sent to the Cartesi backend are processed by the Cartesi Machine. The Cartesi Machine produces three types of outputs: [Notices](../api-reference/backend/notices.md), [Reports](../api-reference/backend/reports.md), and [Vouchers](../api-reference/backend/vouchers.md).

These outputs can be queried by the frontend using the [GraphQL API](../api-reference/graphql/basics.md) on `http://localhost:8080/graphql`.

:::note GraphQL API Reference
Refer to the [GraphQL API documentation](../api-reference/graphql/basics.md) for all the queries and mutations available.
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

They are validated and executed on the blockchain using the [`executeVoucher(address _destination, bytes _payload, struct Proof _proof)`](../api-reference/contracts/application.md#executevoucher) function in the [`CartesiDApp`](../api-reference/json-rpc/application.md/) contract, ensuring legitimacy and transparency. 

For example, users might generate vouchers to withdraw assets, which are executed on the base later.

At this stage, you can now interact with the Cartesi backend using the frontend you've built.

