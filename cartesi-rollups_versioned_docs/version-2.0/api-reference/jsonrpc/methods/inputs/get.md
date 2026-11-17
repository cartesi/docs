---
id: inputs-get
title: Get Input
---

# Get Input

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getInput",
  "params": {
    "application": "<name-or-address>",
    "input_index": "<hex-encoded-index>"
  },
  "id": 1
}
```

The `cartesi_getInput` method retrieves detailed information about a specific input by its application and index.

## Parameters

| Name        | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| application | string | Yes      | The application's name or hex encoded address    |
| input_index | string | Yes      | The index of the input to be retrieved (hex encoded) |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": {
      "epoch_index": "0x1",
      "index": "0x1",
      "block_number": "0x105",
      "raw_data": "0x415bf363000000000000000000000000000000000000000000000000000000000000000100000000000000000000000071c7656ec7ab88b098defb751b7401b5f6d8976f00000000000000000000000071c7656ec7ab88b098defb751b7401b5f6d8976f000000000000000000000000000000000000000000000000000000000000010500000000000000000000000000000000000000000000000000000000659200801234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000",
      "status": "ACCEPTED",
      "exception_data": null,
      "machine_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "tx_buffer_data_block": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "transaction_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "log_index": "0x0",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "decoded_data": {
        "chain_id": "0x1",
        "application_contract": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        "sender": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        "block_number": "0x105",
        "block_timestamp": "0x65920080",
        "prev_randao": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "index": "0x1",
        "payload": "0x48656c6c6f"
      }
    }
  },
  "id": 1
}
```

### Response Fields

| Name                    | Type   | Description                                      |
|-------------------------|--------|--------------------------------------------------|
| epoch_index             | string | The epoch index this input belongs to (hex encoded) |
| index                   | string | The input index (hex encoded)                    |
| block_number            | string | The block number when the input was added (hex encoded) |
| raw_data                | string | The raw input data (the ABI-encoded `EvmAdvance` call) in hexadecimal format |
| status                  | string | Current status of the input. See [InputCompletionStatus](../../types.md#inputcompletionstatus) |
| exception_data          | string \| null | The exception payload provided by the application. Set only when `status` is `EXCEPTION` (`0x` for an empty payload) |
| machine_hash            | string \| null | The machine state hash after processing this input (null until processed) |
| tx_buffer_data_block    | string \| null | The CMIO TX buffer data block of the machine state after this input |
| transaction_hash        | string | The hash of the L1 transaction that added the input |
| log_index               | string | The log index of the `InputAdded` event in its block (hex encoded) |
| created_at              | string | Timestamp when the input was created             |
| updated_at              | string | Timestamp when the input was last updated        |
| decoded_data            | object | The decoded input data. Omitted when `raw_data` cannot be decoded |

Possible `status` values are `NONE` (not processed yet), `ACCEPTED`, `REJECTED`, `EXCEPTION`, `MACHINE_HALTED`, `OVERFLOW`, `UNEXPECTED_YIELD` and `INVALID_OUTPUTS_ROOT`. Every status other than `NONE`, `ACCEPTED` and `REJECTED` stops the application for good. When processing fails because of a local limit (for example a deadline or a configured cycle limit), the input stays `NONE` and the application status becomes `FAILED`; check the application with [`cartesi_getApplication`](../applications/get.md).

#### Decoded Data Fields

| Name                    | Type   | Description                                      |
|-------------------------|--------|--------------------------------------------------|
| chain_id                | string | The chain ID (hex encoded)                       |
| application_contract    | string | The application contract address                 |
| sender                  | string | The sender address                               |
| block_number            | string | The block number (hex encoded)                   |
| block_timestamp         | string | The block timestamp (hex encoded)                |
| prev_randao             | string | The previous RANDAO value (hex encoded 256-bit integer) |
| index                   | string | The input index (hex encoded)                    |
| payload                 | string | The input payload in hexadecimal format          |

## Error Codes

| Code    | Message                      | Description                                      |
|---------|------------------------------|--------------------------------------------------|
| -32602  | Invalid parameters           | Invalid parameter values                         |
| -31002  | Application not found        | The node does not know the application. Retrying does not help |
| -31001  | Input not found              | The application exists but the input does not. For the next input index, this is safe to poll |
| -32603  | Internal server error        | A node-side error occurred                       |
| -32070  | Request timed out            | The request could not be processed in time       |
| -31003  | Response size limit exceeded | The response exceeds the response size budget    |
