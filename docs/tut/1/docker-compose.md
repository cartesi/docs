---
title: Installing Docker Compose
---

## Installing Docker Compose
    
Docker Compose is a tool that allows us to start multiple Docker containers simultaneously and set up communication between them. With Compose in our development environment, we can emulate the entire Cartesi system (both of all off-chain and on-chain components, including the local "testnet" blockchain itself), and thus test our Cartesi DApps using only your physical development machine.

Follow the [official instructions for installing Compose](https://docs.docker.com/compose/install/) from the Docker website. The official instructions already refer to the latest version of Compose, and they are very simple. To make the official site display the instructions for installing on Ubuntu, click on the `Linux` tab under the `Install Compose` section. A subsection named `Install Compose on Linux systems` should appear, and you can follow those.

The Docker Compose Linux installation instructions boil down to running the following commands.

First, download the Docker Compose version 1.25.1 binary (which was the latest at the time of this writing) to your `/usr/local/bin`:

```
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

Then, make the binary executable:

```
sudo chmod +x /usr/local/bin/docker-compose
```

And finally, test it:

```
docker-compose --version
```

The above command should print something like the following, if `/usr/local/bin` is in your `$PATH`:

```
docker-compose version 1.25.1, build 1110ad01
```

You now have Docker Compose installed.

## Using Docker Compose

By default, Compose expects an input file named `docker-compose.yml` in the current directory where it is executed. That file tells Compose, among other things, what Docker containers to run and what communication channels to establish between them.

Since the `docker-compose.yml` input file (or some other input file, which can be set with the `-f` option) usually tells Compose all it needs to know to do its job, booting an entire system with Compose can be as simple as issuing the following command:

```
docker-compose up --build
```

The `--build` flag tells Compose to build your images before starting any containers.

Similarly, tearing down that running system can be as simple as:

```
docker-compose down -v
```

The `-v` flag tells Compose to remove any _Docker volume_ mappings that Compose created when running your system. 

The official Docker Compose website has a [Get Started with Docker Compose](https://docs.docker.com/compose/gettingstarted/) section if you want to learn more.
