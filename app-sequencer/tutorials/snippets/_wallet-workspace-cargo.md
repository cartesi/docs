```toml title="Cargo.toml"
[workspace]
resolver = "2"
members = ["app-core", "app-sequencer", "canonical-app"]

[workspace.package]
version = "0.1.0"
edition = "2024"
license = "Apache-2.0"

[workspace.dependencies]
app-core = { path = "app-core" }
sequencer = { git = "https://github.com/cartesi/sequencer", tag = "v0.1.0-alpha.9" }
sequencer-core = { git = "https://github.com/cartesi/sequencer", tag = "v0.1.0-alpha.9" }
sequencer-canonical = { package = "canonical-app", git = "https://github.com/cartesi/sequencer", tag = "v0.1.0-alpha.9" }
alloy-primitives = { version = "1.6", features = ["serde", "k256"] }
alloy-sol-types = "1.6"
ssz = { package = "ethereum_ssz", version = "0.10" }
ssz_derive = { package = "ethereum_ssz_derive", version = "0.10" }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1.53", features = ["macros", "rt-multi-thread"] }
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter"] }
types = { version = "0.1", git = "https://github.com/GCdePaula/cartesi-tools-rs", rev = "ed14b98ecfe9796dc3ca7c9b96bfdbf0ef9baf22" }
trolley = { version = "0.1", git = "https://github.com/GCdePaula/cartesi-tools-rs", rev = "ed14b98ecfe9796dc3ca7c9b96bfdbf0ef9baf22" }
```
