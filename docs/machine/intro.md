---
title: Introduction
---

The Cartesi Machine is Cartesi's solution for verifiable computation.
It was designed to bring mainstream scalability to DApps and mainstream productivity to DApp developers.

## Scalability

DApps running exclusively on smart contracts face severe constraints on the amount of data they can manipulate and on the complexity of computations they can perform.
These limitations manifest themselves as exorbitant transaction costs and, even if such costs could somehow be overcome, as extremely long computation times.

In comparison, DApps running inside Cartesi Machines can process virtually unlimited amounts of data, and at a pace over 4 orders of magnitude faster.
This is possible because Cartesi Machines run off-chain, free of the overhead imposed by the consensus mechanisms used by blockchains.

In a typical scenario, one of the parties involved in a DApp will execute the Cartesi Machine off-chain and report its results to the blockchain.
Different parties do not need to trust each other because the Cartesi platform includes an automatic dispute mechanism for Cartesi Machines.
All interested parties repeat the computation off-chain and, if their results do not agree, they enter into a dispute, which the mechanism guarantees to be always won by an honest party against any dishonest party.

To enable this dispute mechanism, Cartesi Machines are executed inside a special emulator that has three unique properties:

* Cartesi Machines are *self contained* &mdash; They run in isolation from any external influence on the computation;
* Cartesi Machines are *reproducible* &mdash; Two parties performing the same computation always obtain exactly the same results;
* Cartesi Machines are *transparent* &mdash; They expose their entire state for external inspection.

From the point of view of the blockchain, the disputes require only a tiny fraction of the amount of computation performed by the Cartesi Machine.
Dispute resolution thus becomes an ordinary task and dishonest parties are generally expected to be exposed, which discourages the posting of incorrect results and further increases the efficiency of the platform.

Cartesi Machines allow DApps to take advantage of vastly increased computing capabilities off-chain, while enjoying the same security guarantees offered by code that runs natively as smart contracts.
This is what Cartesi means by scalability.

## Productivity

Scalability is not the only impediment to widespread blockchain adoption.
Another serious limiting factor is the reduced developer productivity.

Modern software development involves the combination of dozens of off-the-shelf software components.
Creating these components took the concerted effort of an active worldwide community over the course of several decades.
They have all been developed and tested using well-established toolchains (programming languages, compilers, linkers, profilers, debuggers, etc.), and rely on multiple services provided by modern operating systems (memory management, multi-tasking, file systems, networking, etc.).

Smart contracts are developed using ad-hoc toolchains, and run directly on top of custom virtual machines, without the support of an underlying operating system.
This arrangement deprives developers of the tools of their trade, severely reduces the expressive power at their disposal, and consequently decimates their productivity.

In contrast, Cartesi Machines are based on a proven platform: [RISC-V](https://riscv.org/).
RISC-V was born of research in academia at UC Berkeley.
It is now maintained by its own independent foundation.
Unlike many of its academic counterparts, it is important to keep in mind that RISC-V is not a toy architecture.
It is suitable for direct native hardware implementation, which is indeed currently commercialized by SiFive Inc.
This means that, in the future, Cartesi will not be limited to emulation or binary translation off-chain.
The RISC-V platform is supported by a vibrant community of developers.
Their efforts have produced an extensive software infrastructure, most notably ports of the Linux Operating System and the GNU toolchain.

By moving most of their DApp logic to run inside Cartesi Machines, but on top of the Linux Operating System, developers are isolated not only from the limitations and idiosyncrasies of specific blockchains, but also from irrelevant details of the Cartesi Machine architecture itself.
They regain access to all the tools they have come to rely on when writing applications.

This is Cartesi's contribution to empowering DApp developers to express their creativity unimpeded, and to boost their productivity.

## Documentation

Cartesi Machines can be seen from 3 different perspectives:

* *The host perspective* &mdash;
This is the environment right outside the Cartesi Machine emulator.
It is most relevant to developers setting up Cartesi Machines, running them, or manipulating their contents.
It includes the emulator's API in all its flavors: C++, Lua, gRPC, and the command-line interface;
* *The target perspective * &mdash;
This is the environment inside the Cartesi Machine.
It encompasses Cartesi's particular flavor of the RISC-V architecture, as well as the organization of the embedded Linux Operating System that runs on top of it.
It is most relevant to programmers responsible for the DApp components that run off-chain but must be verifiable.
The cross-compiling toolchain, and the tools used to build the Linux kernel and the embedded Linux root file-systems are also important from this perpective, even though they are used in the host;
* *The blockchain perspective* &mdash;
This is the view smart contracts have of Cartesi Machines.
It consists almost exclusively of the manipulation of cryptographic hashes of the state of Cartesi Machines and parts thereof.
In particular, using only hash operations, the blockchain can verify assertions concerning the contents of the state, and can obtain the state hash that results from modifications to the state.

As with every computer, the level of knowledge required to interact with Cartesi Machines depends on the nature of the application being created.
Simple applications will require target developers to code a few scripts invoking pre-installed software components, require host developers to simply fill out a configuration file specifying the location of the components needed to build a Cartesi Machine, and require blockchain developers to simply instantiate one of the high-level contracts provided by Cartesi.
At the other extreme are the developers working inside Cartesi, who regularly write, build, and deploy custom software components to run in the target, or even change the Linux kernel. Additionally, these developers programatically control the creation and execution of Cartesi Machines in the host, and must also understand and use the hash-based state manipulation primitives used in the blockchain.

Although Cartesi's goal is to shield platform users from as much complexity as possible, there is value in making information available to the greatest feasible extent. To that end, this documentation of Cartesi Machines aims to provide enough information to cover all 3 perspectives, at all depths of understanding.

