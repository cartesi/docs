---
id: input
title: Input
hide_table_of_contents: false
---


Request submitted to the application to advance its state

```graphql
type Input {
  index: Int!
  status: CompletionStatus!
  timestamp: DateTime!
  msgSender: String!
  blockNumber: Int!
  payload: String!
  notices: NoticeConnection!
  vouchers: VoucherConnection!
  reports: ReportConnection!
}
```

### Fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| `index` | [`Int!`](../../scalars/int) | Unique identifier for the input. |
| `status` | [`CompletionStatus!`](../../objects/completion-status) | Current status of the input processing. |
| `timestamp` | [`DateTime!`](../../scalars/date-time) | Timestamp associated with the input submission. |
| `msgSender` | [`String!`](../../scalars/string) | Address of the account that submitted the input. |
| `blockNumber` | [`Int!`](../../scalars/int) | Number of the base layer block in which the input was recorded. |
| `payload` | [`String!`](../../scalars/string) | The actual data/content of the input. |
| `notices` | [`NoticeConnection!`](../../objects/notice-connection) | List of notices associated with this input. |
| `vouchers` | [`VoucherConnection!`](../../objects/voucher-connection) | List of vouchers associated with this input. |
| `reports` | [`ReportConnection!`](../../objects/report-connection) | List of reports associated with this input. |



