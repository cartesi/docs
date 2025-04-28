# Deploying to testnet/mainnet

This guide uses Foundry to deploy your dApp to testnet or mainnet.

:::info Ensure Foundry is installed and accessible:

```bash
forge --version
```

If you don't have Foundry installed, please refer to the [installation guide](installation.md) and set it up before proceeding.
:::

## Step 1: Publish the Program

Publish your program to the Coprocessor:

```bash
cartesi-coprocessor publish --network <testnet, mainnet>
```

:::note  
This should be run in the directory for your Cartesi program.
Not the base directory or the solidity contract directory.
:::

## Step 2: Get the important addresses

```bash
cartesi-coprocessor address-book
```

This command prints a list of useful contacts and their addresses.

:::note Retrieving important addresses
Running this command in the directory containing your Cartesi program and not the base directory or solidity contract directory also displays the **machine hash** of your program if your program has been built previously. It also contains the **task issuer** which is the Coprocessor address your smart contract needs.

You can use those during the contract deployment step.
:::

---

## Step 3: Deploy the Smart Contract

Deploys the solidity contract of your project to any specified network of your choice

```bash
cartesi-coprocessor deploy --contract-name <contract name> --network <testnet, mainnet> --constructor-args <arguments separated by single space>
```

:::note Run in the correct directory
This should be run in the directory for your solidity contract not the base directory.
:::

:::note Multiple Deploys
Each successful deployment is logged and stored in a separate directory called deployment_history.
:::
