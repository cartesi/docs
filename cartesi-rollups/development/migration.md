---
id: migration
title: Migration guide
---

## Migrating from Cartesi Rollups Node v1.4 to v1.5.x

Release `v1.5.0` introduces a critical change in how epochs are closed in the Cartesi Rollups Node, transitioning from a **timestamp-based** system to a **block number-based** system.

Epoch closure is now determined by the `CARTESI_EPOCH_LENGTH` environment variable (in blocks) instead of `CARTESI_EPOCH_DURATION` (in seconds).

```plaintext
CARTESI_EPOCH_LENGTH = CARTESI_EPOCH_DURATION / BLOCK_TIME
```

Where `BLOCK_TIME` is the time to generate a block in the target network.

**Example**: If a block is generated every 12 seconds and `CARTESI_EPOCH_DURATION` is set to 86400 seconds (24 hours), `CARTESI_EPOCH_LENGTH = 86400 / 12 = 7200`

### Option 1: Redeploy all contracts

Redeploy all contracts and your application with the new configuration.

For detailed deployment instructions, refer to the [self-hosted deployment guide](../deployment/self-hosted.md).

:::caution
Redeploying creates a new application instance. All previous inputs, outputs, claims, and funds locked in the application contract will remain associated with the old application address.
:::

### Option 2: Replace Application's History

This process allows inputs, outputs, and locked funds to remain unchanged but is more involved.

:::note
A new _History_ will have no claims. Upon restarting the node with a new _History_, previous claims will be resubmitted, incurring additional costs for the _Authority_ owner.
:::

It's recommended to use the deterministic deployment functions available in the Rollups contracts.

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

  The `cast send` command will fail if the `History` type is not recognized by Cast at the time of execution. In such cases, replace `History` with `address` as the return type for `newHistory()` and execute the command again.

  Additionally, the `cast send` command may fail due to gas estimation issues. To circumvent this, provide gas constraints with the `--gas-limit` parameter (e.g., `--gas-limit 7000000`).

#### 3. Replace the _History_

Make sure the environment variables from the previous step are set, including `NEW_HISTORY_ADDRESS`, which should have the address of the new History.

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

After replacing the _History_, update the `CARTESI_CONTRACTS_HISTORY_ADDRESS` in the application configuration with the new _History_ address. Then, upgrade the Cartesi Rollups Node as usual.

When the Cartesi Rollups Node restarts, it will process all existing inputs, recalculate the epochs, and send the claims to the new _History_ based on the updated configuration.

---

## Migrating to Cartesi CLI

Follow these simple steps to migrate your application from Sunodo CLI to Cartesi CLI.

### Uninstall Sunodo CLI

1. If installed using Homebrew:

   ```bash
   brew uninstall sunodo
   ```

2. If installed using NPM:
   ```bash
   npm uninstall -g sunodo
   ```

### Install Cartesi CLI

1. Install with Homebrew:

   ```shell
   brew install cartesi/tap/cartesi
   ```

2. Install with NPM:

   ```shell
   npm install -g @cartesi/cli
   ```

### Update Project Configuration

1. Modify your `Dockerfile` to have the latest updates from [the Cartesi application templates](https://github.com/cartesi/application-templates).

1. Change the `.sunodo` directory to `.cartesi`.

1. Modify the `.gitignore` file to ignore the `.cartesi` directory instead of `.sunodo`.

1. If you have a `.sunodo.env` file, rename it to `.cartesi.env`.
