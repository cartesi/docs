---
id: building-the-application
title: Building the application
tags: [build, machine, dapp, developer]
---

“Building” in this context compiles your application into RISC-V architecture and consequently builds a Cartesi machine containing your application.

This architecture enables computation done by your application to be reproducible and verifiable.

With the Docker engine running, change the directory to your application and build by running.

```shell
sunodo build
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
```

The successful build of your application will be stored in the Cartesi machine and will be ready to receive requests and inputs.

:::note Troubleshoot

```
Error: Command failed with exit code 1
permission denied why trying to connect to the docker daemon.
```

This error is associated with permissions associated with Docker. Fix this by running the commands as super user

```shell
sudo sunodo <subcommand>
```

To allow non-root users to manage Docker and avoid having to type sudo for every Docker command:

```shell
sudo usermod -aG docker $USER
newgrp docker
```
