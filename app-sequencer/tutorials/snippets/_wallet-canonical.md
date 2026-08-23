```toml title="canonical-app/Cargo.toml"
[package]
name = "wallet-canonical"
version.workspace = true
edition.workspace = true
license.workspace = true

[dependencies]
app-core.workspace = true
sequencer-canonical.workspace = true
trolley.workspace = true
```

```rust title="canonical-app/src/main.rs"
use app_core::{
    BATCH_SUBMITTER_ADDRESS, WalletApp, WalletConfig,
};
use sequencer_canonical::{
    SchedulerConfig, run_scheduler_forever,
};
use trolley::cmt::RollupCmt;

fn main() {
    let rollup = RollupCmt::try_new()
        .expect("failed to initialize rollup I/O");

    run_scheduler_forever(
        rollup,
        WalletApp::new(WalletConfig::devnet()),
        SchedulerConfig::new(BATCH_SUBMITTER_ADDRESS),
    );
}
```
