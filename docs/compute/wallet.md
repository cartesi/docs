---
title: Wallets
tags: [maintain, sdk, wallets, low-level developer]
---

Cartesi is a second layer solution.
In particular, this means that it needs to send transactions on the main Ethereum chain in order to enforce particular results on the first layer.

This is done through a wallet contained inside the Cartesi Compute Node.
It is very important that this wallet be different from the user's main wallet in order to protect their funds in case of a compromise in the machine where the Cartesi Compute Node is installed.

When installing a Cartesi Compute Node, the user will be prompted to create a wallet for their node and to properly fund it. During this installation procedure, the user will also be requested to authorize the node to defend them in case of disputes.

The dApp developer is not required to get involved in this procedure.
Moreover, the dApp does not need to know the address of the user's Cartesi Compute Node in order to write the application logic.
