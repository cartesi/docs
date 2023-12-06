---
title: Instantiating computation
---

:::note Section Goal

- implement smart contract `instantiate` method to start the Cartesi Compute computation
- understand Cartesi Compute parameters
  :::

After creating our [basic HelloWorld dApp project](../helloworld/create-project.md) and building our [Hello World Cartesi Machine](../helloworld/cartesi-machine.md), we can now implement the method that actually instantiates and triggers the specified computation from an Ethereum smart contract.

To do that, open the `helloworld/contracts/HelloWorld.sol` file and add the following code:

```javascript
bytes32 templateHash = 0x%tutorials.helloworld.hash-full;
uint64 outputPosition = 0x9000000000000000;
uint8 outputLog2Size = 5;
uint256 finalTime = 1e11;
uint256 roundDuration = 51;
CartesiComputeInterface.Drive[] drives;
```

Let's go into some detail over these declarations. First of all, `templateHash` can be understood as an _identifier_ of the computation we intend to perform, and effectively corresponds to the initial hash that was computed for our Hello World Cartesi Machine template. In other words, the hash `0x%tutorials.helloworld.hash-trunc...` represents the complete initial state of our computation, and can be used by the Cartesi Compute nodes to securely trigger that computation off-chain.

The second declaration, `outputPosition`, bears a little more in-depth understanding of Cartesi Machines. As thoroughly described in the [Cartesi Machine command line section](/machine/host/cmdline/#flash-drives), flash drives are by default set to start at the beginning of the second half of the machine's address space, with a separation of 2<sup>60</sup> bytes between each drive. As discussed [here](/machine/host/cmdline/#state-value-proofs), the first drive is by default the one containing the machine's root file system, which thus starts at address `0x8000000000000000`. Therefore, the next drive, which corresponds to the _output drive_ defined for our HelloWorld computation, shall be set to start at address `0x9000000000000000`. Should there be more drives in our dApp, they would subsequently be located at addresses `0xA000000000000000`, `0xB000000000000000`, and so forth.
Complementing this information, the `outputLog2Size` declaration represents the log<sub>2</sub> of the output drive's size, given in bytes. As such, the provided value of `5` means that the output drive has a total size of just 32 bytes.

After that, `finalTime` corresponds to a maximum limit of cycles allowed for the computation to execute. In our case, we can set it to value `1e11`, which is more than enough to run our Hello World machine. Additionally, `roundDuration` corresponds to the amount of time allowed for each actor (claimer and challenger) to respond, and is given in seconds. Finally, the `drives` declaration allows for the definition of additional input drives, which will not be needed for our first dApp.

With those declarations all set up, we can finally implement our `instantiate` method to trigger the computation:

```javascript
function instantiate(address[] memory parties) public returns (uint256) {
    return cartesiCompute.instantiate(
        finalTime,
        templateHash,
        outputPosition,
        outputLog2Size,
        roundDuration,
        parties,
        drives,
        false
    );
}
```

The method receives as arguments the addresses of the parties that will execute and validate the computation, otherwise known as the _claimer_ and _challenger_ nodes. In our [development environment](../compute-env.md), these will correspond to the addresses for `alice` and `bob`.

The instantiation itself simply calls the corresponding method in the Cartesi Compute smart contract. This will trigger a transaction in the Ethereum network, requesting the specified computation to be carried out off-chain by the specified actors. Cartesi Compute will ensure that the appropriate nodes automatically step in to perform the computation, resolve any disputes, and finally validate the result.

At last, we should note that our method has a `uint256` return value. This value corresponds to an _index_ for this HelloWorld computation instance, which can later be used to retrieve results as explained in [the next section](getresult.md).
