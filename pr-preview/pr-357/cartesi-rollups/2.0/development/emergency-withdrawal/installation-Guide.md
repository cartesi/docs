> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: installation-Guide
title: Installing the required tools
---

The [Emergency Withdrawal Recovery Guide](./recovery-guide.md) runs its tools directly on your machine. This is convenient on a local devnet, where you interact with them directly rather than through the node's containers. This page installs everything you need. Each tool below has a short description, followed by Linux and then macOS steps.

## Cartesi Machine emulator

The Cartesi Machine is the deterministic RISC-V virtual machine your application runs in. The machine tool spawns it to reproduce the settled state and generate the withdrawal proofs, so the emulator must be installed (version 0.20.x).

### Linux (Debian or Ubuntu)

Add the Cartesi APT repository, then install the emulator:

```sh
wget -qO - https://dist.cartesi.io/apt/keys/cartesi-deb-key.gpg | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/cartesi-deb-key.gpg
echo "deb https://dist.cartesi.io/apt stable/" | sudo tee /etc/apt/sources.list.d/cartesi-deb-apt.list
sudo apt-get update
sudo apt-get install cartesi-machine
```

### macOS

Install with Homebrew:

```sh
brew tap cartesi/tap
brew install cartesi-machine
```

If a package is not yet available for your system, build the emulator from source following the [Cartesi Machine installation instructions](https://github.com/cartesi/machine-emulator#installation).

## Cartesi Rollups Node tools

The recovery flow uses two command-line tools that ship together with the Cartesi Rollups Node:

- **`cartesi-rollups-cli`** sends the on-chain transactions (foreclose, anchor the drive root, withdraw) and reads withdrawals;
- **`cartesi-rollups-machine-tool`** reproduces the settled machine state (`replay`) and generates the accounts-drive proofs (`prove accounts-drive`).

Prebuilt packages are published only as Debian `.deb` files (amd64 and arm64). On macOS, and on other systems, you build them from source.

### Linux (Debian or Ubuntu, amd64 or arm64)

Download the node package for your architecture from the [Cartesi Rollups Node releases](https://github.com/cartesi/rollups-node/releases). The file is named `cartesi-rollups-node-v<version>_<arch>.deb`. Install it (this installs all node binaries, including both tools):

```sh
sudo dpkg -i cartesi-rollups-node-v<version>_<arch>.deb
```

To install only the two tools, extract them from the package instead:

```sh
dpkg-deb -x cartesi-rollups-node-v<version>_<arch>.deb out/
sudo cp out/usr/bin/cartesi-rollups-cli out/usr/bin/cartesi-rollups-machine-tool /usr/local/bin/
```

### macOS

No prebuilt binaries are published for macOS, so build the tools from source. You need the Cartesi Machine emulator (above), Go >= 1.24.1, and GNU Make >= 3.81. Install Go and Make with Homebrew:

```sh
brew install go make
```

Then build and install:

```sh
git clone --branch next/2.0 https://github.com/cartesi/rollups-node.git
cd rollups-node
make
sudo make install
```

This installs the binaries under `/opt/cartesi/bin` on macOS (and `/usr/bin` on Linux). Make sure that directory is on your `PATH`.

## Verify

```sh
cartesi-machine --version
cartesi-rollups-cli --version
cartesi-rollups-machine-tool --help
```

Once these run, continue with the [Emergency Withdrawal Recovery Guide](./recovery-guide.md).
