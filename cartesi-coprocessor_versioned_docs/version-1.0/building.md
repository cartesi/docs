# Building your dApp

:::info
All the instructions listed on this page are for building using the [Cartesi Coprocessor CLI](https://github.com/Mugen-Builders/co-processor-cli). For an approach that does not use the CLI, please refer to the [manual section](./manually/building.md#building-your-dapp) of this tutorial.
:::

---

## Step 1: Bootstrap a Project

Create a new Cartesi dApp project:

```bash
cartesi coprocessor create --dapp-name <project_name> --template <go, python, javascript, rust>
cd my-cartesi-project
```

This creates a directory containing 2 subdirectories: 'app' and 'contracts'. App contains the Cartesi template for your specified language while contract holds the solidity template for your base layer contract.

## Step 2: Start the Coprocessor Devnet Environment

Start the coprocessor devnet environment by running the below command:

```bash
cartesi coprocessor start
```

This command start the necessary containers for the coprocessor as well as a local anvil network, so it's important that you have docker running and active.

## Step 3: Build the Project

Implement your business logic by editing the pre-generated templates in the `contracts/src` and `app` folder to customize your logic, after which you run the below commands to build both subdirectories.

```bash
cd app
cartesi build
```

```bash
cd ../contracts
forge soldeer install
```
