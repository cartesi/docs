---
title: Deploying and running
---

:::note Section Goal
- deploy Hello World smart contract
- run DApp using `hardhat console` and interpret results
:::


## Introduction

By now, we have completed the implementation of our Hello World DApp. However, in order to effectively run it, we still need to *deploy* it to an Ethereum network that includes the Descartes smart contract. To that end, we'll make use of the local development network already running within our [Descartes SDK Environment](../descartes-env.md).

## Deployment

To deploy our contract to the local development network, we'll use `hardhat-deploy`.

We'll start by creating a `deploy` directory:

```bash
mkdir deploy
```

Now, create a file called `01_contracts.ts` within that directory with the following contents:

```javascript
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const Descartes = await get("Descartes");
  await deploy("HelloWorld", {
    from: deployer,
    log: true,
    args: [Descartes.address],
  });
};

export default func;
```

This TypeScript code uses the `hardhat-deploy` plugin to publish our contract to the local Ethereum network specified by the [`hardhat.config.ts`](../create-project/#initializing-the-dapp-project) file. Note that Hardhat allows this script to easily retrieve the Descartes contract already deployed there, so as to pass its address as a parameter to the `deploy` method. Hardhat will use this parameter as an argument when calling the [HelloWorld's constructor we defined before](../create-project/#creating-the-smart-contract). As a final observation, we specify the `deployer` named account (also defined in `hardhat.config.ts`) to be used for submitting the deployment transaction.

With this all set up, move back to the project's home directory and execute the following command to deploy our DApp:

```
npx hardhat deploy --network localhost
```

This will effectively compile our smart contract and deploy it to the local network. Please [refer to the documentation](https://github.com/wighawag/hardhat-deploy#readme) for more information about using the `hardhat-deploy` plugin.

## Running the DApp

Now that we have everything in place, we can finally try out our Hello World DApp. To do so, we'll start Hardhat's console by running:

```bash
npx hardhat console --network localhost
```

To check that we are indeed connected to the local Descartes SDK Environment, we can retrieve the configured named accounts to verify that `alice`'s and `bob`'s addresses are as expected:

```javascript
> { alice, bob } = await getNamedAccounts()
{
  deployer: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  alice: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  bob: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
}
```

At this point, we can acquire a reference to our deployed HelloWorld DApp and instantiate a computation to be carried out off-chain by `alice`'s and `bob`'s Descartes nodes:

```javascript
> hw = await ethers.getContract("HelloWorld")
> tx = await hw.instantiate([alice, bob])
```

This will trigger the computation, which can take a couple of minutes to run with Descartes's default settings.

As can be seen by the `getResult` implementation discussed in the [previous section](../getresult), to query a computation's results we should use the `index` value returned by the `instantiate` method. This is straightforward when calling that method from another contract, but clients such as `ethers` and `web3` [cannot immediately retrieve return values from transactions](https://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts#transactions). Fortunately, Descartes emits events for each computation step, and thus it is possible to retrieve our index from the creation event.

In Ethers, the events emitted by a transaction are included in the returned transaction receipt after its `wait()` method is called. Since the payload of the Descartes creation event is the index value itself, we can retrieve it by simply executing the following command within the console:

```javascript
> index = (await tx.wait()).events[0].data
```

In possession of that index, we can then immediately query our Hello World DApp to ask for current results:

```javascript
> result = await hw.getResult(index)
[ false, true, '0x0000000000000000000000000000000000000000', '0x' ]
```

As noted in the [previous section](../getresult/), the first `false` boolean value indicates that the results are not ready yet, while the second `true` boolean value confirms that the computation is still running. Furthermore, the third entry corresponds to an empty address, meaning that there is no user to blame for any abnormal interruption of the computation. Finally, the last entry corresponds to the result value itself, which is still empty as expected.

After a while, we can query again the results and get a different response:

```javascript
> result = await hw.getResult(index)
[
  true,
  false,
  '0x0000000000000000000000000000000000000000',
  '0x48656c6c6f20576f726c64210a00000000000000000000000000000000000000'
]
```

This response confirms that the computation has completed and that results are available. The last entry contains a `bytes` value that corresponds to the result contents. We can inspect it by using an `ethers` utility method to interpret those bytes as a string:

```javascript
> console.log(ethers.utils.toUtf8String(result[3]))
'Hello World!'
```

And there it is! We have successfully used Descartes to execute an off-chain computation, validate it, and make its results available to on-chain code.

We can exit the Hardhat console now by typing:

```javascript
> .exit
```

In the subsequent sections, we will explore additional features of the Descartes SDK and build more sophisticated and useful DApps.
