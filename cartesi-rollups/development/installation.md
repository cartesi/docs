---
id: installation
title: Installation
tags: [Sunodo, Installation, Docker]
---

The primary requirements for building on Cartesi are Sunodo and Docker Desktop for your operating system of choice.

Sunodo is an easy-to-use CLI tool with which you can develop and deploy your dApps without getting lost in intricate commands and configurations of Docker and the node itself.

Docker is the required tool to distribute the Cartesi Rollups framework and its dependencies.

## Install Docker Desktop

Docker Desktop is a must-have requirement that comes pre-configured with two necessary plugins for building dApps Cartesi:

- Docker Buildx
- Docker Compose

Follow [the instructions here to install Docker Desktop](https://www.docker.com/products/docker-desktop/) for your operating system.

:::troubleshoot

```
Error: Invalid image Architecture: Expected riscv64
```

Check if your Docker supports the RISCV platform by running:

```
docker buildx ls
```

If you do not see `linux/riscv64` in the platforms list, install `QEMU` by running:

```
apt install qemu-user-static
```

:::

## Install Sunodo

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="macOS" label="macOS" default>
  <p>Install Sunodo with Homebrew:</p>
    <pre><code>
    brew install sunodo/tap/sunodo
    </code></pre>
    <p> Alternatively, you can use Node.js to install Sunodo:</p>
    <pre><code>
    npm install -g @sunodo/cli
    </code></pre>
  </TabItem>

  <TabItem value="Linux" label="Linux">
  <p>Install Sunodo with Node.js:</p>
    <pre><code>
    npm install -g @sunodo/cli
    </code></pre>
  </TabItem>

  <TabItem value="Windows" label="Windows">
    <p>1. Install <a href="https://learn.microsoft.com/en-us/windows/wsl/install">WSL2</a> and Ubuntu from the Microsoft store</p>
    <p>2. Install Sunodo with Node.js </p>
    <pre><code>
    npm install -g @sunodo/cli
    </code></pre>
  </TabItem>
</Tabs>

:::note
For a seamless development workflow on Windows, do not execute Docker commands within Powershell. Instead, open the latest Ubuntu terminal that you have installed and perform all coding and command execution within that Linux environment.
:::

Sunodo Doctor is a diagnostic tool that declares whether your system is ready and set up for development.

```shell
$ sunodo doctor
✔ Your system is ready for sunodo.
```
