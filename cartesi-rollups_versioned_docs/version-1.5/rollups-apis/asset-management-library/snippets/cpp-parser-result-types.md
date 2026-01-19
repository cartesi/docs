```cpp
cma_parser_error_t cma_decode_advance(cma_parser_input_type_t type, const cmt_rollup_advance_t *input, cma_parser_input_t *parser_input);

typedef struct cma_parser_input {
    enum cma_parser_input_type_t type;
    union {
        struct cma_parser_ether_deposit_t ether_deposit;
        struct cma_parser_erc20_deposit_t erc20_deposit;
        struct cma_parser_erc721_deposit_t erc721_deposit;
        struct cma_parser_erc1155_single_deposit_t erc1155_single_deposit;
        struct cma_parser_erc1155_batch_deposit_t erc1155_batch_deposit;
        struct cma_parser_ether_withdrawal_t ether_withdrawal;
        struct cma_parser_erc20_withdrawal_t erc20_withdrawal;
        struct cma_parser_erc721_withdrawal_t erc721_withdrawal;
        struct cma_parser_erc1155_single_withdrawal_t erc1155_single_withdrawal;
        struct cma_parser_erc1155_batch_withdrawal_t erc1155_batch_withdrawal;
        struct cma_parser_ether_transfer_t ether_transfer;
        struct cma_parser_erc20_transfer_t erc20_transfer;
        struct cma_parser_erc721_transfer_t erc721_transfer;
        struct cma_parser_erc1155_single_transfer_t erc1155_single_transfer;
        struct cma_parser_erc1155_batch_transfer_t erc1155_batch_transfer;
        struct cma_parser_balance_t balance;
        struct cma_parser_supply_t supply;
    } u;
} cma_parser_input_t;

struct cma_parser_ether_deposit_t {
    cma_abi_address_t sender;
    cma_amount_t amount;
    cma_abi_bytes_t exec_layer_data;
};
struct cma_parser_erc20_deposit_t {
    cma_abi_address_t sender;
    cma_token_address_t token;
    cma_amount_t amount;
    cma_abi_bytes_t exec_layer_data;
};
struct cma_parser_erc721_deposit_t {
    cma_abi_address_t sender;
    cma_token_address_t token;
    cma_token_id_t token_id;
    cma_abi_bytes_t exec_layer_data;
};
struct cma_parser_erc1155_single_deposit_t {
    cma_abi_address_t sender;
    cma_token_address_t token;
    cma_token_id_t token_id;
    cma_amount_t amount;
    cma_abi_bytes_t exec_layer_data;
};
struct cma_parser_erc1155_batch_deposit_t {
    cma_abi_address_t sender;
    cma_token_address_t token;
    size_t count;
    cma_token_id_t *token_ids;
    cma_amount_t *amounts;
    cma_abi_bytes_t base_layer_data;
    cma_abi_bytes_t exec_layer_data;
};

struct cma_parser_ether_withdrawal_t {
    cma_amount_t amount;
    cma_abi_bytes_t exec_layer_data;
};
struct cma_parser_erc20_withdrawal_t {
    cma_token_address_t token;
    cma_amount_t amount;
    cma_abi_bytes_t exec_layer_data;
};
struct cma_parser_erc721_withdrawal_t {
    cma_token_address_t token;
    cma_token_id_t token_id;
    cma_abi_bytes_t exec_layer_data;
};
struct cma_parser_erc1155_single_withdrawal_t {
    cma_token_address_t token;
    cma_token_id_t token_id;
    cma_amount_t amount;
    cma_abi_bytes_t exec_layer_data;
};
struct cma_parser_erc1155_batch_withdrawal_t {
    cma_token_address_t token;
    size_t count;
    cma_token_id_t *token_ids;
    cma_amount_t *amounts;
    cma_abi_bytes_t exec_layer_data;
};

struct cma_parser_ether_transfer_t {
    cma_account_id_t receiver;
    cma_amount_t amount;
    cma_abi_bytes_t exec_layer_data;
};
struct cma_parser_erc20_transfer_t {
    cma_account_id_t receiver;
    cma_token_address_t token;
    cma_amount_t amount;
    cma_abi_bytes_t exec_layer_data;
};
struct cma_parser_erc721_transfer_t {
    cma_account_id_t receiver;
    cma_token_address_t token;
    cma_token_id_t token_id;
    cma_abi_bytes_t exec_layer_data;
};
struct cma_parser_erc1155_single_transfer_t {
    cma_account_id_t receiver;
    cma_token_address_t token;
    cma_token_id_t token_id;
    cma_amount_t amount;
    cma_abi_bytes_t exec_layer_data;
};
struct cma_parser_erc1155_batch_transfer_t {
    cma_account_id_t receiver;
    cma_token_address_t token;
    size_t count;
    cma_token_id_t *token_ids;
    cma_amount_t *amounts;
    cma_abi_bytes_t exec_layer_data;
};

struct cma_parser_balance_t {
    cma_account_id_t account;
    cma_token_address_t token;
    cma_token_id_t token_id;
    cma_abi_bytes_t exec_layer_data;
};
struct cma_parser_supply_t {
    cma_token_address_t token;
    cma_token_id_t token_id;
    cma_abi_bytes_t exec_layer_data;
};
```