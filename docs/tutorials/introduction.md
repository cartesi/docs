---
title: Introduction
tags: [sdk, tutorials, low-level developer]
---

:::note Section Goal
- give step by step instructions about how to build a dApp using the Cartesi Compute SDK
:::


*The Cartesi Compute Tutorials* are a knowledge base that exists to help you learn everything about the Cartesi Compute SDK from the ground up, through easy step-by-step instructions. The tutorials focus on using the SDK to build dApps that perform secure and validated off-chain computations using two local Cartesi Compute nodes. The nodes represent users `alice` and `bob`, who respectively play the roles of claimer and challenger.

All of the tutorials and their suggested steps have been applied, in the order suggested by the navigation bar on the left, to a fresh [Ubuntu 20.04.2 LTS](http://releases.ubuntu.com/20.04/) installation. As such, if you follow the tutorials in the suggested order and correctly reproduce all of the steps in your local development environment, then every step should work, unchanged. However, if you're not running an Ubuntu LTS, or if you're not starting a development environment from scratch, you may need to do a bit of adaptation or maintenance to get the Cartesi Compute development environment working with what you have in your development machine.

In the following sections, we will first go through [general requirements](../tutorials/requirements.md) needed to run the tutorials. Then, we will get a full [Cartesi Compute SDK Environment](../tutorials/compute-env.md) up and running before we dive into our [Hello World dApp tutorial](../tutorials/helloworld/create-project.md). This initial tutorial will detail the basic process of creating a Cartesi Compute dApp, including how to build a Cartesi Machine and write a smart contract that instantiates its computation.

After that first tutorial, the [Calculator dApp](../tutorials/calculator/create-project.md) will introduce the usage of *input drives* so as to parameterize computations. Then, we'll implement a [Generic Script dApp](../tutorials/generic-script/create-project.md) in which we will learn how to customize the Cartesi Machine's *root file-system* to understand how a smart contract can run *any* kind of script with Cartesi Compute, including Python scripts using arbitrary libraries. Next, we'll shift our focus to some actual real-world use cases. In the [GPG Verify tutorial](../tutorials/generic-script/create-project.md), we'll introduce *custom ext2 file-systems* and use the standard Linux `GnuPG` tool to verify that a given document was signed by the expected party, as well as ensuring that it has not been tampered. Finally, we'll implement a [Dogecoin Hash dApp](../tutorials/dogecoin-hash/create-project.md), in which we'll see how Cartesi Compute can be used so that smart contracts can compute the actual `scrypt` proof-of-work hashing algorithm used to validate Dogecoin (and Litecoin) block headers.
