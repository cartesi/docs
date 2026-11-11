```rust title="app-core/src/wallet.rs"
use std::collections::HashMap;
use std::io::Write;
use std::path::{Path, PathBuf};

use alloy_primitives::{Address, U256, address};
use alloy_sol_types::{SolCall, sol};
use serde::{Deserialize, Serialize};
use ssz::Decode;
use tracing::{error, warn};
use types::{Erc20Deposit, Erc20Transfer};

use crate::method::{MAX_METHOD_PAYLOAD_BYTES, Method};
use sequencer_core::application::{
    AppError, AppOutput, AppOutputs, Application, InvalidReason,
};
use sequencer_core::l2_tx::{DirectInput, ValidUserOp};
use sequencer_core::user_op::UserOp;

pub const DEVNET_ERC20_PORTAL_ADDRESS: Address =
    address!("0x22E57511C30CcE6CDaa742E13CE3b774fDC663b1");
pub const DEVNET_TEST_TOKEN_ADDRESS: Address =
    address!("0x88A2120B7068E78692C8fd12E751d610B6377E4d");
pub const BATCH_SUBMITTER_ADDRESS: Address =
    address!("0xa0Ee7A142d267C1f36714E4a8F75612F20a79720");

sol! {
    function DepositNotice(
        address token,
        address sender,
        uint256 amount
    ) external;
    function TransferNotice(
        address sender,
        address recipient,
        uint256 amount
    ) external;
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct WalletConfig {
    pub erc20_portal: Address,
    pub token: Address,
    pub fee_recipient: Address,
}

impl WalletConfig {
    pub const fn devnet() -> Self {
        Self {
            erc20_portal: DEVNET_ERC20_PORTAL_ADDRESS,
            token: DEVNET_TEST_TOKEN_ADDRESS,
            fee_recipient: BATCH_SUBMITTER_ADDRESS,
        }
    }
}

#[derive(Debug, Clone)]
pub struct WalletApp {
    config: WalletConfig,
    balances: HashMap<Address, U256>,
    nonces: HashMap<Address, u32>,
    executed_input_count: u64,
    last_executed_safe_block: u64,
}

#[derive(Serialize, Deserialize)]
struct BalanceEntry {
    address: Address,
    balance: U256,
}

#[derive(Serialize, Deserialize)]
struct NonceEntry {
    address: Address,
    nonce: u32,
}

#[derive(Serialize, Deserialize)]
struct WalletSnapshot {
    config: WalletConfig,
    balances: Vec<BalanceEntry>,
    nonces: Vec<NonceEntry>,
    executed_input_count: u64,
    last_executed_safe_block: u64,
}

impl WalletApp {
    pub fn new(config: WalletConfig) -> Self {
        Self {
            config,
            balances: HashMap::new(),
            nonces: HashMap::new(),
            executed_input_count: 0,
            last_executed_safe_block: 0,
        }
    }

    fn balance_of(&self, address: Address) -> U256 {
        self.balances
            .get(&address)
            .copied()
            .unwrap_or(U256::ZERO)
    }

    fn nonce_of(&self, address: Address) -> u32 {
        self.nonces.get(&address).copied().unwrap_or(0)
    }

    fn credit(&mut self, address: Address, amount: U256) {
        self.balances
            .insert(address, self.balance_of(address) + amount);
    }

    fn debit(&mut self, address: Address, amount: U256) -> bool {
        let balance = self.balance_of(address);
        if balance < amount {
            return false;
        }
        self.balances.insert(address, balance - amount);
        true
    }

    fn snapshot_bytes(&self) -> Result<Vec<u8>, AppError> {
        let mut balances = self
            .balances
            .iter()
            .map(|(address, balance)| BalanceEntry {
                address: *address,
                balance: *balance,
            })
            .collect::<Vec<_>>();
        balances.sort_unstable_by_key(|entry| entry.address.into_array());

        let mut nonces = self
            .nonces
            .iter()
            .map(|(address, nonce)| NonceEntry {
                address: *address,
                nonce: *nonce,
            })
            .collect::<Vec<_>>();
        nonces.sort_unstable_by_key(|entry| entry.address.into_array());

        serde_json::to_vec(&WalletSnapshot {
            config: self.config,
            balances,
            nonces,
            executed_input_count: self.executed_input_count,
            last_executed_safe_block: self.last_executed_safe_block,
        })
        .map_err(|error| AppError::Internal {
            reason: format!("snapshot encoding failed: {error}"),
        })
    }

    fn from_snapshot(bytes: &[u8]) -> Result<Self, AppError> {
        let snapshot: WalletSnapshot = serde_json::from_slice(bytes)
            .map_err(|error| AppError::Internal {
                reason: format!("snapshot decoding failed: {error}"),
            })?;

        Ok(Self {
            config: snapshot.config,
            balances: snapshot
                .balances
                .into_iter()
                .map(|entry| (entry.address, entry.balance))
                .collect(),
            nonces: snapshot
                .nonces
                .into_iter()
                .map(|entry| (entry.address, entry.nonce))
                .collect(),
            executed_input_count: snapshot.executed_input_count,
            last_executed_safe_block: snapshot.last_executed_safe_block,
        })
    }
}

impl Application for WalletApp {
    const MAX_METHOD_PAYLOAD_BYTES: usize = MAX_METHOD_PAYLOAD_BYTES;

    fn validate_user_op(
        &self,
        sender: Address,
        user_op: &UserOp,
        current_fee: u16,
    ) -> Result<(), InvalidReason> {
        let expected = self.nonce_of(sender);
        if user_op.nonce != expected {
            return Err(InvalidReason::InvalidNonce {
                expected,
                got: user_op.nonce,
            });
        }

        let required = sequencer_core::fee::fee_to_linear(current_fee);
        let available = self.balance_of(sender);
        if available < required {
            return Err(InvalidReason::InsufficientFeeBalance {
                required,
                available,
            });
        }
        Ok(())
    }

    fn execute_valid_user_op(
        &mut self,
        user_op: &ValidUserOp,
        safe_block: u64,
    ) -> Result<AppOutputs, AppError> {
        let sender = user_op.sender;
        let fee = sequencer_core::fee::fee_to_linear(user_op.fee);
        if !self.debit(sender, fee) {
            return Err(AppError::Internal {
                reason: "validated operation cannot pay its fee".to_string(),
            });
        }

        self.credit(self.config.fee_recipient, fee);
        self.nonces.insert(sender, self.nonce_of(sender) + 1);

        let mut outputs = Vec::new();
        match Method::from_ssz_bytes(&user_op.data) {
            Ok(Method::Transfer(transfer))
                if self.debit(sender, transfer.amount) =>
            {
                self.credit(transfer.to, transfer.amount);
                outputs.push(AppOutput::Notice(
                    TransferNoticeCall {
                        sender,
                        recipient: transfer.to,
                        amount: transfer.amount,
                    }
                    .abi_encode(),
                ));
            }
            Ok(Method::Withdrawal(withdrawal))
                if self.debit(sender, withdrawal.amount) =>
            {
                outputs.push(AppOutput::Voucher {
                    destination: self.config.token,
                    value: U256::ZERO,
                    payload: Erc20Transfer {
                        recipient: sender,
                        amount: withdrawal.amount,
                    }
                    .abi_encode(),
                });
            }
            _ => {}
        }

        self.executed_input_count =
            self.executed_input_count.saturating_add(1);
        self.last_executed_safe_block =
            self.last_executed_safe_block.max(safe_block);
        Ok(outputs)
    }

    fn execute_direct_input(
        &mut self,
        input: &DirectInput,
    ) -> Result<AppOutputs, AppError> {
        let mut outputs = Vec::new();
        if input.sender == self.config.erc20_portal {
            match Erc20Deposit::decode(&input.payload) {
                Ok(deposit) if deposit.token == self.config.token => {
                    self.credit(deposit.sender, deposit.value);
                    outputs.push(AppOutput::Notice(
                        DepositNoticeCall {
                            token: deposit.token,
                            sender: deposit.sender,
                            amount: deposit.value,
                        }
                        .abi_encode(),
                    ));
                }
                Ok(deposit) => {
                    warn!(
                        token = %deposit.token,
                        "ignoring unsupported token"
                    );
                }
                Err(error) => {
                    error!(%error, "ignoring malformed portal deposit");
                }
            }
        }

        self.executed_input_count =
            self.executed_input_count.saturating_add(1);
        self.last_executed_safe_block = self
            .last_executed_safe_block
            .max(input.block_number);
        Ok(outputs)
    }

    fn last_executed_safe_block(&self) -> u64 {
        self.last_executed_safe_block
    }

    fn executed_input_count(&self) -> u64 {
        self.executed_input_count
    }

    fn from_dump(prefix: &Path) -> Result<Self, AppError> {
        Self::from_snapshot(&std::fs::read(
            Self::state_file_in_dump(prefix),
        )?)
    }

    fn create_dump(&self, prefix: &Path) -> Result<(), AppError> {
        std::fs::create_dir(prefix)?;
        let mut state =
            std::fs::File::create(Self::state_file_in_dump(prefix))?;
        state.write_all(&self.snapshot_bytes()?)?;
        state.sync_all()?;
        std::fs::File::open(prefix)?.sync_all()?;
        if let Some(parent) = prefix.parent() {
            std::fs::File::open(parent)?.sync_all()?;
        }
        Ok(())
    }

    fn delete_dump(prefix: &Path) -> Result<(), AppError> {
        std::fs::remove_dir_all(prefix)?;
        Ok(())
    }

    fn state_file_in_dump(prefix: &Path) -> PathBuf {
        prefix.join("state.json")
    }

    fn canonical_snapshot_bytes(&self) -> Result<Vec<u8>, AppError> {
        self.snapshot_bytes()
    }

    fn export_state(&self) -> Result<String, AppError> {
        String::from_utf8(self.snapshot_bytes()?).map_err(|error| {
            AppError::Internal {
                reason: format!("state export is not UTF-8: {error}"),
            }
        })
    }
}
```
