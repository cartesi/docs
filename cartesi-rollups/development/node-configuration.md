---
id: node-configuration
title: Node configuration
tags: [node, configuration, sunodo]
resources:
  - url: https://docs.sunodo.io/guide/running/running-application
    title: Node configuration with Sunodo
---

Sunodo comes pre-configured with some default settings for Cartesi nodes. You can configure epoch duration, block time, environment variables, memory and the content of the information you want your node to preview.

## Verbosity

By default, the node works in non-verbose mode and only outputs logs from the user’s backend application. In case the user needs more information, there is the `--verbose` flag.

```
sunodo run --verbose
```

## Block time

This is the time it takes for the node to process a block.

By default, the node processes a block every 5 seconds.

You can configure the block time by running:

```
sunodo run --block-time <seconds>
```

## Epoch duration

To avoid over-interacting with the blockchain, validators don’t check every new state update on the off-chain machine. They do it at the end of an **epoch** — a batch of inputs following the same cycle. 

To end an epoch, all validators must reach a consensus about the machine’s state after processing all the batched inputs. At this point, the outputs are considered final, meaning their contents can no longer be disputed.

Epoch configuration is crucial when working with vouchers.

Vouchers allow your dApps in the execution layer to interact with contracts on the base layer through message calls.

One everyday use of vouchers in Cartesi dApps is to withdraw assets.

A voucher can only be executed once the dApp's consensus submits a claim containing it, i.e., when their corresponding epoch is closed.


To change the default epoch duration, run:

```
sunodo run --epoch-duration <seconds>
```

## Memory

To change the default memory size for the Cartesi Machine, you can personalize it by adding a specific label in your Dockerfile.

The line below lets you define the memory size in megabytes (MB):

```dockerfile
LABEL io.cartesi.rollups.ram_size=128Mi
```

:::note environment variables
You can create a `.sunodo.env` in the project's root and override any variable controlling the rollups-node.
:::
