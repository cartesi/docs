# Cartesi Machine Image RootFS 

The Cartesi Image RootFS is the repository that provides the Docker configuration files to build the `rootfs.ext2` testing filesystem. This is used to run a Linux environment on the Cartesi Machine Emulator reference implementation. The current image is based on the `cartesi/image-toolchain` that uses Ubuntu 18.04 and GNU GCC 8.3.0. The `rootfs.ext2` is built with Buildroot 2019.05.1 targeting the RISC-V RV64IMA with ABI LP64 architecture.

## Getting Started

### Requirements

- Docker 18.x
- GNU Make >= 3.81

### Build

```bash
$ make build
```

If you want to tag the image with custom name you can do the following:

```bash
$ make build TAG=mytag
```

To remove the generated images from your system, please refer to the Docker documentation.

#### Makefile targets

The following options are available as `make` targets:

- **build**: builds the docker image-rootfs image
- **copy**: builds the imgae-rootfs image and copy it's artifact to the host 
- **run**: runs the generated image with current user UID and GID
- **run-as-root**: runs the generated image as root
- **push**: pushes the image to the registry repository

#### Makefile container options

You can pass the following variables to the make target if you wish to use different docker image tags.

- TAG: image-roofs image tag
- TOOLCHAIN\_TAG: image-toolchain image tag

```
$ make build TAG=mytag
$ make build TOOLCHAIN_TAG=mytag
```

It's also useful if you want to use pre-built images:

```
$ make run TAG=latest
```

## Usage

The purpose of this image is to build the `rootfs.ext2` artifact so it can be used with the emulator. For instructions on how to do that, please see the emulator documentation.

If you want to play around on the environment you can also do:

```
$ make run
```

## Contributing

Pull requests are welcome. When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Authors

* *Diego Nehab*
* *Victor Fusco*

## License

- TODO
