> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Configure, set up, and run the sequencer"
sidebar_label: "Configure and run"
description: "Configure an application-specific sequencer, initialize its data directory, start its workers, and verify readiness."
---

The sequencer has three commands with different responsibilities:

- **`setup`** initializes a data directory and pins it to one deployment.
- **`run`** starts the API and background workers from an initialized directory.
- **`flush-mempool`** resolves uncertain transaction nonces for the batch-submitter account during operator-directed maintenance.

Plain `setup` is read-only on the base layer and uses the submitter address without its private key. The keyed commands are `run`, `flush-mempool`, and `setup --recovery`.

## Configuration model

Every command-line option can also be supplied through a `CARTESI_SEQUENCER_*` environment variable. Command-line values take precedence when both forms are present.

The executable only accepts settings used by the selected command. Deployment identity is provided to `setup` and then stored in the data directory. Later commands read it from storage instead of accepting another chain identifier or application address.

Set `CARTESI_SEQUENCER_DATA_DIR` explicitly in production. Its default, `sequencer-data`, is relative to the process working directory and can resolve to ephemeral storage in a container.

## Settings required by each command

| Setting                                                                           | `setup`                                             | `run`                | `flush-mempool`      | Default          |
| --------------------------------------------------------------------------------- | --------------------------------------------------- | -------------------- | -------------------- | ---------------- |
| `CARTESI_SEQUENCER_BLOCKCHAIN_HTTP_ENDPOINT`                                      | Required                                            | Required             | Required             | None             |
| `CARTESI_SEQUENCER_DATA_DIR`                                                      | Optional                                            | Optional             | Optional             | `sequencer-data` |
| `CARTESI_SEQUENCER_BLOCKCHAIN_ID`                                                 | Required                                            | Read from storage    | Read from storage    | None             |
| `CARTESI_SEQUENCER_APP_ADDRESS`                                                   | Required                                            | Read from storage    | Read from storage    | None             |
| `CARTESI_SEQUENCER_BATCH_SUBMITTER_ADDRESS`                                       | Required                                            | Read from storage    | Read from storage    | None             |
| `CARTESI_SEQUENCER_AUTH_PRIVATE_KEY_FILE` or `CARTESI_SEQUENCER_AUTH_PRIVATE_KEY` | Rejected by plain setup; required by recovery setup | Exactly one required | Exactly one required | None             |
| `CARTESI_SEQUENCER_ALLOW_INSECURE_RPC`                                            | Optional                                            | Optional             | Optional             | `false`          |
| `CARTESI_SEQUENCER_SECONDS_PER_BLOCK`                                             | Optional                                            | Optional             | Optional             | `12`             |

Prefer `CARTESI_SEQUENCER_AUTH_PRIVATE_KEY_FILE`. The file's first line must contain the hexadecimal private key. The sequencer derives its address and rejects it if it does not match the submitter address pinned during setup.

## Initialize a new deployment

Run plain `setup` once for a new data directory:

```bash
CARTESI_SEQUENCER_BLOCKCHAIN_HTTP_ENDPOINT=https://your-node.example \
CARTESI_SEQUENCER_BLOCKCHAIN_ID=1 \
CARTESI_SEQUENCER_APP_ADDRESS=0xYourApplicationAddress \
CARTESI_SEQUENCER_BATCH_SUBMITTER_ADDRESS=0xYourSubmitterAddress \
CARTESI_SEQUENCER_DATA_DIR=/var/lib/cartesi-sequencer \
  <your-sequencer-binary> setup
```

Plain setup performs these tasks:

1. validates the timing configuration and creates the data and dump directories;
2. verifies the RPC chain identifier;
3. discovers the application's `InputBox` and its genesis block;
4. pins the chain, application, `InputBox`, and submitter identities;
5. synchronizes base-layer inputs through the current safe head;
6. registers the application's genesis state as the initial finalized snapshot;
7. writes the setup-complete marker.

It sends no base-layer transaction and requires no signing key. A successful plain setup is idempotent: running it again against the completed directory returns without changing the deployment.

If setup detects batch-submitter activity that a new deployment cannot account for, it exits with code `40`. The remedy is an explicit checkpoint rebuild with `setup --recovery`, not another plain setup attempt. Recovery setup requires a fresh data directory, a finalized checkpoint, its inclusion block, and the submitter key. See [Cockroach recovery](../recovery/cockroach.md).

## Start an initialized deployment

Start the sequencer with the same data directory and the matching submitter key:

```bash
CARTESI_SEQUENCER_BLOCKCHAIN_HTTP_ENDPOINT=https://your-node.example \
CARTESI_SEQUENCER_AUTH_PRIVATE_KEY_FILE=/run/secrets/submitter-key \
CARTESI_SEQUENCER_DATA_DIR=/var/lib/cartesi-sequencer \
  <your-sequencer-binary> run
```

`run` refuses to start unless setup completed and the data directory contains a deployment identity and finalized snapshot. It reads the chain identifier, application address, `InputBox`, genesis block, and submitter address from storage.

At startup it validates the supplied key against the pinned submitter address. It also checks the RPC chain when the node is reachable. A warm start can continue temporarily from its pinned identity if the initial chain-identifier query fails, but the input reader verifies the chain again on its first successful connection.

After startup, the process runs:

- the HTTP and WebSocket server;
- the inclusion lane that orders and executes accepted transactions;
- the base-layer input reader;
- the batch submitter;
- the danger detector;
- snapshot promotion and cleanup.

## Configure batching and submission

The following `run` settings control when batches close and how the submitter polls and observes them:

| Setting                                                   | Default | Effect                                                                                                                   |
| --------------------------------------------------------- | ------: | ------------------------------------------------------------------------------------------------------------------------ |
| `CARTESI_SEQUENCER_MAX_BATCH_OPEN_SECONDS`                |  `7200` | Forces an open batch to close after two hours even when it has not reached its size target                               |
| `CARTESI_SEQUENCER_BATCH_SUBMITTER_IDLE_POLL_INTERVAL_MS` |  `5000` | Sets the delay before an idle or transiently failing submitter checks again                                              |
| `CARTESI_SEQUENCER_BATCH_SUBMITTER_CONFIRMATION_DEPTH`    |     `2` | Waits for the inclusion confirmation plus two additional confirmations before the submitter considers its watch complete |

A shorter batch-open limit reduces the time a transaction can wait before submission on a quiet application. It also creates smaller batches and can increase base-layer cost per transaction.

The confirmation-depth setting controls the submitter's transaction watcher. Canonical snapshot promotion and input processing still follow the base-layer safe head observed by the input reader.

## Configure protocol timing

Three settings control when the sequencer distrusts its base-layer view or stops before a batch becomes stale:

| Setting                                        | Default | Effect                                                                                               |
| ---------------------------------------------- | ------: | ---------------------------------------------------------------------------------------------------- |
| `CARTESI_SEQUENCER_PREEMPTIVE_MARGIN_BLOCKS`   |   `300` | Reserves this many blocks of recovery runway before the 1,200-block staleness deadline               |
| `CARTESI_SEQUENCER_L1_READ_STALE_AFTER_BLOCKS` |   `600` | Rejects a base-layer safe view whose timestamp is this many assumed blocks old                       |
| `CARTESI_SEQUENCER_SECONDS_PER_BLOCK`          |    `12` | Converts wall-clock delay into estimated missed blocks and sets several polling and timeout cadences |

The danger threshold is:

```text
1200 - CARTESI_SEQUENCER_PREEMPTIVE_MARGIN_BLOCKS
```

The preemptive margin must be greater than zero and lower than `1200`. The read-staleness value must be greater than zero and strictly lower than the resulting danger threshold. Startup rejects an invalid combination.

These settings are shared by `setup` and `run` so the initial sync and live process use the same timing model. `flush-mempool` uses only `SECONDS_PER_BLOCK` to pace confirmation watches and safe-head polling.

The defaults assume approximately twelve-second blocks. Review all three together before deploying on a chain with different timing.

## Configure base-layer RPC behavior

`CARTESI_SEQUENCER_BLOCKCHAIN_HTTP_ENDPOINT` should identify one consistent base-layer node. The threat model assumes the node may fail but does not return a deliberately false view. Avoid a load-balanced endpoint whose replicas can disagree about chain identity, safe-head position, or available logs.

Remote RPC endpoints must use HTTPS. Plain HTTP is accepted automatically for loopback hosts. To use HTTP on a trusted private network, set:

```bash
CARTESI_SEQUENCER_ALLOW_INSECURE_RPC=true
```

This setting permits plaintext transport. Configure it on every command that connects to the base layer. [Production security](./security.md#secure-the-base-layer-rpc-connection) covers authentication, consistency, and deployment controls for the RPC boundary.

`CARTESI_SEQUENCER_LONG_BLOCK_RANGE_ERROR_CODES` is a comma-separated list of provider error codes that cause a failed `eth_getLogs` request to be split into smaller block ranges. The defaults are:

```text
-32005,-32600,-32602,-32616
```

Only matching RPC errors trigger range splitting. A transport timeout or another error code is returned through the normal provider error path.

## Verify startup and readiness

The API listens on `127.0.0.1:3000` by default. Change it with `CARTESI_SEQUENCER_HTTP_ADDR` when the service must accept connections from another interface.

Use these probes:

```bash
curl --fail http://127.0.0.1:3000/livez
curl --fail http://127.0.0.1:3000/readyz
curl --fail http://127.0.0.1:3000/healthz
```

Use `/livez` for process liveness and `/readyz` for traffic routing. `/healthz` returns the readiness condition as JSON. These probes cover runtime availability, not dependency progress or canonical correctness. See the exact response semantics in [HTTP and WebSocket API](../api-reference/api.md#health-endpoints) and the operational limits in [Monitoring and watchdog operation](./monitoring.md#use-the-health-endpoints-correctly).

## Next steps

- Configure the supervisor using [Process supervision and recovery operations](./orchestration.md).
- Protect the deployment using [Production security](./security.md).
- Plan durable storage and backups with [Data, snapshots, and backups](./data-and-state.md).
