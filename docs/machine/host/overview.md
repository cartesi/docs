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
The `emulator/` directory in the [Emulator SDK](https://github.com/cartesi/machine-emulator-sdk) can be used to build and install the Cartesi Machine emulator.
The emulator can then be used via any of these methods.

The documentation starts from the command-line utility, `cartesi-machine`.
This utility is used for most prototyping tasks.
The documentation then covers the Lua interface of `cartesi.machine`.
The C++ interface is very similar, and is covered only within its reference manual.
The same is true of the gRPC interface, used to control an emulator remotely.

## What's in a machine

Cartesi Machines are separated into a processor and a board.
The processor performs the computations, executing the traditional fetch-execute loop while maintaining a variety of registers.
The board defines the surrounding environment with an assortment of memories (ROM, RAM, flash drives) and a number of devices.
Memories and devices are mapped to the 64-bit physical address space of the Cartesi Machine.
The amount of RAM, as well as the number, length, and position of the flash drives in the address space can be chosen according to the needs of each particular application.

In a typical scenario, a Cartesi Machine is initialized and then run until it halts.
At a minimum, the initialization process loads a ROM image, a RAM image, and a root file-system (as a flash drive) from regular files in the host file-system.
Execution starts from the ROM image, which contains a simple program that creates a description of the machine organization for the Linux kernel.
The ROM image `rom.bin` can be built in the `rom/` directory in the Emulator SDK.
The Linux kernel itself resides in the RAM image `linux.bin`, built in the `kernel/` directory in the Emulator SDK.
After it is done with its own initialization, the Linux kernel cedes control to the `/sbin/init` program in the root file-system.
The root file-system `rootfs.ext2` contains all the data files and programs that make up an embedded Linux distribution.
It can be built in the `fs/` directory in the Emulator SDK.
The DApp components can reside in the root file-system itself, or in their own, separate file-system.
Additional flash drives can be used as the DApp input and output, either containing file-systems or containing raw data.
The emulator can be instructed to execute whatever computation the DApp wishes to perform inside the Cartesi Machine.
For a complete description of the Cartesi Machine architecture and the boot process, see the documentation for [the target perspective](../../target/overview/).

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
playground:~$ cartesi-machine --help
Usage:

  /opt/cartesi/bin/cartesi-machine.lua [options] [command] [arguments]

where options are:

  --ram-image=<filename>
    name of file containing RAM image (default: "linux.bin")

  --no-ram-image
    forget settings for RAM image

  --ram-length=<number>
    set RAM length

  --rom-image=<filename>
    name of file containing ROM image (default: "rom.bin")

  --no-rom-bootargs
    clear default bootargs

  --append-rom-bootargs=<string>
    append <string> to bootargs

  --no-root-flash-drive
    clear default root flash drive and associated bootargs parameters

  --flash-drive=<key>:<value>[,<key>:<value>[,...]...]
    defines a new flash drive, or modify an existing flash drive definition
    flash drives appear as /dev/mtdblock[1-7]

    <key>:<value> is one of
        label:<label>
        filename:<filename>
        start:<number>
        length:<number>
        shared

        label (mandatory)
        identifies the flash drive and init attempts to mount it as /mnt/<label>

        filename (optional)
        gives the name containing the image for the flash drive
        when omitted or set to the empty string, the drive starts filled with 0

        start (optional)
        sets the starting physical memory offset for flash drive in bytes
        when omitted, drives start at 2 << 63 and are spaced by 2 << 60
        if any start offset is set, all of them must be set

        length (optional)
        gives the length of the flash drive in bytes (must be a multiple of 4Ki)
        if omitted, the length is computed from the image in filename
        if length and filename are set, the image file size must match length

        shared (optional)
        target modifications to flash drive modify image file as well
        by default, image files are not modified and changes are lost

    (an option "--flash-drive=label:root,filename:rootfs.ext2" is implicit)

  --replace-flash-drive=<key>:<value>[,<key>:<value>[,...]...]
    replaces an existing flash drive right after machine instantiation.
    (typically used in conjunction with the --load=<directory> option.)

    <key>:<value> is one of
        filename:<filename>
        start:<number>
        length:<number>
        shared

    semantics are the same as for the --flash-drive option with the following
    difference: start and length are mandatory, and must match those of a
    previously existing flash drive.

  --max-mcycle=<number>
    stop at a given mcycle (default: 2305843009213693952)

  -i or --htif-console-getchar
    run in interactive mode

  --htif-yield-progress
    honor yield progress requests by target

  --htif-yield-rollup
    honor yield rollup requests by target

  --dump-machine-config
    dump initial machine config to screen

  --load=<directory>
    load prebuilt machine from <directory>

  --store=<directory>
    store machine to <directory>

  --initial-hash
    print initial state hash before running machine

  --final-hash
    print final state hash when done

  --periodic-hashes=<number-period>[,<number-start>]
    prints root hash every <number-period> cycles. If <number-start> is given,
    the periodic hashing will start at that mcycle. This option implies
    --initial-hash and --final-hash.
    (default: none)

  --step
    print step log for 1 additional cycle when done

  --json-steps=<filename>
    output json with step logs for all cycles to <filename>

  --dump-pmas
    dump all PMA ranges to disk when done

and command and arguments:

  command
    the full path to the program inside the target system
    (default: /bin/sh)

  arguments
    the given command arguments

<number> can be specified in decimal (e.g., 16) or hexadeximal (e.g., 0x10),
with a suffix multiplier (i.e., Ki, Mi, Gi for 2^10, 2^20, 2^30, respectively),
or a left shift (e.g., 2 << 20).

playground:~$ md5sum /opt/cartesi/share/images/linux.bin
d8402b40fb9e1119a7c719a9167c91dd  /opt/cartesi/share/images/linux.bin
playground:~$ md5sum /opt/cartesi/share/images/rom.bin
8449f94464d6bd28b2d72c93f11ead19  /opt/cartesi/share/images/rom.bin
playground:~$ md5sum /opt/cartesi/share/images/rootfs.ext2
786689f70ea109d3d0762801c88f2fbb  /opt/cartesi/share/images/rootfs.ext2
```

Inside the container, which runs as the current user, the documentation directory is shared as the home directory.
Alternatively, to download the images directly from Cartesi's repository (bypassing the build) and run the container as root with no sharing, use
```bash
$ docker pull cartesi/playground:0.1.1
$ docker run -it -h playground cartesi/playground:0.1.1 /bin/bash
```
