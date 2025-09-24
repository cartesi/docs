---
id: self-hosted
title: Self-hosted deployment
---

This guide explains how to run a Cartesi Rollups node locally on your machine for development and testing purposes on **testnet**.

:::warning Production Warning
**This self-hosted approach should NOT be used in *production*.** 

While this setup works with testnet environments, it's designed exclusively for development purposes. It lacks critical production requirements such as:

- Public snapshot verification
- Proper security hardening
- Production-grade infrastructure
:::

## Prerequisites

Before starting, ensure you have the following installed:

- Cartesi CLI: An easy-to-use tool for developing and deploying your dApps.

- Docker Desktop 4.x: The required tool to distribute the Cartesi Rollups framework and its dependencies.

For more details about the installation process for each of these tools, please refer to the [this section](../development/installation.md).

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

   :::danger Security
   Ensure the `secrets/` directory is in a secure location and has restricted permissions, different from the project root to avoid leaking your private key.
   :::

3. **Build the application with the Cartesi CLI:**

   ```shell
   cartesi build
   ```

   This command compiles your application into RISC-V architecture and creates a Cartesi machine snapshot locally.

4. **Run the Cartesi Rollups Node with the application's initial snapshot attached:**

   ```shell
   docker compose -f compose.local.yaml --env-file .env up -d
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

   Replace `<app-name>` with your application name and `<salt>` with a unique identifier. The salt must be unique for each deployment and cannot be repeated. You can generate a unique salt using:

   ```shell
   cast keccak256 "your-unique-string"
   ```

   After this process, you'll have your application deployed and registered to the node.

## Accessing the node

Once running, your local Cartesi Rollups Node will be accessible through the standard APIs:

- Inspect endpoint: `http://localhost:10012`
- JSON-RPC endpoint: `http://localhost:10011`