```rust
fn cma_decode_advance(req_type:  CmaParserInputType, input: JsonValue) -> Result<CmaParserInput, CmaParserError>;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserInput {
    pub req_type: CmaParserInputType,
    pub input: CmaParserInputData,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CmaParserInputData {
    EtherDeposit(CmaParserEtherDeposit),
    Erc20Deposit(CmaParserErc20Deposit),
    Erc721Deposit(CmaParserErc721Deposit),
    Erc1155SingleDeposit(CmaParserErc1155SingleDeposit),
    Erc1155BatchDeposit(CmaParserErc1155BatchDeposit),
    EtherWithdrawal(CmaParserEtherWithdrawal),
    Erc20Withdrawal(CmaParserErc20Withdrawal),
    Erc721Withdrawal(CmaParserErc721Withdrawal),
    Erc1155SingleWithdrawal(CmaParserErc1155SingleWithdrawal),
    Erc1155BatchWithdrawal(CmaParserErc1155BatchWithdrawal),
    EtherTransfer(CmaParserEtherTransfer),
    Erc20Transfer(CmaParserErc20Transfer),
    Erc721Transfer(CmaParserErc721Transfer),
    Erc1155SingleTransfer(CmaParserErc1155SingleTransfer),
    Erc1155BatchTransfer(CmaParserErc1155BatchTransfer),
    Balance(CmaParserBalance),
    Supply(CmaParserSupply),
    Unidentified(CmaParserUnidentifiedInput),
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserEtherDeposit {
    pub sender: Address,
    pub amount: U256,
    pub exec_layer_data: Bytes,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserErc20Deposit {
    pub sender: Address,
    pub token: Address,
    pub amount: U256,
    pub exec_layer_data: Bytes,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserErc721Deposit {
    pub sender: Address,
    pub token: Address,
    pub token_id: U256,
    pub exec_layer_data: Bytes,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserErc1155SingleDeposit {
    pub sender: Address,
    pub token: Address,
    pub token_id: U256,
    pub amount: U256,
    pub exec_layer_data: Bytes,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserErc1155BatchDeposit {
    pub sender: Address,
    pub token: Address,
    pub count: usize,
    pub token_ids: Vec<U256>,
    pub amounts: Vec<U256>,
    pub base_layer_data: Bytes,
    pub exec_layer_data: Bytes,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserEtherWithdrawal {
    pub receiver: Address,
    pub amount: U256,
    pub exec_layer_data: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserErc20Withdrawal {
    pub receiver: Address,
    pub token: Address,
    pub amount: U256,
    pub exec_layer_data: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserErc721Withdrawal {
    pub receiver: Address,
    pub token: Address,
    pub token_id: U256,
    pub exec_layer_data: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserErc1155SingleWithdrawal {
    pub receiver: Address,
    pub token: Address,
    pub token_id: U256,
    pub amount: U256,
    pub exec_layer_data: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserErc1155BatchWithdrawal {
    pub receiver: Address,
    pub token: Address,
    pub count: usize,
    pub token_ids: Vec<U256>,
    pub amounts: Vec<U256>,
    pub base_layer_data: String,
    pub exec_layer_data: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserEtherTransfer {
    pub receiver: U256,
    pub amount: U256,
    pub exec_layer_data: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserErc20Transfer {
    pub receiver: U256,
    pub token: Address,
    pub amount: U256,
    pub exec_layer_data: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserErc721Transfer {
    pub receiver: U256,
    pub token: Address,
    pub token_id: U256,
    pub exec_layer_data: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserErc1155SingleTransfer {
    pub sender: Address,
    pub receiver: Address,
    pub token: Address,
    pub token_id: U256,
    pub amount: U256,
    pub exec_layer_data: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserErc1155BatchTransfer {
    pub sender: Address,
    pub receiver: Address,
    pub token: Address,
    pub count: usize,
    pub token_ids: Vec<U256>,
    pub amounts: Vec<U256>,
    pub base_layer_data: String,
    pub exec_layer_data: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserBalance {
    pub account: Address,
    pub token: Address,
    pub token_ids: Option<Vec<U256>>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserSupply {
    pub token: Address,
    pub token_ids: Vec<U256>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CmaParserUnidentifiedInput {
    pub abi_encoded_bytes: Vec<u8>,
    pub msg_sender: Address,
}
```