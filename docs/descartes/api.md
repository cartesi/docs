---
title: On-chain API
---

Having informally discussed how Descartes represents Cartesi Machines on-chain, one can now describe in more details the API for requesting and retrieving computations in Descartes.

All interactions with the Descartes infrastructure are done through a single smart contract, conveniently called `Descartes`. In this contract, there are only two endpoints that a developer needs to access. These are the functions `instantiate` and `getResult`, and they are respectively responsible for starting a new computation and obtaining its output.

The `instantiate` call is a little more elaborate, as it needs to specify all the details of the machine, including its hash, maximum running time and metadata about its input drives. This is explained in detail in the next section.

In contrast, the `getResult` endpoint is very simple: in a typical situation it returns the output of the computation. Here, "output of the computation" refers to the contents of the output drive inside the Linux machine when it halted.

In exceptional cases, the `getResult` function can return error codes, for example when one of the involved parties misbehaves and is proved wrong by the dispute resolution that followed.
