---
id: building-an-application
title: Building an application
---

“Building” in this context compiles your application into RISC-V architecture and consequently builds a Cartesi machine containing your application. This architecture enables computation done by your application to be reproducible and verifiable.

Ensure you have Docker engine running, then navigate the directory to your application and build by running:

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
[INFO  rollup_http_server::dapp_process] starting dapp: dapp
Sending finish

Manual yield rx-accepted (1) (0x000020 data)
Cycles: 69709199
69709199: 9e0420c0fda1a5dc9256b3f9783b09f207e5222a88429e91629cc2e495282b35
Storing machine: please wait
```

## Memory

To change the default memory size for the Cartesi Machine, you can personalize it by adding a specific label in your Dockerfile.

The line below lets you define the memory size in megabytes (MB):

```dockerfile
LABEL io.cartesi.rollups.ram_size=128Mi
```

:::note environment variables
You can create a `.cartesi.env` in the project's root and override any variable controlling the rollups-node.
:::
