---
id: input
title: Input
hide_table_of_contents: false
---

Request submitted to the application to advance its state.

```graphql
type Input {
  "id of the input"
  id: String!
  "Input index starting from genesis"
  index: Int!
  "Status of the input"
  status: CompletionStatus!
  "Address responsible for submitting the input"
  msgSender: String!
  "Timestamp associated with the input submission, as defined by the base layer's block in which it was recorded"
  timestamp: BigInt! @deprecated(reason: "Use `blockTimestamp` instead")
  "Number of the base layer block in which the input was recorded"
  blockNumber: BigInt!
  "Input payload in Ethereum hex binary format, starting with '0x'"
  payload: String!
  "Get vouchers from this particular input with support for pagination"
  vouchers(first: Int, last: Int, after: String, before: String): VoucherConnection!
  "Get DELEGATECALL vouchers from this particular input with support for pagination"
  delegateCallVouchers(first: Int, last: Int, after: String, before: String): DelegateCallVoucherConnection!
  "Get notices from this particular input with support for pagination"
  notices(first: Int, last: Int, after: String, before: String): NoticeConnection!
  "Get reports from this particular input with support for pagination"
  reports(first: Int, last: Int, after: String, before: String): ReportConnection!
  "Timestamp associated with the Espresso input submission"
  espressoTimestamp: String @deprecated(reason: "Will be removed")
  "Number of the Espresso block in which the input was recorded"
  espressoBlockNumber: String @deprecated(reason: "Will be removed")
  "Input index in the Input Box"
  inputBoxIndex: String
  "Block timestamp"
  blockTimestamp: BigInt
  "Previous RANDAO value"
  prevRandao: String
  "The application that produced the input"
  application: Application!
}
```

## Fields

| Name | Type | Description |
| ---- |------| ----------- |
| `id` | [`String!`](../../scalars/string) | ID of the input. |
| `index` | [`Int!`](../../scalars/int) | Input index starting from genesis. |
| `status` | [`CompletionStatus!`](../../enums/completion-status) | Status of the input. |
| `msgSender` | [`String!`](../../scalars/string) | Address responsible for submitting the input. |
| `timestamp` | [`BigInt!`](../../scalars/bigint) | Timestamp associated with the input submission, as defined by the base layer's block in which it was recorded. |
| `blockNumber` | [`BigInt!`](../../scalars/bigint) | Number of the base layer block in which the input was recorded. |
| `payload` | [`String!`](../../scalars/string) | Input payload in Ethereum hex binary format, starting with '0x'. |
| `vouchers` | [`VoucherConnection!`](../../objects/voucher-connection) | Get vouchers from this particular input with support for pagination. |
| `delegateCallVouchers` | [`DelegateCallVoucherConnection!`](../../objects/delegate-call-voucher-connection) | Get DELEGATECALL vouchers from this particular input with support for pagination. |
| `notices` | [`NoticeConnection!`](../../objects/notice-connection) | Get notices from this particular input with support for pagination. |
| `reports` | [`ReportConnection!`](../../objects/report-connection) | Get reports from this particular input with support for pagination. |
| `espressoTimestamp` | [`String`](../../scalars/string) | Timestamp associated with the Espresso input submission. |
| `espressoBlockNumber` | [`String`](../../scalars/string) | Number of the Espresso block in which the input was recorded. |
| `inputBoxIndex` | [`String`](../../scalars/string) | Input index in the Input Box. |
| `blockTimestamp` | [`BigInt`](../../scalars/bigint) | Block timestamp. |
| `prevRandao` | [`String`](../../scalars/string) | Previous RANDAO value. |
| `application` | [`Application!`](../../objects/application) | The application that produced the input. |

## Example Query

```graphql
query {
  input(outputIndex: 1) {
    id
    index
    status
    msgSender
    timestamp
    blockNumber
    payload
    vouchers(first: 10) {
      edges {
        node {
          index
          destination
          payload
        }
      }
    }
    delegateCallVouchers(first: 10) {
      edges {
        node {
          index
          destination
          payload
        }
      }
    }
    notices(first: 10) {
      edges {
        node {
          index
          payload
        }
      }
    }
    reports(first: 10) {
      edges {
        node {
          index
          payload
        }
      }
    }
    application {
      address
      name
    }
  }
}
```