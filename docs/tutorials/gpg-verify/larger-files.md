---
title: Processing larger files
---

:::note Section Goal
- use Logger service to publish data more efficiently on the blockchain
- use IPFS+Logger to avoid publishing data on the blockchain when parties collaborate
:::

## General approach

As discussed in the [documentation](../../../descartes/logger_drive), Descartes provides a *Logger service* that is capable of publishing and retrieving data more efficiently to and from the blockchain. More specifically, this service stores the information as *call data* and allows it to be split into smaller chunks, thus enabling storage of data that is larger than a single block's limit. Although not suitable for direct usage within smart contracts themselves, this strategy is perfect for passing along on-chain data *references* to off-chain components, which can then download it from the blockchain for processing.

On top of the Logger service, Descartes also features integrated IPFS support in its nodes. As also explained in the [documentation](../../../descartes/logger_drive/#ipfs-integrated-support), generally speaking IPFS alone is not sufficient to ensure data availability for verifying a computation, since it cannot guarantee that the validator nodes will be able to access the data when needed. However, in Descartes it is possible to upload the data to IPFS, and then trigger the Logger service automatically as a fallback should any node fail to retrieve it. As such, for the vast majority of cases in which actors do not misbehave, and for specific scenarios for which IPFS data availability is not an issue, using IPFS can prevent data from ever having to be published to the blockchain, with obvious benefits in terms of cost and performance.

In this context, we will now build upon our [previous DApp implementation](../full-dapp) and add a method that uses the Logger and IPFS services to allow a larger file's signature to be verified using Descartes.
## Implementation

Open the `GpgVerify.sol` file in the `gpg-verify/contracts` directory and add the following code right after the `instantiate` method:

```javascript
function instantiateWithLoggerIpfs(
    address[] memory parties,
    bytes memory documentIpfsPath,
    bytes32 documentRootHash,
    uint8 documentLog2Size,
    bytes memory signatureIpfsPath,
    bytes32 signatureRootHash,
    uint8 signatureLog2Size)
public
    returns (uint256)
{
    // specifies two input drives containing the document and the signature
    DescartesInterface.Drive[] memory drives = new DescartesInterface.Drive[](2);
    drives[0] = DescartesInterface.Drive(
        0xa000000000000000,    // 3rd drive position: 1st is the root file-system (0x8000..), 2nd is the dapp-data file-system (0x9000..)
        documentLog2Size,      // driveLog2Size
        "",                    // directValue
        documentIpfsPath,      // loggerIpfsPath
        documentRootHash,      // loggerRootHash
        parties[0],            // provider
        false,                 // waitsProvider
        true                   // needsLogger
    );
    drives[1] = DescartesInterface.Drive(
        0xb000000000000000,    // 4th drive position
        signatureLog2Size,     // driveLog2Size
        "",                    // directValue
        signatureIpfsPath,     // loggerIpfsPath
        signatureRootHash,     // loggerRootHash
        parties[0],            // provider
        false,                 // waitsProvider
        true                   // needsLogger
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
```

Similarly to the `instantiate` method implemented [in the previous section](../full-dapp), this code also defines two input drives in order to call Descartes to instantiate the computation. However, instead of providing the `directValue` drive fields, this time around user-provided indirect information about the data is given. First of all, the `loggerRootHash` parameter corresponds to the Merkle root hash of the data being submitted. This information can be used both for retrieving the data from the Logger service and for validating that downloaded data matches the previously advertised drive contents. Furthermore, the `loggerIpfsPath`, if provided, will be used to attempt to first download the data via IPFS.

With the code in place, redeploy the DApp by executing the following command:

```bash
npx hardhat deploy --network localhost
```

## Preparing the data

First of all, let's retrieve a larger file for us to play with, instead of the small `document` and `signature` files that we had previously hard-coded into our contract. In this tutorial, we will make use of a 33K image that portrays Descartes himself.

Let's begin by switching back to the `cartesi-machine` directory:

```bash
cd cartesi-machine
```

Once there, the image and its corresponding signature from our fictional user `descartes.tutorials@cartesi.io` can be downloaded by running the following commands:

```bash
wget https://github.com/cartesi/descartes-tutorials/raw/master/gpg-verify/cartesi-machine/portrait.jpg
wget https://github.com/cartesi/descartes-tutorials/raw/master/gpg-verify/cartesi-machine/portrait.sig
```

In order to use the Logger and IPFS services, the first step is to compute the Merkle root hash of the data that is going to be processed. This hash will serve as an identifier when retrieving the corresponding data from the Cartesi `Logger` smart contract deployed on the blockchain.

Within the specific context of this DApp, the Cartesi Machine expects the input data to have its content length encoded in each drive's four initial bytes, as [previously discussed](../cartesi-machine). Thus, before computing any hash we must first prepare our data by prepending each file with its content length. This is a simple operation that can be implemented using a tiny Lua script, as follows.

First, hop into the playground mapping the current directory:

```bash
docker run -it --rm \
  -e USER=$(id -u -n) \
  -e GROUP=$(id -g -n) \
  -e UID=$(id -u) \
  -e GID=$(id -g) \
  -v `pwd`:/home/$(id -u -n) \
  -w /home/$(id -u -n) \
  cartesi/playground:0.3.0 /bin/bash
```

Now run the following commands to prepend the portrait image and signature with their respective content lengths:

```bash
cat portrait.jpg | luapp5.3 -e 'io.write((string.pack(">s4", io.read("a"))))' > portrait.jpg.prepended
cat portrait.sig | luapp5.3 -e 'io.write((string.pack(">s4", io.read("a"))))' > portrait.sig.prepended
```

The Lua expression used here is basically the opposite of the code used in the `gpg-verify.sh` script to read the input data within the Cartesi Machine, as discussed in the [GpgVerify machine section](../cartesi-machine). The commands will generate `*.prepended` files 4 bytes larger than the original ones.


## Using the Logger service

Now that we have prepared our data, we can proceed to compute the Merkle root hashes necessary for using the Logger service. The easiest way to do that is to use the `merkle-tree-hash` utility available inside the playground.

In order to use this utility, we must provide two parameters `input` and `tree-log2-size`, which respectively correspond to the file containing the data to be submitted and the total log<sub>2</sub> size of the data from which the Merkle tree will be computed. More specifically, this second parameter `tree-log2-size` should correspond to a number *n* for which *2<sup>n</sup>* is equal to or larger than the file length in bytes.

We can thus compute the desired Merkle root hashes for our data with the following commands:

```bash
merkle-tree-hash --input=portrait.jpg.prepended --tree-log2-size=16 | tr -d "\n" > portrait.jpg.prepended.merkle
merkle-tree-hash --input=portrait.sig.prepended --tree-log2-size=10 | tr -d "\n" > portrait.sig.prepended.merkle
```

In which we define the total portrait document tree size as 64KiB (2<sup>16</sup>), while its signature has tree size 1KiB (2<sup>10</sup>). The resulting hashes will be stored in corresponding `*.merkle` files.

The next step is to make the data and their corresponding Merkle root hashes available to the Logger service. As discussed in the [Logger section of the documentation](../../../descartes/logger_drive), one option is to directly submit the data to the Logger smart contract deployed on-chain. However, if you have access to the Descartes node serving as the drive's *provider*, as we do, a more practical option is to simply copy the contents to the appropriate directory mapped by the Logger service, naming each file after its corresponding Merkle root hash. From there, the node's Logger service will be able to publish the data on-chain when requested by a Descartes computation instantiation.

Let's first leave the playground:

```bash
exit
```
In our DApp, `alice` is serving as the drive's provider, since that is the address given by `parties[0]`. As such, we can make the files available by executing the following commands:

```bash
cp portrait.jpg.prepended ../../descartes-env/alice_data/$(cat portrait.jpg.prepended.merkle)
cp portrait.sig.prepended ../../descartes-env/alice_data/$(cat portrait.sig.prepended.merkle)
```

Now, with everything set up for the Logger service, it would already be possible to instantiate our signature verification computation using only the data's Merkle root hashes. However, before doing that, let's take a look at Descartes' IPFS functionality.

## Using IPFS

As interesting as it is to be able to handle a 33K image in a computation validated by a smart contract, some important limitations remain. In particular, the data is still going to be necessarily submitted to the blockchain, a fact that in the real world would incur in fees and delays that could lend intensive usage of the DApp quite prohibitive.

As discussed above, this inconvenience can be tackled by coupling the Logger service we just explored with IPFS. The idea is to upload the data to IPFS before the computation is instantiated. As such, if all validator nodes cooperate, then no data will need to be sent over to the blockchain.

In this tutorial, we will submit our data to IPFS using the Infura IPFS service, an action that can be performed with a simple `cURL` POST call. To avoid repeating ourselves, and to capture the resulting IPFS hash, let's create a small shell script:

```bash
touch ipfs-submit.sh
chmod +x ipfs-submit.sh
```

Then place these contents into the file:

```bash
#!/bin/bash

if [ ! $1 ]; then
  echo "1 parameter required: file to submit"
  exit 1
fi

output=$(curl -X POST -s -F file=@$1 "https://ipfs.infura.io:5001/api/v0/add?pin=true")

# searches for string 'Hash":"', after which comes the desired 46-char IPFS hash value
output=${output#*Hash\":\"}
ipfs_hash=${output:0:46}

echo $ipfs_hash
printf $ipfs_hash > $1.ipfs
```

Now we can submit our 33K image and its signature to IPFS by running the following commands:

```bash
./ipfs-submit.sh portrait.jpg.prepended
./ipfs-submit.sh portrait.sig.prepended
```

As such, the files are now publicly available on IPFS, and their paths can be found in the corresponding `*.ipfs` files.

## Running the DApp

Finally, with our files published on IPFS and made available to the Logger service as a fallback guarantee, we can now hop into Hardhat's console to instantiate the signature verification computation, using only the data's Merkle root hashes and IPFS paths:

```javascript
npx hardhat console --network localhost
> fs = require('fs')
> docRootHash = "0x" + fs.readFileSync('portrait.jpg.prepended.merkle')
> sigRootHash = "0x" + fs.readFileSync('portrait.sig.prepended.merkle')
> docIpfsPath = "/ipfs/" + fs.readFileSync('portrait.jpg.prepended.ipfs')
> sigIpfsPath = "/ipfs/" + fs.readFileSync('portrait.sig.prepended.ipfs')
> docIpfsPathBytes = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(docIpfsPath))
> sigIpfsPathBytes = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(sigIpfsPath))
> { alice, bob } = await getNamedAccounts()
> gpg = await ethers.getContract("GpgVerify")
> tx = await gpg.instantiateWithLoggerIpfs([alice, bob], docIpfsPathBytes, docRootHash, 16, sigIpfsPathBytes, sigRootHash, 10)
```

Notice that the IPFS paths correspond to the IPFS hashes prepended by `/ipfs/`. Aside from that, they need to be given as `bytes`, and thus we use `ethers` utilities to convert them into proper hex strings. Finally, we can see that the instantiation call specifies the document's and signature's respective log<sub>2</sub> sizes of 16 (64KiB) and 10 (1KiB).

After a while, we should be able to obtain the signature verification result, as before:

```javascript
> index = (await tx.wait()).events[0].data
> result = await gpg.getResult(index)
[
  true,
  false,
  '0x0000000000000000000000000000000000000000',
  '0x300a000000000000000000000000000000000000000000000000000000000000'
]
> console.log(ethers.utils.toUtf8String(result[3]))
0
```

Which, as noted in the [previous section](../full-dapp), represents that the computation successfully identified the document's signature as valid.

With this setup, the Descartes nodes have downloaded the data from IPFS, computed the Merkle root hashes locally, and checked them against the drive's advertised hashes. As such, the data was *never* uploaded to the blockchain. However, should the data be removed from IPFS, which cannot be verified by on-chain code, any node that cannot retrieve it will request the drive's provider to post the data. This process is done automatically by Descartes, and it can be reproduced here by simply instantiating the same computation using the correct Merkle root hashes but invalid IPFS paths.

## Conclusion

In this last section, we have seen how Descartes allows DApps to handle inputs larger than those normally viable for blockchain applications, and in a much more efficient way.

Furthermore, this GPG verification tutorial as a whole, albeit relatively simple, illustrates how Descartes enables smart contracts to solve common and relevant tasks by taking advantage of proven and mature libraries available in Linux, like `GnuPG`, and without compromising on decentralization. The advantages of this strategy should not be taken lightly, since re-implementing such tools in Solidity is often unfeasible and almost always less secure, given that it will inevitably lack the maturity and stability that comes with decades of usage and refinement.
