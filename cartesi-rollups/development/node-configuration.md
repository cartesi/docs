---
id: node-configuration
title: Node configuration
tags: [node, configuration, sunodo]
resources:
  - url: https://docs.sunodo.io/guide/running/running-application
    title: Node configuration with Sunodo
---

Sunodo comes pre-configured with some default settings for Cartesi nodes.

You can manually configure things like epoch duration, block time, environment variables, and the content of the information you want your node to preview.

:::note
You can create a `.sunodo.env` in the project's root and override any variable controlling the rollups-node.
:::

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

Epoch configuration is crucial when working with vouchers.

Vouchers allow your dApps in the execution layer to interact with contracts on the base layer through message calls.

One everyday use of vouchers in Cartesi dApps is to withdraw assets.

A voucher can only be executed once the dApp's consensus submits a claim containing it, i.e., when their corresponding epoch is closed.

By default, the node closes an epoch once a day, which is not practical for development and testing purposes - where you may want to deposit and withdraw assets quickly.

To change the default epoch duration, run:

```
sunodo run --epoch-duration <seconds>
```

