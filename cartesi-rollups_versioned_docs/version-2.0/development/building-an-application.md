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

To change the default memory size for the Cartesi Machine, set `ram_length` in the `[machine]` section of a `cartesi.toml` file in your project's root (see [advanced configuration](./advanced-configuration.md#memory-settings)).

The lines below set the memory size to 128 mebibytes, which is the default:

```toml
[machine]
ram_length = "128Mi"
```

:::note environment variables
To override a variable that controls the rollups-node started by `cartesi run`, export it in your shell before running the command. Only the variables listed by `cartesi run --list-supported-variables` are passed to the node.
:::
