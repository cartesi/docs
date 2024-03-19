---
id: overview
title: Overview
tags: [assets, portals, vouchers]
resources:
   - url: https://www.udemy.com/course/the-cartesi-dapp-developer-masterclass
     title: The Cartesi dApp Developer Free Course
   - url: https://github.com/jjhbk/cartesi-wallet
     title: "Cartesi-Wallet: TypeScript based Wallet implementation for Cartesi dApps"
   - url: https://github.com/jjhbk/cartesi-router
     title: "Cartesi-Router: TypeScript based Router implementation for Cartesi dApps"
   - url: https://github.com/Mugen-Builders/frontend-cartesi-wallet-x
     title: "Frontend-Cartesi-Wallet: A React frontend to showcase wallet functionality of Cartesi dApps" 
---

Assets exist on the base layer, where they have actual meaning and value.

As with any execution layer solution, a Cartesi dApp that wants to manipulate assets needs a secure way of "teleporting" the assets from the base layer to the execution layer and then a way to "teleport" them back to the base layer.

Currently, Cartesi Rollups support the following types of assets:

- [Ether (ETH)](../../api/json-rpc/portals/EtherPortal.md)
- [ERC-20](../../api/json-rpc/portals/ERC20Portal.md)
- [ERC-721](../../api/json-rpc/portals/ERC721Portal.md)
- [ERC-1155 Single](../../api/json-rpc/portals/ERC1155SinglePortal.md)
- [ERC-1155 Batch](../../api/json-rpc/portals/ERC1155BatchPortal.md)


![img](../../../static/img/v1.3/assets.jpg)


The Portal contracts, part of the on-chain components, are responsible for teleporting assets from the base layer blockchain to a Cartesi dApp. You can think of a Portal as a bank account owned by the off-chain machine.

Once deposited, those L1 assets gain a representation in the execution layer and are owned by whomever the depositor assigned them to.

When an asset is deposited, the corresponding Portal contract sends an input via the InputBox contract, describing the type of asset, amount, receivers, and some data the depositor might want the dApp to read. This allows deposits and instructions to be sent as a single base layer interaction.

Anyone can deposit assets there, but only the dApp — through the [`CartesiDApp`](../../api/json-rpc/application.md) contract — can decide on withdrawals. An input is sent requesting a withdrawal, which gets processed and interpreted off-chain. If everything is correct, the machine creates a voucher destined to the appropriate Portal contract, ordering and finalizing that withdrawal request.

Before you make a withdrawal request to your dApp, the first thing you should do is call a function in the [`DAppAddressRelay`](../../api/json-rpc/relays/relays.md) contract that allows you to inform the off-chain machine of the dApp contract’s address in a trustless and permissionless way. This relay call adds the dApp address as input via a custom frontend, sunodo, or Cast. 

By relaying the address of your dApp, voucher creation and withdrawal requests will succeed.
It is important to note that creating vouchers(making withdrawal requests) does not conclude the asset transfer. 

These vouchers must be executed using the [`executeVoucher()`](../../api/json-rpc/application.md/#executevoucher) function from the CartesiDApp contract.





