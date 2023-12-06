---
title: Execution timeline
tags: [maintain, sdk, low-level developer]
---

At this point, an overview has been given of what constitutes a Cartesi computation, who are the parties involved, and what the software components of Cartesi Compute are. It is important to understand better what events happen during the execution of a Cartesi Machine.

The event that marks the beginning of a Cartesi computation is an on-chain request by the dApp Smart Contract to Cartesi Compute.
This is done through a call to the `instantiate` function of the CartesiCompute’ smart contract.

Although the exact API definition of this call will be detailed later, it is relevant to have a general understanding of the purpose of this call at this point.

## Instantiate

The `instantiate` call requests the Cartesi Compute infrastructure to perform an off-chain computation.

This function call includes all the necessary data to specify the computation, as well as the interested parties.
The details of the `instantiate` parameters and usage are specified in the [Instantiate section](../compute/instantiate.md).

For now, it is sufficient to understand in broad terms the parameters specified in the `instantiate` call:

- Who are the parties involved in the requested computation (claimer and challenger);
- A hash describing the contents of the machine to be executed;
- What are the maximum number of processor cycles necessary to complete this program;
- How many drives this machine receives as input;
- How the contents of each drive should be inserted;
- The time limit given to the Cartesi Compute Nodes to submit transactions before the other parties involved can claim a timeout.

## Provided drives

As explained in detail in the [Provider section](../compute/provider.md), some machines will require one or more users to fill in the contents of the input drives.
If this is the case, there will be a time interval between the instantiation of a Cartesi Machine and its execution.
This time is given exactly for the involved parties to submit such required data.
The [Provider section](../compute/provider.md) also explains how (and in which format) such data is sent by the users to their Cartesi Compute Nodes for further processing.

## Machine execution

If a machine does not require _Provided drives_, or after all of them are properly received, the computation can start.

This is done automatically by the Cartesi Compute Node running on behalf of the users.
After the execution, the node representing the claimer will submit the result of the computation to the blockchain and the challenger will verify the claim for correctness.

After the verification, the challenger nodes will automatically accept the result of the computation (notifying the dApp of the final result), or raise a dispute, which is briefly described in the next subsection.

## Disputes

In the rare case that a dispute arises concerning the result of a Cartesi computation, an interactive resolution system is launched for settlement.

All these steps are done automatically by the Cartesi Compute Nodes so that they can reach a final result in a timely manner.

The end of such disputes is notified to the dApp developer to enforce appropriate penalties to misbehaving parties.

![Cartesi Compute Timeline](/img/compute-state-diagram.png)

API / interface Cartesi node diagram
High-level sequence diagram explaining the interaction between the client, the SC, and Cartesi Compute.
