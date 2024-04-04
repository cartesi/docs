---
id: vouchers
title: Vouchers
tags: [output, vouchers]
---

Vouchers serve as a mechanism for facilitating on-chain actions initiated in the execution layer.

Imagine vouchers as digital authorization tickets, granting dApps the authority to execute specific actions directly on the base layer. This voucher encapsulates the details of the desired on-chain action, such as a token swap request or asset transfer.

The voucher explicitly specifies the action that the dApp intends to execute on the base layer.

For instance, in a DeFi application built on Cartesi, users may want to swap one token for another. The dApp generates a voucher that authorizes the on-chain smart contract to execute the swap on the user's behalf.

The [`CartesiDApp`](../json-rpc/application.md) contract is crucial in validating and executing the received voucher on the blockchain. This execution process occurs through the [`executeVoucher()`](../json-rpc/application.md/#executevoucher) function, ensuring that the action specified in the voucher is legitimate and authorized.

The result of the voucher execution is recorded on the base layer. This recording typically involves submitting claims by a consensus contract, ensuring the integrity and transparency of the executed on-chain action.

:::note create a voucher
[Refer to the documentation here](../../../development/assets-handling/overview.md) for asset handling and creating vouchers in your dApp.
:::

## Epoch configuration

Epoch configuration is crucial when working with vouchers.

Vouchers allow dApps in the execution layer to interact with contracts on the base layer through message calls. A voucher can only be executed once the corresponding epoch is closed. By default, Cartesi nodes close one epoch every couple of days.

One everyday use of vouchers in Cartesi dApps is to withdraw assets. Users initiate asset withdrawals by generating vouchers, which are then executed on the blockchain upon the closure of the corresponding epoch.

During the development and testing phases, where rapid asset deposits and withdrawals are required, the default epoch duration may not be practical. In such cases, you can manually set the epoch duration to facilitate quicker asset deposits and withdrawals.

:::note epoch duration
[Refer to the documentation here](../../../development/node-configuration.md/#epoch-duration) to manually configure epoch duration during development.
:::
