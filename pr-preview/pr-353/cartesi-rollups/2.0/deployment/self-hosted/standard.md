> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: standard
title: Self-hosted deployment (standard)
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

This guide explains how to run a Cartesi Rollups node on your machine for **testnet** development and testing.

:::warning Production Warning
**Do not use this compose file as a production deployment.**

It is a testnet-oriented starting point. It does not include public snapshot verification, production-grade secrets, high availability, or hardened Postgres.
:::

## Node topology

The [Mugen-Builders compose file](https://github.com/Mugen-Builders/deployment-setup-v2.0) already runs **one process per container**, not a single combined node:

| Service | Role |
| :-- | :-- |
| `database` | Postgres |
| `evm-reader` | Reads L1 inputs and related events |
| `advancer` | Runs the Cartesi Machine; serves inspect |
| `validator` | Computes epoch claims and proofs |
| `claimer` | Submits claims on-chain |
| `jsonrpc-api` | JSON-RPC query API |

Keep that split. Do not collapse reader, advancer, validator, claimer, and JSON-RPC into one process except for short local experiments.

The sample compose shares one Postgres role (`postgres`) and one database (`rollupsdb`). That is acceptable only for this testnet compose. For any longer-lived deployment, create a **dedicated database user per service**, grant only the tables that service needs, and do not use the superuser in application containers.

The EVM reader **polls HTTP**. `BLOCKCHAIN_HTTP_ENDPOINT` is required. A WebSocket endpoint is optional and is not required for reading blocks.

Pin runtime and database image tags to the rollups-node release you intend to run. The compose file on GitHub may lag a newer node alpha.

## Prerequisites

- Cartesi CLI 2.0 (currently alpha)
- Docker Desktop 4.x (Compose and Buildx)

- Cartesi CLI: An easy-to-use tool for developing and deploying your dApps.

- Docker Desktop 4.x: The required tool to distribute the Cartesi Rollups framework and its dependencies.

For more details about the installation process for each of these tools, please refer to the [this section](../../development/installation.md).

## Configuration

Create a `.env` file in the project root:

```shell
BLOCKCHAIN_ID=<blockchain-id>
AUTH_KIND="private_key"
CARTESI_AUTH_PRIVATE_KEY="<funded-private-key>"
BLOCKCHAIN_HTTP_ENDPOINT="<http-endpoint>"
CARTESI_BLOCKCHAIN_DEFAULT_BLOCK="<latest or finalized>"
```

| Variable                           | Description                                                          |
| ---------------------------------- | -------------------------------------------------------------------- |
| `BLOCKCHAIN_ID`                    | Chain ID of the target network                                       |
| `BLOCKCHAIN_HTTP_ENDPOINT`         | HTTP JSON-RPC endpoint for the base layer                            |
| `AUTH_KIND`                        | `private_key` for local and testnet experiments                      |
| `CARTESI_AUTH_PRIVATE_KEY`         | Funded private key for the selected chain                            |
| `CARTESI_BLOCKCHAIN_DEFAULT_BLOCK` | `latest` or `finalized`                                              |

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
   ```

3. **Start the stack:**

   ```shell
   docker compose -f compose.local.yaml --env-file .env up -d
   ```

4. **Deploy and register the application:**

   ```shell
   docker compose --project-name cartesi-rollups-node \
      exec advancer cartesi-rollups-cli deploy application <app-name> /var/lib/cartesi-rollups-node/snapshot \
      --epoch-length 10 \
      --salt <salt> \
      --register
   ```

   Replace `<app-name>` with the application name. The salt must be unique. Generate one with:

   ```shell
   cast keccak256 "your-unique-string"
   ```

   If deployment fails, fall back to deploying authority and application contracts separately.

   ### Manual deployment fallback

   1. Deploy an authority with `cast`. Capture the returned address (the `sed` call normalizes it):

      ```shell
      cast send <AuthorityFactory-Address> "newAuthority(address,uint256)" <Application-Owner-Address> \
      10 --private-key <PRIVATE-KEY> --rpc-url <RPC-URL>\
      --json | jq -r '.logs[-1].data' | sed 's/^0x000000000000000000000000/0x/'
      ```

      Factory, portal, and InputBox addresses for the target chain are listed under **Deployed contracts** below.

   2. Register the snapshot against that authority:

      ```shell
      docker compose --project-name cartesi-rollups-node \
         exec advancer cartesi-rollups-cli deploy application <app-name> /var/lib/cartesi-rollups-node/snapshot \
         --epoch-length 10 \
         --consensus <Authority-contract> \
         --json
      ```

      On success the command returns the application contract address.

## Deployed contracts

Rollups contract addresses for supported networks:

- [Cannon Devnet](https://usecannon.com/packages/cartesi-rollups/2.2.0/13370-main/deployment/contracts)
- [Ethereum Sepolia](https://usecannon.com/packages/cartesi-rollups/2.2.0/11155111-main/deployment/contracts)
- [Arbitrum Sepolia](https://usecannon.com/packages/cartesi-rollups/2.2.0/421614-main/deployment/contracts)
- [OP Sepolia](https://usecannon.com/packages/cartesi-rollups/2.2.0/11155420-main/deployment/contracts)
- [Base Sepolia](https://usecannon.com/packages/cartesi-rollups/2.2.0/84532-main/deployment/contracts)

Use the Cannon package version that matches the contract suite your node was built against.

## Accessing the node

- Inspect: `http://localhost:10012/inspect/<application-address>`
- JSON-RPC: `http://localhost:10011/rpc`
