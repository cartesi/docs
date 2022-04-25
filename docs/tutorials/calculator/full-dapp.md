---
title: Full Calculator DApp
---

:::note Section Goal
- create Calculator smart contract
- deploy and run full Calculator DApp
:::


## Calculator smart contract

Given the Cartesi Machine implemented in the [previous section](../cartesi-machine) and the project structure [initialized before](../create-project), we will now complete the implementation of our Calculator DApp by creating and deploying its smart contract.

In order to do that, create a file called `Calculator.sol` inside the `calculator/contracts` directory, and then place the following contents into it:

```javascript
// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@cartesi/descartes-sdk/contracts/DescartesInterface.sol";


contract Calculator {

    DescartesInterface descartes;

    bytes32 templateHash = 0x%tutorials.calculator.hash-full;
    uint64 outputPosition = 0xa000000000000000;
    uint8 outputLog2Size = 10;
    uint256 finalTime = 1e11;
    uint256 roundDuration = 51;

    // mathematical expression to evaluate
    bytes expression = "2^71 + 36^12";
    uint8 expressionLog2Size = 5;

    constructor(address descartesAddress) {
        descartes = DescartesInterface(descartesAddress);
    }

    function instantiate(address[] memory parties) public returns (uint256) {

        // specifies an input drive containing the mathematical expression
        DescartesInterface.Drive[] memory drives = new DescartesInterface.Drive[](1);
        drives[0] = DescartesInterface.Drive(
            0x9000000000000000,    // 2nd drive position: 1st is the root file-system (0x8000..)
            expressionLog2Size,    // driveLog2Size
            expression,            // directValue
            "",                    // loggerIpfsPath
            0x00,                  // loggerRootHash
            parties[0],            // provider
            false,                 // waitsProvider
            false                  // needsLogger
        );

        // instantiates the computation
        return descartes.instantiate(
            finalTime,
            templateHash,
            outputPosition,
            outputLog2Size,
            roundDuration,
            parties,
            drives
        );
    }

    function getResult(uint256 index) public view returns (bool, bool, address, bytes memory) {
        return descartes.getResult(index);
    }
}
```

This contract is actually very similar to the one created for the [Hello World DApp](../../helloworld/get-result), with a few relevant changes and additions. The most important of these is the specification of the *input drive* within the `instantiate` method. First of all, the drive's position in the address space is defined as `0x9000000000000000`. As explained in the [Descartes drives section](../../../descartes/drives) and in the [Hello World instantiation section](../../helloworld/instantiate), this actually corresponds to the default position for the machine's second drive, the first one being the machine's root file-system itself. Furthermore, the drive's definition includes its data as a string representing the mathematical expression of interest (in this case, `"2^71 + 36^12"`), along with the log<sub>2</sub> of the drive's total size (which in practice is not allowed to be smaller than `5`, or 32 bytes).

Aside from the input drive, we should also note the declaration of the appropriate `templateHash` value `0x%tutorials.calculator.hash-trunc...`, which identifies the computation to execute and must thus correspond to the hash reported when we built the [Cartesi Machine](../cartesi-machine#final-cartesi-machine-implementation). Finally, the `outputPosition` value acknowledges that the output drive is now the 3rd drive in the Cartesi Machine specification, thus located by default at address `0xa000000000000000`.


## Deployment and execution

With the contract implemented, we are now ready to compile and deploy it to the local development network using Hardhat. 

First, create a deployment script called `01_contracts.ts` inside the `calculator/deploy` directory. This file will be almost identical to the one created before for the [Hello World DApp](../../helloworld/deploy-run#deployment), and should contain the following TypeScript code:

```javascript
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const Descartes = await get("Descartes");
  await deploy("Calculator", {
    from: deployer,
    log: true,
    args: [Descartes.address],
  });
};

export default func;
```

Now, compile and deploy the Calculator smart contract by executing:

```bash
npx hardhat deploy --network localhost
```

Once this is completed successfully, we can use Hardhat's console to instantiate the computation using the environment's addresses for `alice` and `bob`:

```javascript
npx hardhat console --network localhost
> { alice, bob } = await getNamedAccounts()
> calc = await ethers.getContract("Calculator")
> tx = await calc.instantiate([alice, bob])
```

After a while, the computation will be completed and we will be able to query the results by calling the smart contract's `getResult` method with the appropriate index:

```javascript
> index = (await tx.wait()).events[0].data
> result = await calc.getResult(index)
[
  true,
  false,
  '0x0000000000000000000000000000000000000000',
  '0x323336353932313632323737333134343232333734340a000000000000...'
]
```

Notice that the response data (last entry at index `3`) is quite large. This is because we specified a log<sub>2</sub> size of `10` for the `outputLog2Size` in our smart contract, meaning that the output drive will have 1024 bytes. We can better inspect this output data by executing the following command:

```javascript
> console.log(ethers.utils.toUtf8String(result[3]))
2365921622773144223744
```

Which gives us the expected result, as we saw earlier when [testing the Cartesi Machine](../cartesi-machine#performing-calculations-with-a-cartesi-machine). This means that our smart contract is now indeed capable of computing any arbitrary mathematical expression using the Linux `bc` tool!

In the next section, we will see how we can easily extend this idea to perform not only mathematical calculations but *any arbitrary computation* using standard script languages such as Python or Lua.
