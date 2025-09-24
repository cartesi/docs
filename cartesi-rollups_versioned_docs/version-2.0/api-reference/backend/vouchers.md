---
id: vouchers
title: Vouchers
resources:
  - url: https://www.evm.codes/?fork=cancun#f4
    title: DELEGATECALL Opcode
---

Vouchers serve as a mechanism for facilitating on-chain actions initiated in the execution layer.

Imagine vouchers as digital authorization tickets that grant dApps the authority to execute specific actions directly on the base layer. These vouchers encapsulate the details of the desired on-chain action, such as a token swap request or asset transfer.

A voucher explicitly specifies the action that the dApp intends to execute on the base layer.

For instance, in a DeFi application built on Cartesi, users may want to swap one token for another. The dApp generates a voucher that authorizes the on-chain smart contract to execute the swap on the user's behalf.

The [`Application`](../contracts/application.md) contract is crucial in validating and executing the received voucher on the blockchain. This execution process occurs through the [`executeOutput()`](../../contracts/application/#executeoutput) function, which handles different types of outputs including vouchers and DELEGATECALL vouchers.

The result of the voucher execution is recorded on the base layer. This recording typically involves submitting claims by a consensus contract, ensuring the integrity and transparency of the executed on-chain action.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="Javascript" label="Javascript" default>
<pre><code>

```javascript
import { stringToHex, encodeFunctionData, erc20Abi, zeroHash } from "viem";

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  const sender = data["metadata"]["msg_sender"];
  const erc20Token = "0x784f0c076CC55EAD0a585a9A13e57c467c91Dc3a"; // Sample ERC20 token address

    const call = encodeFunctionData({
    abi: erc20Abi,
    functionName: "transfer",
    args: [sender, BigInt(10)],
  });

  let voucher = {
    destination: erc20Token,
    payload: call,
    value: zeroHash,
  };

  await emitVoucher(voucher);
  return "accept";
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

```

</code></pre>
</TabItem>

<TabItem value="Python" label="Python">
<pre><code>

```python
# Voucher creation process
import requests
import json
from os import environ
from eth_utils import function_signature_to_4byte_selector
from eth_abi import decode, encode

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]

def emit_voucher(function_signature, destination, types, values):
    selector = function_signature_to_4byte_selector(function_signature)    
    encoded_params = encode(types, values)
    payload = "0x" + (selector + encoded_params).hex()
    response = requests.post(rollup_server + "/voucher", json={"payload": payload, "destination": destination, "value": '0x' + encode(["uint256"], [0]).hex()})
    if response.status_code == 200 or response.status_code == 201:
        logger.info(f"Voucher emitted successfully with data: {payload}")
    else:
        logger.error(f"Failed to emit Voucher with data: {payload}. Status code: {response.status_code}")


emit_voucher("mint(address)", "0x784f0c076CC55EAD0a585a9A13e57c467c91Dc3a", ["address"], [data["metadata"]["msg_sender"]])
```

</code></pre>
</TabItem>
</Tabs>

:::note create a voucher
[Refer to the documentation here](../../development/asset-handling.md) for asset handling and creating vouchers in your dApp.
:::

## DELEGATECALL Vouchers

:::danger Security Considerations
DELEGATECALL Vouchers are a powerful feature that should be used with extreme caution. Incorrect implementation can lead to serious security vulnerabilities as the target contract's code has full access to the Application contract's storage and funds.
:::

DELEGATECALL Vouchers are an extension of vouchers that enables advanced smart contract interactions through the [`DELEGATECALL`](https://www.evm.codes/?fork=cancun#f4) opcode.

Unlike regular vouchers, DELEGATECALL vouchers allow dApps to separate their execution logic from their storage context. When using DELEGATECALL voucher, the Application contract always maintains the storage, context, and funds (both ETH and tokens), while the target contract provides only the execution logic. This separation enables more flexible and reusable smart contract patterns while keeping all state changes and assets within the Application contract.

When a DELEGATECALL voucher is executed through the Application contract, the code at the target address is executed with the following characteristics:

- All storage operations occur in the Application contract's storage space
- All funds (ETH and tokens) remain in and are managed by the Application contract
- The msg.sender and msg.value from the original transaction are preserved
- The execution logic comes from the target contract, but operates on the Application contract's state and funds

This mechanism, where the Application contract maintains the state and funds while borrowing logic from other contracts, enables powerful patterns such as:

- **Paid Vouchers**: Vouchers that provide payment to the user who executes them.

- **Future Vouchers**: Vouchers that are time-locked and can only be executed after a specific timestamp.

- **Expirable Vouchers**: Vouchers that have an expiration timestamp, after which they can no longer be executed.

- **Targeted Vouchers**: Vouchers that are restricted to execution by specific addresses or a list of authorized addresses.

- **Atomic Vouchers**: A sequence of message calls that must be executed in order, ensuring atomicity of the operations.

- **Re-executable Vouchers**: Vouchers that can be executed multiple times, unlike standard vouchers which can only be executed once.

- **Ordered Vouchers**: Vouchers that must be executed in a specific sequence. For example, voucher A can only be executed after voucher B has been executed.

<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

```javascript
import { encodeFunctionData } from "viem";

const abi = [
  "function safeTransfer(address,address,uint256)"
];

async function emitSafeERC20Transfer(token, to, amount) {
  const call = encodeFunctionData({
    abi,
    functionName: "safeTransfer",
    args: [token, to, amount],
  });

  const voucher = {
    destination: "0xfafafafafafafafafafafafafafafafafafafafa", // address of the contract containing the logic
    payload: call,
  };

  await fetch(rollup_server + "/delegate-call-voucher", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(voucher),
  });
}
```

</code></pre>
</TabItem>

<TabItem value="Python" label="Python">
<pre><code>

```python
from eth_utils import function_signature_to_4byte_selector, to_checksum_address
from eth_abi import encode
import requests

def emit_safe_erc20_transfer(token, to, amount):
    selector = function_signature_to_4byte_selector("safeTransfer(address,address,uint256)")
    encoded_params = encode(["address", "address", "uint256"], [to_checksum_address(token), to_checksum_address(to), amount])
    payload = "0x" + (selector + encoded_params).hex()
    voucher = {
        "destination": "0xfafafafafafafafafafafafafafafafafafafafa",  # address of the contract containing the logic
        "payload": payload,
    }
    response = requests.post(rollup_server + "/delegate-call-voucher", json=voucher)
    return response
```

</code></pre>
</TabItem>

<TabItem value="Go" label="Go">
<pre><code>

```go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
)

func emitSafeERC20Transfer(token, to common.Address, amount *big.Int) error {
	abiJSON := `[{
		"type":"function",
		"name":"safeTransfer",
		"inputs":[
			{"type":"address"},
			{"type":"address"},
			{"type":"uint256"}
		]
	}]`
	
	abiInterface, err := abi.JSON(strings.NewReader(abiJSON))
	if err != nil {
		return fmt.Errorf("failed to parse ABI: %w", err)
	}
	
	payload, err := abiInterface.Pack("safeTransfer", token, to, amount)
	if err != nil {
		return fmt.Errorf("failed to pack ABI: %w", err)
	}
	
	voucher := map[string]interface{}{
		"destination": "0xfafafafafafafafafafafafafafafafafafafafa", // address of the contract containing the logic
		"payload":     common.Bytes2Hex(payload),
	}
	
	voucherJSON, err := json.Marshal(voucher)
	if err != nil {
		return fmt.Errorf("failed to marshal voucher: %w", err)
	}
	
	_, err = http.Post(rollupServer+"/delegate-call-voucher", "application/json", bytes.NewBuffer(voucherJSON))
	if err != nil {
		return fmt.Errorf("failed to send voucher: %w", err)
	}
	
	return nil
}
```

</code></pre>
</TabItem>
</Tabs>

### Implementation Considerations

When implementing DELEGATECALL vouchers, consider the following:

1. **Storage Layout**: Since all storage operations happen in the Application contract, the storage layout of the target contract must be compatible with the Application contract's layout to prevent unintended storage collisions.

2. **Security**: Since DELEGATECALL operations execute code in the context of the Application contract, careful validation of the target contract and its code is essential to prevent malicious modifications to the Application's state.

3. **State Management**: All state changes occur in the Application contract's storage, making it the single source of truth for the application's state.

### Execution Context

In a DELEGATECALL voucher execution:

- The Application contract provides the execution context and storage
- The target contract provides only the logic to be executed
- All storage operations affect the Application contract's state
- msg.sender and msg.value from the original transaction are preserved

This architecture, where the Application contract maintains all state while being able to execute logic from other contracts, makes DELEGATECALL vouchers particularly useful for customizable logics while keeping all application state centralized in the Application contract.

## Epoch Configuration

An epoch refers to a specific period during which a batch of updates is processed off-chain, and upon agreement by validators, the finalized state is recorded on-chain.

Epoch Length is the number of blocks that make up an epoch. It determines how long each epoch lasts in terms of block counts. For instance, if an epoch length is set to 7200 blocks, the epoch will end once 7200 blocks have been processed. This length directly influences how frequently updates are finalized and recorded on the blockchain.

Vouchers and DELEGATECALL vouchers are executed on the blockchain upon the closure of the corresponding epoch. This ensures that all state changes and logic executions are properly validated and recorded in the blockchain.

One common use of vouchers in Cartesi dApps is to withdraw assets. Users initiate asset withdrawals by generating vouchers, which are then executed on the blockchain upon the closure of the corresponding epoch.

You can manually set the epoch length to facilitate quicker asset deposits and withdrawals.

:::note epoch duration
[Refer to the documentation here](../../development/cli-commands.md/#run) to manually configure epoch length during development.
:::
