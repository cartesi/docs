---
id: mainnet-considerations
title: Mainnet considerations
resources:
    - url: https://honeypot.cartesi.io/
      title: Honeypot dApp
---

Cartesi Rollups are app-specific execution environments that can be deployed as L2, L3, or sovereign rollups. It's not your typical L1 blockchain, so the idea of a "Mainnet launch" is slightly different. What goes to mainnet are the dApps built using Cartesi! And with the launch of the Honeypot dApp, Cartesi Rollups is officially ready for mainnet!

## About Mainnet 

Now that Cartesi has reached a Mainnet Ready stage, developers can build dApps with Cartesi Rollups and deploy on Ethereum, Optimism, and Arbitrum Mainnets!

How an application's results are validated depends on the consensus it is deployed with. As of November 2026 (rollups-node v2.0.0-alpha.14, rollups-contracts v3.0.0-alpha.10 and PRT contracts v3.0.0-alpha.6, all alpha releases):

- **Authority and Quorum** have no dispute game. An Authority's single owner, or a majority of a Quorum's fixed set of validators, decides which claims are accepted. This is the consensus that the [self-hosted deployment guides](../deployment/self-hosted/overview.md) deploy.
- **PRT (Dave)** settles each epoch through a permissionless dispute tournament. The reference node can deploy PRT applications (`cartesi-rollups-cli deploy application --prt`). The PRT contracts support only Ethereum Mainnet and Sepolia; their deployments on other networks are experimental.

:::caution Arbitrum
The reference node (rollups-node v2.0.0-alpha.14) does not support Authority or Quorum applications on Arbitrum: inside Arbitrum contracts, `block.number` is a parent-chain (Ethereum) block number, while the node counts epochs in Arbitrum block numbers, so the node's claims are rejected and no epoch is ever accepted. See [Supported networks](../deployment/introduction.md#supported-networks).
:::

## Undiscovered Bugs

The codebase may contain some undiscovered vulnerabilities that might put user funds at risk.

Developers and users should factor this risk into their decision to use Cartesi Rollups and decide how much of their value to entrust to the system.

## Security


The Cartesi Rollups infrastructure is being built based on careful design decisions and a robust code review process that aligns with the mainstream dogma of blockchain technology.

When it comes to dApp safety, developers must also implement the same level of concern in their process. A culture of code reviews, auditing, and extensively testing their code is paramount to avoid hacks or bugs that could lead to user funds being lost.

**The Honeypot** is a dApp designed to demonstrate Cartesi Rollups’ security capabilities.

As the Honeypot is tested and fortified, users and developers will have increased confidence in the security of Cartesi Rollups. Want to help test the security of Cartesi Rollups? [Try your hand at cracking the Honeypot](https://honeypot.cartesi.io/).


## Scams
Like Ethereum, Cartesi Rollups are permissionless—anybody can deploy any smart contract code. You can interact with contracts on Cartesi Rollups precisely as you do with Ethereum, but only if you’ve independently verified that the application is secure.


