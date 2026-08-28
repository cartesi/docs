> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: standard
title: Self-hosted deployment (standard)
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

This guide explains how to run a Cartesi Rollups node locally on your machine for development and testing on **testnet**.

:::warning Production Warning
**Do not use this compose file as a production deployment.**

It is a testnet-oriented starting point. It does not include public snapshot verification, proper security hardening, or production-grade infrastructure. See [Good practices](#good-practices) before running a longer-lived node.
:::

## Prerequisites

- Cartesi CLI 2.0
- Docker Desktop 4.x (Compose and Buildx)

See [installation](../../development/installation.md).

## Configuration

Create a `.env` file in the project root:

```shell
BLOCKCHAIN_ID=<blockchain-id>
AUTH_KIND=private_key
CARTESI_AUTH_PRIVATE_KEY=<funded-private-key>
BLOCKCHAIN_HTTP_ENDPOINT=<http-endpoint>
CARTESI_BLOCKCHAIN_DEFAULT_BLOCK=latest
```

| Variable                           | Description                                                          |
| ---------------------------------- | -------------------------------------------------------------------- |
| `BLOCKCHAIN_ID`                    | Chain ID of the target network                                       |
| `BLOCKCHAIN_HTTP_ENDPOINT`         | HTTP JSON-RPC endpoint for the base layer                            |
| `AUTH_KIND`                        | `private_key` for local and testnet experiments                      |
| `CARTESI_AUTH_PRIVATE_KEY`         | Funded private key for the selected chain                            |
| `CARTESI_BLOCKCHAIN_DEFAULT_BLOCK` | `latest` for testnet tip-tracking; `finalized` for reorg-safe reads  |

The EVM reader polls HTTP only. Do **not** set `BLOCKCHAIN_WS_ENDPOINT` or `CARTESI_BLOCKCHAIN_WS_ENDPOINT` with alpha.12: a blank or missing WS value crashes `evm-reader`.

Factory addresses default to cartesi-rollups 3.0.0-alpha.6 in the compose file. Override them in `.env` only if you are not using that suite.

:::danger Security
Do not commit private keys. Use Docker secrets or a file-backed key in any environment that is not a throwaway testnet.
:::

## Setting up the local node

1. **Download the compose file into the project root** (alongside `.cartesi/`):

   ```shell
   curl -L https://raw.githubusercontent.com/Mugen-Builders/deployment-setup-v2.0/main/compose.local.yaml -o compose.local.yaml
   ```

2. **Build the application snapshot:**

   ```shell
   cartesi build
   cartesi hash
   ```

   `cartesi build` writes the machine to `.cartesi/image/`. `cartesi hash` prints the template hash (`0x…`). Current CLI snapshots do not write `.cartesi/image/hash`, which `cartesi-rollups-cli` still reads by default, so pass `--template-hash` in the deploy step.

3. **Start the stack:**

   ```shell
   docker compose -f compose.local.yaml --env-file .env up -d
   docker compose -f compose.local.yaml exec advancer cartesi-rollups-node --version
   ```

   Expect `cartesi-rollups-node version 2.0.0-alpha.12`. All six Compose services should be running: `database`, `evm-reader`, `advancer`, `validator`, `claimer`, and `jsonrpc-api`.

## Deploying the application

The node is running. Next, create the on-chain contracts and register the app. Factory addresses are under [Deployed contracts](#deployed-contracts). The commands below match **cartesi-rollups 3.0.0-alpha.6** ([interfaces](https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.6)).

Choose a deployment method:

- **One-shot CLI (default):** deploys a new Authority and Application, then registers the app.
- **CLI two-step (alternative):** deploys the Authority first, then deploys and registers the Application.
- **Direct factory calls (alternative):** provides granular on-chain control for scripts and multisigs. Registration is a separate required step.

### One-shot CLI (default)

This method creates a new Authority and Application in one call, then registers the app on the node.

```shell
docker compose -f compose.local.yaml exec advancer \
   cartesi-rollups-cli deploy application <app-name> /var/lib/cartesi-rollups-node/snapshot \
   --epoch-length 10 \
   --salt <salt> \
   --template-hash <template-hash> \
   --register
```

Replace `<app-name>` with the application name and `<template-hash>` with the value from `cartesi hash`. The salt must be unique. Generate one with:

```shell
cast keccak256 "your-unique-string"
```

On success the command prints the application contract address and registers the app on the node.

:::caution
On alpha.12 testnet, this command has reverted with `execution reverted` on some runs. Fall back to [CLI two-step](#cli-two-step). [Route B: Self-hosted factory](#route-b-self-hosted-factory) calls the same on-chain factory via `cast` and may succeed when the CLI wrapper does not. Still complete [Registering a cast-deployed application](#registering-a-cast-deployed-application) afterward.
:::

Emergency-withdrawal apps should use [CLI two-step](#cli-two-step) from the start; see [Deployment with emergency withdrawal](./with-emergency-withdrawal.md).

### CLI two-step (alternative) {#cli-two-step}

Preferred when you need a dedicated Authority (including emergency-withdrawal apps) or when the one-shot command reverts.

1. Deploy an authority:

   ```shell
   docker compose -f compose.local.yaml exec advancer \
      cartesi-rollups-cli deploy authority --claim-staging-period <blocks>
   ```

   `claim-staging-period` is the number of base-layer blocks that must elapse after a claim is staged before it can be accepted. If you omit the flag, the CLI defaults to `0`.

2. Deploy and register the application against that authority:

   ```shell
   docker compose -f compose.local.yaml exec advancer \
      cartesi-rollups-cli deploy application <app-name> /var/lib/cartesi-rollups-node/snapshot \
      --epoch-length 10 \
      --consensus <Authority-contract> \
      --salt <salt> \
      --template-hash <template-hash> \
      --register
   ```

### Direct factory calls (alternative) {#direct-factory-calls}

Use direct factory calls for multisigs, scripts, or predicting addresses before broadcasting. They only deploy the contracts on-chain; after either route below, complete [Registering a cast-deployed application](#registering-a-cast-deployed-application).

Pick one route; do not run both. Each deploys an Authority and an Application for the same app.

#### Prepare the deployment values

Set the shared values used by whichever route you choose:

```shell
RPC_URL=<http-endpoint>
PRIVATE_KEY=<funded-private-key>
AUTHORITY_OWNER=$(cast wallet address --private-key "$PRIVATE_KEY")
APP_OWNER="$AUTHORITY_OWNER"
EPOCH_LENGTH=10
CLAIM_STAGING_PERIOD=0
TEMPLATE_HASH=<template-hash>   # from `cartesi hash`
SALT=$(cast keccak "your-unique-string")

INPUT_BOX=0x346B3df038FE9f8380071eC6514D5a83aD143939
# `calldata` includes the 4-byte selector (`0xb12c9ede…`). `abi-encode` does not, and CREATE2s a different app.
DATA_AVAILABILITY=$(cast calldata "InputBox(address)" "$INPUT_BOX")

WITHDRAWAL_CONFIG='(0x0000000000000000000000000000000000000000,0,0,0,0x0000000000000000000000000000000000000000)'
```

For a full emergency-withdrawal config, see [Deployment with emergency withdrawal](./with-emergency-withdrawal.md).

#### Route A: Authority and Application factories

Deploy the Authority and Application in **two transactions**. Use this route when you need separate broadcasts (for example a multisig that signs Authority and Application independently) or when the Authority already exists and you only deploy the Application.

Predict each address, then deploy with the same salt and arguments. Set `AUTHORITY` to the address returned by `calculateAuthorityAddress` before the application calls.

```shell
AUTHORITY_FACTORY=0x3C1FE01c542a88A523FF6847eD1E26176c8C4ED0
APPLICATION_FACTORY=0xC549F89cF1ca43eDDECC64Ac2208F4b283B1c483

cast call "$AUTHORITY_FACTORY" \
  "calculateAuthorityAddress(address,uint256,uint256,bytes32)(address)" \
  "$AUTHORITY_OWNER" "$EPOCH_LENGTH" "$CLAIM_STAGING_PERIOD" "$SALT" \
  --rpc-url "$RPC_URL"

cast send "$AUTHORITY_FACTORY" \
  "newAuthority(address,uint256,uint256,bytes32)" \
  "$AUTHORITY_OWNER" "$EPOCH_LENGTH" "$CLAIM_STAGING_PERIOD" "$SALT" \
  --private-key "$PRIVATE_KEY" --rpc-url "$RPC_URL"

cast call "$APPLICATION_FACTORY" \
  "calculateApplicationAddress(address,address,bytes32,bytes,(address,uint8,uint8,uint64,address),bytes32)(address)" \
  "$AUTHORITY" "$APP_OWNER" "$TEMPLATE_HASH" "$DATA_AVAILABILITY" \
  "$WITHDRAWAL_CONFIG" "$SALT" \
  --rpc-url "$RPC_URL"

cast send "$APPLICATION_FACTORY" \
  "newApplication(address,address,bytes32,bytes,(address,uint8,uint8,uint64,address),bytes32)" \
  "$AUTHORITY" "$APP_OWNER" "$TEMPLATE_HASH" "$DATA_AVAILABILITY" \
  "$WITHDRAWAL_CONFIG" "$SALT" \
  --private-key "$PRIVATE_KEY" --rpc-url "$RPC_URL"
```

Without salt, use `newAuthority(address,uint256,uint256)` and `newApplication(address,address,bytes32,bytes,(address,uint8,uint8,uint64,address))` and read addresses from the `AuthorityCreated` / `ApplicationCreated` events.

#### Route B: Self-hosted factory {#route-b-self-hosted-factory}

Deploy the Authority and Application in **one transaction** via [`ISelfHostedApplicationFactory`](https://github.com/cartesi/rollups-contracts/blob/v3.0.0-alpha.6/src/dapp/ISelfHostedApplicationFactory.sol). Use `calculateAddresses` and `deployContracts` with a shared salt. This matches the one-shot CLI semantics without going through `cartesi-rollups-cli`.

Run `calculateAddresses` first and confirm the predicted Application and Authority addresses before broadcasting `deployContracts`.

```shell
SELF_HOSTED_FACTORY=0x6145C5996a71a379E030aEb0440df79D60833418

cast call "$SELF_HOSTED_FACTORY" \
  "calculateAddresses(address,uint256,uint256,address,bytes32,bytes,(address,uint8,uint8,uint64,address),bytes32)(address,address)" \
  "$AUTHORITY_OWNER" "$EPOCH_LENGTH" "$CLAIM_STAGING_PERIOD" \
  "$APP_OWNER" "$TEMPLATE_HASH" "$DATA_AVAILABILITY" \
  "$WITHDRAWAL_CONFIG" "$SALT" \
  --rpc-url "$RPC_URL"
# returns (application, authority)

cast send "$SELF_HOSTED_FACTORY" \
  "deployContracts(address,uint256,uint256,address,bytes32,bytes,(address,uint8,uint8,uint64,address),bytes32)" \
  "$AUTHORITY_OWNER" "$EPOCH_LENGTH" "$CLAIM_STAGING_PERIOD" \
  "$APP_OWNER" "$TEMPLATE_HASH" "$DATA_AVAILABILITY" \
  "$WITHDRAWAL_CONFIG" "$SALT" \
  --private-key "$PRIVATE_KEY" --rpc-url "$RPC_URL"
```

## Registering a cast-deployed application

This step is **required after either direct factory route**. An on-chain deployment does not register the app in the node database. Do **not** re-run `deploy application` with the same salt: the CLI tries to deploy again and reverts with `application … already exists`.

1. Register the existing contract. The snapshot mounted on `advancer` must be the machine whose hash you deployed (`cartesi hash` / `--template-hash`).

   ```shell
   docker compose -f compose.local.yaml exec advancer \
     cartesi-rollups-cli app register \
     -n <app-name> \
     -a <application-address> \
     -t /var/lib/cartesi-rollups-node/snapshot
   ```

2. List the registered applications:

   ```shell
   docker compose -f compose.local.yaml exec advancer cartesi-rollups-cli app list
   ```

3. Confirm that the application `status` is `OK`.

`app` is not on `PATH` by itself; use `cartesi-rollups-cli app list`.

## Deployed contracts

This node version uses **cartesi-rollups 3.0.0-alpha.6**. Infrastructure addresses are identical on Ethereum, Optimism, Arbitrum, and Base (mainnet and Sepolia). Only `BLOCKCHAIN_ID` and the HTTP RPC URL change per chain.

| Contract | Address |
| :-- | :-- |
| InputBox | `0x346B3df038FE9f8380071eC6514D5a83aD143939` |
| AuthorityFactory | `0x3C1FE01c542a88A523FF6847eD1E26176c8C4ED0` |
| ApplicationFactory | `0xC549F89cF1ca43eDDECC64Ac2208F4b283B1c483` |
| SelfHostedApplicationFactory | `0x6145C5996a71a379E030aEb0440df79D60833418` |
| QuorumFactory | `0x1f94009389F408B8D0ADfFcF8BBDCe5552BaCa5F` |
| ERC20Portal | `0x22E57511C30CcE6CDaa742E13CE3b774fDC663b1` |

Rollups contract deployment addresses are also published with each [rollups-contracts release](https://github.com/cartesi/rollups-contracts/releases) as `cartesi-rollups-contracts-<version>-deployment-addresses.tar.gz`. Use the suite that matches the node you run; API reference pages may track a newer contracts alpha than this compose pin.

## Accessing the node

Once running, your local Cartesi Rollups Node will be accessible through the standard APIs:

- Inspect endpoint: `http://localhost:10012/inspect/<application-address-or-name>`

```shell
curl -s -X POST "http://localhost:10012/inspect/<application-address-or-name>" \
  -H "Content-Type: application/json" \
  -d '{"payload":"0x"}'
```

- JSON-RPC is `http://localhost:10011/rpc`:

```shell
curl -s -X POST http://localhost:10011/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"cartesi_listInputs","params":["<app-name>"],"id":1}'
```

## Good practices

The walkthrough above is enough to get a testnet node running. Apply the following before the stack stays up, holds a funded key, or exposes APIs beyond localhost.

### Keep one process per container

Do not collapse reader, advancer, validator, claimer, and JSON-RPC into one process except for short local experiments. They have different trust boundaries and failure modes.

### Scope the signing key

The sample compose puts `CARTESI_AUTH_PRIVATE_KEY` in the shared environment, so every service receives the funded key. Only `claimer` and the one-off `deploy` CLI need to sign. Give the key to those processes only, preferably as a file-backed Docker secret (`CARTESI_AUTH_PRIVATE_KEY_FILE`), not an environment variable. Env vars are readable via `docker inspect` and often appear in crash dumps.

`deploy application` derives both the application owner and the authority owner from the auth key unless you pass `--application-owner` / `--authority-owner`. Use a separate cold owner key from the hot claiming key.

### Use dedicated database roles

The sample compose shares one Postgres role (`postgres`) and one database (`rollupsdb`). For any longer-lived deployment, create a dedicated database user per service, grant only the tables that service needs, and do not use the superuser in application containers. Give Postgres a named volume, and back it up. Inputs live in the InputBox on L1, so a node can be rebuilt from chain plus the **exact** snapshot that produced the registered template hash. Keep that published snapshot, not only a local rebuild.

Also cap how many connections each role can open. Postgres has a global `max_connections`; without per-role limits, public inspect or JSON-RPC traffic can exhaust that pool and starve reader, advancer, and claimer. Give each role a Postgres `CONNECTION LIMIT`, run the public API under a **read-only** role with a low limit, and as a client-side bound set `?pool_max_conns=N` on `CARTESI_DATABASE_CONNECTION`.

### Limit what is published on the network

The compose publishes telemetry on ports `10001`–`10005` as well as inspect (`10012`) and JSON-RPC (`10011`). Bind telemetry to `127.0.0.1` or keep it on an internal network. Put inspect and JSON-RPC behind a reverse proxy with TLS, rate limiting, and a body-size cap.

Inspect runs on a temporary machine fork. An open inspect endpoint is an easy way to exhaust the host. The node logs `HTTP service bound to all interfaces; restrict access via firewall or reverse proxy` when it starts.

Drop hardcoded `container_name` values if you intend to run more than one application on the same host; otherwise Compose cannot start a second stack.

### Choose a default block and cap RPC ranges

Use `CARTESI_BLOCKCHAIN_DEFAULT_BLOCK=finalized` whenever the node submits claims of value. `latest` is for fast local iteration; a reorg can orphan inputs the node already processed. Hosted RPC providers cap `eth_getLogs` ranges. Set a maximum block range on the EVM reader (for example `--max-block-range`) so a resync from an old InputBox deployment block does not fail against Infura or Alchemy.

### Pin images and verify the snapshot

Pin `cartesi/rollups-runtime` and `cartesi/rollups-database` by digest (`image@sha256:…`), not only a mutable tag. Before `--register`, compare `cartesi hash` with the hash of the [public snapshot](../snapshot.md) you intend to run. Registering a local rebuild that does not match the published artifact means other validators cannot reproduce your machine.

### Restart, monitor, and rotate logs

Give every service a restart policy. Watch `evm-reader` specifically: it can exit while the other containers stay up, and the node then accepts no inputs. Alert on reader block lag, claim submission failures, and the gas balance of the claimer key. Configure log rotation. The advancer logs application stdout, so input payloads can end up in logs.

### Set a withdrawal guardian for apps that custody assets

A zero-address guardian means no foreclosure path. If the application holds funds, pass a valid `--withdrawal-config-file` at deploy time so a guardian can foreclose if claims go wrong. See [Deployment with emergency withdrawal](./with-emergency-withdrawal.md).
