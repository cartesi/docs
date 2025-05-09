# Installation

This guide outlines the installation of the tools needed to set up your environment. Currently, all these tools are essential for proper setup, though efforts are underway to streamline the process and minimize external dependencies.

## Prerequisites

### 1. **Docker Desktop**

Docker Desktop is a must-have requirement that comes pre-configured with two necessary plugins for building Cartesi dApps:

- Docker Buildx
- Docker Compose

[Install the latest version of Docker Desktop](https://www.docker.com/products/docker-desktop/) for your operating system then install RISC-V support by running:

```bash
docker run --privileged --rm tonistiigi/binfmt --install all
```


### 2. **Cartesi CLI**

The Cartesi CLI is an easy-to-use tool for developing and deploying Cartesi dApps. In this tutorial, we use the Cartesi CLI to bootstrap, build and also deploy our projects.

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

To test that you have Cartesi CLI installed, you can run the following command:

```bash
cartesi doctor
```


### 3. **Install Foundry**

Foundry is a portable and modular toolkit for Ethereum application development.

Foundry consists of:

- Forge: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- Cast: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- Anvil: Local Ethereum node, akin to Ganache, Hardhat Network.
- Chisel: Fast, utilitarian, and verbose solidity REPL.

Download and run the Foundry installer:

```bash
curl -L https://foundry.paradigm.xyz | bash
```

Initialize Foundry:

```bash
foundryup
```

:::info
With this setup complete, your environment is ready for development and interaction with the Cartesi Coprocessor.
:::

---

## Optional tools that can help in your journey

### Nonodo

[Nonodo](https://github.com/Calindra/nonodo) is a development node for Cartesi Rollups that was designed to work with applications running in the host machine instead of the Cartesi Machine. So, the developer doesn't need to be concerned with compiling their application to RISC-V. The application back-end should run in the developer's machine and call the Rollup HTTP API to process advance and inspect inputs. Nonodo is a valuable development workflow tool, but there are some caveats the developer must be aware of.

Install Nonodo, a local testing tool emulating Cartesi's Node, using npm:

```bash
npm install -g nonodo
```
