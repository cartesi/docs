# Known Issues & Limitations

Cartesi Coprocessor is in an early stage of development, and there are several limitations developers should be aware of in the current release. Below is a list of known issues and constraints to consider when building with the framework.

### 1. Lack of Error Handling mechanisms
A sophisticated error handling is not included in the current alpha release. Meaning the status in form of accept/reject/exception reasons is not relayed as part of result to the underlying blockchain. On application level, developers can log errors and exceptions by emitting "notice" messages. This approach allows for some level of debugging but is not a substitute for finding all rejection reasons.

### 2. Built-in Asset Handling is Not Supported
Currently, the framework does not support asset handling inside the Coprocessor logic. This means that bridging ETH, ERC-20, ERC-721 tokens etc. is not available out of the box. Developers are encouraged to design their own tools to manage asset transfers where necessary.  

### 3. System Compatibility
Coprocessor environment has been tested and is compatible with Unix-based systems, specifically Linux and MacOS. If you are using Windows, you might run into unexpected issues. It's not a recommended OS but using Windows Subsystem for Linux (WSL) could be a workaround.

### 4. Supported Networks
Coprocessor currently supports only Holesky and Ethereum mainnet. Additionally, a dedicated local developer network is provided within the framework for testing and development purposes. Please note that network support is dependent on Eigenlayer infrastructure availability.

### 5. Cryptoeconomic Security
Currently, the computations are not secured by any cryptoeconomic security mechanism. It's planned for future releases. The infrastructure provides a single specialized node Operator and Solver where developers can delpoy and publish their Coprocessor machines.

Feel free to get in touch with the Cartesi contributors on [Discord](https://discord.gg/cartesi) if you have any questions or need assistance.
