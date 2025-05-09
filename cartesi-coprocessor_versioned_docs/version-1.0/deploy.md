# Deploying to Devnet

This guide uses foundry and viem to build and deploy your dApp to the local Anvil network.

:::info Ensure Foundry is installed and accessible:

```bash
forge --version
```

If you don't have Foundry installed, please refer to the [installation guide](installation.md) and set it up before proceeding.
:::

## Step 1: Get the important addresses

```bash
cartesi address-book
```

This command prints a list of useful contacts and their addresses. Take note of the `task issuer` address as this would be used during the deployment stage.

---

## Step 2: Deploy the Project

The deploy step handles publishing your coprocessor program to the solver as well as deploying your solidity contract to the local Anvil network. This command can be run from the root folder or any of the two subfolders (apps or contracts).

```bash
cartesi coprocessor deploy <contract_name> --constructorArgs <constructor_arguments>
```

If your contract has constructor arguments, you must pass them in the exact order defined by the constructor, separated by a single space. If the constructor expects only one argument, pass just that argument. If no arguments are expected, nothing should be passed.

For example, consider a constructor that accepts two parameters:

```solidity
constructor(bytes32 machineHash, address taskIssuer) { ... }
```

In this case, the arguments should be passed like this:

```bash
cartesi coprocessor deploy MyContract --constructorArgs 0x1234abcd...dca0 0xABCD5678...ef0f
```

Where 0x1234abcd...dca0 is the 32-byte machine hash, and 0xABCD5678...ef0f is the task issuer’s address.

Ensure that each argument matches the expected type and order otherwise the deployment may fail.

:::info On your local environment
At the end of the development and testing process, you can choose to stop the coprocessor devnet environment using the below process.

**To stop and clean up the environment later, use:**

```bash
cartesi coprocessor stop
```

:::
