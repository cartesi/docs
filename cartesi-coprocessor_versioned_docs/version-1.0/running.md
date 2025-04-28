# Running the Cartesi Coprocessor

Follow this guide to set up Foundry, run the Cartesi Coprocessor devnet, and interact with the Coprocessor.

:::info Ensure Foundry is installed and accessible:

```bash
forge --version
```

If you don't have Foundry installed, please refer to the [installation guide](./installation.md#install-foundry) and set it up before proceeding.
:::

## Step 1: Start your devnet

The devnet is a simulated environment where developers can test their applications or smart contracts before deploying them to a mainnet (the primary live network). The CLI uses the foundry's anvil devnet by default.

**Run the Cartesi Coprocessor Devnet Environment:**

```bash
cartesi-coprocessor start-devnet
```

**To stop and clean up the environment later, use:**

```bash
cartesi-coprocessor stop-devnet
```

:::tip Test Accounts
You might need a few wallets to test your dApp. Here are some that already have assets on the devnet for your testing purposes.

```
Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH) Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Account #1: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 (10000 ETH) Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
Account #2: 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc (10000 ETH) Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

:::

:::tip Using the template
You can optionally clone the base contract template for reference and implementation:

```bash
git clone https://github.com/Mugen-Builders/coprocessor-base-contract
```

:::

## Step2: Install the Base Contract

Install the base contract in your project:

```bash
forge install https://github.com/Mugen-Builders/coprocessor-base-contract --no-commit
```

## Step3: Import and Inherit the Base Contract

Add the base contract to your project:

```solidity
import "cartesi-coprocessor-base-contract/CoprocessorAdapter.sol";

contract MyContract is CoprocessorAdapter {
    constructor(address _taskIssuerAddress, bytes32 _machineHash)
        CoprocessorAdapter(_taskIssuerAddress, _machineHash)
    {}

    // Add your business logic here
}
```

:::tip Responses from the coprocessor
The `handleNotice` function in the `CoprocessorAdapterSample.sol` smart contract is triggered by notices sent from the Python/JS/Go/Rust application. It is invoked directly when the Coprocessor interacts with the smart contract.
:::

## Step 4: Get the important addresses

```bash
cartesi-coprocessor address-book
```

This command prints a list of useful contacts and their addresses.

:::note Retrieving important addresses
Running this command in the directory containing your Cartesi program and not the base directory or solidity contract directory also displays the **machine hash** of your program if your program has been built previously. It also contains the **task issuer**, which is the Coprocessor address your smart contract needs during the contract deployment step.
:::

## Step 5: Deploy the Smart Contract

Deploys the solidity contract of your project to any specified network of your choice.

```bash
cartesi-coprocessor deploy --contract-name <contract name> --network devnet --constructor-args <arguments seperated by single space>
```

For the base examples provided, the arguments will be Coprocessor Address and Machine Hash, both of which can be obtained from the address-book command on the previous step.

```bash
cartesi-coprocessor deploy --contract-name MyContract --network devnet --constructor-args <Coprocessor Address> <Machine Hash>
```

:::note Run in the correct directory
This should be run in the directory for your solidity contract not the base directory.
:::

:::note Multiple Deploys
Each successful deployment is logged and stored in a separate directory called deployment_history.
:::
