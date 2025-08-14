---
id: self-hosted
title: Self-hosted deployment
---

This guide explains how to run a Cartesi Rollups node locally on your machine for development and testing purposes on **testnet** or **mainnet**.

:::warning Production Warning
**This self-hosted approach should NOT be used in *production*.** 

While this setup works with mainnet and testnet environments, it's designed exclusively for development purposes. It lacks critical production requirements such as:

- Public snapshot verification
- Proper security hardening
- Production-grade infrastructure
:::

## Prerequisites

Before starting, ensure you have the following installed:
- Docker and Docker Compose
- [Cartesi CLI](https://www.google.com/search?q=cartesi+cli&sourceid=chrome&ie=UTF-8)

## Configuration

Before running the node, you need to configure your `.env` file with the following environment variables:

```shell
BLOCKCHAIN_ID=<blockchain-id>
AUTH_KIND="private_key_file"
PRIVATE_KEY_FILE="/run/secrets/pk"
BLOCKCHAIN_WS_ENDPOINT="<ws-endpoint>"
BLOCKCHAIN_HTTP_ENDPOINT="<http-endpoint>"
```

**Important notes:**

| Variable | Description |
|----------|-------------|
| `BLOCKCHAIN_ID` | Replace `<blockchain-id>` with your blockchain network ID |
| `BLOCKCHAIN_WS_ENDPOINT` | Replace `<ws-endpoint>` with your WebSocket endpoint |
| `BLOCKCHAIN_HTTP_ENDPOINT` | Replace `<http-endpoint>` with your HTTP endpoint |
| `PRIVATE_KEY_FILE` | Points to the private key file created in [**step 2**](#setting-up-the-local-node) |
| `AUTH_KIND` | Set to `"private_key_file"` for local development |

## Setting up the local node

1. **Download the Cartesi Rollups Node docker compose file in your project root:**

   ```shell
   curl -L https://raw.githubusercontent.com/cartesi/docs/refs/heads/docs/deployment/cartesi-rollups_versioned_docs/version-2.0/deployment/src/compose.local.yaml -o compose.local.yaml
   ```

2. **Create a secret for private key storage:**

   ```shell
   mkdir -p secrets
   echo "YOUR_PRIVATE_KEY" > secrets/pk
   ```

   Replace `YOUR_PRIVATE_KEY` with your actual private key.

3. **Build the application with the Cartesi CLI:**

   ```shell
   cartesi build
   ```

   This command compiles your application into RISC-V architecture and creates a Cartesi machine snapshot.

4. **Run the Cartesi Rollups Node with the application's initial snapshot attached:**

   ```shell
   docker compose --env-file .env up -d
   ```

   This starts the local node using the configuration from your `.env` file.

5. **Deploy and register the application to the node:**

   ```shell
   docker compose --project-name cartesi-rollups-node \
        exec advancer cartesi-rollups-cli deploy application <app-name> /var/lib/cartesi-rollups-node/snapshot \
        --epoch-length 720 \
        --self-hosted \
        --salt <salt> \
        --json
   ```

   Replace `<app-name>` with your application name and `<salt>` with a unique identifier. You can generate a salt using:
   ```shell
   cast keccak256 "your-unique-string"
   ```

## Accessing the node

Once running, your local Cartesi Rollups node will be accessible through the standard APIs:
- Inspect endpoint
- JSON-RPC endpoint