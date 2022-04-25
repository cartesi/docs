---
title: Logger drives
---

A relevant limitation of the Cartesi Machines as they have been described until now is the size of their input drives.
More precisely, even though the provided drives have no exact size limitations, in practice there is a cap to the amount of data that can be used, which is given by the maximum transaction size allowed by the blockchain itself (e.g., by the Ethereum network).

In other words, without using the *Logger Feature* presented here, there is a practical limitation to the amount of data that can be used to perform a computation using Descartes. As such, this section describes how to use this service in order to submit much larger drives to the machine, without paying a prohibitively large transaction cost.

Recall the definition of the `Drive` structure:

```javascript
struct Drive {
    uint64 position;
    uint8 driveLog2Size;
    bytes directValue;
    bytes loggerIpfsPath;
    bytes32 loggerRootHash;
    address provider;
    bool waitsProvider;
    bool needsLogger;
}
```

Let's take a look at the parameters that are mandatory for using the Logger Service:

- **`needsLogger`** is a Boolean value that enables the Logger Service, effectively indicating whether Descartes should attempt to retrieve the input drive's data from there;

- **`loggerRootHash`** corresponds to the *Merkle root hash* of the drive contents, which serves as an identifier for retrieving the data from the Logger Service.

The basic concept of the Logger Service is to split the drive's contents into *chunks*, so that the total drive size is no longer limited by the network's block capacity. On top of that, on Ethereum these chunks of data are also stored as *call data*, meaning that the data does not remain within the EVM's regular storage, but rather inside the read-only transaction history. This strategy ensures that less resources are spent even though the information is also kept in the chain forever, thus allowing for a cheaper way of sending input data for a computation.

## The Logger contract

In practice, an off-chain component (e.g., a Descartes node or an application client) will be responsible for splitting up the original input data and sending it over to the *Cartesi Logger smart contract* deployed on the blockchain.

For each data chunk or *page*, a Merkle hash will be computed considering a tree with 64-bit (8-byte) leaves, which corresponds to the word size of the RISC-V Cartesi Machine. This ensures that a Merkle proof can be used to validate any given sequence of data within the drive. It is of course mandatory that each data page can fit into the blockchain's size limits.

In the end, a Merkle root hash is computed for the complete drive considering all its data pages, which is then called the drive's `loggerRootHash`.

The on-chain Logger contract is thus composed of two basic methods:

- **`calculateMerkleRootFromData`** stores a given chunk of data, yielding both a Merkle root hash and an *index* identifier for the data page;

- **`calculateMerkleRootFromHistory`** returns the final Merkle root hash for a given set of data pages previously stored by calling `calculateMerkleRootFromData`.

Notice that, being stored as call data, the drive contents are actually inaccessible to any other smart contract running on-chain. However, off-chain components can still retrieve the data via the Logger contract, most notably the Descartes nodes that will download this information in order to perform the desired computation.

## The off-chain Logger server

The Descartes node includes an off-chain service that communicates with the on-chain Logger contract. When the drive's data is uploaded to the Logger Service before instantiating the computation, the Descartes off-chain component simply uses the `loggerRootHash` specified for the drive to download the corresponding data from the blockchain. It then locally computes the Merkle root hash of the retrieved content and compares it with the advertised hash, in order to validate the integrity of the data.

Descartes also supports a distinct setup, in which the drive's contents are first stored locally by the node acting as the drive's *provider* (i.e., the party responsible for the drive's contents, as discussed in the [previous section](../provider)). As such, when instantiating a computation Descartes can automatically detect if the required input data is not yet available on-chain, and in this case it will notify the provider's node asking for it to be uploaded. The entire process is transparent to the user and DApp developer, ensuring that all participating nodes have guaranteed access to the input contents.

## Integrated IPFS support

Another important feature of Descartes' Logger Service corresponds to the possibility of using the [InterPlanetary File System (IPFS)](https://ipfs.io/) to allow Cartesi Machines to use large input drives without necessarily having to submit the data to the blockchain. This can be configured by specifying the following Drive field:

- **`loggerIpfsPath`** identifies an object path in IPFS that remotely stores the same data identified by `loggerRootHash`.

Although IPFS is a decentralized storage framework, it is vital to understand that it cannot by itself offer the security guarantees necessary for validating an off-chain computation. This is known as the *data availability problem*, and basically boils down to the fact that with IPFS the on-chain code cannot ensure that all participating parties have proper access to the data. In other words, a malicious party could always simply remove access to the IPFS file and prevent other parties from performing a computation.

Descartes provides a solution to this problem by always providing the Logger Service as a *fallback* mechanism. As such, if any party challenges the availability of IPFS-stored data, Descartes will notify the drive's provider node and ask it to submit it to the blockchain. Once the data is on-chain, there can no longer be any debate over its availability. If the provider node fails to upload the data, the computation will fail and the provider will be blamed. The DApp developer can decide about the appropriate consequences of a failure of this kind.

On the other hand, in the vast majority of cases in which the parties cooperate, the drive's contents will indeed be available on IPFS and all nodes will be capable of validating the computation with that data. This way, mass usage of large input drives for Descartes DApps becomes viable and cost-effective in practice, opening the door for a much wider range of applications.
