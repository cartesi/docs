> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Constants and exit codes"
sidebar_label: "Constants and exit codes"
description: "Fixed protocol values, the settings that relate to them, API limits, and the process exit codes a supervisor must handle."
---

Two kinds of fixed value an integrator or operator needs to look up: the constants the protocol is built on, and the codes the process exits with.

## Protocol constants

Some values are part of the protocol and cannot be changed by an operator. Others are local settings. The difference matters: a protocol constant is compiled into the application's machine, so both sides agree on it by construction.

### Fixed by the protocol

| Constant               | Value                 | Meaning                                                                                                                                                                                                  |
| ---------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Staleness deadline     | `1200` blocks         | A batch that reaches the base layer this long after the block it names is skipped. The same figure bounds how long a direct input can be delayed. Roughly 4 hours where blocks are twelve seconds apart. |
| EIP-712 domain name    | `CartesiAppSequencer` | See [EIP-712 domain](./eip712.md)                                                                                                                                                                        |
| EIP-712 domain version | `1`                   |                                                                                                                                                                                                          |
| Signature length       | 65 bytes              |                                                                                                                                                                                                          |
| Fee encoding base      | `129/128`             | Fees are exponents. An exponent `n` means `(129/128)^n` smallest units. About 0.78 percent per step.                                                                                                     |

The staleness deadline is compiled into the machine and cannot be changed by an operator. A sequencer therefore cannot extend the time it holds a direct input.

### Set by the operator

These are local tuning, and each relates to the deadline above.

| Setting                                        | Default | Meaning                                                                                                                 |
| ---------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| `CARTESI_SEQUENCER_PREEMPTIVE_MARGIN_BLOCKS`   | `300`   | How far before the deadline the sequencer stops to avoid losing work. Must be below the deadline. Validated at startup. |
| `CARTESI_SEQUENCER_L1_READ_STALE_AFTER_BLOCKS` | `600`   | When the sequencer's view of the base layer is too old to trust. Must be below the danger threshold.                    |
| `CARTESI_SEQUENCER_SECONDS_PER_BLOCK`          | `12`    | Assumed block time, used to reason about elapsed time during an outage.                                                 |

The defaults assume a chain with twelve second blocks. On a chain with a different block time these are the first things to revisit, because what they really express is a duration.

### Limits on the API

| Limit                | Value         |
| -------------------- | ------------- |
| Feed subscribers     | 64            |
| Feed catch-up window | 50,000 events |

## Exit codes

The sequencer exits with a code that tells a supervisor what to do next. Reacting to these correctly is what makes automated operation safe: some exits should be retried immediately, and some must not be.

| Code  | Meaning |
| ----- | ------- |
| `0`   | Clean shutdown |
| `1`   | Unclassified runtime, worker, storage, or I/O failure |
| `2`   | Invalid command or configuration |
| `10`  | Restart with startup recovery expected |
| `20`  | Transient refusal |
| `30`  | Terminal condition requiring operator investigation |
| `40`  | Setup requires explicit checkpoint recovery |
| `101` | Rust panic |

The code is the stable process-control signal. [Process supervision and recovery operations](../operations/orchestration.md#exit-codes-and-required-actions) defines backoff, alerting, startup windows, and the commands an operator should run. [Cockroach recovery](../recovery/cockroach.md) defines the procedure associated with code `40`.

## Next steps

- For the endpoints and their limits, see [HTTP and WebSocket API](./api.md).
- For settings, see [Configure, set up, and run the sequencer](../operations/setup-and-running.md).
- For how a supervisor should react to an exit, see [Process supervision and recovery operations](../operations/orchestration.md).
