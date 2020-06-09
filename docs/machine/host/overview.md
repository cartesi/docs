---
title: Overview
---

Cartesi's reference off-chain implementation of Cartesi Machines is based on software emulation.
The emulator is written in C/C++ with POSIX dependencies restricted to the terminal, process, and memory-mapping facilities.
It is written as a C++ library, but can be accessed in a variety of different ways.

When linked to a C++ application, the emulator can be controlled directly via the interface of the `cartesi::machine` class.
The emulator can also be accessed from the Lua programming language, via a `cartesi` module that exposes a `cartesi.machine` interface to Lua programs, mirroring the C++ interface.
Additionally, Cartesi provides a gRPC server that can be run to control a Cartesi Machine instance remotely.
This server exposes a higher-level interface better suited for the verification process, including the ability to create in-memory snapshots of the current machine state so that later modifications can be rolled back.
Finally, there is a command-line utility (written in Lua) that can configure and run Cartesi Machines for rapid prototyping.
The [emulator repository](machine/emulator.md) in the Emulator SDK can be used to build and install the Cartesi Machine emulator.
The emulator can then be used via any of these methods.

The documentation starts from the command-line utility, `cartesi-machine`.
This utility is used for most prototyping tasks.
The documentation then covers the Lua interface of `cartesi.machine`.
The C++ interface is very similar, and is covered only within its reference manual.
Finally, the documentation covers the peculiarities of the gRPC interface.

## What's in a machine

Cartesi Machines are separated into a processor and a board.
The processor performs the computations, executing the traditional fetch-execute loop while maintaining a variety of registers.
The board defines the surrounding environment with an assortment of memories (ROM, RAM, flash drives) and a number of devices.
Memories and devices are mapped to the 64-bit physical address space of the Cartesi Machine.
The amount of RAM, as well as the number, length, and position of the flash drives in the address space can be chosen according to the needs of each particular application.

In a typical scenario, a Cartesi Machine is initialized and then run until it halts.
At a minimum, the initialization process loads a ROM image, a RAM image, and a root file-system (as a flash drive) from regular files in the host file-system.
Execution starts from the [ROM image](machine/ROM.md), which contains a simple program that creates a description of the machine organization for the Linux kernel.
The Linux kernel itself resides in the [RAM image](machine/kernel.md).
After it is done with its own initialization, the Linux kernel cedes control to the `/sbin/init` program in the root file-system.
The [root file-system](machine/rootfs.md) contains all the data files and programs that make up an embedded Linux distribution.
The DApp components can reside in the root file-system itself, or in their own, separate file-system.
Additional flash drives can be used as the DApp input and output, either containing file-systems or containing raw data.
The `/sbin/init` script can be used to execute whatever computation the DApp wishes to perform inside the Cartesi Machine.
For a complete description of the Cartesi Machine architecture and the boot process, see the documentation for [the target perspective](#the-target-perspective).

## Machine playground

The setup of a new development environment is often a time-consuming task.
This is particularly true in case of cross-development environments (i.e., when the development happens in a host platform but software runs in a different target platform).
To enable immediate experimentation with Cartesi Machines, the documentation includes its own Docker image, the `cartesi/playground`.
This comes with a pre-built emulator and Lua interpreter accessible within the command-line, as well as a pre-built ROM image, RAM image, and root file-system.
It also comes with the cross-compiler for the RISC-V architecture on which the Cartesi Machine is based.

To enter the playground, open a terminal, clone the documentation repository, build the playground image, and start a container based on it
```bash
$ git clone https://github.com/cartesi/docs
$ cd docs
$ make build-playground
$ make run-playground
playground:~$ ls -al /opt/cartesi/bin/cartesi-machine
-rwxr-xr-x 1 root root      130 Apr 27 20:27 /opt/cartesi/bin/cartesi-machine
playground:~$ ls -al /opt/cartesi/share/images/*.*
-rw-r--r-- 1 root root  6811648 Jun  2 23:32 /opt/cartesi/share/images/linux.bin
-rw-r--r-- 1 root root    16413 Jun  2 23:32 /opt/cartesi/share/images/rom.bin
-rw-r--r-- 1 root root 62914560 Jun  4 14:19 /opt/cartesi/share/images/rootfs.ext2
```
