---
id: community-tools
title: Community tools
---

<!-- Reviewed for Cartesi Rollups v2.0 documentation. -->

Community projects that help build Cartesi Rollups applications. These are maintained outside the core Cartesi repositories. Confirm compatibility with Rollups v2 (JSON-RPC node API, unified outputs) before adopting them.

## Deroll

TypeScript framework for Cartesi dApps.

- Advance and inspect handlers
- Wallet helpers for ERC-20, ERC-721, and ERC-1155
- Router for application methods

```bash
npm init @deroll/app
```

- [Documentation](https://deroll.dev)
- [GitHub](https://github.com/tuler/deroll)

---

## libcma (Cartesi Machine Assets)

C++ library for parsing portal deposits and managing an in-machine asset ledger (Ether, ERC-20, ERC-721, ERC-1155). It is the basis for proveable balances and contracts v3 emergency withdrawal.

- Core: [Mugen-Builders/machine-asset-tools](https://github.com/Mugen-Builders/machine-asset-tools)
- Rust bindings: [Mugen-Builders/cma-rust-parser](https://github.com/Mugen-Builders/cma-rust-parser)
- Node.js / TypeScript bindings: [riseandshaheen/libcma-binding-node](https://github.com/riseandshaheen/libcma-binding-node)

Related: [libcmt bindings](https://github.com/Mugen-Builders/libcmt-bindings) expose the guest `libcmt` C API (rollup I/O, ABI, Merkle) without the HTTP rollup server.

---

## Python-Cartesi

Python framework with local testing helpers and control over inputs and outputs.

```bash
pip install python-cartesi
```

- [GitHub](https://github.com/prototyp3-dev/python-cartesi)

---

## Cartesapp

Opinionated Python library and CLI for Cartesi Rollups apps: routed endpoints, host and machine tests, build/run/deploy, and auto-generated frontend libraries.

```bash
pip3 install cartesapp[dev]@git+https://github.com/prototyp3-dev/cartesapp@main
cartesapp create NAME
```

- [GitHub](https://github.com/prototyp3-dev/cartesapp)
