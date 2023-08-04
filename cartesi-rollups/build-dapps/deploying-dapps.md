---
id: deploying-dapps
title: Deploying DApps
tags: [deploy, quickstart, dapps, developer]
---

:::tip
Please check the [full documentation for deploying Rollups DApps to Cartesi's cloud-based execution infrastructure](https://github.com/cartesi/rollups-deployment/blob/main/README.md).
:::

Cartesi Rollups DApps are intended to be deployed to public blockchains, so that they can be accessed by users. This can be done by taking advantage of a cloud-based infrastructure provided by Cartesi.

As happens with any blockchain application, the act of "deploying a DApp" involves publishing its smart contract so that it is publicly available and usable by clients or [front-end applications](../dapp-architecture.md#front-end). In the context of a Cartesi DApp, the smart contract is represented by an arbitrary [back-end program](../dapp-architecture.md#back-end) that runs on Linux inside a [Cartesi Node](../components.md#cartesi-nodes). This means that deploying Cartesi DApps basically corresponds to first deploying a smart contract that represents your DApp on-chain and then instantiating Cartesi Nodes that run the intended back-end logic of the application.

In order to facilitate the instantiation of such nodes, Cartesi provides an infrastructure for easily getting them running in the cloud. Developers are thus invited to take advantage of this convenience service in order to jump-start bringing their applications to public blockchains.

## Supported networks

As stated above, the first step in the deployment of a new Cartesi DApp to a blockchain requires creating a smart contract on that network that makes use of the Cartesi Rollups smart contracts. For convenience, Cartesi has already deployed the Rollups smart contracts to a number of networks, in order to make it easier for developers to create DApps on them.

The table below shows the list of all [networks that are currently supported](https://github.com/cartesi/rollups/tree/main/onchain/rollups/deployments) in the latest Cartesi Rollups release:

| Network Name  | Chain ID |
|----------------|----------------------------------|
| Arbitrum Goerli  | 421613 |
| Goerli  |   5  |
| Gnosis Chiado | 10200 |
| Optimism Goerli |  420 |
| Polygon Mumbai |  80001 |
| Sepolia | 11155111 |


## Deploying on a public Testnet with a Cartesi Node running locally

1. Build the DApp's back-end machine. To do this, run the following command from the directory of your DApp:

```shell
docker buildx bake machine --load --set *.args.NETWORK=<network>
```

Replace `<network>` with the name for your preferred network, written in the following way:

* `goerli`
* `gnosis_chiado`
* `arbitrum_goerli`
* `optimism_goerli`
* `polygon_mumbai`
* `sepolia`


2. Deploy the back-end to a corresponding Rollups smart contract by running:

```shell
export MNEMONIC=<user sequence of twelve words>
export RPC_URL=<https://your.rpc.gateway>
```

The `<user sequence of twelve words>` sets your wallet's mnemonic, a sequence of twelve words used to generate private keys.

The `<https://your.rpc.gateway>` sets the URL for your preferred RPC gateway, a connection point for interacting with the Ethereum network. Replace it with a specific URL, such as `https://eth-goerli.alchemyapi.io/v2/<USER_KEY>`.

3. Submit a transaction to the Cartesi DApp Factory contract on the target network by executing the following command

```shell
DAPP_NAME=<example> docker compose --env-file ../env.<network> -f ../deploy-testnet.yml up
```

Replace `<network>` with the name for your preferred network.

:::note
The preferred network must be one that has the Rollups contracts deployed.
:::


4. Get the address of the DApp by running:

```shell
cat ../deployments/<network>/<example>.json
```

Replace `<network>` with the name of your preferred network and `<example>` with the name of your DApp. For example `cat ../deployments/goerli/fortune.json`.

The output will look similar to this:

```json
{
"address": "Oxf3C97b309BfBf6bDD3436cC86dEdA6D149e2BD9D",
"blockHash": "0x8a895c94d23bf6aba465addc065f7bc205b637e4497ab79895541359620f05c8",
"blockNumber": 9361663,
"transactionHash": "0x154b7d30a6ffe728206cc56280cfb8c35b27cf6fdaca108fd400d38c4f6537cf"
}
```

5. Stop the containers using `ctrl+c` then remove the containers and the volumes:

```shell
DAPP_NAME=<example> docker compose --env-file ../env.<network> -f ../deploy-testnet.yml down -v
```

Replace `<network>` with the name for your preferred network.

6. Set a secure websocket endpoint for the RPC gateway (WSS URL) that the local Cartesi Node will use. The command depends on your preferred network. For example, for Goerli and Alchemy, this will look as follows:

```shell
export WSS_URL=wss://eth-goerli.alchemyapi.io/v2/<USER_KEY>
```


7. Now we can start the local Cartesi Node:

```shell
DAPP_NAME=<example> docker compose --env-file ../env.<network> -f ../docker-compose-testnet.yml -f ./docker-compose.override.yml up
```

Replace `<network>` with the name for your preferred network.


8. We can check the application status on Etherscan, for example, `goerli.etherscan.io` by searching by our address, such as `Oxf3C97b309BfBf6bDD3436cC86dEdA6D149e2BD9D`.

9. Now let's send inputs to the DApp using the [frontend-console application](https://github.com/cartesi/rollups-examples/tree/main/frontend-console).

From the rollups-examples base directory, navigate to the `frontend-console` one:

```shell
cd frontend-console
```

Build the frontend console application:

```shell
yarn
yarn build
```

And send an input as follows:

```shell
yarn start input send --payload “test” --rpc <rpc-address> —address <dapp address>
```

* Replace `<rpc-address>` with your preferred RPC address. You can obtain an address [here](https://chainlist.org/chain/5).
* Replace `<dapp address>` with the address obtained in step 4.


