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
pragma solidity >=0.4.25 <0.7.0;
pragma experimental ABIEncoderV2;

import "@cartesi/descartes-sdk/contracts/DescartesInterface.sol";


contract HelloWorld {

    DescartesInterface descartes;

    bytes32 templateHash = 0xc675d0eb9110a446b8873cce9f6551b9ab3e506eea71729c8ebe561278da0ead;
    uint64 outputPosition = 0x9000000000000000;
    uint64 outputLog2Size = 5;
    uint256 finalTime = 1e13;
    uint256 roundDuration = 45;
    DescartesInterface.Drive[] drives;

    constructor(address descartesAddress) public {
        descartes = DescartesInterface(descartesAddress);
    }

    function instantiate(address claimer, address challenger) public returns (uint256) {
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

In the [next section](../deploy-run/), we'll finally deploy and run our DApp, and then we'll explore actual examples of return values for the `getResult` method.
