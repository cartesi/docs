> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: react-frontend-application
title: Build a React frontend for Cartesi Apps
---

# Building a React Frontend for Cartesi Apps

This guide builds a React frontend that talks to a Cartesi application with the Cartesi TypeScript packages, [wagmi](https://wagmi.sh) and [viem](https://viem.sh):

- `@cartesi/react` provides the `CartesiProvider` and the React hooks that read the node's JSON-RPC API (`useOutputs`, `useReports`, `useWaitForInput`, `useApplications`, and more). It was previously published as `@cartesi/wagmi`.
- `@cartesi/client` provides the node client, the contract ABIs and addresses (`@cartesi/client/abi`), and helpers such as `getInputsAdded` and `toOutputArgs`. It was previously published as `@cartesi/viem`.

Sending inputs, depositing assets and executing vouchers are plain contract calls: you make them with wagmi's `useWriteContract` and the ABIs and addresses exported by `@cartesi/client/abi`. The packages no longer ship `walletActionsL1` / `addInput` / `depositEther` helpers.

:::note
This guide has been tested with Cartesi CLI 2.0.0-alpha.42 (rollups-node v2.0.0-alpha.14, rollups-contracts v3.0.0-alpha.10), `@cartesi/react` 2.0.0-alpha.45 and `@cartesi/client` 2.0.0-alpha.41.

Both Cartesi packages are published under the `alpha` tag, and their `latest` tag points to `0.0.0`. Always install the exact versions shown below.
:::

## Prerequisites

- Node.js and pnpm.
- A Cartesi application running locally with the Cartesi CLI. Start it with a short epoch so that vouchers become executable within seconds (the default epoch is 720 blocks, about 24 minutes):

  ```bash
  cartesi build
  cartesi run --epoch-length 10
  ```

  `cartesi run` prints the local endpoints and the application address. With the default port (6751):

  | Service | URL |
  | --- | --- |
  | Local chain (anvil, chain id 31337) | `http://127.0.0.1:6751/anvil` |
  | Cartesi node JSON-RPC | `http://127.0.0.1:6751/rpc` |
  | Inspect | `http://127.0.0.1:6751/inspect/<app-name-or-address>` |

  The application address is the one in the line `<app-name> contract deployed at 0x...`.

## Installation

Bootstrap a React + TypeScript project with `create-wagmi`:

```bash
pnpm create wagmi@2.0.19 my-cartesi-webapp --template vite-react
cd my-cartesi-webapp
```

The template lists every dependency as `latest`. Install the Cartesi packages and pin all dependencies to the versions this guide was tested with:

```bash
pnpm add --save-exact react@19.3.1 react-dom@19.3.1 wagmi@3.7.11 viem@2.57.20 @tanstack/react-query@5.107.1 @cartesi/react@2.0.0-alpha.45 @cartesi/client@2.0.0-alpha.41
pnpm add --save-dev --save-exact typescript@7.0.2 vite@8.3.8 @vitejs/plugin-react@6.3.0 @types/react@19.3.0 @types/react-dom@19.3.0 @wagmi/cli@2.10.1
```

`@cartesi/client` is installed directly (and not only as a dependency of `@cartesi/react`) because the components import its ABIs and helpers.

## Project Structure

```plaintext
my-cartesi-webapp/
├── .env.local                  # Environment variables (project root, next to package.json)
└── src/
    ├── components/
    │   ├── CartesiApps.tsx     # To list all applications
    │   ├── CartesiInput.tsx    # To send inputs
    │   ├── CartesiInspect.tsx  # To inspect the application state
    │   ├── CartesiOutputs.tsx  # To read outputs and reports
    │   ├── CartesiStatus.tsx   # Application, epochs and inputs
    │   ├── DepositERC20.tsx    # To deposit ERC-20 tokens
    │   ├── DepositEther.tsx    # To deposit Ether
    │   ├── ExecuteVoucher.tsx  # To execute a voucher on the base layer
    │   └── InputTracker.tsx    # To wait for an input to be processed
    ├── providers/
    │   └── Web3Provider.tsx    # Wagmi, React Query and Cartesi providers
    ├── App.tsx                 # Main application component
    ├── main.tsx                # Entry point
    ├── vite-env.d.ts           # Types of the environment variables
    └── wagmi.ts                # Wagmi configuration file
```

## Core Components

### 1. Configure the local environment

Vite loads environment files from the project root, so create `.env.local` next to `package.json` (not inside `src/`). Replace the application address with the one printed by `cartesi run`, and change the port if you started the node with `--port`:

```bash title=".env.local"
VITE_ANVIL_RPC_URL=http://127.0.0.1:6751/anvil
VITE_CARTESI_RPC_URL=http://127.0.0.1:6751/rpc
VITE_CARTESI_INSPECT_URL=http://127.0.0.1:6751/inspect
VITE_CARTESI_APP_ADDRESS=<0x_your_app_address>
VITE_DEVNET_ACCOUNT=0xa0Ee7A142d267C1f36714E4a8F75612F20a79720
```

`VITE_DEVNET_ACCOUNT` is one of the accounts the devnet funds from the default `test test ... junk` mnemonic (index 9). Do not use the first account (index 0): the local node signs its claims with it.

Restart `pnpm dev` whenever you change `.env.local`. Declare the variables in `src/vite-env.d.ts` so that TypeScript knows them:

```ts title="src/vite-env.d.ts"
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANVIL_RPC_URL: string
  readonly VITE_CARTESI_RPC_URL: string
  readonly VITE_CARTESI_INSPECT_URL: string
  readonly VITE_CARTESI_APP_ADDRESS: `0x${string}`
  readonly VITE_DEVNET_ACCOUNT: `0x${string}`
}
```

Replace `src/wagmi.ts` with a configuration for the local devnet (chain id 31337):

```ts title="src/wagmi.ts"
import { defineChain } from 'viem'
import { createConfig, http, injected, mock } from 'wagmi'

// The local chain started by `cartesi run`
export const cartesiDevnet = defineChain({
  id: 31337,
  name: 'Cartesi Devnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: [import.meta.env.VITE_ANVIL_RPC_URL] } },
  testnet: true,
})

export const config = createConfig({
  chains: [cartesiDevnet],
  connectors: [
    // Browser wallets such as MetaMask
    injected(),
    // Local devnet only: acts as VITE_DEVNET_ACCOUNT, which the devnet keeps
    // unlocked, so no browser wallet is needed. Remove it for real networks.
    mock({ accounts: [import.meta.env.VITE_DEVNET_ACCOUNT] }),
  ],
  transports: {
    [cartesiDevnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
```

:::note
To use MetaMask instead of the devnet connector, add a network with chain id `31337` and RPC URL `http://127.0.0.1:6751/anvil`, import the private key of a devnet account other than account 0, and connect with the **Injected** button.
:::

### 2. Setting up Providers

Create `src/providers/Web3Provider.tsx`. `CartesiProvider` creates the Cartesi node client that every Cartesi hook uses, and it must be inside the `QueryClientProvider`:

```tsx title="src/providers/Web3Provider.tsx"
import type { ReactNode } from 'react'
import { CartesiProvider } from '@cartesi/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '../wagmi'

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CartesiProvider rpcUrl={import.meta.env.VITE_CARTESI_RPC_URL}>
          {children}
        </CartesiProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

Replace `src/main.tsx` so that the whole app is wrapped by `Web3Provider` (the template's own `WagmiProvider` and `QueryClientProvider` move into it):

```tsx title="src/main.tsx"
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import { Web3Provider } from './providers/Web3Provider.tsx'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Web3Provider>
      <App />
    </Web3Provider>
  </React.StrictMode>,
)
```

### 3. Sending Inputs to Cartesi Application

The `InputBox` contract receives arbitrary blobs (called "inputs") from anyone and is deployed at the same address on all supported chains. Call its `addInput` function with wagmi's `useWriteContract`, using the ABI and address exported by `@cartesi/client/abi`. The `InputAdded` event of the transaction carries the index of the new input, which `getInputsAdded` extracts from the receipt.

Create `src/components/InputTracker.tsx`. `useWaitForInput` polls the node until the input is processed and returns it with its status (`ACCEPTED`, `REJECTED`, `EXCEPTION`, ...). Input indexes are `bigint`s:

```tsx title="src/components/InputTracker.tsx"
import { useWaitForInput } from '@cartesi/react'
import type { Address } from 'viem'

interface InputTrackerProps {
  applicationAddress: Address
  inputIndex: bigint
}

export function InputTracker({ applicationAddress, inputIndex }: InputTrackerProps) {
  const { data: input, isLoading, error } = useWaitForInput({
    application: applicationAddress,
    inputIndex,
  })

  if (error) return <p>Failed to wait for input #{inputIndex.toString()}: {error.message}</p>
  if (isLoading) return <p>Waiting for input #{inputIndex.toString()} to be processed...</p>

  return (
    <p>
      Input #{inputIndex.toString()} processed with status: <strong>{input?.status}</strong>
    </p>
  )
}
```

Create `src/components/CartesiInput.tsx`:

```tsx title="src/components/CartesiInput.tsx"
import { useState } from 'react'
import { stringToHex, type Address } from 'viem'
import { useConnection, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { getInputsAdded } from '@cartesi/client'
import { inputBoxAbi, inputBoxAddress } from '@cartesi/client/abi'
import { InputTracker } from './InputTracker'

interface CartesiInputProps {
  applicationAddress: Address
}

export function CartesiInput({ applicationAddress }: CartesiInputProps) {
  const [input, setInput] = useState('')
  const { address } = useConnection()
  const { mutate: writeContract, data: hash, isPending, error } = useWriteContract()
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  // index of the input added by the transaction
  const inputIndex = receipt ? getInputsAdded(receipt)[0]?.index : undefined

  const sendInput = () => {
    writeContract(
      {
        address: inputBoxAddress,
        abi: inputBoxAbi,
        functionName: 'addInput',
        args: [applicationAddress, stringToHex(input)],
      },
      { onSuccess: () => setInput('') },
    )
  }

  return (
    <div>
      <h3>Send Input</h3>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your input message..."
        rows={4}
        disabled={isPending}
      />
      <button onClick={sendInput} disabled={!address || isPending || !input.trim()}>
        {isPending ? 'Sending...' : 'Send Input'}
      </button>

      {error && <p>Failed to send input: {error.message}</p>}
      {hash && <p>Transaction: <code>{hash}</code>{isConfirming && ' (confirming...)'}</p>}
      {inputIndex !== undefined && (
        <InputTracker applicationAddress={applicationAddress} inputIndex={inputIndex} />
      )}
    </div>
  )
}
```

:::tip
`@cartesi/react` also exports hooks generated for every Cartesi contract, with the ABI and address already set. For example, `useWriteInputBoxAddInput()` returns a `mutate` that only needs `{ args: [applicationAddress, payload] }`, and `useWriteEtherPortalDepositEther()` does the same for Ether deposits.
:::

### 4. Reading Outputs from Cartesi Application

The Cartesi node exposes a JSON-RPC API to fetch the outputs (notices, vouchers and DELEGATECALL vouchers) and reports generated by an application. `useOutputs` and `useReports` return `{ data, pagination }`; each output has a `decodedData` field whose `type` is `Notice`, `Voucher` or `DelegateCallVoucher`. Indexes are `bigint`s and `createdAt` is a `Date`.

A voucher can only be executed after the claim of its epoch is accepted on the base layer. The node returns the output's proof (`outputHashesSiblings`) as soon as it computes the claim, before the claim is accepted, so the component below also checks the epoch's status with `useEpoch` and enables execution only at `CLAIM_ACCEPTED`. `toOutputArgs` turns the output into the arguments of the application contract's `executeOutput` function. Create `src/components/ExecuteVoucher.tsx`:

```tsx title="src/components/ExecuteVoucher.tsx"
import { useEffect } from 'react'
import type { Address } from 'viem'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useEpoch, useOutput } from '@cartesi/react'
import { toOutputArgs } from '@cartesi/client'
import { iApplicationAbi } from '@cartesi/client/abi'

interface ExecuteVoucherProps {
  applicationAddress: Address
  outputIndex: bigint
}

export function ExecuteVoucher({ applicationAddress, outputIndex }: ExecuteVoucherProps) {
  const { data: output, refetch } = useOutput({
    application: applicationAddress,
    outputIndex,
    refetchInterval: 5000,
  })
  // The node returns the proof as soon as it computes the claim, but the voucher
  // can only be executed once the claim of its epoch has been accepted on chain.
  const { data: epoch } = useEpoch({
    application: applicationAddress,
    epochIndex: output?.epochIndex,
    enabled: output !== undefined,
    refetchInterval: 5000,
  })
  const { mutate: writeContract, data: hash, isPending, error: writeError } = useWriteContract()
  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError, // set when the transaction reverts
  } = useWaitForTransactionReceipt({ hash })
  const error = writeError ?? receiptError

  useEffect(() => {
    if (isSuccess) refetch()
  }, [isSuccess, refetch])

  if (!output) return null
  if (output.executionTransactionHash) {
    return <span>Executed in {output.executionTransactionHash.slice(0, 10)}...</span>
  }
  if (isSuccess) return <span>Executed, waiting for the node...</span>
  if (!output.outputHashesSiblings || epoch?.status !== 'CLAIM_ACCEPTED') {
    return <span>Waiting for the epoch's claim to be accepted...</span>
  }

  const execute = () => {
    writeContract({
      address: applicationAddress,
      abi: iApplicationAbi,
      functionName: 'executeOutput',
      args: toOutputArgs(output),
    })
  }

  return (
    <span>
      <button onClick={execute} disabled={isPending || isConfirming}>
        {isPending || isConfirming ? 'Executing...' : 'Execute'}
      </button>
      {error && <span> Failed: {error.message.split('\n')[0]}</span>}
    </span>
  )
}
```

Create `src/components/CartesiOutputs.tsx`. It lists notices, vouchers, DELEGATECALL vouchers and reports, newest first, and refreshes every five seconds:

```tsx title="src/components/CartesiOutputs.tsx"
import { useOutputs, useReports } from '@cartesi/react'
import type { Output, Report } from '@cartesi/client'
import { formatEther, hexToString, type Address } from 'viem'
import { ExecuteVoucher } from './ExecuteVoucher'

interface CartesiOutputsProps {
  applicationAddress: Address
  inputIndex?: bigint
}

interface Row {
  key: string
  type: string
  inputIndex: bigint
  index: bigint
  content: string
  voucherIndex?: bigint
}

const outputRow = (output: Output): Row => {
  const row = { key: `output-${output.index}`, inputIndex: output.inputIndex, index: output.index }
  const decoded = output.decodedData
  switch (decoded?.type) {
    case 'Notice':
      return { ...row, type: 'Notice', content: hexToString(decoded.payload) }
    case 'Voucher':
      return {
        ...row,
        type: 'Voucher',
        content: `To: ${decoded.destination} | Value: ${formatEther(decoded.value)} ETH | Payload: ${decoded.payload}`,
        voucherIndex: output.index,
      }
    case 'DelegateCallVoucher':
      return {
        ...row,
        type: 'Delegate Call Voucher',
        content: `To: ${decoded.destination} | Payload: ${decoded.payload}`,
        voucherIndex: output.index,
      }
    default:
      return { ...row, type: 'Unknown', content: output.rawData }
  }
}

const reportRow = (report: Report): Row => ({
  key: `report-${report.index}`,
  type: 'Report',
  inputIndex: report.inputIndex,
  index: report.index,
  content: `${hexToString(report.rawData)} (${report.createdAt.toLocaleString()})`,
})

export function CartesiOutputs({ applicationAddress, inputIndex }: CartesiOutputsProps) {
  const outputs = useOutputs({
    application: applicationAddress,
    inputIndex,
    descending: true,
    refetchInterval: 5000,
  })
  const reports = useReports({
    application: applicationAddress,
    inputIndex,
    descending: true,
    refetchInterval: 5000,
  })

  if (outputs.isLoading || reports.isLoading) return <div>Loading...</div>
  if (outputs.error) return <div>Error loading outputs: {outputs.error.message}</div>
  if (reports.error) return <div>Error loading reports: {reports.error.message}</div>

  // newest input first, then newest output/report first
  const rows = [
    ...(outputs.data?.data.map(outputRow) ?? []),
    ...(reports.data?.data.map(reportRow) ?? []),
  ].sort((a, b) =>
    a.inputIndex !== b.inputIndex
      ? Number(b.inputIndex - a.inputIndex)
      : Number(b.index - a.index),
  )

  const cell = { padding: '8px', borderBottom: '1px solid #ddd' }

  return (
    <div>
      <h2>Application Outputs</h2>
      <button onClick={() => { outputs.refetch(); reports.refetch() }}>Refresh</button>

      {rows.length === 0 ? (
        <p>No outputs found for this application.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={cell}>Input Index</th>
              <th style={cell}>Index</th>
              <th style={cell}>Type</th>
              <th style={cell}>Content</th>
              <th style={cell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <td style={cell}>#{row.inputIndex.toString()}</td>
                <td style={cell}>#{row.index.toString()}</td>
                <td style={cell}>{row.type}</td>
                <td style={cell}>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{row.content}</pre>
                </td>
                <td style={cell}>
                  {row.voucherIndex !== undefined && (
                    <ExecuteVoucher applicationAddress={applicationAddress} outputIndex={row.voucherIndex} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p>
        Showing {outputs.data?.data.length ?? 0} of {outputs.data?.pagination.totalCount ?? 0} outputs
        and {reports.data?.data.length ?? 0} of {reports.data?.pagination.totalCount ?? 0} reports
      </p>
    </div>
  )
}
```

The `Execute` button uses the connected wallet to send the transaction. A voucher can be executed only once; executing it again reverts.

### 5. Application status

Create `src/components/CartesiStatus.tsx`. It shows the application (`useApplication`), the number of processed inputs (`useProcessedInputCount`), and the latest epochs (`useEpochs`) and inputs (`useInputs`):

```tsx title="src/components/CartesiStatus.tsx"
import { useApplication, useEpochs, useInputs, useProcessedInputCount } from '@cartesi/react'
import type { Address } from 'viem'

interface CartesiStatusProps {
  applicationAddress: Address
}

export function CartesiStatus({ applicationAddress }: CartesiStatusProps) {
  const { data: application, error } = useApplication({ application: applicationAddress })
  const { data: processedInputs } = useProcessedInputCount({
    application: applicationAddress,
    refetchInterval: 5000,
  })
  const { data: epochs } = useEpochs({
    application: applicationAddress,
    descending: true,
    limit: 5,
    refetchInterval: 5000,
  })
  const { data: inputs } = useInputs({
    application: applicationAddress,
    descending: true,
    limit: 5,
    refetchInterval: 5000,
  })

  if (error) return <p>Error loading application: {error.message}</p>
  if (!application) return <p>Loading application...</p>

  return (
    <div>
      <h2>Application {application.name}</h2>
      <p>
        Status: {application.status} | Consensus: {application.consensusType} | Epoch length:{' '}
        {application.epochLength.toString()} blocks | Processed inputs: {processedInputs?.toString()}
      </p>
      <h3>Latest epochs</h3>
      <ul>
        {epochs?.data.map((epoch) => (
          <li key={epoch.index.toString()}>
            Epoch {epoch.index.toString()} (blocks {epoch.firstBlock.toString()}-{epoch.lastBlock.toString()}): {epoch.status}
          </li>
        ))}
      </ul>
      <h3>Latest inputs</h3>
      <ul>
        {inputs?.data.map((input) => (
          <li key={input.index.toString()}>
            Input #{input.index.toString()} from {input.decodedData?.sender}: {input.status}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Complete Example

Stitch the components together inside the App. The deposit, inspect and application list components are created in the next sections; create them before running the app.

Replace `src/App.tsx`:

```tsx title="src/App.tsx"
import { useState } from 'react'
import { useConnect, useConnection, useConnectors, useDisconnect } from 'wagmi'
import { getAddress, type Address } from 'viem'
import { CartesiApps } from './components/CartesiApps'
import { CartesiInput } from './components/CartesiInput'
import { CartesiInspect } from './components/CartesiInspect'
import { CartesiOutputs } from './components/CartesiOutputs'
import { CartesiStatus } from './components/CartesiStatus'
import { DepositERC20 } from './components/DepositERC20'
import { DepositEther } from './components/DepositEther'

function App() {
  // checksummed, as the node returns it, so that the selector below matches it
  const [applicationAddress, setApplicationAddress] = useState<Address>(
    getAddress(import.meta.env.VITE_CARTESI_APP_ADDRESS),
  )
  const { isConnected, address } = useConnection()
  const connectors = useConnectors()
  const { mutate: connect } = useConnect()
  const { mutate: disconnect } = useDisconnect()

  return (
    <div>
      <header>
        <h1>Cartesi App Frontend</h1>

        {isConnected ? (
          <div>
            <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            <button onClick={() => disconnect()}>Disconnect</button>
          </div>
        ) : (
          <div>
            {connectors.map((connector) => (
              <button key={connector.uid} onClick={() => connect({ connector })}>
                {connector.name}
              </button>
            ))}
          </div>
        )}
      </header>

      <CartesiApps selected={applicationAddress} onAppSelect={setApplicationAddress} />

      {isConnected ? (
        <main>
          <section>
            <p>App Address: {applicationAddress}</p>
            <CartesiInput applicationAddress={applicationAddress} />
            <DepositEther applicationAddress={applicationAddress} />
            <DepositERC20 applicationAddress={applicationAddress} />
            <CartesiInspect applicationAddress={applicationAddress} />
          </section>
          <section>
            <CartesiStatus applicationAddress={applicationAddress} />
          </section>
          <section>
            <CartesiOutputs applicationAddress={applicationAddress} />
          </section>
        </main>
      ) : (
        <p>Connect your wallet to interact with the Cartesi application.</p>
      )}
    </div>
  )
}

export default App
```

## Bridging of Assets

Assets enter a Cartesi application through the portal contracts, which add an input with the deposit details to the application. The portal ABIs and addresses are exported by `@cartesi/client/abi`: `etherPortalAbi`, `erc20PortalAbi`, `erc721PortalAbi`, `erc1155SinglePortalAbi` and `erc1155BatchPortalAbi`, each with its `...Address`. In rollups-contracts v3 the deposit functions are `depositEther`, `depositErc20Tokens`, `depositErc721Token`, `depositSingleErc1155Token` and `depositBatchErc1155Token`.

### Depositing Ether

Create `src/components/DepositEther.tsx`. It calls `depositEther` on the Ether portal, sending the amount as the transaction value:

```tsx title="src/components/DepositEther.tsx"
import { useState } from 'react'
import { parseEther, stringToHex, type Address } from 'viem'
import { useConnection, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { etherPortalAbi, etherPortalAddress } from '@cartesi/client/abi'

interface DepositEtherProps {
  applicationAddress: Address
}

export function DepositEther({ applicationAddress }: DepositEtherProps) {
  const [amount, setAmount] = useState('')
  const { address } = useConnection()
  const { mutate: writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleDeposit = () => {
    writeContract(
      {
        address: etherPortalAddress,
        abi: etherPortalAbi,
        functionName: 'depositEther',
        args: [applicationAddress, stringToHex(`Deposited ${amount} ether`)],
        value: parseEther(amount),
      },
      { onSuccess: () => setAmount('') },
    )
  }

  const invalid = !amount || Number(amount) <= 0

  return (
    <div>
      <h3>Deposit Ether</h3>
      <label>Amount (ETH): </label>
      <input
        type="number"
        step="0.01"
        placeholder="0.1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={isPending}
      />
      <button onClick={handleDeposit} disabled={!address || isPending || invalid}>
        {isPending ? 'Depositing...' : 'Deposit'}
      </button>
      {error && <p>Failed to deposit: {error.message.split('\n')[0]}</p>}
      {hash && (
        <p>
          Transaction: <code>{hash}</code> {isConfirming ? '(confirming...)' : isSuccess ? '(confirmed)' : ''}
        </p>
      )}
    </div>
  )
}
```

### Depositing ERC-20 tokens

An ERC-20 deposit takes two transactions: the owner first approves the ERC-20 portal to move the tokens, then calls `depositErc20Tokens`. The CLI devnet deploys a test token (`testFungibleTokenAddress` in `@cartesi/client/abi`, `TestToken` in `cartesi address-book`) whose `mint` function anyone can call, so the component also offers a mint button for local testing.

Create `src/components/DepositERC20.tsx`:

```tsx title="src/components/DepositERC20.tsx"
import { useState } from 'react'
import { erc20Abi, formatUnits, isAddress, parseUnits, type Address } from 'viem'
import { useConfig, useConnection, useReadContracts, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import {
  erc20PortalAbi,
  erc20PortalAddress,
  testFungibleTokenAbi,
  testFungibleTokenAddress,
} from '@cartesi/client/abi'

interface DepositERC20Props {
  applicationAddress: Address
}

export function DepositERC20({ applicationAddress }: DepositERC20Props) {
  const [token, setToken] = useState<string>(testFungibleTokenAddress)
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('')
  const config = useConfig()
  const { address } = useConnection()
  const { mutateAsync: writeContractAsync, isPending } = useWriteContract()

  const tokenAddress = isAddress(token) ? token : undefined
  const { data, refetch } = useReadContracts({
    contracts: [
      { address: tokenAddress, abi: erc20Abi, functionName: 'decimals' },
      { address: tokenAddress, abi: erc20Abi, functionName: 'symbol' },
      { address: tokenAddress, abi: erc20Abi, functionName: 'balanceOf', args: [address!] },
    ],
    allowFailure: false,
    query: { enabled: !!tokenAddress && !!address },
  })
  const [decimals, symbol, balance] = data ?? []

  const run = async (label: string, action: () => Promise<void>) => {
    try {
      setStatus(`${label}...`)
      await action()
      setStatus(`${label}: done`)
    } catch (error) {
      setStatus(`${label} failed: ${(error as Error).message.split('\n')[0]}`)
    } finally {
      refetch()
    }
  }

  // devnet only: the CLI's test token lets anyone mint
  const mint = () =>
    run('Mint', async () => {
      const hash = await writeContractAsync({
        address: testFungibleTokenAddress,
        abi: testFungibleTokenAbi,
        functionName: 'mint',
        args: [address!, parseUnits('100', 18)],
      })
      await waitForTransactionReceipt(config, { hash })
    })

  const deposit = () =>
    run('Deposit', async () => {
      if (!tokenAddress || decimals === undefined) throw new Error('invalid token')
      const value = parseUnits(amount, decimals)
      // 1. allow the ERC-20 portal to transfer the tokens
      const approveHash = await writeContractAsync({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [erc20PortalAddress, value],
      })
      await waitForTransactionReceipt(config, { hash: approveHash })
      // 2. deposit them into the application
      const depositHash = await writeContractAsync({
        address: erc20PortalAddress,
        abi: erc20PortalAbi,
        functionName: 'depositErc20Tokens',
        args: [tokenAddress, applicationAddress, value, '0x'],
      })
      await waitForTransactionReceipt(config, { hash: depositHash })
      setAmount('')
    })

  return (
    <div>
      <h3>Deposit ERC-20</h3>
      <label>Token: </label>
      <input value={token} onChange={(e) => setToken(e.target.value)} size={44} />
      <p>
        Balance: {balance !== undefined && decimals !== undefined ? `${formatUnits(balance, decimals)} ${symbol}` : '-'}
        {token === testFungibleTokenAddress && (
          <button onClick={mint} disabled={!address || isPending}>Mint 100 test tokens</button>
        )}
      </p>
      <label>Amount: </label>
      <input type="number" placeholder="10" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={deposit} disabled={!address || isPending || !tokenAddress || !amount}>
        Approve and deposit
      </button>
      {status && <p>{status}</p>}
    </div>
  )
}
```

## Advanced Usage

### Waiting for Input Processing

`InputTracker` above uses `useWaitForInput`. Pass `rejectErrors: true` to make the query fail when the input ends with any status other than `ACCEPTED`, and `pollingInterval`, `retryCount` or `timeout` (milliseconds) to tune the polling. The defaults poll every four seconds, ten times, after which React Query retries the whole wait.

### Inspecting the application state

Inspect requests are plain HTTP calls to the node and have no hook. Create `src/components/CartesiInspect.tsx`:

```tsx title="src/components/CartesiInspect.tsx"
import { useState } from 'react'
import { hexToString, type Address, type Hex } from 'viem'

interface InspectResponse {
  status: string
  reports: { payload: Hex }[]
  processed_input_count: number
  exception_data?: Hex
  error?: string
}

export function CartesiInspect({ applicationAddress }: { applicationAddress: Address }) {
  const [payload, setPayload] = useState('')
  const [result, setResult] = useState<InspectResponse>()
  const [error, setError] = useState('')

  const inspect = async () => {
    setError('')
    try {
      const response = await fetch(`${import.meta.env.VITE_CARTESI_INSPECT_URL}/${applicationAddress}`, {
        method: 'POST',
        body: payload,
      })
      if (!response.ok) throw new Error(`${response.status} ${await response.text()}`)
      setResult(await response.json())
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div>
      <h3>Inspect</h3>
      <input value={payload} onChange={(e) => setPayload(e.target.value)} placeholder="Inspect payload" />
      <button onClick={inspect}>Inspect</button>
      {error && <p>Inspect failed: {error}</p>}
      {result && (
        <div>
          <p>Status: {result.status} (processed inputs: {result.processed_input_count})</p>
          <ul>
            {result.reports.map((report, i) => (
              <li key={i}>{hexToString(report.payload)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

### Using the Cartesi client directly

Outside React, or for calls without a hook, create the node client with `createCartesiPublicClient` (inside components, `useCartesiClient()` returns the client of the nearest `CartesiProvider`):

```ts
import { http } from 'viem'
import { createCartesiPublicClient } from '@cartesi/client'

const client = createCartesiPublicClient({
  transport: http('http://127.0.0.1:6751/rpc'),
})

const { data: outputs, pagination } = await client.listOutputs({
  application: '0x...',
  limit: 10,
  offset: 0,
})
const nodeInfo = await client.getNodeInfo() // { chainId, version, defaultBlock }
```

### Listing all available applications

Create `src/components/CartesiApps.tsx`:

```tsx title="src/components/CartesiApps.tsx"
import { useApplications } from '@cartesi/react'
import type { Address } from 'viem'

interface CartesiAppsProps {
  selected?: Address
  onAppSelect?: (appAddress: Address) => void
}

export function CartesiApps({ selected, onAppSelect }: CartesiAppsProps) {
  const { data: applications, isLoading, error } = useApplications()

  if (isLoading) return <div>Loading applications...</div>
  if (error) return <div>Error loading applications: {error.message}</div>

  return (
    <div>
      <h2>Cartesi Applications</h2>
      {applications?.data.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div>
          <label>Select Application: </label>
          <select value={selected} onChange={(e) => onAppSelect?.(e.target.value as Address)}>
            {applications?.data.map((app) => (
              <option key={app.applicationAddress} value={app.applicationAddress}>
                {app.name} ({app.applicationAddress})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
```

## Run the application

```bash
pnpm dev
```

Open the URL printed by Vite, connect with **Mock Connector** (or **Injected** for MetaMask), and:

1. Send an input and watch `InputTracker` report its status; the notices and reports it produced appear under **Application Outputs**.
2. Deposit Ether or ERC-20 tokens. A deposit is an input sent by the portal, so it also shows up in the inputs and outputs.
3. If your application emits vouchers, wait for the epoch of the voucher to be settled (the epoch status in **Latest epochs** becomes `CLAIM_ACCEPTED`) and click **Execute**.

To type-check and build the application for production:

```bash
pnpm build
```
