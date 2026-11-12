---
id: outputs-pending-executable-count
title: Get Pending Executable Output Count
---

# Get Pending Executable Output Count

## Example Request

```json
{
  "jsonrpc": "2.0",
  "method": "cartesi_getPendingExecutableOutputCount",
  "params": {
    "application": "<name-or-address>"
  },
  "id": 1
}
```

The `cartesi_getPendingExecutableOutputCount` method returns the number of vouchers and DELEGATECALL vouchers of an application that the node has not seen executed (outputs of these types without an `execution_transaction_hash`).

The count includes outputs whose epoch claim is not accepted yet, which cannot be executed on chain until the epoch reaches `CLAIM_ACCEPTED` (see [Proofs and executability](./get.md#proofs-and-executability)).

The count grows with new vouchers and shrinks with executions, so it is not a change signal or a resume cursor. To track executions, poll [`cartesi_getExecutedOutputCount`](./executed-count.md) instead.

## Parameters

| Name        | Type   | Required | Description                                      |
|-------------|--------|----------|--------------------------------------------------|
| application | string | Yes      | The application's name or hex encoded address    |

## Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": "0x2"
  },
  "id": 1
}
```

### Response Fields

| Name | Type   | Description                                      |
|------|--------|--------------------------------------------------|
| data | string | Number of vouchers and DELEGATECALL vouchers not yet executed (hex encoded) |

## Error Codes

| Code    | Message                      | Description                                      |
|---------|------------------------------|--------------------------------------------------|
| -32602  | Invalid parameters           | Invalid parameter values                         |
| -31002  | Application not found        | The node does not know the application. Retrying does not help |
| -32603  | Internal server error        | A node-side error occurred                       |
| -32070  | Request timed out            | The request could not be processed in time       |
| -31003  | Response size limit exceeded | The response exceeds the response size budget    |
