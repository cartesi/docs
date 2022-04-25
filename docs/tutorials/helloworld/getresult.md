---
title: Retrieving result
---

:::note Section Goal
- implement smart contract `getResult` method to retrieve computation results from Descartes
:::

Once the [Descartes computation has been instantiated](../instantiate/), we need a means to effectively retrieve its result within our smart contract.

To do so, we will implement the following `getResult` method in the `HelloWorld.sol` file located within the `helloworld/contracts` directory.

```javascript
function getResult(uint256 index) public view returns (bool, bool, address, bytes memory) {
    return descartes.getResult(index);
}
```

This method receives as argument an `uint256` index, which should have been previously returned by an `instantiate` method call. This pattern allows for several computations of the same type to be carried out simultaneously.

The body of the function simply calls the corresponding method in the Descartes smart contract, returning its results. As can be noted in the method signature, the result value corresponds to a 4-tuple, whose meaning is the following:

- the first `bool` value indicates whether the result is ready;
- the second `bool` value indicates if the computation is still running or not;
- `address` corresponds to the address of the user to blame if the computation stops abnormally;
- `bytes` contains the actual result of the computation.

With all of that set, our complete smart contract should look like this:

```javascript
// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@cartesi/descartes-sdk/contracts/DescartesInterface.sol";

contract HelloWorld {

    DescartesInterface descartes;

    bytes32 templateHash = 0x%tutorials.helloworld.hash-full;
    uint64 outputPosition = 0x9000000000000000;
    uint8 outputLog2Size = 5;
    uint256 finalTime = 1e11;
    uint256 roundDuration = 51;
    DescartesInterface.Drive[] drives;

    constructor(address descartesAddress) {
        descartes = DescartesInterface(descartesAddress);
    }

    function instantiate(address[] memory parties) public returns (uint256) {
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

In the [next section](../deploy-run/), we'll finally deploy and run our DApp, and then we'll explore actual examples of return values for the `getResult` method.
