# Running the Cartesi Coprocessor

Follow this guide to set up Foundry, run the Cartesi Coprocessor devnet, and interact with the Coprocessor.
:::info Ensure Foundry is installed and accessible:

```bash
forge --version
```

If you don't have Foundry installed, please refer to the [installation guide](../installation.md#install-foundry) and set it up before proceeding.
:::

# Manually running

## Step 1: Start your devnet

Run the Cartesi Coprocessor Devnet Environment.

Clone the Cartesi Coprocessor repository:

```bash
git clone https://github.com/zippiehq/cartesi-coprocessor
cd cartesi-coprocessor
```

Initialize and update submodules:

```bash
git submodule update --init --recursive
```

Start the devnet environment using Docker Compose:

```bash
docker compose -f docker-compose-devnet.yaml up --wait -d
```

To stop and clean up the environment later, use:

```bash
docker compose -f docker-compose-devnet.yaml down -v
```

Import the machine CAR file:

```bash
curl -X POST -F file=@output.car http://127.0.0.1:5001/api/v0/dag/import
```

Confirm the operator is downloading the dApp machine:

```bash
curl -X POST "http://127.0.0.1:3034/ensure/$CID/$MACHINE_HASH/$SIZE"
```

Ensure the following environment variables are set (if not already):

```bash
CID=$(cat output.cid)
SIZE=$(cat output.size)
MACHINE_HASH=$(xxd -p .cartesi/image/hash | tr -d '\n')
```

You can start sending inputs once the status is marked as **ready**.

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

## Step 2: Install the Base Contract

Install the base contract in your project:

```bash
forge install https://github.com/Mugen-Builders/coprocessor-base-contract --no-commit
```

### Import and Inherit the Base Contract

Add the base contract to your project:

```solidity
import "../lib/coprocessor-base-contract/src/CoprocessorAdapter.sol";

contract MyContract is CoprocessorAdapter {
    constructor(address _coprocessorAddress, bytes32 _machineHash)
        CoprocessorAdapter(_coprocessorAddress, _machineHash)
    {}

    // Add your business logic here
}
```

:::tip Responses from the coprocessor
The `handleNotice` function in the `CoprocessorAdapterSample.sol` smart contract is triggered by notices sent from the Python application. It is invoked directly when the Coprocessor interacts with the smart contract.
:::

## Step 3: Install Dependencies

Run the following command to install all required dependencies:

```bash
forge install
```

## Step 4: Build the Contract

Build your smart contract:

```bash
forge build
```

## Step 5: Deploy the Smart Contract

For example, if you are using the `CoprocessorAdapterSample.sol` contract from the repository, deploy it as follows:

```bash
cd contracts
```

```bash
forge create --broadcast \
      --rpc-url <your_rpc_url> \
      --private-key <your_private_key> \
      ./src/CoprocessorAdapterSample.sol:CoprocessorAdapterSample \
      --constructor-args <task_issuer_address> <machine_hash>
```

:::info Example Values for Local Development:

- **RPC URL**: `http://127.0.0.1:8545`
- **Task Issuer Address**: Obtain this value from the `task_issuer` in `config-devnet.toml`.
- **Machine Hash**: Obtain this from the Cartesi backend deployment output. You can get it from the environment variables set in step 1.
  :::

:::tip
Save the deployed contract address for frontend interaction.
:::
