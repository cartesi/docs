---
title: Linux Kernel
---

:::note Section Goal
- TODO
:::

The Cartesi Image Kernel is the repository that provides the Docker configuration files to build the `kernel.bin` testing Linux kernel. This is used to run a Linux environment on the Cartesi Machine Emulator reference implementation. The current image is based on the `cartesi/image-toolchain` that uses Ubuntu 18.04 and GNU GCC 8.3.0. The `kernel.bin` is built from the Linux 4.20.x source, targeting the RISC-V RV64IMA with ABI LP64 architecture.

