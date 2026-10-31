```rust title="app-core/src/lib.rs"
mod method;
mod wallet;

pub use method::{Method, Transfer, Withdrawal};
pub use wallet::{
    BATCH_SUBMITTER_ADDRESS, DEVNET_ERC20_PORTAL_ADDRESS,
    DEVNET_TEST_TOKEN_ADDRESS, WalletApp, WalletConfig,
};
```
