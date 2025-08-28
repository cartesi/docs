---
id: iauthority
title: IAuthority
resources:
  - url: https://github.com/cartesi/rollups-contracts/tree/v2.0.1/src/consensus/authority/IAuthority.sol
    title: IAuthority Interface
---

The **IAuthority** interface defines a consensus contract controlled by a single address, the owner.

## Description

A consensus contract controlled by a single address, the owner. This interface combines the consensus functionality with ownership management, allowing only the owner to submit claims.

## Related Contracts

- [`Authority`](./authority.md): Implementation of this interface
- [`IConsensus`](../iconsensus.md): Base consensus interface
- [`IOwnable`](https://github.com/cartesi/rollups-contracts/tree/v2.0.1/src/access/IOwnable.sol): Ownership management interface 