---
id: completion-status
title: CompletionStatus
hide_table_of_contents: false
---

Enum representing the possible statuses of an input's processing.

```graphql
enum CompletionStatus {
  Unprocessed
  Accepted
  Rejected
  Exception
  MachineHalted
  CycleLimitExceeded
  TimeLimitExceeded
  PayloadLengthLimitExceeded
}
```

## Values

| Name | Description |
| ---- | ----------- |
| `Unprocessed` | The input has not been processed yet. |
| `Accepted` | The input was accepted and processed successfully. |
| `Rejected` | The input was processed and the results were rejected. |
| `Exception` | An exception occurred during the processing of the input. |
| `MachineHalted` | The machine halted during the processing of the input. |
| `CycleLimitExceeded` | The cycle limit was exceeded during the processing of the input. |
| `TimeLimitExceeded` | The time limit was exceeded during the processing of the input. |
| `PayloadLengthLimitExceeded` | The payload length limit was exceeded during the processing of the input. |

