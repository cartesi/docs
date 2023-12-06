---
title: Full Dogecoin Hash dApp
---

:::note Section Goal

- create Dogecoin Hash smart contract with appropriate input data
- deploy and run the dApp to verify the validity of real Dogecoin and Litecoin block headers
  :::

## Dogecoin Hash smart contract

Having successfully built a [Cartesi Machine capable of computing proof-of-work hashes for Dogecoin blocks](../dogecoin-hash/cartesi-machine.md), we can finally turn our attention to the final piece of our dApp. In other words, it is now time to implement the smart contract that will instantiate our machine's computation via Cartesi Compute.

Recalling the strategy already used for the [previous tutorials](../calculator/full-dapp.md), this smart contract will itself define the adequate input data, which in this case corresponds to information about a real Dogecoin block header. It will then provide methods to instantiate the hash computation using Cartesi Compute, and finally retrieve the corresponding result.

To begin with, create a file called `DogecoinHash.sol` within the `dogecoin-hash/contracts` directory, and place the following code in it:

```javascript
// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@cartesi/compute-sdk/contracts/CartesiComputeInterface.sol";


contract DogecoinHash {

    CartesiComputeInterface cartesiCompute;

    bytes32 templateHash = 0x%tutorials.dogecoin-hash.hash-full;

    // this dApp has an ext2 file-system (at 0x9000..) and an input drives (at 0xa000), so the output will be at 0xb000..
    uint64 outputPosition = 0xb000000000000000;
    // output hash has 32 bytes
    uint8 outputLog2Size = 5;

    uint256 finalTime = 1e11;
    uint256 roundDuration = 51;

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
    uint8 headerDataLog2Size = 7;


    constructor(address cartesiComputeAddress) {
        cartesiCompute = CartesiComputeInterface(cartesiComputeAddress);

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

    function instantiate(address[] memory parties) public returns (uint256) {

        // specifies an input drive with the header data to be hashed using scrypt
        CartesiComputeInterface.Drive[] memory drives = new CartesiComputeInterface.Drive[](1);
        drives[0] = CartesiComputeInterface.Drive(
            0xa000000000000000,    // 3rd drive position: 1st is the root file-system (0x8000..), 2nd is the mounted ext2 filesystem (0x9000..)
            headerDataLog2Size,    // driveLog2Size
            headerData,            // directValue
            "",                    // loggerIpfsPath
            0x00,                  // loggerRootHash
            parties[0],            // provider
            false,                 // waitsProvider
            false,                 // needsLogger
            false                  // downloadAsCAR
        );

        // instantiates the computation
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

    function getResult(uint256 index) public view returns (bool, bool, address, bytes memory) {
        return cartesiCompute.getResult(index);
    }
}
```

As always, we must make sure that the contract's specified `templateHash` really corresponds to the Cartesi Machine built in the previous section.
Aside from that, we can see that the code is using block header information from [Dogecoin block #100000](https://dogechain.info/block/100000), as we did when we [tested the machine off-chain](/tutorials/dogecoin-hash/cartesi-machine#test-data). Note that, as defined by the [specification](https://litecoin.info/index.php/Block_hashing_algorithm) and discussed in the [technical background](../dogecoin-hash/create-project.md#technical-background), the block header fields are concatenated together in order to produce the adequate 80 bytes long `headerData` bytes array, which is the data actually used as input for the hashing algorithm.

## Deployment and execution

Now that we have completed our smart contract, we can finally compile and deploy it to our local [development environment](../compute-env.md). To that end, we will use `hardhat-deploy` as [before](../helloworld/deploy-run.md#deployment), starting by creating a file called `01_contracts.ts` inside the `dogecoin-hash/deploy` directory, with the following contents:

```javascript
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const CartesiCompute = await get("CartesiCompute");
  await deploy("DogecoinHash", {
    from: deployer,
    log: true,
    args: [CartesiCompute.address],
  });
};

export default func;
```

After creating that file, simply execute the following command:

```bash
npx hardhat deploy --network localhost
```

Once this process completes, we are finally ready to start playing with our fully implemented dApp. To do that, we'll use Hardhat's console to instantiate the hash computation using the development environment's addresses for `alice` and `bob`:

```javascript
npx hardhat console --network localhost
> { alice, bob } = await getNamedAccounts()
> dh = await ethers.getContract("DogecoinHash")
> tx = await dh.instantiate([alice, bob])
```

At this point, Cartesi Compute will trigger the Cartesi Machine in `alice`'s Cartesi Compute node, so that it computes the adequate `scrypt` hash for the specified data referring to Dogecoin block #100000. Cartesi Compute will also automatically validate the result by running the same computation on `bob`'s node and verifying that the outputs match. Should any of the two actors cheat, Cartesi Compute would be able to guarantee that the honest side wins the dispute, thus the provided result can be trusted by all parties involved.

The final computed hash can then be retrieved by calling the `getResult` method, using the appropriate index as returned in the transaction data:

```bash
> index = (await tx.wait()).events[0].data
> result = await dh.getResult(index)
[
  true,
  false,
  '0x0000000000000000000000000000000000000000',
  '0x00000000002647462b1abb10059b1f6f363acbc93f581cc256cc208e0895e5c7'
]
```

In the above output, the computed `scrypt` hash `0x00..002647462..c7` is given as the last entry, and can be seen to match the result we got when testing our machine in the [previous section](../dogecoin-hash/cartesi-machine.md#testing-hash-computation). As discussed there, to confirm that the given block header is valid, this value must be smaller than the one encoded by the header's `difficultyBits` field, which decodes to `0x00..00267eeb0..00`. That is indeed the case, so we are now sure of the validity of this block header.

## Validating Litecoin block headers

Of course, now that we have a working smart contract for validating block headers, we don't need to stop on Dogecoin blocks. Recalling that [Dogecoin actually follows the Litecoin specification](../dogecoin-hash/create-project.md#technical-background), we can in fact use the very same procedure to validate any Litecoin block header.

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

Once our contract file has been saved, we can still use our opened Hardhat console session to recompile and redeploy our dApp. To do that, execute the following command:

```javascript
> await run("deploy")
```

Next, let's trigger the new hash computation by calling the `instantiate` method of the updated contract:

```javascript
> dh2 = await ethers.getContract("DogecoinHash")
> tx = await dh2.instantiate([alice, bob])
```

Once again, after some time we will be able to check the result:

```bash
> index = (await tx.wait()).events[0].data
> result = await dh2.getResult(index)
[
  true,
  false,
  '0x0000000000000000000000000000000000000000',
  '0x00000000000000ae7e1ecb9956e719cd7234d9f14176e2f53451553c8241bc58'
]
```

As seen above, the resulting hash `0x00..00ae7e1..58` is again a relatively small number, which is a good sign. To check if it is small enough, we need to infer the required target value by interpreting the `difficultyBits` value `0x1a01cd2d`, like we already did [before](../dogecoin-hash/cartesi-machine.md#testing-hash-computation) for the Dogecoin block:

```bash
target = 01cd2d << 8*(1a - 3) =
00000000000001cd2d0000000000000000000000000000000000000000000000
```

Indeed, the computed hash `0x00..00ae7e1..58` can be seen to be smaller than the target value `0x00..01cd2d0..00` (one less leading `0` on the latter one). This proves that the provided Litecoin block header actually indicates a valid block!

## Conclusion

With this tutorial, we have seen how it is possible to easily build a powerful and useful real-world dApp using Cartesi Compute. The core take away idea is that tasks that are too complex or too computationally intensive to be executed on-chain (in this case, running the `scrypt` algorithm) can be moved to a special _reproducible_ and _verifiable_ off-chain environment using Cartesi Machines. This environment allows dApp developers to make use of all kinds of resources normally available for centralized applications, which in this example consisted of writing arbitrary C code using the pre-existing well-established `libscrypt` library.
