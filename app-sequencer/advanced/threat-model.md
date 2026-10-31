---
title: "Threat model"
sidebar_label: "Threat model"
description: "The assets, trust boundaries, adversarial behavior, environmental assumptions, security controls, and residual risks of the app-specific sequencer."
---

The threat model defines the behavior the sequencer is designed to withstand and the assumptions operators must preserve. A correctness failure is security-relevant because it can change application state, mislead clients, or affect user assets even when no attacker directly steals a key.

## Protected assets

The design protects:

- **Canonical application-state integrity.** Base-layer replay must produce the deterministic state defined by scheduler ordering.
- **Soft-confirmation honesty.** Clients must be able to distinguish provisional acceptance from base-layer settlement and detect recovery invalidation.
- **User operations and direct inputs.** Valid inputs must not be silently lost, duplicated, reordered outside the protocol, or attributed to the wrong sender.
- **Batch-submitter identity and key.** Only the authorized deployment should submit batches from the configured account.
- **Recovery integrity.** Batch nonces, wallet nonces, checkpoints, and accepted-frontier state must not resume from an incorrect position.
- **Feed and snapshot consistency.** Consumer offsets and served application state must correspond to the sequencer state they claim to represent.

Availability is important but subordinate to state integrity. The sequencer stops when continued operation could externalize an internal contradiction.

## Actors and trust boundaries

| Actor or component                 | Trust level                     | Security assumptions and capabilities                                                                          |
| ---------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Base-layer consensus and safe view | Trusted protocol dependency     | Provides ordered blocks and the semantics represented by the RPC `safe` tag                                    |
| `InputBox` contract                | Trusted                         | Authenticates the original sender and assigns application inputs in order                                      |
| Configured RPC endpoint            | Trusted, fail-stop              | May become unavailable, but must not fabricate a consistent false chain, safe head, log set, or contract state |
| Mempool and block builders         | Adversarial                     | May delay, reorder, drop, retain privately, replace, or selectively include transactions                       |
| Public transaction clients         | Untrusted                       | May submit malformed signatures, replayed payloads, invalid nonces, low fees, and application-specific attacks |
| Direct-input senders               | Untrusted                       | May submit arbitrary application payloads through the `InputBox`                                               |
| WebSocket and snapshot consumers   | Untrusted readers               | Cannot directly mutate sequencer state but may create load and receive data exposed by the shared listener     |
| Operator configuration             | Trusted                         | Defines chain identity, endpoints, timing, addresses, storage, and process policy                              |
| Submitter key and host secrets     | Trusted and confidential        | Must remain inaccessible to public clients and unrelated workloads                                             |
| Local host and storage             | Trusted                         | Must enforce access control and preserve synchronized writes                                                   |
| Sequencer and application code     | Trusted for correctness         | Determinism and protocol agreement are preconditions supported by review, tests, and monitoring                |
| External gateway and supervisor    | Trusted operator infrastructure | Enforces exposure policy, rate limits, TLS, restart behavior, and terminal-exit handling                       |

## Adversarial base-layer transaction handling

The mempool and block builders may delay, reorder, replace, retain, or later publish a transaction that one provider no longer reports. The design therefore requires two independent properties: uncertain submitter nonce slots are resolved before a provisional branch is replaced, and accepted batch content matches the local sealed content for the same batch nonce.

[Flush unresolved wallet nonces](../operations/orchestration.md#flush-unresolved-wallet-nonces) defines the first control. [Divergence and the content-identity check](./divergence.md) defines the second and explains why an application-state watchdog remains necessary.

## Untrusted transaction clients

`POST /tx` is a public trust boundary. The sequencer validates:

- request size and encoding;
- the EIP-712 signature and recovered sender;
- the deployment-specific signing domain;
- the sender's application nonce;
- the maximum fee against the current price;
- application-specific transaction rules.

Invalid requests receive a defined HTTP error before entering a batch. The canonical scheduler repeats signature, fee, and application validation when executing batch content because base-layer data cannot be trusted solely because it appears to come from the submitter address.

Infrastructure must still rate-limit the route. Validation does not make unlimited parsing, signature recovery, or application simulation free.

## Untrusted direct-input senders

The `InputBox` authenticates a direct input's sender, but the payload remains untrusted. The application must validate method identifiers, token addresses, lengths, ranges, permissions, and state transitions.

Direct inputs cannot be rejected by the public sequencer API because they bypass it. The canonical application implementation must handle every possible direct payload deterministically without panicking or consuming unbounded resources.

## RPC trust and consistency

The code accepts one configured RPC URL shared across reading, submission, flushing, and recovery. The model assumes responses form one truthful and internally consistent safe view.

The implementation adds several checks:

- chain ID is verified before initial setup and before keyed writes;
- the input reader verifies per-application input indexes are contiguous;
- a contract input-count query at the scanned safe block confirms the log range is complete;
- safe-head movement is persisted monotonically;
- recovery refuses to cascade if its post-flush synchronization is behind the block where the flush observed nonce resolution.

These controls detect wrong-chain configuration and many incomplete or lagging responses. They do not make a Byzantine RPC safe. A provider that fabricates logs and matching contract state consistently is outside the model.

The checks do not make a Byzantine RPC safe. A provider that fabricates mutually consistent logs and contract state is outside the model. [Production security](../operations/security.md#use-one-consistent-rpc-source) defines the deployment controls for preserving this assumption.

## Base-layer reorganization boundary

The input reader follows the RPC endpoint's safe view, not the latest head. Reorganizations that occur before data enters that view are absorbed by the base layer and are not persisted as canonical sequencer inputs.

The design assumes previously safe data will not be reorganized away beyond the base layer's promised semantics. A deep reorganization that invalidates an already processed safe block falls outside the normal recovery model.

The lifecycle state called a finalized snapshot inherits this same boundary. It indicates promotion from the safe view and does not claim absolute irreversibility.

## Self-trust and fail-loud behavior

The sequencer treats its own code and the application as correct protocol participants. Automatic recovery targets crashes, outages, delayed transactions, and provisional batch failure. It does not attempt to repair a malformed self-submission or nondeterministic application by guessing the intended state.

Near-free internal checks remain valuable. Types, database constraints, triggers, assertions, content hashes, and persisted markers stop the process when an impossible state is observed. This is fail-loud enforcement, not a graceful fallback.

See [Cross-module invariants](./invariants.md).

## Environmental assumptions

### Deterministic application execution

The live application, canonical Cartesi machine, checkpoint loader, and watchdog must interpret the same inputs identically. Application state serialization used for watchdog comparison must also be deterministic.

Deploy compatible application and sequencer versions together. A byte-identical batch is not enough if two runtimes execute it differently.

### Block-time estimation

When the provider is unavailable, the sequencer estimates missed blocks using:

```text
elapsed wall-clock seconds / configured seconds per block
```

This assumes the configured average is suitable for the target chain and the host clock does not drift significantly. The estimate is used only as a conservative refusal signal. Startup does not modify recovery state solely from estimated danger; it waits for a usable base-layer view.

### Single active submitter

Only one keyed writer may use the deployment's data directory and submitter account at a time. [Process supervision and recovery operations](../operations/orchestration.md#prevent-overlapping-sequencer-instances) defines the excluded combinations.

### Durable local storage

The crash model assumes storage preserves acknowledged synchronized writes. [Data, snapshots, and backups](../operations/data-and-state.md#durability-and-crash-guarantees) defines the database and filesystem contract.

### Trusted checkpoint archives

Checkpoint recovery trusts the archived application state and next batch nonce. [Snapshots and checkpoints](../recovery/snapshots.md#validate-checkpoint-archives) defines archive validation and its limits.

## In-scope failures and attacks

The design explicitly considers:

- temporary and prolonged RPC outages;
- process crashes at arbitrary runtime points;
- delayed, reordered, dropped, replaced, and resurfacing base-layer transactions;
- base-layer movement before the configured safe view;
- malformed, replayed, incorrectly signed, low-fee, and application-invalid public transactions;
- arbitrary direct-input payloads from authenticated base-layer senders;
- wrong-chain RPC configuration;
- incomplete log ranges and inconsistent post-flush synchronization;
- stale batches, nonce poisoning, and repeated recovery rounds;
- foreign or mismatched accepted batch content;
- local database loss handled through a trusted checkpoint.

## Out-of-scope conditions

The Rust sequencer does not itself provide complete protection against:

- denial of service, rate limiting, and unbounded client traffic;
- a Byzantine RPC endpoint that lies consistently;
- a compromised `InputBox` or base-layer consensus protocol;
- host compromise, submitter-key theft, or malicious operator configuration;
- secret encryption and secrets-manager policy;
- dependency or build-system supply-chain compromise;
- application or sequencer defects as adversarially exploitable behavior;
- storage hardware that loses acknowledged durable writes;
- deep reorganizations of previously safe base-layer data.

These conditions require infrastructure controls, contract assurance, supply-chain security, code review, or incident-specific remediation.

## Residual risks

Important risks remain even when the stated assumptions hold:

- soft confirmations can be revoked during preemptive recovery;
- divergence is detected only after the relevant landing reaches the safe view;
- checkpoint recovery from a fresh database lacks the old wallet-nonce watermark;
- the content-identity check compares batch bytes, not application state;
- snapshot and WebSocket routes have no built-in authentication on the current shared listener;
- model checking covers a bounded subset of recovery and has no mechanical link to the code;
- public validation can still consume resources before rejecting a request.

These are operational design constraints, not reasons to ignore the controls. Document them in client behavior, monitoring, key management, and incident runbooks.

## Security review questions

For each change, ask:

1. Which actor supplies every input to the changed path?
2. Can untrusted data reach a database write, signed transaction, application transition, feed event, or process-control decision?
3. Does the change assume the mempool forgets transactions permanently?
4. Does it rely on a safe head or wallet nonce observed from a different RPC view?
5. Could a crash occur after an external effect but before the corresponding durable record?
6. Does a new fallback hide an invariant violation or create a second source of truth?
7. Can a correctness failure affect assets or confirmations even without direct exploitation?
8. Which recovery, snapshot, divergence, and restart tests demonstrate the intended boundary?

## Next steps

- Apply operational controls from [Production security](../operations/security.md).
- Review failure handling in [Failure modes](../recovery/failure-modes.md).
- Understand the supporting properties in [Cross-module invariants](./invariants.md).
- Review verification scope in [Formal verification](./formal-verification.md).
