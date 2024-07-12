---
id: building-the-application
title: Building the application
---

“Building” in this context compiles your application into RISC-V architecture and consequently builds a Cartesi machine containing your application. This architecture enables computation done by your application to be reproducible and verifiable.

With the Docker engine running, change the directory to your application and build by running:

```shell
cartesi build
```

The successful execution of this step will log this in your terminal:

```shell
         .
        / \
      /    \
\---/---\  /----\
 \       X       \
  \----/  \---/---\
       \    / CARTESI
        \ /   MACHINE
         '

[INFO  rollup_http_server] starting http dispatcher service...
[INFO  rollup_http_server::http_service] starting http dispatcher http service!
[INFO  actix_server::builder] starting 1 workers
[INFO  actix_server::server] Actix runtime found; starting in Actix runtime
[INFO  rollup_http_server::dapp_process] starting dapp
INFO:__main__:HTTP rollup_server url is http://127.0.0.1:5004
INFO:__main__:Sending finish

Manual yield rx-accepted (0x100000000 data)
Cycles: 2767791744
2767791744: b740d27cf75b6cb10b1ab18ebd96be445ca8011143d94d8573221342108822f5
Storing machine: please wait
Successfully copied 288MB to /Users/michaelasiedu/Code/calculator/python/.cartesi/image
```

## Custom Configuration

The build process of an application is customizable by providing a configuration file called `cartesi.toml` located at the working directory. An alternative file can also be specified with the `--config` build option.

If no file is defined the implicit default configuration is as follows:

```toml
[drives.root]
builder = "docker"
dockerfile = "Dockerfile"
format = "ext2"
```

This defines a single drive called `root`, using the `docker` builder. The `docker` builder uses Docker to build a drive by executing `docker buildx build` with the `Dockerfile`, and then creating an `ext2` drive from the Docker image contents.

## Drives

A Cartesi machine is compose by a set of drives. Each drive is defined by a name and a builder. The builder is responsible for creating the drive contents. The `root` drive is the only required one.

The following builders are available: `directory`, `docker`, `empty`, `none`, `tar`.

## The `docker` builder

The `docker` builder is the most common builder and is used to build drives from Docker images.

```toml
[drives.root]
builder = "docker"
dockerfile = "Dockerfile"
format = "ext2"
extraSize = "100Mb"
```

The configuration above builds a Docker image using the specified `dockerfile`, and then creates an `ext2` drive with the image contents.

The `extraSize` attribute adds extra free space to the drive in additional to the size of the image. It can be specified as a number in bytes or as a string with a number followed by a unit (e.g. `100Mb`). Supported units and abbreviations are as follows and are case-insensitive:

- `b` for bytes
- `kb` for kilobytes
- `mb` for megabytes
- `gb` for gigabytes
- `tb` for terabytes
- `pb` for petabytes

The `format` attribute specifies the drive format and can be `ext2` or `sqfs`. SquashFS drives are compressed and read-only.

Instead of building a Docker image it's also possible to use a pre-existing Docker image (or a manually built image) by specifying a `image` attribute with the image name or ID. This way the user can use Docker directly to build, and all its features like tagging, multi-stage builds, etc, and then use `cartesi build` to create the Cartesi machine.

## The `directory` builder

The `directory` builder creates a drive with the contents of a directory.

```toml
[drives.data]
builder = "directory"
directory = "./data"
extraSize = "100Mb"
format = "ext2"
```

The `directory` is the only required attribute and specifies the path of the drive contents.
The `extraSize` attribute adds extra free space to the drive in additional to the size of the contents. It can be specified as a number in bytes or as a string with a number followed by a unit (e.g. `100Mb`). Supported units and abbreviations are the same as for the `extraSize` attribute of the `docker` builder.

## The `empty` builder

The `empty` builder creates an empty drive with a specific size. This is generally used to create drives that will hold application data, separate from other drives that hold the application itself or system files.

```toml
[drives.data]
builder = "empty"
size = "100Mb"
```

The only required attribute is `size`, which specifies the drive size. It can be specified as a number in bytes or as a string with a number followed by a unit (e.g. `100Mb`). Supported units and abbreviations are the same as for the `extraSize` attribute of the `directory` builder.

## The `none` builder

The `none` builder is a no-op builder, meaning that it defines a drive with a pre-existing image, built externally.

```toml
[drives.root]
builder = "none"
filename = "./rootfs-tools-v0.15.0.ext2"
```

The only required attribute is `filename` which specifies the path of the drive image. The format of the drive is inferred from the file extension.

## The `tar` builder

This builder is very similar to the `directory` builder, except that it creates a drive from a tarball file.

```toml
[drives.data]
builder = "tar"
filename = "build/files.tar"
```

Instead of specifying a `directory` attribute, the `tar` builder requires a `filename` attribute with the path of the tarball file. The `format` and `extraSize` are also supported.

## Cartesi Machine

The configuration file also allows modifying the Cartesi machine booting procedure. The following attribute are available:

```toml
[machine]
assert_rolling_update = true
bootargs = ["no4lvl", "quiet", "earlycon=sbi", "console=hvc0", "rootfstype=ext2", "root=/dev/pmem0", "rw", "init=/usr/sbin/cartesi-init"]
entrypoint = "/usr/local/bin/app"
max-mcycle = 0
no-rollup = false
ram-image = "/usr/share/cartesi-machine/images/linux.bin" # directory inside SDK image
ram-length = "128Mi"
```

The above example changes the default behavior of the boot to not run any cycles by specifying `max-mcycle = 0`.
The semantics of each attribute can be found in the [Cartesi Machine documentation](https://docs.cartesi.io/cartesi-machine/host/cmdline/).
