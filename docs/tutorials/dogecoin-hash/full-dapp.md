---
title: Full Dogecoin Hash DApp
---

:::note Section Goal
- create Dogecoin Hash smart contract with appropriate input data
- deploy and run the DApp to verify the validity of real Dogecoin and Litecoin block headers
:::


## Dogecoin Hash smart contract

Having successfully built a [Cartesi Machine capable of computing proof-of-work hashes for Dogecoin blocks](../cartesi-machine), we can finally turn our attention to the final piece of our DApp. In other words, it is now time to implement the smart contract that will instantiate our machine's computation via Descartes.

Recalling the strategy already used for the [previous tutorials](../../calculator/full-dapp), this smart contract will itself define the adequate input data, which in this case corresponds to information about a real Dogecoin block header. It will then provide methods to instantiate the hash computation using Descartes, and finally retrieving the corresponding result.

To begin with, create a file called `DogecoinHash.sol` within the `dogecoin-hash/contracts` directory, and place the following code in it:

```javascript
pragma solidity >=0.4.25 <0.7.0;
pragma experimental ABIEncoderV2;

import "@cartesi/descartes-sdk/contracts/DescartesInterface.sol";


contract DogecoinHash {

    DescartesInterface descartes;

    bytes32 templateHash = 0x8bc459031809fcb366953f8373b3f202450ecbae51f3f724354480638725ff38;

    // this DApp has an ext2 file-system (at 0x9000..) and an input drives (at 0xa000), so the output will be at 0xb000..
    uint64 outputPosition = 0xb000000000000000;
    // output hash has 32 bytes
    uint64 outputLog2Size = 5;

    uint256 finalTime = 1e13;
    uint256 roundDuration = 45;

    // header data for DOGE block #100000 (https://dogechain.info/block/100000)
    bytes4 version = 0x00000002;
    bytes32 prevBlock = 0x12aca0938fe1fb786c9e0e4375900e8333123de75e240abd3337d1b411d14ebe;
    bytes32 merkleRootHash = 0x31757c266102d1bee62ef2ff8438663107d64bdd5d9d9173421ec25fb2a814de;
    bytes4 timestamp = 0x52fd869d;         // 2014-02-13 18:59:41 -0800, which is timestamp 1392346781 in decimal
    bytes4 difficultyBits = 0x1b267eeb;
    bytes4 nonce = 0x84214800;             // 2216773632 in decimal

    // input data for the scrypt hashing algorithm, based on the header info
    // - actual size is 80 bytes, next power of 2 size is 128
    bytes headerData = new bytes(128);
    uint64 headerDataLog2Size = 7;


    constructor(address descartesAddress) public {
        descartes = DescartesInterface(descartesAddress);

        // defines headerData by concatenating block header fields
        uint iHeader = 0;
        uint i;
        for (i = 0; i < version.length; i++)        {headerData[iHeader++] = version[i];}
        for (i = 0; i < prevBlock.length; i++)      {headerData[iHeader++] = prevBlock[i];}
        for (i = 0; i < merkleRootHash.length; i++) {headerData[iHeader++] = merkleRootHash[i];}
        for (i = 0; i < timestamp.length; i++)      {headerData[iHeader++] = timestamp[i];}
        for (i = 0; i < difficultyBits.length; i++) {headerData[iHeader++] = difficultyBits[i];}
        for (i = 0; i < nonce.length; i++)          {headerData[iHeader++] = nonce[i];}
    }

    function instantiate(address claimer, address challenger) public returns (uint256) {

        // specifies an input drive with the header data to be hashed using scrypt
        DescartesInterface.Drive[] memory drives = new DescartesInterface.Drive[](1);
        drives[0] = DescartesInterface.Drive(
            0xa000000000000000,    // 3rd drive position: 1st is the root file-system (0x8000..), 2nd is the mounted ext2 filesystem (0x9000..)
            headerDataLog2Size,    // driveLog2Size
            headerData,            // directValue
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

As always, we must make sure that the contract's specified `templateHash` really corresponds to the Cartesi Machine built in the [previous section](../cartesi-machine/#full-machine-implementation).
Aside from that, we can see that the code is using block header information from [Dogecoin block #100000](https://dogechain.info/block/100000), as we did when we [tested the machine off-chain](../cartesi-machine/#test-data). Note that, as defined by the [specification](https://litecoin.info/index.php/Block_hashing_algorithm) and discussed in the [technical background](../create-project/#technical-background), the block header fields are concatenated together in order to produce the adequate 80 bytes long `headerData` bytes array, which is the data actually used as input for the hashing algorithm.


## Deployment and Execution

Now that we have completed our smart contract, we can finally compile and deploy it to our local [development environment](../../descartes-env). To that end, we will use Truffle migrations as [before](../../helloworld/deploy-run#deployment), starting by creating a file called `2_deploy_contracts.js` inside the `dogecoin-hash/migrations` directory with the following contents:

```javascript
const contract = require("@truffle/contract");
const Descartes = contract(require("../../descartes-env/blockchain/node_modules/@cartesi/descartes-sdk/build/contracts/Descartes.json"));

const DogecoinHash = artifacts.require("DogecoinHash");

module.exports = function(deployer) {
  Descartes.setNetwork(deployer.network_id);
  deployer.deploy(DogecoinHash, Descartes.address);
};
```

After creating that file, simply execute the following command:

```bash
truffle migrate
```

Once this process completes, we are finally ready to start playing with our fully implemented DApp. To do that, we'll use Truffle's console to instantiate the hash computation using the development environment's addresses for `alice` (`0xe9bE0C1...`) and `bob` (`0x91472C...`):

```bash
truffle console
truffle(development)> dh = await DogecoinHash.deployed()
truffle(development)> dh.instantiate('0xe9bE0C14D35c5fA61B8c0B34f4c4e2891eC12e7E', '0x91472CCE70B1080FdD969D41151F2763a4A22717')
```

At this point, Descartes will trigger the Cartesi Machine in `alice`'s Descartes node, so that it computes the adequate `scrypt` hash for the specified data referring to Dogecoin block #100000. Descartes will also automatically validate the result by running the same computation on `bob`'s node and verifying that the outputs match. Should any of the two actors cheat, Descartes would be able to guarantee that the honest side wins the dispute, thus the provided result can be trusted by all parties involved.

The final computed hash can then be retrieved by calling the `getResult` method:

```bash
truffle(development)> dh.getResult(0)
Result {
  '0': true,
  '1': false,
  '2': '0x0000000000000000000000000000000000000000',
  '3': '0x00000000002647462b1abb10059b1f6f363acbc93f581cc256cc208e0895e5c7'
}
```

In the above output, the computed `scrypt` hash `0x00..002647462..c7` is given in index `3`, and can be seen to match the result we got when testing our machine in the [previous section](../cartesi-machine/#testing-hash-computation). As discussed there, to confirm that the given block header is valid, this value must be smaller than the one encoded by the header's `difficultyBits` field, which decodes to `0x00..00267eeb0..00`. That is indeed the case, so we are now sure of the validity of this block header.


## Validating Litecoin block headers

Of course, now that we have a working smart contract for validating block headers, we don't need to stop on Dogecoin blocks. Recalling that [Dogecoin actually follows the Litecoin specification](../create-project/#technical-background), we can in fact use the very same procedure to validate any Litecoin block header.

To do that, we simply need to change our contract code to declare the header data of a Litecoin block. In this case, we'll use 
[LTC block #1881577](https://chainz.cryptoid.info/ltc/block.dws?1881577.htm), so that our code will now look like this:

```javascript
bytes4 version = 0x20000000;
bytes32 prevBlock = 0xb417303fb9ac36d8323050124d7298827e1da58cd1f66cb8d0aea8caf37d9095;
bytes32 merkleRootHash = 0x3e17b9b078117ea1f51bd0f8ac9a346cb99ee0bc97c97fa93d7d789311f442e9;
bytes4 timestamp = 0x5f189264;         // 2020-07-22 19:24:20, which is timestamp 1595445860 in decimal
bytes4 difficultyBits = 0x1a01cd2d;
bytes4 nonce = 0x84dd91a8;
```

Once our contract file has been saved, we can still use our opened Truffle console session to recompile and redeploy our DApp. To do that, execute the following command:

```bash
truffle(development)> migrate --reset
```

Next, let's trigger the new hash computation by calling the `instantiate` method of the updated contract:

```bash
truffle(development)> dh2 = await DogecoinHash.deployed()
truffle(development)> dh2.instantiate('0xe9bE0C14D35c5fA61B8c0B34f4c4e2891eC12e7E', '0x91472CCE70B1080FdD969D41151F2763a4A22717')
```

Once again, after some time we will be able to check the result:

```bash
truffle(development)> dh.getResult(0)
Result {
  '0': true,
  '1': false,
  '2': '0x0000000000000000000000000000000000000000',
  '3': '0x00000000000000ae7e1ecb9956e719cd7234d9f14176e2f53451553c8241bc58'
}
```

As seen above, the resulting hash `0x00..00ae7e1..58` is again a relatively small number, which is a good sign. To check if it is small enough, we need to infer the required target value by interpreting the `difficultyBits` value `0x1a01cd2d`, like we already did [before](../cartesi-machine/#testing-hash-computation) for the Dogecoin block:

```bash
target = 01cd2d << 8*(1a - 3) = 
00000000000001cd2d0000000000000000000000000000000000000000000000
```

Indeed, the computed hash `0x00..00ae7e1..58` can be seen to be smaller than the target value `0x00..01cd2d0..00` (one less leading `0` on the latter one). This proves that the provided Litecoin block header actually indicates a valid block!


## Conclusion

With this tutorial, we have seen how it is possible to easily build a powerful and useful real-world DApp using Descartes. The core take away idea is that tasks that are too complex or too computationally intensive to be executed on-chain (in this case, running the `scrypt` algorithm) can be moved to a special *reproducible* and *verifiable* off-chain environment using Cartesi Machines. This environment allows DApp developers to make use of all kinds of resources normally available for centralized applications, which in this example consisted of writing arbitrary C code using the pre-existing well-established `libscrypt` library.
