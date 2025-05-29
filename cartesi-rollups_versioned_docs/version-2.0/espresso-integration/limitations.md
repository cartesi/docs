# Known Issues and Limitations

## 1. Delayed L1 Transactions
As mentioned in the guide architecture, there are two types of transactions. While the inputs sent via L2(EIP-712 signed messages) are near instant, the L1 transactions are delayed. There is a significant delay of 15-20 minutes for L1 type inputs to be processed. It is recommended to design the application to use L2 type inputs as much as possible and L1 inputs only when necessary.

## 2. Supported networks
The current implementation of Espresso network is only compatible with the Ethereum Sepolia testnet and Ethereum mainnet. Any other EVM compatible networks are not supported yet.


