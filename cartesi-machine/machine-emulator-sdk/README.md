# Cartesi Machine Emulator SDK 

The Cartesi Machine Emulator SDK repository provides a structured way to build the off-chain emulator binaries. The current version builds:

- The RISC-V GNU GCC toolchain 
- The Cartesi Machine Emulator
- The Cartesi Machine Emulator ROM
- The Emulator Tests
- The testing root filesystem
- The testing Linux kernel

For documentation on each of this artifacts please see their own repositories.

## Getting Started

### Requirements

- Docker 18.x
- C/C++ Compiler with support for C++17 (tested with GCC >= 8+).
- GNU Make >= 3.81

### Build

```bash
$ make submodules
$ make toolchain
$ make emulator rom tests
```

If you want to build the root filesystem and the linux kernel you can type:


```bash
$ make fs
$ make kernel
```

Cleaning:

```bash
$ make clean 
or
$ make distclean 
```

#### Makefile targets

The following options are available to initialize and build the software artifacts:

- **submodules**: initialize and update git submodules
- **toolchain**: builds the RISC-V gnu toolchain docker image
- **emulator**: builds the emulator
- **rom**: builds the ROM that is needed by the emulator (requires toolchain)
- **tests**: builds the tests binaries (requires toolchain)
- **fs**: builds the rootfs.ext2 image (requires toolchain)
- **kernel**: builds the kernel image (requires toolchain)

If you want to use the linux environments you can also use the following targets:

- **toolchain-env**: enters the docker image-toolchain environment
- **fs-env**: enters the docker image-toolchain environment
- **kernel-env**: enters the docker image-toolchain environment

#### Makefile container options

You can pass the following variables to the make target if you wish to use different docker image tags.

- TOOLCHAIN\_TAG: image-toolchain image tag
- FS\_TAG: image-rootfs image tag
- KERNEL\_TAG: image-kernel image tag

```
$ make toolchain TOOLCHAIN_TAG=mytag
$ make fs TOOLCHAIN_TAG=mytag FS_TAG=mytag
$ make kernel TOOLCHAIN_TAG=mytag KERNEL_TAG=mytag
```

It's also useful if you want to use pre-built images:

```
$ make rom TOOLCHAIN_TAG=latest
$ make tests TOOLCHAIN_TAG=latest
```

Or run an specific version

```
$ make toolchain-env TOOLCHAIN_TAG=0.1.1

```

OBS: Outside tagged commits the default tag is `devel`, which means you have to build the images on your machine.

## Usage

TODO

## Contributing

Pull requests are welcome. When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Authors

* *Diego Nehab*
* *Victor Fusco*

## License

- TODO
