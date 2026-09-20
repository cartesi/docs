---
title: "Process supervision and recovery operations"
sidebar_label: "Supervision and recovery"
description: "How to supervise the sequencer, interpret its exit codes, prevent overlapping writers, and resolve submitter wallet nonces."
---

The sequencer expects a process supervisor. It deliberately exits when some recovery paths need a clean restart with no active workers, and its exit code tells the supervisor whether to retry or wait for an operator.

The supervisor must preserve the data directory, prevent overlapping instances, capture logs, and apply the correct retry policy to each exit code.

## Supervisor responsibilities

A production supervisor should:

- run `setup` as a separate initialization step;
- start one `run` process for each sequencer deployment;
- mount the same durable data directory on every restart;
- allow enough startup time for base-layer synchronization and recovery;
- stop the outgoing process before starting a replacement;
- retain logs and the exit code from every process generation;
- use bounded backoff for retryable failures;
- stop and alert on operator-directed exit codes.

## Exit codes and required actions

The supervisor should group process exits by required action:

| Codes | Supervisor policy |
|---|---|
| `0` | Keep the process stopped unless deployment policy explicitly starts it again |
| `1`, `10`, `20` | Capture logs and restart with bounded backoff. Allow a longer startup window for code `10`, which can trigger recovery |
| `2` | Stop until the command or configuration is corrected |
| `30`, `40` | Stop and alert. Code `40` requires the documented checkpoint-recovery procedure |
| `101` | Capture the panic, alert, and use a controlled restart policy while investigating |

[Constants and exit codes](../api-reference/constants-and-exit-codes.md#exit-codes) is the authoritative definition of every code. [Cockroach recovery](../recovery/cockroach.md) covers the operator procedure required by code `40`.

## Restart and backoff policy

Use bounded exponential backoff for codes `1`, `10`, and `20`. Reset the retry counter only after the process has remained healthy for an operationally meaningful period.

Alert on:

- repeated code `1`, because an unclassified failure may indicate a software, storage, or persistent provider problem;
- repeated code `10`, because recovery should not trigger continuously;
- prolonged code `20`, because the dependency is not recovering;
- every code `30`, `40`, or `101`.

Do not use a short fixed startup deadline. A recovery boot can take many minutes while it resolves wallet nonces, waits for the safe head, synchronizes base-layer inputs, and rebuilds application state.

## Prevent restart loops

Many container platforms restart every nonzero exit automatically. That policy is unsafe for codes `30` and `40` because neither can be fixed by launching the same command again.

Use an entrypoint or supervisor that records the child exit code and branches explicitly. Codes `30` and `40` must leave the workload stopped. Code `2` also requires corrected configuration before another attempt.

Do not infer behavior by parsing error-message text. The exit-code mapping is the stable orchestration contract.

## Initialization and startup order

For a new deployment:

1. provision durable storage;
2. run plain `setup` with the deployment identity and submitter address;
3. mount the submitter key only where keyed commands require it;
4. start `run` under the supervisor;
5. wait for `/readyz` before routing transaction traffic;
6. start the watchdog after its independent state has been initialized.

A completed plain setup is idempotent, so an initialization job may run again against the same completed data directory. Do not apply that rule to `setup --recovery`, which is a one-shot rebuild command for a fresh directory.

## Prevent overlapping sequencer instances

The sequencer has no leader election. Run exactly one `run` process for each deployment and data directory.

Two instances can:

- compete for the same submitter wallet nonces;
- produce conflicting local orders;
- contend for the same SQLite database;
- invalidate assumptions used by startup recovery.

Use a deployment strategy that fully terminates the current process before starting its replacement. Avoid rolling updates that briefly run two replicas.

The same exclusion applies to keyed maintenance. Never run `flush-mempool` or `setup --recovery` while `run` is active for the same submitter account.

## Flush unresolved wallet nonces

The batch-submitter account uses consecutive Ethereum transaction nonces. A broadcast transaction can disappear from the local node's mempool and still survive elsewhere, then land after the operator assumed it was gone.

`flush-mempool` resolves every nonce slot the deployment may have used. It reads the pinned submitter address and the persisted wallet-nonce watermark from the data directory, sends zero-value self-transfers for unresolved slots, and waits until:

```text
pending nonce <= safe nonce
and
safe nonce >= persisted watermark + 1
```

The replacement transaction and the original batch transaction compete for the same nonce. Either can win. The command succeeds only after every covered slot has an outcome visible at the RPC's safe level.

This is not absolute chain irreversibility, and the command does not repair application state or invalidate batches. It only removes uncertainty from the submitter account's nonce range.

Run it with the sequencer stopped:

```bash
CARTESI_SEQUENCER_BLOCKCHAIN_HTTP_ENDPOINT=https://your-node.example \
CARTESI_SEQUENCER_AUTH_PRIVATE_KEY_FILE=/run/secrets/submitter-key \
CARTESI_SEQUENCER_DATA_DIR=/var/lib/cartesi-sequencer \
  <your-sequencer-binary> flush-mempool
```

The command requires:

- a data directory with completed setup;
- the original wallet-nonce watermark stored in that directory;
- a key matching the pinned submitter address;
- an RPC serving the pinned chain;
- enough base-layer funds for replacement transactions.

It raises the watermark before broadcasting and waits for the safe nonce to cover that durable boundary. If a transaction watch times out, it rechecks the nonce state and retries.

## When to run `flush-mempool`

Use the standalone command when:

- the submitter account has a wedged nonce range;
- the deployment is being decommissioned and all nonce slots must be resolved;
- an operator runbook explicitly directs you to use it.

Do not run it after every abrupt shutdown. Normal startup scans the base layer and the submitter retries pending batches. Preemptive recovery and `setup --recovery` also perform their own flush when required.

Because the command sends replacement transactions, it can cause an original batch transaction to lose its nonce. Run it only when the corresponding operational procedure is prepared to reconcile the canonical result.

## Preserve state across restarts

Mount the configured data directory on durable storage that survives process and node replacement.

Do not restore an old data-directory copy over a deployment that continued running. That local history can conflict with later base-layer activity. Use the documented checkpoint recovery procedure instead.

See [Data, snapshots, and backups](./data-and-state.md) for its contents, backup procedure, and restore boundaries.

## Next steps

- Configure the process using [Configure, set up, and run the sequencer](./setup-and-running.md).
- Define alerts with [Monitoring and watchdog operation](./monitoring.md).
- Follow [Preemptive recovery](../recovery/preemptive.md) and [Cockroach recovery](../recovery/cockroach.md) for the two recovery paths.
