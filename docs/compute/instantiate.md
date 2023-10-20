---
title: Instantiate
tags: [maintain, sdk, off-chain, instantiate, low-level developer]
---

This section describes the main ingredient of the on-chain Cartesi Compute infrastructure.
The `instantiate` is a function call within the Cartesi Compute smart contract that is responsible for requesting and fully specifying a computation to be performed off-chain.

The signature of the `instantiate` call is given below.
```javascript
function instantiate(
     uint256 _finalTime,
     bytes32 _templateHash,
     uint64 _outputPosition,
     uint8 _outputLog2Size,
     uint256 _roundDuration,
     address[] memory _parties,
     Drive[] memory _inputDrives,
     bool _noChallengeDrive) external returns (uint256);
```

**`_finalTime`** stands for the maximum number of machine cycles that a machine should be allowed to run during the requested computation.
If this maximum is reached and the computation is not yet finished, the machine is forcibly halted and the contents of the `output` drive at that moment are considered the valid result of the computation. Notice that this behavior is currently [under review](https://github.com/cartesi-corp/compute/issues/39).

**`_templateHash`** is the Merkle-tree root hash that represents the full content of the *template machine*.
The machine represented by this hash has all its input drives filled with zeros (pristine drives) and therefore it can be understood as a *template machine* that still needs the contents of the drives before it can be run.
The next section will describe the methods employed to fill the input drives with actual data.
Pragmatically, the `_templateHash` will be calculated by the developer during the phase of constructing the off-chain machine (target development), as explained in detail in the [Cartesi Machine command line section](../machine/host/cmdline.md#state-hashes).

**`_outputPosition`** should contain the exact position of the output drive within the Cartesi Machine's address space, so that the blockchain code can retrieve the results. When constructing the off-chain machine, the developer has freedom to choose where the output drive will be positioned, however drives are by default placed in pre-determined positions, as described in the [Cartesi Machine section](../machine/host/cmdline.md#flash-drives). The first one, representing the root file system, is set to start at the beginning of the second half of the machine's address space (address `0x8000000000000000`), whereas subsequent drives are separated by 2<sup>60</sup> bytes, therefore being positioned at addresses `0xA000000000000000`, `0xB000000000000000`, and so forth. More on how to obtain these values can be found [here](../machine/target/architecture.md#linux-setup).

**`_outputLog2Size`** represents the log<sub>2</sub> of the output drive's size given in bytes. As such, a value of `5` would represent an output drive with a size of 32 bytes.

**`_roundDuration`** is the time (in seconds) given to each participant (claimer and challengers) to submit transactions to the blockchain.
After this period is expired, their adversary is allowed to claim a timeout, effectively canceling the computation. It is important to notice that this duration only concerns the interval until transactions are mined into the main chain, while other phases of Cartesi Compute (like actually running a computation) are given extra time, allowing participants to abide by deadlines. A few minutes is a good default for this variable.

**`_parties`** corresponds to the list of addresses representing the validator nodes that are participating in the Cartesi Compute computation.
The first entry in this list will be selected by Cartesi Compute as the *claimer* node, meaning that it will represent the party responsible for submitting the result of the computation. More specifically, the claimer node will collect the content of each drive specified in the machine, give Merkle-tree proofs to update the machine hash after the insertion of each of these drives, execute the machine, and finally submit its output to the blockchain.
Meanwhile, the remaining parties become *challenger* nodes. After seeing the output submitted by the claimer, the challengers are offered the opportunity to either endorse or challenge the result of the computation.
In case of a disagreement among the parties, the nodes representing each of them will automatically engage in a dispute resolution algorithm that allows the honest party to prove the fraud of any opponent.
In the end, the DApp is informed of the result of the dispute.

**`_noChallengeDrive`** indicates whether any of the drives specified in the machine can have their contents' data availability challenged by the challenger nodes during the computation. When `_noChallengeDrive` is set to true, it means that all drives specified in the machine are considered to have their data available at all times during the computation.

There is now only one argument left to explain in the `instantiate` call.
Namely, the `Drive[] _inputDrives` parameter, which will be detailed in the next sections.
