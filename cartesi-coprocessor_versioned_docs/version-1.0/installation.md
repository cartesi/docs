# Installation

This guide outlines the installation of the tools needed to set up your environment. Currently, all these tools are essential for proper setup, though efforts are underway to streamline the process and minimize external dependencies.

## Prerequisites

### 1. **Coprocessor CLI**

The Cartesi Coprocessor CLI tool simplifies bootstrapping, registering, and deploying Cartesi Coprocessor programs. This tool streamlines the development workflow for Cartesi based applications, allowing developers to focus on building their logic instead of wrestling with setup and deployment processes.

#### Installing via Binary Download:

- Step 1: Download the Binary File:

  Visit [the release page](https://github.com/Mugen-Builders/co-processor-cli/releases) of the CLI to download the latest binary file for Your OS.

- Step 2: Extract the Tarball

  Open your terminal, navigate to the directory where the downloaded binary is located, and then extract the file by running the command:

  ```bash
  tar -xzf cartesi-coprocessor-aarch64-apple-darwin.tar.gz
  ```

- Step 3: Move the Binary to a System Path (Optional but Recommended)

  To make the CLI tool accessible from anywhere, move the binary to a directory in your system’s PATH, such as /usr/local/bin:

  ```bash
  sudo mv cartesi-coprocessor /usr/local/bin/
  ```

- Step 4: Make the Binary Executable

  Ensure the binary has executable permissions, by running this command:

  ```bash
  sudo chmod +x /usr/local/bin/cartesi-coprocessor
  ```

- Step 5: Add the Binary to .zshrc or .bashrc PATH

  - Open the .zshrc file in a text editor (e.g., nano or vim):

    ```bash
    nano ~/.zshrc       # or nano ~/.bashrc
    ```

  - Add the following line to the end of the file to include the /usr/local/bin directory in your PATH:

    ```bash
    export PATH="/usr/local/bin:$PATH"
    ```

  - Save the file and exit the editor:

    In nano: Press Ctrl + X, then Y, and Enter to save and exit, while in vim: Press Esc, then type :wq and press Enter.

  - Apply the changes to your current terminal session:

    ```bash
    source ~/.zshrc      # or source ~/.bashrc
    ```

- Step 6: Verify Installation

  Test if the tool is installed correctly by running:

  ```bash
  cartesi-coprocessor --version
  ```

#### Using Cargo

Ensure [Rust and Cargo](https://www.rust-lang.org/tools/install) are installed, then install the CLI tool from crates.io:

```bash
cargo install cartesi-coprocessor
```

To test that you have Cartesi Coprocessor CLI installed, you can run the following command:

```bash
cartesi-coprocessor --version
```

#### From Source

Clone and build the tool manually:

```bash
git clone https://github.com/Mugen-Builders/co-processor-cli
cd co-processor-cli
cargo install --path .
```

:::warning
Ensure all required dependencies are installed before using this tool.
:::

### 2. **Docker Desktop**

Docker Desktop is a must-have requirement that comes pre-configured with two necessary plugins for building Cartesi dApps:

- Docker Buildx
- Docker Compose
  [Install the latest version of Docker Desktop](https://www.docker.com/products/docker-desktop/) for your operating system.

Install RISC-V support by running:

```bash
docker run --privileged --rm tonistiigi/binfmt --install all
```

### 3. **Cartesi CLI**

The Cartesi CLI is an easy-to-use tool for developing and deploying Cartesi Rollups dApps. In this tutorial, we use the Cartesi CLI as a prerequisite for the Coprocessor CLI, as it is responsible for building the Cartesi Machine image that will be used by your solution in the background.

Install the Cartesi CLI globally:

```bash
npm i -g @cartesi/cli
```

To test that you have Cartesi CLI installed, you can run the following command:

```bash
cartesi doctor
```

### 4. **Install Foundry**

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

---

## Optional tools that can help on your journey

### Web3 Storage CLI

For mainnet deployment, Web3 Storage stores your application's artifact, which is executed when the Coprocessor is called. However, for testnet or devnet, you don’t need to concern yourself with Web3 Storage, as your application artifact is uploaded directly to the Coprocessor solver.

Install the CLI globally:

```bash
npm install -g @web3-storage/w3cli
```

Refer to the [official documentation](https://web3.storage/docs/w3cli/) for more details.

### Nonodo

[Nonodo](https://github.com/Calindra/nonodo) is a development node for Cartesi Rollups that was designed to work with applications running in the host machine instead of the Cartesi Machine. So, the developer doesn't need to be concerned with compiling their application to RISC-V. The application back-end should run in the developer's machine and call the Rollup HTTP API to process advance and inspect inputs. Nonodo is a valuable development workflow tool, but there are some caveats the developer must be aware of.

Install Nonodo, a local testing tool emulating Cartesi's Node, using npm:

```bash
npm install -g nonodo
```

### Cartesi Machine Binary

The goal of these binaries is to make it easy to distribute the Cartesi Machine across different platforms and architectures. Just grab and run no matter what host you are running on!

The archives are designed to be dependency-free, thereby minimizing installations on your host system. Notably, you don't need Lua to run anything, since the Cartesi Machine becomes an executable binary.

The goal is to make it easy for anyone to hack applications using the Cartesi Machine, no matter if you want to use just the CLI, its C API, script with Lua, or build other statically linked binaries on top.

#### Download and Extract

1. Download the Cartesi Machine for your OS from [this link](https://github.com/edubart/cartesi-machine-everywhere/releases).
2. Extract the `.tar.xz` file:

```bash
tar -xf <filename>.tar.xz
```

Replace `<filename>` with the actual file name.

#### Setup Environment Variables

1. Rename the extracted folder to `cartesi-machine`:

```bash
mv <extracted-folder-name> cartesi-machine
```

2. Add the `bin` directory to your system’s PATH:

- Open your shell configuration file (`~/.bashrc`, `~/.zshrc`, etc.) and add:

```bash
export PATH=$PATH:/path/to/cartesi-machine/bin
```

- Replace `/path/to/cartesi-machine/bin` with the actual path.

3. Refresh your terminal:

```bash
source ~/.bashrc   # For bash
source ~/.zshrc    # For zsh
```

#### Verify Installation

Run the following command to verify:

```bash
cartesi-machine --help
```

:::note
For Mac Users\*\*: You may encounter a security prompt. Refer to the [troubleshooting section](./troubleshooting#cartesi-machine-blocked-by-mac-security) for resolution. :::
