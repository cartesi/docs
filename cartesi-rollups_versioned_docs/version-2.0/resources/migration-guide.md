---
id: migration-guide
title: Migration Guide
---

## Migrating from Cartesi Rollups v1.5.x to v2.0

Rollups node v2.0 introduces some major changes in how the node works internally and how the application code interacts with it. Not all the breaking changes affect all applications. To identify which changes might affect your application, check if any of the following cases apply:

### My back-end...
- handles ERC-20 token deposit inputs. See the [ERC-20 token deposit inputs](#erc-20-token-deposit-inputs) section.
- handles application address relay inputs. See the [Application address](#application-address) section.
- generates Ether withdrawal vouchers. See the [Ether withdrawal vouchers](#ether-withdrawal-vouchers) section.

### My front-end...
- validates notices. See the [Outputs](#outputs) section.
- executes vouchers. See the [Outputs](#outputs) section.
- listens to voucher execution events. See the [Outputs](#outputs) section.
- checks if a voucher was executed. See the [Outputs](#outputs) section.
- uses inspect calls. See the [Inspect calls](#inspect-calls) section.
- uses JSON-RPC queries. See the [JSON queries](#jsonrpc-queries) section.

:::note
If your application uses a high-level framework(ex. Deroll, Rollmelette etc.) for either backend or frontend, check if the framework has already implemented the changes described in this guide.
:::

### ERC-20 token deposit inputs

In SDK v1, ERC-20 token deposit inputs start with a 1-byte Boolean field which indicates whether the transfer was successful or not:

#### 1. Define the environment variables

- `SALT`: A random 32-byte value for the deterministic deployment functions.
- `RPC_URL`: The RPC endpoint to be used.
- `MNEMONIC`: The mnemonic phrase for the Authority owner's wallet (other wallet options may be used).
- `HISTORY_FACTORY_ADDRESS`: The address of a valid HistoryFactory instance.
- `AUTHORITY_ADDRESS`: The address of the Authority instance used by the application.

  :::note environment variables
  A `HistoryFactory` is deployed at `0x1f158b5320BBf677FdA89F9a438df99BbE560A26` for all supported networks, including Ethereum, Optimism, Arbitrum, Base, and their respective Sepolia-based testnets.
  :::

#### 2. Instantiate a New _History_

This is a two-step process. First calculate the address of the new History. After that, the new instance of History may be created.

- To calculate the address of a new _History_ contract call the `calculateHistoryAddress(address,bytes32)(address)` function with the help of Foundry's Cast:

  ```shell
  cast call \
    --trace --verbose \
    $HISTORY_FACTORY_ADDRESS \
    "calculateHistoryAddress(address,bytes32)(address)" \
    $AUTHORITY_ADDRESS \
    $SALT \
    --rpc-url "$RPC_URL"
  ```

  If the command executes successfully, it will display the address of the new History contract. Store this address in the environment variable `NEW_HISTORY_ADDRESS` for later use.

- Create a new instance of _History_ may be created by calling function `newHistory(address,bytes32)`:

  ```shell
  cast send \
  --json \
  --mnemonic "$MNEMONIC" \
  $HISTORY_FACTORY_ADDRESS \
  "newHistory(address,bytes32)(History)" \
  $AUTHORITY_ADDRESS \
  $SALT \
  --rpc-url "$RPC_URL"
  ```

  The `cast send` command will fail if Cast does not recognize the _History_ type during execution. In such cases, replace _History_ with `address` as the return type for `newHistory()` and execute the command again.

The `cast send` command may also fail due to gas estimation issues. To circumvent this, provide gas constraints with the `--gas-limit` parameter (e.g., `--gas-limit 7000000`).

#### 3. Replace the _History_

Ensure the environment variables from the previous step are set, including `NEW_HISTORY_ADDRESS`, which should have the address of the new History.

To replace the _History_ used by the _Authority_, run this command:

```shell
cast send \
    --json \
    --mnemonic "$MNEMONIC" \
    "$AUTHORITY_ADDRESS" \
    "setHistory(address)" \
    "$NEW_HISTORY_ADDRESS" \
    --rpc-url "$RPC_URL"
```

In SDK v2, we modified the ERC-20 portal to only accept successful transactions. With this change, the success field would always be true, so it has been removed:

When the Cartesi Rollups Node restarts, it processes all existing inputs, recalculates the epochs, and sends the claims to the new _History_ based on the updated configuration.
