---
title: Emulator
---

:::note Section Goal
- compiling code to run in the emulator
- command-line interface
- Lua interface
- gRPC interface
:::

The Cartesi Machine Emulator is the reference off-chain implementation of the Cartesi Machine Specification. It's written in C/C++ with POSIX dependencies restricted to the terminal, process, and memory-mapping facilites. It is distributed as a library and scriptable in the Lua programming language.

The emulator implements RISC-V's RV64IMASU ISA. The letters after RV specify the extension set. This selection corresponds to a 64-bit machine, Integer arithmetic with Multiplication and division, Atomic operations, as well as the optional Supervisor and User privilege levels. In addition, Cartesi Machines support the Sv48 mode of address translation and memory protection.
