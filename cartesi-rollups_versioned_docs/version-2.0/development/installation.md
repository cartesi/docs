---
id: installation
title: Installation
resources:
  - url: https://www.docker.com/products/docker-desktop/
    title: Install Docker Desktop
  - url: https://nodejs.org/en/download/
    title: Install Node.js and NPM
  - url: https://learn.microsoft.com/en-us/windows/wsl/install
    title: Install WSL2
  - url: https://ubuntu.com/download/desktop
    title: Install Ubuntu LTS
---

The primary requirements for building on Cartesi are:

- Cartesi CLI: An easy-to-use tool for developing and deploying your dApps.

- Docker Desktop 4.x: The required tool to distribute the Cartesi Rollups framework and its dependencies.

- Node and NPM: A JavaScript runtime needed to install Cartesi CLI and run various scripts. We recommend installing the **LTS version** to ensure best compatibility.

- WSL2 and Ubuntu 24.04 LTS **(for Windows users only)**.

  :::note building on windows?
  Avoid running commands in Powershell. Instead, use the latest installed Ubuntu distro for all coding and command execution.
  :::

## Docker Desktop

Docker Desktop is a must-have requirement that comes pre-configured with two necessary plugins for building dApps Cartesi:

- Docker Buildx
- Docker Compose

[Install the latest version of Docker Desktop](https://www.docker.com/products/docker-desktop/) for your operating system.

To install Docker RISC-V support without using Docker Desktop, run the following command:

```shell
docker run --privileged --rm tonistiigi/binfmt:qemu-v10.2.3 --install all
```

## Node and NPM

To download the latest version of Node and NPM, visit [nodejs.org/en/download](https://nodejs.org/en/download).

After downloading, run the installer and follow the instructions to complete the installation.

Verify the installation by running `node -v`, which will display the version of Node.js that was installed.

## Cartesi CLI

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

These docs are written for Cartesi CLI **2.0.0-alpha.41**. Install that exact version: `npm install -g @cartesi/cli` without a version installs the `latest` tag, which is the 1.5 CLI.

<Tabs>
  <TabItem value="macOS" label="macOS" default>
  <p>Install Cartesi CLI with NPM:</p>
    <pre><code>
    npm install -g @cartesi/cli@2.0.0-alpha.41
    </code></pre>
  </TabItem>

  <TabItem value="Linux" label="Linux">
  <p>Install Cartesi CLI with NPM:</p>
    <pre><code>
    npm install -g @cartesi/cli@2.0.0-alpha.41
    </code></pre>
  </TabItem>

  <TabItem value="Windows" label="Windows">
    <p>1. Install <a href="https://learn.microsoft.com/en-us/windows/wsl/install">WSL2</a> and Ubuntu from the Microsoft store</p>
    <p>2. Install Cartesi CLI with NPM: </p>
    <pre><code>
    npm install -g @cartesi/cli@2.0.0-alpha.41
    </code></pre>
  </TabItem>
</Tabs>

Check the installed version with `cartesi --version`.

:::caution Pin the SDK image for rollups-node v2.0.0-alpha.14
Cartesi CLI 2.0.0-alpha.41 builds machines with the `cartesi/sdk:0.12.0-alpha.44` image by default, which ships rollups-node v2.0.0-alpha.13 and Cartesi Machine emulator 0.21.0. These docs target rollups-node v2.0.0-alpha.14, which uses emulator 0.22.0 and cannot load machines built with 0.21. Set the SDK image at the top of your project's `cartesi.toml`:

```toml
sdk = "cartesi/sdk:0.12.0-alpha.45"
```

The `cartesi/sdk:0.12.0-alpha.45` image ships rollups-node v2.0.0-alpha.14, emulator 0.22.0 and PRT 3.0.0-alpha.6. See [SDK Version](./advanced-configuration.md#sdk-version).
:::

Cartesi CLI doctor is a diagnostic tool that declares whether your system is ready and set up for development.

```shell
$ cartesi doctor
✔ Your system is ready for cartesi.
```
