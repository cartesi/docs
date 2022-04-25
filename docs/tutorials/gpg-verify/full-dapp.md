---
title: Full GPG Verify DApp
---

:::note Section Goal
- create GPG Verify smart contract with appropriate input data
- deploy and run the GPG Verify DApp
:::


## GPG Verify smart contract

The implementation of this DApp's smart contract will naturally follow the same structure of the [previous tutorials](../../calculator/full-dapp). Namely, it will define input drives containing the necessary data and provide methods to instantiate a Descartes computation using that data and then retrieve the corresponding result.

To that end, create a file called `GpgVerify.sol` in the `gpg-verify/contracts` directory, with the following content:

```javascript
// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "@cartesi/descartes-sdk/contracts/DescartesInterface.sol";


contract GpgVerify {

    DescartesInterface descartes;

    bytes32 templateHash = 0x%tutorials.gpg-verify.hash-full;

    // this DApp has an ext2 file-system (at 0x9000..) and two input drives (at 0xa000.. and 0xb000..), so the output will be at 0xc000..
    uint64 outputPosition = 0xc000000000000000;
    // output will be "0" (success, no errors), "1" (failure), or some other error code that certainly fits into the minimum size of 32 bytes
    uint8 outputLog2Size = 5;

    uint256 finalTime = 1e11;
    uint256 roundDuration = 75;

    // document that was signed
    bytes document = "My public statement\n";

    // detached signature for the document, produced with a private key
    // - the DApp off-chain code must contain the corresponding public key in order to verify the signature
    bytes signature = hex'8901d20400010a003d162104dbbbb50ddc0910795f7c0b48a86d9cb964eb527e05025f19fa431f1c6465736361727465732e7475746f7269616c7340636172746573692e696f'
                      hex'000a0910a86d9cb964eb527ed88f0bf745cac22eca54a050edf5ce62ab5c8857bab9807d4b6cc4b01b47c640669f14c9457d129225d005585f7a4cec2c41bd088b0d622c4ee2'
                      hex'9eecb4a451461e421d0067575bd845818a12df0b197e525da3dea2c89f0210325d766a11da824d9469bea5add6c9f91c09098f72cca806f4b0eb3ff622531171f9ae5b855366'
                      hex'd250d08e05327549a9a958b44530f2a05cd9b6aa463eda223f16ff8655ab2e4bf7f66bb2fa29913c1f04080a24dd10e754d277c346909a3510305b7fd9ca2a4bbd412fc50818'
                      hex'331b40461380174434f90046bfb6278419b69259e56abfa504c5965e37d1aa355302d8b6aac98abe5be1c02c78d5a2e9e4df0eba43a91717407811e20b800120f349aa1b51a1'
                      hex'e4ad5ffdf6248ef0201b275e947d81ed8267a473778cab78ead5f39e60edaf9c17a6c558eeb0ca7e7acc1343a1f7a431d21598edd470a080ed377ab0c4824f95589ab1c40568'
                      hex'e8a28b36ac20116586f89ebe193af5898aa947ada15bbbb8d09e3894c33d7bdb20a8b1bc6be60ac03fdbc0be0ffdfa326c';

    // corresponding document and signature data to be sent as input drives to the off-chain Cartesi Machine
    // - this machine expects the first four bytes of the input data to encode the length of the content of interest
    bytes documentData = new bytes(1024);
    bytes signatureData = new bytes(1024);

    constructor(address descartesAddress) {
        descartes = DescartesInterface(descartesAddress);

        // prepares data: computation expects input data to be prepended by four bytes that encode the length of the content
        prependDataWithContentLength(document, documentData);
        prependDataWithContentLength(signature, signatureData);
    }

    function prependDataWithContentLength(bytes storage input, bytes storage output) internal {
        // length is assumed to fit in four bytes
        assert(input.length <= 0xffffffff);

        // sets first four bytes in output as the input length
        bytes memory inputLength = abi.encodePacked(input.length);
        output[0] = inputLength[inputLength.length-4];
        output[1] = inputLength[inputLength.length-3];
        output[2] = inputLength[inputLength.length-2];
        output[3] = inputLength[inputLength.length-1];

        // subsequent bytes in output are the input bytes themselves
        for (uint i = 0; i < input.length && i+4 < output.length; i++) {
          output[i+4] = input[i];
        }
    }

    function instantiate(address[] memory parties) public returns (uint256) {

        // specifies two input drives containing the document and the signature
        DescartesInterface.Drive[] memory drives = new DescartesInterface.Drive[](2);
        drives[0] = DescartesInterface.Drive(
            0xa000000000000000,    // 3rd drive position: 1st is the root file-system (0x8000..), 2nd is the dapp-data file-system (0x9000..)
            10,                    // driveLog2Size
            documentData,          // directValue
            "",                    // loggerIpfsPath
            0x00,                  // loggerRootHash
            parties[0],            // provider
            false,                 // waitsProvider
            false                  // needsLogger
        );
        drives[1] = DescartesInterface.Drive(
            0xb000000000000000,    // 4th drive position
            10,                    // driveLog2Size
            signatureData,         // directValue
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

As detailed in the [previous section](../cartesi-machine/#full-machine-implementation), our DApp's Cartesi Machine specifies two input flash drives, one for an arbitrary document and another for an associated digital signature that asserts the authenticity and integrity of the document's contents. This is reflected in the `drives` definition within the `instantiate` method, which in this implementation establishes a total limit of 1024 bytes (log<sub>2</sub> size `10`) for each input drive content.

In the code above, the input data itself is arbitrarily defined so as to match the test data we used [before](../ext2-gpg/#test-data). However, as discussed in the [preceding section](../cartesi-machine), the actual data submitted to the Cartesi Machine is required to have its content length encoded in each drive's four initial bytes. This is achieved by calling the method `prependDataWithContentLength` and using that method's output in the computation instantiation.


## Deployment and execution

With the smart contract implemented, it's time to compile and deploy it to the local network within our [development environment](../../descartes-env). Using Hardhat, as in the [other tutorials](../../helloworld/deploy-run#deployment), we'll start by adding a file named `01_contracts.ts` to the `gpg-verify/deploy` directory and inserting the following code into it:

```javascript
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const Descartes = await get("Descartes");
  await deploy("GpgVerify", {
    from: deployer,
    log: true,
    args: [Descartes.address],
  });
};

export default func;
```

Then, deploy the contract by typing:

```bash
npx hardhat deploy --network localhost
```

After the contract is compiled and deployed, we can enter Hardhat's console and instantiate a GPG verification computation for the Descartes nodes associated with the development environment's addresses for `alice` and `bob`:

```javascript
npx hardhat console --network localhost
> { alice, bob } = await getNamedAccounts()
> gpg = await ethers.getContract("GpgVerify")
> tx = await gpg.instantiate([alice, bob])
```

Finally, after some time it will possible to query the GPG verification result by calling the `getResult` method for the computation's index:

```javascript
> index = (await tx.wait()).events[0].data
> result = await gpg.getResult(index)
[
  true,
  false,
  '0x0000000000000000000000000000000000000000',
  '0x300a000000000000000000000000000000000000000000000000000000000000'
]
```

Recalling that the output of the Cartesi Machine's [execution script](../cartesi-machine/#final-execution-script) corresponds to the `gpg` tool's exit status, we must interpret the result data as an ASCII value that can represent success (`"0"`), failure (`"1"`), or other values for errors. This can be done by using `ethers` to print the output data as a string:

```javascript
> console.log(ethers.utils.toUtf8String(result[3]))
0
```

Which indicates "success" - or, in other words, that the provided document is indeed guaranteed to have been produced and adequately signed by someone in possession of the private key for `descartes.tutorials@cartesi.io`, and that the document's data has not been tampered.

Should you change the `document` declaration in the smart contract, the output would become `"1"` (i.e., "failure"). Additionally, changing the data for the `signature` variable would either also lead to failure (i.e., signature no longer matches) or possibly to an error, in the case that the data no longer represents a valid digital signature. In this case, a different non-zero result would be retrieved.

Although fully functional, there is still one important aspect of our DApp that can render it unusable for many real-world scenarios: how the input data is fed into the computation. Indeed, the code above, which uses *direct drives*, implies that the document whose signature is being verified must be directly available to the smart contract as a `bytes` object. This is unfortunately not a really scalable solution, given the storage limitations and accompanying high costs of blockchains like Ethereum. As such, in the next section we will cover a couple of Descartes features that can tackle this issue to allow DApps to process larger volumes of data.
