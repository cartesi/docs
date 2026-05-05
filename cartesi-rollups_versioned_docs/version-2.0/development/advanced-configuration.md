---
id: Advanced-configuration
title: Advanced configuration
resources:
---

When you build an application with the Cartesi CLI, the CLI needs to know how to set up your Cartesi Machine. Things like how much memory to allocate, what code to run, and what data to include. All of these choices live in a single file at the root of your project called `cartesi.toml`.

If you have worked with configuration files like `docker-compose.yml` or `Cargo.toml`, the idea is the same. You describe what you want, and the CLI takes care of the rest.

The `cartesi.toml` file is written in [TOML](https://toml.io), a minimal and readable configuration format. You do not need to be a TOML expert to use it. If you can read key value pairs, you are good to go.

Here is what the file controls at a high level:

- **SDK version**: Which version of the Cartesi SDK to use when building your machine.
- **Machine settings**: How the machine boots, how much RAM it has, what program it runs, and how it behaves.
- **Drives**: The file systems attached to your machine, including your application code and any additional data.

It is important to note that `cartesi.toml` is only read when you run `cartesi build` or `cartesi shell`. By default, the CLI looks for a `cartesi.toml` in the project root, unless you point it to a different path using the `-c` or `--config` flag with a relative path to the configuration file. If no config file is found, the CLI applies sensible defaults, most of which are covered in the sections below. The default Cartesi templates do not include a `cartesi.toml` in the project root hence you manually create a configuration file when you have an explicit need for it.

## Getting Started with Minimal Configuration

You do not need to fill out every field to get started. In fact, the simplest `cartesi.toml` file can be completely empty, or even absent altogether. The CLI will apply defaults for everything.

Here is what the defaults look like behind the scenes:

```toml
sdk = "cartesi/sdk:<version>"

[machine]
ram_length = "128Mi"
use_docker_env = true
use_docker_workdir = true

[drives.root]
builder = "docker"
dockerfile = "Dockerfile"
format = "ext2"
```

This means that by default, the CLI will:

1. Use SDK version specified i.e `0.12.0`.
2. Give your machine 128 megabytes of RAM.
3. Build your root drive from a `Dockerfile` in your project directory.
4. Pull environment variables and the working directory from that Docker image.
5. Enable rollup mode so your app can process inputs from the blockchain.

If those defaults work for you, all you need is a `Dockerfile` and you are ready to build. As your project grows, you can override any of these values by adding them to your `cartesi.toml`.

## SDK Version

```toml
sdk = "cartesi/<version>"
```

The `sdk` field tells the CLI which version of the Cartesi SDK image to use when building your machine. This is a docker image containing the Linux kernel, the RISC‑V toolchain, Cartesi Node and everything else needed to assemble your Cartesi Machine.

Think of it as pinning a version of your build environment. If you are working on a team, setting this explicitly ensures everyone builds with the same SDK, avoiding the classic "it works on my machine" problem. Each SDK is tied to a Cartesi CLI version, hence it's important you have a compatible CLI installed for the sdk version you specify. When you omit the SDK field the CLI uses its own built in default version.

**When to change this:** When there's a new SDK version and you want to adopt it, or when you need to stay on a specific version for compatibility.

## Machine Configuration

The `[machine]` section controls how your Cartesi Machine is set up and how it behaves at runtime. This is where you configure the virtual computer that runs your application.

```toml
[machine]
```

### Entrypoint

```toml
entrypoint = "/usr/local/bin/python3 /mnt/app/main.py"
```

The `entrypoint` tells the machine which program to run when it starts up. This is the path to your application binary inside the machine's file system.

If you are building your root drive from a Docker image (which is the default), you may not need to set this at all. The CLI can pick up the entrypoint from your Dockerfile's `ENTRYPOINT` or `CMD` instruction. You would set this explicitly when you want to override whatever the Docker image defines, or when your setup does not use Docker.

### Boot Arguments

```toml
boot_args = ["no4lvl", "quiet", "earlycon=sbi", "console=hvc0", "rootfstype=ext2", "root=/dev/pmem0", "rw", "init=/usr/sbin/cartesi-init"]
```

These are the Linux kernel boot arguments passed to the machine when it starts. They control low level behavior like which console to use, what file system type the root drive is, and where to find the init process.

For most applications, you will never need to touch this. The defaults work well for typical setups. This field exists for advanced use cases where you need fine grained control over the kernel's boot process, such as changing the root file system type or adjusting console output behavior.

Each argument is a string in the array. The order does not matter to the kernel, but keeping them organized helps readability.

### Memory Settings

```toml
ram_length = "128Mi"
ram_image = "/usr/share/cartesi-machine/images/linux.bin"
```

**`ram_length`** sets how much RAM your Cartesi Machine has. The default is `128Mi` (128 mebibytes). You can use human readable sizes like `"64Mi"`, `"256Mi"`, or `"1Gi"`.

Exact RAM requirements are unique for each application. A lightweight app that processes small inputs might be fine with 64Mi. A machine learning model or an application that handles large data structures might need 256Mi or more. It's important to stress test your application during development and testing to figure out an optimal RAM configuration for your application.

**`ram_image`** specifies the path to the Linux kernel binary used inside the machine. This path points to a location inside the SDK image, not on your local file system. You almost never need to change this unless you are working with a custom kernel.

### Execution Limits

```toml
max_mcycle = 2305843009213693952
```

The `max_mcycle` field sets the maximum number of machine cycles the Cartesi Machine is allowed to execute. This acts as a computational budget. Once the machine reaches this limit, it stops.

A value of `2305843009213693952` is the default machine cycle the Cartesi machine operates. Setting a specific number is useful when you want to guarantee that computation stays within a certain bound, which can be important for on chain verification where predictable execution costs matter.

### Rollup Behavior

```toml
assert_rolling_update = true
```

Set this to `true` when you are building a standalone application that does not need to interact with the blockchain's input/output system. This is useful during early development or for tools that run inside the machine but do not need the rollup lifecycle.

**`assert_rolling_update`** is related to rolling template assertions. When set to `true`, the CLI will verify that your machine is compatible with rolling updates. This is important for production deployments where you want to ensure your application can be updated without breaking the existing state.

### Docker Integration

```toml
use_docker_env = true
use_docker_workdir = true
user = "dapp"
```

These fields control how the CLI uses information from your Docker image when building the machine.

**`use_docker_env`** (default: `true`) tells the CLI to inject the environment variables defined in your Docker image (via `ENV` instructions) into the Cartesi Machine. This means if your Dockerfile sets `ENV APP_MODE=production`, that variable will be available to your application inside the machine.

**`use_docker_workdir`** (default: `true`) tells the CLI to use the `WORKDIR` from your Docker image as the working directory inside the machine. This keeps your Docker and Cartesi environments consistent.

**`user`** sets the user that your application runs as inside the machine. The default value `"dapp"` is a non root user, which is a good security practice. You can change this if your application needs to run as a different user.

### Final Hash

```toml
final_hash = true
```

When `final_hash` is set to `true`, the CLI computes a hash of the machine after it finishes building. This hash uniquely identifies the exact state of your Cartesi Machine, including all its drives, memory, and configuration.

This is important for on chain verification. The hash is what gets registered on the blockchain, and it allows anyone to verify that the machine running off chain is exactly the same one that was agreed upon. If you are deploying to production, you will want this enabled.

## Drives

Drives are the file systems attached to your Cartesi Machine. Since the machine is a virtual computer, drives are its hard disks. Every machine has at least one drive (the root drive), and you can attach upto 6 different drives.

Each drive has a name and is defined under `[drives.<name>]`. The name is used as an identifier and, by default, determines where the drive is mounted inside the machine at `/mnt/<name>`.

The key decision for each drive is its **builder**, which tells the CLI how to create the drive image. There are five builder types:

| Builder     | What it does                            |
| ----------- | --------------------------------------- |
| `docker`    | Builds the drive from a Dockerfile      |
| `empty`     | Creates a blank drive of a given size   |
| `directory` | Packages a local directory into a drive |
| `tar`       | Creates a drive from a tar archive      |
| `none`      | Uses an existing drive image file as is |

Let's walk through each one.

### The Root Drive

```toml
[drives.root]
builder = "docker"
dockerfile = "Dockerfile"
format = "ext2"
extra_size = "100Mb"
```

The root drive is special. It is the main file system of your Cartesi Machine, the one that contains your operating system, libraries, and application code. It is always named `root`, and if you do not define it in your `cartesi.toml`, the CLI creates one automatically using the Docker builder.

### Docker Builder

```toml
[drives.root]
builder = "docker"
dockerfile = "Dockerfile"
target = "docker-multi-stage-target"
format = "ext2"
extra_size = "100Mb"
```

The Docker builder is the most common and the default for the root drive. It builds a drive image from a Dockerfile, which means you can use all the Docker features you already know: multi stage builds, package managers, `COPY` instructions, and so on.

**`dockerfile`** is the path to your Dockerfile, relative to your project root. Defaults to `"Dockerfile"`.

**`target`** lets you specify a build target in a multi stage Dockerfile. If your Dockerfile has multiple stages (`FROM ... AS builder`, `FROM ... AS runtime`), you can tell the CLI which stage to use for the drive. If you leave this out, the CLI uses the last stage.

**`format`** sets the file system format for the drive image. You have two choices:

- `"ext2"` (default): A standard read/write Linux file system. Use this when your application needs to write to the drive at runtime.
- `"sqfs"` (SquashFS): A compressed, read only file system. Use this when your drive contains static data that will not change. It produces smaller images.

**`extra_size`** adds extra free space to the drive beyond what your files actually need. The value is a string like `"100Mb"` or `"50Mi"`. This is useful when your application creates temporary files or writes logs at runtime and needs room to do so.

### Empty Builder

```toml
[drives.data]
builder = "empty"
size = "100Mb"
mount = "/var/lib/app"
```

The empty builder creates a blank drive with no files on it. This is useful when your application needs a writable space to store data at runtime, like a database, cache, or scratch space.

**`size`** is required and sets the total size of the drive. You can specify it as a string like `"100Mb"` or as a number in bytes.

**`mount`** sets where the drive appears inside the machine's file system. If you omit it, the drive is mounted at `/mnt/<name>`, where `<name>` is whatever you called the drive in your configuration. In this example, the drive would be available at `/var/lib/app`.

### Directory Builder

```toml
[drives.data]
builder = "directory"
directory = "./data"
extra_size = "100Mb"
format = "ext2"
mount = "/var/lib/app_two"
```

The directory builder takes a folder from your local machine and packages it into a drive image. This is a straightforward way to include data files, configuration, or any other content without going through Docker.

**`directory`** is required and points to the local folder you want to package. The path is relative to your project root.

**`extra_size`** adds breathing room beyond the actual size of the directory's contents. Optional, defaults to zero.

**`format`** works the same as with the Docker builder: `"ext2"` for read/write, `"sqfs"` for read only compressed.

**`mount`** sets the mount point inside the machine. Optional, defaults to `/mnt/<name>`.

### Tar Builder

```toml
[drives.data]
builder = "tar"
filename = "build/files.tar"
extra_size = "100Mb"
mount = "/var/lib/app_three"
```

The tar builder creates a drive from a tar archive. This is handy when your build process already produces a `.tar` file, or when you want to bundle files from a CI pipeline into a drive without needing Docker or a directory on disk.

**`filename`** is required and points to the `.tar` file, relative to your project root.

**`extra_size`** adds extra space on top of the archive contents.

**`mount`** sets the mount point inside the machine. Optional, defaults to `/mnt/<name>`.

### Pre built Drive (None Builder)

```toml
[drives.doom]
builder = "none"
filename = "./games/doom.sqfs"
mount = "/usr/local/games/doom"
```

The none builder skips building entirely. It takes an existing drive image file and attaches it to the machine as is. This is useful when you have a pre built file system image, perhaps from another tool, a third party, or a previous build. Note that `doom` is a placeholder for a sample directory name, in your case all instances would be replaced with an appropriate name.

**`filename`** is required and points to the existing image file. The file extension determines the format: `.ext2` for ext2 and `.sqfs` for SquashFS.

**`mount`** sets the mount point inside the machine. Optional, defaults to `/mnt/<name>`.

This builder is great for including large, static assets that you do not want to rebuild every time. In the example above, a pre built SquashFS image containing game data is mounted at a specific path.

### Common Drive Options

A few options are shared across all builder types:

**`builder`** is required and determines how the drive is assembled. The available values are `"docker"`, `"directory"`, `"tar"`, `"none"`, and `"empty"`. Each builder is covered in its own section above.

**`mount`** controls where the drive is mounted inside the machine. It defaults to `/mnt/<name>`. You can set it to any absolute path. For example, `mount = "/var/lib/app"` makes the drive accessible at that path inside the machine.

**`shared`** when set to `true`, maps the drive as a shared memory region, meaning the host and the machine access the same underlying memory rather than the data being copied in. This avoids the overhead of loading large drives into the machine's address space and is useful when you need to pass large amounts of data in and out of the machine efficiently. Defaults to `false`.

**`user`** sets the Linux user that owns the files inside the drive. This matters when your application runs as a non-root user and needs read or write access to the drive's contents. Defaults to the user defined in the Docker image, or root if unset.

**`format`** determines the file system type. Choose `"ext2"` when your application needs to read and write to the drive, or `"sqfs"` for a compressed read only image. Not all builders support this option (the empty builder uses `"ext2"` or `"raw"`, and it's completely absent in the none builder).

**`extra_size`** adds free space beyond the actual content size. Useful for drives when you intend to convert to an ext2 format, it takes the actual size of the existing directory contents then adds the specified `extra_size` to it, allowing for future additions. Specified as a string like `"100Mb"` or `"50Mi"`.

## Putting It All Together: A Complete Example

Here is a realistic `cartesi.toml` for a Python application that processes uploaded documents. It has a root drive built from a Dockerfile, an empty drive for temporary storage, and a pre built drive containing reference data.

```toml
# Pin the SDK version for reproducible builds
sdk = "cartesi/sdk:0.12.0"

[machine]
# Run the Python application when the machine starts
entrypoint = "/usr/local/bin/python3 /mnt/app/main.py"

# Give the machine 256 megabytes of RAM for document processing
ram_length = "256Mi"

# Pull environment variables and working directory from the Docker image
use_docker_env = true
use_docker_workdir = true

# Run as the default non root user
user = "dapp"

# Compute the final hash for on chain verification
final_hash = true

# The root drive contains the OS, Python runtime, and application code
[drives.root]
builder = "docker"
dockerfile = "Dockerfile"
format = "ext2"
extra_size = "50Mb"

# An empty writable drive for temporary file processing
[drives.scratch]
builder = "empty"
size = "200Mb"
mount = "/tmp/processing"

# Pre built reference data that does not change between deployments
[drives.reference]
builder = "none"
filename = "./data/reference-corpus.sqfs"
mount = "/opt/data/reference"
```

In this setup:

The root drive is built from a Dockerfile that installs Python and copies in the application code. The `extra_size` gives it 50 megabytes of headroom for any files the OS or Python runtime might create.

The scratch drive is a 200 megabyte blank space where the application can write temporary files during document processing. Since it is empty, it starts fresh every time the machine boots.

The reference drive contains a pre built SquashFS image with static reference data. Because this data does not change, using SquashFS keeps the image small and read only.

## Quick Reference

| Field                   | Section      | Type             | Default                         | Description                                                     |
| ----------------------- | ------------ | ---------------- | ------------------------------- | --------------------------------------------------------------- |
| `sdk`                   | Top level    | String           | `"cartesi/sdk:0.12.0"`          | SDK image and version used for building                         |
| `entrypoint`            | `[machine]`  | String           | From Docker image               | Path to the application binary                                  |
| `boot_args`             | `[machine]`  | String array     | CLI defaults                    | Linux kernel boot arguments                                     |
| `ram_length`            | `[machine]`  | String           | `"128Mi"`                       | Amount of RAM for the machine                                   |
| `ram_image`             | `[machine]`  | String           | SDK default                     | Path to the Linux kernel binary                                 |
| `max_mcycle`            | `[machine]`  | Number           | `2305843009213693952` (default) | Maximum machine cycles allowed                                  |
| `assert_rolling_update` | `[machine]`  | Boolean          | —                               | Assert rolling update compatibility                             |
| `use_docker_env`        | `[machine]`  | Boolean          | `true`                          | Inject Docker ENV into the machine                              |
| `use_docker_workdir`    | `[machine]`  | Boolean          | `true`                          | Use Docker WORKDIR in the machine                               |
| `user`                  | `[machine]`  | String           | —                               | User to run the application as                                  |
| `final_hash`            | `[machine]`  | Boolean          | —                               | Compute machine hash after build                                |
| `builder`               | `[drives.*]` | String           | `"docker"`                      | How to create the drive: docker, empty, directory, tar, or none |
| `dockerfile`            | `[drives.*]` | String           | `"Dockerfile"`                  | Path to Dockerfile (docker builder)                             |
| `target`                | `[drives.*]` | String           | Last stage                      | Docker multi stage build target                                 |
| `format`                | `[drives.*]` | String           | `"ext2"`                        | File system format: ext2 or sqfs                                |
| `extra_size`            | `[drives.*]` | String           | `0`                             | Extra free space added to the drive                             |
| `size`                  | `[drives.*]` | String or Number | —                               | Total drive size (empty builder only)                           |
| `directory`             | `[drives.*]` | String           | —                               | Local directory to package (directory builder)                  |
| `filename`              | `[drives.*]` | String           | —                               | Path to tar or existing image file                              |
| `mount`                 | `[drives.*]` | String           | `/mnt/<name>`                   | Where the drive is mounted in the machine                       |
