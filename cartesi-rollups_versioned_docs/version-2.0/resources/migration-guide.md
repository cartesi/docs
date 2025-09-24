---
id: migration-guide
title: Migration Guide
---

## Migrating from Cartesi Rollups v1.5.x to v2.0

Rollups node v2.0 introduces some major changes in how the node works internally and how the application code interacts with it. Not all the breaking changes affect all applications. To identify which changes might affect your application, check if any of the following cases apply:

### My back-end...
- handles ERC-20 token deposit inputs. See the [ERC-20 token deposit inputs](#erc-20-token-deposit-inputs) section.
- handles application address relay inputs. See the [Application address](#application-address) section.
- generates Ether withdrawal vouchers. See the [Ether withdrawal vouchers](#ether-withdrawal-vouchers) section.

### My front-end...
- validates notices. See the [Outputs](#outputs) section.
- executes vouchers. See the [Outputs](#outputs) section.
- listens to voucher execution events. See the [Outputs](#outputs) section.
- checks if a voucher was executed. See the [Outputs](#outputs) section.
- uses inspect calls. See the [Inspect calls](#inspect-calls) section.
- uses GraphQL queries. See the [GraphQL queries](#graphql-queries) section.

:::note
If your application uses a high-level framework(ex. Deroll, Rollmelette etc.) for either backend or frontend, check if the framework has already implemented the changes described in this guide.
:::

### ERC-20 token deposit inputs

In SDK v1, ERC-20 token deposit inputs start with a 1-byte Boolean field which indicates whether the transfer was successful or not:

```
{
    success: Byte[1],
    tokenAddress: Byte[20],
    senderAddress: Byte[20],
    amount: Byte[32],
    execLayerData: Byte[],
}
```

In SDK v2, we modified the ERC-20 portal to only accept successful transactions. With this change, the success field would always be true, so it has been removed:

```
{ 
    tokenAddress: Byte[20],
    senderAddress: Byte[20],
    amount: Byte[32],
    execLayerData: Byte[],
}
```

### Ether withdrawal vouchers

In SDK v1, Ether withdrawals were issued as vouchers targeting the application contract, and calling the withdrawEther function:

```
{
    destination: applicationAddress,
    payload: abi.encodeWithSignature("withdrawEther(address,uint256)", recipient, value),
}
```

In SDK v2, we have removed this function in favor of a simpler way, which uses the newly-added value field:

```
{
    destination: recipient,
    payload: "0x",
    value: value,
}
```

:::note
This value field can be used to pass Ether to payable functions.
:::

### Application address

In SDK v1, the application address could be sent to the machine via an input through the DAppAddressRelay contract.

In SDK v2, the application address has been added to the input metadata, making it available in every input. This change allowed us to remove the DAppAddressRelay contract.

Here is an example of a finish request response, according to the OpenAPI interface of the Rollup HTTP server:

```json
{
  "request_type": "advance_state",
  "data": {
    "metadata": {
      "chain_id": 42,
      "app_contract": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "msg_sender": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "input_index": 123,
      "block_number": 10000000,
      "block_timestamp": 1588598533000,
      "prev_randao": "0x0000000000000000000000000000000000000000000000000000000000000001"
    },
    "payload": "0xdeadbeef"
  }
}
```

### Outputs

In SDK v2, vouchers and notices are now stored in the same buffer inside the machine and in the same tree of the proof structure. They are encoded as Solidity function calls, each with its own signature.

Now, any output can be validated, not just notices. We've also added a new type of executable output: `DELEGATECALL` vouchers.

#### Encoding

Outputs are encoded as Solidity function calls. For supported signatures, see the Outputs interface. Here are some examples:

```
// Notice with payload "Hello, World!" encoded using ASCII
Notice(hex"48656c6c6f2c20576f726c6421")  // 0xc258d6e50000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000d48656c6c6f2c20576f726c642100000000000000000000000000000000000000

// Voucher to WETH token contract (on Mainnet), passing 1 ETH, calling the deposit() function
Voucher(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2, 1000000000000000000, hex"d0e30db0")  // 0x237a816f000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000004d0e30db000000000000000000000000000000000000000000000000000000000

// DELEGATECALL voucher to Safe ERC-20 library (on Sepolia)
DelegateCallVoucher(0x817b126F242B5F184Fa685b4f2F91DC99D8115F9, hex"d1660f99000000000000000000000000491604c0fdf08347dd1fa4ee062a822a5dd06b5d000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000de0b6b3a7640000")  // 0x10321e8b000000000000000000000000817b126f242b5f184fa685b4f2f91dc99d8115f900000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000064d1660f99000000000000000000000000491604c0fdf08347dd1fa4ee062a822a5dd06b5d000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa960450000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000
```

#### Validation

In SDK v1, only notices could be validated through the `validateNotice` function:

```solidity
function validateNotice(
    bytes calldata notice,
    Proof calldata proof
) external view returns (bool success);
```

In SDK v2, any output can be validated with the function `validateOutput`:

```solidity
function validateOutput(
    bytes calldata output,
    OutputValidityProof calldata proof
) external view;
```

#### Execution

In SDK v1, only vouchers could be executed through the `executeVoucher` function:

```solidity
function executeVoucher(
    address destination,
    bytes calldata payload,
    Proof calldata proof
) external returns (bool success);
```

In SDK v2, both `CALL` and `DELEGATECALL` vouchers can be executed through the `executeOutput` function:

```solidity
function executeOutput(
    bytes calldata output,
    OutputValidityProof calldata proof
) external;
```

#### Execution event

In SDK v1, whenever a voucher was executed, a `VoucherExecution` event would be emitted:

```solidity
event VoucherExecuted(uint256 voucherId);
```

In SDK v2, this event was renamed as `OutputExecuted`, and the parameters have changed:

```solidity
event OutputExecuted(uint64 outputIndex, bytes output);
```

#### Execution check

In SDK v1, one could check whether a voucher has been executed already by calling the `wasVoucherExecuted` function:

```solidity
function wasVoucherExecuted(
    uint256 inputIndex,
    uint256 outputIndexWithinInput
) external view returns (bool executed);
```

In SDK v2, outputs are no longer attached to the inputs that generated them, so the now-called `wasOutputExecuted` function just receives the output index:

```solidity
function wasOutputExecuted(
    uint256 outputIndex
) external view returns (bool executed);
```

### Inspect calls

In SDK v1, the `inspect` REST API call was GET type and the endpoint was `<node-url>/inspect/<payload>`.

In SDK v2, the `inspect` REST API call is POST type and the endpoint is `<node-url>/inspect/<application-address>/<uri-encoded-payload>`.

### GraphQL queries

In SDK v1, the GraphQL server was available at `<node-url>/graphql`.

In SDK v2, the GraphQL server is available at `<node-url>/graphql/<application-address>`. Although, in a single app environment, the SDK v1 endpoint should still work. Application address is relevant when multiple applications are deployed in the same node.

