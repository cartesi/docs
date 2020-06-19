---
title: Execution Timeline
---

At this point, an overview has been given of what constitutes a Cartesi computation, who the parties involved are and what the software components of Descartes are. It is also important to understand what events happen during the execution of a Cartesi machine.

For a Cartesi computation to start, the DApps’ smart contract has to perform a call to the `instantiate` function of the Decartes’ smart contract. Although the exact API definition of this call will be detailed later, it is relevant to have a general understanding of the purpose of this call at this point.

The `instantiate` call requests the Descartes infrastructure to perform an off-chain computation. In plain English, what the DApp is doing is asking Descartes to:
- run an off-chain computation,
- submit the results,
- raise and manage disputes in case of disagreements.


To specify a machine, the DApp needs to provide an arbitrary number of input drives. It also needs to specify a maximum number of microprocessor cycles, from which the machine would halt. If the maximum number of cycles is not exceeded, the machine runs the computation until its completion.

![Descartes Timeline](/img/descartes-timeline.png)

(What happens, in sequence)
TBD….
The claimer's result is accepted as final unless a challenger disputes the result and plays the verification game until the claimer's incorrectness is proven to the blockchain. 

API / interface Cartesi node diagram
High-level sequence diagram explaining the interaction between the client, the SC, and Descartes. 


:::note Discuss the current limitations and plans to generalize Descartes. 
NxN
Eliminate Drive.provider from DescartesInterface.sol
Off-chain Endpoint to initialize Descartes (not only from SC)
Financial settlement
Collaterals
Generic computation output (restricted to integer now)
Make the Cartesi Node DApp-agnostic (drive containing the main program must come from the outside, e.g. IPFS)
:::
