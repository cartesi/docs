---
title: Custom root file-system
---

:::note Section Goal

- learn how to build a customized root file-system for the Cartesi Machine that incorporates resources of interest
- create a root file-system including the Python3 interpreter and the PyJWT library
  :::

## Introduction

As explained before, Cartesi Compute off-chain processing is performed by a [Cartesi Machine](/machine/), which is capable of running a Linux operating system and executing arbitrary computations in a verifiable and reproducible way. Up to this point, the machines we have built have always used the default Linux kernel and root file-system provided by Cartesi, which is more than sufficient for executing a wide variety of tasks. Indeed, several common Linux tools are already included in this distribution, such as the `bc` calculator tool used in the [previous tutorial](../calculator/create-project.md) or the `sh` command interpreter. Even a Lua interpreter is already included in the package.

Nevertheless, in real-world scenarios it is expected that specific tools and libraries will be required, and in such cases we will need to use a mechanism to _include_ those additional resources in the Cartesi Machine.

In this tutorial, we will explore how to create and use a _custom root file-system_, which in our case will include the Python3 interpreter along with the [PyJWT](https://pyjwt.readthedocs.io/en/stable/) library for encoding and decoding JWT tokens.

## Building a custom root file-system

Essentially, our goal is to create an `ext2` file with the customized full root file-system, including our specific additional libraries and tools. Later on, when building the Cartesi Machine, we will be able to refer to that file so that our machine has access to all the desired resources.

The process of building a custom root file-system is fully documented in the [Cartesi Machine target perspective section](/machine/target/linux#the-root-file-system). However, we can speed things up by taking advantage of the default `cartesi/rootfs` Docker image provided by Cartesi, and building on top of it.

First of all, let's switch to the `cartesi-machine` subdirectory:

```bash
cd cartesi-machine
```

Then, pull the `cartesi/rootfs` Docker image and tag it as `cartesi/rootfs:devel`:

```bash
docker pull cartesi/rootfs:0.14.0
docker tag cartesi/rootfs:0.14.0 cartesi/rootfs:devel
```

After that, clone Cartesi's [machine-emulator-sdk](https://github.com/cartesi/machine-emulator-sdk) repository along with its submodules:

```bash
git clone --branch v0.12.0 --recurse-submodules --depth 1 https://github.com/cartesi/machine-emulator-sdk.git
```

After the repository and submodules are downloaded, switch to the `machine-emulator-sdk/fs` subdirectory and start up the configuration tool to select the desired packages using a textual menu interface:

```bash
cd machine-emulator-sdk/fs
make config
```

For this project, select `Target packages` and then `Interpreter languages and scripting`. Select the `python3` entry, then navigate into `External python modules` and select `python-pyjwt`.

After that, simply exit the configuration interface and answer `y` when prompted to build the root file-system. This process may take some minutes to complete, after which a file called `rootfs.ext2` will be generated.

Finally, move the generated root file-system file back to our project's `cartesi-machine` directory:

```bash
mv rootfs.ext2 ../../rootfs-python-jwt.ext2
cd ../..
```

And as such we have created our own customized root file-system, and can now focus on using it to build our Cartesi Machine, as discussed in the next section.
