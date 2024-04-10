---
title: Machines off-chain
tags: [maintain, sdk, off-chain, api, low-level developer]
---

Although an extensive documentation of Cartesi Machines can be found [here](../cartesi-machine/index.md), one may choose to skip this reading and jump right away to their usage inside the blockchain through Cartesi Compute. For that, it is enough to regard a Cartesi Machine as a black box that executes computations.

A useful analogy is to regard them as virtual machines like those managed by virtualization solutions (e.g. VMWare, QEMU or VirtualBox). These VM's can boot and execute full-fledged architectures, handling complex operating systems as simple blackboxes. Moreover, these virtual machines can be completely specified through a single file, using formats such as `.vdi` or `.img` for example. A simple example of running such machines is given by:

```
qemu linux-0.2.img
```

where the `linux-0.2.img` file contains all the information describing this machine and how to run it. It also contains the Linux kernel itself and several utilities that were considered useful when building the machine.

Contrary to the QEMU example above, Cartesi Machines are not intended to be interactive. Instead, they are supposed to boot, bring up the operating system, execute some predefined software and then halt. Therefore, instead of jumping to a bash session, running a Cartesi Machine often produces no visual representation of the computation result. At this point, one might ask what is the purpose of running a Cartesi Machine, if it normally produces no useful visual effect. Or, in other words, where the results of such execution are stored. This is the point where the concept of input/output drives comes into play.

The specification folder of a Cartesi Machine includes metadata which describes its input and output drives. There could be none or many inputs, but always a single output drive. Thus, when executed, the software contained inside the Cartesi Machine is free to read the contents of the input drives and write to the output using the typical interface offered by the operating system. See [here](../cartesi-machine/host/cmdline.md#cartesi-machine-templates) an example of a Cartesi Machine that reads a mathematical expression from an input drive, evaluates it, and writes the result to the output drive.

In this sense, a Cartesi Machine is very similar to a programming language function, receiving several arguments in the form of input drives and returning a single output. Although this black-box analogy is a very simplified picture of what Cartesi Machines are, this basic understanding is sufficient for the purposes of running Cartesi Compute.
