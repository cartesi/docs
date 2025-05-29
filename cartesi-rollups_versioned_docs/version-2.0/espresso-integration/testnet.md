# Running with a Testnet Environment

Testnet environment in this guide refers to the **_Ethereum Sepolia Testnet_** as a Layer 1 and **_Espresso Decaf Testnet_** as a Layer 2 network. You can refer to the [architecture section](./architecture.md) to read more on how the Cartesi Node interprets messages from both the layers. This environment provides a full blown Espresso integration with its live nodes.

There are two approaches to use the testnet environment:

1. Run the Node in your local machine
2. Deploy the Node to a cloud host

In this guide, we’ll focus on the 1st approach and in [deployment](./deployment.md) section, we’ll take a look at how to deploy your Node to [fly.io](https://fly.io).

:::note

The guide assumes that you have already created a Cartesi dApp and have a snapshot image ready. You can follow the [building guide](./building.md) to create a dApp and generate build artifacts.

:::

## Run the Rollups Node V2 

We're going to spin up a Cartesi Rollups Node V2 container using the `node-recipes`.

### Step 1: Setup Docker Image

Go to the application directory and copy the dockerfile, the docker compose file, and the node.mk.

```bash
wget -q https://github.com/prototyp3-dev/node-recipes/archive/refs/heads/feature/use-20250128-build.zip -O recipes.zip
unzip -q recipes.zip "node-recipes-feature-use-20250128-build/node/*" -d . && mv node-recipes-feature-use-20250128-build/node/* . && rmdir -p node-recipes-feature-use-20250128-build/node
rm recipes.zip
```

Pull the latest Cartesi Rollups Node V2 image.

```bash
docker pull ghcr.io/prototyp3-dev/test-node:test
```

### Step 2: Create a .env file for Testnet

Create a `.env.sepolia` file inside the application directory with the following variables:

```bash
# cartesi node configuration
CARTESI_LOG_LEVEL=info
CARTESI_AUTH_KIND=private_key
CARTESI_CONTRACTS_INPUT_BOX_ADDRESS=0x593E5BCf894D6829Dd26D0810DA7F064406aebB6
CARTESI_CONTRACTS_INPUT_BOX_DEPLOYMENT_BLOCK_NUMBER=6994348

# espresso configuration
MAIN_SEQUENCER=espresso
ESPRESSO_BASE_URL=https://query.decaf.testnet.espresso.network
ESPRESSO_NAMESPACE=51025
ESPRESSO_STARTING_BLOCK=<current-block-number>

# sepolia chain configuration
CARTESI_BLOCKCHAIN_HTTP_ENDPOINT=<sepolia-rpc-url>
CARTESI_BLOCKCHAIN_WS_ENDPOINT=<sepolia-ws-url>
CARTESI_BLOCKCHAIN_ID=11155111
CARTESI_AUTH_PRIVATE_KEY=<node-private-key>
```

### Step 3: Run the Docker Containers

```bash
make -f node.mk run-database-<testnet>
make -f node.mk run-node-<testnet>
```

To stop the containers later, run the following command:

```bash
make -f node.mk stop-<testnet>
``` 

### Step 4: Deploy the App Contract on Sepolia

```bash
make -f node.mk deploy-<testnet> OWNER=<app-and-auth-owner>
```

Your app is now ready to receive inputs from the Decaf testnet and Sepolia network. To start interacting, follow the steps in [send inputs](./interacting.md) section.

:::note

You should set `OWNER` to the same owner of the `CARTESI_AUTH_PRIVATE_KEY`. Set `CONSENSUS_ADDRESS` to deploy a new application with same consensus already deployed. You can also set `EPOCH_LENGTH`, and `SALT`.

If want to register an already deployed application to the node use (optionally set `IMAGE_PATH`):

```bash
make -f node.mk register-<testnet> APPLICATION_ADDRESS=<app address> CONSENSUS_ADDRESS=<auth address> 
```

:::



## Rapid prototyping with Testnet (using Nonodo)
To run Nonodo with a full testnet setup, we must provide:

- The URL of a gateway RPC on Sepolia
- The application’s deployment address on Sepolia
- The URL for accessing Espresso’s testnet
- The Espresso block number from which to start looking for inputs; if absent, Nonodo will start looking at Espresso block 0; in practice, it is often a good idea to query Espresso’s current block height when deploying your application, and use that to appropriately specify this initial block number.

:::warning

Espresso’s testnet (called “Decaf”) only posts commitments to Sepolia, so you should not deploy your application to other testnets such as Optimism Sepolia or Arbitrum Sepolia.

:::

- Register your dApp Address

- To run on the testnet environment you will need a dApp address on the network. For this we prepared a web page where you can resgister an address for your dApp
  https://address.mugen.builders
  In the above link you can connect with your wallet and using you public key generate a **dApp address** that will be used in the command that follows.

- Start **_Nonodo_** using the command with the flag with the flag that enables integration with Espresso;

```bash
nonodo \
  --rpc-url https://eth-sepolia.g.alchemy.com/v2/_NNA-xQcIATiYWv_UsRuk7BGLmrbxcvM \
  --contracts-application-address <dapp> \
  --sequencer espresso \
  --espresso-url https://query.decaf.testnet.espresso.network \
  --from-block <blocknumber>
```

## Running the Machine

- In another terminal, create and build a new Cartesi dApp using the following command:

### 1. **Python**

```bash
cartesi create my-dapp --template python
cd my-dapp
cartesi build
```

- Run the Cartesi Machine Locally on bare metal using the command;

```bash
cartesi-machine --network --flash-drive=label:root,filename:.cartesi/image.ext2 \
--volume=.:/mnt --env=ROLLUP_HTTP_SERVER_URL=http://10.0.2.2:5004 --workdir=/mnt -- python dapp.py
```

### 2. **Rust**

```bash
cartesi create my-dapp --template rust
cd my-dapp
cartesi build
```

- Run the Cartesi Machine Locally on bare metal using the command;

```bash
cartesi-machine --network --flash-drive=label:root,filename:.cartesi/image.ext2 --env=ROLLUP_HTTP_SERVER_URL=http://10.0.2.2:5004 -- /opt/cartesi/dapp/dapp
```

### 3. **Golang**

```bash
cartesi create my-dapp --template go
cd my-dapp
cartesi build
```

- Run the Cartesi Machine Locally on bare metal using the command;

```bash
cartesi-machine --network --flash-drive=label:root,filename:.cartesi/image.ext2 --env=ROLLUP_HTTP_SERVER_URL=http://10.0.2.2:5004 -- /opt/cartesi/dapp/dapp
```

### 4. **Javascript**

```bash
cartesi create my-dapp --template javascript
cd my-dapp
cartesi build
```

- Run the Cartesi Machine Locally on bare metal using the command;

```bash
cartesi-machine --network --flash-drive=label:root,filename:.cartesi/image.ext2 \
--volume=.:/mnt --env=ROLLUP_HTTP_SERVER_URL=http://10.0.2.2:5004 --workdir=/opt/cartesi/dapp -- node index
```
