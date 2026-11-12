---
id: community-tools
title: Community tools
---

Community projects that help build Cartesi Rollups applications. These are maintained outside the core Cartesi repositories. Confirm compatibility with Rollups v2 (JSON-RPC node API, unified outputs) before adopting them. The links below point to the versions that were current when this page was written.

## Deroll

TypeScript framework for Cartesi dApps.

- Advance and inspect handlers
- Wallet helpers for ERC-20, ERC-721, and ERC-1155
- Router for application methods

```bash
npm init @deroll/app
```

- [Documentation](https://deroll.dev)
- [GitHub](https://github.com/tuler/deroll/tree/c7b10f7ef42d8968174deb89936b9679ceb71051)

---

## libcma (Cartesi Machine Assets)

C++ library for parsing portal deposits and managing an in-machine asset ledger (Ether, ERC-20, ERC-721, ERC-1155). It is the basis for provable balances and [emergency withdrawal](../development/emergency-withdrawal/overview.md).

- Core: [Mugen-Builders/machine-asset-tools `v0.1.0-alpha.11`](https://github.com/Mugen-Builders/machine-asset-tools/tree/v0.1.0-alpha.11)
- Rust bindings: [Mugen-Builders/cma-rust-parser](https://github.com/Mugen-Builders/cma-rust-parser/tree/32dffc8bc0c63e60d78dc663e1fd921d6aec43c8)
- Python bindings: [Mugen-Builders/libcma-binding-python](https://github.com/Mugen-Builders/libcma-binding-python/tree/c3dc999fa859c3646a4e3a7d34f806809abbea2b)
- Node.js / TypeScript bindings: [riseandshaheen/libcma-binding-node](https://github.com/riseandshaheen/libcma-binding-node/tree/7e9a7a5437f9db4849203e646f7ad580a09be90e)

Related: [libcmt bindings](https://github.com/Mugen-Builders/libcmt-bindings/tree/463c62ca6adfcff84a24034d86abfbf324aea6d7) expose the guest `libcmt` C API (rollup I/O, ABI, Merkle) without the HTTP rollup server.

---

## Python-Cartesi

Python framework with local testing helpers and control over inputs and outputs. Install it with one of the following, depending on the extras you need (`machine` and `machine-asset`). `--find-links` supplies pre-built RISC-V wheels.

```bash
pip3 install cartesi@git+https://github.com/prototyp3-dev/python-cartesi@v0.2.1 --find-links https://prototyp3-dev.github.io/pip-wheels-riscv/wheels/
```

```bash
pip3 install cartesi[machine]@git+https://github.com/prototyp3-dev/python-cartesi@v0.2.1 --find-links https://prototyp3-dev.github.io/pip-wheels-riscv/wheels/
```

```bash
pip3 install cartesi[machine-asset]@git+https://github.com/prototyp3-dev/python-cartesi@v0.2.1 --find-links https://prototyp3-dev.github.io/pip-wheels-riscv/wheels/
```

- [GitHub](https://github.com/prototyp3-dev/python-cartesi/tree/v0.2.1)

---

## Cartesapp

Opinionated Python library and CLI for Cartesi Rollups apps: routed endpoints, host and machine tests, build/run/deploy, and auto-generated frontend libraries.

```bash
pip3 install cartesapp[dev]@git+https://github.com/prototyp3-dev/cartesapp@v1.5.0a0
cartesapp create NAME
```

- [GitHub](https://github.com/prototyp3-dev/cartesapp/tree/v1.5.0a0)
