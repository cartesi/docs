# Application Logic

The Honeypot DApp is implemented as a single C++ program that interfaces with the Cartesi rollup framework through the `libcmt` library. The application follows an event-driven architecture where it continuously processes rollup requests in an infinite loop.

## User Requests

As a standard Cartesi application, the Honeypot exposes two functions to process user requests:
1. `advance_state()` for advancing state of the application
2. `inspect_state()` for Inspecting the state of the application

![ERC-20 Token Operations](../images/honeypot-operations.png)

## Operations Handlers

The application implements three primary operations with specific validation and processing logic:

### 1. Deposit Processing

**Function**: `process_deposit()`
**Trigger**: ERC-20 Portal contract call
**Purpose**: Processes incoming ERC-20 token deposits into the Honeypot application

**Input Validation**:
- **Token Address Validation**: Verifies that the deposited token contract address is valid and matches expected ERC-20 standards
- **Overflow Protection**: Implements arithmetic overflow checks to prevent balance manipulation attacks
- **Amount Validation**: Ensures deposit amounts are positive and within acceptable ranges

**Processing Flow**:
1. Parse the deposit payload to extract sender address, token address, and amount
2. Validate token contract address against whitelist (if applicable)
3. Perform overflow check before adding to existing balance
4. Update internal balance state for the user and token combination
5. Generate success report with deposit details

**Output**: Report containing deposit confirmation and updated balance information

### 2. Withdrawal Processing

**Function**: `process_withdraw()`
**Trigger**: User-initiated withdrawal request
**Purpose**: Processes user requests to withdraw ERC-20 tokens from the application

**Input Validation**:
- **Sender Verification**: Confirms the withdrawal request comes from the token owner
- **Balance Check**: Verifies sufficient balance exists for the requested withdrawal amount
- **Address Validation**: Ensures destination address is valid and not blacklisted
- **Amount Validation**: Confirms withdrawal amount is positive and doesn't exceed available balance

**Processing Flow**:
1. Authenticate the withdrawal request sender
2. Verify sufficient balance for the requested amount
3. Deduct amount from internal balance state
4. Generate voucher for on-chain token transfer
5. Create report documenting the withdrawal transaction

**Output**: 
- **Voucher**: On-chain executable transaction for token transfer
- **Report**: Confirmation of withdrawal with transaction details

### 3. Balance Inspection

**Function**: `inspect_state()`
**Trigger**: Balance query from any address
**Purpose**: Provides read-only access to user token balances without state changes

**Input Validation**:
- **None Required**: As a read-only operation, minimal validation is needed
- **Address Format**: Basic validation to ensure properly formatted Ethereum addresses

**Processing Flow**:
1. Parse the inspection request to extract target address and optional token filter
2. Retrieve balance information from internal state
3. Format balance data for response
4. Generate report with current balance information

**Output**: Report containing current balance information for the requested address and token(s)

**Query Formats**:
- `balance/{address}` - Get all token balances for an address
- `balance/{address}/{token}` - Get specific token balance for an address

## Configuration Constants

The application relies on compile-time configuration constants that define blockchain addresses:

| Constant | Purpose | Source |
|----------|---------|---------|
| ERC20_PORTAL_ADDRESS | Portal contract for deposits | CONFIG_ERC20_PORTAL_ADDRESS |
| ERC20_WITHDRAWAL_ADDRESS | Authorized withdrawal address | CONFIG_ERC20_WITHDRAWAL_ADDRESS |
| ERC20_TOKEN_ADDRESS | Accepted token contract | CONFIG_ERC20_TOKEN_ADDRESS |
| STATE_BLOCK_DEVICE | State persistence device path | "/dev/pmem1" |

These constants are defined at compile-time and cannot be modified during runtime, ensuring the application's security and predictable behavior. The portal address determines which contract can trigger deposits, while the withdrawal address specifies the only authorized source for withdrawal requests. The token address restricts operations to a single ERC-20 token, and the state block device defines where persistent application state is stored.