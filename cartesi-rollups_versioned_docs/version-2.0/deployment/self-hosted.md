---
id: self-hosted
title: Self-hosted deployment
---

This guide explains how to run a Cartesi Rollups node locally on your machine for development and testing purposes on **testnet**.

:::warning Production Warning
**This self-hosted approach should NOT be used in *production*.** 

While this setup works with testnet environments, it's designed exclusively for development purposes. It lacks critical production requirements such as:

## Initiating deployment

1. Compile your application into RISC-V architecture and consequently build a Cartesi machine by running:

   ```shell
    cartesi build
   ```

2. Run the command below to start the deployment process.

   ```shell
     cartesi deploy --hosting self-hosted --webapp https://sunodo.io/deploy
   ```

  The command generates a Docker image containing the rollups node and machine. You will be redirected to a web application to deploy the necessary smart contracts.

  ![img](../../../static/img/v1.3/deploy.png)

## Deploying the contracts

On the deploy web interface, the hash of the Cartesi machine will be automatically configured.

1. Connect your wallet to set the application chain’s base layer and deployer account.

2. Create a wallet specifically for Cartesi rollups node transactions. The Cartesi rollups node will use this wallet to submit transactions to the base layer. Paste the public address of this wallet.

  :::note create a wallet
  You can use [Cast](https://book.getfoundry.sh/reference/cast/cast-wallet-new-mnemonic) to create a new wallet by running `cast wallet new-mnemonic --words 24`. For increased security, you can use a wallet managed by [AWS KMS](https://aws.amazon.com/blogs/database/part1-use-aws-kms-to-securely-manage-ethereum-accounts/).
  :::

3. After successful deployment, the node’s configuration is presented in a `.env` file and a `.toml` format. This config file includes the addresses of the deployed smart contracts and information on the base layer chain.

  You will need the `.env` when [hosting the node on the cloud provider](./self-hosted.md/#hosting-on-a-cloud-provider) and the `.toml` file when [hosting on Fly.io](./self-hosted.md/#hosting-on-flyio).

<!-- <video width="100%" controls poster="/static/img/v1.3/deploy.png">
    <source src="/videos/Deploy_Success.mp4" type="video/mp4" />
    Your browser does not support video tags.
</video> -->


## Hosting the node

You’ll need a server to host the application node and keep it operational 24/7. This server will expose a single port for client access to the rollups node APIs through GraphQL or Inspect requests.


The server requirements depend on your application's expected usage and the specifications of the Cartesi machine you're using, such as its RAM size and total capacity. Consider a minimum of 8GB of RAM, and adjust as needed.


The Cartesi rollups node is distributed as a Docker image. Any popular cloud provider, like AWS, GCP, Azure, Digital Ocean, or Linode, can run docker containers and hence can be used to host the rollups node.

Alternatively, you can use a service like [Fly.io](https://fly.io/) to deploy your application node.

### Hosting on a cloud provider

1. Download the `.env` configuration file into the root directory of your application.

1. Obtain HTTP and WebSocket URLs from a web3 provider for the `CARTESI_BLOCKCHAIN_HTTP_ENDPOINT` and `CARTESI_BLOCKCHAIN_WS_ENDPOINT` variables.

  Here is an example from [Alchemy](https://dashboard.alchemy.com/):

  ![img](../../../static/img/v1.3/alchemy.png)

  :::caution important
  The web3 provider URLs and wallet mnemonic are sensitive information that can compromise your application and funds. You should keep it **secure** and **private** at all times.
  :::

1. Create a PostgreSQL database and configure the connection string in the `.env` file.

  The connection string for a PostgreSQL database must be configured at the `CARTESI_POSTGRES_ENDPOINT` variable.

  You can use any PostgreSQL database, whether managed by a cloud provider or set up on your local infrastructure. The key configuration required is the connection string, encompassing the database URL, username, password, and name. The node necessitates a PostgreSQL database to store the application state, which is accessible via the [GraphQL API](../api-reference/graphql/basics.md).

1. With all the config variables set, here is how you can run the node on your local machine:

  ```
  docker run --env-file <env-file> -p 10000:10000 <image-id>
  ```

  Replace `<env-file>` and `<image-id>` with the `.env` file name and `sha256` hash of your Cartesi machine.

  The image can be tagged using [docker tag](https://docs.docker.com/reference/cli/docker/image/tag/).

  You can deploy your node with a cloud provider or use any managed container solution, like Kubernetes. 

### Hosting on fly.io

Fly.io is a platform where you can conveniently deploy applications packaged as Docker containers.

:::caution important
If deploying to Fly.io from macOS with Apple Silicon, create a Docker image for `linux/amd64` with: `cartesi deploy build --platform linux/amd64`
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