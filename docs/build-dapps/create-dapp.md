---
id: create-dapp
title: Create your first DApp
tags: [build, dapps ,developer]
---

Once you learned how to [run a simple example](../build-dapps/run-dapp.md), it is now time to create one of your own. In order to do this, we will make use of the [DApp template](https://github.com/cartesi/rollups-examples/blob/main/custom-dapps/README.md) available in Cartesi's [rollups-examples](https://github.com/cartesi/rollups-examples) Github repository. Once again, make sure you have [installed all the necessary requirements](../build-dapps/requirements.md) before proceeding.

## Setting up the environment

First of all, clone the repository as follows:

```shell
$ git clone https://github.com/cartesi/rollups-examples.git
```

## Customizing the DApp

Then, use `create-dapp.sh` to create a customized DApp:

```shell
cd custom-dapps
./create-dapp.sh <dapp-name>
```

A new directory, `<dapp-name>`, will be created with all the boiler plate infrastructure needed by the new DApp.

The new DApp will be provided with some basic back-end code, resembling what is available in the sample [Echo Python DApp](https://github.com/cartesi/rollups-examples/tree/main/echo-python), as explained in the [previous section](../build-dapps/run-dapp.md).

## Modifying the DApp logic

The back-end logic may be found at `<dapp-name>/<dapp-name>.py`.

The script comes with some reference code, which may be helpful during development.
It may be replaced or extended according to the use case needs.
