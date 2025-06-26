---
id: delegate-call-vouchers
title: DELEGATECALL Vouchers
---

:::danger Security Considerations
DELEGATECALL Vouchers are a powerful feature that should be used with extreme caution. Incorrect implementation can lead to serious security vulnerabilities as the target contract's code has full access to the Application contract's storage and funds.
:::

DELEGATECALL Vouchers are an extension of vouchers that enables advanced smart contract interactions through the [`DELEGATECALL`](https://www.evm.codes/?fork=cancun#f4) opcode.

Unlike regular vouchers, DELEGATECALL vouchers allow dApps to separate their execution logic from their storage context. When using DELEGATECALL voucher, the Application contract always maintains the storage, context, and funds (both ETH and tokens), while the target contract provides only the execution logic. This separation enables more flexible and reusable smart contract patterns while keeping all state changes and assets within the Application contract.

When a DELEGATECALL voucher is executed through the Application contract, the code at the target address is executed with the following characteristics:

- All storage operations occur in the Application contract's storage space
- All funds (ETH and tokens) remain in and are managed by the Application contract
- The msg.sender and msg.value from the original transaction are preserved
- The execution logic comes from the target contract, but operates on the Application contract's state and funds

This mechanism, where the Application contract maintains the state and funds while borrowing logic from other contracts, enables powerful patterns such as:

- **Paid Vouchers**: Vouchers that provide payment to the user who executes them.

- **Future Vouchers**: Vouchers that are time-locked and can only be executed after a specific timestamp.

- **Expirable Vouchers**: Vouchers that have an expiration timestamp, after which they can no longer be executed.

- **Targeted Vouchers**: Vouchers that are restricted to execution by specific addresses or a list of authorized addresses.

- **Atomic Vouchers**: A sequence of message calls that must be executed in order, ensuring atomicity of the operations.

- **Re-executable Vouchers**: Vouchers that can be executed multiple times, unlike standard vouchers which can only be executed once.

- **Ordered Vouchers**: Vouchers that must be executed in a specific sequence. For example, voucher A can only be executed after voucher B has been executed.

The [`Application`](../contracts/application.md) contract handles the execution of DELEGATECALL vouchers through its [`executeOutput()`](../../contracts/application/#executeoutput) function, which validates and processes the DELEGATECALL operation on the blockchain.

## Implementation Considerations

When implementing DELEGATECALL vouchers, consider the following:

1. **Storage Layout**: Since all storage operations happen in the Application contract, the storage layout of the target contract must be compatible with the Application contract's layout to prevent unintended storage collisions.

2. **Security**: Since DELEGATECALL operations execute code in the context of the Application contract, careful validation of the target contract and its code is essential to prevent malicious modifications to the Application's state.

3. **State Management**: All state changes occur in the Application contract's storage, making it the single source of truth for the application's state.

:::note create a DELEGATECALL voucher
[Refer to the documentation here](../../development/asset-handling.md) for implementing DELEGATECALL vouchers in your dApp.
:::

## Execution Context

In a DELEGATECALL voucher execution:

- The Application contract provides the execution context and storage
- The target contract provides only the logic to be executed
- All storage operations affect the Application contract's state
- msg.sender and msg.value from the original transaction are preserved

This architecture, where the Application contract maintains all state while being able to execute logic from other contracts, makes DELEGATECALL vouchers particularly useful for customizable logics while keeping all application state centralized in the Application contract.

## Epoch Configuration

An epoch refers to a specific period during which a batch of updates is processed off-chain, and upon agreement by validators, the finalized state is recorded on-chain.

Epoch Length is the number of blocks that make up an epoch. It determines how long each epoch lasts in terms of block counts. For instance, if an epoch length is set to 7200 blocks, the epoch will end once 7200 blocks have been processed. This length directly influences how frequently updates are finalized and recorded on the blockchain.

Delegate call vouchers, like regular vouchers, are executed on the blockchain upon the closure of the corresponding epoch. This ensures that all state changes and logic executions are properly validated and recorded in the blockchain.

You can manually set the epoch length to facilitate quicker execution of DELEGATECALL vouchers during development.

:::note epoch duration
[Refer to the documentation here](../../development/cli-commands.md/#run) to manually configure epoch length during development.
:::