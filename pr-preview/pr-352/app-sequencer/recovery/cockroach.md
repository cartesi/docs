> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
title: "Cockroach recovery"
sidebar_label: "Cockroach recovery"
description: "How to rebuild a sequencer from a trusted checkpoint and base-layer history when the local database is lost or cannot be trusted."
---

Cockroach recovery is the repository's name for rebuilding a deployment from a trusted checkpoint after its local database is lost or cannot be trusted.

The procedure does not repair the old database. It creates a fresh data directory, loads application state from the checkpoint, and reconstructs everything that happened after that checkpoint from the base layer.

This is an explicit, operator-run procedure using `setup --recovery`. It is separate from the automatic [preemptive recovery](./preemptive.md) used for an intact database with a failing provisional batch suffix.

## When to use checkpoint recovery

Use this procedure when:

- the data directory is lost or corrupted beyond use;
- canonical divergence causes the sequencer to exit with code `30`;
- a fresh setup detects previous batch-submitter activity and exits with code `40`;
- an incident makes the local batch history untrustworthy.

Do not use it for an ordinary crash, a temporary provider outage, or routine danger-zone recovery. Those cases retain a usable database and follow the normal startup path.

## Required recovery inputs

Prepare all of the following before wiping or replacing any deployment data:

| Input                | Requirement                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Checkpoint directory | A complete archived non-genesis finalized dump produced by this sequencer, containing `state` and `info.toml`                    |
| Checkpoint block `B` | The `promoted_inclusion_block` stored in that checkpoint's `info.toml`                                                           |
| Deployment identity  | The same chain, application address, and batch-submitter address used by the original deployment                                 |
| Submitter key        | The key matching the configured batch-submitter address                                                                          |
| Submitter funds      | Enough base-layer funds to submit every required flush transaction                                                               |
| RPC endpoint         | A consistent endpoint that provides safe-block reads, historical logs, state queries, fee estimation, and transaction submission |
| Compatible binary    | A release that can load the checkpoint's application state and `info.toml` format                                                |
| Fresh data directory | An empty replacement directory that no running sequencer can access                                                              |

Recovery trusts the checkpoint's application state and next batch nonce. Keep the entire checkpoint directory together and do not edit its metadata.

## Run the recovery command

Stop the current sequencer and prevent any other instance from using the submitter key. Then run:

```bash
CARTESI_SEQUENCER_BLOCKCHAIN_HTTP_ENDPOINT=https://your-node.example \
CARTESI_SEQUENCER_BLOCKCHAIN_ID=<chain-id> \
CARTESI_SEQUENCER_APP_ADDRESS=<application-address> \
CARTESI_SEQUENCER_BATCH_SUBMITTER_ADDRESS=<submitter-address> \
CARTESI_SEQUENCER_AUTH_PRIVATE_KEY_FILE=/run/secrets/submitter-key \
  <your-sequencer> setup --recovery \
    --checkpoint-dump-dir /path/to/archived/checkpoint \
    --checkpoint-block <B>
```

Run the command against a freshly prepared data directory. Recovery setup is a one-shot operation and refuses to run over a completed setup.

The command-line checkpoint block must exactly match the `promoted_inclusion_block` recorded in the archived `info.toml`. The current implementation requires the value as an argument but does not compare it with that metadata field. Treat the archived value as authoritative and copy it exactly.

## Recovery data model

The procedure uses six values:

| Symbol | Meaning                                                        | Source                               |
| ------ | -------------------------------------------------------------- | ------------------------------------ |
| **S**  | Trusted application state at the checkpoint                    | The checkpoint's `state` subtree     |
| **A**  | Last safe block whose direct inputs are already reflected in S | Read from the application state      |
| **B**  | Base-layer block where the checkpoint was promoted             | `info.toml` and `--checkpoint-block` |
| **N**  | Next batch nonce recorded at the checkpoint                    | `info.toml`                          |
| **C**  | Safe block where all submitter wallet nonces are resolved      | Returned by the flush                |
| **N'** | Next batch nonce after replaying accepted batches through C    | Computed during recovery             |

The checkpoint must satisfy `A < B`. This leaves a well-defined range of direct inputs that arrived before checkpoint promotion but were not yet represented in the saved application state.

## How reconstruction works

### Discover and pin the deployment

Setup verifies the configured chain ID, discovers the application's `InputBox` and genesis block, and pins the deployment identity in the new database. It refuses a checkpoint block earlier than the `InputBox` genesis block.

### Synchronize base-layer inputs

The input reader loads direct inputs and batch submissions through the current safe head. During recovery setup, accepted-frontier construction is deferred until the rebuilt batch-tree anchor is available.

### Load the checkpoint

Recovery reads:

- the application state **S** from `state`;
- the next batch nonce **N** from `info.toml`;
- the last executed safe block **A** from the application state;
- the operator-supplied checkpoint block **B**.

The command stops if the checkpoint cannot be parsed, the application cannot load its state, or `A >= B`.

### Resolve the submitter wallet

Recovery invokes the [wallet-flush mechanism](../operations/orchestration.md#flush-unresolved-wallet-nonces). The flush returns **C**, the safe block where nonce resolution was observed. Recovery synchronizes again and refuses to continue if the refreshed view is behind C.

An intact runtime database stores the highest wallet nonce the deployment has broadcast. A freshly rebuilt database does not have that watermark. During checkpoint recovery, the flush therefore covers the nonce range visible through the configured provider but cannot prove coverage of a transaction that the provider has forgotten while another network participant still retains it. Use a consistent, well-connected RPC source, preserve the old data directory when it is available, and keep the content-identity alert active after recovery. A previously unseen transaction that later creates a content mismatch causes the sequencer to stop instead of continuing from a false frontier.

### Reconstruct the missing interval

Starting from S and N, recovery processes two non-overlapping ranges:

- **Seed range `(A, B]`:** direct inputs that existed before checkpoint promotion but were not yet executed in S.
- **Replay range `(B, C]`:** all application inputs, including direct inputs and batch submissions, after the checkpoint through the flush boundary.

The scheduler rules classify and apply the replay stream. Accepted batches advance the next expected batch nonce; stale batches, wrong-nonce batches, and flush transactions do not.

### Persist the rebuilt deployment

Recovery writes the reconstructed application state as the new finalized snapshot at block C. It stores the resulting next batch nonce N' as the batch-tree anchor, places the feed cursor after inputs already represented in the rebuilt state, and marks setup complete last.

The next `run` opens its first local batch at N'. Base-layer inputs after C remain pending and are processed normally during catch-up.

## Worked example

Assume the archived checkpoint contains:

- `B = 1,000,000`, the promotion block;
- `N = 500`, so the next batch expected at the checkpoint is batch 500;
- `A = 999,950`, the last safe block reflected in the application state.

Two direct inputs at blocks 999,970 and 999,990 fall in `(A, B]`. They are seeded before replay. After the checkpoint, batches 500, 501, and 502 reach the base layer along with more direct inputs.

The wallet flush completes at `C = 1,000,100`. Recovery then:

1. loads the checkpoint state at N = 500;
2. seeds the two direct inputs in `(999,950, 1,000,000]`;
3. replays all application inputs in `(1,000,000, 1,000,100]`;
4. advances the batch nonce for each batch accepted by the scheduler;
5. produces N' = 503;
6. saves the rebuilt state at C and anchors the new local tree at 503.

Normal operation resumes by creating batch 503. Inputs after C remain available for the ordinary input reader and are not silently skipped.

## Why the resume nonce must be exact

The scheduler expects one specific batch nonce. In the example, batches through 502 were accepted, so the first unused nonce is 503.

- A resume nonce that is too low collides with a nonce already accepted by the scheduler and causes a visible refusal.
- A resume nonce that is too high creates a gap. No accepted batch occupies the missing nonce, so later batches cannot advance the scheduler.

Recovery therefore reads N from the sequencer-produced checkpoint and computes N' by replay. Do not guess either value or assemble `info.toml` manually.

## Trust boundary and validation limits

Recovery validates the checkpoint format, application loading, deployment identity, chain ID, block ranges, and the post-flush safe view. It does not independently prove that the checkpoint state and next batch nonce are historically correct.

Replaying from genesis would provide that proof, but it would remove the main benefit of checkpoint recovery. Operational safety therefore depends on archiving genuine promoted checkpoints, protecting them from modification, recording their provenance, and testing the restore procedure.

See [Snapshots and checkpoints](./snapshots.md) for the archive requirements.

## Interrupted recovery

Recovery setup writes its completion marker last. If the command stops before that marker is written, the directory is not considered ready for `run`.

Do not resume from a partially rebuilt directory. Preserve logs for diagnosis, remove the incomplete recovery directory, create a fresh one, and run the command again from the same verified checkpoint. The wallet flush and base-layer replay are designed to be repeated, but partial local recovery state is not accepted as a continuation point.

## Validate the rebuilt deployment

Before reopening public traffic:

1. confirm that recovery setup exits successfully;
2. start `run` with the original deployment identity and submitter key;
3. verify `/livez`, `/readyz`, and the finalized snapshot endpoint;
4. confirm that new transactions can be accepted and batches can reach the base layer;
5. run the independent watchdog comparison;
6. reconcile clients and indexers from a known feed offset.

Preserve the old data directory and incident evidence until the rebuilt deployment has been independently verified.

## Next steps

- Create valid archives using [Snapshots and checkpoints](./snapshots.md).
- Review automatic repair in [Preemptive recovery](./preemptive.md).
- Prepare supervision and startup policy with [Process supervision and recovery operations](../operations/orchestration.md).
