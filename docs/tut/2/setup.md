---
title: Tutorial setup
---

Before we begin, we need to download a Docker image from [Cartesi's repository at Docker Hub](https://hub.docker.com/u/cartesi).

## Download Cartesi's RISC-V development tools

The following command tells Docker to _pull_ (download) the latest version of the `toolchain` image from the `cartesi` Docker Hub user (i.e. the Cartesi Project):

```
docker pull cartesi/toolchain
```

The `cartesi/toolchain` image is generated from the [cartesi/image-toolchain](https://github.com/cartesi/image-toolchain) GitHub repository.

The image should be a download of a few hundred megabytes. If all went well, you should be able to start up a container and run a shell from within the container:

```
docker run -it cartesi/toolchain /bin/bash
```

It should place you in a containerized root-user shell prompt which sees the toolchain image's filesystem:

```
Running as root
root@9d3b16c89fbd:/opt/riscv#
```

The `9d3b16c89fbd` part above is the Container ID. It will be different every time you start it.

After you're done exploring the toolchain filesystem, execute the `exit` command, which will stop the container.

