---
title: Introduction
---

The target perspective starts from the architectural level, and progressively
increase the level of abstraction until the familiar Linux environment finally
emerges.

The [RISC-V ISA](https://content.riscv.org/wp-content/uploads/2017/05/riscv-spec-v2.2.pdf), on which Cartesi Machines are based,
consists of a minimal 32-bit integer instruction set to
which several extensions can be added.  Orthogonally,
operand and address-space widths can be extended to 64-bits
(or even 128-bits).  Additionally, the standard defines a
[privileged architecture](https://content.riscv.org/wp-content/uploads/2017/05/riscv-privileged-v1.10.pdf) with
features commonly used by modern operating systems, such as
multiple privilege levels, paged-based virtual-memory,
timers, interrupts, exceptions and traps, etc.
Implementations are free to select the combination of
extensions that better suit their needs.

RISC-V was born of research in academia at UC Berkeley. It
is now maintained by its own independent foundation.  It is
important to keep in mind that RISC-V is not a toy
architecture. It is suitable for direct native hardware
implementation, which is indeed currently commercialized by
SiFive Inc.  This means that, in the future, Cartesi will
not be limited to emulation or binary translation off-chain.

The Cartesi Machine architecture can be separated into a
processor and a board.  The processor performs the
computations, executing the traditional fetch-execute loop
while maintaining a variety of registers.  The board defines
the surrounding environment with an assortment of memories
(ROM, RAM, flash) and a number of devices.  To make
verification possible, a Cartesi Machine maps its entire
state to the physical address space in a well-defined
way.  This includes the internal states of the processor,
the board, and of all attached devices. The contents of the
address space therefore completely define the Cartesi
Machine.  Fortunately, this modification does not limit the
operating system or the applications it hosts in any
significant way.

Both the processor and board are implemented in the
emulator.  A full description of the RISC-V ISA is out of
the scope of this documentation (See the volumes [I](https://content.riscv.org/wp-content/uploads/2017/05/riscv-spec-v2.2.pdf) and [II](https://content.riscv.org/wp-content/uploads/2017/05/riscv-privileged-v1.10.pdf) of the specification for details.)
This section describes Cartesi's RISC-V architecture, the modifications made to
support verification, the devices supported by the emulator,
and the process the machine follows to boot the Linux
kernel.
