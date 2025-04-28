# Picking the right stack

### How is the Coprocessor different from Cartesi Rollups?

Both **Cartesi Rollups** and **Cartesi Coprocessor** are development frameworks that leverage the Cartesi Machine for execution. They differ in how they manage state, handle assets, secure computations and deployment.

| Feature                  | Cartesi Rollups | Cartesi Coprocessor |
|--------------------------|----------------|---------------------|
| **State Management**     | State preserved within the rollup machine | State maintained on the application smart contract |
| **Asset Handling**       | Mature framework with pre-deployed portal contracts for bridging assets | Lacks built-in asset handling; developers are encouraged to contribute |
| **Security Model**       | Optimistic fraud proofs secure computations |  Leverages EigenLayer’s crypto-economic security |
| **Developer Maturity**   | More mature ecosystem with existing infrastructure | Emerging framework with potential for new tooling and contributions |
| **Use Case Suitability** | Ideal for dApps requiring continuous state management and deployment of app-chains | Best for off-loading computation-heavy tasks with **fast finality**, where state is only needed temporarily |
