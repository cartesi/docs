---
id: standard
title: Self-hosted deployment (standard)
---

This guide explains how to run a Cartesi Rollups node locally on your machine for development and testing purposes on **testnet**.

:::warning Production Warning
**This self-hosted approach should NOT be used in _production_.**

While this setup works with testnet environments, it's designed exclusively for development purposes. It lacks critical production requirements such as:

- Public snapshot verification
- Proper security hardening
- Production-grade infrastructure.
  :::

## Prerequisites

Before starting, ensure you have the following installed:

- Cartesi CLI: An easy-to-use tool for developing and deploying your dApps.

- Docker Desktop 4.x: The required tool to distribute the Cartesi Rollups framework and its dependencies.

For more details about the installation process for each of these tools, please refer to the [this section](../../development/installation.md).

:::info Versions
This guide assumes **rollups-node v2.0.0-alpha.14** (Cartesi Machine emulator 0.22) and **rollups-contracts v3.0.0-alpha.10**, the contracts release that this node release is built against. The node, the contract addresses and the application snapshot must all match these versions.
:::

## Configuration

Before running the node, you need to configure your `.env` file with the following environment variables:

```shell
BLOCKCHAIN_ID=<blockchain-id>
AUTH_KIND="private_key"
CARTESI_AUTH_PRIVATE_KEY="<funded-private-key>"
BLOCKCHAIN_HTTP_ENDPOINT="<http-endpoint>"
CARTESI_BLOCKCHAIN_DEFAULT_BLOCK="finalized"
CARTESI_CONTRACTS_INPUT_BOX_ADDRESS="<InputBox-address>"
CARTESI_CONTRACTS_AUTHORITY_FACTORY_ADDRESS="<AuthorityFactory-address>"
CARTESI_CONTRACTS_QUORUM_FACTORY_ADDRESS="<QuorumFactory-address>"
CARTESI_CONTRACTS_APPLICATION_FACTORY_ADDRESS="<ApplicationFactory-address>"
CARTESI_CONTRACTS_SELF_HOSTED_APPLICATION_FACTORY_ADDRESS="<SelfHostedApplicationFactory-address>"
```

**Important notes:**

| Variable                           | Description                                                          |
| ---------------------------------- | -------------------------------------------------------------------- |
| `BLOCKCHAIN_ID`                    | Replace `<blockchain-id>` with your blockchain network ID            |
| `BLOCKCHAIN_HTTP_ENDPOINT`         | Replace `<http-endpoint>` with your HTTP endpoint                    |
| `AUTH_KIND`                        | Set to `private_key` for local development                           |
| `CARTESI_AUTH_PRIVATE_KEY`         | Replace `<funded-private-key>` with a private key for selected chain. This account deploys the application and pays for every claim, so it must stay funded |
| `CARTESI_BLOCKCHAIN_DEFAULT_BLOCK` | The block the node reads chain state at: `latest`, `safe` or `finalized` (the node's default). Use `finalized`, see below |
| `CARTESI_CONTRACTS_*`              | Addresses of the rollups-contracts v3.0.0-alpha.10 contracts on your chain, see [Deployed Contracts](#deployed-contracts) |

:::warning Block policy
- Use `finalized`. With `latest` or `safe`, a reorg can invalidate inputs and claims that the node already stored. The node does not roll them back, and you may have to rebuild its database. The compose file used below falls back to `latest` if you do not set the variable.
- The node saves the policy in its database when each service first starts, and a later mismatch stops the services at startup. To change the policy, start over with a fresh database.
:::

:::danger Security
Ensure to follow best practices when handling private keys during local development and deployment to production.
:::

## Setting up the local node

1. **Download the Cartesi Rollups Node docker compose file in your project root:**

   ```shell
   curl -L https://raw.githubusercontent.com/Mugen-Builders/deployment-setup-v2.0/98847c19660b46cd9f1b1c8ff9f8cf7f88039f98/compose.local.yaml -o compose.local.yaml
   ```

   :::caution Update the compose file before you start
   This compose file pins **rollups-node v2.0.0-alpha.12** (images `cartesi/rollups-runtime:0.12.0-alpha.41` and `cartesi/rollups-database:0.12.0-alpha.41`), and its contract addresses default to **rollups-contracts v3.0.0-alpha.6**. To run the versions this guide assumes:

   - Change the tag of every `cartesi/rollups-runtime` and `cartesi/rollups-database` image to `0.12.0-alpha.45`, which ships rollups-node v2.0.0-alpha.14 with emulator 0.22.0.
   - Set every `CARTESI_CONTRACTS_*` variable in your `.env` file, as shown in [Configuration](#configuration), so that the compose defaults are not used.

   If you already ran the node with other images, start from a fresh database (for example, `docker compose -f compose.local.yaml down -v`, which also deletes the node's data volume): rollups-node v2.0.0-alpha.14 changed the initial database schema and does not migrate an existing database.

   The compose file has no PRT service, so it runs Authority and Quorum applications only.
   :::

2. **Build the application with the Cartesi CLI:**

   ```shell
   cartesi build
   ```

   This command compiles your application into RISC-V architecture and creates a Cartesi machine snapshot locally.

   The node can load the snapshot only if it was built with the emulator line of the node release: 0.22.x for rollups-node v2.0.0-alpha.14. The SDK image that `cartesi build` runs sets the emulator version. You can choose it with the top-level `sdk` key of `cartesi.toml`; the `cartesi/sdk:0.12.0-alpha.45` image ships emulator 0.22.0. If the node cannot load the snapshot, it marks the application `FAILED` (see [Operating the node](#operating-the-node)).

3. **Run the Cartesi Rollups Node with the application's initial snapshot attached:**

   ```shell
   docker compose -f compose.local.yaml --env-file .env up -d
   ```

   This starts the local node using the configuration from your `.env` file.

4. **Deploy and register the application to the node:**

   ```shell
   docker compose --project-name cartesi-rollups-node \
      exec advancer cartesi-rollups-cli deploy application <app-name> /var/lib/cartesi-rollups-node/snapshot \
      --epoch-length <epoch-length> \
      --claim-staging-period <claim-staging-period> \
      --salt <salt> \
      --register
   ```

   Replace `<app-name>` with your application name and `<salt>` with a unique identifier. The salt must be unique for each deployment and cannot be repeated. You can generate a unique salt using:

   ```shell
   cast keccak256 "your-unique-string"
   ```

   This command deploys an Authority consensus owned by the node's signer, together with the application. Both values below are fixed in the consensus contract at deployment:

   - `--epoch-length` is the epoch length in blocks (default 10). The node submits a claim for each epoch that received inputs once the epoch has ended, and the outputs of that epoch (vouchers and notices) become executable only after the claim is accepted.
   - `--claim-staging-period` is the number of blocks a staged claim must wait before it can be accepted (default 0, which allows immediate acceptance). It is the window in which a guardian can foreclose the application before a claim takes effect, so with 0 there is no such window. A standard deployment has no guardian; if you deploy [with emergency withdrawal](./with-emergency-withdrawal.md), size this period above the time your guardian needs to react.

   To size the epoch length:

   - With `finalized`, the node sees the end of an epoch, and later its staged claim, only once they are finalized. An epoch's outputs therefore become executable at least two finality delays after the epoch ends, or one finality delay plus the claim staging period if that is longer, plus the time to include the node's transactions.
   - Each claim costs two transactions from the node's signer (submit and accept), and the node normally sends one transaction at a time per signer, waiting until each is mined. Short epochs that keep receiving inputs produce more claims to pay for and to send; keep the total claim load of all applications on the node well below one transaction per block.

   After this process, you'll have your application deployed and registered to the node.

   If the command reports an error, first check whether the application was deployed anyway, as described in [Operating the node](#operating-the-node), and register it instead of deploying again. If nothing was deployed, you can deploy the authority and the application separately, as below.

   ### Manual deployment fallback

   1. Deploy an authority contract with `cast`. Replace each placeholder with the expected value. The command prints the address of the new authority, which it takes from the `AuthorityCreated` event of the factory.

      ```shell
      cast send <AuthorityFactory-Address> "newAuthority(address,uint256,uint256)" \
      <Authority-Owner-Address> <epoch-length> <claim-staging-period> \
      --private-key <PRIVATE-KEY> --rpc-url <RPC-URL> --json \
      | jq -r --arg topic "$(cast keccak 'AuthorityCreated(address)')" \
          '.logs[] | select(.topics[0] == $topic) | .data' \
      | xargs cast parse-bytes32-address
      ```

      `<Authority-Owner-Address>` must be the address of the node's signer (`CARTESI_AUTH_PRIVATE_KEY`): the node only submits claims to an authority that its signer owns. `<epoch-length>` and `<claim-staging-period>` are the values described in step 4. The factory also has a salted variant, `newAuthority(address,uint256,uint256,bytes32)`, which deploys the authority at a deterministic address (`calculateAuthorityAddress` returns it in advance).

   Use the `CARTESI_CONTRACTS_AUTHORITY_FACTORY_ADDRESS` value from your `.env` file as `<AuthorityFactory-Address>`; see the **Deployed Contracts** section below.

   2. Use the address you got above as the `<Authority-contract>` in the deploy command below. This command re-runs the snapshot registration using the specified authority.

      ```shell
      docker compose --project-name cartesi-rollups-node \
         exec advancer cartesi-rollups-cli deploy application <app-name> /var/lib/cartesi-rollups-node/snapshot \
         --consensus <Authority-contract> \
         --json
      ```

      With `--consensus`, the CLI reads the epoch length and the claim staging period from the authority contract and ignores `--epoch-length` and `--claim-staging-period`.

      On success this command deploys, registers and returns the address of the deployed application contract; note it for further interaction with your application.

## Deployed Contracts:

Use the contract addresses of the rollups-contracts release that your node release is built against: **v3.0.0-alpha.10** for rollups-node v2.0.0-alpha.14. They ship as the `cartesi-rollups-contracts-3.0.0-alpha.10-deployment-addresses.tar.gz` asset of the [v3.0.0-alpha.10 release](https://github.com/cartesi/rollups-contracts/releases/tag/v3.0.0-alpha.10), where the `deployments/<chain-id>/` directory holds the address of each contract (`InputBox`, `AuthorityFactory`, `QuorumFactory`, `ApplicationFactory`, `SelfHostedApplicationFactory`, the portals, and so on).

- Set every `CARTESI_CONTRACTS_*` variable from this same set. Do not mix in addresses from other releases.
- The addresses are deterministic. Before using one, check that it has code on your chain: `cast code <address> --rpc-url <RPC-URL>` must return non-empty bytecode.
- See [Supported networks](../introduction.md#supported-networks) for the chains, and for the Arbitrum caveat.

## Accessing the node

Once running, your local Cartesi Rollups Node will be accessible through the standard APIs:

- Inspect endpoint: `http://localhost:10012/inspect/<application-address>`
- JSON-RPC endpoint: `http://localhost:10011/rpc`

CORS is disabled by default on both endpoints, so a frontend served from another origin (for example, `http://localhost:3000`) cannot call them from the browser. To allow it, set `CARTESI_JSONRPC_CORS_ALLOWED_ORIGINS` and `CARTESI_INSPECT_CORS_ALLOWED_ORIGINS` to a comma-separated list of the allowed origins. The compose file does not pass these variables from `.env`, so add them to its `x-env` block.

## Operating the node

Run the `cartesi-rollups-cli` commands below inside the node, through `docker compose --project-name cartesi-rollups-node exec advancer`, as in the deployment steps.

- **Check the chain before deploying again.** The CLI prints `Transaction hash: <hash>` before it sends each transaction. If `deploy application` then reports an error, for example a provider timeout or a failure to register, the application may already exist on chain. Look up the transaction (`cast receipt <hash> --rpc-url <RPC-URL>`). If it succeeded and its logs include an `ApplicationCreated` event, do not deploy again: register the existing application, whose address is the last field of that event (`appContract`, the last 32-byte word of the log data):

  ```shell
  docker compose --project-name cartesi-rollups-node \
     exec advancer cartesi-rollups-cli app register \
     --name <app-name> \
     --address <application-address> \
     --template-path /var/lib/cartesi-rollups-node/snapshot
  ```

- **Validate the application before you announce it.** The CLI does not check that the node can load your snapshot. Send a test input, from an account other than the node's signer, and check that the node processed it:

  ```shell
  cast send <InputBox-address> "addInput(address,bytes)" <application-address> 0x00 \
     --private-key <test-account-private-key> --rpc-url <RPC-URL>

  curl -s -X POST http://localhost:10011/rpc -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":1,"method":"cartesi_getProcessedInputCount","params":{"application":"<app-name>"}}'
  ```

  If the node cannot load the snapshot, for example because it was built with another emulator version, the application becomes `FAILED`. `cartesi-rollups-cli app status <app-name>` prints its status and the reason.

- **Keep the signer funded, and use it only for the node.** The node's signer (`CARTESI_AUTH_PRIVATE_KEY`) pays for every claim. If it runs out of funds, claims wait, the node logs that claim publication is waiting for funding, and outputs stop becoming executable. Fund the account and the node continues. Avoid sending other transactions from this account while the node is submitting claims; if you do (for example, to deploy another application with the CLI), the node detects the nonce change and retries.

- **Recover a `FAILED` application.** `FAILED` stops processing for that application. Read the reason with `cartesi-rollups-cli app status <app-name>`, fix the cause, then re-enable the application with `cartesi-rollups-cli app status <app-name> enabled`. Re-enabling restarts processing from the last snapshot; it does not repair state. A `CORRUPTED` application cannot be re-enabled: fix the cause and start over with a fresh database.

- **Snapshots and restarts.** By default the node stores no machine snapshots (snapshot policy `NONE`), so after each restart it re-executes every processed input of every application, starting from the template, before it processes new inputs. For long-running applications, set a snapshot policy, for example `cartesi-rollups-cli app execution-parameters set <app-name> snapshot_policy EVERY_EPOCH`. The node writes snapshots to `CARTESI_SNAPSHOTS_DIR`, which this compose file sets to the directory where `.cartesi/image` is mounted.

- **One node per database.** Run one node deployment per database, with one process per service. Stop the running processes completely before starting new ones, for example when you change the images. Changing the chain, the `CARTESI_BLOCKCHAIN_DEFAULT_BLOCK` policy or the signer of an existing database is not supported.

- **Providers that limit `eth_getLogs`.** The node splits its log queries into ranges of at most `CARTESI_BLOCKCHAIN_MAX_BLOCK_RANGE` blocks (default 2000). If your provider allows fewer blocks per `eth_getLogs` request, add this variable to the `x-env` block of the compose file with your provider's limit.

- **No guardian by default.** `deploy application` without a withdrawal config deploys an application with no guardian: nobody can foreclose it, and its users have no emergency withdrawal. If users will deposit assets into the application, consider the [deployment with emergency withdrawal](./with-emergency-withdrawal.md).
