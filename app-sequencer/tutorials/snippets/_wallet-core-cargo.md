```toml title="app-core/Cargo.toml"
[package]
name = "app-core"
version.workspace = true
edition.workspace = true
license.workspace = true

[dependencies]
sequencer-core.workspace = true
alloy-primitives.workspace = true
alloy-sol-types.workspace = true
ssz.workspace = true
ssz_derive.workspace = true
serde.workspace = true
serde_json.workspace = true
tracing.workspace = true
types.workspace = true
```
