---
id: building-the-application
title: Building the application
tags: [build, machine, dapp, developer]
---

“Building” in this context compiles your application into RISC-V architecture and consequently builds a Cartesi machine containing your application. This architecture enables computation done by your application to be reproducible and verifiable.

With the Docker engine running, change the directory to your application and build by running:

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
Successfully copied 288MB to /Users/michaelasiedu/Code/calculator/python/.sunodo/image
```


