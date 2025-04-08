---
id: vouchers
title: Vouchers

---

Vouchers serve as a mechanism for facilitating on-chain actions initiated in the execution layer.

Imagine vouchers as digital authorization tickets that grant dApps the authority to execute specific actions directly on the base layer. These vouchers encapsulate the details of the desired on-chain action, such as a token swap request or asset transfer.

A voucher explicitly specifies the action that the dApp intends to execute on the base layer.

For instance, in a DeFi application built on Cartesi, users may want to swap one token for another. The dApp generates a voucher that authorizes the on-chain smart contract to execute the swap on the user's behalf.

The [`Application`](../contracts/application.md) contract is crucial in validating and executing the received voucher on the blockchain. This execution process occurs through the [`executeOutput()`](../../contracts/application/#executeoutput) function, which handles different types of outputs including vouchers and delegate calls.

The result of the voucher execution is recorded on the base layer. This recording typically involves submitting claims by a consensus contract, ensuring the integrity and transparency of the executed on-chain action.

:::note create a voucher
[Refer to the documentation here](../../development/asset-handling.md) for asset handling and creating vouchers in your dApp.
:::

## Delegate Call Vouchers

Delegate call vouchers enable advanced smart contract interactions through the [DELEGATECALL](https://www.evm.codes/?fork=cancun#f4) opcode, allowing dApps to separate their execution logic from their storage context. For more details, see [Delegate Call Vouchers](./delegate-call-vouchers.md).

## Epoch Configuration

An epoch refers to a specific period during which a batch of updates is processed off-chain, and upon agreement by validators, the finalized state is recorded on-chain.

Epoch Length is the number of blocks that make up an epoch. It determines how long each epoch lasts in terms of block counts. For instance, if an epoch length is set to 7200 blocks, the epoch will end once 7200 blocks have been processed. This length directly influences how frequently updates are finalized and recorded on the blockchain.

One common use of vouchers in Cartesi dApps is to withdraw assets. Users initiate asset withdrawals by generating vouchers, which are then executed on the blockchain upon the closure of the corresponding epoch.

You can manually set the epoch length to facilitate quicker asset deposits and withdrawals.

:::note epoch duration
[Refer to the documentation here](../../development/cli-commands.md/#run) to manually configure epoch length during development.
:::
