```rust title="app-core/src/method.rs"
use alloy_primitives::{Address, U256};
use ssz_derive::{Decode, Encode};

pub const MAX_METHOD_PAYLOAD_BYTES: usize = 1 + 32 + 20;

#[derive(Debug, Clone, PartialEq, Eq, Encode, Decode)]
#[ssz(enum_behaviour = "union")]
pub enum Method {
    Withdrawal(Withdrawal),
    Transfer(Transfer),
}

#[derive(Debug, Clone, PartialEq, Eq, Encode, Decode)]
pub struct Withdrawal {
    pub amount: U256,
}

#[derive(Debug, Clone, PartialEq, Eq, Encode, Decode)]
pub struct Transfer {
    pub amount: U256,
    pub to: Address,
}
```
