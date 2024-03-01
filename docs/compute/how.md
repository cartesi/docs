---
title: How it works
tags: [maintain, sdk, off-chain, low-level developer]
---

Cartesi Compute SDK allows Cartesi dApps to specify and request verifiable computations to Cartesi Machines. Additionally, the SDK provides tools to facilitate and reduce the cost of inputting data into Cartesi Machines.

## Cartesi computations

Cartesi offers developers all the power of Linux when implementing the logic of their dApps. This statement becomes clear as the developer understands the Cartesi Machine, which is the main component of the Cartesi Compute Node.

The Cartesi Machine is similar in spirit to a virtualization solution like VirtualBox, KVM or VMWare. Inside of it, there is an operating system, hard drives, programs and data. Moreover, Cartesi Machines come with the important feature of being fully reproducible, which is an essential ingredient for consensus and dispute resolutions.

A reference documentation on this component is available [here](../machine/index.md), which includes several examples and use cases. Moreover, a tutorial on how to build a simple machine can be found [here](../tutorials/helloworld/cartesi-machine.md).

For the purpose of this section, one can think of a Cartesi Machine as a black box. A Virtual Machine with a set of input drives and a single output drive. When switched on, the machine boots a Linux operating system and passes the control to the software coded by the developer. This program is able to read the content of the input drives using traditional file operations available in any major programming language, process them and write results to the output drive.

To make this description more concrete, here are but a few examples of computations that can be performed inside a Cartesi Machine:

- Checking who won a match of chess or another complex game involving two players who wrote their moves into input drives;
- Verifying that someone has successfully solved a puzzle, a major optimization problem or some artificial intelligence task;
- Calculating the hash of a certain input using some costly algorithm, such as scrypt;
- Verifying a cryptographic signature using some algorithm not yet implemented on the blockchain;
- Running a complex query on a large database contained inside the machine specification.

## Involved Parties

Cartesi's technical specification contemplates an unbounded number of participating nodes verifying the computation, as specified by each dApp. In general terms, there are numerous possible ways in which nodes could be allocated and arranged, depending on the type of dApp and how their users interact with it. This is covered in detail in a specific [article that discusses topologies of Cartesi Compute dApps](https://medium.com/cartesi/topologies-of-descartes-dapps-439370973c4a). For the current version of the Cartesi Compute SDK, it is recommended that the number of participating nodes be restricted to at most 6. This limitation will be removed in a future release, and is related to how efficiently the current code is able to scale the resolution of individual disputes.

For every Cartesi Compute computation, one node is selected to be the _claimer_, meaning that it is in charge of posting the result of the computation to the blockchain. The remaining nodes are thus regarded as the _challengers_ of that claim. Although equally interested in the result, challenger nodes do not post a claim to the blockchain. Instead, they run the same computation off-chain, verifying the result informed by the claimer. Challengers remain silent on-chain during the challenging period, unless they disagree with the claimer's result. In that case, they start a dispute resolution process.

dApp users are not required to know if their nodes are playing the role of a claimer or challenger. These roles are managed automatically by the Cartesi Compute Node logic, as explained in the next sections.
