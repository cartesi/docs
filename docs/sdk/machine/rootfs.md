---
title: Root file-system
---

:::note Section Goal
- TODO
:::

The Cartesi Image RootFS is the repository that provides the Docker configuration files to build the `rootfs.ext2` testing filesystem. This is used to run a Linux environment on the Cartesi Machine Emulator reference implementation. The current image is based on the `cartesi/image-toolchain` that uses Ubuntu 18.04 and GNU GCC 8.3.0. The `rootfs.ext2` is built with Buildroot 2019.05.1 targeting the RISC-V RV64IMA with ABI LP64 architecture.

