---
id: completion-status
title: CompletionStatus
hide_table_of_contents: false
---

Represents the status of an input's processing.

```graphql
enum CompletionStatus {
  "Input has not been processed yet"
  UNPROCESSED
  "Input has been processed and accepted"
  ACCEPTED
  "Input has been processed and rejected"
  REJECTED
  "Input processing resulted in an exception"
  EXCEPTION
  "Input processing was halted by the machine"
  MACHINE_HALTED
  "Input processing exceeded the cycle limit"
  CYCLE_LIMIT_EXCEEDED
  "Input processing exceeded the time limit"
  TIME_LIMIT_EXCEEDED
  "Input processing exceeded the payload length limit"
  PAYLOAD_LENGTH_LIMIT_EXCEEDED
}
```

## Values

| Value | Description |
| ----- | ----------- |
| `UNPROCESSED` | Input has not been processed yet. |
| `ACCEPTED` | Input has been processed and accepted. |
| `REJECTED` | Input has been processed and rejected. |
| `EXCEPTION` | Input processing resulted in an exception. |
| `MACHINE_HALTED` | Input processing was halted by the machine. |
| `CYCLE_LIMIT_EXCEEDED` | Input processing exceeded the cycle limit. |
| `TIME_LIMIT_EXCEEDED` | Input processing exceeded the time limit. |
| `PAYLOAD_LENGTH_LIMIT_EXCEEDED` | Input processing exceeded the payload length limit. |

## Example Query

```graphql
query {
  input(id: "1") {
    status
  }
}
``` 