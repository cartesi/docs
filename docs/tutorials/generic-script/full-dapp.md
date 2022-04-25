---
title: Full Generic Script DApp
---

:::note Section Goal
- create Generic Script smart contract
- deploy and run the Generic Script DApp
- test computation of various scripts written in Python, Lua or shell script
:::


## Generic Script smart contract

Following the same procedure of the [previous tutorials](../../calculator/full-dapp), we will now implement a smart contract that executes a generic script computation by running it off-chain using Descartes.

Inside the `generic-script/contracts` directory, create a file called `GenericScript.sol` with these contents:

```javascript
// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@cartesi/descartes-sdk/contracts/DescartesInterface.sol";


contract GenericScript {

    DescartesInterface descartes;

    bytes32 templateHash = 0x%tutorials.generic-script.hash-full;
    uint64 outputPosition = 0xa000000000000000;
    uint8 outputLog2Size = 10;
    uint256 finalTime = 1e11;
    uint256 roundDuration = 51;

    // generic script to execute (python cares about identation)
    bytes script = "#!/usr/bin/python3\n\
import jwt\n\
payload = jwt.decode(b'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZCJ9.Joh1R2dYzkRvDkqv3sygm5YyK8Gi4ShZqbhK2gxcs2U', 'secret', algorithms=['HS256'])\n\
print(payload)\n\
";

    // defines script size as 1024 bytes
    uint8 scriptLog2Size = 10;

    constructor(address descartesAddress) {
        descartes = DescartesInterface(descartesAddress);
    }

    function instantiate(address[] memory parties) public returns (uint256) {

        // specifies an input drive containing the script
        DescartesInterface.Drive[] memory drives = new DescartesInterface.Drive[](1);
        drives[0] = DescartesInterface.Drive(
            0x9000000000000000,    // 2nd drive position: 1st is the root file-system (0x8000..)
            scriptLog2Size,        // driveLog2Size
            script,                // directValue
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

When compared to the smart contract of the [Calculator DApp](../../calculator/full-dapp#calculator-smart-contract), it can be readily noted that this implementation is virtually identical to that one. Indeed, the only relevant changes are the `templateHash`, which obviously must identify a different machine template, and the input data, now represented by a `script` variable that specifies generic code instead of a mathematical expression. This illustrates how the Descartes API provides a useful and practical abstraction for instantiating complex computations from on-chain code, with the majority of the complexity and heavy-lifting moved off-chain.


## Deployment and execution

Now that we have the contract ready, let's build the migration file necessary to deploy it to the local [development environment](../../descartes-env) using Hardhat. As explained in the [previous tutorials](../../helloworld/deploy-run#deployment), we need to create a file called `01_contracts.ts` inside the `generic-script/deploy` directory with the following content:

```javascript
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const Descartes = await get("Descartes");
  await deploy("GenericScript", {
    from: deployer,
    log: true,
    args: [Descartes.address],
  });
};

export default func;
```

Then, use Hardhat to compile and deploy the contract:

```bash
npx hardhat deploy --network localhost
```

Finally, let's hop inside Hardhat's console to play with our DApp. Recalling that we have two named accounts in our development environment, we can instantiate our Generic Script computation with the following commands:

```javascript
npx hardhat console --network localhost
> { alice, bob } = await getNamedAccounts()
> gs = await ethers.getContract("GenericScript")
> tx = await gs.instantiate([alice, bob])
```

When the computation completes, we can retrieve its output using the `getResult` method with the instantiation's index:

```javascript
> index = (await tx.wait()).events[0].data
> result = await gs.getResult(index)
[
  true,
  false,
  '0x0000000000000000000000000000000000000000',
  '0x7b27736f6d65273a20277061796c6f6164277d0a000000000000000000...'  
]
```

Then, we can use an `ethers` utility method to print the output data as a string:

```javascript
> console.log(ethers.utils.toUtf8String(result[3]))
{'some': 'payload'}
```

As we can see, the result is the same one we got when we [tested the Cartesi Machine with this Python script](../cartesi-machine). But now it has been automatically validated through Descartes and made available to on-chain code.

## Beyond Python

At this point, we can also play around with our `GenericScript.sol` contract to try out different scripts, using other interpreters. For instance, we can replace our script definition with the following Lua code:

```javascript
bytes script = "#!/usr/bin/lua\n\
    function fact (n)\n\
        if n <= 0 then\n\
            return 1\n\
        else\n\
            return n * fact(n-1)\n\
        end\n\
    end\n\
    print(fact(20))\n\
";
```

This code starts with a *shebang line* indicating that the Lua interpreter should be used. It then computes `20!` using a recursive factorial function defined within the script itself.

After saving the contract file, we can use our open Hardhat console session to immediately redeploy it:

```javascript
> await run("deploy")
```

And then, we can instantiate a new computation using the updated deployed contract by executing:

```bash
> gs2 = await ethers.getContract("GenericScript")
> tx = await gs2.instantiate([alice, bob])
```

After some time, we can query and print the result using the new computation's index:

```bash
> index = (await tx.wait()).events[0].data
> result = await gs2.getResult(index)
> console.log(ethers.utils.toUtf8String(result[3]))
2432902008176640000
```

Which is indeed the result of `20!`. As a side note, although in this tutorial we directly updated our smart contract with a new script definition, it is always a good idea to test computations off-chain first, as we did for the Python code in the [previous section](../cartesi-machine).

Needless to say, other scripts and interpreters can be used. As a matter of fact, any *shell script* can be executed (i.e., using `/bin/sh` as the interpreter), which means that all the previous tutorial computations can also be performed by our generic machine. For instance, the same computation performed by our [Calculator DApp](../../calculator/full-dapp) can be specified by defining our `script` variable as:

```javascript
bytes script = "#!/bin/sh\n\
    echo '2^71 + 36^12' | bc\n\
";
```

With this definition, after replicating the steps above we will get the expected result of `2365921622773144223744`.

As we can see from the examples presented in this section, the bottom line here is that Descartes allows smart contracts to have easy and flexible access to all sorts of complex computational processes, using any tools available for the Linux operating system.

In the following sections, we will present additional ways in which data and resources can be used by Cartesi Machines, and take advantage of those to explore some more realistic use cases.
