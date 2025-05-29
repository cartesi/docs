# Running with a Dev Environment

Dev environment in this guide refers to the **Cartesi Rollups Node v2** and **Espresso Dev Node** running on your local machine.

We have two approaches to run your application in the dev environment:

1. Run your app using Rollups Node v2 
2. Run your app using Nonodo [Rapid Prototyping Tool]



## Running app using Rollups Node v2
This section will cover building and running your app using Rollups Node v2 in tandem with Espresso Dev Node.

### Create your application template
```bash
cartesi create <my-app-name> --template <language> --branch prerelease/sdk-12
```
You can pick any of the languages supported by Cartesi rollups. Make the changes to the template as per your application requirements.

### Build your application
```bash
cd <my-app-name>
cartesi build
```
If successful, you should see the image snapshot file in the `.cartesi` directory.

### Setup and run Dev Environment

Fetch docker recipes:
```bash
wget -q https://github.com/prototyp3-dev/node-recipes/archive/refs/heads/feature/use-v0.2.3-node-20250128.zip -O recipes.zip
unzip -q recipes.zip "node-recipes-feature-use-v0.2.3-node-20250128/node/*" -d . && mv node-recipes-feature-use-v0.2.3-node-20250128/node/* . && rmdir -p node-recipes-feature-use-v0.2.3-node-20250128/node
rm recipes.zip
```

Pull latest Devnet image:

```bash
docker pull ghcr.io/prototyp3-dev/test-devnet:test
```

Run the dev environment:
To test with a local espresso development node, add the MAIN_SEQUENCER env and other espresso configurations to `.env.localhost` file:

```bash
MAIN_SEQUENCER=espresso
ESPRESSO_BASE_URL=http://espresso:10040
ESPRESSO_NAMESPACE=51025
ESPRESSO_STARTING_BLOCK=2
```
Run devnet, database and espresso node:
```bash
make -f node.mk run-devnet-localhost
make -f node.mk run-database-localhost
make -f node.mk run-espresso-localhost
```

Before starting the node, you should append the `.env.localhost` file with the correct values for the variables.

```bash
# anvil chain configuration
CARTESI_BLOCKCHAIN_HTTP_ENDPOINT=http://localhost:8545
CARTESI_BLOCKCHAIN_WS_ENDPOINT=ws://localhost:8545
CARTESI_BLOCKCHAIN_ID=31337
CARTESI_AUTH_PRIVATE_KEY=<node-private-key>

# input box contract configuration
CARTESI_CONTRACTS_INPUT_BOX_ADDRESS=0x593E5BCf894D6829Dd26D0810DA7F064406aebB6
CARTESI_CONTRACTS_INPUT_BOX_DEPLOYMENT_BLOCK_NUMBER=<input-box-deployment-block-number>
```

Finally, start the node and deploy the application
```bash
make -f node.mk run-node-localhost
make -f node.mk deploy-localhost 
```
With the above deploy step, you should see the application and the consensus contract deployed on the dev environment.


To stop the dev environment, run the following command:
```bash
make -f node.mk stop-localhost
```

You can now interact with your application by sending inputs to the node. Follow the steps in [send inputs](./interacting.md) section.


## Running app using Nonodo 

For development and rapid prototyping of your app in your local machine, it is recommended that you use `Nonodo` for simulating Espresso inputs.

With it you can skip a lot of the setup and send EIP-712 messages directly to the node using the `nonce` and `submit` endpoints that will be running on `localhost:8080/nonce` and `localhost:8080/submit`

### Start Nonodo
On your terminal, start **Nonodo** environment using the command:

```bash
nonodo
```

### Build and Run your App

In another terminal tab, create and build a new Cartesi dApp using the following commands:

### 1. **Python**

```bash
cartesi create my-dapp --template python --branch prerelease/sdk-12
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
cartesi create my-dapp --template rust --branch prerelease/sdk-12
cd my-dapp
cartesi build
```

- Run the Cartesi Machine Locally on bare metal using the command;

```bash
cartesi-machine --network --flash-drive=label:root,filename:.cartesi/image.ext2 --env=ROLLUP_HTTP_SERVER_URL=http://10.0.2.2:5004 -- /opt/cartesi/dapp/dapp
```

### 3. **Golang**

```bash
cartesi create my-dapp --template go --branch prerelease/sdk-12
cd my-dapp
cartesi build
```

- Run the Cartesi Machine Locally on bare metal using the command;

```bash
cartesi-machine --network --flash-drive=label:root,filename:.cartesi/image.ext2 --env=ROLLUP_HTTP_SERVER_URL=http://10.0.2.2:5004 -- /opt/cartesi/dapp/dapp
```

### 4. **Javascript**

```bash
cartesi create my-dapp --template javascript --branch prerelease/sdk-12
cd my-dapp
cartesi build
```

- Run the Cartesi Machine Locally on bare metal using the command;

```bash
cartesi-machine --network --flash-drive=label:root,filename:.cartesi/image.ext2 \
--volume=.:/mnt --env=ROLLUP_HTTP_SERVER_URL=http://10.0.2.2:5004 --workdir=/opt/cartesi/dapp -- node index
```

Your app is now ready to receive inputs, you can follow the steps in [send inputs](./interacting.md) section.