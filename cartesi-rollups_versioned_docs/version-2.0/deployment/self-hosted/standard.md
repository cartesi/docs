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

## Configuration

Before running the node, you need to configure your `.env` file with the following environment variables:

```shell
BLOCKCHAIN_ID=<blockchain-id>
AUTH_KIND="private_key"
CARTESI_AUTH_PRIVATE_KEY="<funded-private-key>"
BLOCKCHAIN_WS_ENDPOINT="<ws-endpoint>"
BLOCKCHAIN_HTTP_ENDPOINT="<http-endpoint>"
CARTESI_BLOCKCHAIN_DEFAULT_BLOCK="<latest or finalized>"
```

**Important notes:**

| Variable                           | Description                                                          |
| ---------------------------------- | -------------------------------------------------------------------- |
| `BLOCKCHAIN_ID`                    | Replace `<blockchain-id>` with your blockchain network ID            |
| `BLOCKCHAIN_WS_ENDPOINT`           | Replace `<ws-endpoint>` with your WebSocket endpoint                 |
| `BLOCKCHAIN_HTTP_ENDPOINT`         | Replace `<http-endpoint>` with your HTTP endpoint                    |
| `AUTH_KIND`                        | Set to `private_key` for local development                           |
| `CARTESI_AUTH_PRIVATE_KEY`         | Replace `<funded-private-key>` with a private key for selected chain |
| `CARTESI_BLOCKCHAIN_DEFAULT_BLOCK` | Set to either `latest` or `finalized`                                |

:::danger Security
Ensure to follow best practices when handling private keys during local development and deployment to production.
:::

## Setting up the local node

1. **Download the Cartesi Rollups Node docker compose file in your project root:**

   ```shell
   curl -L https://raw.githubusercontent.com/Mugen-Builders/deployment-setup-v2.0/main/compose.local.yaml -o compose.local.yaml
   ```

2. **Build the application with the Cartesi CLI:**

   ```shell
   cartesi build
   ```

   This command compiles your application into RISC-V architecture and creates a Cartesi machine snapshot locally.

3. **Run the Cartesi Rollups Node with the application's initial snapshot attached:**

   ```shell
   docker compose -f compose.local.yaml --env-file .env up -d
   ```

   This starts the local node using the configuration from your `.env` file.

4. **Deploy and register the application to the node:**

   ```shell
   docker compose --project-name cartesi-rollups-node \
      exec advancer cartesi-rollups-cli deploy application <app-name> /var/lib/cartesi-rollups-node/snapshot \
      --epoch-length 10 \
      --claim-staging-period <blocks> \
      --salt <salt> \
      --register
   ```

   Replace `<app-name>` with your application name, `<blocks>` with the required claim-staging period, and `<salt>` with a unique identifier. The salt must be unique for each deployment and cannot be repeated. You can generate a unique salt using:

   ```shell
   cast keccak256 "your-unique-string"
   ```

   After this process, you'll have your application deployed and registered to the node.

   If deployment fails during the automated process, fall back to manually deploying the authority and application contracts.

   ### Manual deployment fallback

   1. Deploy an authority contract with `cast`. Replace each placeholder with the expected value, and grab the returned address from the command output (the final `sed` call normalizes the address).

      ```shell
      cast send <AuthorityFactory-Address> "newAuthority(address,uint256,uint256)" <Authority-Owner-Address> \
      10 <claim-staging-period> --private-key <PRIVATE-KEY> --rpc-url <RPC-URL>\
      --json | jq -r '.logs[-1].data' | sed 's/^0x000000000000000000000000/0x/'
      ```

   You can find the AuthorityFactory, portal, and InputBox addresses for your target chain in the **Deployed contracts** section below. Replace `<AuthorityFactory-Address>` with the appropriate address.

   2. Use the address you got above as the `<Authority-contract>` in the deploy command below. This command re-runs the snapshot registration using the specified authority and epoch values.

      ```shell
      docker compose --project-name cartesi-rollups-node \
         exec advancer cartesi-rollups-cli deploy application <app-name> /var/lib/cartesi-rollups-node/snapshot \
         --epoch-length 10 \
         --consensus <Authority-contract> \
         --json
      ```

      On success, this command deploys and registers the Application, then returns its contract address. Record the address for later interactions.

## Deployed contracts

The commands require addresses for the InputBox, portals, Application factory, and Authority factory from one contract deployment. Use the verified `deployments/<chain-id>` artifact published with the Rollups Contracts release. See [Use published contract addresses](../introduction.md#use-published-contract-addresses).

## Accessing the node

Once running, your local Cartesi Rollups Node will be accessible through the standard APIs:

- Inspect endpoint: `http://localhost:10012/inspect/<application-address>`
- JSON-RPC endpoint: `http://localhost:10011/rpc`
