---
title: Introduction
---

The Cartesi Machine is a self-contained and deterministic computational model that can host modern operating systems. 
Real-world computations happen inside operating systems for good reasons. 
Developers are trained to use toolchains that operate at the highest possible abstraction level for any given job. 
These toolchains isolate them from irrelevant hardware details and even from the particulars of a given operating system. 

Inventing an ad-hoc new architecture would then require the porting of a toolchain and operating system. 
Instead, Cartesi Machines are based on a proven architecture for which a standard toolchain and operating system are already available.

On the other hand, off-chain computations performed by Cartesi Machines must be verifiable by a blockchain. 
The blockchain must therefore host a reference implementation of the entire architecture. 
If it is ever to be trusted, this implementation must be easily auditable. 
To that end, both the architecture and the implementation must be open and relatively simple. 

Together, these requirements point to RISC-V.

### RISC-V

The RISC-V ISA is based on a minimal 32-bit integer instruction set to which several extensions can be added [Waterman and Asanovic ́ 2017a]. 
Orthogonally, operand and address-space widths can be extended to 64-bits (or even 128-bits). 
Additionally, the standard defines a privileged architecture [Water- man and Asanovic ́ 2017b] with features commonly used by modern operating systems, such as multiple privilege levels, paged-based virtual-memory, timers, interrupts, exceptions and traps, etc. Implementations are free to select the combination of extensions that better suit their needs.
RISC-V was born of research in academia at UC Berkeley. It is now maintained by its own independent foundation. 

Larger corporations, including Google, Samsung, and Tesla, have recently joined forces with the project [Tilley 2018]. 
The platform is supported by a vibrant community of developers. 
Their efforts have produced an extensive software infrastructure, most notably ports of the Linux operating system and the GNU toolchain [RISC-V 2018d]. 
It is important to keep in mind that RISC-V is not a toy architecture. It is suitable for direct native hardware implementation, which is indeed currently commercialized by SiFive Inc. 
This means that, in the future, Cartesi will not be limited to emulation or binary translation off-chain.

### Architecture

The Cartesi Machine can be separated into a processor and a board. 
The processor performs the computations, executing the traditional fetch-execute loop while maintaining a variety of registers. 
The board defines the surrounding environment with an assortment of memories (ROM, RAM, flash) and devices. 
To make verification possible, Cartesi Machines map their entire state to physical memory in a well-defined way. 
This includes the internal states of the processor, the board, and of all attached devices. 
Fortunately, this modification does not limit the operating system or the applications it hosts in any significant way.

> TODO: Diagram would be nice here
