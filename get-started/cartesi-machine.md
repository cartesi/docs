---
id: cartesi-machine
title: Execution Environment
resources:
  - url: https://github.com/cartesi/machine-emulator
    title: Cartesi Machine Github
  - url: https://www.youtube.com/watch?v=uUzn_vdWyDM
    title: Cartesi Machine Deep Dive Video
---

Execution environments in blockchain systems are where smart contracts and decentralized applications (dApps) run and process transactions. They provide the necessary infrastructure and rules to execute code and manage the state of the blockchain. *Ethereum Virtual Machine(EVM)* is a popular example running at the core of Ethereum.

## Introduction to the Cartesi Machine
The Cartesi Machine serves as the execution environment for Cartesi Rollups protocol. This virtual machine enables off-chain computations for blockchain applications. Built upon *RISC-V* - an instruction set for processors - the Cartesi Machine can run a full Linux OS, within which a decentralized application's backend is executed.

Cartesi Machines are executed inside a special emulator that has three unique properties:
- **Self-contained** - They run in isolation from any external influence on the computation;
- **Reproducible** - Two parties performing the same computation always obtain exactly the same results;
- **Transparent** - They expose their entire state for external inspection.

### Significance of RISC-V
The Cartesi Machine is built on [RISC-V](https://riscv.org/) instruction set - a real-world, open standard instruction set architecture (ISA) that offers access to a vast and growing ecosystem of hardware and software. This strategic choice brings substantial benefits to developers building decentralized applications.

RISC-V enables full access to standard libraries, offering powerful abstractions, data structures, algorithms, and crucial interfaces for interacting with file systems, memory, and processes. RISC-V makes it possible to boot full operating systems like Linux, transforming the Cartesi Machine into a hosted environment. This is critical because standard libraries rely on operating system support, and without an OS, the development experience is severely limited.

By enabling Linux and other OS support, the RISC-V architecture unlocks access to decades of open-source tooling. Developers can leverage compilers like GCC and Clang, debuggers such as GDB, as well as standard file systems, shell environments, and package managers. They also gain access to rich standard libraries across languages like C, C++, Rust, and Python.


### Architecture
The Cartesi Machine comprises a processor and a board. The processor handles computations via a fetch-execute loop and manages registers. The board provides the environment, including ROM, RAM, flash memory, and other devices. For verifiability, Cartesi Machines map their complete state - processor internals, board components, and attached devices - to physical memory in a structured manner.

Cartesi Machines support a 64-bit address space with memory protection. The design balances blockchain requirements with off-chain flexibility. Most instructions are basic and easy to simulate, with a small processor state for verifiability. Cartesi's implementation includes specific registers for privilege levels and operational status.

The communication between the board and the processor happens through designated memory areas. When the machine starts, it reads instructions from a special read-only memory (ROM) which also describes the hardware. A startup program in the ROM sets things up and then jumps to the main memory (RAM) to begin the actual work. There's also space for flash memory, like storage drives.

The machine's memory is organized using Physical Memory Attribute records (PMAs), which define different areas like RAM and flash, and what can be done with them (read, write, execute). These settings are mostly fixed after the machine starts, defining the limits of its storage and capabilities.

### State Transition function
A Cartesi computation progresses through a sequence of machine states, starting from an initial state and ending in a halting state, guided by a deterministic transition function, where each state, though encompassing the entire 64-bit address space, often focuses on specific memory regions, with state transitions occurring at the granularity of each executed instruction, marking a clear and auditable progression of the computation.

### Linux Runtime
The Cartesi Machine can run a full Linux operating system. This allows developers to use familiar tools and libraries for complex computations off-chain. Setting up Linux involves building the necessary components using a cross-compiling toolchain and creating a root file system. Cartesi's development frameworks(Rollups and Coprocessor) provide a convenient Docker container with a preconfigured Linux environment to abstract the infrastructure. The Linux system runs with a bootloader and interacts with the Cartesi Machine emulator. The root file system and additional data can be stored on virtual flash devices. This enables running complex applications with flexible inputs and outputs on the Cartesi Machine.
