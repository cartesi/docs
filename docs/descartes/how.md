---
title: How it works
---

Descartes SDK allows Cartesi DApps to specify and request verifiable computations to Cartesi Machines. Additionally, the SDK also provides tools to facilitate and reduce the cost of inputing data into Cartesi Machines.

## Cartesi computations

Cartesi offers developers all the power of Linux when implementing the logic of their DApps. This statement becomes clear as the developer understands the Cartesi Machine, which is the main component of the Descartes Node.

The Cartesi Machine is similar in spirit to a virtualization solution like VirtualBox, KVM or VMWare. Inside of it, there is an operating system, hard drives, programs and data. Moreover, Cartesi machines come with the important feature of being fully reproducible, which is an essential ingredient for consensus and dispute resolutions.

A reference documentation on this component is available [here](../../machine/intro/), which includes several examples and use cases. Moreover, a tutorial on how to build a simple machine can be found [here](../../tutorials/helloworld/cartesi-machine/).

For the purpose of this section, one can think of a Cartesi Machine as a black box. A Virtual Machine with a set of input drives and a single output drive. When switched on, the machine boots a Linux operating system and passes the control to the software coded by the developer. This program is able to read the content of the input drives using traditional file operations available in any major programming language, process them and write results to the output drive.

To make this description more concrete, here are but a few examples of computations that can be performed inside a Cartesi Machine:
- Checking who won a match of chess or another complex game involving two players who wrote their moves into input drives;
- Verify that someone has successfully solved a puzzle, a major optimization problem or some artificial intelligence task;
- Calculate the hash of a certain input using some costly algorithm, such as scrypt;
- Verify a cryptographic signature using some algorithm not yet implemented on the blockchain;
- Run a complex query on a large database contained inside the machine specification.

## Involved Parties

Cartesi's technical specification contemplates an unbounded number of participating nodes verifying the computation as specified by the DApp. However, as the number of participants grows, there are trade-offs to be considered, which will be addressed in detail in a future article.

The Cartesi team is currently implementing safe ways to allow for an arbitrary number of participants for Descartes SDK. This is an important feature with high priority on the development pipeline. Until then, the SDK is restricted to two participating nodes, who will assume the roles of claimer and challenger.

The claimer is the Descartes Node in charge of posting the result of the computation to the blockchain. Although challengers are equally interested in the result, they do not post a claim to the blockchain. Instead, they run the same computation off-chain, verifying the result informed by the claimer. Challengers remain silent on-chain during the challenging period, unless they disagree with the claimer's result. In that case, they start a dispute resolution process.

DApp users are not required to know if their nodes are playing the role of a claimer or challenger. These roles are managed automatically by the Descartes Node logic as explained below.
