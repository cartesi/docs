# Deploying your application

Deploying a Cartesi dApp in production involves three major steps: 
1. Deploying the Rollups node to a cloud provider.
2. Deploying the smart contracts that defines your application on-chain.
3. Registering and deploying the application backend on the node.

:::note

Currently, the Espresso integration support is limited to Ethereum Sepolia testnet and Ethereum Mainnet.

:::

In the following steps, we'll focus on self-hosted deployment where we'll be deploying the node to [fly.io](https://fly.io) and smart contracts on Ethereum Sepolia testnet.

## Prerequisites
You should have a [fly.io account](https://fly.io/) and [fly CLI](https://fly.io/docs/flyctl/install/) installed to follow these steps. 

## Deploying the node to fly.io
Go to the directory containing your project. You should create a `.env.<testnet>` file with:

```shell
CARTESI_LOG_LEVEL=info
CARTESI_AUTH_KIND=private_key
CARTESI_CONTRACTS_INPUT_BOX_ADDRESS=0x593E5BCf894D6829Dd26D0810DA7F064406aebB6
CARTESI_CONTRACTS_INPUT_BOX_DEPLOYMENT_BLOCK_NUMBER=6994348
MAIN_SEQUENCER=espresso
ESPRESSO_BASE_URL=https://query.decaf.testnet.espresso.network/
ESPRESSO_NAMESPACE=51025
ESPRESSO_STARTING_BLOCK=
CARTESI_BLOCKCHAIN_HTTP_ENDPOINT=
CARTESI_BLOCKCHAIN_WS_ENDPOINT=
CARTESI_BLOCKCHAIN_ID=
CARTESI_AUTH_PRIVATE_KEY=
CARTESI_POSTGRES_ENDPOINT=
```

:::note

The value of `CARTESI_POSTGRES_ENDPOINT` will be provided on the Step 3.

:::

Then follow these steps to deploy on fly

### **Step 1**: Create a directory for the fly app 

```shell
mkdir -p .fly/node && cd .fly/node
```

### **Step 2**: Create fly configuration for the node

This is important to control the auto-stop behavior and minimum machines running. Create a `.fly/node/fly.toml` in this directory with the following content:

```toml
[build]
  image = "ghcr.io/prototyp3-dev/test-node-cloud:test"

[http_service]
  internal_port = 80
  force_https = true
  auto_stop_machines = 'off'
  auto_start_machines = false
  min_machines_running = 1
  processes = ['app']

[metrics]
  port = 9000
  path = "/metrics"

[[vm]]
  size = 'shared-cpu-1x'
  memory = '1gb'
  cpu_kind = 'shared'
  cpus = 1
```

We suggest creating a persistent volume to store the snapshots, so you wouldn't need to transfer the snapshots when restarting the virtual machine. Create the `<node-volume>` volume and add this section to the `.fly/node/fly.toml` file:

```toml
[[mounts]]
  source = '<nodevolume>'
  destination = '/mnt'
  initial_size = '5gb'
```

### **Step 3**: Create the Postgres database


You can also use the `fly postgres` to create the database

```shell
fly postgres create
```

Make sure to set the value of `CARTESI_POSTGRES_ENDPOINT` variable to your environment file. You should use the provided `Connection string` to set this variable, and don't forget to add the database `postgres` and option `sslmode=disable` to the string as shown below:

```shell
postgres://{username}:{password}@{hostname}:{port}/postgres?sslmode=disable
```

### **Step 4**: Create the Fly app

```shell
fly launch --name <app-name> --copy-config --no-deploy -c .fly/node/fly.toml
```

### **Step 5**: Import the secrets from the .env file

```shell
fly secrets import -c .fly/node/fly.toml < .env.<testnet>
```

### **Step 6**: Deploy the rollups node

```shell
fly deploy --ha=false -c .fly/node/fly.toml
```

Now you have a rollups node running on the provided url.

### **Step 7**: Deploy the app to the node

You'll have to copy the snapshot using sftp shell (we are considering the application snapshot is at `.cartesi/image`). 

```shell
app_name=<app-name>
image_path=.cartesi/image

fly ssh console -c .fly/node/fly.toml -C "mkdir -p /mnt/apps/$app_name"
```

Then run this command to print all transfers:

```shell
for f in $(ls -d $image_path/*); do echo "put $f /mnt/apps/$app_name"/$(basename $f); done
```

Then run the sftp shell and paste the listed transfers:

```shell
fly sftp shell -c .fly/node/fly.toml
```

Finally, run the deployment on the node: 

```shell
fly ssh console -c .fly/node/fly.toml -C "bash -c 'APP_NAME=$app_name OWNER={OWNER} /deploy.sh /mnt/apps/$app_name'"
```

You should set `OWNER` to the same owner of the `CARTESI_AUTH_PRIVATE_KEY`. Set `CONSENSUS_ADDRESS` to deploy a new application with same consensus already deployed. You can also set `EPOCH_LENGTH`, and `SALT`.

If you have already deployed the application, you can register it to add to the node (after transfering the image).

```shell
fly ssh console -c .fly/node/fly.toml -C "bash -c 'APP_NAME=$app_name APPLICATION_ADDRESS=${APPLICATION_ADDRESS} CONSENSUS_ADDRESS=${CONSENSUS_ADDRESS} /register.sh /mnt/apps/$app_name'"
```

Your application is now deployed and registered on the node. Also, note that you can deploy multiple applications on the same node.
