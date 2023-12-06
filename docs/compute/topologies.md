---
title: Topologies
tags: [maintain, sdk, topologies, low-level developer]
---

When users interact with their blockchain dApps, they are free to manage and run their own blockchain nodes if so they wish. In a common scenario of the usage of the Ethereum network, dApps are accessed via browser and blockchain transaction requests are carried out by Metamask. The user signs the transaction which is typically sent to a remotely hosted node, such as Infura.

Alternatively, users can manage and run their own Ethereum node if they want. Installing and maintaining a blockchain node, however, is not something most users do. This can be for lack of motivation, technical expertise, or infrastructure.

With Cartesi dApps, users can always run their own Cartesi Compute Node if they want to. In that way, they fully represent themselves and defend their own interests throughout possible dispute resolutions. However, we expect that Nodes will be instead typically run by service providers trusted by users and who can guarantee non-stop connectivity and reliability of their services. Just as in the case of running a blockchain node, running a Cartesi Compute Node may not be convenient enough for the regular user. Besides, users normally prime for simplicity of usability of the dApp above anything.

There are, in fact, different ways a user can relate to a Node. Here are some examples:

1. The user runs their own Node on their own desktop or server;
2. The user runs their own Node remotely, on a trusted cloud service;
3. A group of users create a federation to share node infrastructure on the cloud;
4. The user consumes a trusted Cartesi Compute Node provider;
5. The user wants redundancy and combines multiple items above;
