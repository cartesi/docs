---
title: Introduction
---

:::note Section Goal
- risc-v and Linux Architectures
- machine Architecture (boot, file-system, drives)
:::

The Cartesi Machine is Cartesi's solution for verifiable computation.
It was designed to bring mainstream scalability to DApps and mainstream productivity to DApp developers.

### Scalability

DApps running exclusively on smart contracts face severe constraints on the amount of data they can manipulate and on the complexity of computations they can perform.
These limitations manifest themselves as exorbitant transaction costs and&mdash;even if such costs could somehow be overcome&mdash;as extremely long computation times.

In comparison, DApps running inside Cartesi Machines can process virtually unlimited amounts of data, and at a pace over 4 orders of magnitude faster.
This is possible because Cartesi Machines run off-chain, free of the overhead imposed by the consensus mechanisms used by blockchains.

In a typical scenario, one of the parties involved in a DApp will execute the Cartesi Machine off-chain and report its results to the blockchain.
Different parties do not need to trust each other because the Cartesi platform includes an automatic dispute mechanism for Cartesi Machines.
All interested parties repeat the computation off-chain and, if their results do not agree, they enter into a dispute.
The dispute mechanism guarantees that an honest party will win a dispute against any dishonest party.

To enable this dispute mechanism, Cartesi Machines are executed inside a special emulator that has three unique properties:

* Cartesi Machines are *self contained* &mdash; They run in isolation from any external influence on the computation;
* Cartesi Machines are *reproducible* &mdash; Two parties performing the same computation always obtain exactly the same results;
* Cartesi Machines are *transparent* &mdash; They expose their entire state for external inspection.

From the point of view of the blockchain, the disputes require only a tiny fraction of the amount of computation performed by the Cartesi Machine.
This creates a Panopticon effect that discourages the posting of incorrect results, increasing the efficiency of the platform.

Cartesi Machines allow DApps to take advantage of vastly increased computing capabilities off-chain, while enjoying the same security guarantees offered by code that runs natively as smart contracts.
This is what Cartesi means by scalability.

### Productivity

Scalability is not the only impediment to widespread blockchain adoption.
Another serious limiting factor is the reduced developer productivity.

Modern software development involves the combination of dozens of off-the-shelf software components.
Creating these components took the concerted effort of an active worldwide community over the course of several decades.
They have all been developed and tested using well-established toolchains (programming languages, compilers, linkers, profilers, debuggers etc), and rely on multiple services provided by modern operating systems (memory management, multi-tasking, file systems, networking, etc).

Smart contracts are developed using ad-hoc toolchains, and run directly on top of custom virtual machines, without the support of an underlying operating system.
This arrangement deprives developers of the tools of their trade, severely reduces the expressive power at their disposal, and consequently decimates their productivity.

In contrast, Cartesi Machines are based on a proven platform: [RISC-V](https://riscv.org/).
The RISC-V platform is supported by a vibrant community of developers.
Their efforts have produced an extensive software infrastructure, most notably ports of the Linux operating system and the GNU toolchain.

By moving most of their DApp logic to run inside Cartesi Machines, but on top of the Linux Operating System, developers are isolated not only from the limitations and idiosyncrasies of specific blockchains, but also from irrelevant details of the Cartesi Machine architecture itself.
They regain access to all the tools they have come to rely on when writing applications.

This is Cartesi's contribution to empowering DApp developers to express their creativity unimpeded, and to boost their productivity.

### Documentation structure

Cartesi Machines can be seen from 3 different sides:

* *The host perspective* &mdash;
This is the environment right outside the Cartesi Machine emulator.
It is most relevant to developers setting up Cartesi Machines, running them, or manipulating their contents.
It includes the emulator's API in all its flavors: C++, Lua, gRPC, and the command-line interface.
It also includes the cross-compiling toolchain, and the tools used to build the Linux kernel and the embedded Linux root file-systems;
* *The target perspective * &mdash;
This is the environment inside the Cartesi Machine.
It encompasses Cartesi's particular flavor of the RISC-V architecture, as well as the organization of the embedded Linux Operating System that runs on top of it.
It is most relevant to programmers responsible for the DApp components that run off-chain but must be verifiable;
* *The blockchain perspective* &mdash;
This is the view smart contracts have of Cartesi Machines.
It consists almost exclusively of the manipulation of cryptographic hashes of the state of Cartesi Machines and parts thereof.
In particular, using only hash operations, the blockchain can verify assertions concerning the contents of the state, and can obtain the state hash that results from modifications to the state.

As with every computer, the level of knowledge required to interact with Cartesi Machines depends on the nature of the application being created.
Simple applications will require target developers to code a few scripts invoking pre-installed software components, require host developers to simply fill out a configuration file specifying the location of the components needed to build a Cartesi Machine, and require blockchain developers to simply instantiate one of the high-level contracts provided by Cartesi's.
At the other extreme are the developers working inside Cartesi, who regularly write, build, and deploy custom software components to run in the target, or even change the Linux kernel, who programatically control the creation and execution of Cartesi Machines in the howt, who must understand and use the hash-based state manipulation primitives used in the blockchain.

Although Cartesi's goal is to shield platform users from as much complexity as possible, there is value in making as much information available as possible.
To that end, this documentation of Cartesi Machines aims to provides enough information to cover all 3 sides, at all depths of understanding.

## The host perspective

Cartesi's reference off-chain implementation of Cartesi Machines is based on software emulation.
The emulator is written in C/C++ with POSIX dependencies restricted to the terminal, process, and memory-mapping facilities.
It written as a C++ library, and can be accessed in a variety of different ways.

When linked to a C++ application, the emulator can be controlled directly via the interface of the `cartesi::machine` class.
The emulator can also be accessed from the Lua programming language, via a `cartesi` module that exposes a `cartesi.machine` interface to Lua programs, similar to what is available to C++ programs.
Additionally, Cartesi provides a gRPC server that can be run to host a Cartesi Machine instance remotely.
This server exposes a higher-level interface better suited for the verification process, including the ability to create in-memory snapshots of the current machine state so later modifications can be rolled back.
Finally, there is a command-line utility (written in Lua) that can configure and run Cartesi Machines for rapid prototyping.
The [emulator repository](machine/emulator.md) in the Emulator SDK can be used to build and install the Cartesi Machine emulator.
The emulator can then be used inside a Docker container via any of these methods.

### Overview

Cartesi Machines are separated into a processor and a board.
The processor performs the computations, executing the traditional fetch-execute loop while maintaining a variety of registers.
The board defines the surrounding environment with an assortment of memories (ROM, RAM, flash drives) and a number of devices.
Memories and devices are mapped to the 64-bit physical address space of the Cartesi Machine.
The amount of RAM and the number, length, and position of the flash drives in the address space can be chosen according to the needs of each particular application.

In a typical scenario, a Cartesi Machine is initialized and then run until it halts.
At a minimum, the initialization process loads a ROM image, a RAM image, and a root file-system (as a flash drive) from regular files in the host file-system.
Execution starts from the [ROM image](machine/ROM.md), which contains a simple program that creates a description of the machine organization for the Linux kernel. 
The Linux kernel itself resides in the [RAM image](machine/kernel.md).
After it is done with its own initialization, the Linux kernel cedes control to the `/sbin/init` program in the root file-system.
The [root file-system](machine/rootfs.md) contains all the data files and programs that make up an embedded Linux distribution.
The DApp components can reside in the root file-system itself, or in their own separate file-system.
Additional flash drives can be used as the DApp input and output, either containing file-systems or containing raw data.
The `/sbin/init` script can be used to execute whatever computation the DApp wishes to perform inside the Cartesi Machine.
For a complete description of the Cartesi Machine architecture and the boot process, see the documentation for [the target perspective](#the-target-perspective).

The documentation start from the command-line utility, `cartesi-machine`.
This utility is used for most prototyping tasks.
The documentation then covers the Lua interface of `cartesi.machine`.
Once these are well understood, the C++ and gRPC interfaces will be intuitive enough for the reference manual to suffice.

### Setting up the development environment

The setup of a new development environment is often a time-consuming task.
This is particularly true in case of cross-development environments (i.e., when the development happens in a host platform but software runs in a different target platform).
The Cartesi Machine SDK provides a Docker image 
Besides the emulator software and its dependencies, 

### The command-line interface

In the simplest usage scenario, the `cartesi-machine` command-line utility can be used to run a Cartesi Machine until it halts.

#### Basic initialization

<a name="first-cartesi-machine-example"></a>

The following command instructs `cartesi-machine` to build a Cartesi Machine with `rom.bin` as the [ROM image](machine/ROM.md), and to append the string `quiet -- /bin/ls /bin` to the automatically generated kernel command line.
The machine has 64MiB of RAM, uses `kernel.bin` as the [RAM image](machine/kernel.md), and uses `rootfs.ext2` as the [root file-system](machine/rootfs.md).
(These files are generated by the Emulator SDK.)

```bash
$ cartesi-machine \
    --rom-backing="rom.bin" \
    --append-rom-bootargs="quiet -- /bin/ls /bin" \
    --ram-backing="kernel.bin" \
    --ram-length=64Mi \
    --root-backing="rootfs.ext2"
```
The `--rom-backing`, `--ram-backing`, `--ram-length`, and `--root-backing` command-line options have as default values the same values in the example, so they can be omitted.
To remove the default backing files, use the command-line options `--no-rom-backing`, `--no-ram-backing` and `--no-root-backing`, respectively.

```bash
$ cartesi-machine --append-rom-bootargs="quiet -- /bin/ls /bin"
```
The output is
```
Building machine: please wait

         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI
        \ /   MACHINE
         '

arch           dnsdomainname  linux64        nice           sh
ash            dumpkmap       ln             nuke           sleep
base64         echo           login          pidof          stty
busybox        egrep          ls             ping           su
cat            false          lsattr         pipe_progress  sync
chattr         fdflush        lsblk          printenv       tar
chgrp          fgrep          mk_cmds        ps             touch
chmod          findmnt        mkdir          pwd            true
chown          getopt         mknod          resume         umount
compile_et     grep           mktemp         rm             uname
cp             gunzip         more           rmdir          usleep
cpio           gzip           mount          run-parts      vi
date           hostname       mountpoint     sed            watch
dd             kill           mt             setarch        wdctl
df             link           mv             setpriv        zcat
dmesg          linux32        netstat        setserial
[    0.055620] reboot: Power down

Halted with payload: 0
Cycles: 60477961
```
The output shows the Cartesi Machine splash screen, followed by the listing of directory `/bin`.
The `quiet` option in ROM `bootargs` instructs the Linux kernel to omit a variety of diagnostic messages that would otherwise clutter the output.
The listing was produced by the command that follows the `--` separator in the ROM `bootargs`.
The Linux passes this unmodified to `/sbin/init`, and the Cartesi-provided `/sbin/init` script executes the command before gracefully halting the machine.

#### Interactive sessions

By default, the `cartesi-machine` utility executes the Cartesi Machine non-interactive mode.
Verifiable computations must always be run in non-interactive sessions.
User interaction with a Cartesi Machine via the console is, after all, not reproducible.
Nevertheless, it is often convenient to directly interact with the emulator, as if using a computer console.

The command-line option `-i` (short for `--htif-interact`) instructs the emulator to monitor the console for input, and to make this input available to the Linux kernel via the HTIF device (HTIF stands for Host-Target Interface.)
When there are no arguments after the `--` separator in the ROM `bootargs`, or when such arguments do not correspond to an executable, the Cartesi-provided `/sbin/init` script drops into a shell.
Interaction with the shell enables the exploration of the embedded Linux distribution from the inside.
Exiting the shell returns control back to `/sbin/init`, which then gracefully halts the machine.

For example, if an interactive session is started with the following command
```bash
$ cartesi-machine \
    --append-rom-bootargs="quiet" \
    -i
```
it drops into the shell.
Running the command `ls /bin` causes the listing of directory `/bin` to appears.
The command `exit` causes the shell to exit.
The output is
```
Building machine: please wait
Running in interactive mode!

         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI
        \ /   MACHINE
         '

~ # ls /bin
arch           dnsdomainname  linux64        nice           sh
ash            dumpkmap       ln             nuke           sleep
base64         echo           login          pidof          stty
busybox        egrep          ls             ping           su
cat            false          lsattr         pipe_progress  sync
chattr         fdflush        lsblk          printenv       tar
chgrp          fgrep          mk_cmds        ps             touch
chmod          findmnt        mkdir          pwd            true
chown          getopt         mknod          resume         umount
compile_et     grep           mktemp         rm             uname
cp             gunzip         more           rmdir          usleep
cpio           gzip           mount          run-parts      vi
date           hostname       mountpoint     sed            watch
dd             kill           mt             setarch        wdctl
df             link           mv             setpriv        zcat
dmesg          linux32        netstat        setserial
~ # exit
[  339.117447] reboot: Power down

Halted with payload: 0
Cycles: 339122301929
```
Note that the final cycle count is meaningless, as the machine repeatedly skips forward when idle from one CLINT-generated interrupt to the next (CLINT stands for Core Local Interruptor, the timer device).

#### Adding custom flash drives

To enable transparency, Cartesi Machine flash drives are mapped into the machine's 64-bit address space.
By default, the start of the first flash drive (the root) is set to the beginning of the second half of the address space (i.e., at offset 2<sup>63</sup>).
The size of a flash drive is automatically set to match the size of its backing file.
Because RISC-V uses 4KiB pages, backing files must have a size multiple of 4KiB.
(The `truncate` utility can be used to pad a file with zeros so its size is a multiple of 4KiB.)

Other flash drives (up to 8 in total) can be specified by adding a command-line option in the form `--flash-<label>-backing=<filename>`.
The starts of the 8 flash drives are automatically spaced uniformly within that second half of the address space.  They are therefore separated by 2<sup>60</sup> bytes, which &ldquo;should be enough separation for everyone&rdquo;.

Choosing convenient starts and length for flash drives in the machine's address space has implications on certain operations, discussed in detail from [the blockchain perspective](#the-blockchain-perspective), that involve the manipulation of hashes of the Cartesi Machine state.
The start and length of a flash drive with label `<foo>` can be explicitly specified in the command line with the options `--flash-<label>-start=<number>` and `--flash-<label>-length=<number>`.
For convenience, numbers can be specified in decimal or hexadecimal (e.g., `4096` or `0x1000`) and may include a suffix multiplier (i.e., `Ki` to multiply by 2<sup>10</sup>, `Mi` to multiply by 2<sup>20</sup>, and `Gi` to multiply by 2<sup>30</sup>).
They can also use C's *shift left* notation to multiply by arbitrary powers of 2 (e.g. `1 << 24` meaning 2<sup>24</sup>).
If the start of *any* drive is specified, then the starts for *all* drives must be specified.
The machine will fail to build if there is any overlap between the ranges occupied by multiple drives.

The preferred file-system type is `ext2`.
These file-systems can be easily created with the `genext2fs` command-line utility (available in Ubuntu as its own package), and inspected or modified with the `e2ls`, `e2cp` command-line utilities (available in Ubuntu as the `e2tools` package). <a name="cartesi-machine-with-foo-flash-drive"></a>

For example,
```bash
$ mkdir foo
$ echo Hello world > foo/bar
$ genext2fs -b 1024 -d foo foo.ext2
$ cartesi-machine \
    --append-rom-bootargs="quiet -- /bin/cat /mnt/foo/bar.txt" \
    --flash-foo-backing="foo.ext2"
```
Here, the string `foo` is the *label* for the flash drive.
The Cartesi-provided `/sbin/init` script will automatically mount this file-system (if indeed the backing file contains a valid file-system) at `/mnt/foo`.
The command executed in the machine simply copies its contents to the terminal.
The output is
```
Building machine: please wait

         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI
        \ /   MACHINE
         '

Hello world!
[    0.059029] reboot: Power down

Halted with payload: 0
Cycles: 64054884
```

#### Making target changes to flash drives reflect on the backing files

The emulator never modifies the ROM and RAM backing files.
They are simply loaded into host memory and only this copy is exposed to changes caused by code executing in the target.
(The `--dump-pmas` command-line option can be used to inspect the modified copies for debugging purposes. See below.)

By default, the emulator also does not modify the backing files for any of the flash drives.
However, since these backing files can be very large, the emulator does not pre-allocate any host memory for flash drives.
Instead, it uses the operating system's memory mapping capabilities.
The operating system reads to host memory only those pages in the backing file that are actually read by code executing in the target.
(Naturally, when a state hash is requested, all backing files are read from disk and processed. See below.)
These backing files are mapped to host memory in a *copy-on-write* fashion.
When code running in the target causes the emulator to write to a mapped backing file, the operating system makes a copy of the page before modification and replaces the mapping to point to it.
The backing files are never written to.
For example, running the machine
```bash
$ cartesi-machine \
    --append-rom-bootargs="quiet -- /bin/ls /mnt/foo/*.txt && /bin/cp /mnt/foo/bar.txt /mnt/foo/baz.txt && ls /mnt/foo/*.txt" \
    --flash-foo-backing="foo.ext2"
```
produces the output
```
Building machine: please wait

         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI
        \ /   MACHINE
         '

/mnt/foo/bar.txt
/mnt/foo/bar.txt  /mnt/foo/baz.txt
[    0.060616] reboot: Power down

Halted with payload: 0
Cycles: 65652775
```
indicating that the file-system was modified, at least from the perspective of the target.
However, inspecting the `foo.ext2` backing file from outside the emulator shows it is unchanged.
```
$ e2ls -al foo.ext2:*.txt
     12  100644   501    20       13 19-May-2020 14:48 bar.txt
```

This behavior is appropriate when the flash drives will only be used as inputs.
For output flash drives, target changes to flash drives must reflect on the corresponding backing files.
To that end, the command-line option `--flash-<label>-shared` causes the backing files to be mapped to host memory in a *shared* fashion.
For example,
```bash
$ cartesi-machine \
    --append-rom-bootargs="quiet -- /bin/ls /mnt/foo/*.txt && /bin/cp /mnt/foo/bar.txt /mnt/foo/baz.txt && ls /mnt/foo/*.txt" \
    --flash-foo-backing="foo.ext2" \
    --flash-foo-shared
```
produces exactly the same output as before.
However, the backing file `foo.ext2` has indeed been modified.
```
$ e2ls -al foo.ext2:*.txt
     12  100644   501    20       13 19-May-2020 14:48 bar.txt
     13  100644     0     0       13 31-Dec-1969 21:00 baz.txt
```

#### Controlling the end of execution

Before returning control to the command line, `cartesi-machine` prints the value of *halt payload* and the number of *cycles*.
In the examples shown until now, the payload has always been 0.
This is the default payload produced by the `poweroff` command available inside `rootfs.ext2`, which is invoked by `/sbin/init` during a graceful shutdown.
The `/opt/cartesi/htif` utility can be used to immediately halt the machine, as if pulling its cord from a wall, while at the same time selecting the payload.
The utility uses HTIF halt subdevice (`DEV=0`) to halt the machine and, consequently, the emulator.
For example,
```bash
$ cartesi-machine \
    --append-rom-bootargs="quiet -- /opt/cartesi/bin/htif --halt 42"
```
produces the output
```
Building machine: please wait

         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI
        \ /   MACHINE
         '


Halted with payload: 42
Cycles: 54171835
```

The machine's processor includes a control and status register (CSR), named `mcycle`, that starts at 0 and is incremented after every cycle.
The maximum cycle can be specified with the command-line option `--max-mcycle=<number>`.
For example,
```bash
$ cartesi-machine \
    --append-rom-bootargs="quiet -- /opt/cartesi/bin/htif --halt 42" \
    --max-mcycle=696857
```
produces the output
```
Building machine: please wait

         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI

Cycles: 696857
```
Note the execution was interrupted before the splash screen was completed.

#### Providing feedback on the computation progress

A target application can inform the host of its progress by using a Cartesi-specific HTIF yield subdevice (`DEV=2`) progress command (`CMD=0`).
This causes the `cartesi-machine` script to regain control of execution, whereupon it verifies the emulator has yielded control, and prints a progress message using the provided `DATA=<permil>` value.

For example, during the execution of the loop,
```bash
$ cartesi-machine
    --append-rom-bootargs="quiet -- /bin/ash -c 'for i in \$(seq 0 50 10000); do /opt/cartesi/bin/htif --yield 0 \$i; done'" \
    --htif-yield
```
the `cartesi-machine` utility receives control back from the emulator every time the target executes the `htif` utility.
Each time, it it prints a progress message (shown at 44% below) and resumes the emulator so it can continue working.
```
Building machine: please wait

         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI
        \ /   MACHINE
         '

Progress:  44.00
```
This feature is most useful when the emulator is controlled programmatically, via its Lua, C++, or gRPC interfaces, where Cartesi Machines typically run disconnected from the console.
In these situations, the progress command of the yield HTIF device can be used to drive a dynamic user interface element that reassures users progress is being made during long, silent computations.
Its handling by `cartesi-machine`, which does have access to the console, is simply to help with prototyping and debugging.

#### Printing machine state hashes

The `cartesi-machine` utility can also be used to output Cartesi Machine state hashes.
To obtain the state hash right before execution starts, use the command-line option `--initial-hash`.
Conversely, to obtain the state hash right after execution is done, use the option `--final-hash`.
For example,
```bash
$ cartesi-machine \
    --append-rom-bootargs="quiet -- /opt/cartesi/bin/htif --halt 42" \
    --max-mcycle=696857 \
    --initial-hash \
    --final-hash
```
produces the output
```
Building machine: please wait
Updating Merkle tree: please wait
edb595619409a3f8bc970adc0a3662f8866a31d572b51a56f632815d8ad9e826

         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI

Cycles: 696857
Updating Merkle tree: please wait
260fc7e3eb959f6908c2649ec94717f770846ca8f7e41890117588404033efa5
```
The initial state hash `edb595...` is the Merkle tree root hash of the entire 64-bit address space, where the leaves are aligned 64-bit words.
Since Cartesi Machines are transparent, the contents of this address space encompass the entire machine state, including the all processor's CSRs and general-purpose registers, the contents of RAM and ROM, of all flash drives, and of all other devices connected to the board.
It therefore works as a cryptographic signature of the machine, and implicitly of the computation it is about to execute.
Since Cartesi Machines are reproducible, the initial state hash also works as a future on the result of the computation itself.
In other words, the the &ldquo;final state hash&rdquo; `260fc7...` is the only possible outcome for the `--final-hash` at cycle 696857, given the result of the `--initial-hash` operation was `edb595...`.

Allowing the machine to run until it halts
```bash
$ cartesi-machine \
    --append-rom-bootargs="quiet -- /opt/cartesi/bin/htif --halt 42" \
    --initial-hash \
    --final-hash
```
produces instead the output
```
Building machine: please wait
Updating Merkle tree: please wait
edb595619409a3f8bc970adc0a3662f8866a31d572b51a56f632815d8ad9e826

         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI
        \ /   MACHINE
         '


Halted with payload: 42
Cycles: 54171835
Updating Merkle tree: please wait
5ab9d827a133adb39fb3e46ce9cc963614d25fbd44c09acdb4881b6eebc640cd
```
Naturally, the initial state hash is the same as before.
However, the final state hash `5ab9d8...` now pertains to cycle 54171835, where the machine is halted.
This is only possible state hash for a halted machine that started from state hash `edb595...`.

#### Storing and loading Cartesi Machines

At any point in their execution, Cartesi Machines can be stored to disk.
A stored machine can later be loaded to continue its execution where it left off.
To store a machine to a given `<directory>`, use the command-line option `--store=<directory>`.
The machine is stored in the state it was before `cartesi-machine` returns to the command line.
For example, to store the machine corresponding to state hash `260fc7...`
```bash
$ cartesi-machine \
    --append-rom-bootargs="quiet -- /opt/cartesi/bin/htif --halt 42" \
    --max-mcycle=696857 \
    --store="260fc7"
```
This command creates a directory `260fc7/`, containing a variety of files for internal use by the Cartesi Machine emulator.
If the directory already exists, the operation will fail.
This prevents the overwriting of a Cartesi Machine by mistake.
Once created, the directory can be compressed and transfered to other hosts.
To restore the corresponding Cartesi Machine, use the command-line option `--load=<directory>`.
For example,
```bash
$ cartesi-machine \
    --load="260fc7" \
    --initial-hash \
    --final-hash
```
produces the output
```
Loading machine: please wait
Updating Merkle tree: please wait
260fc7e3eb959f6908c2649ec94717f770846ca8f7e41890117588404033efa5
        \ /   MACHINE
         '


Halted with payload: 42
Cycles: 54171835
Updating Merkle tree: please wait
5ab9d827a133adb39fb3e46ce9cc963614d25fbd44c09acdb4881b6eebc640cd
```
Note that, other than `--load`, no initialization command-line options were used.
These initializations were used to define the machine before it was stored: their values are implicitly encoded in the stored state.
Note also that the initial state hash `260fc7...` after `--load` matches the final state hash before `--store`.
After all, they are state hashes concerning the state of the same machine at the same cycle.
In fact, `--store` writes this state hash inside the directory, and `--load` verifies that the state hash of the restored machine matches what it found in the directory.
Finally, note that the machine continues from where it left off, and reaches the same final state hash `5ab9d8...`, as if it had never been interrupted.

#### Advanced options

The remaining options in the command-line utility `cartesi-machine` are mostly used for low-level debugging.
As such, they require some context.
During verification, the blockchain mediates a *verification game* between the disputing parties.
Both parties started from a Cartesi Machine that has a known and agreed uppon initial state hash.
At the end of the computation, these parties now disagree on the state hash for the halted machine.
The state hash evolves as the machine executes steps in its fetch-execute loop.
The first stage of the verification game therefore searches for the first step of disagreement: the particular cycle such that the parties agree on the state hash before the step, but disagree on the state hash after the step.
Once this step is identified, one of the parties sends to the blockchain a log of state accesses that happen along the step, including cryptographic proofs for every value read from or written to the state.
This log proves to the blockchain that the execution of the step evolves the state in such a way that it reaches the state hash claimed by the submitting party.
The `--step` command-line option instructs `cartesi-machine` to dump to screen an abridged, user-friendly version of this state access log.

For the sake of completeness, assuming the step in question is `696857` (the same used in the examples above) running
```bash
$ cartesi-machine \
    --append-rom-bootargs="quiet -- /opt/cartesi/bin/htif --halt 42" \
    --max-mcycle=696857 \
    --step > /dev/null
```
produces the log
```
Building machine: please wait

Cycles: 696857
Gathering step proof: please wait
begin step
  hash 260fc7e3
  1: read iflags.H@0x1d0(464): 0x18(24)
  hash 260fc7e3
  2: read iflags.Y (superfluous)@0x1d0(464): 0x18(24)
  hash 260fc7e3
  3: write iflags.Y@0x1d0(464): 0x18(24) -> 0x18(24)
  begin raise_interrupt_if_any
    hash 260fc7e3
    4: read mip@0x170(368): 0x0(0)
    hash 260fc7e3
    5: read mie@0x168(360): 0x8(8)
  end raise_interrupt_if_any
  begin fetch_insn
    hash 260fc7e3
    6: read pc@0x100(256): 0x80002e8c(2147495564)
    begin translate_virtual_address
      hash 260fc7e3
      7: read iflags.PRV@0x1d0(464): 0x18(24)
      hash 260fc7e3
      8: read mstatus@0x130(304): 0xa00001800(42949679104)
    end translate_virtual_address
    begin find_pma_entry
      hash 260fc7e3
      9: read pma.istart@0x800(2048): 0x800000f9(2147483897)
      hash 260fc7e3
      10: read pma.ilength@0x808(2056): 0x4000000(67108864)
    end find_pma_entry
    hash 260fc7e3
    11: read memory@0x80002e88(2147495560): 0xa7b0231e47b783(47199985989040003)
  end fetch_insn
  begin sd
    hash 260fc7e3
    12: read x@0x78(120): 0x40008000(1073774592)
    hash 260fc7e3
    13: read x@0x50(80): 0x101000000000020(72339069014638624)
    begin translate_virtual_address
      hash 260fc7e3
      14: read iflags.PRV@0x1d0(464): 0x18(24)
      hash 260fc7e3
      15: read mstatus@0x130(304): 0xa00001800(42949679104)
    end translate_virtual_address
    begin find_pma_entry
      hash 260fc7e3
      16: read pma.istart@0x800(2048): 0x800000f9(2147483897)
      hash 260fc7e3
      17: read pma.ilength@0x808(2056): 0x4000000(67108864)
      hash 260fc7e3
      18: read pma.istart@0x810(2064): 0x1069(4201)
      hash 260fc7e3
      19: read pma.ilength@0x818(2072): 0xf000(61440)
      hash 260fc7e3
      20: read pma.istart@0x820(2080): 0x80000000000002d9(9223372036854776537)
      hash 260fc7e3
      21: read pma.ilength@0x828(2088): 0x3c00000(62914560)
      hash 260fc7e3
      22: read pma.istart@0x830(2096): 0x4000841a(1073775642)
      hash 260fc7e3
      23: read pma.ilength@0x838(2104): 0x1000(4096)
    end find_pma_entry
    hash 260fc7e3
    24: write htif.tohost@0x40008000(1073774592): 0x10100000000000a(72339069014638602) -> 0x101000000000020(72339069014638624)
    hash a5895405
    25: write htif.fromhost@0x40008008(1073774600): 0x0(0) -> 0x101000000000000(72339069014638592)
    hash 8ae8f8f7
    26: write pc@0x100(256): 0x80002e8c(2147495564) -> 0x80002e90(2147495568)
  end sd
  hash d83ff6f5
  27: read minstret@0x128(296): 0xaa218(696856)
  hash d83ff6f5
  28: write minstret@0x128(296): 0xaa218(696856) -> 0xaa219(696857)
  hash 02f2bc90
  29: read mcycle@0x120(288): 0xaa219(696857)
  hash 02f2bc90
  30: write mcycle@0x120(288): 0xaa219(696857) -> 0xaa21a(696858)
end step
```
Understanding these logs in detail requires a deep knowledge of not only RISC-V architecture, but also how Cartesi's emulator implements it.
The material is beyond the scope of this document.
In this particular example, however, was hand-picked for illustration purposes.
The RISC-V instruction being executed, `sd`, writes the 64-bit word `0x0101000000000020` to address `0x40008000` (access&nbsp;#24).
This is the memory-mapped address of HTIF's `tohost` CSR.
The value refers to the console subdevice (`DEV=1`) , command `putchar` (`CMD=1`), and causes the device to output a white-space character (`DATA=0x20`).
I.e., the instruction is drawing the `        \ /   MACHINE` row of the splash screen.

The command-line option `--json-log=<filename>` outputs a machine-readable version of the step log *for each cycle* executed by the emulator.
It is used by internal integration tests that verify the consistency between the Cartesi Machine as implemented by the off-chain emulator and as implemented by the on-chain step verification function.

The command-line optino `--dump-pmas` causes the emulator to dump the contents of all mapped spans in the address space to files.
Each span produces a file `<start>--<length>.bin`.
This is useful to insped the entire state of the machine from outside the emulator.

The final command-line option, `--dump-machine-config` will be explained in the next section.

### The Lua interface

Cartesi Machines are instantiated from a simple configuration structure.
This structure defines both the *organization* of the machine (i.e., the amount of RAM, the number of flash drives, their starts and lengths) and the initial *contents* of the machine state (i.e, the value of each register, and the contents of ROM, RAM, and the flash drives).

#### Initialization

<div class="row">
<div class="col col--6">

<a name="machine_config"></a>

```lua
machine_config = {
  rom = rom_config,
  ram = ram_config,
  flash = {
    flash_config, -- flash drive 0
    flash_config, -- flash drive 1
    ...
    flash_config  -- flash drive n <= 7
  },
  processor = processor_config,
  clint = clint_config,
  htif = htif_config
}
```

<a name="rom_config"></a>

```lua
rom_config = {
    bootargs = string,
    backing = string
}
```

<a name="ram_config"></a>

```lua
ram_config = {
    length = number,
    backing = string
}
```

<a name="flash_config"></a>

```lua
flash_config = {
  start = number,
  length = number,
  backing = string,
  shared = boolean
}
```

<a name="htif_config"></a>

```lua
htif_config = {
    interact = boolean,
    yield = boolean
    fromhost = number,
    tohost = number,
}
```

<a name="clint_config"></a>

```lua
clint_config = {
    mtimecmp = number,
}
```
</div>
<div class="col col--6">

<a name="processor_config"></a>

```lua
processor_config = {
  x = {
    [1] = number, -- register x1
    [2] = number, -- register x2
    ...
    [31] = number, -- register x31
  },
  pc = number,
  mvendorid = number,
  marchid = number,
  mimpid = number,
  mcycle = number,
  minstret = number,
  mstatus = number,
  mtvec = number,
  mscratch = number,
  mepc = number,
  mcause = number,
  mtval = number,
  misa = number,
  mie = number,
  mip = number,
  medeleg = number,
  mideleg = number,
  mcounteren = number,
  stvec = number,
  sscratch = number,
  sepc = number,
  scause = number,
  stval = number,
  satp = number,
  scounteren = number,
  ilrsc = number,
  iflags = number
},
```
</div>
</div>

The <a href="#rom_config">`rom`</a> entry in `machine_config` is a table with two fields.
`Bootargs` gives a string of at most 2KiB that will be copied into the last 2KiB of ROM. `Backing` gives the file name of an image that will be loaded at start of ROM.
This is where the [ROM image](machine/ROM.md) generated by the Emulator SDK is typically loaded, and it is here that the processor's `pc` (program counter) starts by default.
This ROM image generates the [<i>devicetree</i>](http://devicetree.org/) that describes the hardware to Linux, passes the `bootargs` string as the kernel command-line parameters, then cedes control to the RAM image.

The <a href="#ram_config">`ram`</a> entry in `machine_config` also has two fields.
`Length` gives the RAM size in bytes (RAM always starts at offset `0x80000000`).
This length should be a multiple of 4Ki, the length of a RISC-V memory page.
`Backing` gives the file name of an image that will be loaded at offset `0x80000000` (i.e., the start of RAM).
This is where the [RAM image](machine/kernel.md) generated by the Emulator SDK (which contains the Berkeley Boot Loader linked with the Linux kernel) is loaded.

The <a href="#flash_config">`flash`</a> entry in `machine_config` is a list containing flash drive configurations.
Each configuration contains four fields.
Fields `start` and `length` give the start and length of the flash drive in the machine's address space. The length must be a
multiple of 4Ki, the length of a memory page. `Backing` gives the file
name of an image that will be <i>mapped</i> to this region. This is different
from the ROM and RAM backing files, which are simply copied into the Cartesi Machine
memory, which has been allocated from the host memory. Flash drives use memory mapping because the backing files can be very large.
Mapping them instead of copying them saves host memory, as well as the time it
would take to load the backing files from disk to host memory. Since flash drive backing files
are mapped, their sizes on disk must exactly match the `length`
of the flash drive they are `backing`.  `Shared` is a Boolean
value that specifies whether changes to the flash drive that happen inside the target reflect
in the backing file that resides in the host as well. If set to `true`, the backing file will be modified accordingly.
This is useful when a flash drive will hold the result of a computation.
If set to `false` (the default), target modifications to the flash drive are <i>not</i> propagated to the
backing file that resides in the host. I.e., even though the flash drives are
read/write from the target perspective, the backing file in the host is left
unmodified.

The <a href="#htif_config">`htif`</a> entry in `machine_config`
has four fields, two of which are used only in rare occasions.  The most
commonly used field is the Boolean `interact`. When set to `true`
(the default is `false`), it instructs the emulator to monitor terminal
input in the host and make it available to the target via the HTIF device. This
is useful in interactive sessions during prototyping, and should never be used
when verifiability is needed. The `yield` Boolean instructs the emulator
to honor commands by the Yield subdevice in HTIF, returning control to the host.
This is used as a means for applications running in the target to inform the host about their progress.
When set to `false` (the default), the emulator ignores yield commands
and continues execution without returning control to the host.

The other entries in the `machine_config` are used only in rare
occasions.
The devices and processor have a variety of control and status registers (CSRs),
in addition to processor's general-purpose registers.
Most of these are defined in the RISC-V [user-level
ISA](https://content.riscv.org/wp-content/uploads/2017/05/riscv-spec-v2.2.pdf) and [privileged
architecture](https://content.riscv.org/wp-content/uploads/2017/05/riscv-privileged-v1.10.pdf) specifications.
The Cartesi-specific additions are described under the [the target perspective](#the-target-perspective).

The fields `tohost` and `fromhost` in `htif`.
allow for the overriding of the default initial values of these CSRs.
The <a href="#clint_config">`clint`</a> entry has a single
field, `mtimecmp`, which allows for the overriding of the default initial value
of this CSR. Similarly, the fields in the <a href="#processor_config">`processor`</a> entry
in `machine_config` allow for the overriding of the default initial value of all
general-purpose registers and CSRs.

#### Using cartesi-machine to produce configurations

The command-line utility can be used to streamline the configuration of Cartesi Machines.
Recall from an [earlier example](#first-cartesi-machine-example) that the `cartesi-machine` command
```bash
$ cartesi-machine \
    --rom-backing="rom.bin" \
    --append-rom-bootargs="quiet -- /bin/ls /bin" \
    --ram-backing="kernel.bin" \
    --ram-length=64Mi \
    --root-backing="rootfs.ext2" \
    --max-mcycle=0 \
    --dump-machine-config
```
builds a Cartesi Machine with `rom.bin` as the [ROM image](machine/ROM.md), and to append the string `quiet -- /bin/ls /bin` to the automatically generated kernel command line.
The machine has 64MiB of RAM, uses `kernel.bin` as the [RAM image](machine/kernel.md), and uses `rootfs.ext2` as the [root file-system](machine/rootfs.md).
(These files are generated by the Emulator SDK.)
The last two options instruct the utility to stop execution at cycle 0 (`mcycle` in `--max-mcycle` refers to the CSR that is advanced at every clock cycle), i.e., before the machine even starts and dump the resulting configuration.

The output of the command is
```lua
Building machine: please wait
machine_config = {
  processor = {
    x = {
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
      0x0, -- default
    },
    iflags = 0x18, -- default
    ilrsc = 0xffffffffffffffff, -- default
    marchid = 0x2, -- default
    mcause = 0x0, -- default
    mcounteren = 0x0, -- default
    mcycle = 0x0, -- default
    medeleg = 0x0, -- default
    mepc = 0x0, -- default
    mideleg = 0x0, -- default
    mie = 0x0, -- default
    mimpid = 0x1, -- default
    minstret = 0x0, -- default
    mip = 0x0, -- default
    misa = 0x8000000000141101, -- default
    mscratch = 0x0, -- default
    mstatus = 0xa00000000, -- default
    mtval = 0x0, -- default
    mtvec = 0x0, -- default
    mvendorid = 0x6361727465736920, -- default
    pc = 0x1000, -- default
    satp = 0x0, -- default
    scause = 0x0, -- default
    scounteren = 0x0, -- default
    sepc = 0x0, -- default
    sscratch = 0x0, -- default
    stval = 0x0, -- default
    stvec = 0x0, -- default
  },
  ram = {
    length = 0x4000000,
    backing = "kernel.bin",
  },
  rom = {
    backing = "rom.bin",
    bootargs = "console=hvc0 rootfstype=ext2 root=/dev/mtdblock0 rw mtdparts=flash.0:-(root) quiet -- /bin/ls /bin",
  },
  htif = {
    tohost = 0x0, -- default
    fromhost = 0x0, -- default
    interact = false, -- default
    yield = false, -- default
  },
  clint = {
    mtimecmp = 0x0, -- default
  },
  flash = {
    {
      start = 0x8000000000000000,
      length = 0x3c00000,
      backing = "rootfs.ext2",
      shared = false, -- default
    },
  },
}

Cycles: 0
```

This output includes a number of default values, conveniently marked as such by the `cartesi-machine` utility.
Reduced to its essential, it is simply
```lua
Building machine: please wait
machine_config = {
  processor = {
    mvendorid = cartesi.machine.MVENDORID,
    mimpid = cartesi.machine.MIMPID,
    marchid = cartesi.machine.MARCHID,
  },
  ram = {
    length = 0x4000000,
    backing = "kernel.bin",
  },
  rom = {
    backing = "rom.bin",
    bootargs = "console=hvc0 rootfstype=ext2 root=/dev/mtdblock0 rw mtdparts=flash.0:-(root) quiet -- /bin/ls /bin",
  },
  flash = {
    {
      start = 0x8000000000000000,
      length = 0x3c00000,
      backing = "rootfs.ext2",
    },
  },
}
```
The only required values in the `processor` configuration are the `mvendorid`, `mimpid`, `marchid` CSRs.
These are used to ensure the emulator matches the configuration.
During prototyping, they can be filled out from values exposed by the emulator itself.
In production code, they should be hard-coded to match the release of the emulator in use.

Note how the utility automatically sets the ROM `bootargs` to include several options in addition to what was requested by the `--append-rom-bootargs` option.
In particular, the `mtdparts=flash.0:-(root)` section is a kernel command-line parameter that informs the kernel of flash drives partitioning information.
The format for the option is documented in the [source-code](https://elixir.bootlin.com/linux/v5.5.4/source/drivers/mtd/parsers/cmdlinepart.c) for the kernel module that reads the parameter.
Here, `(root)` gives the partition label.

Recall the command-line utility can run Cartesi Machines with additional drives.
In that case, the resulting configuration automatically includes the appropriate value for `mtdparts`.
Repeating another [earlier example](#cartesi-machine-with-foo-flash-drive), and again omitting default values,
```bash
$ mkdir foo
$ echo Hello world > foo/bar
$ genext2fs -b 1024 -d foo foo.ext2
$ cartesi-machine \
    --append-rom-bootargs="quiet -- /bin/cat /mnt/foo/bar.txt" \
    --flash-foo-backing="foo.ext2" \
    --max-mcycle=0 \
    --dump-machine-config
```
produces the configuration
```lua
machine_config = {
  processor = {
    mvendorid = cartesi.machine.MVENDORID,
    mimpid = cartesi.machine.MIMPID,
    marchid = cartesi.machine.MARCHID,
  },
  ram = {
    length = 0x4000000,
    backing = "kernel.bin",
  },
  rom = {
    backing = "rom.bin",
    bootargs = "console=hvc0 rootfstype=ext2 root=/dev/mtdblock0 rw mtdparts=flash.0:-(root);flash.1:-(foo) quiet -- /bin/cat /mnt/foo/bar.txt",
  },
  flash = {
    {
      start = 0x8000000000000000,
      length = 0x3c00000,
      backing = "rootfs.ext2",
    },
    {
      start = 0x9000000000000000,
      length = 0x100000,
      backing = "foo.ext2",
    },
  },
}
```
Note the entry in `mtdparts` that causes `flash.1`, the flash drive containing the `foo.ext2` file-system to receive label `(foo)`.

#### Instantiating, obtaining state hashes, and running Cartesi Machines

The Lua interface to `cartesi.machine` can be used to instantiat and run a Cartesi Machine based on any desired configuration.
In particular, the configurations produced by the `cartesi-machine` utility, such as the configuration above.
This is, after all, the interface used internally by the `cartesi-machine` utility.
The following script serves to illustrate the basic operation.
```lua
-- Load the Cartesi Lua module
local cartesi = require"cartesi"

-- Writes formatted text to stderr
local function stderr(fmt, ...)
	io.stderr:write(string.format(fmt, ...))
end

-- Converts hash from binary to hexadecimal string
local function hexhash(hash)
    return (string.gsub(hash, ".", function(c)
        return string.format("%02x", string.byte(c))
    end))
end

-- Machine configuration with the foo.ext2 flash drive
local machine_config = {
  processor = {
    mvendorid = cartesi.machine.MVENDORID,
    mimpid = cartesi.machine.MIMPID,
    marchid = cartesi.machine.MARCHID,
  },
  ram = {
    length = 0x4000000,
    backing = "kernel.bin",
  },
  rom = {
    backing = "rom.bin",
    bootargs = "console=hvc0 rootfstype=ext2 root=/dev/mtdblock0 rw mtdparts=flash.0:-(root);flash.1:-(foo) quiet -- /bin/cat /mnt/foo/bar.txt",
  },
  flash = {
    {
      start = 0x8000000000000000,
      length = 0x3c00000,
      backing = "rootfs.ext2",
    },
    {
      start = 0x9000000000000000,
      length = 0x100000,
      backing = "foo.ext2",
    },
  },
}

-- Instantiate the machine
stderr("Building machine: please wait\n")
local m = cartesi.machine(machine_config)

-- Print the initial hash
stderr("Updating Merkle tree: please wait\n")
m:update_merkle_tree()
print(hexhash(m:get_root_hash()))

-- Run machine util it halts (or the heat death of the universe)
local max_mcycle = math.maxinteger
m:run(max_mcycle)

-- Check if machine was halted and print actual cycle count
if m:read_iflags_H() then
	stderr("\nHalted!\n")
	stderr("Cycles: %u\n", m:read_mcycle())
else
	stderr("\nNot halted yet!\n")
end

-- Print the final hash
stderr("Updating Merkle tree: please wait\n")
m:update_merkle_tree()
print(hexhash(m:get_root_hash()))
```
In the example above, the `cartesi.machine` constructor is invoked with the `machine_config` configuration table.
This returns a machine instance `m`, ready to run.
Before running the machine, however, the script computes and prints the state hash.

State hashes are maintained in a lazy fashion.
If no state hashes are needed, negligible cost is incurred.
The performance pentalty imposed on the emulator, should it be required to keep state hashes up-to-date, would be unacceptable (by several orders of magnitude).
Before requesting a state hash, the method `m:update_merkle_tree()` must be called.
It goes over all changes to the state that are still unnacounted for since the tree was last updated, and brings the tree in sync with the state.
Immediately after the call to `m:update_merkle_tree()`, state hashes are valid.
The script then obtains the root hash with the `m:get_root_hash()` method.
This returns a 32-byte binary hash, which is converted to hexadecimal and printed to screen.
The value can be used to ensure the machine created by the script indeed matches the machine created by the `cartesi-machine` utility.

The script then executes the machine with the `m:run(<max_mcycle>)` method.
The value of `<max_mcycle>` used in the example is a very large integer, providing the machine with enough cycles to run until it halts.

Once `m:run()` returns, the script checks the `H` bit in the `iflags` CSR.
This bit is permanently set to `true` if and only if the machine halts.
If indeed the machine is halted, the script then prints the total number of cycles executed, by reading the `mcycle` CSR.
This register is advanced at every cycle and, according to the configuration, started at `0`.

The output on the left was generated by the script.
The output on the right was produced by running the same Cartesi Machine via the `cartesi-machine` utility.
```bash
$ cartesi-machine \
    --append-rom-bootargs="quiet -- /bin/cat /mnt/foo/bar.txt" \
    --flash-foo-backing="foo.ext2" \
    --initial-hash
```
<div class="row">
<div class="col col--6">

```
Building machine: please wait
Updating Merkle tree: please wait
bda898196723afe437c8de8bcb8aebd08ca7f4e44452bcf58d2fc9e93a12dac3

         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI
        \ /   MACHINE
         '

Hello world!
[    0.059265] reboot: Power down

Halted!
Cycles: 64291620
Updating Merkle tree: please wait
c6c0e6fe92f443e6b17f34c0e4479f0b7c169242329d94a56955d39db0fb2463
```

</div>
<div class="col col--6">

```
Building machine: please wait
Updating Merkle tree: please wait
bda898196723afe437c8de8bcb8aebd08ca7f4e44452bcf58d2fc9e93a12dac3

         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI
        \ /   MACHINE
         '

Hello world!
[    0.059265] reboot: Power down

Halted with payload: 0
Cycles: 64291620
Updating Merkle tree: please wait
c6c0e6fe92f443e6b17f34c0e4479f0b7c169242329d94a56955d39db0fb2463
```

</div>
</div>

Note that the initial and final hashes are the same, as expected.


## The target perspective

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

### The processor

Following RISC-V terminology, Cartesi Machines implement the
RV64IMASU ISA.  The letters after RV specify the extension
set.  This selection corresponds to a 64-bit machine,
Integer arithmetic with Multiplication and division, Atomic
operations, as well as the optional Supervisor and User
privilege levels.  In addition, Cartesi Machines support the
Sv39 mode of address translation and memory protection.
Sv39 provides a 39-bit protected virtual address space,
divided into 4KiB pages, organized by a three-level page
table.  This set of features creates a balanced compromise
between the simplicity demanded by a blockchain
implementation and the flexibility expected from off-chain
computations.

There are a total of 99 instructions, out of which 28 simply
narrow or widen, respectively, their 64-bit or 32-bit
counterparts.  This being a RISC ISA, most instructions are
very simple and can be simulated in a few lines of
high-level code.  In contrast, the x86 ISA defines at least
2000 (potentially complex) instructions.  In fact, the only
complex operation in RISC-V is the virtual-to-physical
address translation.  Instruction decoding is particularly
simple due to the reduced number of formats (only 4, all
taking 32-bits).

The entire processor state fits within 512&nbsp;bytes, which
are divided into 64 registers, each one holding 64-bits. It
consists of 32 general-purpose integer registers and 26
control and status registers (CSRs). Most of these registers
are defined by the RISC-V&nbsp;ISA; the remaining are
Cartesi-specific. The processor makes its entire state
available, externally and read-only, by mapping individual
registers to the lowest 512 bytes in the physical address space
(in the <i>processor shadow</i>). The adjacent&nbsp;1.5KiB are
reserved for future use. The entire mapping is given in the
following table:
<center>
<table>
<tr>
  <th>Offset</th>             <th>Register</th>
  <th>Offset</th>             <th>Register</th>
  <th>Offset</th>             <th>Register</th>
  <th>Offset</th>             <th>Register</th>
</tr>
<tr>
  <td><tt>0x000</tt></td>     <td><tt>x0 </tt></td>
  <td><tt>0x120</tt></td>     <td><tt>mcycle</tt></td>
  <td><tt>0x160</tt></td>     <td><tt>misa</tt></td>
  <td><tt>0x1a0</tt></td>     <td><tt>sepc</tt></td>
</tr>
<tr>
  <td><tt>0x008</tt></td>     <td><tt>x1 </tt></td>
  <td><tt>0x128</tt></td>     <td><tt>minstret</tt></td>
  <td><tt>0x168</tt></td>     <td><tt>mie</tt></td>
  <td><tt>0x1a8</tt></td>     <td><tt>scause</tt></td>
</tr>
<tr>
  <td><tt>&hellip;</tt></td> <td><tt>&hellip;</tt></td>
  <td><tt>0x130</tt></td>    <td><tt>mstatus</tt></td>
  <td><tt>0x170</tt></td>    <td><tt>mip</tt></td>
  <td><tt>0x1b0</tt></td>    <td><tt>stval</tt></td>
</tr>
<tr>
  <td><tt>0x0f8</tt></td>    <td><tt>x31</tt></td>
  <td><tt>0x138</tt></td>    <td><tt>mtvec</tt></td>
  <td><tt>0x178</tt></td>    <td><tt>medeleg</tt></td>
  <td><tt>0x1b8</tt></td>    <td><tt>satp</tt></td>
</tr>
<tr>
  <td><tt>0x100</tt></td>    <td><tt>pc</tt></td>
  <td><tt>0x140</tt></td>    <td><tt>mscratch</tt></td>
  <td><tt>0x180</tt></td>    <td><tt>mideleg</tt></td>
  <td><tt>0x1c0</tt></td>    <td><tt>scounteren</tt></td>
</tr>
<tr>
  <td><tt>0x108</tt></td>    <td><tt>mvendorid</tt></td>
  <td><tt>0x148</tt></td>    <td><tt>mepc</tt></td>
  <td><tt>0x188</tt></td>    <td><tt>mcounteren</tt></td>
  <td><tt>0x1c8</tt></td>    <td><tt>ilrsc</tt></td>
</tr>
<tr>
  <td><tt>0x110</tt></td>    <td><tt>marchid</tt></td>
  <td><tt>0x150</tt></td>    <td><tt>mcause</tt></td>
  <td><tt>0x190</tt></td>    <td><tt>stvec</tt></td>
  <td><tt>0x1d0</tt></td>    <td><tt>iflags </tt></td>
</tr>
<tr>
  <td><tt>0x118</tt></td>    <td><tt>mimpid</tt></td>
  <td><tt>0x158</tt></td>    <td><tt>mtval</tt></td>
  <td><tt>0x198</tt></td>    <td><tt>sscratch</tt></td>
  <td><tt></tt></td>         <td><tt></tt></td>
</tr>
</table>
</center>

The only particularly relevant standard register
is&nbsp;<tt>mcycle</tt>.  Since its value is advanced at
every CPU cycle, it can be used to identify a particular
step in the computation being performed by a Cartesi
Machine. This is a key component of the verification
process, and can also be used to bound the amount of
computation.

The registers whose names start with
&ldquo;<tt>i</tt>&rdquo; are Cartesi additions, and have the
following semantics:

* The layout for register&nbsp;<tt>iflags</tt> can be seen below:<p></p>
<center>
<table>
<tr>
  <th> Bits </th>
  <td><tt>63&ndash;5</tt></td>
  <td><tt>4&ndash;3</tt></td> 
  <td><tt>2</tt></td> 
  <td><tt>1</tt></td> 
  <td><tt>0</tt></td> 
</tr>
<tr>
  <th> Field </th>
  <td><i>Reserved</i></td>
  <td><tt>PRV</tt></td> 
  <td><tt>Y</tt></td> 
  <td><tt>I</tt></td> 
  <td><tt>H</tt></td> 
</tr>
</table>
</center>
<tt>PRV</tt> gives the current privilege level (0 for User, 1 for Supervisor, and 3 for Machine), bit <tt>Y</tt> is set to 1 when the processor has yielded control back to the host, bit <tt>I</tt> is set to 1 when the processor is idle (i.e., waiting for interrupts), bit <tt>H</tt> is set to 1 to signal the processor has been permanently halted.
* Register&nbsp;<tt>ilrsc</tt> holds the reservation address for the&nbsp;LR/SC atomic memory operations;

### The board

The interaction between board and processor happens through interrupts and the memory bus. Devices are mapped to the processor's physical address space.
The mapping can be seen in the following table:

<center>
<table>
<tr>
  <th> Physical address </th>
  <th> Mapping </th> 
</tr>
<tr>
  <td> <tt>0x00000000&ndash;0x000003ff</tt> </td> 
  <td> Processor shadow </td>
</tr>
<tr> 
  <td> <tt>0x00000800&ndash;0x00000Bff</tt> </td>
  <td> Board shadow </td>
</tr>
<tr>
  <td> <tt>0x00001000&ndash;0x00010fff</tt> </td>
  <td> ROM (Bootstrap &amp; Devicetree) </td>
</tr>
<tr>
  <td> <tt>0x02000000&ndash;0x020bffff</tt> </td>
  <td> Core Local Interruptor </td>
</tr>
<tr>
  <td> <tt>0x40000000&ndash;0x40007fff</tt> </td>
  <td> Host-Target Interface </td>
</tr>
<tr>
  <td> <tt>0x80000000&ndash;</tt><i>configurable</i> </td>
  <td> RAM </td>
</tr>
<tr>
  <td> <i> configurable </i> </td>
  <td> Flash drive 0 </td>
</tr>
<tr>
  <td> &hellip;</td>
  <td> &hellip;</td>
</tr>
<tr>
  <td> <i> configurable </i> </td>
  <td> Flash drive 7 </td>
</tr>
</table>
</center>


There are 64KiB of ROM starting at address&nbsp;<tt>0x1000</tt>,
where execution starts.  The amount of RAM is
user-configurable, but always starts at address&nbsp;<tt>0x80000000</tt>.
Finally, a number of additional physical memory ranges can
be set aside for flash-memory devices.  These will typically
be preloaded with file-system images, but can also hold raw
data.

The current board maps two non-memory devices to the physical address space:

* The Core Local Interruptor (or CLINT) controls the timer interrupt.
The active addresses are&nbsp;<tt>0x0200bff8</tt>&nbsp;(<tt>mtime</tt>) and&nbsp;<tt>0x02004000</tt>&nbsp;(<tt>mtimecmp</tt>). The CLINT issues a hardware interrupt whenever&nbsp;<tt>mtime</tt> equals&nbsp;<tt>mtimecmp</tt>.
Since Cartesi Machines must ensure reproducibility, the processor's clock and the timer are locked by a constant frequency divisor of&nbsp;<tt>100</tt>.
In other words, <tt>mtime</tt> is incremented once for every 100 increments of&nbsp;<tt>mcycle</tt>.
There is no notion of wall-clock time.
* The Host-Target Interface (HTIF) mediates communication with the external world.
Its active addresses are&nbsp;<tt>0x40000000</tt> (<tt>tohost</tt>) and <tt>0x40000008</tt> (<tt>fromhost</tt>).
The format of CSRs <tt>tohost</tt> and <tt>fromhost</tt> are as follows: <p></p>
<center>
<table>
<tr>
  <th> Bits </th>
  <td><tt>63&ndash;56</tt></td>
  <td><tt>55&ndash;48</tt></td>
  <td><tt>47&ndash;0</tt></td>
</tr>
<tr>
  <th> Field </th>
  <td><tt>DEV</tt></td>
  <td><tt>CMD</tt></td>
  <td><tt>DATA</tt></td>
</tr>
</table>
</center>
Interactions with Cartesi's HTIF device follow the following protocol:
<ol>
<li> start by writing 0 to <tt>fromhost</tt>; </li>
<li> write the <i>request</i> to <tt>tohost</tt>; </li>
<li> read the <i>response</i> from <tt>fromhost</tt>. </li>
</ol>
Cartesi's HTIF supports 3 subdevices:
<ul>
  <li>Halt (<tt>DEV</tt>=0) &mdash; To halt the machine, request <tt>CMD</tt>=0, and <tt>DATA</tt> containing bit 0 set to&nbsp;1.
(Bits 47&ndash;1 can be set to an arbitrary exit code.) This will permanently set bit <tt>H</tt> in <tt>iflags</tt> and return control back to the host. </li>
  <li>Console (<tt>DEV</tt>=1) &mdash; To output a character <tt>ch</tt> to console, request <tt>CMD</tt>=1, with <tt>DATA</tt>=<tt>ch</tt>. To input a  character from console (in interactive sessions), request <tt>CMD</tt>=0, <tt>DATA</tt>=0, then read response <tt>CMD</tt>=0, <tt>DATA</tt>=ch+1. (<tt>DATA</tt>=0 means no character was available; </li>
  <li>Yield (<tt>DEV</tt>=2) &mdash; This is a
Cartesi-specific subdevice. To yield control back
to the host and report progress <tt>permil</tt>, request <tt>CMD</tt>=0 and <tt>DATA</tt>=<tt>permil</tt>. This will set bit <tt>Y</tt> in <tt>iflags</tt> until the emulator is resumed. </li>
</ul>


The physical memory mapping is described by Physical Memory Attribute records (PMAs) that start at address <tt>0x00000800</tt> (the <i>board shadow</i>) .
Each PMA consists of 2 64-bit words.
The first word gives the start of a range and the second word its length.
Since the ranges must be aligned to 4KiB page boundaries,
the lowest 12-bits of each word are available for attributes.
The meaning of each attribute field is as follows:
<center>
<table>
<tr>
  <th> Bits </th>
  <td><tt>63&ndash;12</tt></td>
  <td><tt>11&ndash;8</tt></td>
  <td><tt>7</tt></td>
  <td><tt>6</tt></td>
  <td><tt>5</tt></td>
  <td><tt>4</tt></td>
  <td><tt>3</tt></td>
  <td><tt>2</tt></td>
  <td><tt>1</tt></td>
  <td><tt>0</tt></td>
</tr>
<tr>
  <th> Field </th>
  <td><tt>start</tt></td>
  <td><tt>DID</tt></td>
  <td><tt>IW</tt></td>
  <td><tt>IR</tt></td>
  <td><tt>X</tt></td>
  <td><tt>W</tt></td>
  <td><tt>R</tt></td>
  <td><tt>E</tt></td>
  <td><tt>IO</tt></td>
  <td><tt>M</tt></td>
</tr>
<tr> <td colspan="11"> </td> </tr>
<tr>
  <th> Bits </th>
  <td><tt>63&ndash;12</tt></td>
  <td colspan="9"><tt>11&ndash;0</tt></td>
</tr>
<tr>
  <th> Field </th>
  <td><tt>length</tt></td>
  <td colspan="9"><i>Reserved (=0)</i></td>
</tr>
</table>
</center>

The <tt>M</tt>, <tt>IO</tt>, and <tt>E</tt> bits are mutually exclusive, and respectively mark the range as memory, I/O mapped, or excluded.
Bits <tt>R</tt>, <tt>W</tt>, and&nbsp;<tt>X</tt> mark read, write, and execute permissions, respectively.
The <tt>IR</tt> and&nbsp;<tt>IW</tt> bits mark the range as idempotent for reads and writes, respectively.
Finally, the <tt>DID</tt> gives the device id
(0 for memory ranges, 1 for the shadows, 2 for a flash drive, 3 for CLINT, and 3 for HTIF).

The list of PMA records ends with an invalid PMA entry for
which <tt>length</tt>=0.

### The Linux setup

Setting up a Linux system from scratch involves a variety of steps.
Unlike stand-alone systems, embedded systems are not usually self-hosting.
Instead, components are built in a separate host system, on which a cross-compiling toolchain for the target architecture has been installed.
The key components are the GNU Compiler Collection and the GNU C Library.
Support for RISC-V is upstream in the official [GCC compiler collection](https://gcc.gnu.org/).
The Emulator SDK includes a Docker image with the [toolchain](machine/toolchain.md) pre-installed.
The toolchain is used to cross-compile the ROM image, the
RAM image, and the root file-system.

Before control reaches the RAM image (and ultimately the Linux kernel), a small program residing in ROM builds a [<i>devicetree</i>](http://devicetree.org/) describing the hardware.
To do so, it goes over the PMA entries identifying the devices and their locations in the physical address space.
It also looks for a null-terminated string containing the command-line for the Linux kernel starting at the last 4k of the ROM region.
Once the devicetree is ready, the ROM program sets register&nbsp;<tt>x10</tt> to 0 (the value of&nbsp;<tt>mhartid</tt>), <tt>x11</tt> to point to the devicetree, and then jumps to RAM-base at&nbsp;<tt>0x80000000</tt>.
This is where the entry point of the RAM image is expected to reside.
The Emulator SDK includes a repository that uses toolchain to build the [ROM image](machine/ROM.md).

Linux support for RISC-V is upstream in the [Linux kernel archives](https://www.kernel.org/).
The kernel runs in supervisor mode, on top of a Supervisor Binary Interface (SBI) provided by a machine-mode shim: the Berkeley Boot Loader (BBL).
BBL can be found in the [RISC-V Proxy Kernel repository](https://github.com/riscv/riscv-pk).
The BBL is linked against the Linux kernel and this resulting RAM image is preloaded into RAM.
The SBI provides a simple interface through which the kernel interacts with CLINT and HTIF.
Besides implementing the SBI, the BBL also installs a trap that catches invalid instruction exceptions.
This mechanism can be used, for example, to emulate floating-point instructions, although it is more efficient to setup the target toolchain to replace floating point instructions with calls to a soft-float implementation instead.
After installing the trap, BBL switches to supervisor mode and cedes control to the kernel entry point.
The Emulator SDK includes a Docker image that automates the building of a RAM image with the [Linux kernel](machine/kernel.md).

The final step is the creation of a root file-system.
This process starts with a skeleton directory in the host system containing a few subdirectories (<tt>sbin</tt>, <tt>lib</tt>, <tt>var</tt>, etc) and text files (<tt>sbin/init</tt>, <tt>etc/fstab</tt>, <tt>etc/passwd</tt> etc).
Tiny versions of many common UNIX utilities (<tt>ls</tt>, <tt>cd</tt>, <tt>rm</tt>, etc) can be combined into a single binary using [BusyBox](https://busybox.net/).
Target executables often depend on shared libraries provided by the toolchain (<tt>lib/libm.so</tt>, <tt>lib/ld.so</tt>, and <tt>lib/libc.so</tt>).
Naturally, these libraries must be copied to the root file-system.
Once the root directory is ready, it is copied into an actual file-system image (e.g., using <tt>gene2fs</tt>).
This process can be automated with tool for creating
embedded Linux distributions, such as
[Buildroot](https://buildroot.org/), which enables developers to customize the root file-system according to the needs of their applications.
Thousands of packages are available for installation.
The Emulator SDK includes a Docker image that automates the building of a [root file-system](machine/rootfs.md) using Buildroot.

The root file-system image is installed as a flash drive.
Additional flash devices can be used to store the inputs to the computation, or to receive its outputs.
The devicetree created by the ROM program is used to inform Linux of the location of each flash device, the amount of RAM, and any kernel boot parameters.
Here is an excerpt: <a name="devicetree"> </a>

```
memory@80000000 {
  device_type = "memory";
  reg = <0x0 0x80000000 0x0 0x8000000>;
};

flash@8000000000 {
  #address-cells = <0x2>;
  #size-cells = <0x2>;
  compatible = "mtd-ram";
  bank-width = <0x4>;
  reg = <0x80 0x0 0x0 0x4000000>;
  linux,mtd-name = "flash.0";
};

chosen {
  bootargs = "console=hvc0 rootfstype=ext2 root=/dev/mtdblock0 rw mtdparts=flash.0:-(root)";
};
```

The first section specifies 128MiB of RAM starting at the 2GiB boundary.
The middle section adds a 64MiB flash device, starting at the 512GiB boundary.
The &ldquo;<tt>mtd-ram</tt>&rdquo; driver exposes the device as <tt>/dev/mtdblock0</tt> under Linux's virtual file-system.
The last section, giving the kernel parameters&nbsp;<tt>bootargs</tt>, specifies the device to be mounted as root and the associated partition label.

After completing its own initialization, the kernel eventually cedes control to&nbsp;<tt>/sbin/init</tt>.
The root file-system provided by the Cartesi Emulator SDK includes a simple init script that mounts the flash drives that contain valid file-systems and either drops into a shell (when in interactive mode) or executes a custom DApp script.
The kernel passes to <tt>/sbin/init</tt> as command-line parameters all arguments after the separator&nbsp;<tt>--</tt>&nbsp;in <tt>bootargs</tt>.
Cartesi's init script checks if the first argument executable and, if so, assumes this is the custom DApp script.
It executes this script, passing the additional parameters unchanged.
The custom DApp script typically invokes the appropriate sequence of commands for performing the desired computation.
Upon completion, <tt>/sbin/init</tt> halts the machine.
The DApp script can alternatively use HTIF to halt the machine with an optional exit code that can be used as part of the computation output.
Arbitrarily complex inputs, parameters, and outputs can be passed as flash devices.



####


> TODO: Diagram would be nice here



















