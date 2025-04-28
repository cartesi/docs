# Interacting with the Cartesi Coprocessor

Interaction with the Coprocessor is handled through regular smart contract methods. You can use tools like Foundry’s `cast`, wallets, or frontend applications to send transactions.

Below is an example contract, [`CoprocessorAdapterSample`](https://github.com/Mugen-Builders/coprocessor-base-contract/blob/main/test/utils/CoprocessorAdapterSample.sol), which demonstrates interaction with the Coprocessor:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../../src/CoprocessorAdapter.sol";

contract CoprocessorAdapterSample is CoprocessorAdapter {
    constructor(address _coprocessorAddress, bytes32 _machineHash)
        CoprocessorAdapter(_coprocessorAddress, _machineHash)
    {}

    function handleNotice(bytes memory notice) internal override {
        address destination;
        bytes memory decodedPayload;

        (destination, decodedPayload) = abi.decode(notice, (address, bytes));

        bool success;
        bytes memory returndata;

        (success, returndata) = destination.call(decodedPayload);
    }

    function runExecution(bytes calldata input) external {
        callCoprocessor(input);
    }
}
```

---

## Methods of Interaction

### 1. **Using Foundry’s `cast`**

You can interact with the smart contract using Foundry’s CLI tool `cast`:

#### Example: Calling `runExecution`

1. Ensure you have the contract address, ABI, and RPC URL.
2. Use the following `cast` command to invoke the `runExecution` function:
   ```bash
   cast send <contract_address> "runExecution(bytes)" <hex_encoded_input> \
       --rpc-url <your_rpc_url> \
       --private-key <your_private_key>
   ```
   Replace:
   - `<contract_address>` with your deployed contract’s address.
   - `<hex_encoded_input>` with the ABI-encoded input.
   - `<your_rpc_url>` with the RPC endpoint of the network.
   - `<your_private_key>` with the sender’s private key.

### 2. **From a Frontend Application Using `viem`**

You can use the `viem` library to interact with the contract from a frontend application.

#### Example: Calling `runExecution` with `viem`

```javascript
import { createPublicClient, createWalletClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// Define the RPC URL and private key
const rpcUrl = "<your_rpc_url>";
const privateKey = "<your_private_key>";
const contractAddress = "<contract_address>";

// Define the ABI
const abi = parseAbi(["function runExecution(bytes input) external"]);

// Set up clients
const publicClient = createPublicClient({ transport: http(rpcUrl) });
const account = privateKeyToAccount(privateKey);
const walletClient = createWalletClient({ account, transport: http(rpcUrl) });

// Function to call `runExecution`
async function callRunExecution(input) {
  const txHash = await walletClient.writeContract({
    address: contractAddress,
    abi,
    functionName: "runExecution",
    args: [input],
  });

  console.log("Transaction Hash:", txHash);

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });
  console.log("Transaction Confirmed:", receipt);
}

// Example Input
const input = "0x" + Buffer.from("your-input-data").toString("hex");
callRunExecution(input);
```

Replace:

- `<your_rpc_url>` with the network’s RPC URL.
- `<your_private_key>` with the sender’s private key.
- `<contract_address>` with the deployed contract’s address.
- `"your-input-data"` with the appropriate input data.

---

## Notes

- **Template Contract**: Reference the full implementation of the [CoprocessorAdapterSample](https://github.com/Mugen-Builders/coprocessor-base-contract/blob/main/test/utils/CoprocessorAdapterSample.sol).
- **Gas Costs**: Interacting with `runExecution` incurs gas costs depending on the complexity of the operation.
- **Security**: Ensure proper access controls are implemented for sensitive functions.
