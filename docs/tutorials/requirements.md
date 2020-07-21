---
title: General Requirements
---

:::note Section Goal
- ensure all dependencies necessary for running the tutorials are installed
:::

In order to run the tutorials, we must first make sure that the packages listed in this section are all installed and working in your system.

As we mentioned earlier, The Descartes Tutorials will provide _every single command_ that you need to run in your shell to turn an Ubuntu machine into a fully-fledged Cartesi development environment. That is, if you are starting with a fresh copy of the latest Ubuntu LTS installed in your machine, you should never need to leave this tutorial for an external website to get something installed. And if some tutorial step doesn't work for you, and you have tried it in a clean Ubuntu LTS installation, then that could be a bug in the tutorials, and you can discuss it in our [Discord channel](https://discordapp.com/invite/Pt2NrnS)).

## Docker

[Docker](https://docker.io) is a widely used platform for users to build, run, and share applications with containers, and is a great way of distributing the Descartes SDK and all of its dependencies.

To install Docker, you can follow the [official Docker Engine installation instructions from the Docker website](https://docs.docker.com/install/). For Ubuntu, you can refer directly to the [Docker Engine installation instructions for Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/). Below, we reproduce the Docker installation steps that we have verified as working for a fresh Ubuntu installation:

First, we need to set up Docker's repository:

```bash
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

And then install Docker itself:

```bash
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

Finally, it is a good idea to allow non-root users to manage Docker, so as to avoid having to type `sudo` for every Docker command:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

After that, you can check if Docker is property installed by running:

```
docker --version
```

## Docker Compose

[Docker Compose](https://docs.docker.com/compose/) is a tool that allows us to start multiple Docker containers simultaneously and set up communication between them. With Compose, we can emulate the entire [Descartes SDK environment](../descartes-env/) (both of all off-chain and on-chain components, including the local "testnet" blockchain itself), and thus test our Descartes DApps using only your physical development machine.

Follow the [official instructions for installing Compose](https://docs.docker.com/compose/install/) from the Docker website. To make the official site display the instructions for installing on Ubuntu, click on the `Linux` tab under the `Install Compose` section. A subsection named `Install Compose on Linux systems` should appear, and you can follow those. The Docker Compose Linux installation instructions boil down to running the following commands.

First, download the Docker Compose binary (version 1.26.0 was the latest at the time of this writing):

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

Then, make the binary executable:

```bash
sudo chmod +x /usr/local/bin/docker-compose
```

And finally, test it:

```bash
docker-compose --version
```

## Node.js and NPM

[Node.js](https://nodejs.org/) is a very popular asynchronous event-driven JavaScript runtime, and is often distributed along with the [NPM package manager](https://npmjs.com). These are required for running [Yarn](#yarn) and [Truffle](#truffle).

To install Node.js, follow [the official instructions](https://nodejs.org/en/download/). Specifically for Ubuntu, you can perform the steps below:

```bash
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
```

And then test them:

```bash
node –-version
npm –-version
```

## Yarn

[Yarn](https://classic.yarnpkg.com/) is a great dependency management tool, and will be used for adding dependencies to our tutorial projects. You can install it by accessing [the official installation site](https://classic.yarnpkg.com/en/docs/install). The [official instructions for installing on Ubuntu](https://classic.yarnpkg.com/en/docs/install#debian-stable) are as follows.

First, configure the repository:

```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
```

Then, run:

```bash
sudo apt-get update && sudo apt-get install yarn
```

And finally, test that Yarn is installed and working property:

```bash
yarn --version
```

## Truffle

[Truffle](https://www.trufflesuite.com/truffle) is a popular development framework for blockchains using the Ethereum Virtual Machine (EVM). In these tutorials, we'll use Truffle to compile our DApp smart contracts, deploy them to the local test blockchain network, and finally interact with them using its command line console.

The [official installation instructions](https://www.trufflesuite.com/docs/truffle/getting-started/installation) use NPM and are straightforward for all operating systems:

```bash
npm install -g truffle
```

You can check if it is correctly installed by typing the following:

```bash
truffle version
```
