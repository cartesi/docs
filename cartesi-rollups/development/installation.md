---
id: installation
title: Installation
---

The primary requirements for building on Cartesi are:

- [Cartesi CLI](#cartesi-cli): An easy-to-use tool for developing and deploying your dApps.

- [Docker Desktop 4.x](#docker-desktop): The required tool to distribute the Cartesi Rollups framework and its dependencies.

- [Node and NPM](#nodejs): A JavaScript runtime needed to install Cartesi CLI and run various scripts. We recommend installing the **LTS version** to ensure best compatibility.

- [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) and [Ubuntu 24.04 LTS](https://ubuntu.com/download/desktop) **(for Windows users only)**.

  :::note building on windows?
  Avoid running commands in Powershell. Instead, use the latest installed Ubuntu distro for all coding and command execution.
  :::

## Docker Desktop

Docker Desktop is a must-have requirement that comes pre-configured with two necessary plugins for building dApps Cartesi:

- Docker Buildx
- Docker Compose

[Install the latest version of Docker Desktop](https://www.docker.com/products/docker-desktop/) for your operating system.

:::troubleshoot troubleshooting common errors

#### Error: Invalid image Architecture
```shell
Error: Invalid image Architecture: Expected riscv64
```

#### Solution:


1. Check if your Docker supports the RISCV platform by running:

  ```shell
  docker buildx ls
  ```


2. If you do not see `linux/riscv64` in the platforms list, install `QEMU` by running:

  ```shell
  apt install qemu-user-static
  ```

:::


## Node and NPM

To download the latest version of Node and NPM, visit [nodejs.org/en/download](https://nodejs.org/en/download).

After downloading, run the installer and follow the instructions to complete the installation.

Verify the installation by running `node -v`, which will display the version of Node.js that was installed.

## Cartesi CLI

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="macOS" label="macOS" default>
  <p>Install Cartesi CLI with <a href="https://brew.sh/" target="_blank"> Homebrew</a>:</p>
    <pre><code>
    brew install cartesi/tap/cartesi
    </code></pre>
    <p> Alternatively, you can install Cartesi CLI with NPM:</p>
    <pre><code>
    npm install -g @cartesi/cli
    </code></pre>
  </TabItem>

  <TabItem value="Linux" label="Linux">
  <p>Install Cartesi CLI with NPM:</p>
    <pre><code>
    npm install -g @cartesi/cli
    </code></pre>
  </TabItem>

  <TabItem value="Windows" label="Windows">
    <p>1. Install <a href="https://learn.microsoft.com/en-us/windows/wsl/install">WSL2</a> and Ubuntu from the Microsoft store</p>
    <p>2. Install Cartesi CLI with NPM: </p>
    <pre><code>
    npm install -g @cartesi/cli
    </code></pre>
  </TabItem>
</Tabs>


Cartesi CLI doctor is a diagnostic tool that declares whether your system is ready and set up for development.

```shell
$ cartesi doctor
✔ Your system is ready for cartesi.
```

:::caution deprecation notice
The Sunodo CLI has been deprecated. We recommend that all developers [migrate their existing applications to the new Cartesi CLI tool](../development/migration.md) as soon as possible. 
:::