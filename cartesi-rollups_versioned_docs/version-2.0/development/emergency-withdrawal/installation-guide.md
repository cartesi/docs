---
id: installation-Guide
title: Installing the required tools
---

The [Emergency Withdrawal Recovery Guide](./recovery-guide.md) runs its tools directly on your machine. This is convenient on a local devnet, where you interact with them directly rather than through the node's containers. This page installs everything you need for [Cartesi Rollups Node v2.0.0-alpha.14](https://github.com/cartesi/rollups-node/releases/tag/v2.0.0-alpha.14). Each tool below has a short description, followed by Linux and then macOS steps.

## Cartesi Machine emulator

The Cartesi Machine is the deterministic RISC-V virtual machine your application runs in. The machine tool spawns it to reproduce the settled state and generate the withdrawal proofs, so the emulator must be installed.

Install the emulator version your Cartesi Rollups Node release was built with. Node v2.0.0-alpha.14 requires emulator **0.22.x** (it is built against 0.22.0). This is also the version the application's machine template must have been built with: emulator 0.22 changed every machine state hash, so an emulator from another version line cannot reproduce the application's settled state.

### Linux (Debian or Ubuntu)

Download the emulator package for your architecture from the [v0.22.0 release](https://github.com/cartesi/machine-emulator/releases/tag/v0.22.0) and install it (this also installs its dependencies, including `lua5.4`):

```sh
ARCH=$(dpkg --print-architecture)   # amd64 or arm64
wget https://github.com/cartesi/machine-emulator/releases/download/v0.22.0/machine-emulator_${ARCH}.deb
sudo apt-get install ./machine-emulator_${ARCH}.deb
```

### macOS

Install with Homebrew:

```sh
brew tap cartesi/tap
brew install cartesi-machine
```

The tap installs its current emulator release, not a fixed version. Check that `cartesi-machine --version` reports 0.22.x before you continue.

If a package is not available for your system, build the emulator from source following the [Cartesi Machine v0.22.0 build instructions](https://github.com/cartesi/machine-emulator/tree/v0.22.0#from-sources).

## Cartesi Rollups Node tools

The recovery flow uses two command-line tools that ship together with the Cartesi Rollups Node:

- **`cartesi-rollups-cli`** sends the on-chain transactions (foreclose, anchor the drive root, withdraw) and reads withdrawals;
- **`cartesi-rollups-machine-tool`** reproduces the settled machine state (`replay`) and generates the accounts-drive proofs (`prove accounts-drive`).

The node releases publish prebuilt packages only as Debian `.deb` files (amd64 and arm64). On macOS, and on other systems, you build the tools from source.

### Linux (Debian or Ubuntu, amd64 or arm64)

Download the node package for your architecture from the [Cartesi Rollups Node v2.0.0-alpha.14 release](https://github.com/cartesi/rollups-node/releases/tag/v2.0.0-alpha.14) and install it (this installs all node binaries, including both tools). The package requires the 0.22 emulator installed above:

```sh
ARCH=$(dpkg --print-architecture)   # amd64 or arm64
wget https://github.com/cartesi/rollups-node/releases/download/v2.0.0-alpha.14/cartesi-rollups-node-v2.0.0-alpha.14_${ARCH}.deb
sudo apt-get install ./cartesi-rollups-node-v2.0.0-alpha.14_${ARCH}.deb
```

To install only the two tools, extract them from the downloaded package instead of installing it:

```sh
dpkg-deb -x cartesi-rollups-node-v2.0.0-alpha.14_${ARCH}.deb out/
sudo cp out/usr/bin/cartesi-rollups-cli out/usr/bin/cartesi-rollups-machine-tool /usr/local/bin/
```

### macOS

Build the tools from source. You need Go >= 1.27.3 and GNU Make >= 3.81. Install Go with Homebrew (macOS already ships GNU Make 3.81):

```sh
brew install go
```

Then clone the release tag and build only the two tools. Both are pure Go programs, so this step does not link against the emulator library:

```sh
git clone --branch v2.0.0-alpha.14 https://github.com/cartesi/rollups-node.git
cd rollups-node
make cartesi-rollups-cli cartesi-rollups-machine-tool
sudo install -m 0755 cartesi-rollups-cli cartesi-rollups-machine-tool /usr/local/bin/
```

Make sure `/usr/local/bin` is on your `PATH`. The machine tool still runs the `cartesi-machine` emulator installed above.

## Lua 5.4 (PRT applications only)

For an application that uses PRT (Dave) consensus, `cartesi-rollups-machine-tool replay` runs a Lua script. It needs Lua 5.4 and the emulator's Lua modules:

- **Lua 5.4.** The tool runs `lua5.4` by default; pass another executable with `--lua`. On Linux, the emulator package above already installed `lua5.4`. On macOS, Homebrew installs Lua 5.4 as a dependency of the emulator (`lua@5.4`) but does not put it on your `PATH`, so pass it explicitly: `--lua "$(brew --prefix lua@5.4)/bin/lua5.4"`.
- **The emulator's Lua modules.** The tool finds them from the `cartesi-machine` installation. If replay cannot load the `cartesi` Lua module, pass `--cartesi-sdk-root` with the emulator's installation prefix (the directory that contains `share/lua/5.4`).

## Verify

```sh
cartesi-machine --version          # 0.22.x
cartesi-rollups-cli --version      # 2.0.0-alpha.14
cartesi-rollups-machine-tool --help
```

Once these run, continue with the [Emergency Withdrawal Recovery Guide](./recovery-guide.md).
