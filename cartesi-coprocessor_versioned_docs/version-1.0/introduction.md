:::warning
    🚧 You’re reading docs for the Cartesi Coprocessor (alpha version), expect rapid changes and improvements! Join Cartesi [Discord](https://discord.gg/cWGbyFkQ2W) to ask questions and get support.
:::

# Introduction

### Introduction to the Cartesi Coprocessor

A Coprocessor is a system that enables a smart contract to offload complex computations to an external platform and bring the processed results back onto the blockchain. The Cartesi Coprocessor is a cryptoeconomic mechanism that uses EigenLayer and restaked value to secure computations. Operators who misbehave or provide incorrect results are subject to slashing. Cartesi executes computations in a Linux-compatible RISC-V virtual machine.

At its core, the Cartesi Coprocessor:

- **Executes computations in a Cartesi Machine**: A virtual machine with a Linux runtime, allowing for more extensive and familiar programming environments compared to EVM-based smart contracts.
- **Provides security guarantees**: Results from the Coprocessor can be verified on-chain using proofs, ensuring trust and integrity.
- **Enables modular and scalable dApp designs**: Developers can move complex logic off-chain while interacting seamlessly with the blockchain through notices.

This design is ideal for applications requiring heavy data processing with fast finality.

---

### How the Cartesi Coprocessor Works

1. **Deployment and Registration**:

   - A dApp is deployed with a smart contract inheriting from `CoprocessorAdapter`.
   - The Cartesi Machine is instantiated and configured with the dApp's specific logic.

2. **Execution Flow**:
   - **Input Handling**: Users interact with the smart contract via regular calls, they can pass raw data that could be directly passed to the Coprocessor or specific data the function requires. The contract might implement logic, hold state information or perform any other task.
   - **Coprocessor Interaction**: The contract calls `callCoprocessor`, which sends the input to the Cartesi Coprocessor environment.
   - **Off-Chain Processing**: The Coprocessor executes the logic in the Cartesi Machine based on the provided input.
   - **Notices and Outputs**: Results are processed off-chain and sent back to the blockchain as notices, which the smart contract can handle through the overridden method `handleNotice`.

---

### Interacting with the Cartesi Coprocessor

You can interact with the Coprocessor the same way you would with any regular Solidity smart contract. Take a look at [`CounterCaller`](https://github.com/Mugen-Builders/cartesi-coprocessor-template/blob/main/contracts/src/CounterCaller.sol) Contract and its [Coprocessor contract](https://github.com/Mugen-Builders/cartesi-coprocessor-template/blob/main/backend-cartesi-counter-js/src/index.js) running JS Logic for example.

---

### Interaction Example: What Happens?

#### 1. **User Interaction**

- A user sends a transaction to the deployed `CounterCaller` contract's `runExecution` function, passing encoded input data. This input specifies the computation the Coprocessor should perform.

#### 2. **Coprocessor Communication**

- The `CounterCaller` contract uses the `callCoprocessor` function to forward the input to the Cartesi Coprocessor.
- The Coprocessor processes the input in the Cartesi Machine, running the logic in a Linux-based environment.

#### 3. **Result Handling**

- Once processing is complete, the Coprocessor generates a **notice** (output) containing the result.
- The `handleNotice` function in the `CounterCaller` contract is triggered with the notice. This function:
  - Decodes the result (in this case, a new counter value).
  - Updates the `count` variable with the result.
  - Emits a `ResultReceived` event with the output.

#### 4. **Inspecting new State**

- The user can view the updated `count` value by calling the `get` function.
- Logs of the `ResultReceived` event provide additional feedback, including the raw output from the Coprocessor.

---
### How is the Coprocessor different from Cartesi Rollups?

Both **Cartesi Rollups** and **Cartesi Coprocessor** are development frameworks that leverage the Cartesi Machine for execution. They differ in how they manage state, handle assets, secure computations and deployment.

| Feature                  | Cartesi Rollups | Cartesi Coprocessor |
|--------------------------|----------------|---------------------|
| **State Management**     | State preserved within the rollup machine | State maintained on the application smart contract |
| **Asset Handling**       | Mature framework with pre-deployed portal contracts for bridging assets | Lacks built-in asset handling; developers are encouraged to contribute |
| **Security Model**       | Optimistic fraud proofs secure computations |  Leverages EigenLayer’s crypto-economic security |
| **Developer Maturity**   | More mature ecosystem with existing infrastructure | Emerging framework with potential for new tooling and contributions |
| **Use Case Suitability** | Ideal for dApps requiring continuous state management and deployment of app-chains | Best for off-loading computation-heavy tasks with **fast finality**, where state is only needed temporarily |


