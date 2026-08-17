> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Snapshots and checkpoints"
sidebar_label: "Snapshots and checkpoints"
description: "How snapshots are created and promoted, what the snapshot endpoints return, and how to archive a complete recovery checkpoint."
---

A snapshot is a durable copy of application state at a known position in the sequenced transaction stream. Snapshots support three distinct tasks:

- restarting the inclusion lane without replaying the entire local history;
- initializing an indexer before it follows the live feed;
- rebuilding a deployment from an archived recovery checkpoint.

The same snapshot data participates in each task, but the required lifecycle state and metadata are different.

## Snapshot lifecycle

The sequencer maintains pending and finalized snapshot references in SQLite while storing application dumps on the filesystem.

| Lifecycle state | Created when                                                             | What it represents                                 | Appropriate use                                                                        |
| --------------- | ------------------------------------------------------------------------ | -------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Pending**     | A batch closes                                                           | Application state after provisional sequenced work | Local catch-up and the latest-state endpoint                                           |
| **Finalized**   | The matching batch is observed accepted through the base-layer safe view | The newest promoted application state              | Watchdog comparison, settled indexer initialization, and non-genesis recovery archives |

`Finalized` is the implementation's name for the promoted lifecycle state. It means the batch was accepted in the base-layer safe view used by the sequencer. It does not claim stronger irreversibility than that base-layer observation.

Plain `setup` also creates a genesis snapshot directly in the finalized lifecycle state so every normal startup has an application state to load.

![The snapshot lifecycle begins when a batch closes and the sequencer creates and synchronizes a dump. The dump becomes a pending snapshot, is promoted after the batch is accepted in the safe view, and can then supply application bytes through HTTP or a complete recovery checkpoint containing the state subtree and info.toml.](../images/snapshot-lifecycle.jpg)

## How snapshots are created and promoted

When the inclusion lane closes a batch, it performs the following sequence:

1. creates a new dump directory;
2. writes `info.toml` and the application's state under `state`;
3. synchronizes the dump to storage;
4. seals the batch and records the pending snapshot in one database transaction.

This ordering prevents a committed database row from referring to an incomplete dump through the normal creation path. A failed database transaction may leave an unreferenced directory, which startup cleanup removes.

As the safe input frontier advances, the sequencer observes accepted batch submissions. It promotes the newest applicable pending snapshot and advances the direct-input drain in the same database transaction. The atomic update prevents a crash from promoting a snapshot without advancing the input position that justified it.

## How startup selects a snapshot

The inclusion lane loads the newest pending snapshot when one exists. Otherwise, it loads the finalized snapshot. The same database record supplies both the dump path and the sequenced-feed offset, preventing application state and replay position from being mixed.

Loading a pending snapshot is safe for normal restart because preemptive recovery runs first. If startup invalidates a provisional branch, it clears pending snapshots associated with that branch before the inclusion lane starts.

This internal restart behavior does not make pending snapshots suitable for checkpoint recovery. A rebuild needs a promoted checkpoint whose batch nonce is grounded in the accepted base-layer history.

## Snapshot directory format

Each dump is a directory with two top-level entries:

```text
dumps/<opaque-id>/
  state/
    <application-defined data>
  info.toml
```

The `state` entry is an application-owned subtree. An application may represent it as a file or as a directory containing several files. Operators must treat it as opaque and archive the complete subtree.

The sequencer owns `info.toml`. It contains:

| Field                      | Purpose                                                                   |
| -------------------------- | ------------------------------------------------------------------------- |
| `format_version`           | Identifies the supported checkpoint metadata format                       |
| `next_batch_nonce`         | Batch nonce from which recovery should resume before replay               |
| `l2_tx_index`              | Sequenced-feed position represented by the snapshot                       |
| `promoted_inclusion_block` | Base-layer block where the snapshot entered the finalized lifecycle state |

The promotion block is absent while a snapshot is pending. It is stamped into `info.toml` when the snapshot is promoted and restored from the authoritative database row at startup if a crash interrupted that filesystem update.

## Snapshot HTTP endpoints

The HTTP API can stream the latest promoted state for watchdogs, the latest available state for indexers, and a lightweight promoted-position cursor. Streaming responses lease their dump so garbage collection cannot remove it during transfer.

[Operator endpoints](../api-reference/api.md#operator-endpoints) defines the exact routes, headers, and cache behavior. Keep these endpoints internal according to [Production security](../operations/security.md#separate-public-and-internal-routes).

:::danger Snapshot responses are not recovery checkpoints
The streaming endpoints return only the application's state bytes. They do not return `info.toml` or package the complete dump directory.

An HTTP snapshot can initialize a compatible reader, but it cannot supply the batch nonce and metadata required by `setup --recovery`.
:::

## Why checkpoint recovery requires a finalized snapshot

[Cockroach recovery](./cockroach.md) treats the checkpoint state and its recorded next batch nonce as trusted inputs. A pending snapshot describes an outcome the sequencer expected before the corresponding batch was accepted. That branch can still be invalidated by preemptive recovery.

A promoted checkpoint binds its state to a batch observed accepted through the base-layer safe view and records the promotion block needed to replay the later interval. Use only a complete finalized dump produced by the sequencer. Do not use a pending dump, an HTTP state response, or metadata assembled by hand.

## Archive a complete recovery checkpoint

The sequencer garbage-collects dumps that are no longer referenced. A production deployment therefore needs a separate checkpoint archive.

Use this coordinated procedure:

1. query `GET /finalized_state/inclusion_block` and record the returned inclusion block;
2. stop the sequencer, or use another mechanism that prevents snapshot promotion and garbage collection during the copy;
3. locate the referenced dump whose `info.toml` contains the matching `promoted_inclusion_block`;
4. copy the complete dump directory, including all contents under `state` and the original `info.toml`;
5. parse `info.toml` and confirm its promotion block matches the value observed before the copy;
6. record the chain ID, application address, batch-submitter address, sequencer release, application release, archive time, and checkpoint block;
7. store the archive on independent, access-controlled storage and verify its integrity.

Keep several checkpoint generations. An incident may affect the newest snapshot, so the recovery plan should allow selection of an older known-good checkpoint.

See [Back up the live deployment](../operations/data-and-state.md#back-up-the-live-deployment) for complete data-directory backup guidance.

## Validate checkpoint archives

A successful copy is not enough to prove that an archive can restore a deployment. Regularly test that:

- `info.toml` uses a format supported by the recovery binary;
- the application can load the archived state subtree;
- `next_batch_nonce`, `l2_tx_index`, and `promoted_inclusion_block` are present and plausible;
- the recorded deployment identity matches the intended environment;
- `setup --recovery` can rebuild a non-production data directory from the archive;
- the watchdog confirms the rebuilt state after replay.

Protect checkpoints from unauthorized modification. Recovery does not include an independent historical proof of the state or next batch nonce, so a corrupted but loadable checkpoint can produce an incorrect rebuild.

## Snapshot retention and cleanup

The sequencer retains dumps referenced by pending or finalized snapshot rows and protects active HTTP streams with leases. Superseded, unreferenced, and unleased dumps are eligible for garbage collection after promotion and during startup cleanup.

This automatic cleanup controls local disk use but does not maintain a historical archive. Monitor the data volume, archive checkpoints before they are superseded, and keep recovery copies outside the live data directory.

## Next steps

- Rebuild a deployment with [Cockroach recovery](./cockroach.md).
- Secure the snapshot routes using [Production security](../operations/security.md#separate-public-and-internal-routes).
- Initialize an indexer with [Reading the sequenced feed](../usage/reading-the-feed.md).
