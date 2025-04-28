---
sidebar_position: 7
slug: '/nonodox'
label: "NoNodox: An iterative development environment for Cartesi Coprocessor applications"
---

# NoNodox (development tool)

## Overview

This is an iterative tool designed to accelerate the "debugging" and "development" process of Cartesi Coprocessor applications locally, providing a faster path to the production environment.

### Prerequisites

Please make sure that your system meets all the requirements listed below before proceeding with this tutorial.

1. [Foundry](https://book.getfoundry.sh/getting-started/installation)
3. [Nonodo](https://github.com/Calindra/nonodo?tab=readme-ov-file#installation)

### Installation

There are two installation options for the tool: one involves installing the binary according to the architectures available on the releases page, and the other uses Golang to install the package. Choose one of these options to proceed.

- **Option 1:** Install the binary:

1. Go to latest [release page](https://github.com/Mugen-Builders/cartesi-coprocessor-nonodox/releases) and download the archive for your host platform;
2. Extract the archive;
3. Add the binary's path to the system PATH so that it can be initialized using just the `nonodox` command;

- **Option 2:** Install the package with golang:

```sh
go install github.com/Mugen-Builders/cartesi-coprocessor-nonodox/cmd/nonodox@latest
```

:::warning
The command above installs NoNodoX into the `bin` directory inside the directory defined by the `GOPATH` environment variable.
If you don't set the `GOPATH` variable, the default install location is `$HOME/go/bin`.
So, to call the `nonodox` command directly, you should add it to the `PATH` variable.
The command below exemplifies that.
 
```sh
export PATH="$HOME/go/bin:$PATH"
```
:::

### Running

1. Download the state file (.json):

```bash
curl -O https://raw.githubusercontent.com/Mugen-Builders/cartesi-coprocessor-nonodox/refs/heads/main/anvil_state.json
```

2. Start the anvil instance:

```sh
anvil --load-state anvil_state.json
```

:::danger
Before running the command below, please make sure that you have deployed the CoprocesorAdapter instance, passing `0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE` as the coprocessor address to its constructor
:::

3. Running the tool:

```sh
nonodox
```

:::info
If you wish to make any customizations to the tool's execution environment, you can use the `--config` flag along with the path to a `.toml` file, which should contain the following variables:

```toml
[anvil]
http_url = "http://127.0.0.1:8545"
ws_url = "ws://127.0.0.1:8545"
private_key = "<private-key-without-0x>" 
input_box_block = "7"
```
:::

Now you can run your application, send inputs, and iteratively observe the outputs (Notices) of your application as they are executed and reach your CoprocesorAdapter instance.

#### 4. How to run your application with NoNodox:

You can run your application so that inputs are processed and outputs are generated according to the way your chosen language does it, for example in Python:

```bash
python my_dapp.py
```

:::info
For those who want an environment closer to production **( ensuring that all libraries and packages used by your application support the Cartesi Machine architecture )** you can use the [Cartesi Machine](https://github.com/edubart/cartesi-machine-everywhere) binary with the system above. This replaces the previous step of running your program on the host.
:::

Below are some examples of how to run your application using the cartesi machine binary for Python, JavaScript, Rust, and Go:

Python:

```bash
cartesi-machine --network --flash-drive=label:root,filename:.cartesi/image.ext2 \
--volume=.:/mnt --env=ROLLUP_HTTP_SERVER_URL=http://10.0.2.2:5004 --workdir=/mnt -- python dapp.py
```

Javascript:

```bash
cartesi-machine --network --flash-drive=label:root,filename:.cartesi/image.ext2 \
--volume=.:/mnt --env=ROLLUP_HTTP_SERVER_URL=http://10.0.2.2:5004 --workdir=/opt/cartesi/dapp -- node index
```

Rust:

```bash
cartesi-machine --network --flash-drive=label:root,filename:.cartesi/image.ext2 \
--env=ROLLUP_HTTP_SERVER_URL=http://10.0.2.2:5004 -- /opt/cartesi/dapp/dapp
```

Golang:

```bash
cartesi-machine --network --flash-drive=label:root,filename:.cartesi/image.ext2 \
--env=ROLLUP_HTTP_SERVER_URL=http://10.0.2.2:5004 -- /opt/cartesi/dapp/dapp
```