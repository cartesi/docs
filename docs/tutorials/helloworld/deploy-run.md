---
title: Deploying and Running
---

:::note Section Goal
- deploy Hello World smart contract
- run DApp using `truffle console` and interpret results
:::


## Introduction

By now, we have completed the implementation of our Hello World DApp. However, in order to effectively run it, we still need to *deploy* it to an Ethereum network that includes the Descartes smart contract. To that end, we'll make use of the local development network already running within our [Descartes SDK Environment](../descartes-env.md).

## Deployment

To deploy our contract to the local development network, we'll use Truffle migrations. 

First of all, let's create a *migration file* that specifies how the deployment should be done. In the `helloworld/migrations` directory, create a file called `2_deploy_contracts.js` with the following contents:

```javascript
const contract = require("@truffle/contract");
const HelloWorld = artifacts.require("HelloWorld");
const Descartes = contract(require("../../descartes-env/blockchain/node_modules/@cartesi/descartes-sdk/build/contracts/Descartes.json"));

module.exports = function(deployer) {
  Descartes.setNetwork(deployer.network_id);
  deployer.deploy(HelloWorld, Descartes.address);
};
```

This JavaScript code first loads Truffle's `contract` wrapper along with an abstraction of our `HelloWorld` smart contract. It then uses the wrapper to also create an abstraction for the `Descartes` smart contract. Here, we need to point to a `Descartes.json` file that contains the address of the Descartes contract within our SDK Environment's development network. For that reason, we use a specific path that assumes the directory structure used in this tutorial. Namely, we assume that the SDK Environment is running in a directory called `descartes-env`, located at the same level as this DApp project's home directory.

After that, the migration script defines the function that actually performs the deployment. This function first retrieves the network ID currently known to Truffle and sets it in the Descartes abstraction, so that we can access the contract's appropriate address for that network. It then uses Truffle's `deployer` object to deploy our HelloWorld contract, passing the Descartes address as a parameter. Truffle will use this parameter as an argument when calling the [HelloWorld's constructor we defined before](../create-project/#creating-the-smart-contract).

With this all set up, move back to the project's home directory and execute the following command to deploy our DApp:

```
truffle migrate
```

This will effectively compile our smart contract and deploy it to the network. Later on, if you wish to make changes to the DApp code, you can redeploy it by executing the above command with the `--reset` option. Please [refer to the Truffle documentation](https://www.trufflesuite.com/docs/truffle/getting-started/running-migrations) for more information about running migrations with Truffle.

## Running the DApp

Now that we have everything in place, we can finally try out our Hello World DApp. To do so, we'll start Truffle's console by running:

```bash
truffle console
```

To check that we are indeed connected to the Descartes SDK Environment, we can retrieve the existing user accounts to verify that `alice` and `bob` addresses are as expected:

```bash
truffle(development)> web3.eth.getAccounts()
[
  '0xe9bE0C14D35c5fA61B8c0B34f4c4e2891eC12e7E',
  '0x91472CCE70B1080FdD969D41151F2763a4A22717'
]
```

At this point, we can acquire a reference to our deployed HelloWorld DApp and instantiate a computation to be carried out off-chain by `alice`'s and `bob`'s Descartes nodes:

```bash
truffle(development)> hw = await HelloWorld.deployed()
truffle(development)> hw.instantiate('0xe9bE0C14D35c5fA61B8c0B34f4c4e2891eC12e7E', '0x91472CCE70B1080FdD969D41151F2763a4A22717')
```

This will trigger the computation, which can take a couple of minutes to run with Descartes's default settings.

We can immediately query our Hello World DApp to ask for current results:

```bash
truffle(development)> hw.getResult(0)
Result {
  '0': false,
  '1': true,
  '2': '0x0000000000000000000000000000000000000000',
  '3': '0x0000000000000000000000000000000000000000000000000000000000000000'
}
```

As noted in [the previous section](../getresult/), the first `false` boolean value indicates that the results are not ready yet, while the second `true` boolean value confirms that the computation is still running. Furthermore, the value at index `2` corresponds to an empty address, meaning that there is no user to blame for any abnormal interruption of the computation. Finally, the last entry corresponds to the result value itself, which is still empty as expected.

After a while, we can query again the results and get a different response:

```bash
truffle(development)> hw.getResult(0)
Result {
  '0': true,
  '1': false,
  '2': '0x0000000000000000000000000000000000000000',
  '3': '0x48656c6c6f20576f726c64210a00000000000000000000000000000000000000'
}
```

This response confirms that the computation has completed and that results are available. The last entry contains a `bytes32` value that corresponds to the result contents. We can inspect it by using a `web3` utility method to interpret those bytes as a string:

```
truffle(development)> res = await hw.getResult(0)
truffle(development)> web3.utils.toAscii(res['3'])
'Hello World!\n\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
```

And there it is! We have successfully used Descartes to execute an off-chain computation, validate it, and make its results available to on-chain code.