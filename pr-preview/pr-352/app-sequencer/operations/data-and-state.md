> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Data, snapshots, and backups"
sidebar_label: "Data and backups"
description: "What the sequencer stores, how it protects committed state, and how to back up a deployment and archive recovery checkpoints."
---

The sequencer stores its complete local history under `CARTESI_SEQUENCER_DATA_DIR`, which defaults to the relative path `sequencer-data`.

Use an explicit path on durable storage in production. Losing the directory removes the local batch history, snapshots, and wallet-nonce watermark needed for an ordinary restart and preemptive recovery.

## Data directory layout

A configured data directory contains:

```text
<data-dir>/
  sequencer.db
  sequencer.db-wal       present while SQLite uses its write-ahead log
  sequencer.db-shm       present while SQLite uses shared memory
  dumps/
    <opaque-dump-id>/
      info.toml
      state              application-defined snapshot data
```

The contents under `state` are defined by the application's snapshot implementation. It can be a file or a larger application-specific structure even though the reference application uses a state file.

Dump directory names are opaque. Use their metadata and the database references to determine their lifecycle instead of inferring meaning from a directory name.

## State stored by the sequencer

The SQLite database records:

- the pinned chain, application, `InputBox`, genesis block, and batch-submitter identities;
- whether setup completed;
- the open and sealed batch tree, including invalidated branches;
- frames, user operations, direct inputs, and the ordered feed;
- the latest observed base-layer safe head and accepted-batch frontier;
- pending and finalized snapshot references;
- the highest submitter wallet nonce covered before broadcast;
- recovery and divergence state.

The dump directories hold application state at selected transaction offsets. The database links each usable dump to its pending or finalized lifecycle state.

## Durability and crash guarantees

Production writer connections use SQLite WAL mode with `synchronous=FULL`. Each committed database transaction is synchronized before the sequencer externalizes work that depends on it. This supports two important guarantees:

- an HTTP success response follows the commit that stores the accepted operation;
- the submitter wallet-nonce watermark is committed before a corresponding base-layer transaction is broadcast.

Snapshot creation crosses the filesystem and database. The sequencer first creates and synchronizes the dump and its `info.toml`, then commits the database row that references it. A failed database commit can leave an unreferenced directory, but it cannot leave a committed row pointing to an incomplete dump through the normal creation path.

Startup repairs interrupted snapshot housekeeping before loading application state. [Snapshots and checkpoints](../recovery/snapshots.md#how-snapshots-are-created-and-promoted) describes the creation, promotion, and cleanup sequence. These guarantees also depend on the application's snapshot methods honoring their durability contract and on storage that preserves acknowledged writes.

## Snapshot lifecycle and automatic cleanup

The live data directory retains the snapshots needed for current operation and garbage-collects superseded dumps. It is not a historical checkpoint archive.

[Snapshots and checkpoints](../recovery/snapshots.md) is the authoritative guide to pending and finalized lifecycle states, promotion, retention, and recovery suitability.

## Back up the live deployment

The safest complete backup is a coordinated copy while the sequencer is stopped:

1. stop `run` and wait for the process to exit;
2. prevent another instance or maintenance command from starting;
3. copy the entire data directory, including SQLite sidecar files and `dumps/`;
4. verify the copy and record the deployment identity and backup time;
5. restart the sequencer from the original directory.

Do not copy only `sequencer.db` while the process is running. Committed pages may still reside in the WAL, and snapshot files can change lifecycle while the copy is in progress.

If downtime is unacceptable, use a backup procedure that coordinates a SQLite-consistent database snapshot with the referenced dump directories. A generic recursive live filesystem copy does not provide that coordination.

A complete backup is useful for preserving the current deployment. Restoring it later is safe only if the deployment has not produced additional base-layer activity since that point.

## Preserve recovery checkpoints

Checkpoint recovery uses a complete promoted dump directory, not a live data-directory backup or an HTTP snapshot response. Archive the application state and its original `info.toml` together before live cleanup removes them.

Follow the single coordinated procedure in [Archive a complete recovery checkpoint](../recovery/snapshots.md#archive-a-complete-recovery-checkpoint). It also defines archive validation, retention, and the warning about `/finalized_state` responses.

## Restore boundaries

Do not restore an old data-directory backup over a deployment that continued submitting batches. Its local history and wallet-nonce watermark can lag the base layer and cause identity, setup, or divergence failures.

When the original directory is lost or no longer trusted, rebuild a fresh directory from an archived checkpoint using [Cockroach recovery](../recovery/cockroach.md).

Do not edit `info.toml`, synthesize a checkpoint, or combine application state and metadata from different dumps. Recovery trusts these inputs and cannot reconstruct a missing next batch nonce safely.

## Capacity planning

Monitor both database and snapshot storage. Transaction, frame, batch, direct-input, and feed records accumulate with activity. Snapshot garbage collection limits superseded dumps, but the current pending and finalized application snapshots can still be large.

Alert before the volume approaches exhaustion. A full disk can prevent transaction commits, batch closure, snapshot creation, or recovery metadata updates and can stop the process.

Also monitor inode availability when an application's dump format creates many files.

## Next steps

- Configure the directory with [Configure, set up, and run the sequencer](./setup-and-running.md).
- Archive valid recovery inputs using [Snapshots and checkpoints](../recovery/snapshots.md).
- Rebuild a lost deployment with [Cockroach recovery](../recovery/cockroach.md).
