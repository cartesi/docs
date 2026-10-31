```toml title="app-sequencer/Cargo.toml"
[package]
name = "app-sequencer"
version.workspace = true
edition.workspace = true
license.workspace = true

[dependencies]
app-core.workspace = true
sequencer.workspace = true
tokio.workspace = true
tracing-subscriber.workspace = true
```

```rust title="app-sequencer/src/main.rs"
use app_core::{WalletApp, WalletConfig};
use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() -> std::process::ExitCode {
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| EnvFilter::new("info")),
        )
        .init();

    sequencer::run_main(|| WalletApp::new(WalletConfig::devnet())).await
}
```
