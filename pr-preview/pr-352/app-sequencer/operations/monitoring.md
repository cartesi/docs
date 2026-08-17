> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Monitoring and watchdog operation"
sidebar_label: "Monitoring and watchdog"
description: "How to monitor sequencer health and progress, run the independent watchdog, and alert on conditions the health probes cannot detect."
---

Reliable operation requires two kinds of observation:

- **service monitoring** checks whether the sequencer, storage, base-layer connection, and submitter are functioning;
- **independent verification** checks whether the sequencer's promoted application state matches canonical execution inside a Cartesi machine.

The health endpoints cover only a small part of the first category. The watchdog provides the second.

## Why independent verification matters

The sequencer predicts canonical execution using its own code, storage, and base-layer view. It also performs an internal content-identity check when it observes accepted batches. Those checks are important, but they cannot provide complete independence from the system being checked.

The watchdog starts from an independently managed Cartesi machine snapshot, reads application inputs from the base layer, advances canonical execution, and compares the resulting state bytes with the sequencer's promoted state at the same inclusion block.

A mismatch is a critical correctness event. Stop transaction traffic, preserve both sequencer and watchdog state, and investigate before restarting the deployment.

## How the watchdog compares state

Each watchdog tick:

1. loads the canonical checkpoint named by its `head.json`;
2. reads `GET /finalized_state/inclusion_block` from the sequencer;
3. exits successfully without a full comparison if the promoted block has not advanced;
4. fetches the relevant `InputAdded` logs from the base layer;
5. advances the canonical Cartesi machine through those inputs;
6. obtains the machine's application-state bytes;
7. downloads `GET /finalized_state` from the sequencer and compares the bytes;
8. writes a new watchdog checkpoint only after a successful comparison.

![The watchdog reads base-layer inputs independently, advances its own Cartesi machine to the sequencer's finalized inclusion block, and compares canonical machine bytes with the sequencer's finalized bytes. A match promotes the watchdog checkpoint, while a mismatch stops processing and raises an alert.](../images/watchdog-comparison.png)

The watchdog uses its own persistent state directory and base-layer replay. Do not place that state inside the sequencer data directory or treat the sequencer's state as the watchdog's source of truth.

## Initialize the watchdog

Initialize the watchdog once with a Cartesi machine snapshot and block that match the deployment's current promoted state:

```bash
sequencer-watchdog init
```

For a long-running deployment, do not assume block `0`. Supply a bootstrap snapshot representing the same block reported by the sequencer's finalized-state endpoint, or reuse the watchdog state directory from the previous deployment of the same monitor.

The watchdog stores stable deployment configuration, `head.json`, status metrics, and its selected Cartesi machine checkpoint under `CARTESI_WATCHDOG_STATE_DIR`. Keep this directory durable.

Use watchdog and canonical-machine artifacts built for the same application, chain configuration, and release as the sequencer. A mismatched machine image produces a state mismatch even when the sequencer is operating correctly.

## Schedule watchdog ticks

Run one comparison cycle with:

```bash
sequencer-watchdog tick
```

`tick` is not a daemon. It performs one cycle and exits. Schedule it with a systemd timer, cron, or a Kubernetes CronJob.

The wrapper takes a non-blocking kernel `flock` on its state directory. Also configure the external scheduler to prevent overlapping ticks, such as `concurrencyPolicy: Forbid` for a Kubernetes CronJob.

Choose a cadence that bounds how long a mismatch can remain undetected while respecting base-layer and Cartesi machine costs. Alert when the last successful tick becomes older than that bound.

## Interpret watchdog results

| Exit code | Meaning                                                                   | Operator action                                    |
| --------: | ------------------------------------------------------------------------- | -------------------------------------------------- |
|       `0` | Comparison succeeded, or the promoted block was unchanged                 | Record success                                     |
|       `1` | Transient RPC, network, Cartesi machine, or sequencer error after retries | Retry on the next schedule and alert if persistent |
|       `2` | Deterministic state mismatch or inclusion-block regression                | Stop and alert immediately                         |

Each completed tick atomically writes a Prometheus textfile to:

```text
$CARTESI_WATCHDOG_STATE_DIR/status.prom
```

Override the path with `CARTESI_WATCHDOG_METRICS_FILE`. The file exposes:

- `cartesi_watchdog_status{chain,app_address,state="ok|warning|failed"}`;
- `cartesi_watchdog_divergence_info{chain,app_address,kind}` when a deterministic failure occurs.

Alert when the active status is `failed`, when `warning` persists, or when the metrics file stops receiving completed tick results.

## Use the health endpoints correctly

Use `/livez` for process liveness and `/readyz` for traffic routing. `/healthz` exposes the same readiness condition in a JSON body. The [API reference](../api-reference/api.md#health-endpoints) defines the exact checks.

A successful probe does not establish RPC freshness, batch-submitter progress, account balance, storage health, or canonical agreement. Monitor those dependencies separately and do not treat `200` as evidence that batches are reaching the base layer.

The finalized-state inclusion-block endpoint is a progress cursor for promoted snapshots. Lack of movement is not automatically a failure because an idle application may produce no new closed and accepted batch.

## Monitor operational dependencies

Monitor at least:

### Base-layer view

- RPC availability and request latency;
- observed safe-head block and timestamp;
- distance between the observed safe head and an independent chain view;
- repeated long-range log-query partitioning or failures;
- wrong-chain detection.

### Batch submission

- age of the oldest unsettled batch;
- distance to the danger threshold and staleness deadline;
- submitter transaction inclusion and replacement retries;
- batch-submitter account balance;
- wallet-nonce gaps or a pending nonce that stops advancing.

### API and feed

- request latency and throughput;
- rates of `429`, `500`, and `503` responses;
- connected feed subscribers and rejected connections;
- feed-consumer lag and catch-up-window failures.

### Storage and process

- data-volume bytes and inodes available;
- SQLite, snapshot, and garbage-collection failures in logs;
- restart count and exit-code distribution;
- time spent in startup or recovery;
- last successful complete backup and archived checkpoint.

## Recommended alerts

Page an operator immediately for:

- sequencer exit code `30`, `40`, or `101`;
- watchdog exit code `2` or `state="failed"`;
- canonical divergence logs;
- a wrong-chain RPC response;
- disk space approaching exhaustion;
- a batch approaching the staleness deadline;
- a depleted submitter account.

Use warning alerts for persistent exit code `1`, `10`, or `20`, repeated provider failures, growing API overload, stale watchdog ticks, and unexpected lack of progress when the application has known traffic.

## Protect monitoring endpoints

Keep health and snapshot routes on the internal operator network. [Separate public and internal routes](./security.md#separate-public-and-internal-routes) defines the route policy and access controls.

## Next steps

- Handle process exits using [Process supervision and recovery operations](./orchestration.md).
- Review every route in [HTTP and WebSocket API](../api-reference/api.md).
- Prepare incident response using [Failure modes](../recovery/failure-modes.md).
