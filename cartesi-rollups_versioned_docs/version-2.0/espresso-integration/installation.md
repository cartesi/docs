# Installation

## Tools Required

- Docker Desktop: Required to run Node Docker containers.
- Cartesi CLI: A command line tool to create, build and run Cartesi Rollups applications.
- Nonodo: A rapid prototyping tool to simulate Espresso and Cartesi integration.
- Cartesi Machine: The virtual machine binary to run your application's backend logic.

## Steps to Install

### 1. Docker Desktop

- Install Docker Desktop from [here](https://www.docker.com/products/docker-desktop/).

:::note

To install Docker RISC-V support without using Docker Desktop, run the following command:

```bash
docker run --privileged --rm tonistiigi/binfmt --install all
```

:::

### 2. Cartesi CLI

- Install Cartesi CLI version 2.0.0 compatible with Cartesi Rollups Node v2:

```bash
npm i -g @cartesi/cli@alpha
```

### 3. Nonodo

- We'll install Nonodo beta version that supports Espresso integration. Run the following command:

```bash
npm i -g nonodo@beta
```

### 4. Cartesi Machine

- Download the Cartesi machine for your OS from [this link](https://github.com/edubart/cartesi-machine-everywhere/releases).

**For Linux and macOS:**

- Extract the tar.xz file:

```bash
   tar -xf <filename>.tar.xz
```

Replace `\<filename\>` with the actual name of the file you downloaded.

- Navigate to the extracted directory, rename the extracted folder to `cartesi-machine`:

```bash
cd <cartesi-machine>
```

- Set up environment variables for the Cartesi Machine. You'll need to add the `bin` directory to your system’s PATH so that you can run the Cartesi Machine binaries from anywhere. For Linux or macOS, you can do this by adding the following line to your `\~/.bashrc`, `\~/.bash_profile`, or `\~/.zshrc` file, depending on your shell:

```bash
  export PATH=$PATH:/path/to/cartesi-machine/bin
```

Replace `/path/to/cartesi-machine/` with the actual path to the `bin` folder inside the extracted directory, you can get this by running the command in your terminal while inside the cartesi machine folder: `pwd`. This should print out the path to location of the cartesi-machine folder.

- After adding the line, refresh your terminal configuration by running:

```bash
   source ~/.bashrc
```

Or, if you're using zsh:

```bash
   source ~/.zshrc
```

- Verify the installation by checking if the Cartesi Machine binary is available. You can do this by running:

```bash
   cartesi-machine --help
```

This should display the available options for the Cartesi Machine, indicating that it’s correctly set up.

:::warning

For Mac users, running this command might trigger a prompt from Mac built in security feauture. Check this part of the [troubleshooting section](./troubleshooting#1-cartesi-machine-blocked-by-mac-security-feautures) for more guidelines on how to resolve this.

:::
