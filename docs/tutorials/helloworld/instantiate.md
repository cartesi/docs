---
title: Instantiating the computation
---

:::note Section Goal
- implement smart contract `instantiate` method to start the Descartes computation
- understand Descartes parameters
:::


After creating our [basic HelloWorld DApp project](../create-project/) and building our [Hello World Cartesi Machine](../cartesi-machine/), we can now implement the method that actually instantiates and triggers the specified computation.

To do that, open the `helloworld/contracts/HelloWorld.sol` file and add the following code:

```javascript
bytes32 templateHash = 0x67713d54d15ab1f24ce34e2d89b480ba58200684740ed69be236e4ba3d6dd451;
uint64 outputPosition = 0x9000000000000000;
uint256 finalTime = 1e8;
uint256 roundDuration = 45;
DescartesInterface.Drive[] drives;
```

Let's go into some detail over these declarations. First of all, `templateHash` can be understood as an *identifier* of the computation we intend to perform, and effectively corresponds to the initial hash that was computed for our Hello World Cartesi Machine template. In other words, the hash `0x67713d54...` represents the complete initial state of our computation, and can be used by the Descartes nodes to securely trigger that computation off-chain.

The second declaration, `outputPosition`, bears a little more in-depth understanding of Cartesi Machines. As thoroughly described in the [Cartesi Machine command line section](../../../machine/host/cmdline/#flash-drives), flash drives are by default set to start at the beginning of the second half of the machine's address space, with a separation of 2<sup>60</sup> bytes between each drive. As discussed [here](../../../machine/host/cmdline/#state-value-proofs), the first drive is by default the one containing the machine's root file system, which thus starts at address `0x8000000000000000`. Therefore, the next drive, which corresponds to the *output drive* defined for our HelloWorld computation, shall be set to start at address `0x9000000000000000`. Should there be more drives in our DApp, they would subsequently be located at addresses `0xA000000000000000`, `0xB000000000000000`, and so forth.

After that, `finalTime` corresponds to a maximum limit of cycles allowed for the computation to execute. In our case, we can set it to value `1e8`, which is more than enough to run our Hello World machine. Additionally, `roundDuration` corresponds to the amount of time allowed for each actor (claimer and challenger) to respond, and is given in seconds. Finally, the `drives` declaration allows for the definition of additional drives, which will not be needed for our first DApp.

With those declarations all set up, we can finally implement our `instantiate` method to trigger the computation:

```javascript
function instantiate(address claimer, address challenger) public returns (uint256) {
    return descartes.instantiate(
        finalTime,
        templateHash,
        outputPosition,
        roundDuration,
        claimer,
        challenger,
        drives
    );
}
```

The method receives as arguments the addresses of the *claimer* and *challenger* users that will respectively execute and validate the computation. In our [development environment](../../descartes-env/), these will correspond to the addresses for `alice` and `bob`.

The instantiation itself simply calls the corresponding method in the Descartes smart contract. This will trigger a transaction in the Ethereum network, requesting the specified computation to be carried out off-chain by the specified actors. Descartes will ensure that the appropriate nodes automatically step in to perform the computation, resolve any disputes, and finally validate the result.

At last, we should note that our method has a `uint256` return value. This value corresponds to an *index* for this HelloWorld computation instance, which can later be used to retrieve results as explained in [the next section](getresult.md).
