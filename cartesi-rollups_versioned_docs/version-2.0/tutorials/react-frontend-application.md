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

interface CartesiAppsProps {
  onAppSelect?: (appAddress: Address) => void;
}

export function CartesiApps({ onAppSelect }: CartesiAppsProps) {
  const [selectedApp, setSelectedApp] = useState<string>('');
  
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

