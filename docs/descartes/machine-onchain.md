---
title: Machines on-chain
---

Having discussed the concept of Cartesi Machines off-chain, capable of booting a Linux operating system and load heavy weight libraries, one naturally wonders how this is all going to be stored or executed on the limited environment of a blockchain. The simple answer is that it isn’t.

For the blockchain, the whole machine is represented by a single 32-bytes hash (more precisely a Merkle-tree hash). This may sound surprising, because Cartesi claims to give the blockchain the full power to adjudicate in a secure and decentralized way any disputes that may arise as to what the output of such execution is. One may wonder how this is even possible if the blockchain does not have access to the full contents of the machine, but rather a single hash? This is a good question that is explained in detail in [here](../../machine/blockchain/hash), but for the purpose of this document, it is sufficient to believe that there is an *interactive verification* algorithm that makes this possible.

Given that machines will be stored on-chain as a single hash, it is clearly important for the developer to be able to retrieve such value. This can be done with the following instruction:
```
give here the command to extract the hash from a folder specifying a machine
```
Take note of this hash, it will be important later as the machine is set on-chain.

Recall that our machine’s execution depends on a set of inputs and they are not specified in this single hash. More precisely, the hash obtained from the above command corresponds to a machine with all its input drives and the output drive in a pristine state, i.e. filled with zeros.

It is not very useful to have all input drives filled with zeros of course. One needs a mechanism to insert useful data into them.
But before describing how this "drive replacement" is done, one needs to discuss the *metadata* that describes these input drives.

In summary, the blockchain is aware of the existence of these drives, their number, positions and sizes. Not only that, the blockchain will have some metadata that specifies how they will be later filled: who has the right to insert data on each drive, in which order this will be done and which methods will be used to accomplish this.

Since the next section will go through all these details involved in specifying a machine on-chain, it suffices now to have an informal explanation of how machines are represented on-chain.

Machines are specified on Descartes smart contracts as a single hash that corresponds to the machine with pristine input and output drives. In addition to this, the blockchain is aware of metadata containing the number of drives, their positions, sizes and more.
