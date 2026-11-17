> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: standard
title: Self-hosted deployment (standard)
---

This guide explains how to run a Cartesi Rollups node locally on your machine for development and testing on **testnet**.

:::warning Production Warning
**Do not use this compose file as a production deployment.**

It is a testnet-oriented starting point. It does not include public snapshot verification, proper security hardening, or production-grade infrastructure. See [Good practices](#good-practices) before running a longer-lived node.
:::

## Prerequisites

- Cartesi CLI
- Docker Desktop 4.x (Compose and Buildx)

See [installation](../../development/installation.md).

:::info Versions
This guide assumes **rollups-node v2.0.0-alpha.14** (Cartesi Machine emulator 0.22) and **rollups-contracts v3.0.0-alpha.10**, the contracts release that this node release is built against. The node, the contract addresses and the application snapshot must all match these versions.
:::

## Configuration

Create a `.env` file in the project root:

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

| Variable                           | Description                                                          |
| ---------------------------------- | -------------------------------------------------------------------- |
| `BLOCKCHAIN_ID`                    | Chain ID of the target network                                       |
| `BLOCKCHAIN_HTTP_ENDPOINT`         | HTTP JSON-RPC endpoint for the base layer. The node polls it; there is no WebSocket setting |
| `AUTH_KIND`                        | `private_key` for local and testnet experiments                      |
| `CARTESI_AUTH_PRIVATE_KEY`         | Funded private key for the selected chain. This account deploys the application and pays for every claim, so it must stay funded |
| `CARTESI_BLOCKCHAIN_DEFAULT_BLOCK` | The block the node reads chain state at: `latest`, `safe` or `finalized` (the node's default). Use `finalized`, see below |
| `CARTESI_CONTRACTS_*`              | Addresses of the rollups-contracts v3.0.0-alpha.10 contracts on your chain, see [Deployed contracts](#deployed-contracts) |

:::warning Block policy
- Use `finalized`. With `latest` or `safe`, a reorg can invalidate inputs and claims that the node already stored. The node does not roll them back, and you may have to rebuild its database. The compose file used below falls back to `latest` if you do not set the variable.
- The node saves the policy in its database when each service first starts, and a later mismatch stops the services at startup. To change the policy, start over with a fresh database.
:::

:::danger Security
Do not commit private keys. Use Docker secrets or a file-backed key in any environment that is not a throwaway testnet; see [Scope the signing key](#scope-the-signing-key).
:::

## Setting up the local node

1. **Download the compose file into the project root** (alongside `.cartesi/`):

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

2. **Build the application snapshot:**

   ```shell
   cartesi build
   ```

   `cartesi build` compiles your application for RISC-V and writes the machine snapshot to `.cartesi/image/`. The node can load the snapshot only if it was built with the emulator line of the node release: 0.22.x for rollups-node v2.0.0-alpha.14. The SDK image that `cartesi build` runs sets the emulator version: Cartesi CLI 2.0.0-alpha.42 uses `cartesi/sdk:0.12.0-alpha.45`, which ships emulator 0.22.0, by default. You can pin it with the top-level `sdk` key of `cartesi.toml`. If the node cannot load the snapshot, it marks the application `FAILED` (see [Operating the node](#operating-the-node)).

   `cartesi hash` prints the snapshot's template hash (`0x…`), which the [direct factory calls](#direct-factory-calls) need.

3. **Start the stack:**

   ```shell
   docker compose -f compose.local.yaml --env-file .env up -d
   ```

   This starts the node's services (`database`, `evm-reader`, `advancer`, `validator`, `claimer` and `jsonrpc-api`) with the configuration from your `.env` file, and mounts `.cartesi/image` into the `advancer` at `/var/lib/cartesi-rollups-node/snapshot`.

## Deploying the application

The node is running. Next, create the on-chain contracts and register the application on the node. Factory addresses are under [Deployed contracts](#deployed-contracts). The commands below match **rollups-contracts v3.0.0-alpha.10** ([interfaces](https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10)).

Choose a deployment method:

- **One-shot CLI (default):** deploys a new Authority and Application, then registers the application.
- **CLI two-step (alternative):** deploys the Authority first, then deploys and registers the Application.
- **Direct factory calls (alternative):** provides granular on-chain control for scripts and multisigs. Registration is a separate required step.

Every method deploys an Authority: the node only submits claims to an authority owned by its own signer (`CARTESI_AUTH_PRIVATE_KEY`).

### One-shot CLI (default)

This method creates a new Authority and Application in one call, through the `SelfHostedApplicationFactory`, then registers the application on the node:

```shell
docker compose -f compose.local.yaml exec advancer \
   cartesi-rollups-cli deploy application <app-name> /var/lib/cartesi-rollups-node/snapshot \
   --epoch-length <epoch-length> \
   --claim-staging-period <claim-staging-period> \
   --salt <salt> \
   --register
```

Replace `<app-name>` with your application name and `<salt>` with a random 32-byte value. The salt seeds the deterministic contract addresses, so it must not be reused: a second deployment with the same salt and arguments reverts. Generate one with:

```shell
cast keccak "your-unique-string"
```

The Authority is owned by the node's signer, and the Application is deployed without an owner (`--application-owner` is not supported for this method). Both values below are fixed in the consensus contract at deployment:

- `--epoch-length` is the epoch length in blocks (default 10). The node submits a claim for each epoch that received inputs once the epoch has ended, and the outputs of that epoch (vouchers and notices) become executable only after the claim is accepted.
- `--claim-staging-period` is the number of blocks a staged claim must wait before it can be accepted (default 0, which allows immediate acceptance). It is the window in which a guardian can foreclose the application before a claim takes effect, so with 0 there is no such window. A standard deployment has no guardian; if you deploy [with emergency withdrawal](./with-emergency-withdrawal.md), size this period above the time your guardian needs to react.

To size the epoch length:

- With `finalized`, the node sees the end of an epoch, and later its staged claim, only once they are finalized. An epoch's outputs therefore become executable at least two finality delays after the epoch ends, or one finality delay plus the claim staging period if that is longer, plus the time to include the node's transactions.
- Each claim costs two transactions from the node's signer (submit and accept), and the node normally sends one transaction at a time per signer, waiting until each is mined. Short epochs that keep receiving inputs produce more claims to pay for and to send; keep the total claim load of all applications on the node well below one transaction per block.

On success the command prints the application contract address and registers the application on the node. If the command reports an error, first check whether the application was deployed anyway, as described in [Operating the node](#operating-the-node), and register it instead of deploying again. If nothing was deployed, use one of the alternatives below.

### CLI two-step (alternative) {#cli-two-step}

Use this method when you want a dedicated Authority, for example one owned by another address with `--authority-owner`, or to deploy several applications against the same Authority.

1. Deploy an Authority:

   ```shell
   docker compose -f compose.local.yaml exec advancer \
      cartesi-rollups-cli deploy authority \
      --epoch-length <epoch-length> \
      --claim-staging-period <claim-staging-period>
   ```

   The command prints the address of the new Authority. The epoch length and the claim staging period are the values described in [One-shot CLI](#one-shot-cli-default).

2. Deploy and register the application against that Authority:

   ```shell
   docker compose -f compose.local.yaml exec advancer \
      cartesi-rollups-cli deploy application <app-name> /var/lib/cartesi-rollups-node/snapshot \
      --consensus <authority-address> \
      --salt <salt> \
      --register
   ```

   With `--consensus`, the CLI deploys the application through the `ApplicationFactory`, reads the epoch length and the claim staging period from the Authority contract, and ignores `--epoch-length` and `--claim-staging-period`. The application owner defaults to the node's signer; set another one with `--application-owner`.

### Direct factory calls (alternative) {#direct-factory-calls}

Use direct factory calls for multisigs, scripts, or to predict addresses before broadcasting. They only deploy the contracts on-chain; after either route below, complete [Registering a cast-deployed application](#registering-a-cast-deployed-application).

Pick one route; do not run both. Each deploys an Authority and an Application for the same app.

#### Prepare the deployment values

Set the shared values used by whichever route you choose:

```shell
RPC_URL=<http-endpoint>
PRIVATE_KEY=<funded-private-key>
AUTHORITY_OWNER=<node-signer-address>   # the address of CARTESI_AUTH_PRIVATE_KEY
APP_OWNER="$AUTHORITY_OWNER"            # Route A only
EPOCH_LENGTH=10
CLAIM_STAGING_PERIOD=<blocks>
TEMPLATE_HASH=<template-hash>           # from `cartesi hash`
SALT=$(cast keccak "your-unique-string")
INPUT_BOX=0xEbE9f4Dfc04ae10bBeE663859c3dc5A23f94eA3C

# No emergency withdrawal: a zero WithdrawalConfig
# (guardian, log2LeavesPerAccount, log2MaxNumOfAccounts, accountsDriveStartIndex, withdrawalOutputBuilder)
WITHDRAWAL_CONFIG='(0x0000000000000000000000000000000000000000,0,0,0,0x0000000000000000000000000000000000000000)'
```

For a full emergency-withdrawal config, see [Deployment with emergency withdrawal](./with-emergency-withdrawal.md).

#### Route A: Authority and Application factories

Deploy the Authority and the Application in **two transactions**. Use this route when you need separate broadcasts (for example a multisig that signs the Authority and the Application independently) or when the Authority already exists and you only deploy the Application.

Predict each address, then deploy with the same salt and arguments. The application calls use the predicted Authority address, stored in `AUTHORITY`.

```shell
AUTHORITY_FACTORY=0xB4d29c86e36385b5321a453C34D288AEB0ad11f9
APPLICATION_FACTORY=0x35Cd91f13141Bb6A6FC69E1eeDD241bbA1Ddd45F

AUTHORITY=$(cast call "$AUTHORITY_FACTORY" \
  "calculateAuthorityAddress(address,uint256,uint256,bytes32)(address)" \
  "$AUTHORITY_OWNER" "$EPOCH_LENGTH" "$CLAIM_STAGING_PERIOD" "$SALT" \
  --rpc-url "$RPC_URL")
echo "$AUTHORITY"

cast send "$AUTHORITY_FACTORY" \
  "newAuthority(address,uint256,uint256,bytes32)" \
  "$AUTHORITY_OWNER" "$EPOCH_LENGTH" "$CLAIM_STAGING_PERIOD" "$SALT" \
  --private-key "$PRIVATE_KEY" --rpc-url "$RPC_URL"

APPLICATION=$(cast call "$APPLICATION_FACTORY" \
  "calculateApplicationAddress(address,address,bytes32,address,(address,uint8,uint8,uint64,address),bytes32)(address)" \
  "$AUTHORITY" "$APP_OWNER" "$TEMPLATE_HASH" "$INPUT_BOX" \
  "$WITHDRAWAL_CONFIG" "$SALT" \
  --rpc-url "$RPC_URL")
echo "$APPLICATION"

cast send "$APPLICATION_FACTORY" \
  "newApplication(address,address,bytes32,address,(address,uint8,uint8,uint64,address),bytes32)" \
  "$AUTHORITY" "$APP_OWNER" "$TEMPLATE_HASH" "$INPUT_BOX" \
  "$WITHDRAWAL_CONFIG" "$SALT" \
  --private-key "$PRIVATE_KEY" --rpc-url "$RPC_URL"
```

Without a salt, use `newAuthority(address,uint256,uint256)` and `newApplication(address,address,bytes32,address,(address,uint8,uint8,uint64,address))`, and read the addresses from the `AuthorityCreated` and `ApplicationCreated` events.

#### Route B: Self-hosted factory {#route-b-self-hosted-factory}

Deploy the Authority and the Application in **one transaction** through [`ISelfHostedApplicationFactory`](https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.10/src/dapp/ISelfHostedApplicationFactory.sol), as the one-shot CLI does. The Application is deployed without an owner.

Run `calculateAddresses` first and confirm the predicted addresses before broadcasting `deployContracts`:

```shell
SELF_HOSTED_FACTORY=0x9e6866A965dC5f99f95EF6B0d8399dad18eEf98b

cast call "$SELF_HOSTED_FACTORY" \
  "calculateAddresses(address,uint256,uint256,bytes32,address,(address,uint8,uint8,uint64,address),bytes32)(address,address)" \
  "$AUTHORITY_OWNER" "$EPOCH_LENGTH" "$CLAIM_STAGING_PERIOD" \
  "$TEMPLATE_HASH" "$INPUT_BOX" "$WITHDRAWAL_CONFIG" "$SALT" \
  --rpc-url "$RPC_URL"
# returns (application, authority)

cast send "$SELF_HOSTED_FACTORY" \
  "deployContracts(address,uint256,uint256,bytes32,address,(address,uint8,uint8,uint64,address),bytes32)" \
  "$AUTHORITY_OWNER" "$EPOCH_LENGTH" "$CLAIM_STAGING_PERIOD" \
  "$TEMPLATE_HASH" "$INPUT_BOX" "$WITHDRAWAL_CONFIG" "$SALT" \
  --private-key "$PRIVATE_KEY" --rpc-url "$RPC_URL"
```

## Registering a cast-deployed application

This step is **required after either direct factory route**. An on-chain deployment does not register the application in the node database. Do **not** re-run `deploy application` with the same salt: the CLI tries to deploy again and the transaction reverts.

1. Register the existing contract. The snapshot mounted on `advancer` must be the machine whose hash you deployed (`cartesi hash`):

   ```shell
   docker compose -f compose.local.yaml exec advancer \
     cartesi-rollups-cli app register \
     --name <app-name> \
     --address <application-address> \
     --template-path /var/lib/cartesi-rollups-node/snapshot
   ```

2. List the registered applications and confirm that the application `status` is `OK`:

   ```shell
   docker compose -f compose.local.yaml exec advancer cartesi-rollups-cli app list
   ```

## Deployed contracts

This node release uses **rollups-contracts v3.0.0-alpha.10**. The addresses are identical on Ethereum, Optimism, Arbitrum and Base, mainnet and testnets; only `BLOCKCHAIN_ID` and the HTTP RPC URL change per chain.

| Contract | Address |
| :-- | :-- |
| InputBox | `0xEbE9f4Dfc04ae10bBeE663859c3dc5A23f94eA3C` |
| AuthorityFactory | `0xB4d29c86e36385b5321a453C34D288AEB0ad11f9` |
| ApplicationFactory | `0x35Cd91f13141Bb6A6FC69E1eeDD241bbA1Ddd45F` |
| SelfHostedApplicationFactory | `0x9e6866A965dC5f99f95EF6B0d8399dad18eEf98b` |
| QuorumFactory | `0x0754D5Eb680c71bf469B39e48C5b64AB0813fdb9` |
| EtherPortal | `0x035b11Be55656c6cfC822D1CaE568C1Af2e497b0` |
| Erc20Portal | `0x3332DE61a8BB9aC84893b2f552Fe81C9a6dC5419` |
| Erc721Portal | `0x397c352d18DFf47CC8a6143403142cf7afd5Ff7E` |
| Erc1155SinglePortal | `0x585F56351A66f131E176a345662215C772f80451` |
| Erc1155BatchPortal | `0xee33550a22e3Cf6Cc265524dC9bcfD99D2307EBe` |
| RefundOutputBuilder | `0xff50b237b3e61cD810Bd1236644a887ec78762CF` |
| UsdWithdrawalOutputBuilderFactory | `0x60b8b3c0AecEb193755038fa9372FfE910E63e39` |
| SafeErc20Transfer | `0xBB7c5367B74544542F5cE553Ed0DF4B3efAfEEdD` |

The same addresses ship as the `cartesi-rollups-contracts-3.0.0-alpha.10-deployment-addresses.tar.gz` asset of the [v3.0.0-alpha.10 release](https://github.com/cartesi/rollups-contracts/releases/tag/v3.0.0-alpha.10), where the `deployments/<chain-id>/` directory holds the address of each contract.

- Set every `CARTESI_CONTRACTS_*` variable from this same set. Do not mix in addresses from other releases.
- Before using an address, check that it has code on your chain: `cast code <address> --rpc-url <RPC-URL>` must return non-empty bytecode.
- See [Supported networks](../introduction.md#supported-networks) for the chains, and for the Arbitrum caveat.

## Accessing the node

Once running, your local Cartesi Rollups Node is accessible through the standard APIs:

- Inspect: `http://localhost:10012/inspect/<application-address-or-name>`. The request body is the inspect payload, passed to the application as is:

  ```shell
  curl -s -X POST "http://localhost:10012/inspect/<application-address-or-name>" -d 'payload'
  ```

- JSON-RPC: `http://localhost:10011/rpc`:

  ```shell
  curl -s -X POST http://localhost:10011/rpc \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"cartesi_listInputs","params":{"application":"<app-name>"},"id":1}'
  ```

CORS is disabled by default on both endpoints, so a frontend served from another origin (for example, `http://localhost:3000`) cannot call them from the browser. To allow it, set `CARTESI_JSONRPC_CORS_ALLOWED_ORIGINS` and `CARTESI_INSPECT_CORS_ALLOWED_ORIGINS` to a comma-separated list of the allowed origins. The compose file does not pass these variables from `.env`, so add them to its `x-env` block.

## Operating the node

Run the `cartesi-rollups-cli` commands below inside the node, through `docker compose -f compose.local.yaml exec advancer`, as in the deployment steps.

- **Check the chain before deploying again.** The CLI prints `Transaction hash: <hash>` before it sends each transaction. If `deploy application` then reports an error, for example a provider timeout or a failure to register, the application may already exist on chain. Look up the transaction (`cast receipt <hash> --rpc-url <RPC-URL>`). If it succeeded and its logs include an `ApplicationCreated` event, do not deploy again: register the existing application, whose address is the last field of that event (`appContract`, the last 32-byte word of the log data), as in [Registering a cast-deployed application](#registering-a-cast-deployed-application).

- **Validate the application before you announce it.** The CLI does not check that the node can load your snapshot. Send a test input, from an account other than the node's signer, and check that the node processed it:

  ```shell
  cast send <InputBox-address> "addInput(address,bytes)" <application-address> 0x00 \
     --private-key <test-account-private-key> --rpc-url <RPC-URL>

  curl -s -X POST http://localhost:10011/rpc -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":1,"method":"cartesi_getProcessedInputCount","params":{"application":"<app-name>"}}'
  ```

  If the node cannot load the snapshot, for example because it was built with another emulator version, the application becomes `FAILED`. `cartesi-rollups-cli app status <app-name>` prints its status and the reason.

- **Keep the signer funded, and use it only for the node.** The node's signer (`CARTESI_AUTH_PRIVATE_KEY`) pays for every claim. If it runs out of funds, claims wait, the node logs that claim publication is waiting for funding, and outputs stop becoming executable. Fund the account and the node continues. The node expects to be the only process that sends from its signer, so do not send other transactions from this account while the node runs. The deploy commands in this guide sign with the same key: run them while the node has no claims to submit (for example, for the first application), or sign them with another funded key and pass the node signer's address as `--authority-owner`, so that the node still owns the Authority. If another transaction does take one of the signer's nonces, the node detects the change and retries.

- **Recover a `FAILED` application.** `FAILED` stops processing for that application. Read the reason with `cartesi-rollups-cli app status <app-name>`, fix the cause, then re-enable the application with `cartesi-rollups-cli app status <app-name> enabled`. Re-enabling restarts processing from the last snapshot; it does not repair state. A `CORRUPTED` application cannot be re-enabled: fix the cause and start over with a fresh database.

- **Snapshots and restarts.** By default the node stores no machine snapshots (snapshot policy `NONE`), so after each restart it re-executes every processed input of every application, starting from the template, before it processes new inputs. For long-running applications, set a snapshot policy, for example `cartesi-rollups-cli app execution-parameters set <app-name> snapshot_policy EVERY_EPOCH`. The node writes snapshots to `CARTESI_SNAPSHOTS_DIR`, which this compose file sets to the directory where `.cartesi/image` is mounted.

- **One node per database.** Run one node deployment per database, with one process per service. Stop the running processes completely before starting new ones, for example when you change the images. Changing the chain, the `CARTESI_BLOCKCHAIN_DEFAULT_BLOCK` policy or the signer of an existing database is not supported.

- **Providers that limit `eth_getLogs`.** The node splits its log queries into ranges of at most `CARTESI_BLOCKCHAIN_MAX_BLOCK_RANGE` blocks (default 2000). If your provider allows fewer blocks per `eth_getLogs` request, add this variable to the `x-env` block of the compose file with your provider's limit.

- **No guardian by default.** `deploy application` without a withdrawal config deploys an application with no guardian: nobody can foreclose it, and its users have no emergency withdrawal. If users will deposit assets into the application, pass a valid `--withdrawal-config-file` at deploy time; see the [deployment with emergency withdrawal](./with-emergency-withdrawal.md).

## Good practices

The walkthrough above is enough to get a testnet node running. Apply the following before the stack stays up, holds a funded key, or exposes APIs beyond localhost.

### Keep one process per container

Do not collapse the reader, advancer, validator, claimer and JSON-RPC services into one process except for short local experiments. They have different trust boundaries and failure modes.

### Scope the signing key

The sample compose puts `CARTESI_AUTH_PRIVATE_KEY` in the shared environment, so every service receives the funded key. Only `claimer` and the one-off `cartesi-rollups-cli deploy` commands need to sign. Give the key to those processes only (this guide runs the deploy commands in the `advancer` container; if you remove the key from it, run them where the key is available), preferably as a file-backed Docker secret (`CARTESI_AUTH_PRIVATE_KEY_FILE`), not an environment variable. Environment variables are readable through `docker inspect` and often appear in crash dumps.

The Authority deployed by `deploy` is owned by the signer unless you pass `--authority-owner`. Keep in mind that the node only submits claims to an Authority owned by its signer.

### Use dedicated database roles

The sample compose shares one Postgres role (`postgres`) and one database (`rollupsdb`). For any longer-lived deployment, create a dedicated database user per service, grant only the tables that service needs, and do not use the superuser in application containers. Give Postgres a named volume, and back it up. Inputs live in the InputBox on the base layer, so a node can be rebuilt from the chain plus the **exact** snapshot that produced the registered template hash. Keep that published snapshot, not only a local rebuild.

Also cap how many connections each role can open. Postgres has a global `max_connections`; without per-role limits, public inspect or JSON-RPC traffic can exhaust that pool and starve the reader, advancer and claimer. Give each role a Postgres `CONNECTION LIMIT`, run the public API under a **read-only** role with a low limit, and, as a client-side bound, set `?pool_max_conns=N` on `CARTESI_DATABASE_CONNECTION`.

### Limit what is published on the network

The compose publishes telemetry on ports `10001`–`10005` as well as inspect (`10012`) and JSON-RPC (`10011`). Bind telemetry to `127.0.0.1` or keep it on an internal network. Put inspect and JSON-RPC behind a reverse proxy with TLS, rate limiting, and a body-size cap.

Inspect runs on a temporary machine fork. An open inspect endpoint is an easy way to exhaust the host. The node logs `HTTP service bound to all interfaces; restrict access via firewall or reverse proxy` when it starts.

Drop the hardcoded `container_name` values if you intend to run more than one node on the same host; otherwise Compose cannot start a second stack.

### Pin images and verify the snapshot

Pin `cartesi/rollups-runtime` and `cartesi/rollups-database` by digest (`image@sha256:…`), not only by a mutable tag. Before registering, check that the snapshot is the [public snapshot](../snapshot.md) you intend to run, by recomputing its root hash as that page describes. Registering a local rebuild that does not match the published artifact means other validators cannot reproduce your machine.

### Restart, monitor, and rotate logs

Give every service a restart policy. Watch `evm-reader` specifically: it can exit while the other containers stay up, and the node then accepts no inputs. Alert on reader block lag, claim submission failures, and the gas balance of the claimer key. Configure log rotation. The advancer logs application stdout, so input payloads can end up in logs.
