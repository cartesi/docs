---
id: installation
title: Installation
---

The primary requirements for building on Cartesi are the Cartesi CLI and Docker Desktop for your operating system of choice.

Cartesi CLI is an easy-to-use tool with which you can develop and deploy your dApps without getting lost in intricate commands and configurations of Docker and the node itself.

Docker is the required tool to distribute the Cartesi Rollups framework and its dependencies.

## Install Docker Desktop

Docker Desktop is a must-have requirement that comes pre-configured with two necessary plugins for building dApps Cartesi:

- Docker Buildx
- Docker Compose

Follow [the instructions here to install Docker Desktop](https://www.docker.com/products/docker-desktop/) for your operating system.

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


## Install Node.js

To download the latest version of Node.js, visit [nodejs.org/en/download](https://nodejs.org/en/download).

After downloading, run the installer and follow the instructions to complete the installation.

Verify the installation by running `node -v`, which will display the version of Node.js that was installed.

## Install Cartesi CLI

:::caution deprecation notice
The Sunodo CLI has been deprecated. We recommend that all developers [migrate their existing applications to the new Cartesi CLI tool](../development/migration.md) as soon as possible. 
:::

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="macOS" label="macOS" default>
  <p>Install Cartesi CLI with Homebrew:</p>
    <pre><code>
    brew install cartesi/tap/cartesi
    </code></pre>
    <p> Alternatively, you can use Node.js to install Cartesi CLI:</p>
    <pre><code>
    npm install -g @cartesi/cli
    </code></pre>
  </TabItem>

  <TabItem value="Linux" label="Linux">
  <p>Install Cartesi CLI with Node.js:</p>
    <pre><code>
    npm install -g @cartesi/cli
    </code></pre>
  </TabItem>

  <TabItem value="Windows" label="Windows">
    <p>1. Install <a href="https://learn.microsoft.com/en-us/windows/wsl/install">WSL2</a> and Ubuntu from the Microsoft store</p>
    <p>2. Install Cartesi CLI with Node.js </p>
    <pre><code>
    npm install -g @cartesi/cli
    </code></pre>
  </TabItem>
</Tabs>

:::note building on windows?
For a seamless development workflow on Windows, do not execute Docker commands within Powershell. Instead, open the latest Ubuntu terminal that you have installed and perform all coding and command execution within that Linux environment.
:::

Cartesi CLI doctor is a diagnostic tool that declares whether your system is ready and set up for development.

```shell
$ cartesi doctor
✔ Your system is ready for cartesi.
```
