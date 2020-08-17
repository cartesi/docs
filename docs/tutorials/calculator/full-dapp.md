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
pragma solidity >=0.4.25 <0.7.0;
pragma experimental ABIEncoderV2;

import "@cartesi/descartes-sdk/contracts/DescartesInterface.sol";


contract Calculator {

    DescartesInterface descartes;

    bytes32 templateHash = 0x88040f919276854d14efb58967e5c0cb2fa637ae58539a1c71c7b98b4f959baa;
    uint64 outputPosition = 0xa000000000000000;
    uint64 outputLog2Size = 10;
    uint256 finalTime = 1e13;
    uint256 roundDuration = 45;

    // mathematical expression to evaluate
    bytes expression = "2^71 + 36^12";
    uint64 expressionLog2Size = 5;

    constructor(address descartesAddress) public {
        descartes = DescartesInterface(descartesAddress);
    }

    function instantiate(address claimer, address challenger) public returns (uint256) {

        // specifies an input drive containing the mathematical expression
        DescartesInterface.Drive[] memory drives = new DescartesInterface.Drive[](1);
        drives[0] = DescartesInterface.Drive(
            0x9000000000000000,    // 2nd drive position: 1st is the root file-system (0x8000..)
            expressionLog2Size,    // driveLog2Size
            expression,            // directValue
            0x00,                  // loggerRootHash
            claimer,               // provider
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
            claimer,
            challenger,
            drives
        );
    }

    function getResult(uint256 index) public view returns (bool, bool, address, bytes memory) {
        return descartes.getResult(index);
    }
}
```

This contract is actually very similar to the one created for the [Hello World DApp](../../helloworld/get-result), with a few relevant changes and additions. The most important of these is the specification of the *input drive* within the `instantiate` method. First of all, the drive's position in the address space is defined as `0x9000000000000000`. As explained in the [Descartes drives section](../../../descartes/drives) and in the [Hello World instantiation section](../../helloworld/instantiate), this actually corresponds to the default position for the machine's second drive, the first one being the machine's root file-system itself. Furthermore, the drive's definition includes its data as a string representing the mathematical expression of interest (in this case, `"2^71 + 36^12"`), along with the log<sub>2</sub> of the drive's total size (which in practice is not allowed to be smaller than `5`, or 32 bytes).

Aside from the input drive, we should also note the declaration of the appropriate `templateHash` value `0x88040f...`, which identifies the computation to execute and must thus correspond to the hash reported when we built the [Cartesi Machine](../cartesi-machine#final-cartesi-machine-implementation). Finally, the `outputPosition` value acknowledges that the output drive is now the 3rd drive in the Cartesi Machine specification, thus located by default at address `0xa000000000000000`.


## Deployment and Execution

With the contract implemented, we are now ready to compile and deploy it to the local development network using Truffle. 

First, create a migration file called `2_deploy_contracts.js` inside the `calculator/migrations` directory. This file will be almost identical to the one created before for the [Hello World DApp](../../helloworld/deploy-run#deployment), and should contain the following JavaScript code:

```javascript
const contract = require("@truffle/contract");
const Descartes = contract(require("../../descartes-env/blockchain/node_modules/@cartesi/descartes-sdk/build/contracts/Descartes.json"));

const Calculator = artifacts.require("Calculator");

module.exports = function(deployer) {
  Descartes.setNetwork(deployer.network_id);
  deployer.deploy(Calculator, Descartes.address);
};
```

Now, compile and deploy the Calculator smart contract by executing:

```bash
truffle migrate
```

Once this is completed successfully, we can use Truffle's console to instantiate the computation using the environment's addresses for `alice` (`0xe9bE0C1...`) and `bob` (`0x91472C...`):

```bash
truffle console
truffle(development)> calc = await Calculator.deployed()
truffle(development)> calc.instantiate('0xe9bE0C14D35c5fA61B8c0B34f4c4e2891eC12e7E', '0x91472CCE70B1080FdD969D41151F2763a4A22717')
```

After a while, the computation will be completed and we will be able to query the results by calling the smart contract's `getResult` method:

```bash
truffle(development)> calc.getResult(0)
Result {
  '0': true,
  '1': false,
  '2': '0x0000000000000000000000000000000000000000',
  '3': '0x323336353932313632323737333134343232333734340a000000000000...'
}
```

Notice that the response data (at index '3') is quite large. This is because we specified a log<sub>2</sub> size of `10` for the `outputLog2Size` in our smart contract, meaning that the output drive will have 1024 bytes. We can better inspect this output data by executing the following commands:

```
truffle(development)> res = await calc.getResult(0)
truffle(development)> console.log(web3.utils.hexToAscii(res['3']))
'2365921622773144223744'
```

Which gives us the expected result, as we saw earlier when [testing the Cartesi Machine](../cartesi-machine#performing-calculations-with-a-cartesi-machine). This means that our smart contract is now indeed capable of computing any arbitrary mathematical expression using the Linux `bc` tool!

In the next section, we will see how we can easily extend this idea to perform not only mathematical calculations but *any arbitrary computation* using standard script languages such as Python  or Lua.