---
title: Execution Timeline
---

At this point, an overview has been given of what constitutes a Cartesi computation, who are the parties involved and what the software components of Descartes are. It is also important to understand what events happen during the execution of a Cartesi machine.

The event that marks the beginning of a Cartesi computation is an on-chain request by the DApp Smart Contract to Descartes.
This is done through a call to the `instantiate` function of the Decartes’ smart contract.

Although the exact API definition of this call will be detailed later, it is relevant to have a general understanding of the purpose of this call at this point.

Instantiate
-----------

The `instantiate` call requests the Descartes infrastructure to perform an off-chain computation.

This function call includes all the necessary data to specify the computation, as well as the interested parties.
The details of the `instantiate` parameters and usage are specified in the [Instantiate Section](./instantiate.md).

For now, it is sufficient to understand in broad terms what are the details specified in the `instantiate` call:
- who are the parties involved in the requested computation (Claimer and Challenger);
- a hash describing the contents of the machine to be executed;
- what are the maximum number of processor cycles necessary to complete this program;
- how many drives this machine receives as input;
- how the contents of each drive should be inserted
- the time given to the Cartesi Nodes to submit transactions before the other parties involved can claim a timeout.

Provided drives
---------------

As explained in detail in Section [Provider](provider.md), some machines will require one or more users to fill the contents of the input drives.
If this is the case, there will be a time interval between the instantiation of a Cartesi Machine and its execution.
This time is given exactly for the involved parties to submit such required data.
Section [Provider](provider.md) also explains how (and in which format) such data is sent by the users to their Cartesi Nodes for further processing.

Machine execution
-----------------

If a machine does not require *Provided drives*, or after all of them are properly received, the computation can start.

This is done automatically by the Cartesi Node running on behalf of the users.
After the execution, the node representing the Claimer will submit the result of the computation to the blockchain and the Challenger will verify the claim for correctness.

At this point the Challenger's node will automatically accept the result of the computation (notifying the DApp of the final result), or raise a dispute, which is briefly described in the next subsection.

Disputes
--------

In the rare case that a dispute arises concerning the result of a Cartesi computation an interactive resolution system is launched for settlement.

All these steps are done automatically by the Cartesi Nodes and they can reach a final result in a timely manner.

The end of such disputes is notified to the DApp developer to enforce appropriate penalties to misbehaving parties.

![Descartes Timeline](/img/descartes-timeline.png)


API / interface Cartesi node diagram
High-level sequence diagram explaining the interaction between the client, the SC, and Descartes.


:::note Discuss the current limitations and plans to generalize Descartes.
- NxN
- Eliminate Drive.provider from DescartesInterface.sol
- Off-chain Endpoint to initialize Descartes (not only from SC)
- Financial settlement
- Collaterals
- Generic computation output (restricted to integer now)
- Make the Cartesi Node DApp-agnostic (drive containing the main program must come from the outside, e.g. IPFS)
:::
