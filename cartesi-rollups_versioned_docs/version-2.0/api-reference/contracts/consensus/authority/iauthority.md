---
id: iauthority
title: IAuthority
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/consensus/authority/IAuthority.sol
    title: IAuthority Interface
---

The `IAuthority` interface defines a consensus contract controlled by a single address, the owner.

## Description

A consensus contract controlled by a single address, the owner. This interface combines the consensus functionality of [`IConsensus`](../iconsensus.md) with ownership management (`IOwnable`). In the [`Authority`](./authority.md) implementation, only the owner can submit claims, while anyone can accept a staged claim after the claim staging period.

## Related Contracts

- [`Authority`](./authority.md): Implementation of this interface
- [`IConsensus`](../iconsensus.md): Base consensus interface
- [`IOwnable`](https://github.com/cartesi/rollups-contracts/tree/v3.0.0-alpha.10/src/access/IOwnable.sol): Ownership management interface
