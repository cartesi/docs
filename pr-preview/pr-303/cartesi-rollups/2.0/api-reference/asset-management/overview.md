> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: overview
title: Overview
resources:
  - url: https://github.com/Mugen-Builders/machine-asset-tools
    title: CMA core library (C and C++)
  - url: https://github.com/Mugen-Builders/libcma-binding-python
    title: Python binding (pycma)
  - url: https://github.com/Mugen-Builders/libcma_binding_rust
    title: Rust binding
  - url: https://github.com/Mugen-Builders/libcma-app-templates
    title: Application templates
---

The Cartesi Machine Assets library (CMA), assists Cartesi applications manage assets such as Ether, ERC20, ERC721 and ERC1155 tokens. It handles the two most repetitive jobs in asset management:

1. **Decoding inputs**. Deposits arrive from the [portal contracts](../contracts/overview.md) as ABI encoded bytes. Withdrawal and transfer requests from users also arrive as encoded bytes. CMA turns these raw bytes into typed values your code can read directly.

2. **Recording balances**. Once assets are deposited into your application, the application must record who owns what. CMA library offers a ready made ledger that stores accounts, assets and balances, and updates them on every deposit, transfer and withdrawal.

CMA is written in C and C++ in the [machine-asset-tools](https://github.com/Mugen-Builders/machine-asset-tools) repository, with bindings for Python and Rust. It does not depend on the Rollup HTTP server hence it communicates with the Cartesi machine through [libcmt](https://github.com/cartesi/machine-guest-tools).

## The two components

CMA is split into two parts that work together. You can use both, or only the one you need.

### Parser

The parser is the translation layer between your application and the base layer. It serializes and deserializes ABI encoded payloads, mapping thes raw bytes to values your application logic understands and operates on:

- It decodes Ether, ERC20, ERC721 and ERC1155 deposits sent through the Cartesi portals.
- It decodes withdrawal and transfer requests that users send as ABI encoded inputs.
- It decodes balance and supply queries sent as inspect requests.
- It encodes vouchers so users can move their assets back to the base layer.

See [Parsing inputs](./parsing-inputs.md) for the guide and the [Parser reference](./parser-reference.md) for every function.

### Ledger

The ledger is a small in machine database for managing assets. It stores:

- **Accounts**, identified by a wallet address or a generic ID.
- **Assets**, identified by a token address, a token address plus token ID, or a plain ID.
- **Balances**, the amount of each asset held by each account, plus the total supply of each asset.

It exposes deposit, withdraw and transfer operations, and read only balance and supply queries. Every operation either succeeds or returns a clear error code, so your application state stays consistent.

The ledger comes in two flavors. The multi asset ledger tracks many assets at once. The single asset ledger tracks one fixed asset, Ether or one ERC20, and stores balances in the standard accounts drive layout, so they can be recovered on the base layer with the default emergency withdrawal tooling. See [Managing balances](./managing-balances.md) for an advance guide.

## Language support

| Language  | Package               | Where it comes from                                                                                                                  |
| :-------- | :-------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| Python    | `pycma`               | [libcma-binding-python](https://github.com/Mugen-Builders/libcma-binding-python), prebuilt RISC-V wheels available                   |
| Rust      | `libcma_binding_rust` | [libcma_binding_rust](https://github.com/Mugen-Builders/libcma_binding_rust), added as a git dependency and also published on cargo. |
| C and C++ | `libcma`              | [machine-asset-tools](https://github.com/Mugen-Builders/machine-asset-tools), prebuilt RISC-V binaries on the releases page          |

## Where to go next

- [Getting started](./getting-started.md): install the library and run your first wallet application.
- [Parsing inputs](./parsing-inputs.md): decode deposits, user requests and inspect queries.
- [Managing balances](./managing-balances.md): record and update asset ownership with the ledger.
- [Vouchers and withdrawals](./vouchers.md): send assets back to the base layer.
- [Types and selectors](./types-and-selectors.md): every enum, struct, function selector and error code.
